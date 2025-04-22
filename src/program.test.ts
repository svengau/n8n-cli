import { describe, it, expect, vi, beforeEach } from "vitest";
import { Command } from "commander";
import { got } from "got";
import fsp from "fs/promises";
import { table } from "table";
import { displayData, exportData, program } from "./program.js"; // Adjust path to your file
import { loadConfig } from "./helper.js";

// Mock dependencies
vi.mock("got");
vi.mock("fs/promises");
vi.mock("table");
vi.mock("./helper.js");

describe("n8n CLI", () => {
  let mockProgram: Command;
  const mockConfig = {
    currentDir: "/mocked/path",
    instances: {
      testInstance: {
        url: "https://test.n8n.io",
        token: "test-token",
        output: "./output",
      },
    },
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(loadConfig).mockReturnValue(mockConfig);
    mockProgram = new Command();
  });

  describe("displayData", () => {
    it("should display table when json option is false", () => {
      const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
      const mockData = [{ id: "1", name: "test" }];
      const columns = ["ID", "Name"];
      const fn = (o: any) => [o.id, o.name];

      displayData(mockData, false, columns, fn);

      expect(table).toHaveBeenCalledWith([columns, ["1", "test"]]);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display JSON when json option is true", () => {
      const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
      const mockData = [{ id: "1", name: "test" }];

      displayData(mockData, true, [], () => []);

      expect(consoleSpy).toHaveBeenCalledWith(mockData);
      expect(table).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("exportData", () => {
    it("should export to JSON file when output ends with .json", async () => {
      const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
      const mockData = [{ name: "test-workflow" }];
      vi.mocked(fsp.writeFile).mockResolvedValue(undefined);

      await exportData(mockData, "output.json");

      expect(fsp.writeFile).toHaveBeenCalledWith(
        "output.json",
        JSON.stringify(mockData, null, 2)
      );
      expect(consoleSpy).toHaveBeenCalledWith("Exported output.json");
      consoleSpy.mockRestore();
    });

    it("should export to multiple files when output is a directory", async () => {
      const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
      const mockData = [{ name: "test workflow" }];
      vi.mocked(fsp.mkdir).mockResolvedValue(undefined);
      vi.mocked(fsp.writeFile).mockResolvedValue(undefined);

      await exportData(mockData, "output");

      expect(fsp.mkdir).toHaveBeenCalledWith("output", { recursive: true });
      expect(fsp.writeFile).toHaveBeenCalledWith(
        "output/test_workflow.json",
        JSON.stringify(mockData[0], null, 2)
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "Exported output/test_workflow.json"
      );
      consoleSpy.mockRestore();
    });

    it("should print JSON to console when no output specified", async () => {
      const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
      const mockData = [{ name: "test" }];

      await exportData(mockData, undefined);

      expect(consoleSpy).toHaveBeenCalledWith(
        JSON.stringify(mockData, null, 2)
      );
      expect(fsp.writeFile).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe.skip("list:workflow command", () => {
    it("should list workflows with correct parameters", async () => {
      const mockWorkflows = {
        data: [
          {
            id: "1",
            name: "Test Workflow",
            active: true,
            tags: [{ name: "test" }],
          },
        ],
      };
      vi.mocked(got.get).mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockWorkflows),
      } as any);
      const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});

      // Simulate command execution
      program.parseAsync([
        "node",
        "test",
        "list:workflow",
        "testInstance",
        "--active",
      ]);

      // expect(got.get).toHaveBeenCalledWith(
      //   "https://test.n8n.io/api/v1/workflows",
      //   expect.objectContaining({
      //     searchParams: { active: "true" },
      //   })
      // );
      expect(table).toHaveBeenCalledWith([
        ["ID", "Name", "Active", "Tags"],
        ["1", "Test Workflow", true, "test"],
      ]);
      consoleSpy.mockRestore();
    });

    it.skip("should output JSON when --json option is provided", async () => {
      const mockWorkflows = {
        data: [
          {
            id: "1",
            name: "Test Workflow",
            active: true,
            tags: [{ name: "test" }],
          },
        ],
      };
      vi.mocked(got.get).mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockWorkflows),
      } as any);
      const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});

      await program.parseAsync([
        "node",
        "list:workflow",
        "testInstance",
        "--json",
      ]);

      expect(consoleSpy).toHaveBeenCalledWith(mockWorkflows.data);
      expect(table).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
