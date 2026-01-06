# Branch Protection & CI/CD Setup Guide

This guide will help you protect your `main` branch from breaking changes using GitHub's branch protection rules and automated CI/CD checks.

---

## 🛡️ What We've Set Up

### Automated Checks (CI/CD Pipeline)

Every time you push code or create a PR, GitHub automatically runs:

1. **✅ Build Check** - Ensures code compiles without errors
2. **✅ Type Check** - Validates all TypeScript types
3. **✅ Lint Check** - Enforces code quality standards
4. **✅ Security Audit** - Scans for vulnerabilities
5. **✅ Dependency Check** - Verifies package integrity

**Files created:**
- [.github/workflows/ci.yml](.github/workflows/ci.yml) - Main CI/CD pipeline
- [.github/workflows/security-scan.yml](.github/workflows/security-scan.yml) - Security scanning
- [.github/workflows/deploy-preview.yml](.github/workflows/deploy-preview.yml) - PR previews

---

## 📋 Setup Instructions

### Step 1: Push to GitHub

First, push your code to GitHub (if not already done):

```bash
# Initialize git (if needed)
git init
git add .
git commit -m "Initial commit with CI/CD setup"

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/property-portal-pro.git
git branch -M main
git push -u origin main
```

### Step 2: Enable Branch Protection Rules

Once your code is on GitHub, set up branch protection:

#### Via GitHub Web Interface:

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Click **Branches** (left sidebar)
4. Click **Add rule** under "Branch protection rules"
5. Configure the following:

```yaml
Branch name pattern: main

✅ Require a pull request before merging
   ✅ Require approvals: 0 (for solo) or 1+ (for team)
   ✅ Dismiss stale pull request approvals when new commits are pushed
   ⬜ Require review from Code Owners (optional)

✅ Require status checks to pass before merging
   ✅ Require branches to be up to date before merging

   Select these required status checks:
   - ✅ Build & Type Check
   - ✅ Code Quality (ESLint)
   - ✅ Security Audit
   - ✅ Dependency Health Check
   - ✅ All Checks Passed ✓

✅ Require conversation resolution before merging

⬜ Require signed commits (optional, more secure)

✅ Require linear history (enforces rebase/squash)

⬜ Include administrators (if checked, rules apply to you too)

✅ Do not allow bypassing the above settings
```

6. Click **Create** or **Save changes**

#### Via GitHub CLI:

```bash
# Install GitHub CLI if needed
brew install gh

# Login to GitHub
gh auth login

# Enable branch protection
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Build & Type Check","Code Quality (ESLint)","Security Audit","All Checks Passed ✓"]}' \
  --field enforce_admins=false \
  --field required_pull_request_reviews='{"required_approving_review_count":0}' \
  --field restrictions=null \
  --field required_linear_history=true \
  --field allow_force_pushes=false \
  --field allow_deletions=false
```

---

## 🔒 What This Protects Against

| Scenario | Protection | How It Helps |
|----------|------------|--------------|
| **Pushing broken code** | Build check fails | Can't merge if build fails |
| **TypeScript errors** | Type check fails | Catches type errors before production |
| **Code quality issues** | Lint check fails | Enforces consistent code style |
| **Security vulnerabilities** | Security audit fails | Blocks vulnerable dependencies |
| **Outdated dependencies** | Dependency check warns | Alerts about package issues |
| **Direct push to main** | Branch protection | Forces PR workflow |
| **Messy git history** | Linear history requirement | Keeps history clean |

---

## 🚀 Development Workflow with Protection

### Safe Workflow (Recommended)

```bash
# 1. Create feature branch
git checkout main
git pull origin main
git checkout -b feature/my-feature

# 2. Make changes and commit
git add .
git commit -m "Add feature"

# 3. Push to remote (triggers CI checks)
git push -u origin feature/my-feature
```

At this point, **GitHub Actions will automatically run all checks**.

```bash
# 4. Create Pull Request
gh pr create --title "Add my feature" --body "Description"

# Or visit GitHub and click "Create Pull Request"
```

**GitHub will:**
- ✅ Run all CI checks
- ✅ Show status in PR (✓ or ✗)
- ✅ Block merge if any check fails
- ✅ Allow merge only when all checks pass

```bash
# 5. After all checks pass, merge via GitHub UI
# Or use CLI:
gh pr merge --squash --delete-branch

# 6. Update local main
git checkout main
git pull origin main
```

### What Happens When Checks Fail?

If any check fails, you'll see in the PR:

```
❌ Build & Type Check — Failed
✅ Code Quality (ESLint) — Passed
✅ Security Audit — Passed
❌ All Checks Passed ✓ — Failed
```

**You cannot merge until you fix the failures!**

To fix:
```bash
# Fix the code locally
# ... make changes ...

# Commit and push
git add .
git commit -m "Fix build errors"
git push

# GitHub automatically re-runs checks
```

---

## 🎯 CI/CD Check Details

### 1. Build & Type Check

**What it does:**
- Runs `npm run build` (production build)
- Runs `npm run type-check` (TypeScript validation)

**Fails if:**
- Build errors occur
- TypeScript type errors exist
- Missing dependencies

**How to test locally:**
```bash
npm run build
npm run type-check
```

