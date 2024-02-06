# issatex-docker

## Environnement
- Ubuntu 22.04 Jammy
- Docker 25.0.0
- PostgreSQL 14
- ApiPlatform 3.1
- NextJS 13.2.1

## Linux Setup (tested on Ubuntu 20.04)
>clone project from github
```
git clone git@github.com:MarwenTlili/issatex-docker.git
cd issatex-docker
```

>issatex-docker/.env
```
POSTGRES_USER=app
TRUSTED_PROXIES=127.0.0.0/8,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
SERVER_NAME=localhost
CADDY_MERCURE_URL=http://caddy/.well-known/mercure
CADDY_MERCURE_JWT_SECRET=9q7RBSPG9ZkFneJzd5IotUUif+yZZPW3EqglWAhZkTI=

HTTP_PORT=80
HTTPS_PORT=443
HTTP3_PORT=443

POSTGRES_VERSION=14
POSTGRES_DB=app
POSTGRES_USER=app
POSTGRES_PASSWORD=app
```

>pwa
```
sudo apt-get install nodejs npm
sudo npm install -g pnpm
pnpm install
```

>generate random key for NextAuth
```
openssl rand -base64 32
```

>pwa/.env
```
NEXTAUTH_SECRET=fvt3Bs1jZVzwkIcLONvA4vpSj7XafXIjxFz6wn+GyJk=
```

>api/
```
docker exec -it issatex-php sh
php bin/console lexik:jwt:generate-keypair
```

>api/public
```
mkdir -p uploads/media uploads/tech_docs uploads/articles
chmod -R 777 api/public/uploads/
```

>issatex-docker/
```
docker compose up -d
```

## How to use
>links  

| URL  | PATH  | lANGUAGE  | DESCRIPTION  |   |
|---|---|---|---|---|
| https://localhost/docs/  |  api/ | PHP  |  The API |
| https://localhost/ | pwa/ | JavaScript  | The Next.js application |
| https://localhost/admin/ | pwa/pages/admin/ | JavaScript  | The Admin |

>logs example  
```
docker logs issatex-php -n 1000 -f
docker logs issatex-pwa -n 1000 -f
docker logs issatex-caddy -n 1000 -f
docker logs issatex-database -n 1000 -f
```

>get into containers
```
docker exec -it issatex-php sh
docker exec -it issatex-pwa sh
docker exec -it issatex-caddy sh
docker exec -it issatex-database bash
```

>connect to database (postgres)  from host
```
psql -h localhost -p 5433 -U app -d app
```
## Curl
**curl without bearer**
```
curl --insecure \
	-X POST https://localhost/auth \
	-H "Content-Type: application/json" \
	-d '{"email": "admin@example.com", "password": "admin"}' \
    | json_pp
```

**curl with bearer**
>from host

```
curl --insecure \
	-X GET https://localhost/api/users \
	-H "Accept: application/json" \
	-H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NzgzMzU0NjcsImV4cCI6MTY3ODQyMTg2Nywicm9sZXMiOlsiUk9MRV9BRE1JTiJdLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIn0.TLxcLANB7z9Cfu2xsk6G6PxcsimzTgDipzc4e3_ytlxPILbRu3fkzUV955QsPWEMJaNxYrfqHM1TSwUFx5n27KJDiGam_uCk1PAqhJ5RC9S9l-JY5IO2ygcOHYE23nEIAznhlU-iHBN9nk9AqxjfN1tkUnPpABy-hNnmuwFvDg-mlfhcEOmjAbkJp05uoMOO3PK_N3MQiYYG5s5XifTXye7WrGNQGq6P7dexsJfpwErocAt4shzkaZHYw_c2Hyu934V4EGcVuWOSUoMAl3r75z5nJqsbI0VHAlVStBBFYG-PX1aRP07l1wNyQ8TcY2KsY700btnMmrwiZ-dAPhUTJg" \
    | json_pp
```
**pnpm add package with bearer**
>from container
```
pnpm create @api-platform/client \
    http://caddy \
    src/ \
    -r Machine \
    -g next \
    --bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImN0eSI6IkpXVCJ9.eyJpYXQiOjE3MDM3NzM2NDQsImV4cCI6MTcwMzg2MDA0NCwicm9sZXMiOlsiUk9MRV9URVNUIiwiUk9MRV9DTElFTlQiXSwiZW1haWwiOiJ4cHJlZG92aWNAbGVkbmVyLmNvbSIsInVzZXJuYW1lIjoiam9oYXJhIiwiaWQiOiIwMUdWQlQ0TTVFSkdKUjdUMTlDR0pFU1RHUyIsImF2YXRhckNvbnRlbnRVcmwiOiIvdXBsb2Fkcy9tZWRpYS82NGM2YjJhMGI1ZGNiXzQxNDAwNDcucG5nIiwiaXAiOiIxNzIuMTguMC4xIiwiaXNWZXJpZmllZCI6dHJ1ZX0.VPCOemcHsRkSprfd4x_s6CY9jl0mb5TamDJutKzSBMgC1yi4bzgZ_PMp1bggC3AKc46M2-Rsq4X6mLRil2dJT7efHtTlO6OWRaUy1KVLf8c0unwpSWoUPQB1IgIDPyfL6yvw8F1WyW9IY4Rl6Y7yresUSScKcsn5cnclppmN5GZixdaMS-o09H7qWw5RS2Kg8gB4gQRawlbdtNF9AZO2xc4Jr_X41Be6nZVGrXNDXtJ5JM0gNyV026cTNSodvdzgJrNqzPNe5MlC9BgFYncwh_6aOJnj4TUre9J-yv_SyeW6Eg4WHMyvrFfBKWGZT6nEe-aNAEC9OE0ihC8GDPvrcg

```
