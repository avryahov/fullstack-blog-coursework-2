# Terraform Project VPS

Единая Terraform-конфигурация для VPS, на котором будет жить full-stack блог.

Эта конфигурация делает только инфраструктурный слой:

- создает один VPS в Reg.Cloud;
- использует уже существующий SSH key через fingerprint;
- возвращает наружу server id, public IP и готовую SSH-команду;
- не смешивает Terraform с Ansible и server-side deploy.

Что здесь не делается:

- установка Docker;
- раскладка `.env`;
- доставка `docker compose`;
- запуск `MongoDB + Backend + Frontend + reverse proxy`.

## File Layout

- `main.tf` — Terraform block и provider
- `resources.tf` — ресурс VPS
- `variables.tf` — входные параметры
- `terraform.tfvars` — явные значения для проектного VPS
- `outputs.tf` — outputs, включая public IP и SSH-команду
- `.terraform.lock.hcl` — зафиксированная версия provider

## Current Project Values

Текущая проектная конфигурация использует:

- `server_name = "fullstack-blog-vps"`
- `region_slug = "openstack-msk1"`
- `image_slug = "ubuntu-24-04-amd64-docker"`
- `server_size_slug = "c1-m1-d10-hp"`
- `ssh_key_fingerprint = "fe:e9:57:46:8a:59:4c:15:11:be:00:48:46:f8:0f:7b"`
- `ssh_private_key_path = "~/.ssh/fullstack-blog-vps"`
- `ssh_user = "root"`

Секреты сюда не попадают. Токен передается только через `TF_VAR_token`.

## Manual Check

1. Экспортировать токен:

```bash
export TF_VAR_token='NEW_REGCLOUD_TOKEN'
```

2. Перейти в каталог Terraform:

```bash
cd DevOps/Terraform
```

3. Проверить конфигурацию:

```bash
terraform init
terraform fmt -check
terraform validate
terraform plan
```

4. Создать VPS:

```bash
terraform apply
```

5. Посмотреть outputs:

```bash
terraform output
```

6. При необходимости удалить VPS:

```bash
terraform destroy
```

## Confirmed Runtime Notes

Для этого проекта уже подтверждены:

- рабочий регион `openstack-msk1`;
- рабочий образ `ubuntu-24-04-amd64-docker`;
- рабочий размер `c1-m1-d10-hp`;
- новый SSH key fingerprint `fe:e9:57:46:8a:59:4c:15:11:be:00:48:46:f8:0f:7b`;
- вход на текущий VPS по ключу `~/.ssh/fullstack-blog-vps` без пароля.
