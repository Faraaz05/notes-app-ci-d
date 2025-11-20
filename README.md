# Notes App – DevOps-Focused MERN Project (Docker, CI/CD, Render)

This repository hosts a MERN note-taking application used primarily to practice DevOps workflows: containerization, multi-stage Docker builds, Docker Compose for local and CI, automated CI/CD with GitHub Actions, Docker Hub image registry, and deployment on Render using private deploy hooks. The application itself is intentionally minimal — the focus is end-to-end DevOps processes and repeatable deployment patterns.

## DevOps Concepts Demonstrated
- Containerization: multi-stage Docker builds for frontend (Vite → Nginx) and backend (Node).
- Docker Compose: separate compose files for development and CI builds; build args for environment-aware frontend builds.
- CI/CD: GitHub Actions pipeline that runs tests, builds images, pushes to Docker Hub, and triggers Render via deploy hooks.
- Secrets management: GitHub Secrets and Render environment variables for production credentials.
- Deployment: Render Web Services pulling images from Docker Hub, auto-deploy via deploy hooks.

## Repository structure
```
root/
├─ backend/
│  ├─ src/
│  ├─ tests/
│  ├─ Dockerfile
│  └─ package.json
├─ frontend/
│  ├─ src/
│  ├─ public/
│  ├─ Dockerfile
│  └─ package.json
├─ docker-compose.dev.yml
├─ docker-compose.ci.yml
├─ .github/workflows/ci.yml
└─ README.md
```

## Quick local setup (development)
Requirements:
- Docker
- Docker Compose
- Node (for local development if not using containers)
- MongoDB Atlas or a local MongoDB instance

Start local dev stack:
```bash
docker compose -f docker-compose.dev.yml up --build
```

Local defaults:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

The docker-compose.dev.yml includes volume mounts, hot reload, and references local .env files (not committed).

## Production build notes (manual)
Build and push backend:
```bash
docker build -t <dockerhub-username>/notes-backend:latest ./backend
docker push <dockerhub-username>/notes-backend:latest
```

Build and push frontend (Vite requires VITE_ env at build time):
```bash
docker build \
  --build-arg VITE_API_URL=https://<your-backend-host>/api \
  -t <dockerhub-username>/notes-frontend:latest ./frontend
docker push <dockerhub-username>/notes-frontend:latest
```

## Frontend build-time environment detail
Vite inlines VITE_ variables during npm run build. To ensure the deployed frontend points to the production backend, provide VITE_API_URL at build time using:

- Dockerfile ARG + ENV before npm run build, or
- .env.production file used during npm run build --mode production, or
- docker-compose build.args mapping.

Example frontend Dockerfile pattern (build args must precede the build command):
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## CI/CD (GitHub Actions) overview
Pipeline behavior:

Triggers: PRs (tests) and push to main (tests + build + deploy)

Steps (high-level):
1. Checkout code
2. Install dependencies and run backend tests (using MONGODB_TEST_URI from GitHub Secrets)
3. Build backend Docker image and push to Docker Hub
4. Trigger Render backend deploy hook
5. Build frontend Docker image with VITE_API_URL build-arg and push to Docker Hub
6. Trigger Render frontend deploy hook

Important considerations:
- Run tests before image push; failing tests prevent deploys.
- Use docker compose (modern syntax) on GitHub Actions runners.
- If tests require MongoDB, pass MONGODB_TEST_URI into the test step via env: in the workflow.

Example of the critical test step (YAML snippet):
```yaml
- name: Install backend deps & run tests
  run: |
    cd backend
    npm ci
    npm test -- --watchAll=false
  env:
    NODE_ENV: test
    MONGODB_TEST_URI: ${{ secrets.MONGODB_TEST_URI }}
    JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

Example of build and push steps (YAML snippet):
```yaml
- name: Build & push backend
  run: |
    echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
    docker build -t <dockerhub-username>/notes-backend:latest ./backend
    docker push <dockerhub-username>/notes-backend:latest

- name: Build & push frontend
  run: |
    docker build \
      --build-arg VITE_API_URL=https://notes-backend-c4zt.onrender.com/api \
      -t <dockerhub-username>/notes-frontend:latest ./frontend
    docker push <dockerhub-username>/notes-frontend:latest
```

After the push steps, call Render deploy hooks:
```yaml
- name: Trigger Render backend deploy
  run: curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK_BACKEND }}

- name: Trigger Render frontend deploy
  run: curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK_FRONTEND }}
```

## Required GitHub Secrets
Set these in the repository settings under Secrets → Actions:

- DOCKER_USERNAME — Docker Hub username
- DOCKER_PASSWORD — Docker Hub password or access token
- MONGODB_TEST_URI — test DB connection string for CI tests
- JWT_SECRET — used by backend in CI/test runs if required
- RENDER_DEPLOY_HOOK_BACKEND — Render private deploy hook for backend
- RENDER_DEPLOY_HOOK_FRONTEND — Render private deploy hook for frontend

## Render deployment configuration
Create two Render Web Services (one for backend, one for frontend) and configure:

- Service type: Docker (image from Docker Hub)
- Image: <dockerhub-username>/notes-backend:latest and <dockerhub-username>/notes-frontend:latest
- Ports: backend 5000, frontend 80 (Nginx)
- Environment variables (set via Render dashboard): MONGODB_URI, JWT_SECRET, NODE_ENV=production, and any other runtime variables
- Optionally enable Auto Deploy or use the provided deploy hooks

For frontend served from Docker, ensure VITE_API_URL was baked into the image during the CI build.

## Docker Compose files strategy
- docker-compose.dev.yml: for local dev with volume mounts, .env files, and hot reloading
- docker-compose.ci.yml: for CI build context (no local .env reliance), uses build.args for frontend
- Use docker compose -f docker-compose.ci.yml build in CI to create images

Frontend service example in docker-compose.ci.yml:
```yaml
frontend:
  build:
    context: ./frontend
    dockerfile: Dockerfile
    args:
      VITE_API_URL: "https://notes-backend-c4zt.onrender.com/api"
  image: <dockerhub-username>/notes-frontend:latest
```

## Health checks and sanity testing
- Backend exposes a simple GET /health route for liveness verification.
- Use curl -X POST or Postman to validate login endpoints (they are POST-only).
- To verify Render pulls the newest image: check the Render dashboard → Deploys tab, or confirm a visible change after CI push.

## Best practices and notes
- Never commit .env or secrets to source control.
- Use commit-sha tagging if you want immutable versioning; latest is convenient but less safe for rollbacks.
- Ensure the Node version in CI (actions/setup-node) matches local development (e.g., 25.2.0 if that is what you use).
- For production, set NODE_ENV=production in Render and avoid running tests or DB migrations there unless intended.
- If you need container-level monitoring (Prometheus, cAdvisor), host on a VM or provider that allows that (Render does not expose host-level metrics).

## Troubleshooting tips
- If frontend still points to localhost: rebuild the frontend image ensuring VITE_API_URL was passed as a build-arg and npm run build ran after the ARG/ENV was set.
- If Mongoose reports uri undefined in CI: confirm the workflow step that runs tests includes env: with MONGODB_TEST_URI: ${{ secrets.MONGODB_TEST_URI }}.
- If workflows run twice on merge: use conditional steps (if: github.ref == 'refs/heads/main') to run deploy steps only on push to main.