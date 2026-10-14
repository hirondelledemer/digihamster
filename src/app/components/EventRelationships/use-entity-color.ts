import { useLocationById } from "@/app/utils/hooks/use-location/selectors";
import { usePersonById } from "@/app/utils/hooks/use-people/selectors";
import { useProjectById } from "@/app/utils/hooks/use-projects/selectors";
import { RelationshipEntityType } from "@/app/utils/types/relationship";

/**
 * The colour an entity is already drawn in elsewhere, so the trail matches the
 * cards it came from. Only three types carry one; everything else inherits.
 */
export const useEntityColor = (
  id: number,
  type: RelationshipEntityType
): string | null => {
  const idWhen = (wanted: RelationshipEntityType) =>
    type === wanted ? id : undefined;

  const person = usePersonById(idWhen(RelationshipEntityType.Person));
  const location = useLocationById(idWhen(RelationshipEntityType.Location));
  const project = useProjectById(idWhen(RelationshipEntityType.Project));

  return person?.color || location?.color || project?.color || null;
};
