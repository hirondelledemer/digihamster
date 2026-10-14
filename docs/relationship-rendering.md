# Transitive relationships

> Status: design note, nothing built yet except the two hand-rolled cases
> described below. Written while working on the relationship navigator.

Some edges are not destinations. You never actually wanted to look at the
location — you wanted to know what you could do while you were there. The
panel should see through nodes like that instead of making you click into
them.

## It is three patterns, not one

They look alike from the outside and need different machinery.

| | example | what the panel does | lives in |
| --- | --- | --- | --- |
| **Conduit** | `event → location → task/habit` | show the node, nest what is beyond it | render policy |
| **Proxy** | `project → its next task` | replace the node with a representative child | render policy |
| **Continuation** | `journal → journal` | fold the target into the source's content | `relationship_type` |

## Why conduit and proxy must not go on the edge

They are **context-dependent**. A location reached from an event is a conduit:
the question is "what can I do here". A location you opened directly is the
subject, and its tasks are its content.

Same row in the table, same fact, different rendering — so "is transitive"
cannot be a property of the edge. Storing it there would force two different
rows for one fact, and then they would disagree.

The code already reflects this: `RelatedLocation` only ever renders a location
as *somebody else's neighbour*. A location you navigate to goes through
`EntityWithRelationships` instead. The context split is structural already.

**Continuation is the opposite.** "This entry continues that one" is true from
every angle — from the event, from the journal, from a search. That is a fact
about the data, not about the viewer, so it belongs on the edge as
`relationship_type: "continues"`.

So: the answer to "can I do something with `relationship_type` now" is yes for
continuation, no for the other two.

## Both render patterns already exist, hand-rolled

- **Conduit** — `RelatedLocation`, non-compact branch: a card whose
  `CardContent` maps its own relationships back through `RelatedEntity`. The
  location card wraps its children, so you can see where they came from.
- **Proxy** — `RelatedProject`, non-compact branch: renders
  `<TaskCard task={useFirstTaskForTheProject(id)} />` and nothing else. The
  project title is dropped entirely, so a task appears in the panel with no
  indication which project produced it. See *provenance* below.

Two instances is not yet a pattern. Worth generalising on the third.

## What will bite

**Cycles.** Transitive expansion needs a visited set, a depth cap, or both.
There is no one-step self-cycle today because `ALLOWED_TYPES[Location]` does
not contain `Location`, but `project → task → location → project` is already
reachable. A depth cap of 2 is the cheapest guard and probably enough.

**Fan-out.** Expanding through a location with 40 tasks drops 40 rows into the
event panel. This is the same unbounded-list problem as a weekly habit's
occurrences, except transitivity multiplies it. Every hop needs its own budget
— "top 3 and a count", not the whole list.

**Provenance.** An item that arrived through a hop has to show the hop, or it
reads as if it were attached directly. `RelatedLocation` gets this right by
nesting inside the location card. `RelatedProject` gets it wrong. Whatever
replaces them should make the hop visible by construction rather than by each
component remembering.

**Delete at depth.** The trash button on a nested item removes the edge that
produced that component — so from an event you can delete a `task ↔ location`
edge you only half see. Probably the right target, but it deserves a different
affordance, or a confirm, once items can be two hops away.

**Do not merge continuation text.** The tempting shortcut is appending the new
thoughts into the first entry and deleting the second. That destroys "you came
back to this three times", which is exactly the material the commentary
character needs. Keep both rows, join them with `continues`, stitch them at
render time. Same rule as everywhere else: facts overwrite, history
accumulates.

## Suggested order

1. **Nothing for conduit/proxy yet.** They work where they are. Generalise when
   a third case shows up and the shape is obvious.
2. **`continues` is worth doing sooner**, because it is the only one with a
   cost for waiting: every journal re-read in the meantime creates a sibling
   entry that will need untangling later. The rest can be added at leisure
   because they are pure presentation over data that is already correct.
3. **When generalising**, the shape is a policy table keyed by
   `(viewing context type, target type) → conduit | proxy | inline | link`,
   sitting beside `ALLOWED_TYPES` in `utils/relationships/display-rules.ts`.
   Those two tables probably want to become one: "what to show here" and "how
   to show it" are the same decision made twice.

## Worked example: a thing that is in two places

"Computer" will not sit still under home or work, because it is not a place.
**A place is singular — you are in exactly one. A resource is plural — you have
several to hand.** Computer is the second kind: a context in the GTD sense,
not a location.

It does not need a new entity type. Let locations relate to locations:

```
computer --available_at--> home
computer --available_at--> work
task     --related-->      computer
```

From an event at home the panel walks `home → computer → task`, which is the
conduit pattern above with one more hop. `ALLOWED_TYPES[Location]` needs to
include `Location` for it to render.

The payoff is that one set of computer tasks surfaces at both places without
being duplicated or re-linked.

Two caveats:

- Location-to-location now carries two meanings — containment ("the kitchen is
  in the house") and availability ("the computer is at work"). That is a second
  real use for `relationship_type`, after `occurrence_of`.
- This models the *capability*, not the hardware. If "that file is on the work
  computer" ever matters, they have to become two entities.

## Days as entities

Referring to a day — `/n check #tomorrow if this still holds`, `/j #yesterday
they said...` — is worth more than a parser trick. Make `Day` an entity type
and a **day page** falls out: open a day, see its events, journals, notes and
habit logs. That is the answer to wanting to look back over a week; reflection
becomes walking days.

**A day is the only entity type that cannot dangle.** `target_id: 20261014,
target_type: "day"` needs no row, no table and no lifecycle, because dates
always exist. In a polymorphic edge table where orphans are the inherent
weakness, days are immune. `YYYYMMDD` as an integer sorts correctly and fits
`target_id: number` as it is.

Three calls that matter:

1. **Resolve `#tomorrow` when the line is written**, never store the word. A
   relative reference silently changes meaning every day afterwards.
2. **The day page is a union, not a list of edges.** Events already carry
   `start_at` and habit logs carry `log_date`, so the page is
   *derived-by-date* ∪ *explicitly linked*. Writing an `event → day` edge for
   every event would double the edge count to store something already known.
3. **For `/j #yesterday during /e work ...`, link the event only.** The day
   follows from `event.start_at` and the union picks it up.

### Tokens should narrow what comes after them

The most useful part of this is not the day itself:

> **A token earlier in the line narrows the candidates for the ones after it.**

With `#yesterday` already in the line, `/e` offers yesterday's events, `/h`
offers habits logged yesterday, and `/at home` followed by `/t` puts tasks
linked to home first. The line becomes a query that narrows as it is typed
rather than a row of independent global lookups.

It is cheap: the suggestion query takes the line's already-parsed tokens as
filter context, and `parseRelationshipInput` already produces exactly that
shape. `MENTION_BUCKETS` gains `dayMention: "days"`, and mention ids already
carry extra data (`12:#f97316`), so a date in one is no stretch.

### Not weeks or months

A week is a range over days. A second way of saying the same thing will drift
from the first.

## Open questions

- Does a conduit keep its own card, or vanish and leave only its children?
  Location suggests keep, project suggests vanish. May genuinely be per-type.
- Is continuation transitive? With `j1 → j2 → j3`, does `j3` fold into `j2` or
  into `j1`? Flattening the whole chain to its root is probably what reading it
  back wants.
- Does the compact icon rail traverse as well, or stop at one hop as it does
  now?
- Does a day page show what *happened* that day, what was *planned* for it, or
  both in one list? They read very differently looking backwards versus
  forwards.
