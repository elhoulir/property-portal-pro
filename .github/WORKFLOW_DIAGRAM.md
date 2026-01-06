# Git Workflow Visual Guide

## 🔄 Recommended Solo Developer Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                         MAIN BRANCH                             │
│                    (Always Deployable)                          │
└───────────────┬─────────────────────────────────┬───────────────┘
                │                                 │
                │ 1. Pull latest                  │ 6. Merge back
                │                                 │
                ↓                                 ↑
        ┌───────────────┐                 ┌───────────────┐
        │  git checkout  │                 │  git merge    │
        │      main      │                 │  feature/xyz  │
        │  git pull      │                 │  git push     │
        └───────┬───────┘                 └───────↑───────┘
                │                                 │
                │ 2. Create branch                │
                │                                 │
                ↓                                 │
        ┌───────────────┐                         │
        │  git checkout  │                         │
        │  -b feature/   │                         │
        │  amazing-thing │                         │
        └───────┬───────┘                         │
                │                                 │
                │ 3. Work & Commit                │
                │                                 │
                ↓                                 │
    ┌─────────────────────┐                       │
    │                     │                       │
    │   FEATURE BRANCH    │                       │
    │                     │                       │
    │  ┌───────────────┐  │                       │
    │  │  Add files    │  │                       │
    │  │  git add .    │  │                       │
    │  └───────┬───────┘  │                       │
    │          │           │                       │
    │          ↓           │                       │
    │  ┌───────────────┐  │                       │
    │  │  Commit       │  │ ← Repeat multiple     │
    │  │  git commit   │  │   times               │
    │  └───────┬───────┘  │                       │
    │          │           │                       │
    └──────────┼───────────┘                       │
               │                                   │
               │ 4. Sync with main                 │
               │    (Optional but recommended)     │
               ↓                                   │
       ┌───────────────┐                           │
       │  git fetch    │                           │
       │  origin       │                           │
       │  git rebase   │                           │
       │  origin/main  │                           │
       └───────┬───────┘                           │
               │                                   │
               │ 5. Push to remote                 │
               │                                   │
               ↓                                   │
       ┌───────────────┐                           │
       │  git push -u  │                           │
       │  origin       │                           │
       │  feature/xyz  │                           │
       └───────┬───────┘                           │
               │                                   │
               └───────────────────────────────────┘
```

---

## 🔀 Merge vs Rebase Comparison

### Using Merge (Your Original Approach)

```
main:     A──B──C──────────M  (M = merge commit)
                 \        /
feature:          D──E──F
```

**Characteristics:**
- Creates merge commit (M)
- Preserves exact history
- More commits in history
- "Diamond" pattern in git graph

### Using Rebase (Recommended)

```
main:     A──B──C
                 \
feature:          D'──E'──F'  (commits replayed on top)
```

**Characteristics:**
- Linear history
- No merge commits
- Cleaner git log
- Looks like work was done sequentially

**After merging to main:**
```
main:     A──B──C──D'──E'──F'  (straight line!)
```

---

## 🎯 Decision Tree: When to Use What

```
Need to combine branches?
        │
        ├─→ Working alone?
        │   └─→ Use REBASE
        │       • Cleaner history
        │       • Easier to understand
        │
        ├─→ Branch is shared with team?
        │   └─→ Use MERGE
        │       • Preserves collaboration
        │       • Safer for shared work
        │
        └─→ On main/master branch?
            └─→ NEVER REBASE
                • Use merge or squash-merge
                • Protects shared history
```

---

## 📊 Workflow States Diagram

```
╔═══════════════════════════════════════════════════════════╗
║                    FEATURE LIFECYCLE                      ║
╚═══════════════════════════════════════════════════════════╝

1. PLANNING
   └─→ Decide on feature
       └─→ Create branch from main

2. DEVELOPMENT
   ├─→ Write code
   ├─→ Commit frequently (small commits)
   ├─→ Test locally (npm run dev)
   └─→ Sync with main regularly (git rebase origin/main)

3. REVIEW (Optional for solo)
   ├─→ Push to remote
   ├─→ Create Pull Request
   └─→ Review code (even if self-review)

