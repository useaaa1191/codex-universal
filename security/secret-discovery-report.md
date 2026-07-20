# Secret discovery report

**Scope:** LO-owned GitHub user `useaaa1191` (environment repos plus sibling public repos under the same owner).  
**Primary repo:** https://github.com/useaaa1191/codex-universal  
**Date:** 2026-07-20  
**Method:** gitleaks 8.24.3 (full history), provider-pattern regex, entropy-aware assignment scan, GitHub code search (partial; rate-limited), CI/workflow review.  
**Policy:** No live secret values appear in this report. Matches are identified by source path/commit, type, fingerprint prefix, and confidence only.

## Summary

No confirmed live credentials were found in `codex-universal` (working tree or 49-commit history). Sibling-repo scanning produced two false positives and one high-confidence format match inherited from an upstream template.

| ID | Repo | Secret type | Source | Exposure path | Confidence | Affected asset | Remediation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| F1 | `job-board-aggregator` | linkedin-client-secret (gitleaks) | commit `9c0d4a645e9e`, `data/greenhouse_companies.json:3284` | Public fork, company-slug list | False positive | N/A (string `gympass` company slug) | None; scanner noise |
| F2 | `job-board-aggregator` | sumologic-access-id (gitleaks) | commit `9c0d4a645e9e`, `data/lever_companies.json:3658` | Public fork, company-slug list | False positive | N/A (string `sumo-digital` company slug) | None; scanner noise |
| F3 | `Jobs_Applier_AI_Agent_AIHawk` | LLM API key (`llm_api_key`, `sk-` prefix) | commit `2513bde26046`, `data_folder/secrets.yaml` and `data_folder_example/secrets.yaml` | Public fork; identical value also present on upstream `feder-cr/Jobs_Applier_AI_Agent_AIHawk` | High (format + entropy); live status unverified (no provider probe) | Fork copies of upstream template secrets files | Replace with placeholder in LO fork; gitignore real `data_folder/secrets.yaml`; if this value was ever used as a personal key, rotate at the LLM provider. Upstream copy remains public outside LO control. |
| F4 | `codex-universal` | (none) | gitleaks clean across all refs | N/A | N/A | N/A | Prevention added (CI gitleaks, gitignore, local scan script) |

Fingerprint for F3 (SHA-256 prefix only): `d9f3d0783d3c`. Length 51. Same fingerprint on LO fork and upstream example file.

## Asset notes (non-secret)

- Scaleway Generative project id `ee9e975c-6021-45f0-ad87-e565cadbf5f3` is documented in `evechat` as a public routing identifier. It is not a credential; keep `SCW_SECRET_KEY` out of git (already env-only via `.env.example`).
- Root `.gitignore` previously ignored only `.DS_Store`. Expanded to cover env files, key material, and secrets YAML.
- GitHub Secret Scanning alerts API returned 403 for this token (insufficient permission). Enable secret scanning + push protection on public repos in the GitHub UI when admin access is available.
- GitHub code search hit rate limits after initial queries; local clones + gitleaks remain the authoritative pass for this run.

## Repos scanned

`useaaa1191.github.io`, `ai-website-cloner-template`, `java-genai`, `codex-universal`, `plugins`, `skills`, `job-board-aggregator`, `Jobs_Applier_AI_Agent_AIHawk`, `everything-kiro`.

## Prevention added in this PR

1. `.github/workflows/secret-scan.yml` — gitleaks on push/PR to `main`.
2. `.gitleaks.toml` — default ruleset with narrow template allowlist.
3. Root `.gitignore` — env, PEM/key material, `secrets.yaml`, scan artifacts.
4. `scripts/scan-secrets.sh` — local full-history scan that fails closed without printing values.

## Operator follow-ups

1. On `Jobs_Applier_AI_Agent_AIHawk`: this cloud token cannot push to that fork (HTTP 403). Locally prepare and push: set `llm_api_key` to `YOUR_LLM_API_KEY_HERE` in `data_folder_example/secrets.yaml`, remove `data_folder/secrets.yaml` from git tracking, add it to `.gitignore`, and rewrite history with `git filter-repo --replace-text` so fingerprint `d9f3d0783d3c` is gone from all commits. Then force-push the cleaned branch.
2. Enable GitHub secret scanning and push protection for all public `useaaa1191` repositories.
3. Rotate any personal LLM key that ever matched fingerprint `d9f3d0783d3c` (only if it was issued to LO; otherwise treat as upstream leakage on `feder-cr/Jobs_Applier_AI_Agent_AIHawk`).
4. Keep using `scripts/scan-secrets.sh` (or the CI workflow) before publishing forks that vendor third-party templates.
