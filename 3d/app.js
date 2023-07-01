import { Deck } from "@deck.gl/core";
import {
  DataFilterExtension,
  _TerrainExtension as TerrainExtension,
} from "@deck.gl/extensions";
import { Tile3DLayer } from "@deck.gl/geo-layers";
import { GeoJsonLayer } from "@deck.gl/layers";
import { kanto_r1 } from "./const";

const TILESET_URL = "https://tile.googleapis.com/v1/3dtiles/root.json";

const INITIAL_VIEW_STATE = {
  latitude: 35.6894,
  longitude: 139.6917,
  zoom: 10,
  minZoom: 10,
  bearing: 0,
  pitch: 60,
};

// Set your Google Maps API key here or via environment variable
const GOOGLE_MAPS_API_KEY = process.env.GoogleMapsAPIKey; // eslint-disable-line

const alpha = 180;
const rank_color = [
  [],
  [247, 245, 169, alpha],
  // [200, 0, 80, alpha],
  [255, 216, 192, alpha],
  [255, 183, 183, alpha],
  [255, 145, 145, alpha],
  [242, 133, 201, alpha],
  [220, 122, 220, alpha],
];

new Deck({
  initialViewState: INITIAL_VIEW_STATE,
  controller: true,
  layers: [
    new Tile3DLayer({
      id: "google-3d-tiles",
      data: TILESET_URL,
      onTilesetLoad: (tileset3d) => {
        tileset3d.options.onTraversalComplete = (selectedTiles) => {
          const uniqueCredits = new Set();
          selectedTiles.forEach((tile) => {
            const { copyright } = tile.content.gltf.asset;
            copyright.split(";").forEach(uniqueCredits.add, uniqueCredits);
          });
          return selectedTiles;
        };
      },
      loadOptions: {
        fetch: { headers: { "X-GOOG-API-KEY": GOOGLE_MAPS_API_KEY } },
      },
      operation: "terrain+draw",
    }),
    ...getDisasterLayer(),
  ],
});

function getDisasterLayer() {
  const result = [];
  const baseUrl = kanto_r1.baseUrl;
  const files = kanto_r1.files;
  files.forEach((v) => {
    const url = baseUrl + v;
    result.push(
      new GeoJsonLayer({
        id: v,
        data: url,
        extensions: [
          new DataFilterExtension({ filterSize: 1 }),
          new TerrainExtension(),
        ],
        getFilterValue: (f) => f.properties.distance_to_nearest_tree,
        filterRange: [0, 500],
        // Styles
        filled: true,
        stroked: false,
        pointRadiusMinPixels: 2,
        pointRadiusScale: 2000,
        getPointRadius: (f) => 11 - f.properties.scalerank,
        getFillColor: (val) => {
          return rank_color[val.properties.A31_201];
        },
        opacity: 0.2,
      })
    );
  });
  return result;
}
