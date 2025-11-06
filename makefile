up:
	@docker compose up -d

down:
	@docker compose down

build:
	@docker compose build

bash:
	@docker compose exec app bash