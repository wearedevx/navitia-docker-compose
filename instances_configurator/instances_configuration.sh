#!/bin/bash

tyr_config() {
  instance_name=$1
  INSTANCE=$instance_name envsubst < templates/tyr_instance.ini > /etc/tyr.d/$instance_name.ini

  mkdir -p /srv/ed/$instance_name
  mkdir -p /srv/ed/output
  mkdir -p /srv/ed/input/$instance_name
}

kraken_config() {
  instance_name=$1
  mkdir -p /srv/kraken
  INSTANCE=$instance_name envsubst < templates/kraken_instance.ini > /srv/kraken/$instance_name.ini
}

jormungandr_config() {
  instance_name=$1

  INSTANCE=$instance_name envsubst < templates/jormun_instance.json > /etc/jormungandr.d/$instance_name.json
}

db_config() {
  instance_name=$1

  # wait for db ready
  while ! pg_isready --host=database; do
    echo "waiting for postgres to be ready"
    sleep 1;
  done

  # database creation
  PGPASSWORD=navitia createdb --host database -U navitia $instance_name
  PGPASSWORD=navitia psql -c 'CREATE EXTENSION postgis;' --host database $instance_name navitia

  # database schema migration
  alembic_file=/srv/ed/$instance_name/ed_migration.ini
  INSTANCE=$instance_name envsubst < templates/ed_migration.ini > $alembic_file
  alembic -c $alembic_file upgrade head
}

add_instance() {
  instance_name=$1

  # tyr configuration
  tyr_config $instance_name

  # kraken configuration
  kraken_config $instance_name

  # jormungandr configuration
  jormungandr_config $instance_name

  # db creation and migration
  db_config $instance_name
}

# TODO discover the instance automaticaly
add_instance 'default'
