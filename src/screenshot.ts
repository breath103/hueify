import * as Hue from 'node-hue-api';
const screenshot = require('screenshot-desktop');
import * as Jimp from 'jimp';
import Vibrant = require('node-vibrant');
import { setInterval } from 'timers';

async function main() {
  const bridges = await Hue.upnpSearch(3000);
  if (bridges.length == 0) {
    throw new Error("Can't find any bridges");
  }

  bridges.forEach((bridge, index) => {
    console.log(`Bridge[${index}] - ${bridge.id} / ${bridge.ipaddress}`);
  });
  const bridge = bridges[0];

  // const token = undefined;
  const username = "V9muiJack9Ll3AAeE76sm30zj7IOxBQ53S1qHcvN" //"Kurt-Home";

  const api = new Hue.HueApi(
    bridge.ipaddress, username, 2000
  );

  const config = await api.config();
  if (config.linkbutton === undefined) {
    // Not connected yet
    console.log("This is first time. connecting...");
    const token = await api.registerUser(bridge.ipaddress, `Kurt's home controller`);
    console.log(`Username: ${token}`);
  }
  // // const jimp = await Jimp.read(imgBuffer);
  // // console.log(jimp);

  console.log("Get all Lights")
  const { lights } = await api.getLights();
  lights.forEach((light, index) => {
    console.log(`Light[${index}] - ${JSON.stringify(light.state, null, 2)}`);
  })

  // Every 1 seconds.
  console.log("Taking screenshots..");
  const setLightsState = async (state: Hue.lightState.State) => {
    await Promise.all(
      lights.map(async (light) => {
        if (light.id && light.state.on) {
          await api.setLightState(light.id, state);
        }
      })
    );
  };


  setInterval(async () => {
    const imgBuffer = await screenshot();
    const jimp = await Jimp.read(imgBuffer);
    const vibrant = Vibrant.from(imgBuffer);

    const swatches = await vibrant.getSwatches();
    if (swatches.Muted) {
      const color = swatches.Muted.getRgb();
      const newState = Hue.lightState.create().rgb(color[0], color[1], color[2]).transitionTime(4);
      await setLightsState(newState);
    }
  }, 500);
}



main().then(console.log, console.error);
