.PHONY: help \
	start stop restart reset logs connect queries verify \
	triggers trigger-tests email-event email-test \
	adminer-start adminer-stop \
	dev-start dev-stop dev-restart dev-reset \
	dev-logs dev-logs-backend dev-logs-frontend \
	remote-connect remote-schema remote-seed remote-setup \
	remote-queries remote-verify remote-triggers remote-trigger-tests \
	remote-email-event remote-email-test

LOCAL  := ./scripts/local.sh
REMOTE := ./scripts/remote.sh

.DEFAULT_GOAL := help

##@ General

help: ## Show available targets
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##/ { printf "  \033[36m%-26s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0,5) }' $(MAKEFILE_LIST)

##@ Local DB

start: ## Start MySQL + Adminer (local)
	$(LOCAL) start

stop: ## Stop local containers
	$(LOCAL) stop

restart: ## Restart local containers
	$(LOCAL) restart

reset: ## Wipe volumes and restart (local)
	$(LOCAL) reset

logs: ## Tail local container logs
	$(LOCAL) logs

connect: ## Open interactive MySQL shell (local)
	$(LOCAL) connect

queries: ## Run sql/03_queries.sql (local)
	$(LOCAL) queries

verify: ## Run sql/04_verify.sql — row counts (local)
	$(LOCAL) verify

triggers: ## Apply sql/05_trigger.sql (local)
	$(LOCAL) triggers

trigger-tests: ## Run sql/07_trigger_tests.sql PASS/FAIL table (local)
	$(LOCAL) trigger-tests

email-event: ## Apply sql/06_email_event.sql (local)
	$(LOCAL) email-event

email-test: ## Fire sp_generate_weekly_schedule_emails for next 7 days (local)
	$(LOCAL) email-test

##@ Adminer

adminer-start: ## Start Adminer → AITS server on :8081
	$(LOCAL) adminer-remote-start

adminer-stop: ## Stop remote Adminer
	$(LOCAL) adminer-remote-stop

##@ Dev Stack

dev-start: ## Build + start MySQL, Backend, Frontend
	$(LOCAL) dev-start

dev-stop: ## Stop dev stack
	$(LOCAL) dev-stop

dev-restart: ## Restart dev stack (rebuild images)
	$(LOCAL) dev-restart

dev-reset: ## Wipe volumes + rebuild dev stack
	$(LOCAL) dev-reset

dev-logs: ## Tail all dev services
	$(LOCAL) dev-logs

dev-logs-backend: ## Tail backend logs
	$(LOCAL) dev-logs-backend

dev-logs-frontend: ## Tail frontend logs
	$(LOCAL) dev-logs-frontend

##@ Remote (AITS)

remote-connect: ## Open interactive MySQL shell on AITS
	$(REMOTE) connect

remote-schema: ## Apply schema to AITS (confirms first)
	$(REMOTE) schema

remote-seed: ## Seed AITS database (confirms first)
	$(REMOTE) seed

remote-setup: ## Schema + seed on AITS (confirms first)
	$(REMOTE) setup

remote-queries: ## Run sql/03_queries.sql on AITS
	$(REMOTE) queries

remote-verify: ## Run sql/04_verify.sql on AITS — row counts
	$(REMOTE) verify

remote-triggers: ## Apply sql/05_trigger.sql on AITS (confirms first)
	$(REMOTE) triggers

remote-trigger-tests: ## Run sql/07_trigger_tests.sql on AITS PASS/FAIL table
	$(REMOTE) trigger-tests

remote-email-event: ## Apply sql/06_email_event.sql on AITS (confirms first)
	$(REMOTE) email-event

remote-email-test: ## Fire sp_generate_weekly_schedule_emails on AITS
	$(REMOTE) email-test
