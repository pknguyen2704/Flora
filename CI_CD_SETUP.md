# CI/CD Setup Guide

To enable automated deployment when you push to GitHub, follow these steps:

## 1. Prepare your Server

1. Ensure `docker` and `docker-compose` are installed on your PC.
2. Create a folder named `~/Flora`.
3. Copy the `docker-compose.yml` and `.env` files to this folder.
4. Ensure your firewall allows SSH access.

## 2. Configure GitHub Secrets

Go to your GitHub repository: **Settings > Secrets and variables > Actions** and add the following secrets:

| Secret Name          | Description                                     |
| :------------------- | :---------------------------------------------- |
| `DOCKERHUB_USERNAME` | Your Docker Hub username.                       |
| `DOCKERHUB_TOKEN`    | Your Docker Hub Personal Access Token.          |
| `SERVER_HOST`        | Your PC's public IP address or domain.          |
| `SERVER_USER`        | Your SSH username on the PC.                    |
| `SSH_PRIVATE_KEY`    | Your SSH private key (usually `~/.ssh/id_rsa`). |

## 3. Deployment Flow

1. When you push to the `main` branch, GitHub Actions will:
   - Build new Docker images for Frontend and Backend.
   - Push them to your Docker Hub registry.
   - Connect to your PC via SSH.
   - Pull the new images.
   - Restart the containers automatically.
