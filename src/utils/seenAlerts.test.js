import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getSeenAlertIds, markAlertSeen } from "./seenAlerts";

function createStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
  };
}

describe("seen alert persistence", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createStorage());
    localStorage.setItem("hyqual_user", JSON.stringify({ uid: "admin-one" }));
  });

  afterEach(() => vi.unstubAllGlobals());

  it("stores seen IDs for the active user", () => {
    markAlertSeen("reading-1-temp");
    markAlertSeen("reading-1-temp");

    expect(getSeenAlertIds()).toEqual(["reading-1-temp"]);
  });

  it("keeps seen IDs isolated between users", () => {
    markAlertSeen("alert-one");
    localStorage.setItem("hyqual_user", JSON.stringify({ uid: "admin-two" }));

    expect(getSeenAlertIds()).toEqual([]);
    markAlertSeen("alert-two");
    localStorage.setItem("hyqual_user", JSON.stringify({ uid: "admin-one" }));
    expect(getSeenAlertIds()).toEqual(["alert-one"]);
  });
});