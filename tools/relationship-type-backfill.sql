-- Backfill relationship_type and normalise edge direction.
--
-- ASSUMPTIONS - check these before running:
--   * Postgres, table named `relationships`
--   * columns: id, source_type, source_id, target_type, target_id, relationship_type
-- The API lives in a different repo, so these are inferred from IRelationship.
-- If the table or columns are named differently, fix the names here first.
--
-- Run the sections in order. Sections 0-2 are read-only; stop and look at
-- what they print before running section 3 onward.


-- ===========================================================================
-- 0. BACKUP. Do not skip this.
-- ===========================================================================

CREATE TABLE relationships_backup_20261027 AS SELECT * FROM relationships;

-- to undo everything below:
--   BEGIN;
--   DELETE FROM relationships;
--   INSERT INTO relationships SELECT * FROM relationships_backup_20261027;
--   COMMIT;


-- ===========================================================================
-- 1. The canonical edge table. Mirrors src/app/utils/relationships/edges.ts
--    Keep the two in sync by hand - if you change one, change the other.
-- ===========================================================================

CREATE TEMP TABLE canon (source_type text, target_type text, rel_type text);

INSERT INTO canon (source_type, target_type, rel_type) VALUES
  ('task',     'task',     'blocks'),          -- ambiguous, see section 5
  ('task',     'location', 'at'),
  ('task',     'person',   'includes'),

  ('event',    'event',    'related'),
  ('event',    'task',     'contains'),
  ('event',    'habit',    'occurrence_of'),
  ('event',    'location', 'at'),
  ('event',    'person',   'includes'),

  ('project',  'project',  'blocks'),
  ('project',  'habit',    'contains'),
  ('project',  'location', 'at'),
  ('project',  'person',   'includes'),

  ('habit',    'location', 'at'),
  ('habit',    'person',   'includes'),

  ('journal',  'journal',  'continues'),
  ('journal',  'task',     'during'),
  ('journal',  'event',    'during'),
  ('journal',  'habit',    'during'),
  ('journal',  'location', 'at'),
  ('journal',  'person',   'includes'),

  ('note',     'note',     'related'),
  ('note',     'task',     'annotates'),
  ('note',     'event',    'annotates'),
  ('note',     'project',  'annotates'),
  ('note',     'habit',    'annotates'),
  ('note',     'person',   'annotates'),
  ('note',     'location', 'annotates'),

  ('person',   'person',   'related'),
  ('person',   'location', 'at'),

  ('location', 'location', 'near');


-- ===========================================================================
-- 2. PREVIEW (read-only). What you have, and what each row would become.
-- ===========================================================================

SELECT
  r.source_type,
  r.target_type,
  r.relationship_type AS current_type,
  COUNT(*)            AS rows,
  COALESCE(
    fwd.rel_type,
    rev.rel_type,
    CASE
      WHEN (r.source_type, r.target_type) IN
           (('task','project'),('project','task'),
            ('event','project'),('project','event'))
      THEN '>> DELETE (duplicates the FK)'
      ELSE '>> NO RULE - decide what to do'
    END
  ) AS becomes,
  CASE WHEN fwd.rel_type IS NULL AND rev.rel_type IS NOT NULL
       THEN 'yes' ELSE '' END AS direction_flips
FROM relationships r
LEFT JOIN canon fwd
  ON fwd.source_type = r.source_type AND fwd.target_type = r.target_type
LEFT JOIN canon rev
  ON rev.source_type = r.target_type AND rev.target_type = r.source_type
 AND r.source_type <> r.target_type
GROUP BY r.source_type, r.target_type, r.relationship_type,
         fwd.rel_type, rev.rel_type
ORDER BY COUNT(*) DESC;

-- Anything printing ">> NO RULE" is a pair the table does not cover. Either
-- add it to canon (and to edges.ts), or delete those rows. They will be left
-- as `related` otherwise and will not show in the panel once the UI reads
-- from the table.


-- ===========================================================================
-- 3. Drop the rows that duplicate a foreign key.
--    Tasks and events already carry project_id; a relationship row saying the
--    same thing is a second source of truth.
-- ===========================================================================

BEGIN;

DELETE FROM relationships
WHERE (source_type, target_type) IN (
  ('task','project'), ('project','task'),
  ('event','project'), ('project','event')
);

-- check the count looks like what section 2 predicted, then:
COMMIT;


-- ===========================================================================
-- 4. Normalise direction, then stamp the type.
--    Order matters: flip first, type second.
-- ===========================================================================

BEGIN;

-- 4a. rows stored back to front get swapped into canonical orientation
UPDATE relationships r
SET source_type = r.target_type,
    source_id   = r.target_id,
    target_type = r.source_type,
    target_id   = r.source_id
FROM canon c
WHERE r.source_type <> r.target_type
  AND c.source_type = r.target_type
  AND c.target_type = r.source_type
  AND NOT EXISTS (
    SELECT 1 FROM canon f
    WHERE f.source_type = r.source_type
      AND f.target_type = r.target_type
  );

-- 4b. every pair the table covers gets its verb.
--     task->task is excluded: `blocks` and `follows` are both plausible and
--     only you know which one you meant. Section 5 lists them.
UPDATE relationships r
SET relationship_type = c.rel_type
FROM canon c
WHERE c.source_type = r.source_type
  AND c.target_type = r.target_type
  AND NOT (r.source_type = 'task' AND r.target_type = 'task');

COMMIT;


-- ===========================================================================
-- 5. LEFTOVERS (read-only). The rows that need you, not a rule.
-- ===========================================================================

-- task-to-task: blocks or follows?
SELECT id, source_id, target_id, relationship_type
FROM relationships
WHERE source_type = 'task' AND target_type = 'task'
ORDER BY id;

--   UPDATE relationships SET relationship_type = 'blocks'  WHERE id IN (...);
--   UPDATE relationships SET relationship_type = 'follows' WHERE id IN (...);

-- anything still `related` that should not be
SELECT source_type, target_type, COUNT(*)
FROM relationships
WHERE relationship_type = 'related'
  AND (source_type, target_type) NOT IN (
    ('event','event'), ('note','note'), ('person','person')
  )
GROUP BY 1, 2
ORDER BY 3 DESC;


-- ===========================================================================
-- 6. AFTER. Once this has run clean:
--    * isOccurrence({ includeLegacy: false }) becomes correct - the legacy
--      habit/event-as-`related` fallback in relationship-types.ts can go
--    * the backend's default for new rows should stop being `related`;
--      the client sends the type from canonicalEdge() now
--    * drop relationships_backup_20261027 when you are happy
-- ===========================================================================
