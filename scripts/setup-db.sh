#!/bin/sh

set -eux

USER="discord-gamestatus"
DATABASE="discord_gamestatus"
DIR=$(realpath $(dirname $0))

echo "Installing postgres"
# apt-get install postgresql

echo "Setting up database in /var/lib/postgres/data"
mkdir -p /var/lib/postgres/data
chown postgres:postgres /var/lib/postgres/data
su - postgres -c "initdb --locale en_US.UTF-8 -D '/var/lib/postgres/data'"

echo "Enabling service"
systemctl enable --now postgresql

echo "Creating database"
su - postgres -c "psql -c 'CREATE DATABASE $DATABASE'"
echo "Creating role"
su - postgres -c "psql -c 'CREATE ROLE \"$USER\" WITH LOGIN'"
echo "Creating tables..."
chmod 755 "${DIR}/schema.sql"
su - postgres -c "psql -d $DATABASE -f ${DIR}/schema.sql"
su - postgres -c "psql -c 'GRANT SELECT, INSERT, UPDATE, DELETE ON statuses, statuses_id_seq TO \"$USER\"' -d $DATABASE"
