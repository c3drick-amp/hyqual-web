import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi, beforeEach } from "vitest";
import { sendPasswordResetEmail } from "firebase/auth";
import "@testing-library/jest-dom/vitest";

import Login from "./Login";

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn((auth, callback) => {
    callback(null);
    return () => {};
  }),
  signInWithEmailAndPassword: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
}));

vi.mock("../firebase", () => ({
  auth: {},
  db: {},
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Login page", () => {
  test("sends a reset email when the forgot-password flow is submitted", async () => {
    const user = userEvent.setup();
    sendPasswordResetEmail.mockResolvedValue();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /forgot password\?/i }));

    const resetEmailField = screen.getByLabelText(/email address/i);
    await user.type(resetEmailField, "user@example.com");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(sendPasswordResetEmail).toHaveBeenCalledWith({}, "user@example.com");
    expect(
      screen.getByText(/password reset email sent\. check your inbox/i)
    ).toBeInTheDocument();
  });
});
