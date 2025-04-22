import { Command } from "commander";
import { got } from "got";
import fsp from "fs/promises";
import { table } from "table";

import { loadConfig, CliOptions, N8nConfig } from "./helper.js";
import type { List, User, Workflow } from "./types.js";

const moduleName = "n8n";

export const program = new Command();
const config = loadConfig(moduleName) as N8nConfig;

async function execAction(callback: any) {
  if (!config) {
    console.error(
      `Config not found. Create file .${moduleName}rc.(yaml|js|json)`
    );
    return;
  }

  await callback();
}

program.name(moduleName).description("Manage n8n instances");
// .version(require("../package.json").version);

function getConfig(instance: string) {
  const instanceConfig = config?.instances?.[instance];
  return instanceConfig;
}

async function get<T>(
  instance: string,
  uri: string,
  searchParams?: Record<string, any>
) {
  const instanceConfig = getConfig(instance);
  const response = await got
    .get(instanceConfig?.url + uri, {
      headers: { "X-N8N-API-KEY": instanceConfig?.token },
      searchParams,
      throwHttpErrors: false,
    })
    .json<T>();
  return response;
}

export function displayData<T>(
  data: T[],
  json: boolean,
  columns: string[],
  fn: (o: T) => any[]
) {
  if (json) {
    console.info(data);
  } else {
    console.info(table([columns, ...data.map((o) => fn(o))]));
  }
}

export async function exportData<T extends { name: string }>(
  input: T[],
  output: string | null | undefined
) {
  if (output) {
    if (output.endsWith(".json")) {
      return fsp.writeFile(output, JSON.stringify(input, null, 2)).then(() => {
        console.info(`Exported ${output}`);
      });
    } else {
      await fsp.mkdir(output, { recursive: true });
      await Promise.all(
        input
          .map((data) => ({
            data,
            filename: output + "/" + data.name.replace(/ /gi, "_") + ".json",
          }))
          .map(({ data, filename }) =>
            fsp.writeFile(filename, JSON.stringify(data, null, 2)).then(() => {
              console.info(`Exported ${filename}`);
            })
          )
      );
    }
  } else {
    console.info(JSON.stringify(input, null, 2));
  }
}

program
  .command("list:workflow")
  .argument("<instance>", "Instance to list workflows from")
  .option("--verbose", "Verbose mode")
  .option("--active", "List only active workflows")
  .option("--json", "Output in json")
  .description("List workflows")
  .action((instance: string, options: CliOptions) =>
    execAction(async () => {
      await get<List<Workflow>>(instance, "/api/v1/workflows", {
        ...(options.active ? { active: "true" } : {}),
      })
        .then((r) => r.data)
        .then((d) =>
          displayData(
            d,
            options.json,
            ["ID", "Name", "Active", "Tags"],
            (o) => [
              o.id,
              o.name,
              o.active,
              o.tags.map((t) => t.name).join(", "),
            ]
          )
        );
    })
  );

program
  .command("export:workflow")
  .argument("<instance>", "Instance to export workflows from")
  .option("--output <output>", "Output file or folder")
  .option("--json", "Output in json")
  .description("Export workflows")
  .action((instance: string, options: { output: string }) =>
    execAction(async () => {
      await get<List<Workflow>>(instance, "/api/v1/workflows")
        .then((r) => r.data)
        .then((d) =>
          exportData(d, options.output || getConfig(instance).output)
        );
    })
  );

program
  .command("import:workflow")
  .argument("<instance>", "Instance to import workflows to")
  .option("--verbose", "Verbose mode")
  .option("--active", "List only active workflows")
  .option("--input", "Input file or folder")
  .description("Import workflows")
  .action((instance: string, options: CliOptions) =>
    execAction(async () => {})
  );

program
  .command("list:user")
  .argument("<instance>", "Instance to list users from")
  .option("--verbose", "Verbose mode")
  .option("--json", "Output in json")
  .description("List users")
  .action((instance: string, options: CliOptions) =>
    execAction(async () => {
      const a = await get<List<User>>(instance, "/api/v1/users")
        .then((r) => r.data)
        .then((d) =>
          displayData(
            d,
            options.json,
            ["ID", "Email", "firstName", "LastName", "isPending", "CreatedAt"],
            (o) => [
              o.id,
              o.email,
              o.firstName,
              o.lastName,
              o.isPending,
              o.createdAt,
            ]
          )
        );
    })
  );
