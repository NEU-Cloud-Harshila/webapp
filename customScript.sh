sleep 30
sudo yum update -y

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 16 -y

sudo yum install https://dev.mysql.com/get/mysql80-community-release-el7-5.noarch.rpm -y
sudo yum repolist
sudo amazon-linux-extras install epel -y
sudo yum -y install mysql-community-server
sudo systemctl enable --now mysqld
systemctl status mysqld

ROOT_PASSWORD=$(sudo grep 'temporary password' /var/log/mysqld.log | awk '{print $NF;}')
echo "${ROOT_PASSWORD}"

sudo mysql -u "root" --password="${ROOT_PASSWORD}" --connect-expired-password -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '$DB_PASSWORD';"

sudo yum install unzip -y
cd ~/ && unzip webapp.zip
cd ~/webapp && npm install
npm run build

sudo mv /tmp/web.service /etc/systemd/system/web.service
sudo systemctl enable web.service
sudo systemctl start web.service