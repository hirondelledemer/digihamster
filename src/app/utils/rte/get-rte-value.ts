import { JSONContent } from "@tiptap/react";
import { RteValue } from "./rte-hook";
import { drop, reduce } from "remeda";

interface MentionEntity {
  id: string;
  label: string;
}
export const getRteValue: (json: JSONContent) => RteValue = (json) => {
  const defaultValue = {
    title: "",
    tags: [],
    tasks: [],
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
    getMentionEntity("mention"),
    []
  );

  const projects: MentionEntity[] = reduce(
    json.content,
    getMentionEntity("projectMention"),
    []
  );

  const params: MentionEntity[] = reduce(
    json.content,
    getMentionEntity("paramsMention"),
    []
  );

  const regularTags = tags
    .filter((tag) => tag.label !== "task")
    .map((tag) => tag.id.split(":")[0]);

  const tasks = reduce(
    json.content,
    (acc: string[], curr: JSONContent) => {
      const taskMentionExists = curr.content?.find(
        (val) => val.type === "mention" && val.attrs?.label === "task"
      );
      if (!!taskMentionExists) {
        return [
          ...acc,
          ...(curr.content?.filter((val) => val.type === "text") || []).map(
            (val) => val!.text!
          ),
        ];
      }
      return [...acc];
    },
    []
  ).map((task) => task.trim());

  const titleTextContent = !!json.content[0].content
    ? json.content[0].content![0].text
    : "";

  const textContent = reduce(
    drop<JSONContent>(1)(json.content),
    (acc: string[], curr: JSONContent) => {
      const taskMentionExists = curr.content?.find(
        (val) => val.type === "mention" && val.attrs?.label === "task"
      );
      return [
        ...acc,
        ...(
          curr.content?.filter(
            (val) =>
              val.type !== "projectMention" &&
              val.type !== "paramsMention" &&
              !taskMentionExists
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
    tags: regularTags,
    tasks,
    textContent,
    contentJSON: json,
    projectId: projects[0] ? projects[0].id.split(":")[0] : undefined,
    params: params.map((param) => param.id),
  };
};
