build:
	docker build -t registry.computernetthings.space/tochka-remonta/app:1 . && docker image prune -f

push:
	docker push registry.computernetthings.space/tochka-remonta/app:1