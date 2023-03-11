# issatex-docker

official documentation: https://api-platform.com/docs

github repository: https://github.com/api-platform/api-platform

## install the framework
```
git clone https://github.com/api-platform/api-platform.git
```
>OR generate in your git project  
>https://github.com/api-platform/api-platform/generate

```
cd issatex-docker
```
> .env
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

**docker-compose.yml**  
php:  
> container_name: issatex-php  

pwa:  
> container_name: issatex-pwa  

caddy:  
> container_name: issatex-caddy  

database:  
> container_name: issatex-database  


**pull images**  
```
docker compose pull --include-deps
```

**create and start containers**  
```
docker compose up -d 
```

**links**  
| URL  | PATH  | lANGUAGE  | DESCRIPTION  |   |
|---|---|---|---|---|
| https://localhost/docs/  |  api/ | PHP  |  The API |
| https://localhost/ | pwa/ | JavaScript  | The Next.js application |
| https://localhost/admin/ | pwa/pages/admin/ | JavaScript  | The Admin |

**example of raw JSON**  
https://localhost/greetings.jsonld  
https://localhost/greetings.json

**logs example**  
```
docker logs issatex-php -n 1000 -f
docker logs issatex-pwa -n 1000 -f
docker logs issatex-caddy -n 1000 -f
docker logs issatex-database -n 1000 -f
```

**get into containers**
```
docker exec -it issatex-php sh
docker exec -it issatex-pwa sh
docker exec -it issatex-caddy sh
docker exec -it issatex-database bash
```

**connect to database (postgres)  from host**
```
psql -h localhost -p 5433 -U app -d app
```

## How To Use
https://api-platform.com/docs/distribution/

https://api-platform.com/docs/core/configuration/  
**configurations**: swagger, profiler, collection, route_prefix, ...  

### Security
#### create user using SecurityBundle  
https://symfony.com/doc/current/security  

install required bundle
```
docker exec -it issatex-php sh  
composer require symfony/security-bundle
```
create security User
```
php bin/console make:user
```
> output  

created: src/Entity/User.php  
created: src/Repository/UserRepository.php  
updated: src/Entity/User.php  
updated: config/packages/security.yaml  

#### User Entity
https://api-platform.com/docs/core/user
- Creating the Entity and Repository
- Creating and Updating User Password  

#### UID Component   
https://symfony.com/doc/6.2/components/uid.html
```
composer require symfony/uid
```
> api/src/Entity/User.php
```
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Uid\Uuid;

#[Groups(['user:read'])]
#[ORM\Id]
#[ORM\GeneratedValue(strategy: 'CUSTOM')]
#[ORM\Column(type: UlidType::NAME, unique: true)]
#[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
private ?Ulid $id = null;
```
---
#### Persist  
```
php bin/console make:migration
php bin/console doctrine:migrations:migrate
```
---
### Testing 
https://api-platform.com/docs/distribution/testing/
#### Fixtures  
https://github.com/nelmio/alice/tree/2.x
```
composer require --dev alice
```
formatters: https://github.com/fzaninotto/Faker

##### set test environement
> .env.test.local
DATABASE_URL="postgresql://app:app@127.0.0.1:5432/app_test?serverVersion=15&charset=utf8"

##### Creating Data Fixtures
> api/fixtures/Users.yaml
```
App\Entity\User:
    user_1:
        email: admin@example.com
        username: admin
        roles: ["ROLE_ADMIN"]
        password: '\$2y\$13\$1Yat6DdVVoER5V6xntkf/O4b2CNFb6j5w2YNsiuZGcdKQ09PjuTiO'
    user_{2..201}:
        email: <email()>
        username: <username()>
        roles: <randomElements(['ROLE_ENGINEER','ROLE_CLIENT'], 1)>
        password: <password()>
```
##### load alice fixtures
```
bin/console --env=test hautelook:fixtures:load
```

#### Writing Functional Tests
```
composer require --dev symfony/test-pack symfony/http-client  
```

```
php bin/console --env=test doctrine:database:create
php bin/console --env=test doctrine:schema:create
php bin/console --env=test hautelook:fixtures:load
```

https://api-platform.com/docs/distribution/testing/#writing-functional-tests
```
./vendor/bin/phpunit tests/Api/UsersTest.php
```


if there is XML deprecated error:  
1) Your XML configuration validates against a deprecated schema. Migrate your XML configuration using "--migrate-configuration"!  

then migrate it:  
```
./vendor/bin/phpunit --migrate-configuration  
```

---
### JWT Authentication
https://api-platform.com/docs/core/jwt/
```
composer require lexik/jwt-authentication-bundle
```
```
docker exec -it issatex-php sh
set -e
    apk add openssl
    php bin/console lexik:jwt:generate-keypair
    setfacl -R -m u:www-data:rX -m u:"$(whoami)":rwX config/jwt
    setfacl -dR -m u:www-data:rX -m u:"$(whoami)":rwX config/jwt
```

**test - from host**
```
curl --insecure \
	-X POST 'https://localhost/auth' \
	-H 'Content-Type: application/json' \
	-d '{"email": "admin@example.com","password": "admin"}' | json_pp
```
```
curl --insecure \
	-X GET https://localhost/api/users \
	-H "Accept: application/json" \
	-H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NzgzMzU0NjcsImV4cCI6MTY3ODQyMTg2Nywicm9sZXMiOlsiUk9MRV9BRE1JTiJdLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIn0.TLxcLANB7z9Cfu2xsk6G6PxcsimzTgDipzc4e3_ytlxPILbRu3fkzUV955QsPWEMJaNxYrfqHM1TSwUFx5n27KJDiGam_uCk1PAqhJ5RC9S9l-JY5IO2ygcOHYE23nEIAznhlU-iHBN9nk9AqxjfN1tkUnPpABy-hNnmuwFvDg-mlfhcEOmjAbkJp05uoMOO3PK_N3MQiYYG5s5XifTXye7WrGNQGq6P7dexsJfpwErocAt4shzkaZHYw_c2Hyu934V4EGcVuWOSUoMAl3r75z5nJqsbI0VHAlVStBBFYG-PX1aRP07l1wNyQ8TcY2KsY700btnMmrwiZ-dAPhUTJg" | json_pp
```

