# Development Workflow Guide

## Solo Developer Workflow (Recommended)

This streamlined workflow is optimized for solo development with minimal overhead while maintaining code quality.

---

## Daily Development Flow

### 1️⃣ Starting a New Feature

```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch (use descriptive names)
git checkout -b feature/add-export-functionality
# or
git checkout -b fix/property-card-mobile-layout
# or
git checkout -b refactor/search-optimization
```

**Branch naming convention:**
- `feature/` - New functionality
- `fix/` - Bug fixes
- `refactor/` - Code improvements
- `docs/` - Documentation updates
- `test/` - Test additions/fixes

---

### 2️⃣ Making Changes

```bash
# Make your changes in the code

# Test locally
npm run dev          # Test in browser
npm run build        # Ensure production build works

# Commit with clear messages
git add .
git commit -m "Add CSV export button to PropertyList component"

# Or commit specific files
git add app/components/PropertyList.tsx
git commit -m "Implement CSV export functionality"
```

**Commit message tips:**
- Start with verb: Add, Fix, Update, Refactor, Remove
- Be specific: "Add dark mode toggle" not "Update UI"
- Keep under 72 characters for the first line

---

### 3️⃣ Syncing with Main (Before Pushing)

If you've been working for a while, sync with main to avoid conflicts:

```bash
# Fetch latest changes
git fetch origin

# Rebase your feature on top of main
git rebase origin/main

# If conflicts occur:
# 1. Fix conflicts in VS Code
# 2. git add <fixed-files>
# 3. git rebase --continue

# Run tests again after rebase
npm run build
```

---

### 4️⃣ Pushing Your Feature

```bash
# First time pushing this branch
git push -u origin feature/add-export-functionality

# Subsequent pushes (if you rebased)
git push --force-with-lease origin feature/add-export-functionality
```

**Note:** `--force-with-lease` is safer than `--force` - it won't overwrite remote changes you don't know about.

---

### 5️⃣ Creating a Pull Request (Optional for Solo)

**Option A: Quick merge (solo development)**
```bash
# If feature is simple and tested
git checkout main
git merge feature/add-export-functionality
git push origin main
git branch -d feature/add-export-functionality
```

**Option B: Use PRs (recommended for review history)**
```bash
# Create PR via GitHub CLI
gh pr create --title "Add CSV export functionality" --body "- Adds export button to PropertyList
- Implements CSV generation
- Includes all property fields
- Tested on Chrome, Safari, Firefox"

# Or open PR in browser
gh pr create --web

# After creating PR, merge via GitHub UI or:
gh pr merge --squash --delete-branch
```

---

### 6️⃣ Cleanup After Merge

```bash
# Switch back to main
git checkout main

# Pull merged changes
git pull origin main

# Delete local feature branch
git branch -d feature/add-export-functionality

# Delete remote branch (if not auto-deleted)
git push origin --delete feature/add-export-functionality
```

---

## Quick Reference Commands

### Setup Git Aliases (Run Once)

Add these to your `~/.gitconfig` for faster workflow:

```bash
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm commit
git config --global alias.st status
git config --global alias.sync '!git fetch origin && git rebase origin/main'
git config --global alias.pushf 'push --force-with-lease'
```

Then use:
```bash
git co main              # Instead of: git checkout main
git br feature/new       # Instead of: git branch feature/new
git sync                 # Instead of: git fetch && git rebase
git pushf                # Instead of: git push --force-with-lease
```

---

## Pre-Push Checklist

Before pushing any feature, verify:

- [ ] Code builds successfully: `npm run build`
- [ ] No TypeScript errors in VS Code
- [ ] Tested in browser (dev mode)
- [ ] No console errors
- [ ] Committed with clear message
- [ ] Synced with latest main: `git sync`

---

## Common Scenarios

### Scenario: Made mistake in last commit

```bash
# Fix the code, then amend the commit
git add .
git commit --amend --no-edit

# Or change the commit message
git commit --amend -m "Better commit message"

# Push (use force if already pushed)
git push --force-with-lease
```

