# Faculty Management Dashboard - Docker Deployment

## 🚀 Quick Start with Docker

### Prerequisites
- Docker Desktop installed
- Git

### Deploy with Docker Compose

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd faculty-members-management-project
```

2. **Build and run:**
```bash
docker compose up -d
```

3. **Access the application:**
- Open http://localhost:3000

### Manual Docker Build

```bash
# Build the image
docker build -f Dockerfile.prod -t faculty-dashboard .

# Run the container
docker run -d -p 3000:80 --name faculty-app faculty-dashboard
```

### Stop the application

```bash
# Using Docker Compose
docker compose down

# Or stop the container manually
docker stop faculty-app
docker rm faculty-app
```

## 📋 Commands

| Command | Description |
|---------|-------------|
| `docker compose up -d` | Start the application in background |
| `docker compose down` | Stop and remove containers |
| `docker compose logs` | View application logs |
| `docker compose restart` | Restart the application |

## 🔧 Configuration

- **Port:** The application runs on port 3000 (mapped from container port 80)
- **Environment:** Production mode
- **Auto-restart:** Container restarts automatically unless stopped manually

## 🩺 Health Check

The container includes a health check that verifies the application is running properly.

```bash
# Check container health
docker ps
```

## 📦 What's Included

- ✅ Multi-stage Docker build for optimized image size
- ✅ Nginx web server for production performance
- ✅ Health checks for monitoring
- ✅ Auto-restart functionality
- ✅ Gzip compression and caching headers
