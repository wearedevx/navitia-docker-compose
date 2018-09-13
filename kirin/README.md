# KIRIN

[The magical unicorn](https://github.com/CanalTP/kirin) is now available in the Navitia docker-compose.

### How to use

Prerequisites:
Two Docker images are needed to run the dockre-compose-kirin:
- kirin: see the section [Docker](https://github.com/CanalTP/kirin#docker) in Kirin
- kirin_configurator: the image can be built using the following command line
	`docker build -f Dockerfile-kirin-configurator -t kirin_configurator .`

When running the Navitia *docker-compose*, add the *docker-compose_kirin* file in the command:
	`docker-compose -f docker-compose.yml -f kirin/docker-compose_kirin.yml up`

This will add the containers needed for Kirin to run and be linked to Navita:
- kirin: the Kirin web server
- kirin_database: the Kirin database, obviously
- kirin_background: a script to load the realtime updates already in the database
- kirin_configurator: a script to upgrade the database
