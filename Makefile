NODE_VERSION := $(shell cat .nvmrc)

.PHONY: build dev lint fix-lint publish install check-node

## Build the extension into dist/
build: install
	npm run build

## Run the extension in development mode
dev: install
	npm run dev

## Report lint problems
lint: install
	npm run lint

## Fix lint problems
fix-lint: install
	npm run fix-lint

## Publish the extension to the Raycast store
publish: install
	npm run publish

## Install dependencies
install: check-node node_modules

node_modules: package.json package-lock.json
	npm install
	@touch node_modules

# Fail early when the active Node major does not match .nvmrc
check-node:
	@current=$$(node -v | sed 's/^v//;s/\..*//'); \
	if [ "$$current" != "$(NODE_VERSION)" ]; then \
		echo "Node $(NODE_VERSION) required, found v$$current. Run: nvm use"; \
		exit 1; \
	fi
