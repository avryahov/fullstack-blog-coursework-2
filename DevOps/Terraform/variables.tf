variable "token" {
  description = "Reg.Cloud API token. Pass via TF_VAR_token."
  type        = string
  sensitive   = true
}

variable "regcloud_api_url" {
  description = "Reg.Cloud API endpoint for the Terraform provider."
  type        = string
  default     = "https://api.cloudvps.reg.ru"
}

variable "server_name" {
  description = "Name of the project VPS."
  type        = string
}

variable "region_slug" {
  description = "Region slug for the project VPS."
  type        = string
}

variable "image_slug" {
  description = "Image slug for the project VPS."
  type        = string
}

variable "server_size_slug" {
  description = "Instance size slug for the project VPS."
  type        = string
}

variable "ssh_key_fingerprint" {
  description = "Existing Reg.Cloud SSH key fingerprint attached to the project VPS."
  type        = string
}

variable "ssh_private_key_path" {
  description = "Local private SSH key path used for manual access checks."
  type        = string
}

variable "ssh_user" {
  description = "SSH user used for manual access checks."
  type        = string
  default     = "root"
}

variable "enable_backups" {
  description = "Whether to enable Reg.Cloud backups for the project VPS."
  type        = bool
}

variable "isp_license_size" {
  description = "Optional ISP license size. Keep null unless the project really needs it."
  type        = number
  default     = null
  nullable    = true
}
