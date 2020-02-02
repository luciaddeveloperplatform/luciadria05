import { getReference } from "@luciad/ria/reference/ReferenceProvider";
import {RasterDataType} from "@luciad/ria/model/tileset/RasterDataType";
import {RasterSamplingMode} from "@luciad/ria/model/tileset/RasterSamplingMode";
import {createBounds} from "@luciad/ria/shape/ShapeFactory";

import { UrlStore } from "@luciad/ria/model/store/UrlStore";
import { WFSFeatureStore } from "@luciad/ria/model/store/WFSFeatureStore";
import { FeatureModel } from "@luciad/ria/model/feature/FeatureModel";
import {FeatureLayer } from "@luciad/ria//view/feature/FeatureLayer";

import "./index.scss";

import MapFactory from "./factories/MapFactory";
import ModelFactory from "./factories/ModelFactory";
import LayerFactory from "./factories/LayerFactory";

// The root html Element defined in index.html
const root = document.getElementById("root");

// Create an new html element to hold the map. Assing a class name so we can easy style it with css.
const mapElement = document.createElement("div");
mapElement.classList.add("MyLuciadMap");
root.appendChild(mapElement);

// Create the map and fit to bounds
const map = MapFactory.createMap(mapElement);

// Adding a Grid Layer to the Map, this layer assume default LonLatGrid
const gridLayer = LayerFactory.createGridLayer();

// Creating a WMS model
const wmsModel = ModelFactory.createWMSModel({
    getMapRoot: "https://sampleservices.luciad.com/wms",
    version: "1.3.0",
    reference: getReference("CRS:84"),
    layers: ["4ceea49c-3e7c-4e2d-973d-c608fb2fb07e"],
    transparent: false
});
// Creating a WMS Layer
const wmsLayer = LayerFactory.createRasterLayer(wmsModel, {
    label: "Earth Imagery (WMS)"
});

// Creating a LTS Model
const tileSetReference = getReference('EPSG:4326');
const elevationModel = ModelFactory.createLTSModel({
    url: 'https://sampleservices.luciad.com/lts',
    coverageId: 'world_elevation_6714a770-860b-4878-90c9-ab386a4bae0f',
    reference: tileSetReference,
    bounds: createBounds(tileSetReference, [-180, 360, -90, 180]),
    levelCount: 24,
    level0Columns: 4,
    level0Rows: 2,
    tileWidth: 81,
    tileHeight: 81,
    dataType: RasterDataType.ELEVATION,
    samplingMode: RasterSamplingMode.POINT
});

// Creating a LTS Layer (as Raster Layer)
const elevationLayer = LayerFactory.createRasterLayer(elevationModel, {
    label: "Earth elevation (LTS)"
});

// Create TMS Model for elevation
const tmsModel = ModelFactory.createTMSModel({
    baseURL: "https://{s}.tile.openstreetmap.org/{z}/{x}/{-y}.png",
    levelCount: 21,
    subdomains: "a,b,c".split(',')
});

// Create TMS Layer
const tmsLayer = LayerFactory.createRasterLayer(tmsModel, {label: "OpenStreetMap", visible: false});


// If no codec is provided it will default to GeoJSON
const wfsModel = ModelFactory.createWFSModel({
    serviceURL:	"https://sampleservices.luciad.com/wfs",
    reference: getReference("urn:ogc:def:crs:OGC::CRS84"),
    typeName:	"states",
    versions: ["1.1.0"],
    outputFormat: "application/json"
});
// Create WFS Layer "States"
const wfsLayer = LayerFactory.createFeatureLayer(wfsModel, {label: "States"});

// If no codec is provided it will default to GeoJSON
const poiModel = ModelFactory.createUrlModel({
    target: "./resources/san-francisco_california_osm_point.json",
    reference: getReference("urn:ogc:def:crs:OGC::CRS84")
});
// Create URL Vector Layer
const poiLayer = LayerFactory.createFeatureLayer(poiModel, {label: "Points of interest"});


// Adding the WMS Layer to the map
map.layerTree.addChild(wmsLayer, "bottom");

// Adding the LTS Layer to the map
map.layerTree.addChild(elevationLayer);

// Adding the TMS Layer to the map
map.layerTree.addChild(tmsLayer);

// Adding WFS Vector Layer
map.layerTree.addChild(wfsLayer);

// Adding URL Vector Layer
map.layerTree.addChild(poiLayer);

// Adding the GRID Layer to the map
map.layerTree.addChild(gridLayer, "top");

const queryFinishedHandle = poiLayer.workingSet.on("QueryFinished", function() {
    map.mapNavigator.fit({
        bounds: poiLayer.bounds,
        animate: true
    });
    queryFinishedHandle.remove();
});
