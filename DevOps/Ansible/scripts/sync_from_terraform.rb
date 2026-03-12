#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "pathname"

ROOT = Pathname.new(__dir__).join("..").realpath
TERRAFORM_DIR = ROOT.join("..", "Terraform").realpath

def read_outputs(terraform_dir)
  output = `terraform -chdir=#{terraform_dir} output -json`
  raise "terraform output failed" unless $?.success?

  JSON.parse(output).transform_values { |entry| entry.fetch("value") }
end

def write_yaml(path, content)
  path.write(content)
end

outputs = read_outputs(TERRAFORM_DIR)

host_name = outputs.fetch("project_server_name")
public_ip = outputs.fetch("project_public_ip")
ssh_user = outputs.fetch("project_ssh_user")
ssh_private_key_path = outputs.fetch("project_ssh_private_key_path")

hosts_path = ROOT.join("inventories", "production", "hosts.yml")
host_vars_path = ROOT.join("inventories", "production", "host_vars", "#{host_name}.yml")

hosts_yaml = <<~YAML
  all:
    children:
      app_servers:
        hosts:
          #{host_name}:
            ansible_host: #{public_ip}
            ansible_user: #{ssh_user}
YAML

host_vars_yaml = <<~YAML
  ansible_ssh_private_key_file: #{ssh_private_key_path}

  server_name: #{host_name}
  server_id: #{outputs.fetch("project_server_id")}
  server_public_ip: #{public_ip}
  server_region_slug: #{outputs.fetch("project_region_slug")}
  server_image_slug: #{outputs.fetch("project_image_slug")}
  server_size_slug: #{outputs.fetch("project_server_size")}
  server_created_at: #{outputs.fetch("project_server_created_at")}
  ssh_key_fingerprint: #{outputs.fetch("project_ssh_key_fingerprint")}

  backend_client_origin: http://#{public_ip}

  # Replace placeholders before real deploy runs.
  mongo_root_password: change-me
  backend_jwt_secret: change-me
YAML

write_yaml(hosts_path, hosts_yaml)
write_yaml(host_vars_path, host_vars_yaml)

puts "Updated #{hosts_path}"
puts "Updated #{host_vars_path}"
