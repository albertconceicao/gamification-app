# MongoDB Setup with Docker

## Quick Start

1. **Start Docker Desktop** (if not already running)

2. **Start MongoDB container:**
   ```bash
   docker-compose -f docker-compose.mongodb.yml up -d
   ```

3. **Check if MongoDB is running:**
   ```bash
   docker ps
   ```
   You should see `gamification-mongodb` container running.

4. **Create a `.env` file** in the `gamification-api` directory:
   ```env
   MONGODB_URI=mongodb://root:example@localhost:27017/gamification?authSource=admin
   JWT_SECRET=your_jwt_secret_here_change_in_production
   PORT=3000
   NODE_ENV=development
   LOG_LEVEL=info
   ```

5. **Start your API:**
   ```bash
   npm run dev
   ```

## MongoDB Connection Details

- **Host:** localhost
- **Port:** 27017
- **Database:** gamification
- **Username:** root
- **Password:** example
- **Connection String:** `mongodb://root:example@localhost:27017/gamification?authSource=admin`

## Useful Commands

### Stop MongoDB:
```bash
docker-compose -f docker-compose.mongodb.yml down
```

### Stop and remove volumes (clean slate):
```bash
docker-compose -f docker-compose.mongodb.yml down -v
```

### View MongoDB logs:
```bash
docker logs gamification-mongodb
```

### Access MongoDB shell:
```bash
docker exec -it gamification-mongodb mongosh -u root -p example --authenticationDatabase admin
```

### Check MongoDB health:
```bash
docker exec gamification-mongodb mongosh -u root -p example --authenticationDatabase admin --eval "db.adminCommand('ping')"
```

## Troubleshooting

### Docker daemon not running:
- Start Docker Desktop application
- Wait for it to fully start
- Try the command again

### Port 27017 already in use:
- Check if MongoDB is already running: `docker ps`
- Stop existing MongoDB: `docker stop <container-id>`
- Or change the port in `docker-compose.mongodb.yml`

### Connection refused:
- Make sure MongoDB container is running: `docker ps`
- Check MongoDB logs: `docker logs gamification-mongodb`
- Verify the connection string in your `.env` file

