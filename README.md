# Project Setup with Docker and Docker Compose

This guide will walk you through setting up the project using Docker and Docker Compose. Ensure that Docker and Docker Compose are installed on your machine before starting.

## Prerequisites

- Docker: [Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)
- Redis: [Install Redis](https://redis.io/docs/latest/operate/oss_and_stack/install/)

## Steps

1. **Clone the repository**

   git clone <repository_url>
   cd <project_directory>

2. **Create Storage**
    mkdir -p storage/videos
    
3. **Copy Environment**
    cp .env.example .env

4. **Install Package**
    npm install

5. **Start redis-server**
    sudo systemctl start redis-server

6. **Create Database**
    docker compose run app npm run database

7. **Run Project**
    docker compose up

8. **Open Project**
    http://localhost:5000/api

## Notes
    -using Node 20 LTS
    -use sudo only in linux
    
## Stop Project
    docker compose down
