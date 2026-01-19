import * as fz from "zigbee-herdsman-converters/converters/fromZigbee";
import * as tz from "zigbee-herdsman-converters/converters/toZigbee";
import {presets as e} from "zigbee-herdsman-converters/lib/exposes";

export default {
    fingerprint: [
        {modelID: "GreenPower_2", ieeeAddr: new RegExp("^0x000000005d5.....$")},
        {modelID: "GreenPower_2", ieeeAddr: new RegExp("^0x0000000057e.....$")},
        {modelID: "GreenPower_2", ieeeAddr: new RegExp("^0x000000001fa.....$")},
        {modelID: "GreenPower_2", ieeeAddr: new RegExp("^0x0000000034b.....$")},
        {modelID: "GreenPower_2", ieeeAddr: new RegExp("^0x00000000f12.....$")},
        {modelID: "GreenPower_2", ieeeAddr: new RegExp("^0x0000000039a.....$")},
    ],
    model: "SR-ZGP2801K4-DIM",
    vendor: "Sunricher",
    description: "Pushbutton transmitter module",
    fromZigbee: [fz.sunricher_switch2801K4],
    toZigbee: [],
    exposes: [e.action(["press_on", "press_off", "press_high", "press_low", "hold_high", "hold_low", "release"])],
};
