# Ansible Deploy Runbook

Этот каталог автоматизирует уже подтвержденную ручную последовательность для VPS deploy.

Ansible на этом этапе:

- не заменяет Terraform;
- не делает destructive reset базы;
- не публикует MongoDB и backend наружу отдельными host ports;
- повторяет production-like схему с единой внешней точкой входа через reverse proxy на `80`.

## Current Scope

Реализованы и проверены:

- dynamic inventory из Terraform outputs;
- bootstrap Docker host;
- создание deploy path `/opt/fullstack-blog-coursework-2`;
- доставка tracked project files на сервер;
- раскладка runtime `.env`;
- `docker compose up -d --build`;
- post-deploy smoke через публичный IP;
- внешняя проверка, что:
  - сайт доступен;
  - Swagger доступен;
  - API доступно через reverse proxy;
  - MongoDB и backend direct port не торчат наружу.

## Directory Layout

- `ansible.cfg` — локальная конфигурация Ansible;
- `scripts/terraform_inventory.rb` — dynamic inventory из `terraform output -json`;
- `inventories/production/group_vars/app_servers.yml` — общие переменные deploy-контура;
- `playbooks/bootstrap.yml` — подготовка Docker host;
- `playbooks/deploy.yml` — раскладка проекта и запуск compose;
- `playbooks/smoke.yml` — post-deploy smoke-check;
- `playbooks/site.yml` — полный прогон `bootstrap -> deploy -> smoke`;
- `roles/docker_host` — Docker Engine и Docker Compose plugin;
- `roles/app_directories` — deploy path;
- `roles/app_sync` — доставка tracked project files;
- `roles/app_config` — рендер `.env`;
- `roles/compose_stack` — `docker compose up -d --build` и `ps`;
- `roles/smoke_checks` — внешний HTTP smoke и проверки закрытых портов.

## Inventory Source

Inventory не хранит server-specific YAML в tracked виде.

Текущий host и SSH-параметры берутся из Terraform outputs через `scripts/terraform_inventory.rb`.

Для работы inventory Terraform state должен уже существовать и отдавать как минимум:

- `project_server_name`
- `project_public_ip`
- `project_ssh_user`
- `project_ssh_private_key_path`

## Required Environment

Перед `deploy` и `smoke` в локальном shell должны быть заданы:

- `FULLSTACK_BLOG_MONGO_ROOT_PASSWORD`
- `FULLSTACK_BLOG_BACKEND_JWT_SECRET`

Минимальный пример:

```bash
export FULLSTACK_BLOG_MONGO_ROOT_PASSWORD='change-me'
export FULLSTACK_BLOG_BACKEND_JWT_SECRET='change-me-too'
```

## Expected Flow

Обычный порядок запуска:

1. Убедиться, что Terraform уже поднял VPS и `terraform output -json` отдает актуальные значения.
2. Экспортировать runtime secrets в локальный shell.
3. Выполнить `bootstrap.yml` для чистого Ubuntu host.
4. Выполнить `deploy.yml` для раскладки проекта и запуска compose.
5. Выполнить `smoke.yml` для post-deploy проверки.

Полный прогон одной командой:

```bash
ANSIBLE_LOCAL_TEMP=/tmp/ansible-local ansible-playbook playbooks/site.yml
```

Поэтапный прогон:

```bash
ANSIBLE_LOCAL_TEMP=/tmp/ansible-local ansible-playbook playbooks/bootstrap.yml
ANSIBLE_LOCAL_TEMP=/tmp/ansible-local ansible-playbook playbooks/deploy.yml
ANSIBLE_LOCAL_TEMP=/tmp/ansible-local ansible-playbook playbooks/smoke.yml
```

## What Deploy Does

`bootstrap.yml`:

- обновляет apt metadata;
- ставит `docker.io` и `docker-compose-v2`;
- включает и запускает `docker`;
- проверяет `docker --version` и `docker compose version`.

`deploy.yml`:

- создает `/opt/fullstack-blog-coursework-2`;
- собирает локальный deploy archive из tracked project files;
- раскладывает `docker-compose.yml`, `Backend`, `Frontend`, `DevOps/nginx`;
- рендерит `.env`;
- запускает `docker compose up -d --build`;
- проверяет, что `docker compose ps` видит сервисы.

`smoke.yml`:

- проверяет, что compose stack доступен;
- ждет открытие public port `80`;
- проверяет:
  - `/`
  - `/api/health`
  - `/api/openapi.json`
  - `/api/docs`
  - `/api/posts?limit=1`
- подтверждает, что `27017` и `3001` снаружи не открыты.

## Verified Result On Current VPS Cycle

На текущем VPS цикле реально подтверждено:

- `ansible-playbook playbooks/bootstrap.yml`
- `ansible-playbook playbooks/deploy.yml`
- `ansible-playbook playbooks/smoke.yml`

Снаружи по публичному IP реально отвечают:

- `/`
- `/api/health`
- `/api/openapi.json`
- `/api/docs`
- `/api/posts?limit=1`

Снаружи реально не доступны:

- MongoDB на `27017`
- backend direct port `3001`

## Notes

- `host_key_checking = False` оставлен намеренно, потому что VPS в этом цикле пересоздавался и SSH host key менялся.
- Секреты не коммитятся в inventory и не рендерятся в tracked файлы.
- Обычный deploy должен оставаться идемпотентным; destructive reset базы не является частью этого workflow.
