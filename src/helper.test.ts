import { describe, it, expect, vi } from "vitest";
import * as cosmiconfigSyncModule from "cosmiconfig";

import { loadConfig } from "./helper.js";

// Mock the cosmiconfigSync module
vi.mock("cosmiconfig", () => ({
  cosmiconfigSync: vi.fn(),
}));

describe("loadConfig", () => {
  it("should return null if no config is found", () => {
    // Arrange
    const mockCosmiconfigSync = vi.mocked(
      cosmiconfigSyncModule.cosmiconfigSync
    );
    mockCosmiconfigSync.mockReturnValue({
      search: vi.fn().mockReturnValue(null),
      load: vi.fn(),
      clearLoadCache: vi.fn(),
      clearSearchCache: vi.fn(),
      clearCaches: vi.fn(),
    });
    // Act
    const result = loadConfig("n8n");

    // Assert
    expect(result).toBeNull();
    expect(mockCosmiconfigSync).toHaveBeenCalledWith("n8n");
  });

  it("should return config with currentDir and config data when config is found", () => {
    // Arrange
    const mockConfig = {
      instances: {
        default: {
          url: "https://api.example.com",
          token: "abc123",
          output: "output.json",
        },
      },
    };

    const mockCosmiconfigSync = vi.mocked(
      cosmiconfigSyncModule.cosmiconfigSync
    );
    mockCosmiconfigSync.mockReturnValue({
      search: vi.fn().mockReturnValue({ config: mockConfig }),
      load: vi.fn(),
      clearLoadCache: vi.fn(),
      clearSearchCache: vi.fn(),
      clearCaches: vi.fn(),
    });

    // Mock process.cwd
    const mockCwd = "/mocked/path";
    vi.spyOn(process, "cwd").mockReturnValue(mockCwd);

    // Act
    const result = loadConfig("n8n");

    // Assert
    expect(result).toEqual({
      currentDir: mockCwd,
      ...mockConfig,
    });
    expect(mockCosmiconfigSync).toHaveBeenCalledWith("n8n");
    expect(process.cwd).toHaveBeenCalled();
  });
});
