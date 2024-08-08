import { app } from 'electron';

const pluginSlug = 'Kemisago';

app.whenReady().then(async () => {
  if(await LiteLoader.api.checkUpdate(pluginSlug)){
    if(await LiteLoader.api.downloadUpdate(pluginSlug)) await LiteLoader.api.showRelaunchDialog(pluginSlug, true);
  }
});