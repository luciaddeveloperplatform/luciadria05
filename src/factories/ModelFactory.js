import { LonLatGrid } from "@luciad/ria/view/grid/LonLatGrid";
import { WMSTileSetModel } from "@luciad/ria/model/tileset/WMSTileSetModel";
import {FusionTileSetModel} from "@luciad/ria/model/tileset/FusionTileSetModel";
import {createBounds} from "@luciad/ria/shape/ShapeFactory";
import { getReference } from "@luciad/ria/reference/ReferenceProvider";
import { UrlTileSetModel } from "@luciad/ria/model/tileset/UrlTileSetModel";
import {FeatureModel} from "@luciad/ria/model/feature/FeatureModel";
import {WFSFeatureStore} from "@luciad/ria/model/store/WFSFeatureStore";
import {UrlStore} from "@luciad/ria/model/store/UrlStore";

class ModelFactory {
    // Creates a Grid Model
    static createGridModel() {
        return new LonLatGrid();
    }

    // Creates a WMS Model
    static createWMSModel(options) {
        return new WMSTileSetModel(options);
    }

    // Creates a LTS Model
    static createLTSModel (options) {
        return new FusionTileSetModel(options)
    }

    // Creates a TMS Model
    static createTMSModel(options) {
        const REF_WEBMERCATOR = getReference("EPSG:3857");
        // Most TMS services use WebMercator so we can set it as default
        options.reference = options.reference ? options.reference : REF_WEBMERCATOR;
        // Most TMS services cover the entire world in WebMercator bounds, so we set it as default
        options.bounds = options.bounds ?
            options.bounds :
            createBounds(REF_WEBMERCATOR, [-20037508.34278924, 40075016.68557848, -20037508.3520, 40075016.7040]);
        return new UrlTileSetModel(options);
    }

    static createUrlModel(options) {
        const store = new UrlStore(options);
        return  new FeatureModel(store, options);
    }

    static createWFSModel(options) {
        const store = new WFSFeatureStore(options);
        return  new FeatureModel(store, options);
    }
}

export default ModelFactory;