---

### 2. Code Quality (ESLint)

**What it does:**
- Runs `npm run lint`
- Checks code style and best practices

**Fails if:**
- ESLint errors exist
- Code doesn't follow Next.js conventions

**How to test locally:**
```bash
npm run lint

# Auto-fix most issues
npm run lint --fix
```

---

### 3. Security Audit

**What it does:**
- Runs `npm audit`
- Checks for known vulnerabilities

**Fails if:**
- High or critical vulnerabilities in production deps
- Outdated packages with security issues

**How to test locally:**
```bash
npm audit

# Fix automatically
npm audit fix

# Fix with breaking changes (use caution)
npm audit fix --force
```

---

### 4. Dependency Health Check

**What it does:**
- Checks for outdated dependencies
- Verifies `package-lock.json` is in sync

**Fails if:**
- `package-lock.json` is out of date

**How to test locally:**
```bash
npm outdated
npm ci  # Verify lock file is valid
```

---

## 🔧 Customizing CI/CD

### Skip CI on Specific Commits (Documentation Only)

```bash
git commit -m "Update README [skip ci]"
```

### Modify Required Checks

Edit [.github/workflows/ci.yml](.github/workflows/ci.yml):

```yaml
# Add new job
my-custom-check:
  name: My Custom Check
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - run: npm run my-custom-script
```

Then add to branch protection rules in GitHub.

### Change Node.js Version

Edit workflows and update:
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '22'  # Change from 20 to 22
```

---

## 📊 Monitoring CI/CD

### View Check Results

**In GitHub PR:**
- Green checkmark (✓) = Passed
- Red X (✗) = Failed
- Yellow dot (•) = In progress

**Click "Details" to see:**
- Full build logs
- Error messages
- Step-by-step execution

### GitHub Actions Tab

1. Go to repository on GitHub
2. Click **Actions** tab
3. See all workflow runs
4. Click any run for details

### Status Badges

Add to README.md:

```markdown
![CI](https://github.com/YOUR_USERNAME/property-portal-pro/workflows/CI%2FCD%20Pipeline/badge.svg)
![Security](https://github.com/YOUR_USERNAME/property-portal-pro/workflows/Security%20Scan/badge.svg)
```

---

## 🚨 Troubleshooting

### "Required status check is failing"

**Problem:** PR shows failing checks

**Solution:**
1. Click "Details" on failed check
2. Read error message
3. Fix locally
4. Push again

### "This branch has not been deployed"

**Problem:** No deployment preview

**Solution:**
- Normal! Only happens if you set up Vercel
- See deployment section below

### "Cannot merge due to required status checks"

**Problem:** Some checks haven't run

**Solution:**
- Wait for checks to complete
- Re-run failed checks (click "Re-run jobs")
- Ensure branch is up to date

### "Check suite is stale"

**Problem:** Checks are outdated

**Solution:**
```bash
git fetch origin
git rebase origin/main
git push --force-with-lease
```

---

## 🌐 Deployment Setup (Optional)

### Option 1: Vercel (Recommended for Next.js)

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import `property-portal-pro` repository
4. Vercel auto-detects Next.js
5. Click **Deploy**

**Vercel will automatically:**
- Deploy main branch to production
- Deploy PRs to preview URLs
- Run builds on every push

### Option 2: Netlify

1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Click **Deploy**

### Option 3: Manual Deployment

```bash
# Build locally
npm run build

# Start production server
npm start

# Or export static site (if applicable)
npm run build && next export
```

---

## 📈 Best Practices

### ✅ Do:

1. **Always create PRs** - Even for solo projects, good habit
2. **Wait for CI** - Don't merge until all checks pass
3. **Review PR yourself** - Check the diff before merging
4. **Keep main clean** - Only merge working, tested code
5. **Squash commits** - Use squash merge for cleaner history

### ❌ Don't:

1. **Don't bypass protection** - Never force push to main
2. **Don't skip CI** - Let checks run every time
3. **Don't merge red PRs** - Fix failures first
4. **Don't commit secrets** - Use environment variables
5. **Don't ignore warnings** - Address security alerts

---

## 🎓 Understanding the Flow

```
Developer makes changes
        ↓
Commits to feature branch
        ↓
Pushes to GitHub
        ↓
GitHub Actions triggered
        ↓
    CI Checks Run:
    - Build ✓
    - Type Check ✓
    - Lint ✓
    - Security ✓
        ↓
All checks pass?
    ├─ YES → PR can be merged
    └─ NO → PR blocked, fix required
            ↓
        Fix code
            ↓
        Push again
            ↓
        Checks re-run
```

---

## 🔗 Quick Links

- [GitHub Branch Protection Docs](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Next.js CI/CD Guide](https://nextjs.org/docs/deployment)
- [Vercel Deployment](https://vercel.com/docs)

---

## 📝 Summary

You now have **enterprise-grade protection** for your main branch:

✅ **Automated testing** on every push
✅ **Branch protection** prevents direct commits
✅ **Quality gates** ensure code standards
✅ **Security scanning** catches vulnerabilities
✅ **PR workflow** encourages code review

**Result:** Your main branch is always in a deployable state! 🚀
