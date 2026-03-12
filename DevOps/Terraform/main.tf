terraform {
  required_version = ">= 1.11.0"

  required_providers {
    regcloud = {
      source  = "tf.reg.cloud/regru/regcloud"
      version = "0.0.15"
    }
  }
}

provider "regcloud" {
  token   = var.token
  api_url = var.regcloud_api_url
}
