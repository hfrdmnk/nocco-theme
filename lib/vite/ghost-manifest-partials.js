import fs from "fs";
import path from "path";

/**
 * Vite Plugin: ghost-manifest-partials
 *
 * Generates Ghost-compatible Handlebars partials from Vite's manifest.json.
 * See https://vite.dev/guide/backend-integration.html
 *
 * Why:
 * ----
 * Ghost can't parse Vite's manifest.json at runtime, so this plugin produces
 * static partials you can include in your theme (`vite_assets/head.hbs`,
 * `vite_assets/foot.hbs`), ensuring the correct cache-busted files are loaded.
 *
 * Behavior:
 * ---------
 * - Reads the generated manifest.json after `vite build`.
 * - Iterates over all JS entrypoints (skips CSS-only chunks).
 * - Writes:
 *   - partials/vite_assets/head.hbs -> preload + stylesheet tags for <head>
 *   - partials/vite_assets/foot.hbs -> <script type="module"> tags for <body>
 */
export default function ghostManifestPartials(
  manifestPath,
  outputHeadPath,
  outputFootPath,
) {
  return {
    name: "vite-plugin-ghost-manifest-partials",
    apply: "build",
    enforce: "post",
    writeBundle(options, bundle) {
      // Find the manifest in the bundle
      const manifestFileName = path.basename(manifestPath);
      const manifestEntry = bundle[manifestFileName];

      if (!manifestEntry || manifestEntry.type !== 'asset') {
        console.warn(`⚠ Manifest not found in bundle: ${manifestFileName}`);
        return;
      }

      const manifest = JSON.parse(manifestEntry.source);

      let outputHead =
        "{{!-- This file is generated during a vite build. Do not edit. --}}\n";
      let outputFoot =
        "{{!-- This file is generated during a vite build. Do not edit. --}}\n";

      for (const [, entryData] of Object.entries(manifest)) {
        if (!entryData.file.endsWith(".js")) continue;

        // preload script
        outputHead += `<link rel="preload" as="script" href="{{asset "built/${entryData.file}"}}">\n`;

        // stylesheet
        if (entryData.css) {
          entryData.css.forEach((css) => {
            outputHead += `<link rel="stylesheet" href="{{asset "built/${css}"}}">\n`;
          });
        }

        // load script at end of body
        outputFoot += `<script type="module" src="{{asset "built/${entryData.file}"}}"></script>\n`;
      }

      fs.writeFileSync(outputHeadPath, outputHead, "utf8");
      fs.writeFileSync(outputFootPath, outputFoot, "utf8");

      console.log(`✓ wrote ${outputHeadPath}`);
      console.log(`✓ wrote ${outputFootPath}`);
    },
  };
}
