# nav2_docker_compose
docker compose with micro containers, one for each navitia's service

# how to use
You'll need docker and docker-compose (tested with docker v1.12.1 and docker-compose v1.8.1)

Build the images:
`docker-compose build`

run them all
`docker-compose up`

you can then add some data:
`docker cp data/dumb_ntfs.zip nav2dockercompose_tyr_beat_1:/srv/ed/input/default/`

then you can query jormungandr:
`http :9090/v1/coverage/default/lines`


# TODO
- move into navitia's repo and use the local sources
  - compile kraken & ed
  - push container on docker hub
  - add the possibility for some container to use the local code (first jormungandr)
- make it easy to add more kraken instances