---
### JWT Refresh Token
https://github.com/markitosgv/JWTRefreshTokenBundle
```
composer req gesdinet/jwt-refresh-token-bundle
	Do you want to execute this recipe?
    [y] Yes
```
> remove api/config/routes/gesdinet_jwt_refresh_token.yaml
> api/config/routes.yaml is enought to set 'api_refresh_token'

> api/src/Entity/RefreshToken.php
```
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Entity;
use Gesdinet\JWTRefreshTokenBundle\Entity\RefreshToken as BaseRefreshToken;

#[Entity]
#[ORM\Table(name: 'refresh_tokens')]
class RefreshToken extends BaseRefreshToken{}
```

**persist the BaseRefreshToken entity**
```
php bin/console make:migration
php bin/console doctrine:migrations:migrate
```

**configs**
> api/config/packages/gesdinet_jwt_refresh_token.yaml
```
gesdinet_jwt_refresh_token:
    refresh_token_class: App\Entity\RefreshToken
    token_parameter_name: refresh_token
    logout_firewall: main
```

> api/config/packages/security.yaml
```
providers:
	users:
		entity:
			class: App\Entity\User
			property: email
	jwt:
		lexik_jwt:
			class: App\Security\User
firewalls:
    dev:
        pattern: ^/(_(profiler|wdt)|css|images|js)/
        security: false
    api:
        pattern: ^/api/
        stateless: true
        provider: jwt
        jwt: ~
    main:
        provider: users
        stateless: true
        json_login:
            check_path: auth # or api_login_check as defined in config/routes.yaml
            username_path: email
            password_path: password
            success_handler: lexik_jwt_authentication.handler.authentication_success
            failure_handler: lexik_jwt_authentication.handler.authentication_failure
        refresh_jwt:
            check_path: api_refresh_token # or, you may use the `api_refresh_token` route name
        logout:
            path: api_token_invalidate

access_control:
    - { path: ^/admin, roles: ROLE_ADMIN }
    - { path: ^/$, roles: PUBLIC_ACCESS } # Allows accessing the Swagger UI
    - { path: ^/docs, roles: PUBLIC_ACCESS } # Allows accessing the Swagger UI docs
    - { path: ^/(auth|token/(refresh|invalidate)), roles: PUBLIC_ACCESS } 
    - { path: ^/, roles: IS_AUTHENTICATED_FULLY }
```

#### Tests
get token and refresh_token
```
curl --insecure \
	-X POST 'https://localhost/auth' \
	-H 'Content-Type: application/json' \
	-d '{"email": "admin@example.com","password": "admin"}' | json_pp
```

request to refresh your token
```
curl --insecure \
	-X POST 'https://localhost/token/refresh' \
	-H 'Content-Type: application/json' \
	-d '{"refresh_token":"a5c4559aea772364742740dd199faa62a3d68ffb5183e0f197b61b0c8d8405aaf107baecabe55692fd8c995b88285e06d64c6db2b49513d3cc40d64f4b08b0bb"}' | json_pp
```

invalidate a refresh_token
```
curl --insecure \
	-X POST 'https://localhost/token/invalidate' \
	-H 'Content-Type: application/json' \
	-d '{"refresh_token":"a5c4559aea772364742740dd199faa62a3d68ffb5183e0f197b61b0c8d8405aaf107baecabe55692fd8c995b88285e06d64c6db2b49513d3cc40d64f4b08b0bb"}' | json_pp
```
>output  
```
{
	"code" : 200,  
	"message" : "The supplied refresh_token has   been invalidated."  
}  
```

now when requesting to refresh the invalidate refresh_token  
```
curl --insecure \
	-X POST 'https://localhost/token/refresh' \
	-H 'Content-Type: application/json' \
	-d '{"refresh_token":"a5c4559aea772364742740dd199faa62a3d68ffb5183e0f197b61b0c8d8405aaf107baecabe55692fd8c995b88285e06d64c6db2b49513d3cc40d64f4b08b0bb"}' | json_pp
```
output
```
{
   "code" : 401,
   "message" : "JWT Refresh Token Not Found"
}
```

> Note: refresh_token should be invalidate after user logout from front-end application

#### Other options
apply migration to test database 'app_test'
```
php bin/console doctrine:migrations:migrate --env=test
```

revoke token - this will remove refresh_token from database
```
php bin/console gesdinet:jwt:revoke 802534d6c1ed7effa19f72138d91a986415c11360e5476154250500df657da33d17ee77397dcbbe95dbca8ce37e3fc257375019de88cb9a60aa75ae2e913233f
```

revoke all invalid tokens  
```
php bin/console gesdinet:jwt:clear
```
---
### JWT Data (payload or header) customization  
https://github.com/lexik/LexikJWTAuthenticationBundle/blob/2.x/Resources/doc/2-data-customization.rst  

---
## Helpers
```
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

php bin/console doctrine:migrations:migrate --env=test
php bin/console doctrine:schema:update --env=test --force
php bin/console --env=test hautelook:fixtures:load

SELECT * FROM "user";
DELETE FROM refresh_tokens;

./vendor/bin/phpunit tests/Api/AuthenticationTest.php

php bin/console --env=test doctrine:schema:update

```
