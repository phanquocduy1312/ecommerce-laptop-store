# GitHub Setup Guide

This guide will help you push your E-Commerce Laptop Store project to GitHub.

## Prerequisites

- Git installed on your computer
- A GitHub account (create one at https://github.com if you don't have one)

## Step-by-Step Instructions

### 1. Create a New Repository on GitHub

1. Go to https://github.com and log in to your account
2. Click the "+" icon in the top-right corner and select "New repository"
3. Fill in the repository details:
   - **Repository name**: `ecommerce-laptop-store` (or your preferred name)
   - **Description**: "Full-stack e-commerce web application for selling laptops built with Angular 21 and Node.js"
   - **Visibility**: Choose "Public" or "Private"
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click "Create repository"

### 2. Link Your Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these commands in your project root directory:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ecommerce-laptop-store.git

# Verify the remote was added
git remote -v
```

### 3. Push Your Code to GitHub

```bash
# Push your code to the main/master branch
git push -u origin master
```

If you're using a newer version of Git that defaults to "main" instead of "master", use:

```bash
# Rename branch to main (optional)
git branch -M main

# Push to main branch
git push -u origin main
```

### 4. Enter Your GitHub Credentials

When prompted, enter your GitHub credentials:
- **Username**: Your GitHub username
- **Password**: Your GitHub Personal Access Token (not your account password)

#### How to Create a Personal Access Token:

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name (e.g., "Laptop Store Project")
4. Select scopes: Check "repo" (Full control of private repositories)
5. Click "Generate token"
6. **IMPORTANT**: Copy the token immediately (you won't be able to see it again)
7. Use this token as your password when pushing to GitHub

### 5. Verify Your Upload

1. Go to your repository on GitHub: `https://github.com/YOUR_USERNAME/ecommerce-laptop-store`
2. You should see all your files and the README.md displayed on the main page

## Alternative: Using SSH

If you prefer using SSH instead of HTTPS:

### 1. Generate SSH Key (if you don't have one)

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

### 2. Add SSH Key to GitHub

1. Copy your public key:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
2. Go to GitHub Settings → SSH and GPG keys → New SSH key
3. Paste your public key and save

### 3. Add Remote with SSH

```bash
git remote add origin git@github.com:YOUR_USERNAME/ecommerce-laptop-store.git
git push -u origin master
```

## Common Issues and Solutions

### Issue: "remote origin already exists"

**Solution:**
```bash
# Remove the existing remote
git remote remove origin

# Add the correct remote
git remote add origin https://github.com/YOUR_USERNAME/ecommerce-laptop-store.git
```

### Issue: "failed to push some refs"

**Solution:**
```bash
# Pull the remote changes first
git pull origin master --allow-unrelated-histories

# Then push again
git push -u origin master
```

### Issue: Authentication failed

**Solution:**
- Make sure you're using a Personal Access Token, not your account password
- Check that your token has the correct permissions (repo scope)

## Next Steps After Pushing

1. **Add a License**: Go to your repository → Add file → Create new file → Name it "LICENSE" → Choose a license template
2. **Add Topics**: On your repository page, click the gear icon next to "About" and add relevant topics like: `angular`, `nodejs`, `ecommerce`, `mysql`, `express`, `typescript`
3. **Update README**: If needed, update the README.md with your actual repository URL
4. **Enable GitHub Pages** (optional): If you want to host documentation
5. **Set up GitHub Actions** (optional): For CI/CD automation

## Updating Your Repository

After making changes to your code:

```bash
# Check what files have changed
git status

# Add all changed files
git add .

# Commit with a descriptive message
git commit -m "Description of your changes"

# Push to GitHub
git push
```

## Useful Git Commands

```bash
# View commit history
git log --oneline

# Create a new branch
git checkout -b feature-name

# Switch between branches
git checkout branch-name

# Merge a branch
git merge branch-name

# View all branches
git branch -a

# Pull latest changes from GitHub
git pull

# Clone your repository to another location
git clone https://github.com/YOUR_USERNAME/ecommerce-laptop-store.git
```

## Repository Best Practices

1. **Write clear commit messages**: Describe what changed and why
2. **Commit frequently**: Small, focused commits are better than large ones
3. **Use branches**: Create feature branches for new features
4. **Keep .env files private**: Never commit sensitive data (already in .gitignore)
5. **Update README**: Keep documentation current
6. **Use Pull Requests**: For collaborative development
7. **Add a CHANGELOG**: Document version changes

## Support

If you encounter any issues:
- Check GitHub's documentation: https://docs.github.com
- GitHub Community Forum: https://github.community
- Stack Overflow: https://stackoverflow.com/questions/tagged/git

---

**Congratulations!** Your project is now on GitHub and ready to share with the world! 🎉
