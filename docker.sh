#!/bin/bash

case "$1" in
  start)
    echo "Starting MySQL and Adminer..."
    docker compose up -d
    ;;
    
  stop)
    echo "Stopping containers..."
    docker compose down
    ;;
    
  restart)
    echo "Restarting containers..."
    docker compose down
    docker compose up -d
    ;;
    
  reset)
    echo "Removing containers and volumes..."
    docker compose down -v
    docker compose up -d
    ;;
    
  logs)
    docker compose logs -f
    ;;
    
  *)
    echo "Usage:"
    echo "  ./docker.sh start"
    echo "  ./docker.sh stop"
    echo "  ./docker.sh restart"
    echo "  ./docker.sh reset"
    echo "  ./docker.sh logs"
    exit 1
    ;;
esac