/* global document, google */
import { GoogleMapsOverlay as DeckOverlay } from "@deck.gl/google-maps";
import { GeoJsonLayer } from "@deck.gl/layers";
import { kanagawa } from "./const";

// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
const AIR_PORTS =
  "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson";

// Set your Google Maps API key here or via environment variable
const GOOGLE_MAPS_API_KEY = process.env.GoogleMapsAPIKey; // eslint-disable-line
const GOOGLE_MAP_ID = process.env.GoogleMapsMapId // eslint-disable-line
const GOOGLE_MAPS_API_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=beta&map_ids=${GOOGLE_MAP_ID}`;

function loadScript(url) {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  const head = document.querySelector("head");
  head.appendChild(script);
  return new Promise((resolve) => {
    script.onload = resolve;
  });
}

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

loadScript(GOOGLE_MAPS_API_URL).then(() => {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 35.6894, lng: 139.6917 },
    zoom: 15,
    mapId: GOOGLE_MAP_ID,
  });

  const overlay = new DeckOverlay({
    layers: [
      new GeoJsonLayer({
        id: "disaster",
        data: "/geojson/kanto_r1/A31-20-19_83-305-%E5%A4%9A%E6%91%A9%E5%B7%9D.geojson",
        // Styles
        filled: true,
        stroked: false,
        pointRadiusMinPixels: 2,
        pointRadiusScale: 2000,
        getPointRadius: (f) => 11 - f.properties.scalerank,
        getFillColor: (val) => {
          return rank_color[val.properties.A31_201];
        },

        // Interactive props
        pickable: true,
        onClick: (info) => {
          if (!info.object.properties) return;
          let message = "";
          for (const [key, value] of Object.entries(info.object.properties)) {
            message += `${key}: ${value}\n`;
          }
          alert(message);
        },
      }),
      ...getDisasterLayer(),
    ],
  });

  overlay.setMap(map);
});

function getDisasterLayer() {
  const result = [];
  const baseUrl = kanagawa.baseUrl;
  const files = kanagawa.files;
  files.forEach((v) => {
    const url = baseUrl + v;
    result.push(
      new GeoJsonLayer({
        id: v,
        data: url,
        filled: true,
        stroked: false,
        pointRadiusMinPixels: 2,
        pointRadiusScale: 2000,
        getPointRadius: (f) => 11 - f.properties.scalerank,
        getFillColor: (val) => {
          return rank_color[val.properties.A31_205];
        },

        // Interactive props
        pickable: true,
        onClick: (info) => {
          if (!info.object.properties) return;
          let message = "";
          for (const [key, value] of Object.entries(info.object.properties)) {
            message += `${key}: ${value}\n`;
          }
          alert(message);
        },
      })
    );
  });
  return result;
}
