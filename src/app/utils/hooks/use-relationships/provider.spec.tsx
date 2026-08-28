import { render, screen, waitFor } from "@testing-library/react";

import mockAxios from "jest-mock-axios";

import userEvent from "@testing-library/user-event";
import { ToastProvider } from "@/app/components/ui/toast";

import { useRelationshipsState } from "./state-context";
import { RelationshipsContextProvider } from "./provider";
import { useRelationshipsActions } from "./actions-context";
import {
  generateListOfRelationships,
  generateRelationship,
} from "../../mocks/relationship";
import { getRelationshipsPath, RELATIONSHIPS_PATH } from "./api";
import { RelationshipEntityType } from "../../types/relationship";

// relationships carry no title, so the tests render the link itself
const label = (relationship: { source_id: number; target_id: number }) =>
  `${relationship.source_id}->${relationship.target_id}`;

describe("RelationshipsContextProvider", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("should fetch relationships and update the state", async () => {
    const mockData = generateListOfRelationships(3);
    mockAxios.get.mockResolvedValueOnce({ data: mockData });

    const TestComponent = () => {
      const { data, isLoading } = useRelationshipsState();
      return (
        <div>
          {isLoading
            ? "Loading..."
            : data.map((relationship) => (
                <div key={relationship.id}>{label(relationship)}</div>
              ))}
        </div>
      );
    };

    render(
      <RelationshipsContextProvider>
        <TestComponent />
      </RelationshipsContextProvider>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.findByText("0->0")).resolves.toBeInTheDocument(),
    );
    expect(screen.getByText("1->1")).toBeInTheDocument();
    expect(screen.getByText("2->2")).toBeInTheDocument();
    expect(mockAxios.get).toHaveBeenCalledWith(RELATIONSHIPS_PATH);
  });

  it("should handle fetch error and update the state", async () => {
    mockAxios.get.mockRejectedValueOnce(new Error("Internal Server Error"));

    const TestComponent = () => {
      const { errorMessage, isLoading } = useRelationshipsState();
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
      <RelationshipsContextProvider>
        <TestComponent />
      </RelationshipsContextProvider>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.findByText(/Error:/)).resolves.toBeInTheDocument(),
    );
    expect(mockAxios.get).toHaveBeenCalledWith(RELATIONSHIPS_PATH);
  });

  it("should create a relationship and update the state", async () => {
    const fields = {
      source_type: RelationshipEntityType.Event,
      source_id: 7,
      target_type: RelationshipEntityType.Journal,
      target_id: 9,
    };
    const created = generateRelationship(42, fields);

    mockAxios.post.mockResolvedValueOnce({ data: created });

    const TestComponent = () => {
      const { data } = useRelationshipsState();
      const { create } = useRelationshipsActions();
      return (
        <div>
          <button onClick={() => create(fields)}>Create Relationship</button>
          <div>
            {data.map((relationship) => (
              <div key={relationship.id}>
                {relationship.id}: {label(relationship)}
              </div>
            ))}
          </div>
        </div>
      );
    };

    render(
      <ToastProvider>
        <RelationshipsContextProvider>
          <TestComponent />
        </RelationshipsContextProvider>
      </ToastProvider>,
    );

    expect(screen.queryByText(/7->9/)).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button"));

    // the id from the response replaces the temporary one
    await waitFor(() =>
      expect(screen.findByText("42: 7->9")).resolves.toBeInTheDocument(),
    );
    expect(mockAxios.post).toHaveBeenCalledWith(RELATIONSHIPS_PATH, fields);
  });

  it("should delete a relationship and update the state", async () => {
    const relationships = generateListOfRelationships(2);

    mockAxios.get.mockResolvedValueOnce({ data: relationships });

    const TestComponent = () => {
      const { data } = useRelationshipsState();
      const { delete: deleteRelationship } = useRelationshipsActions();
      return (
        <div>
          {data.map((relationship) => (
            <div key={relationship.id}>
              <div>{label(relationship)}</div>
              <button onClick={() => deleteRelationship(relationship.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      );
    };

    render(
      <ToastProvider>
        <RelationshipsContextProvider>
          <TestComponent />
        </RelationshipsContextProvider>
      </ToastProvider>,
    );

    await expect(screen.findByText("0->0")).resolves.toBeInTheDocument();
    await expect(screen.findByText("1->1")).resolves.toBeInTheDocument();

    await userEvent.click(screen.getAllByRole("button")[0]);

    await waitFor(() =>
      expect(screen.findByText("1->1")).resolves.toBeInTheDocument(),
    );
    expect(screen.queryByText("0->0")).not.toBeInTheDocument();
    expect(mockAxios.delete).toHaveBeenCalledWith(
      getRelationshipsPath(relationships[0].id),
    );
  });
});
