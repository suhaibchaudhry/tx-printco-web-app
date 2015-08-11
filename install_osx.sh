#!/usr/bin/env bash
sudo brew install mysql
sudo chown -R _mysql:_mysql /usr/local/var/mysql

#Start MySQL
sudo mysql.server start

#Create Project Database
echo "CREATE DATABASE IF NOT EXISTS \`txprintco-sails\`" | mysql -uroot
echo "GRANT ALL ON \`txprintco-sails\`.* to 'txprintco-sails'@'localhost' identified by 'xyz786';" | mysql -uroot

#Reset Password
echo "SET PASSWORD FOR 'root'@'localhost' = PASSWORD('xyz786');" | mysql -uroot

#Install Ruby
sudo brew install ruby
sudo gem install compass

sudo npm -g install bower
sudo npm -g install sails

bower install
sails lift
