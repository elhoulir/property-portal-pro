#!/bin/bash

# Git Workflow Helper Script
# Quick commands for common git operations

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }

# Show menu
show_menu() {
    echo ""
    echo "================================"
    echo "  Git Workflow Helper"
    echo "================================"
    echo "1) Start new feature"
    echo "2) Sync with main (rebase)"
    echo "3) Quick commit"
    echo "4) Push current branch"
    echo "5) Create Pull Request"
    echo "6) Merge feature to main (quick)"
    echo "7) Cleanup merged branches"
    echo "8) Git status"
    echo "9) Show recent commits"
    echo "0) Exit"
    echo "================================"
}

# Get current branch name
current_branch() {
    git branch --show-current
}

# Check if working directory is clean
is_clean() {
    git diff-index --quiet HEAD --
}

# 1. Start new feature
new_feature() {
    print_info "Creating new feature branch..."
    echo -n "Feature name (e.g., 'add-search-filters'): "
    read feature_name

    git checkout main
    git pull origin main
    git checkout -b "feature/$feature_name"

    print_success "Created and switched to branch: feature/$feature_name"
}

# 2. Sync with main
sync_main() {
    print_info "Syncing $(current_branch) with main..."

    git fetch origin

    if ! is_clean; then
        print_warning "You have uncommitted changes. Stashing them..."
        git stash
        stashed=true
    fi

    git rebase origin/main

    if [ "$stashed" = true ]; then
        print_info "Applying stashed changes..."
        git stash pop
    fi

    print_success "Synced with main successfully!"
}

# 3. Quick commit
quick_commit() {
    print_info "Files to commit:"
    git status --short
    echo ""

    echo -n "Commit message: "
    read commit_msg

    git add .
    git commit -m "$commit_msg"

    print_success "Committed: $commit_msg"
}

# 4. Push current branch
push_branch() {
    branch=$(current_branch)
    print_info "Pushing $branch..."

    # Check if branch exists on remote
    if git ls-remote --exit-code --heads origin "$branch" >/dev/null 2>&1; then
        # Branch exists, might need force push
        echo -n "Branch exists on remote. Force push? (y/N): "
        read force
        if [ "$force" = "y" ] || [ "$force" = "Y" ]; then
            git push --force-with-lease origin "$branch"
        else
            git push origin "$branch"
        fi
    else
        # First push
        git push -u origin "$branch"
    fi

    print_success "Pushed $branch to remote"
}

# 5. Create Pull Request
create_pr() {
    if ! command -v gh &> /dev/null; then
        print_error "GitHub CLI (gh) not installed"
        print_info "Install: brew install gh"
        return 1
    fi

    branch=$(current_branch)
    print_info "Creating PR for $branch..."

    echo -n "PR title: "
    read pr_title

    gh pr create --title "$pr_title" --body "" --web

    print_success "PR created!"
}

# 6. Quick merge to main
quick_merge() {
    branch=$(current_branch)

    if [ "$branch" = "main" ]; then
        print_error "Already on main branch"
        return 1
    fi

    print_warning "This will merge $branch into main"
    echo -n "Continue? (y/N): "
    read confirm

    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        print_info "Cancelled"
        return 0
    fi

    # Ensure build passes
    print_info "Running build check..."
    if ! npm run build; then
        print_error "Build failed! Fix errors before merging."
        return 1
    fi

    git checkout main
    git pull origin main
    git merge "$branch"
    git push origin main

    print_success "Merged $branch into main"

    echo -n "Delete local branch $branch? (y/N): "
    read delete_branch
    if [ "$delete_branch" = "y" ] || [ "$delete_branch" = "Y" ]; then
        git branch -d "$branch"
        print_success "Deleted local branch $branch"
    fi
}

# 7. Cleanup merged branches
cleanup_branches() {
    print_info "Cleaning up merged branches..."

    git checkout main
    git pull origin main

    # List merged branches
    merged_branches=$(git branch --merged | grep -v '\*\|main\|master' || true)

    if [ -z "$merged_branches" ]; then
        print_info "No merged branches to delete"
        return 0
    fi

    echo "Merged branches:"
    echo "$merged_branches"
    echo ""
    echo -n "Delete these branches? (y/N): "
    read confirm

    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        echo "$merged_branches" | xargs -n 1 git branch -d
        print_success "Deleted merged branches"
    fi
}

# 8. Git status
show_status() {
    print_info "Current branch: $(current_branch)"
    echo ""
    git status
}

# 9. Show recent commits
show_commits() {
    print_info "Recent commits:"
    git log --oneline --graph --decorate --all -10
}

# Main loop
while true; do
    show_menu
    echo -n "Select option: "
    read choice

    case $choice in
        1) new_feature ;;
        2) sync_main ;;
        3) quick_commit ;;
        4) push_branch ;;
        5) create_pr ;;
        6) quick_merge ;;
        7) cleanup_branches ;;
        8) show_status ;;
        9) show_commits ;;
        0) print_info "Goodbye!"; exit 0 ;;
        *) print_error "Invalid option" ;;
    esac

    echo ""
    echo -n "Press Enter to continue..."
    read
done