### Scenario: Want to work on different feature mid-way

```bash
# Save current work without committing
git stash

# Switch to different feature
git checkout -b feature/other-task
# ... do work ...
git commit -m "Complete other task"

# Return to original feature
git checkout feature/first-task
git stash pop  # Restore saved changes
```

### Scenario: Need to fix urgent bug on main

```bash
# Stash current feature work
git stash

# Create hotfix from main
git checkout main
git pull
git checkout -b fix/urgent-login-bug

# Fix, test, commit
git add .
git commit -m "Fix login redirect bug"

# Quick merge (urgent)
git checkout main
git merge fix/urgent-login-bug
git push origin main

# Back to feature work
git checkout feature/original-work
git rebase main  # Include the hotfix
git stash pop
```

### Scenario: Want to try something experimental

```bash
# Create experimental branch
git checkout -b experiment/new-ui-approach

# Try things out
# If it works: merge it
# If it doesn't: delete it

git checkout main
git branch -D experiment/new-ui-approach  # Force delete unmerged
```

---

## Advanced: Commit History Management

### Interactive Rebase (Clean up commits before merge)

```bash
# See last 3 commits
git log --oneline -3

# Rebase last 3 commits interactively
git rebase -i HEAD~3

# In editor:
# - pick = keep commit
# - squash = combine with previous
# - reword = change message
# - drop = remove commit

# Save and close editor
# Git will guide you through the process
```

### Example: Squashing multiple commits into one

```bash
# You have:
# - "WIP: starting feature"
# - "Add component"
# - "Fix typo"
# - "Update styling"

# Before pushing, squash into one clean commit:
git rebase -i HEAD~4

# Change to:
# pick WIP: starting feature
# squash Add component
# squash Fix typo
# squash Update styling

# Result: One commit with combined message
```

---

## Git Best Practices

### ✅ Do:
- Commit frequently (easier to revert)
- Write clear commit messages
- Test before committing
- Sync with main regularly
- Use feature branches
- Delete merged branches

### ❌ Don't:
- Commit to main directly (use branches)
- Push broken code
- Use vague messages ("fix stuff", "updates")
- Let branches get stale (sync often)
- Force push to main (protect it)
- Commit node_modules or .env files

---

## GitHub Actions Integration

With the setup we created, GitHub automatically:

✅ Runs security scans on every push
✅ Checks for vulnerabilities in PRs
✅ Runs weekly dependency checks
✅ Validates builds

You can see results in the "Actions" tab on GitHub.

---

## Troubleshooting

### "Merge conflict" during rebase

```bash
# 1. Open conflicted files in VS Code
# 2. Choose "Accept Current" or "Accept Incoming"
# 3. Save files
# 4. Mark as resolved:
git add <fixed-files>
git rebase --continue

# Or abandon rebase:
git rebase --abort
```

### Accidentally committed to main

```bash
# Move the commit to a new branch
git branch feature/accidental-work
git reset --hard origin/main  # Reset main to remote
git checkout feature/accidental-work
```

### Pushed wrong code

```bash
# Revert the commit (creates new commit that undoes it)
git revert HEAD
git push origin main

# Or if immediately noticed and no one pulled:
git reset --hard HEAD~1
git push --force origin main  # Use with caution!
```

---

## Resources

- [GitHub Flow Guide](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Git Rebase vs Merge](https://www.atlassian.com/git/tutorials/merging-vs-rebasing)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## Quick Command Reference

```bash
# Start feature
git checkout main && git pull && git checkout -b feature/my-feature

# Save progress
git add . && git commit -m "Clear message"

# Sync with main
git fetch origin && git rebase origin/main

# Push
git push -u origin feature/my-feature

# Quick merge (solo)
git checkout main && git merge feature/my-feature && git push

# Cleanup
git branch -d feature/my-feature
```

---

**Happy coding! 🚀**
