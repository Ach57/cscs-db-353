#!/bin/bash

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

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

  queries)
    echo "Running sql/03_queries.sql against cscs-db..."
    docker exec -i -e MYSQL_PWD="$MYSQL_ROOT_PASSWORD" cscs-db mysql -u root cscs < sql/03_queries.sql
    ;;

  verify)
    echo "Running sql/04_verify.sql against cscs-db..."
    docker exec -i -e MYSQL_PWD="$MYSQL_ROOT_PASSWORD" cscs-db mysql -u root cscs < sql/04_verify.sql
    ;;

  *)
    echo "Usage:"
    echo "  ./docker.sh start"
    echo "  ./docker.sh stop"
    echo "  ./docker.sh restart"
    echo "  ./docker.sh reset"
    echo "  ./docker.sh logs"
    echo "  ./docker.sh queries   # run 03_queries.sql, print results"
    echo "  ./docker.sh verify    # run 04_verify.sql, print COUNT(*) per table"
    exit 1
    ;;
esac