# Development image for the React frontend.
FROM node:22-alpine

# All frontend commands run from this directory inside the container.
WORKDIR /app

# Enable pnpm through Corepack.
RUN corepack enable

# Copy manifests first so dependency installation can use Docker cache layers.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies required by Vite, React, TypeScript, and tests.
RUN pnpm install --frozen-lockfile

# Copy the initial source code. Compose mounts the directory again for live changes.
COPY . .

# Vite development server listens on port 4001 inside the container.
EXPOSE 4001

# Start Vite with HMR and expose it to the host network.
CMD ["pnpm", "dev", "--host", "0.0.0.0", "--port", "4001"]
