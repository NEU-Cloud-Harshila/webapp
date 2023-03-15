sleep 30
sudo yum update -y

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 16 -y

sudo yum repolist
sudo amazon-linux-extras install epel -y

sudo yum install unzip -y
cd ~/ && unzip webapp.zip
cd ~/webapp && npm install
npm run build

sudo mv /tmp/web.service /etc/systemd/system/web.service
sudo systemctl enable web.service
sudo systemctl start web.service
