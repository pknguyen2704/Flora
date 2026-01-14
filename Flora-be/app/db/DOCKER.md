# Docker Compose for Flora Platform

## Services Included

### 1. MongoDB (Port 27017)

- **Image**: mongo:6.0
- **Container Name**: flora-mongodb
- **Credentials**:
  - Username: `floraadmin`
  - Password: `florapass123`
  - Database: `flora_db`
- **Persistent Storage**: Docker volumes for data and config

### 2. Mongo Express (Port 8081) - Optional Web UI

- **Access**: http://localhost:8081
- **Admin Credentials**:
  - Username: `admin`
  - Password: `admin123`

## Quick Start

### Start Services

```bash
# Start MongoDB + Mongo Express
docker-compose up -d

# Start only MongoDB (without web UI)
docker-compose up -d mongodb

# View logs
docker-compose logs -f mongodb
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes all data)
docker-compose down -v
```

### Backend Connection

Update your `.env` file in `instruction-be`:

```env
# For authenticated MongoDB (recommended)
MONGODB_URL=mongodb://floraadmin:florapass123@localhost:27017/flora_db?authSource=admin

# Or for no-auth (development only)
MONGODB_URL=mongodb://localhost:27017/flora_db
```

### Seed Database

```bash
cd instruction-be
python scripts/seed_data.py
```

## MongoDB Commands

### Access MongoDB Shell

```bash
# Via Docker
docker exec -it flora-mongodb mongosh -u floraadmin -p florapass123 --authenticationDatabase admin

# Inside shell
use flora_db
show collections
db.users.find().pretty()
```

### Backup Database

```bash
docker exec flora-mongodb mongodump --out /data/backup --authenticationDatabase admin -u floraadmin -p florapass123
```

### Restore Database

```bash
docker exec flora-mongodb mongorestore /data/backup --authenticationDatabase admin -u floraadmin -p florapass123
```

## Troubleshooting

### Connection Issues

- Ensure MongoDB is running: `docker-compose ps`
- Check logs: `docker-compose logs mongodb`
- Verify port 27017 is not in use: `lsof -i :27017`

### Reset Database

```bash
docker-compose down -v  # Remove volumes
docker-compose up -d    # Restart fresh
cd instruction-be && python scripts/seed_data.py  # Reseed
```

## Production Notes

For production deployment:

1. Change default passwords in `docker-compose.yml`
2. Use environment variables for credentials
3. Set up MongoDB replica set for high availability
4. Configure proper backup strategy
5. Enable MongoDB authentication always
6. Remove Mongo Express or secure it properly
