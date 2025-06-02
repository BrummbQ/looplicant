import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { signIn } from "next-auth/react";
import Page from "./page";
import { AuthError } from "next-auth";

// Mock next-auth signIn
vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("show form", () => {
    render(<Page />);
    expect(
      screen.getByRole("heading", { name: "Login with Email" })
    ).toBeDefined();
  });

  it("submits email and calls signIn", async () => {
    const mockSignIn = signIn as unknown as Mock;
    mockSignIn.mockResolvedValue({ ok: true });

    render(<Page />);

    const emailInput = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /send email/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("nodemailer", {
        email: "test@example.com",
        redirectTo: "/import",
      });
    });
  });

  it("shows error message if AuthError occurs", async () => {
    const mockSignIn = signIn as unknown as Mock;
    mockSignIn.mockRejectedValue(new AuthError("Error"));

    render(<Page />);

    const emailInput = screen.getByRole("textbox");
    fireEvent.change(emailInput, { target: { value: "fail@example.com" } });

    const button = screen.getByRole("button", { name: /send email/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText("Error signing in. Please try again.")
      ).toBeDefined();
    });
  });
});
