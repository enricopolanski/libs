import cp from "child_process"
import fs from "fs"
import { EFFECT_APP_LIBS, packages } from "./shared.js"

const pj = (await import(process.cwd() + "/package.json", { assert: { type: "json" } })).default

pj.resolutions = {
  ...pj.resolutions,
  "@effect-app/core": "file:" + EFFECT_APP_LIBS + "/effect-app/libs/packages/core",
  "@effect-app/eslint-codegen-model": "file:" + EFFECT_APP_LIBS + "/effect-app/libs/packages/eslint-codegen-model",
  "effect-app": "file:" + EFFECT_APP_LIBS + "/effect-app/libs/packages/prelude",
  "@effect-app/fluent-extensions": "file:" + EFFECT_APP_LIBS + "/effect-app/libs/packages/fluent-extensions",
  "@effect-app/infra": "file:" + EFFECT_APP_LIBS + "/effect-app/libs/packages/infra",
  "@effect-app/infra-adapters": "file:" + EFFECT_APP_LIBS + "/effect-app/libs/packages/infra-adapters",
  "@effect-app/schema": "file:" + EFFECT_APP_LIBS + "/effect-app/libs/packages/schema",
  "@effect-app/vue": "file:" + EFFECT_APP_LIBS + "/effect-app/libs/packages/vue",
  ...packages.reduce((acc, p) => ({ ...acc, [p]: `file:${EFFECT_APP_LIBS}/node_modules/${p}` }), {})
}

fs.writeFileSync("./package.json", JSON.stringify(pj, null, 2))

cp.execSync("pnpm i", { stdio: "inherit" })
