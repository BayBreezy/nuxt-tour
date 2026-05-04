import { spawnSync } from "node:child_process";
import { rm } from "node:fs/promises";
import { resolve } from "node:path";

const rootDir = process.cwd();
const dryRun = process.argv.includes("--dry-run");

const workspaceDirs = ["docs"].map((dir) => resolve(rootDir, dir));
const workspaceTargets = [".data", ".nuxt", ".output", "node_modules"];
const rootTargets = ["node_modules"];
const lockfiles = [
  "bun.lockb",
  "bun.lock",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "npm-shrinkwrap.json",
];

const pathsToRemove = [
  ...rootTargets.map((target) => resolve(rootDir, target)),
  ...workspaceDirs.flatMap((workspaceDir) =>
    workspaceTargets.map((target) => resolve(workspaceDir, target))
  ),
  ...lockfiles.flatMap((lockfile) => [
    resolve(rootDir, lockfile),
    ...workspaceDirs.map((workspaceDir) => resolve(workspaceDir, lockfile)),
  ]),
  ...workspaceTargets.map((target) => resolve(rootDir, target)),
];

const uniquePaths = [...new Set(pathsToRemove)];

console.log(
  dryRun ? "Dry run. Planned removals:" : "Removing generated files, dependencies, and lockfiles:"
);

for (const target of uniquePaths) {
  console.log(`- ${target.replace(`${rootDir}/`, "")}`);

  if (!dryRun) {
    await rm(target, {
      force: true,
      recursive: true,
    });
  }
}

if (dryRun) {
  process.exit(0);
}

const install = spawnSync("bun", ["install"], {
  cwd: rootDir,
  stdio: "inherit",
});

if (install.error) {
  console.error(install.error.message);
  process.exit(1);
}

if (install.status !== 0) {
  process.exit(install.status ?? 1);
}

const installDocs = spawnSync("bun", ["install"], {
  cwd: resolve(rootDir, "docs"),
  stdio: "inherit",
});

if (installDocs.error) {
  console.error(installDocs.error.message);
  process.exit(1);
}

if (installDocs.status !== 0) {
  process.exit(installDocs.status ?? 1);
}
