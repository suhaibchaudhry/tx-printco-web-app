#!/usr/bin/env bash
read -p "Would you like to install MySQL? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
   sudo brew install mysql
   sudo chown -R _mysql:_mysql /usr/local/var/mysql

   #Reset Password
   echo "SET PASSWORD FOR 'root'@'localhost' = PASSWORD('xyz786');" | mysql -uroot
fi

#Start MySQL
sudo mysql.server restart

#Create Project Database
echo "CREATE DATABASE IF NOT EXISTS \`txprintco-sails\`" | mysql -uroot -pxyz786
echo "GRANT ALL ON \`txprintco-sails\`.* to 'txprintco-sails'@'localhost' identified by 'xyz786';" | mysql -uroot -pxyz786

#Install Ruby
sudo brew install ruby
sudo gem install compass

sudo npm -g install bower
sudo npm -g install sails

npm update
bower update
sails lift
