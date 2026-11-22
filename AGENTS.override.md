# doneReceived · Codex

- Frontend: Expo SDK 56, npm, FSD in `src/`. Keep package-lock.json, StyleSheet and existing theme tokens. Use a local dev build for native modules. Check the relevant [SDK 56 reference](https://docs.expo.dev/versions/v56.0.0/) before changing Expo integration or configuration.
- Use the scripts in package.json for affected checks. Run FSD lint for layer changes. Product docs live in ../doneReceived-obsidian. Read or update the affected notes when behavior or operations change.
- Before reporting a task complete, update the affected project documentation and mark its existing task entry as complete. Record any pending rollout or production verification in the relevant release or operations notes.
- When graphify-out/graph.json exists, begin codebase exploration with a focused `graphify query "<question>" --budget 500`. Use path/explain for relationships and targeted source reads or rg if the result is insufficient. Prefer the wiki index for broad navigation when present. Read the full graph report only for architectural review or when focused navigation is insufficient.
- Honor explicit /graphify requests through the graphify skill. Include the graph-first rule in relevant delegation prompts. Run `graphify update .` after code changes unless that task explicitly excludes graphify. Generated graph diffs are expected.
