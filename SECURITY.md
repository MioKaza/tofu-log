# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please do not open a public issue. Instead, report it to the maintainers directly.

## Important Note on NPM Authentication

**NEVER commit your `.npmrc` file or any NPM authentication tokens to this repository.**

- **Auth Tokens**: All authentication tokens should be stored in your global `~/.npmrc` file (located in your user home directory), not in the project root.
- **Git Hooks**: We use `.gitignore` to prevent `.npmrc` from being tracked. If you accidentally commit a token, consider it compromised and **rotate it immediately** at [npmjs.com](https://www.npmjs.com/settings/tokens).
