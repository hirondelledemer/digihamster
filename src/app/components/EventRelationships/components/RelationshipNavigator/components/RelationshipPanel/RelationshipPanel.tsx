import {
  NavigatorColumn,
  RelationshipNavigatorContext,
} from "@/app/components/EventRelationships/navigator-context";
import { FC, useContext } from "react";
import { NavigatorPath } from "../NavigatorPath/NavigatorPath";
import { CreateRelationshipsForm } from "../../../CreateRelationshipsForm";
import { EntityWithRelationships } from "../EntityWithRelationships";

export const RelationshipPanel: FC = () => {
  const { entities } = useContext(RelationshipNavigatorContext);

  // the stack always holds at least the entity it was opened on
  const activeEntity = entities[entities.length - 1];

  if (!activeEntity) {
    return null;
  }

  return (
    <div>
      <NavigatorPath />
      <div className="mb-4 flex gap-2">
        {entities.map((e, idx) => {
          const isCurrent = idx === entities.length - 1;

          return (
            <NavigatorColumn key={`${e.type}-${e.id}`} index={idx}>
              <div
                // the levels you came through read as stacked rails rather
                // than loose icons, so it is obvious they are not part of the
                // panel
                className={
                  isCurrent ? "grow" : "shrink-0 rounded-md bg-muted/40 p-1"
                }
              >
                <EntityWithRelationships
                  entityId={e.id}
                  entityType={e.type}
                  compact={!isCurrent}
                />
              </div>
            </NavigatorColumn>
          );
        })}
      </div>
      <CreateRelationshipsForm
        entityId={activeEntity.id}
        entityType={activeEntity.type}
      />
    </div>
  );
};
