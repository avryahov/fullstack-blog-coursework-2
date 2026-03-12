output "project_server_id" {
  description = "Reg.Cloud server id for the project VPS."
  value       = regcloud_server.project.server_id
}

output "project_server_name" {
  description = "Provisioned project VPS name."
  value       = regcloud_server.project.name
}

output "project_server_created_at" {
  description = "Creation timestamp for the project VPS."
  value       = regcloud_server.project.created_at
}

output "project_server_size" {
  description = "Provisioned project VPS size slug."
  value       = regcloud_server.project.size
}

output "project_region_slug" {
  description = "Region slug used for the project VPS."
  value       = var.region_slug
}

output "project_image_slug" {
  description = "Image slug used for the project VPS."
  value       = var.image_slug
}

output "project_ssh_key_fingerprint" {
  description = "SSH key fingerprint attached to the project VPS."
  value       = var.ssh_key_fingerprint
}

output "project_ssh_private_key_path" {
  description = "Local private key path used for SSH checks and Ansible access."
  value       = var.ssh_private_key_path
}

output "project_ssh_user" {
  description = "SSH user for manual checks and Ansible access."
  value       = var.ssh_user
}

output "project_public_ip" {
  description = "Public IP address returned by Reg.Cloud for the project VPS."
  value       = regcloud_server.project.ip
}

output "project_ssh_command" {
  description = "Manual SSH command for passwordless access checks."
  value       = "ssh -i ${var.ssh_private_key_path} ${var.ssh_user}@${regcloud_server.project.ip}"
}
