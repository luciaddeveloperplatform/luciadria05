import {WebGLMap} from "@luciad/ria/view/WebGLMap";
import {LayerTreeControl, MouseLocationComponent, ScaleIndicator, ZoomControl} from "luciadmapcontrols";
import "luciadmapcontrols/styles.css";
import {getReference} from "@luciad/ria/reference/ReferenceProvider";

class MapFactory {
    // Creates a Map
    static createMap(mapElement, options) {
        // Defaults to "EPSG:4978" in case no projection is set
        options = options ? options : {};
        options.reference = options.reference ?
            options.reference :
            getReference("EPSG:4978");
        const map = new WebGLMap(mapElement, options);

        // Adding some basic map controls
        new ScaleIndicator(map);
        new ZoomControl(map);
        new MouseLocationComponent(map);

        // Insert a html element to hold the layer control
        const layerControlElement = document.createElement("div");
        layerControlElement.id = 'layer-control-id';
        mapElement.appendChild(layerControlElement);

        // Adding a LayerTreeControl
        new LayerTreeControl(map, {
            noLayerDelete: true,
            domId: "layer-control-id"
        });

        return map;
    }
}

export default MapFactory
