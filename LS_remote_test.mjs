//Version: 0.1.2 (2026.01.13)
import * as m from "zigbee-herdsman-converters/lib/modernExtend";
import {setupConfigureForBinding} from "zigbee-herdsman-converters/lib/modernExtend";
import {presets as e, access as ea} from "zigbee-herdsman-converters/lib/exposes";
import {
    addActionGroup,
    hasAlreadyProcessedMessage,
    postfixWithEndpointName,
} from "zigbee-herdsman-converters/lib/utils";

const fzLocal = {
    command_on_double: {
        cluster: "genOnOff",
        type: "commandOnWithRecallGlobalScene",
        convert: function(model, msg, publish, options, meta) {
            if (hasAlreadyProcessedMessage(msg, model)) return;
            const payload = {action: postfixWithEndpointName("on_double", msg, model, meta)};
            addActionGroup(payload, msg, model);
            return payload;
        },
    },

    command_off_double: {
        cluster: "genOnOff",
        type: "commandOffWithEffect",
        convert: function(model, msg, publish, options, meta) {
            if (hasAlreadyProcessedMessage(msg, model)) return;
            const payload = {action: postfixWithEndpointName("off_double", msg, model, meta)};
            addActionGroup(payload, msg, model);
            return payload;
        },
    },
    command_stop_move_step: {
        cluster: "lightingColorCtrl",
        type: "commandStopMoveStep",
        convert: function(model, msg, publish, options, meta) {
            if (hasAlreadyProcessedMessage(msg, model)) return;
            const payload = {action: postfixWithEndpointName("stop_move_step", msg, model, meta)};
            addActionGroup(payload, msg, model);
            return payload;
        },
    },
};

const lsModernExtend = {
    groupIdExpose: function() {
        const result = {
            exposes: [e.numeric("action_group", ea.STATE).withDescription("Group where the action was triggered on")],
            isModernExtend: true,
        };

        return result;
    },

    commandsOnOffDouble: function() {
        return {
            exposes: [
                e.enum("action", ea.STATE, ["on_double", "off_double"])
                    .withDescription("Triggered action (e.g. a button click)")
                    .withCategory("diagnostic"),
            ],
            fromZigbee: [fzLocal.command_on_double, fzLocal.command_off_double],
            isModernExtend: true,
            configure: [setupConfigureForBinding("genOnOff", "output")],
        };
    },

    commandsColorCtrl: function() {
        return {
            exposes: [
                e.enum("action", ea.STATE, ["stop_move_step"])
                    .withDescription("Triggered action (e.g. a button click)")
                    .withCategory("diagnostic"),
            ],
            fromZigbee: [fzLocal.command_stop_move_step],
            isModernExtend: true,
            configure: [setupConfigureForBinding("lightingColorCtrl", "output")],
        };
    },
};

export default {
    zigbeeModel: ["SEMOTE"],
    model: "756200643",
    vendor: "L&S Lighting",
    description: "Zigbee remote",
    extend: [
        m.battery(),
        lsModernExtend.groupIdExpose(),
        lsModernExtend.commandsOnOffDouble(),
        lsModernExtend.commandsColorCtrl(),
        m.commandsOnOff({commands: ["on", "off"]}),
        m.commandsLevelCtrl({
            commands: [
                "brightness_step_up",
                "brightness_step_down",
                "brightness_stop",
            ],
        }),
        m.commandsColorCtrl({
            commands: [
                "color_temperature_step_up",
                "color_temperature_step_down",
            ],
        }),
    ],
};
