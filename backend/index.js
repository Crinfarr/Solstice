const fs = require('fs');
const express = require('express');
const BulbController = require('magic-hue-controller');

const config = require('./config.js');

//setup light engines
var lights = JSON.parse(fs.readFileSync('./lights.json'));
var lightEngines = {};

lights.forEach(light => {
    lightEngines[light.name] = {
        controller: new BulbController(light.address),
        model: light.model
    };
});

//init web server
const app = express();

app.post('/', (req, res) => {
    //parse body args
    let body = req.url.substr(2);
    let args = {};
    body.split('&').forEach((pair) => {
        let a = pair.split('=');
        args[a[0]] = a[1];
    });

    console.log(args);

    switch (args.mode) {
        case 'power':
            if (!(args.target in lightEngines)) {
                res.writeHead(422);
                res.end('422 unprocessable\n\ninvalid light id');
                return;
            }

            state = (args.power === 'true');
            lightEngines[args.target].controller.sendPower(state).then(() => {
                // lightEngines[args.target].controller.sendRGB('255,255,255', lightEngines[args.target].model);
                if (state) lightEngines[args.target].controller.sendWarmLevel(255);
                res.writeHead(202);
                res.end();
            }).catch(() => {
                res.writeHead(500);
                res.end();
            });
            break;

        case 'color':
            lightEngines[args.target].controller.sendWarmLevel(0);
            if (!(args.target in lightEngines)) {
                res.writeHead(422);
                res.end('422 unprocessable\n\ninvalid light id');
                return;
            }


            if (!(decodeURIComponent(args.color).match(/^#(?:[0-9a-fA-F]{3}){1,2}$/g))) {
                res.writeHead(422);
                res.end('422 unprocessable\n\ninvalid color format, use #rrggbb');
                return;
            }

            color = {
                r: parseInt(`0x${args.color.substring(3, 5)}`),//#[RR]GGBB
                g: parseInt(`0x${args.color.substring(5, 7)} `),//#RR[GG]BB
                b: parseInt(`0x${args.color.substring(7, 9)} `)//#RRGG[BB]
            };
            console.log(color);

            lightEngines[args.target].controller.sendRGB(`${color.r},${color.g},${color.b}`, lightEngines[args.target].model).then(() => {
                res.writeHead(202);
                res.end();
            }).catch(() => {
                res.writeHead(500);
                res.end();
            });
            break;

        case 'brightness':
            res.writeHead(403);
            res.end('403 forbidden\n\nNYI');
            break;

        default:
            res.writeHead(405);
            res.write('unknown or undefined request');
            res.end();
    }
});

app.get('/', (req, res) => {
    res.writeHead(405);
    res.write('405 Method Not Allowed');
    res.end();
});

app.listen(config.port, () => {
    console.log(`Listening on port ${config.port} `);
});