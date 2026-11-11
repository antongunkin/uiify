#!/usr/bin/env node
// `npx @gunkin/uiify init`: copy the skill from this installed package and write the AGENTS.md section.
import { syncAgents } from "../skills/uiify/scripts/sync-agents.mjs";

const USAGE = "usage: npx @gunkin/uiify init [--force]";
const [command, ...flags] = process.argv.slice(2);

if (command !== "init" || flags.some((flag) => flag !== "--force")) {
  console.error(USAGE);
  process.exitCode = 2;
} else {
  process.exitCode = await syncAgents({
    root: process.cwd(),
    write: true,
    install: true,
    force: flags.includes("--force"),
  });
}
