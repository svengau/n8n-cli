import { loadConfig, N8nConfig } from "./helper.js";
import { program } from "./program.js";

const moduleName = "n8n";
const config = loadConfig(moduleName) as N8nConfig;

program.parse(process.argv);
