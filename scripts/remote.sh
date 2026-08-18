#!/bin/bash

# ---------------------------------------------
# IMPORTANT! READ FIRST BEFORE RUNNING.
# ONLY USE THIS SCRIPT WHEN CONNECTING TO THE AITS SERVICE
# FOR MORE CHECK ./docker-compose.remote.yml
# ---------------------------------------------

# CMDS: connect, schema, seed, setup, queries, verify

set -euo pipefail

if [ ! -f .env.remote ]; then
  echo "Missing .env.remote — copy .env.remote.example to .env.remote and fill in the AITS password."
  exit 1
fi

export $(grep -v '^#' .env.remote | xargs)

# AITS runs MySQL 8.0.22 and still uses the mysql_native_password auth
# plugin for existing accounts. Modern local mysql clients (8.4+/9.x,
# e.g. current Homebrew) no longer ship that plugin, so direct host
# connections can fail with "Authentication plugin 'mysql_native_password'
# cannot be loaded". Running the client inside a mysql:8.0 container
# sidesteps this — it uses a client build old enough to still support it.
run_sql() {
  local file="$1"
  local extra="${2:-}"
  echo "Running $file against $AITS_DB_HOST/$AITS_DB_NAME ..."
  # shellcheck disable=SC2086
  docker run --rm -i \
    -e MYSQL_PWD="$AITS_DB_PASSWORD" \
    mysql:8.0 \
    mysql -h "$AITS_DB_HOST" -u "$AITS_DB_USER" $extra "$AITS_DB_NAME" < "$file"
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

  triggers)
    confirm_shared_db
    run_sql sql/05_trigger.sql
    ;;

  trigger-tests)
    run_sql sql/07_trigger_tests.sql --table
    ;;

  email-event)
    confirm_shared_db
    run_sql sql/06_email_event.sql
    ;;

  email-test)
    echo "Generating email logs for the next 7 days on AITS ($AITS_DB_NAME)..."
    docker run --rm -i \
      -e MYSQL_PWD="$AITS_DB_PASSWORD" \
      mysql:8.0 \
      mysql -h "$AITS_DB_HOST" -u "$AITS_DB_USER" --table "$AITS_DB_NAME" \
      -e "CALL sp_generate_weekly_schedule_emails(CURDATE());"
    ;;

  connect)
    docker run --rm -it \
      -e MYSQL_PWD="$AITS_DB_PASSWORD" \
      mysql:8.0 \
      mysql -h "$AITS_DB_HOST" -u "$AITS_DB_USER" "$AITS_DB_NAME"
    ;;

  *)
    echo "Usage:"
    echo "  ./scripts/remote.sh connect          # open an interactive mysql shell on AITS"
    echo "  ./scripts/remote.sh schema           # run 01_schema.sql on AITS (asks for confirmation)"
    echo "  ./scripts/remote.sh seed             # run 02_seed.sql on AITS (asks for confirmation)"
    echo "  ./scripts/remote.sh setup            # schema + seed in one go (asks for confirmation)"
    echo "  ./scripts/remote.sh queries          # run 03_queries.sql, print results"
    echo "  ./scripts/remote.sh verify           # run 04_verify.sql, print COUNT(*) per table"
    echo ""
    echo "  --- Triggers ---"
    echo "  ./scripts/remote.sh triggers         # (re)apply 05_trigger.sql (asks for confirmation)"
    echo "  ./scripts/remote.sh trigger-tests    # run 07_trigger_tests.sql, print PASS/FAIL table"
    echo ""
    echo "  --- Email Event ---"
    echo "  ./scripts/remote.sh email-event      # (re)apply 06_email_event.sql (asks for confirmation)"
    echo "  ./scripts/remote.sh email-test       # manually fire the procedure for the next 7 days"
    echo ""
    echo "Or use the Makefile: make remote-<command>"
    echo ""
    echo "Requires .env.remote (copy env.remote.example and fill in the password)."
    echo "Requires Concordia VPN if you're off the ENCS network."
    echo "Requires Docker Desktop running (used to get a compatible mysql client)."
    exit 1
    ;;
esac