all: build run

run:
	docker-compose up

build:
	cd frontend && ng build
	cp -R frontend/dist/frontend webserver/
	cd webserver && docker build -t eduma_webserver .
	cd webserver && rm -Rf frontend
