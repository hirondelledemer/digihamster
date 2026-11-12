import { render, screen, waitFor } from "@testing-library/react";

import mockAxios from "jest-mock-axios";

import userEvent from "@testing-library/user-event";
import { ToastProvider } from "@/app/components/ui/toast";

import { useAttachmentsState } from "./state-context";
import { AttachmentsContextProvider } from "./provider";
import { useAttachmentsActions } from "./actions-context";
import { ATTACHMENTS_PATH } from "./api";
import { generateListOfAttachments } from "../../mocks/attachment";

describe("AttachmentsContextProvider", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("should fetch attachments and update the state", async () => {
    const mockData = generateListOfAttachments(3);
    mockAxios.get.mockResolvedValueOnce({ data: mockData });

    const TestComponent = () => {
      const { data, isLoading } = useAttachmentsState();
      return (
        <div>
          {isLoading
            ? "Loading..."
            : data.map((attachment) => (
                <div key={attachment.id}>{attachment.file_name}</div>
              ))}
        </div>
      );
    };

    render(
      <AttachmentsContextProvider>
        <TestComponent />
      </AttachmentsContextProvider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.findByText("Attachment 0")).resolves.toBeInTheDocument()
    );
    expect(screen.getByText("Attachment 1")).toBeInTheDocument();
    expect(screen.getByText("Attachment 2")).toBeInTheDocument();
    expect(mockAxios.get).toHaveBeenCalledWith(ATTACHMENTS_PATH);
  });

  it("should handle fetch error and update the state", async () => {
    mockAxios.get.mockRejectedValueOnce(new Error("Internal Server Error"));

    const TestComponent = () => {
      const { errorMessage, isLoading } = useAttachmentsState();
      return (
        <div>
          {isLoading ? (
            "Loading..."
          ) : (
            <div>Error: {errorMessage?.toString()}</div>
          )}
        </div>
      );
    };

    render(
      <AttachmentsContextProvider>
        <TestComponent />
      </AttachmentsContextProvider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.findByText(/Error:/)).resolves.toBeInTheDocument()
    );
  });

  it("should show the file optimistically while the upload is in flight", async () => {
    const file = new File(["contents"], "notes.pdf", {
      type: "application/pdf",
    });

    mockAxios.post.mockResolvedValueOnce({ data: [] });

    const TestComponent = () => {
      const { data } = useAttachmentsState();
      const { create: createAttachment } = useAttachmentsActions();
      return (
        <div>
          <button onClick={() => createAttachment({ file })}>Upload</button>
          <div>
            {data.map((attachment) => (
              <div key={attachment.id}>{attachment.file_name}</div>
            ))}
          </div>
        </div>
      );
    };

    render(
      <ToastProvider>
        <AttachmentsContextProvider>
          <TestComponent />
        </AttachmentsContextProvider>
      </ToastProvider>
    );

    expect(screen.queryByText("notes.pdf")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(screen.findByText("notes.pdf")).resolves.toBeInTheDocument()
    );

    const [path, body, config] = mockAxios.post.mock.calls[0];
    expect(path).toBe(ATTACHMENTS_PATH);
    expect(body).toBeInstanceOf(FormData);
    expect((body as FormData).get("file")).toBe(file);
    expect(config).toEqual({
      headers: { "Content-Type": "multipart/form-data" },
    });
  });

  it("should drop the optimistic file when the upload fails", async () => {
    const file = new File(["contents"], "broken.pdf", {
      type: "application/pdf",
    });

    mockAxios.post.mockRejectedValueOnce(new Error("Upload failed"));

    const TestComponent = () => {
      const { data } = useAttachmentsState();
      const { create: createAttachment } = useAttachmentsActions();
      return (
        <div>
          <button onClick={() => createAttachment({ file })}>Upload</button>
          <div>
            {data.map((attachment) => (
              <div key={attachment.id}>{attachment.file_name}</div>
            ))}
          </div>
        </div>
      );
    };

    render(
      <ToastProvider>
        <AttachmentsContextProvider>
          <TestComponent />
        </AttachmentsContextProvider>
      </ToastProvider>
    );

    await userEvent.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(screen.queryByText("broken.pdf")).not.toBeInTheDocument()
    );
  });
});