4. TESTING
   ├─→ Run build (npm run build)
   ├─→ Check TypeScript (npm run type-check)
   └─→ Manual testing in browser

5. DEPLOYMENT
   ├─→ Merge to main
   ├─→ Push to remote
   └─→ Auto-deploy (if configured)

6. CLEANUP
   ├─→ Delete local branch
   └─→ Delete remote branch
```

---

## 🚨 Common Scenarios Flowchart

### Scenario: Merge Conflict During Rebase

```
git rebase origin/main
        │
        ├─→ Conflict?
        │   │
        │   YES
        │   │
        │   ├─→ 1. Open files in VS Code
        │   ├─→ 2. Resolve conflicts
        │   ├─→ 3. git add <fixed-files>
        │   ├─→ 4. git rebase --continue
        │   └─→ 5. Test: npm run build
        │
        NO
        │
        └─→ Success! Continue working
```

### Scenario: Need to Switch Features Mid-Work

```
Working on feature A
        │
        ├─→ Urgent bug needs fixing
        │
        ├─→ git stash (save work)
        ├─→ git checkout main
        ├─→ git checkout -b fix/urgent-bug
        ├─→ Fix bug
        ├─→ Commit and merge
        ├─→ git checkout feature/feature-a
        └─→ git stash pop (restore work)
```

---

## 🎨 Branch Naming Convention

```
feature/    → New functionality
│           └─ feature/add-dark-mode
│           └─ feature/user-authentication
│
fix/        → Bug fixes
│           └─ fix/login-redirect
│           └─ fix/mobile-menu-overlap
│
refactor/   → Code improvements
│           └─ refactor/optimize-search
│           └─ refactor/component-structure
│
docs/       → Documentation
│           └─ docs/update-readme
│           └─ docs/add-api-guide
│
test/       → Testing additions
│           └─ test/add-component-tests
│           └─ test/integration-suite
│
hotfix/     → Critical production fixes
            └─ hotfix/security-patch
            └─ hotfix/data-loss-bug
```

---

## 🔄 Complete Feature Example

```bash
# DAY 1: Start feature
git checkout main
git pull origin main
git checkout -b feature/export-to-pdf

# Make changes
# ... code ...
git add .
git commit -m "Add PDF export button"
git push -u origin feature/export-to-pdf

# DAY 2: Continue work
git checkout feature/export-to-pdf
# ... more code ...
git add .
git commit -m "Implement PDF generation logic"

# Sync with main (someone else merged changes)
git fetch origin
git rebase origin/main
git push --force-with-lease

# DAY 3: Finish feature
# ... final changes ...
git add .
git commit -m "Add PDF export tests and docs"

# Final sync and push
git fetch origin
git rebase origin/main
npm run build  # Verify everything works
git push --force-with-lease

# Merge to main
git checkout main
git pull origin main
git merge feature/export-to-pdf
git push origin main

# Cleanup
git branch -d feature/export-to-pdf
git push origin --delete feature/export-to-pdf
```

---

## 📈 Commit Frequency Best Practices

```
TOO FEW COMMITS:
├─ "Add entire feature" (500 lines changed)
└─ Problem: Hard to review, hard to revert

JUST RIGHT:
├─ "Add PDF export button component"
├─ "Implement PDF generation utility"
├─ "Add PDF export to PropertyList"
├─ "Style PDF export button"
└─ "Add PDF export documentation"

TOO MANY COMMITS:
├─ "Add button"
├─ "Fix typo"
├─ "Fix another typo"
├─ "Change color"
├─ "Actually change color"
└─ Problem: Noisy history (use squash)
```

**Golden Rule:** Each commit should be a logical unit of work that:
- Compiles and runs without errors
- Does one thing well
- Has a clear, descriptive message
- Could be reverted independently

---

## 🎯 Summary: The Perfect Workflow

```
1. START:   Pull main → Create feature branch
2. WORK:    Code → Commit (often) → Test
3. SYNC:    Fetch → Rebase → Push
4. FINISH:  Build → Merge → Push → Cleanup
```

**Remember:** This workflow is optimized for solo development. Adjust as your team grows!
