# Quick Start Guide

## 🚀 Getting Started in 30 Seconds

```bash
# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

---

## 📝 Daily Development Workflow

### Method 1: Using the Helper Script (Easiest)

```bash
npm run workflow
```

This opens an interactive menu for all common git operations!

### Method 2: VS Code Tasks (Recommended)

Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux), type "Run Task", and select:

- **🚀 New Feature Branch** - Start a new feature
- **✅ Quick Commit** - Commit your changes
- **🔄 Sync with Main** - Update with latest main
- **📤 Push Feature** - Push to remote
- **🏗️ Build & Test** - Run production build

### Method 3: Manual Commands

```bash
# 1. Start new feature
git checkout main && git pull && git checkout -b feature/my-feature

# 2. Make changes and commit
git add .
git commit -m "Add amazing feature"

# 3. Sync with main
git fetch origin && git rebase origin/main

# 4. Push
git push -u origin feature/my-feature

# 5. Merge (when done)
git checkout main && git merge feature/my-feature && git push
```

---

## 🛡️ Built-in Protection

**Pre-push hook automatically:**
- ✅ Runs production build
- ✅ Checks for TypeScript errors
- ✅ Prevents pushing broken code

**GitHub Actions automatically:**
- ✅ Runs security scans
- ✅ Checks for vulnerabilities
- ✅ Weekly dependency updates via Dependabot

---

## 🎯 Most Common Commands

```bash
npm run dev              # Start development
npm run build            # Build for production
npm run workflow         # Interactive git helper
npm run type-check       # Check TypeScript without building

git status               # See what changed
git log --oneline -5     # See recent commits
```

---

## 📚 Full Workflow Documentation

See [WORKFLOW.md](.github/WORKFLOW.md) for complete documentation including:
- Detailed workflow steps
- Common scenarios and solutions
- Git best practices
- Troubleshooting guide
- Advanced techniques

---

## 💡 Pro Tips

1. **Commit often** - Small commits are easier to review and revert
2. **Use clear messages** - "Add search filter" not "Update stuff"
3. **Test before pushing** - The pre-push hook will catch most issues
4. **Sync regularly** - Run `git fetch && git rebase origin/main` daily
5. **Clean up branches** - Delete merged branches to stay organized

---

## 🆘 Need Help?

**Common issues:**

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git reset --hard origin/main

# See what changed
git diff

# Abort rebase
git rebase --abort

# See full workflow menu
npm run workflow
```

**For more help, see [WORKFLOW.md](.github/WORKFLOW.md)**

---

## 🎨 Project Structure

```
property-portal-pro/
├── app/                    # Next.js app directory
│   ├── components/         # React components
│   ├── context/           # State management
│   ├── data/              # Sample data
│   └── page.tsx           # Main page
├── .github/               # GitHub config
│   ├── workflows/         # CI/CD
│   ├── WORKFLOW.md        # Full documentation
│   └── dependabot.yml     # Auto updates
├── scripts/               # Helper scripts
└── .git/hooks/            # Git hooks
```

---

**Happy coding! 🎉**
