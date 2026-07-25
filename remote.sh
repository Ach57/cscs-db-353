#!/bin/bash
set -euo pipefail

if [ ! -f .env.remote ]; then
  echo "Missing .env.remote — copy .env.remote.example to .env.remote and fill in the AITS password."
  exit 1
fi

export $(grep -v '^#' .env.remote | xargs)

run_sql() {
  local file="$1"
  echo "Running $file against $AITS_DB_HOST/$AITS_DB_NAME ..."
  MYSQL_PWD="$AITS_DB_PASSWORD" mysql -h "$AITS_DB_HOST" -u "$AITS_DB_USER" "$AITS_DB_NAME" < "$file"
}

confirm_shared_db() {
  echo "This writes to the SHARED team database ($AITS_DB_NAME on $AITS_DB_HOST)."
  echo "Make sure no teammate is running this at the same time."
  read -p "Type 'yes' to continue: " ans
  if [ "$ans" != "yes" ]; then
    echo "Aborted."
    exit 1
  fi
}

case "${1:-}" in
  schema)
    confirm_shared_db
    run_sql sql/01_schema.sql
    ;;

  seed)
    confirm_shared_db
    run_sql sql/02_seed.sql
    ;;

  queries)
    run_sql sql/03_queries.sql
    ;;

  verify)
    run_sql sql/04_verify.sql
    ;;

  setup)
    confirm_shared_db
    run_sql sql/01_schema.sql
    run_sql sql/02_seed.sql
    echo "Schema + seed loaded."
    ;;

  connect)
    MYSQL_PWD="$AITS_DB_PASSWORD" mysql -h "$AITS_DB_HOST" -u "$AITS_DB_USER" "$AITS_DB_NAME"
    ;;

  *)
    echo "Usage:"
    echo "  ./remote.sh connect   # open an interactive mysql shell on AITS"
    echo "  ./remote.sh schema    # run 01_schema.sql on AITS (asks for confirmation)"
    echo "  ./remote.sh seed      # run 02_seed.sql on AITS (asks for confirmation)"
    echo "  ./remote.sh setup     # schema + seed in one go (asks for confirmation)"
    echo "  ./remote.sh queries   # run 03_queries.sql, print results"
    echo "  ./remote.sh verify    # run 04_verify.sql, print COUNT(*) per table"
    echo ""
    echo "Requires .env.remote (copy .env.remote.example and fill in the password)."
    echo "Requires Concordia VPN if you're off the ENCS network."
    exit 1
    ;;
esac