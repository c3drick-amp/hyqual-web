import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, test, vi, beforeEach } from "vitest";
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getDoc } from "firebase/firestore";
import "@testing-library/jest-dom/vitest";

import Login from "./Login";
import ProtectedRoute from "../components/ProtectedRoute";

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

  test("blocks non-superadmin users from superadmin routes", async () => {
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ uid: "user-123", email: "farm-owner@example.com" });
      return () => {};
    });
    getDoc.mockResolvedValue({ exists: () => true, data: () => ({ role: "Farm Owner" }) });

    render(
      <MemoryRouter initialEntries={["/superadmin/overview"]}>
        <Routes>
          <Route
            path="/superadmin/overview"
            element={
              <ProtectedRoute allowedRoles={["Superadmin"]}>
                <div>Superadmin Overview</div>
              </ProtectedRoute>
            }
          />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Superadmin Overview")).not.toBeInTheDocument();
  });

  test("blocks pending or archived accounts from protected routes", async () => {
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ uid: "user-456", email: "pending@example.com" });
      return () => {};
    });
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ role: "BFAR Admin", status: "Pending", archived: false }),
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Dashboard</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Login")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });
});
