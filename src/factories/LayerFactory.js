import { GridLayer } from "@luciad/ria/view/grid/GridLayer";
import { RasterTileSetLayer } from "@luciad/ria/view/tileset/RasterTileSetLayer";
import {LayerType} from "@luciad/ria/view/LayerType";
import ModelFactory from "./ModelFactory";
import {FeatureLayer} from "@luciad/ria/view/feature/FeatureLayer";

class LayerFactory {
    // Creates a Grid Layer
    static createGridLayer(model, options) {
        // Set Model as default Model
        model = model ? model :  ModelFactory.createGridModel();
        // Provide some defaults in case they are not set
        options = options ? options : {};
        options.layerType = options.layerType ? options.layerType :  LayerType.STATIC;
        options.label = options.label ? options.label :  "Grid";
        options.id = options.id ? options.id :  "Grid";
        return new GridLayer(model, options);
    }

    // Creates a Raster Layer
    static createRasterLayer(model, options) {
        // Provide some defaults in case they are not set
        options = options ? options : {};
        options.layerType = options.layerType ? options.layerType :  LayerType.STATIC;
        options.label = options.label ? options.label :  "Raster layer";
        return new RasterTileSetLayer(model, options);
    }

    static createFeatureLayer(model, options) {
        options = options ? options : {};
        options.layerType = options.layerType ? options.layerType :  LayerType.STATIC;
        options.label = options.label ? options.label :  "Feature layer";
        return new FeatureLayer(model, options);
    }
}

export default LayerFactory;
