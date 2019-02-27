# ASGARD

[Asgard](https://github.com/CanalTP/asgard) is now available in the Navitia docker-compose.

For documentation about the dockers, please refer to this repository.

### How to use

If you only want to use the dockers for asgard run the command at the root of the repo :
```bash
docker-compose -f asgard/docker-compose_asgard.yml up
```
There is a .env file which specify the default tags for the data and the application container.
If you'd like to use specific tags, you can do :
```bash
ASGARD_DATA_TAG=<your_data_tag> ASGARD_APP_TAG=<your_app_tag> docker-compose -f docker-compose_asgard.yml up
```

When running the Navitia *docker-compose*, add the *docker-compose_asgard* file in the command:
```bash
docker-compose -f docker-compose.yml -f asgard/docker-compose_asgard.yml up
```
	


