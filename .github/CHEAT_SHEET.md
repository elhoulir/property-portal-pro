# CI/CD Quick Reference Cheat Sheet

## 🚀 Daily Commands

```bash
# Start development
npm run dev

# Test your build (what CI will run)
npm run build

# Check TypeScript
npm run type-check

# Check code quality
npm run lint

# Interactive git workflow
npm run workflow
```

---

## 🔄 Standard Workflow

```bash
# 1. Update main
git checkout main && git pull origin main

# 2. Create feature branch
git checkout -b feature/my-feature

# 3. Make changes, then commit
git add .
git commit -m "Add feature"

# 4. Sync with main (if needed)
git fetch origin && git rebase origin/main

# 5. Push (pre-push hook runs automatically)
git push -u origin feature/my-feature

# 6. Create PR
gh pr create --title "Add feature" --body "Description"

# 7. Wait for CI checks to pass ✅

# 8. Merge via GitHub UI or:
gh pr merge --squash --delete-branch

# 9. Update local main
git checkout main && git pull origin main
```

---

## 🛡️ What Protects Your Main Branch

| Protection | What It Does | When It Runs |
|------------|--------------|--------------|
| **Pre-push hook** | Runs build locally | Every `git push` |
| **CI/CD pipeline** | Runs all checks | Every push to GitHub |
| **Branch protection** | Blocks merge if checks fail | On PR merge attempt |
| **Dependabot** | Auto-updates dependencies | Weekly |

---

## ✅ CI/CD Checks

### What Runs on Every Push

1. **Build & Type Check** (~2 min)
   - `npm run build`
   - `npm run type-check`

2. **Code Quality** (~1 min)
   - `npm run lint`

3. **Security Audit** (~1 min)
   - `npm audit --production`

4. **Dependency Check** (~30 sec)
   - Verifies package-lock.json

**Total time: ~2-3 minutes** (runs in parallel)

---

## 🔧 Troubleshooting

### Build Fails Locally

```bash
# See what's wrong
npm run build

# Common fixes:
rm -rf .next
npm run build

# Or clean reinstall:
rm -rf node_modules package-lock.json
npm install
npm run build
```

### TypeScript Errors

```bash
# Check errors
npm run type-check

# Or let IDE show them (VS Code)
# Open file, errors will appear
```

### ESLint Errors

```bash
# See errors
npm run lint

# Auto-fix most issues
npm run lint --fix
```

### Security Vulnerabilities

```bash
# Check vulnerabilities
npm audit

# Auto-fix
npm audit fix

# Force fix (may break things)
npm audit fix --force
```

### Pre-push Hook Blocking

```bash
# Fix the build error first
npm run build

# Then push
git push

# Emergency bypass (NOT RECOMMENDED):
git push --no-verify
```

### CI Failing on GitHub

```bash
# Pull latest and rebase
git fetch origin
git rebase origin/main

# Fix conflicts if any
# Then force push
git push --force-with-lease
```

---

## 📊 GitHub Actions

### View CI Results

1. Go to PR on GitHub
2. Scroll to bottom, see checks
3. Click "Details" on any check
4. View full logs

### Re-run Failed Checks

1. In PR, click "Checks" tab
2. Click "Re-run jobs"
3. Wait for completion

### Skip CI (Documentation Only)

```bash
# Add [skip ci] to commit message
git commit -m "Update README [skip ci]"
```

---

## 🌐 Deployment Quick Start

### Vercel (Easiest)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Manual Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 🎯 Branch Protection Setup

### Enable via GitHub UI

1. **Settings** → **Branches** → **Add rule**
2. Branch name: `main`
3. Check:
   - ✅ Require pull request
   - ✅ Require status checks
   - ✅ Require linear history
4. Select checks:
   - Build & Type Check
   - Code Quality (ESLint)
   - Security Audit
   - All Checks Passed ✓
5. **Save**

### Enable via GitHub CLI

```bash
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Build & Type Check","Code Quality (ESLint)","Security Audit","All Checks Passed ✓"]}' \
  --field enforce_admins=false \
  --field required_pull_request_reviews='{"required_approving_review_count":0}' \
  --field required_linear_history=true \
  --field allow_force_pushes=false
```

---

## 📝 Commit Message Format

### Good Examples

```bash
git commit -m "Add search filter component"
git commit -m "Fix login redirect bug"
git commit -m "Update dependencies to latest versions"
git commit -m "Refactor property card for better performance"
```

### Bad Examples

```bash
git commit -m "stuff"              # Too vague
git commit -m "updates"            # No context
git commit -m "fix"                # What fix?
git commit -m "WIP"                # Not descriptive
```

### Format

```
<verb> <what you did>

Examples:
- Add [feature]
- Fix [bug]
- Update [component]
- Refactor [code]
- Remove [unused code]
```

---

## 🔍 Useful Git Commands

```bash
# See what changed
git status
git diff

# See recent commits
git log --oneline -10

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git reset --hard origin/main

# Stash changes temporarily
git stash
git stash pop

# See all branches
git branch -a

# Delete local branch
git branch -d feature/old-feature

# Delete remote branch
git push origin --delete feature/old-feature

# Update branch with main
git fetch origin
git rebase origin/main
```

---

## 🎯 File Locations

### Workflows
- `.github/workflows/ci.yml` - Main CI/CD
- `.github/workflows/security-scan.yml` - Security
- `.github/workflows/deploy-preview.yml` - Previews

### Documentation
- `.github/WORKFLOW.md` - Full workflow guide
- `.github/BRANCH_PROTECTION.md` - Setup guide
- `.github/QUICK_START.md` - Getting started
- `.github/CI_CD_SUMMARY.md` - CI/CD overview
- `.github/CHEAT_SHEET.md` - This file

### Hooks
- `.git/hooks/pre-push` - Local build check

### Config
- `.github/dependabot.yml` - Auto updates
- `package.json` - Scripts and dependencies
- `tsconfig.json` - TypeScript config
- `next.config.js` - Next.js config

---

## 📞 Quick Help

### "How do I..."

**...test if my code will pass CI?**
```bash
npm run build
npm run type-check
npm run lint
```

**...skip a specific file from linting?**
Add to `.eslintignore`

**...see why CI failed?**
PR → Checks → Details → View logs

**...force merge without checks?**
Don't. Fix the checks instead.

**...update dependencies safely?**
```bash
npm outdated          # See what's outdated
npm update           # Update minor versions
npm audit fix        # Fix vulnerabilities
```

**...clean up old branches?**
```bash
npm run workflow     # Choose option 7
# Or manually:
git branch --merged | grep -v main | xargs git branch -d
```

---

## 🎓 Learn More

- [Full Workflow Guide](.github/WORKFLOW.md)
- [Branch Protection Setup](.github/BRANCH_PROTECTION.md)
- [CI/CD Details](.github/CI_CD_SUMMARY.md)
- [Quick Start](.github/QUICK_START.md)

---

**Print this and keep it handy! 📄**
