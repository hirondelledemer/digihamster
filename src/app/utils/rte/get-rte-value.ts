import { JSONContent } from "@tiptap/react";
import { RteValue } from "./rte-hook";
import { drop, reduce } from "remeda";
import { MENTION_KEYS } from "./constants";

interface MentionEntity {
  id: string;
  label: string;
}
export const getRteValue: (json: JSONContent) => RteValue = (json) => {
  const defaultValue = {
    title: "",
    tags: [],
    locations: [],
    tasks: [],
    habits: [],
    textContent: "",
    contentJSON: [],
    projectId: undefined,
    params: [],
  };

  if (!json || !json.content) {
    return defaultValue;
  }

  const getMentionEntity =
    (type: string) => (acc: MentionEntity[], curr: JSONContent) =>
      [
        ...acc,
        ...(curr.content?.filter((val) => val.type === type) || []).map(
          (mention) => ({
            id: mention!.attrs!.id,
            label: mention!.attrs!.label,
          })
        ),
      ];

  const tags: MentionEntity[] = reduce(
    json.content,
    getMentionEntity(MENTION_KEYS.person),
    []
  );

  const locations: MentionEntity[] = reduce(
    json.content,
    getMentionEntity(MENTION_KEYS.location),
    []
  );

  const projects: MentionEntity[] = reduce(
    json.content,
    getMentionEntity(MENTION_KEYS.project),
    []
  );

  const tasks: MentionEntity[] = reduce(
    json.content,
    getMentionEntity(MENTION_KEYS.task),
    []
  );

  const habits: MentionEntity[] = reduce(
    json.content,
    getMentionEntity(MENTION_KEYS.habit),
    []
  );

  const params: MentionEntity[] = reduce(
    json.content,
    getMentionEntity(MENTION_KEYS.param),
    []
  );

  const titleTextContent = !!json.content[0].content
    ? json.content[0].content![0].text
    : "";

  const textContent = reduce(
    drop<JSONContent>(1)(json.content),
    (acc: string[], curr: JSONContent) => {
      return [
        ...acc,
        ...(
          curr.content?.filter(
            (val) =>
              val.type !== MENTION_KEYS.project &&
              val.type !== MENTION_KEYS.param &&
              val.type !== MENTION_KEYS.task
          ) || []
        ).map((content) => content.text || ""),
      ];
    },
    []
  )
    .filter((text) => !!text)
    .join("\n");

  return {
    title: titleTextContent || "",
    tags: tags.map((tag) => tag.id),
    tasks: tasks.map((param) => param.id),
    locations: locations.map((location) => location.id),
    habits: habits.map((param) => param.id),
    textContent,
    contentJSON: json,
    projectId: projects[0] ? projects[0].id : undefined,
    params: params.map((param) => param.id),
  };
};
