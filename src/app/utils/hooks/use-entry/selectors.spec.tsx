import { ReactNode } from "react";
import { generateListOfJournalEntries } from "../../mocks/journal-entry";
import { IJournalEntry } from "../../types/journal-entry";
import {
  IRelationship,
  RelationshipEntityType,
} from "../../types/relationship";
import { EntriesStateContext } from "./state-context";
import { useJournalEntriesGroupedByEvents } from "./selectors";
import { renderHook } from "@/config/utils/test-utils";
import { RelationshipsStateContext } from "../use-relationships/state-context";

describe("selecotrs", () => {
  describe("useJournalEntriesGroupedByEvents", () => {
    const wrapper = (
      entries: IJournalEntry[],
      relationships: IRelationship[],
    ) => {
      const JournalEntriesState = ({ children }: { children: ReactNode }) => (
        <RelationshipsStateContext.Provider
          value={{ data: relationships, isLoading: false }}
        >
          <EntriesStateContext.Provider
            value={{ data: entries, isLoading: false }}
          >
            {children}
          </EntriesStateContext.Provider>
        </RelationshipsStateContext.Provider>
      );
      return JournalEntriesState;
    };

    it("should return grouped journal entries by the event", () => {
      const journalEntries = generateListOfJournalEntries(5);
      const relationships: IRelationship[] = [
        {
          id: 1,
          source_id: 1,
          source_type: RelationshipEntityType.Event,
          target_id: journalEntries[0].id,
          target_type: RelationshipEntityType.Journal,
          relationship_type: "related",
        },
        {
          id: 2,
          source_id: 1,
          source_type: RelationshipEntityType.Event,
          target_id: journalEntries[1].id,
          target_type: RelationshipEntityType.Journal,
          relationship_type: "related",
        },
        {
          id: 3,
          source_id: 2,
          source_type: RelationshipEntityType.Event,
          target_id: journalEntries[3].id,
          target_type: RelationshipEntityType.Journal,
          relationship_type: "related",
        },
      ];

      const { result } = renderHook(() => useJournalEntriesGroupedByEvents(), {
        wrapper: wrapper(journalEntries, relationships),
      });

      expect(result.current).toStrictEqual({
        "1": [
          {
            created_at: "1970-01-11T10:10:10Z",
            event_id: 1,
            id: 0,
            json_note: {},
            note: "entry 0 note",
            title: "Entry 0",
          },
          {
            created_at: "1970-01-11T10:10:10Z",
            event_id: 1,
            id: 1,
            json_note: {},
            note: "entry 1 note",
            title: "Entry 1",
          },
        ],
        "2": [
          {
            created_at: "1970-01-11T10:10:10Z",
            event_id: 2,
            id: 3,
            json_note: {},
            note: "entry 3 note",
            title: "Entry 3",
          },
        ],
        loose: [
          {
            created_at: "1970-01-11T10:10:10Z",
            event_id: undefined,
            id: 2,
            json_note: {},
            note: "entry 2 note",
            title: "Entry 2",
          },
          {
            created_at: "1970-01-11T10:10:10Z",
            event_id: undefined,
            id: 4,
            json_note: {},
            note: "entry 4 note",
            title: "Entry 4",
          },
        ],
      });
    });
  });
});
