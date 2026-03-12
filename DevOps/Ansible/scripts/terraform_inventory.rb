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

outputs = read_outputs(TERRAFORM_DIR)

host_name = outputs.fetch("project_server_name")
public_ip = outputs.fetch("project_public_ip")

inventory = {
  "_meta" => {
    "hostvars" => {
      host_name => {
        "ansible_host" => public_ip,
        "ansible_user" => outputs.fetch("project_ssh_user"),
        "ansible_ssh_private_key_file" => outputs.fetch("project_ssh_private_key_path"),
        "server_id" => outputs.fetch("project_server_id"),
        "server_region_slug" => outputs.fetch("project_region_slug"),
        "server_image_slug" => outputs.fetch("project_image_slug"),
        "server_size_slug" => outputs.fetch("project_server_size"),
        "server_created_at" => outputs.fetch("project_server_created_at"),
        "ssh_key_fingerprint" => outputs.fetch("project_ssh_key_fingerprint")
      }
    }
  },
  "all" => {
    "children" => ["ungrouped", "app_servers"]
  },
  "app_servers" => {
    "hosts" => [host_name]
  }
}

puts JSON.pretty_generate(inventory)
