all: build run

run:
	docker-compose up

build: webserver api

frontend:
	cd frontend && ng build

webserver: frontend
	cp -R frontend/dist/frontend webserver/
	cd webserver && docker build -t eduma_webserver .
	cd webserver && rm -Rf frontend

api:
	cd api && docker build -t eduma_api .
