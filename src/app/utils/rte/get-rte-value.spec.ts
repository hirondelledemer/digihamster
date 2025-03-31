import { getRteValue } from "./get-rte-value";

describe("getRteValue", () => {
  it("should return default value", () => {
    const JSON = {};
    expect(getRteValue(JSON)).toStrictEqual({
      contentJSON: [],
      params: [],
      projectId: undefined,
      tags: [],
      tasks: [],
      textContent: "",
      title: "",
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
      tasks: [],
      textContent: "",
      title: "title",
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
      tasks: [],
      textContent: "description",
      title: "title",
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
              type: "mention",
              attrs: {
                id: "678a222ffc21119042d789b7:#364FC7",
                label: "task",
              },
            },
            {
              type: "text",
              text: " task 1",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "mention",
              attrs: {
                id: "678a222ffc21119042d789b7:#364FC7",
                label: "task",
              },
            },
            {
              type: "text",
              text: " task 2",
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
      tasks: ["task 1", "task 2"],
      textContent: "description",
      title: "title",
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
              type: "paramsMention",
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
              type: "paramsMention",
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
      tasks: [],
      textContent: " \n \ndescription",
      title: "title",
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
              type: "projectMention",
              attrs: {
                id: "65b035101ef79da0a5430d9e:#1D4735",
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
      tasks: [],
      textContent: " \n \ndescription",
      title: "title",
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
              type: "mention",
              attrs: {
                id: "65c6a3d738a23c2c6627d071:#ADB5BD",
                label: "aaa",
              },
            },
            {
              type: "text",
              text: " ",
            },
            {
              type: "mention",
              attrs: {
                id: "65c6a43d38a23c2c6627d07c:#FF6B6B",
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
      projectId: undefined,
      tags: ["65c6a3d738a23c2c6627d071", "65c6a43d38a23c2c6627d07c"],
      tasks: [],
      textContent: " \n \ndescription",
      title: "title",
    });
  });
});
