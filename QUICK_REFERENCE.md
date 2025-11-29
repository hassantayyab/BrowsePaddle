# Linting Quick Reference

## 🎯 What's Automated

### ✅ On Save (VSCode)

- Code is automatically formatted with Prettier
- ESLint errors are auto-fixed
- Imports are organized

### ✅ On Commit

- Only staged files are linted and formatted
- Commit is blocked if there are linting errors

## 🚀 Commands

```bash
# Check for linting issues
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format all files
npm run format

# Check if files are formatted
npm run format:check
```

## 📋 What Was Set Up

### Dependencies Installed

- `@angular-eslint/*` - Angular-specific ESLint rules
- `@typescript-eslint/*` - TypeScript ESLint support
- `eslint` - Core linting engine
- `prettier` - Code formatter
- `eslint-config-prettier` - Disable ESLint rules that conflict with Prettier
- `eslint-plugin-prettier` - Run Prettier as an ESLint rule
- `husky` - Git hooks manager
- `lint-staged` - Run linters on staged files only

### Configuration Files Created

- `.eslintrc.json` - ESLint configuration
- `.prettierrc.json` - Prettier configuration
- `.prettierignore` - Files to ignore for Prettier
- `.eslintignore` - Files to ignore for ESLint
- `.editorconfig` - Editor configuration
- `.vscode/settings.json` - VSCode auto-format on save
- `.vscode/extensions.json` - Recommended extensions
- `.husky/pre-commit` - Pre-commit hook

### Angular CLI Integration

- Added `lint` target to `angular.json`
- Configured to lint TypeScript and HTML files

## 💡 Tips

1. **Trust the tools**: If it formats differently than you expect, that's the standard
2. **Commit often**: Pre-commit hooks only lint staged files, so it's fast
3. **Fix warnings**: They're there to help improve code quality
4. **Skip hooks only when necessary**: `git commit --no-verify` (not recommended)

## 📚 Current Rules

### TypeScript

- Single quotes for strings
- 2 space indentation
- No `var` keyword
- Prefer `const` over `let`
- Warn on `console.log` usage
- Warn on `any` type usage
- Prefix unused variables/args with `_`

### HTML Templates

- Accessibility checks (a11y)
- Angular template best practices
- 100 character line width

### Code Style

- 100 character line width
- Trailing commas in ES5
- Semicolons required
- LF line endings
- Trim trailing whitespace

## 🔧 Customization

To modify linting rules, edit `.eslintrc.json`:

- Set rules to `"error"`, `"warn"`, or `"off"`
- Add new rules from [ESLint](https://eslint.org/docs/rules/) or [Angular ESLint](https://github.com/angular-eslint/angular-eslint)

To modify formatting, edit `.prettierrc.json`:

- See [Prettier options](https://prettier.io/docs/en/options.html)
