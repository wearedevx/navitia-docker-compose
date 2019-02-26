# Running jormungandr with local python sources

You can run jormungandr with your own sources

Note: if you changed any cpp or protobuff files, you will need to rebuild all the navitia's images (cf the readme in the builder directory)

```
NAVITIA_PATH={your_own_navitia_path} docker-compose -f docker-compose.yml -f custom_compose/docker-compose-local-jormun.yml up
```

# Running tyr with local python sources

```
NAVITIA_PATH={your_own_navitia_path} docker-compose -f docker-compose.yml -f custom_compose/docker-compose-local-tyr.yml up
```

# Running with mimir

```
docker-compose -f docker-compose.yml -f custom_compose/docker-compose-mimir.yml up
```