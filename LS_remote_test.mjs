//Version: 0.1.1 (2026.01.12)
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
    command_move_color_temperature_stop: {
        cluster: "lightingColorCtrl",
        type: "commandStopMoveStep",
        convert: function(model, msg, publish, options, meta) {
            if (hasAlreadyProcessedMessage(msg, model)) return;
            const payload = {action: postfixWithEndpointName("color_temperature_move_stop", msg, model, meta)};
            addActionGroup(payload, msg, model);
            return payload;
        },
    },
};

const lsModernExtend = {
    groupIdExpose: (args) => {
        const exposes = [e.numeric("action_group", ea.STATE).withDescription("Group where the action was triggered on")];

        const result = {exposes, isModernExtend: true};

        return result;

    },

    commandsOnOff(args = {}) {
        const {commands = ["on_double", "off_double"], bind = true, endpointNames = undefined} = args;
        let actions = commands;
        if (endpointNames) {
            actions = commands.flatMap((c) => endpointNames.map((e) => `${c}_${e}`));
        }
        const exposes = [e.enum("action", ea.STATE, actions).withDescription("Triggered action (e.g. a button click)")];

        const actionPayloadLookup = {
            commandOnWithRecallGlobalScene: "on_double",
            commandOffWithEffect: "off_double",
        };

        const fromZigbee = [fzLocal.command_on_double, fzLocal.command_off_double];

        const result = {exposes, fromZigbee, isModernExtend: true};

        if (bind) result.configure = [setupConfigureForBinding("genOnOff", "output", endpointNames)];

        return result;

    },

    commandsColorCtrl(args = {}) {
        const {commands = ["color_temperature_move_stop"], bind = true, endpointNames = undefined} = args;
        let actions = commands;
        if (endpointNames) {
            actions = commands.flatMap((c) => endpointNames.map((e) => `${c}_${e}`));
        }
        const exposes = [e.enum("action", ea.STATE, actions).withDescription("Triggered action (e.g. a button click)")];

        const actionPayloadLookup = {commandStopMoveStep: "color_temperature_move_stop"};

        const fromZigbee = [fzLocal.command_move_color_temperature_stop];

        const result = {exposes, fromZigbee, isModernExtend: true};

        if (bind) result.configure = [setupConfigureForBinding("lightingColorCtrl", "output", endpointNames)];

        return result;

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
        lsModernExtend.commandsOnOff(),
        lsModernExtend.commandsColorCtrl(),
        m.commandsOnOff({commands: ["on", "off"]}),
        m.commandsLevelCtrl({
            commands: [
                "brightness_step_up",
                "brightness_step_down",
                "brightness_move_up",
                "brightness_move_down",
                "brightness_stop",
            ],
        }),
        m.commandsColorCtrl({
            commands: [
                "color_temperature_step_up",
                "color_temperature_step_down",
                "color_temperature_move_up",
                "color_temperature_move_down",
            ],
        }),
    ],
};
