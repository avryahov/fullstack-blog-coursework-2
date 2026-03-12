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
- `terraform.tfvars.example` — шаблон значений для проектного VPS
- `terraform.tfvars` — локальный рабочий файл, создается копированием из example и в git не коммитится
- `outputs.tf` — outputs, включая public IP и SSH-команду
- `.terraform.lock.hcl` — зафиксированная версия provider

## Template Values

В репозитории хранится только шаблон:

- `server_name = "fullstack-blog-vps"`
- `region_slug = "openstack-msk1"`
- `image_slug = "ubuntu-24-04-amd64"`
- `server_size_slug = "c4-m4-d80-base"`
- `ssh_key_fingerprint = "fe:e9:57:46:8a:59:4c:15:11:be:00:48:46:f8:0f:7b"`
- `ssh_private_key_path = "~/.ssh/fullstack-blog-vps"`
- `ssh_user = "root"`
- `enable_backups = false`
- `isp_license_size = null`

Секреты сюда не попадают. Токен передается только через `TF_VAR_token`.

## Local Working File

Перед любым `terraform plan/apply/destroy` нужно создать локальный рабочий файл:

```bash
cd DevOps/Terraform
cp terraform.tfvars.example terraform.tfvars
```

После этого в локальном `terraform.tfvars` нужно проверить и при необходимости заменить:

- `server_name` — имя создаваемого VPS;
- `region_slug` — регион;
- `image_slug` — образ ОС;
- `server_size_slug` — размер VPS;
- `ssh_key_fingerprint` — fingerprint уже загруженного публичного SSH-ключа;
- `ssh_private_key_path` — локальный путь до приватного ключа для ручных SSH-проверок;
- `ssh_user` — пользователь для входа;
- `enable_backups` — нужны ли backups;
- `isp_license_size` — обычно `null`, если лицензия не нужна.

Важно:

- `terraform.tfvars` — только локальный рабочий файл;
- его не нужно коммитить;
- если меняется конфигурация VPS, меняется локальный `terraform.tfvars`, а template при необходимости обновляется отдельно и осознанно.

## Manual Check

1. Экспортировать токен:

```bash
export TF_VAR_token='NEW_REGCLOUD_TOKEN'
```

2. Перейти в каталог Terraform:

```bash
cd DevOps/Terraform
```

3. Создать локальный рабочий файл:

```bash
cp terraform.tfvars.example terraform.tfvars
```

4. Заполнить `terraform.tfvars` своими значениями.

5. Проверить конфигурацию:

```bash
terraform init
terraform fmt -check
terraform validate
terraform plan
```

6. Создать VPS:

```bash
terraform apply
```

7. Посмотреть outputs:

```bash
terraform output
```

8. При необходимости удалить VPS:

```bash
terraform destroy
```

## Confirmed Runtime Notes

Для этого проекта уже подтверждены:

- рабочий регион `openstack-msk1`;
- рабочий чистый образ `ubuntu-24-04-amd64`;
- комфортный размер `c4-m4-d80-base`;
- новый SSH key fingerprint `fe:e9:57:46:8a:59:4c:15:11:be:00:48:46:f8:0f:7b`;
- вход на текущий VPS по ключу `~/.ssh/fullstack-blog-vps` без пароля;
- ручной bootstrap Docker + Compose plugin на чистой Ubuntu подтвержден;
- ручной deploy full-stack compose-контура и smoke через `80/tcp` подтверждены.
