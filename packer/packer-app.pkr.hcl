variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "ssh_username" {
  type    = string
  default = "ec2-user"
}

variable "subnet_id" {
  type    = string
  default = "subnet-029fd78b62934323c"
}

variable "ami_users" {
  type    = list(string)
  default = ["926230493760"]
}

source "amazon-ebs" "amazon_linux_image" {
  region          = "${var.aws_region}"
  ami_name        = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "AMI for CSYE 225"
  ami_users       = var.ami_users
  ami_regions = [
    var.aws_region
  ]

  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }
  
  source_ami_filter {
    filters = {
      name                = "amzn2-ami-kernel-5.10-hvm-2.0.20230207.0-x86_64-gp2"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["amazon"]
  }

  instance_type = "t2.micro"
  ssh_username  = "${var.ssh_username}"
  subnet_id     = "${var.subnet_id}"
  profile       = "dev"  

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/xvda"
    volume_size           = 8
    volume_type           = "gp2"
  }
}

build {
  sources = ["source.amazon-ebs.amazon_linux_image"]
  
  provisioner "file" {
      source = "./webapp.zip"
      destination = "/home/ec2-user/webapp.zip"
  }

  provisioner "shell" {
    script = "./packer/webapp.sh"
  }

  post-processor "manifest" {
    output = "./packer/manifest.json"
    strip_path = true
  }
}
