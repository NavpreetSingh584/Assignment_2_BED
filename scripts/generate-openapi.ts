import * as path from "path";
import { writeFileSync, mkdirSync } from "fs";
import { execSync } from "child_process";
import { getSpec } from "../src/config/swagger";

const docsDir = path.resolve("docs");
mkdirSync(docsDir, { recursive: true });

const specPath = path.join(docsDir, "openapi.json");
writeFileSync(specPath, JSON.stringify(getSpec(), null, 2));
console.log(" OpenAPI spec generated:", specPath);

try {
  execSync(`npx @redocly/cli build-docs ${specPath} -o ${path.join(docsDir, "index.html")}`, {
    stdio: "inherit",
  });
  console.log("index.html generated successfully in /docs");
} catch (err) {
  console.error(" Failed to generate HTML with Redocly CLI:", err);
}
