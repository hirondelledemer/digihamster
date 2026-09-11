import { render, screen, waitFor } from "@testing-library/react";

import mockAxios from "jest-mock-axios";

import userEvent from "@testing-library/user-event";
import { ToastProvider } from "@/app/components/ui/toast";

import { usePeopleState } from "./state-context";
import { PeopleContextProvider } from "./provider";
import { usePeopleActions } from "./actions-context";
import { generateListOfPeople } from "../../mocks/person";
import { CreatePersonParams, PEOPLE_PATH } from "./api";

describe("PeopleContextProvider", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("should fetch people and update the state", async () => {
    const mockData = generateListOfPeople(3);
    mockAxios.get.mockResolvedValueOnce({ data: mockData });

    const TestComponent = () => {
      const { data, isLoading } = usePeopleState();
      return (
        <div>
          {isLoading
            ? "Loading..."
            : data.map((person) => <div key={person.id}>{person.title}</div>)}
        </div>
      );
    };

    render(
      <PeopleContextProvider>
        <TestComponent />
      </PeopleContextProvider>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.findByText("Person 0")).resolves.toBeInTheDocument(),
    );
    expect(screen.getByText("Person 1")).toBeInTheDocument();
    expect(screen.getByText("Person 2")).toBeInTheDocument();
    expect(mockAxios.get).toHaveBeenCalledWith(PEOPLE_PATH);
  });

  it("should handle fetch error and update the state", async () => {
    mockAxios.get.mockRejectedValueOnce(new Error("Internal Server Error"));

    const TestComponent = () => {
      const { errorMessage, isLoading } = usePeopleState();
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
      <PeopleContextProvider>
        <TestComponent />
      </PeopleContextProvider>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.findByText(/Error:/)).resolves.toBeInTheDocument(),
    );
  });

  it("should create a person and update the state", async () => {
    const mockPerson: CreatePersonParams = {
      title: "new person",
      color: "color1",
    };

    mockAxios.post.mockResolvedValueOnce({ data: [] });

    const TestComponent = () => {
      const { data } = usePeopleState();
      const { create: createPerson } = usePeopleActions();
      return (
        <div>
          <button onClick={() => createPerson(mockPerson)}>
            Create Person
          </button>
          <div>
            {data.map((person) => (
              <div key={person.id}>{person.title}</div>
            ))}
          </div>
        </div>
      );
    };

    render(
      <ToastProvider>
        <PeopleContextProvider>
          <TestComponent />
        </PeopleContextProvider>
      </ToastProvider>,
    );

    expect(screen.queryByText("new person")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(screen.findByText("new person")).resolves.toBeInTheDocument(),
    );
    expect(mockAxios.post).toHaveBeenCalledWith(PEOPLE_PATH, mockPerson);
  });
});
