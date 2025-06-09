import { vi } from "vitest";
import React from "react";
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";

vi.mock("js-yaml", () => ({ load: () => ({}) }));
vi.mock("./src-new/services/dcsClient", () => ({
  fetchManifest: async () => ({}),
  fetchResourceFile: async () => "",
}));

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
});
