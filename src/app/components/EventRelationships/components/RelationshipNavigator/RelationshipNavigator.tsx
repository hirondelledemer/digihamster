import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { FC } from "react";
import { RelationshipNavigatorContextProvider } from "../../navigator-context";
import { RelationshipPanel } from "./components/RelationshipPanel";

export interface RelationshipNavigatorProps {
  entityId: number;
  entityType: RelationshipEntityType;
}
export const RelationshipNavigator: FC<RelationshipNavigatorProps> = ({
  entityId,
  entityType,
}) => {
  return (
    <RelationshipNavigatorContextProvider
      key={`${entityType}-${entityId}`}
      initialItem={{ id: entityId, type: entityType }}
    >
      <RelationshipPanel />
    </RelationshipNavigatorContextProvider>
  );
};
