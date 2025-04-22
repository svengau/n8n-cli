import os from "os";
import path from "path";
import fs from "fs";
import { cosmiconfigSync } from "cosmiconfig";
import dayjs from "dayjs";

export interface N8nConfig {
  currentDir: string;
  instances: Record<
    string,
    {
      url: string;
      token: string;
      output?: string;
    }
  >;
}

export interface CliOptions {
  verbose: boolean;
  active: boolean;
  json: boolean;
}

/**
 * Load n8n configuration
 *
 * @param moduleName
 * @returns
 */
export function loadConfig(moduleName: string) {
  const explorerSync = cosmiconfigSync(moduleName);
  const config = explorerSync.search();
  if (!config) {
    return null;
  }

  return {
    currentDir: process.cwd(),
    ...config.config,
  } as any as N8nConfig;
}
