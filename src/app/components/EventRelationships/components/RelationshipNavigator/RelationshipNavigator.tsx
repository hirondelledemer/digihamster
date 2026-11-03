import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { FC } from "react";
import { RelationshipNavigatorContextProvider } from "../../navigator-context";
import { RelationshipPanel } from "./components/RelationshipPanel";

export interface RelationshipNavigatorProps {
  entityId: number;
  entityType: RelationshipEntityType;
  relationshipPriority: "primary" | "secondary";
  /** the day this panel is read against - the opening event's, if any */
  day?: Date;
}
export const RelationshipNavigator: FC<RelationshipNavigatorProps> = ({
  entityId,
  entityType,
  relationshipPriority,
  day,
}) => {
  return (
    <div className="flex">
      <RelationshipNavigatorContextProvider
        key={`${entityType}-${entityId}`}
        initialItem={{ id: entityId, type: entityType }}
        day={day}
      >
        <RelationshipPanel relationshipPriority={relationshipPriority} />
      </RelationshipNavigatorContextProvider>
    </div>
  );
};
