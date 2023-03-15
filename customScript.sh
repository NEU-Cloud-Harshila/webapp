#!/bin/bash

sudo yum update -y
sudo yum upgrade -y

sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs

unzip webapp.zip -d webapp
cd /home/ec2-user/webapp
npm i

sudo mv /tmp/web.service /etc/systemd/system/web.service
