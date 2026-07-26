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
    echo "Running sql/03_queries.sql against wqc353_1-db..."
    docker exec -i -e MYSQL_PWD="$MYSQL_ROOT_PASSWORD" wqc353_1-db mysql -u root wqc353_1 < sql/03_queries.sql
    ;;

  verify)
    echo "Running sql/04_verify.sql against wqc353_1..."
    docker exec -i -e MYSQL_PWD="$MYSQL_ROOT_PASSWORD" wqc353_1-db mysql -u root wqc353_1 < sql/04_verify.sql
    ;;

  adminer-remote-start)
    echo "Starting Adminer pointed at AITS (wqc353.encs.concordia.ca)..."
    echo "Open http://localhost:8081 — login with your AITS DB user/password/db from the email."
    echo "Requires Concordia VPN if you're off the ENCS network."
    docker compose -f docker-compose.remote.yml up -d
    ;;

  adminer-remote-stop)
    echo "Stopping remote Adminer..."
    docker compose -f docker-compose.remote.yml down
    ;;

  *)
    echo "Usage:"
    echo "  ./docker.sh start"
    echo "  ./docker.sh stop"
    echo "  ./docker.sh restart"
    echo "  ./docker.sh reset"
    echo "  ./docker.sh logs"
    echo "  ./docker.sh queries               # run 03_queries.sql, print results"
    echo "  ./docker.sh verify                # run 04_verify.sql, print COUNT(*) per table"
    echo "  ./docker.sh adminer-remote-start   # Adminer GUI pointed at AITS server (port 8081)"
    echo "  ./docker.sh adminer-remote-stop"
    exit 1
    ;;
esac