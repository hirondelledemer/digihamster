import { MENTION_KEYS } from "./constants";
import { getRteValue } from "./get-rte-value";

describe("getRteValue", () => {
  it("should return default value", () => {
    const JSON = {};
    expect(getRteValue(JSON)).toStrictEqual({
      contentJSON: [],
      params: [],
      projectId: undefined,
      tags: [],
      habits: [],
      tasks: [],
      textContent: "",
      title: "",
      locations: [],
    });
  });

  it("should return only title", () => {
    const JSON = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "title",
            },
          ],
        },
      ],
    };

    expect(getRteValue(JSON)).toStrictEqual({
      contentJSON: JSON,
      params: [],
      projectId: undefined,
      tags: [],
      habits: [],
      tasks: [],
      textContent: "",
      title: "title",
      locations: [],
    });
  });

  it("should return title with description", () => {
    const JSON = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "title",
            },
          ],
        },
        {
          type: "paragraph",
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "description",
            },
          ],
        },
      ],
    };

    expect(getRteValue(JSON)).toStrictEqual({
      contentJSON: JSON,
      params: [],
      projectId: undefined,
      tags: [],
      habits: [],
      tasks: [],
      textContent: "description",
      title: "title",
      locations: [],
    });
  });

  it("should return title, description and tasks", () => {
    const JSON = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "title",
            },
          ],
        },
        {
          type: "paragraph",
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "description",
            },
          ],
        },

        {
          type: "paragraph",
          content: [
            {
              type: MENTION_KEYS.task,
              attrs: {
                id: "1",
                label: "task 1",
              },
            },
            {
              type: "text",
              text: " ",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: MENTION_KEYS.task,
              attrs: {
                id: "2",
                label: "task 2",
              },
            },
            {
              type: "text",
              text: " ",
            },
          ],
        },
      ],
    };

    expect(getRteValue(JSON)).toStrictEqual({
      contentJSON: JSON,
      params: [],
      projectId: undefined,
      tags: [],
      habits: [],
      tasks: ["1", "2"],
      textContent: "description\n \n ",
      title: "title",
      locations: [],
    });
  });

  it("should return title, description and habits", () => {
    const JSON = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "title",
            },
          ],
        },
        {
          type: "paragraph",
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "description",
            },
          ],
        },

        {
          type: "paragraph",
          content: [
            {
              type: MENTION_KEYS.habit,
              attrs: {
                id: "1",
                label: "habit 1",
              },
            },
            {
              type: "text",
              text: " ",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: MENTION_KEYS.habit,
              attrs: {
                id: "2",
                label: "habit 2",
              },
            },
            {
              type: "text",
              text: " ",
            },
          ],
        },
      ],
    };

    expect(getRteValue(JSON)).toStrictEqual({
      contentJSON: JSON,
      params: [],
      projectId: undefined,
      tags: [],
      tasks: [],
      habits: ["1", "2"],
      textContent: "description\n \n ",
      title: "title",
      locations: [],
    });
  });

  it("should return title, description and params", () => {
    const JSON = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "title",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: MENTION_KEYS.param,
              attrs: {
                id: "active",
                label: "active",
              },
            },
            {
              type: "text",
              text: " ",
            },
            {
              type: MENTION_KEYS.param,
              attrs: {
                id: "today",
                label: "today",
              },
            },
            {
              type: "text",
              text: " ",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "description",
            },
          ],
        },
      ],
    };

    expect(getRteValue(JSON)).toStrictEqual({
      contentJSON: JSON,
      params: ["active", "today"],
      projectId: undefined,
      tags: [],
      habits: [],
      tasks: [],
      textContent: " \n \ndescription",
      title: "title",
      locations: [],
    });
  });

  it("should return title, description and project", () => {
    const JSON = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "title",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: MENTION_KEYS.project,
              attrs: {
                id: "65b035101ef79da0a5430d9e",
                label: "new project",
              },
            },
            {
              type: "text",
              text: " ",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: " \ndescription",
            },
          ],
        },
      ],
    };

    expect(getRteValue(JSON)).toStrictEqual({
      contentJSON: JSON,
      params: [],
      projectId: "65b035101ef79da0a5430d9e",
      tags: [],
      habits: [],
      tasks: [],
      textContent: " \n \ndescription",
      title: "title",
      locations: [],
    });
  });

  it("should return title, description and tags", () => {
    const JSON = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "title",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: MENTION_KEYS.person,
              attrs: {
                id: "65c6a3d738a23c2c6627d071",
                label: "aaa",
              },
            },
            {
              type: "text",
              text: " ",
            },
            {
              type: MENTION_KEYS.person,
              attrs: {
                id: "65c6a43d38a23c2c6627d07c",
                label: "mmm",
              },
            },
            {
              type: "text",
              text: " ",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "description",
            },
          ],
        },
      ],
    };

    expect(getRteValue(JSON)).toStrictEqual({
      contentJSON: JSON,
      params: [],
      habits: [],
      projectId: undefined,
      tags: ["65c6a3d738a23c2c6627d071", "65c6a43d38a23c2c6627d07c"],
      tasks: [],
      textContent: " \n \ndescription",
      title: "title",
      locations: [],
    });
  });
});
