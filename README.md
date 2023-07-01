# 多摩川の洪水浸水想定を google-3d-tiles で可視化するサンプル

## Start

1. Create your values in Google Cloud

- [Google Map API Key](https://console.cloud.google.com/apis/credentials)
- [Google Map Map ID](https://console.cloud.google.com/google/maps-apis/studio/maps)

2. Create .env file and fill it

```
$ cp .env.template .env
# then fill after each '='
```

3. Now, you can use the following commands to start up

```
$ docker-compose up
```

## URL

2D: http://localhost:5170/2d/

3D: http://localhost:5170/3d/

## Ref

- https://github.com/visgl/deck.gl
- https://github.com/visgl/deck.gl/tree/master/examples/get-started/pure-js/google-maps
- https://github.com/visgl/deck.gl/tree/master/examples/website/google-3d-tiles
