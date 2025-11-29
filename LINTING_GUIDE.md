# Linting & Formatting Guide

This project uses **ESLint** and **Prettier** for code quality and consistency. The setup is fully automated with pre-commit hooks and editor integration.

## 🚀 Quick Start

### 1. Install Recommended VSCode Extensions

Open VSCode and install these extensions (they're already recommended in `.vscode/extensions.json`):

- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier** (`esbenp.prettier-vscode`)
- **Angular Language Service** (`angular.ng-template`)

### 2. Editor Setup

The `.vscode/settings.json` file is already configured to:

- ✅ Format code on save
- ✅ Fix ESLint errors on save
- ✅ Organize imports automatically

**No additional configuration needed!** Just open the project and start coding.

## 🛠️ Available Commands

```bash
# Lint all files
npm run lint

# Lint and auto-fix issues
npm run lint:fix

# Format all files with Prettier
npm run format

# Check if files are formatted correctly
npm run format:check
```

## 🎯 What's Automated

### On Save (in VSCode)

- ✅ Format with Prettier
- ✅ Fix ESLint errors
- ✅ Organize imports

### On Git Commit

- ✅ Lint and format only staged files (via `lint-staged`)
- ✅ Prevent commit if there are linting errors

## 📋 Linting Rules

### TypeScript Files

- ✅ Angular-specific rules (component selectors, directive naming)
- ✅ TypeScript best practices
- ⚠️ Warn on `console.log` (allows `console.warn` and `console.error`)
- ⚠️ Warn on explicit `any` types
- ✅ Enforce `const` over `let` when possible
- ✅ No `var` allowed

### HTML Templates

- ✅ Angular template best practices
- ✅ Accessibility checks (a11y)
- ⚠️ Warn on missing keyboard event handlers

### Code Formatting

- Single quotes for strings
- 2 space indentation
- 100 character line width
- Trailing commas in ES5
- LF line endings

## 🔧 Configuration Files

- `.eslintrc.json` - ESLint configuration
- `.prettierrc.json` - Prettier configuration
- `.editorconfig` - Editor configuration
- `.vscode/settings.json` - VSCode-specific settings
- `angular.json` - Angular CLI lint target
- `.husky/pre-commit` - Git pre-commit hook

## 🚨 Troubleshooting

### Linting not working in VSCode?

1. Reload VSCode window (`Cmd+Shift+P` → "Reload Window")
2. Ensure ESLint extension is installed and enabled
3. Check the Output panel (`View → Output → ESLint`)

### Pre-commit hook not running?

```bash
# Reinstall Husky hooks
npm run prepare
```

### ESLint errors on commit?

This project uses **ESLint v8** (not v9) for compatibility with Angular ESLint. The `.eslintrc.json` format is fully supported.

### Want to skip pre-commit hook? (Not recommended)

```bash
git commit --no-verify -m "your message"
```

## 🎨 Prettier Integration

Prettier is integrated with ESLint via `eslint-plugin-prettier`. This means:

- ESLint will report Prettier formatting issues
- `npm run lint:fix` will format your code with Prettier
- No conflicts between ESLint and Prettier rules

## 📚 Additional Resources

- [ESLint Rules](https://eslint.org/docs/rules/)
- [Angular ESLint](https://github.com/angular-eslint/angular-eslint)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [Husky Documentation](https://typicode.github.io/husky/)

## ✨ Best Practices

1. **Commit often**: The pre-commit hook only lints staged files, so it's fast
2. **Fix issues immediately**: Don't accumulate linting errors
3. **Use `npm run lint:fix`**: It can auto-fix most issues
4. **Trust the tools**: If Prettier formats it that way, that's the standard
5. **Update rules as needed**: Modify `.eslintrc.json` if team agrees on changes
