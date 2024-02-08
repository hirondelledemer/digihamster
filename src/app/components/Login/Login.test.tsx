import { render, fireEvent, screen, waitFor } from "@/config/utils/test-utils";
import "@testing-library/jest-dom";
import Login from "./Login";
import mockAxios from "jest-mock-axios";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Login", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("renders form", () => {
    render(<Login />);

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  describe("happy path", () => {
    it("sends request", async () => {
      render(<Login />);

      const emailInput = screen.getByRole("textbox", { name: /email/i });
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole("button", { name: /login/i });

      fireEvent.change(emailInput, { target: { value: "test@test.com" } });
      fireEvent.change(passwordInput, { target: { value: "password" } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(mockAxios.post).toHaveBeenCalledWith("/api/users/login", {
          email: "test@test.com",
          password: "password",
        });
      });
    });
  });

  describe("issues with input", () => {
    it("should show email and password errors", async () => {
      render(<Login />);

      const emailInput = screen.getByRole("textbox", { name: /email/i });
      const loginButton = screen.getByRole("button", { name: /login/i });

      fireEvent.change(emailInput, { target: { value: "t" } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        const emailError = screen.getByText(/this is not a valid email\./i);
        const passwordError = screen.getByText(/this is not a valid email\./i);
        expect(emailError).toBeInTheDocument();
        expect(passwordError).toBeInTheDocument();
      });

      expect(mockAxios.post).not.toHaveBeenCalled();
    });

    describe("server returns an error", () => {
      it("should show server error", async () => {
        mockAxios.post.mockRejectedValueOnce({
          response: { data: { error: "server error" } },
        });

        render(<Login />);
        const emailInput = screen.getByRole("textbox", { name: /email/i });
        const passwordInput = screen.getByLabelText(/password/i);
        const loginButton = screen.getByRole("button", { name: /login/i });

        fireEvent.change(emailInput, { target: { value: "test@test.com" } });
        fireEvent.change(passwordInput, { target: { value: "password" } });
        fireEvent.click(loginButton);

        await waitFor(() => {
          const error = screen.getByText("server error");

          expect(mockAxios.post).toHaveBeenCalledWith("/api/users/login", {
            email: "test@test.com",
            password: "password",
          });
          expect(error).toBeInTheDocument();
        });
      });
    });
  });
});
