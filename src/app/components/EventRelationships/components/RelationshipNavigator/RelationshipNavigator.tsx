import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { FC } from "react";
import { RelationshipNavigatorContextProvider } from "../../navigator-context";
import { RelationshipPanel } from "./components/RelationshipPanel";

export interface RelationshipNavigatorProps {
  entityId: number;
  entityType: RelationshipEntityType;
  relationshipPriority: "primary" | "secondary";
}
export const RelationshipNavigator: FC<RelationshipNavigatorProps> = ({
  entityId,
  entityType,
  relationshipPriority,
}) => {
  return (
    <div className="flex">
      <RelationshipNavigatorContextProvider
        key={`${entityType}-${entityId}`}
        initialItem={{ id: entityId, type: entityType }}
      >
        <RelationshipPanel relationshipPriority={relationshipPriority} />
      </RelationshipNavigatorContextProvider>
    </div>
  );
};
