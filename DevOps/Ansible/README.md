# Ansible Rollout Plan

Этот каталог предназначен для следующего этапа после подтвержденного ручного bootstrap и ручной приемки VPS.

На этом этапе Ansible должен автоматизировать уже проверенную последовательность действий, а не подменять собой исследование хоста.

## Confirmed Inputs

К моменту начала Ansible-работ уже подтверждены:

- Terraform поднимает VPS в `openstack-msk1`;
- рабочий образ для текущего цикла — `ubuntu-24-04-amd64`;
- комфортный размер для текущего full-stack контура — `c4-m4-d80-base`;
- вход по ключу `~/.ssh/fullstack-blog-vps` работает;
- ручной bootstrap Docker Engine и Docker Compose plugin на чистой Ubuntu воспроизводим;
- ручной deploy проекта в `/opt/fullstack-blog-coursework-2` воспроизводим;
- внешний вход через reverse proxy на `80/tcp` подтвержден;
- `docker compose down -> up` не ломает runtime и не переимпортирует Mongo baseline;
- smoke по `/`, `/api/health`, `/api/openapi.json`, `/api/docs`, `/api/posts` подтвержден.

## Goal

Цель Ansible-этапа:

- превратить подтвержденный ручной bootstrap в читаемый playbook;
- не смешивать Terraform и host-конфигурацию;
- сохранить идемпотентность обычного deploy/startup;
- сделать inventory и roles понятными для учебной курсовой работы.

## Planned Stages

Работа в этой ветке заранее декомпозирована минимум на 3 смысловых commit-а:

1. Зафиксировать roadmap и структуру Ansible-каталога.
2. Добавить inventory, `group_vars` и `host_vars` templates под текущий VPS-цикл.
3. Добавить playbook и roles skeleton под подтвержденную ручную последовательность.

При необходимости допустимы дополнительные commit-ы, если они остаются в рамках того же смыслового блока.

## Expected Inventory Shape

Базовая форма inventory для этой курсовой:

- одна группа `app_servers`;
- один текущий host `fullstack-blog-vps`;
- `ansible_host` задается реальным public IP;
- `ansible_user` пока `root`;
- deploy path — `/opt/fullstack-blog-coursework-2`;
- public port — `80`.

## Expected Roles

Минимальный набор ролей, который напрашивается после ручной приемки:

- `docker_host` — установка Docker Engine и Compose plugin;
- `app_directories` — создание рабочих каталогов;
- `app_config` — раскладка `.env` и связанных runtime-конфигов;
- `app_sync` — доставка project files / compose manifests;
- `compose_stack` — `docker compose up -d`, `ps`, `logs`;
- `smoke_checks` — проверка reverse proxy и ключевых HTTP endpoints.

## Manual Flow That Must Be Preserved

Ansible должен повторять уже подтвержденную ручную последовательность:

1. Подготовить чистый Ubuntu host.
2. Установить Docker Engine и Docker Compose plugin.
3. Создать deploy path `/opt/fullstack-blog-coursework-2`.
4. Разложить проектные файлы и runtime-конфиги.
5. Поднять compose-стек с `mongo`, `backend`, `frontend`, `reverse-proxy`.
6. Проверить `docker compose ps` и `docker compose logs`.
7. Проверить `/`, `/api/health`, `/api/openapi.json`, `/api/docs`, `/api/posts`.
8. Отдельно выполнить controlled restart и повторный smoke.

## Constraints

На этом этапе нельзя:

- смешивать Terraform и Ansible в одном шаге;
- возвращаться к временным bash smoke-скриптам как к итоговому production-способу;
- делать destructive reset базы как часть обычного startup;
- публиковать backend наружу отдельным host port, если для проверки достаточно reverse proxy.
