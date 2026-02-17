# 🚀 CI/CD Pipeline Setup for SupNum Connect

Your project now has a professional **GitHub Actions** pipeline configured in `.github/workflows/pipeline.yml`.

## 🛠️ What the pipeline does:
1.  **Frontend CI**:
    *   Installs dependencies.
    *   Runs **ESLint** to ensure code quality.
    *   Executes `vite build` to verify the production build works.
2.  **Backend CI**:
    *   Installs dependencies in the `backend/` folder.
    *   Verifies server syntax.
3.  **Automatic Deployment**:
    *   Once all checks pass on the `main` branch, it can trigger your hosting providers.

## 🔑 Required GitHub Secrets
To make the pipeline fully operational, add these secrets to your GitHub Repository (**Settings > Secrets and variables > Actions**):

| Secret Name | Description |
| :--- | :--- |
| `VITE_API_URL` | The URL of your production backend API. |
| `RENDER_DEPLOY_HOOK` | (Recommended) The "Deploy Hook" URL from your Render dashboard to trigger a fresh backend deploy after CI passes. |

## 📦 Connected Services
*   **Vercel**: Should be set to track the `main` branch. It will wait for the GitHub Action to pass before completing the production deployment.
*   **Render**: Enable "Auto-Deploy" in Render settings so it syncs with your `main` branch.

## 🤝 Benefits
- **No Broken Code**: If someone pushes code that doesn't build or has lint errors, the deployment will fail, keeping your live site safe.
- **Consistency**: Every developer on the team (or you in the future) is forced to follow the same build rules.
- **Speed**: No need to manually check if things work before pushing. Just push and relax!
