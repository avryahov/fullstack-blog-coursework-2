resource "regcloud_server" "project" {
  name             = var.server_name
  size             = var.server_size_slug
  image            = var.image_slug
  region_slug      = var.region_slug
  ssh_keys         = [var.ssh_key_fingerprint]
  backups          = var.enable_backups
  isp_license_size = var.isp_license_size
}
