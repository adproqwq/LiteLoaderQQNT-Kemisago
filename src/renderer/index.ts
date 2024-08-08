import observeElement from '../utils/observeElement';
import { log } from '../utils/log';
import convert from '../utils/convert';
import { config } from '../config/config';

const pluginSlug = 'Kemisago';

const barIconClick = async () => {
  const text = (document.querySelector('.ck.ck-content.ck-editor__editable p') as HTMLParagraphElement).textContent;

  if(text){
    const result = await convert(text);
    navigator.clipboard.writeText(result).then(() => {
      new Notification('Kemisago', {
        icon: `${LiteLoader.plugins[pluginSlug].path.plugin}/assets/barIcon.svg`,
        body: '转换结果已复制到剪贴版',
        requireInteraction: false,
      });
    });
  }
};

const onMessageLoad = async () => {
  const iconSvg = await (await fetch(`local:///${LiteLoader.plugins[pluginSlug].path.plugin}/assets/barIcon.svg`)).text();
  const qTooltips = document.createElement('div');
  const qTooltipsContent = document.createElement('div');
  const icon = document.createElement('i');
  const barIcon = document.createElement('div');
  
  barIcon.classList.add('Kemisago-bar');
  barIcon.appendChild(qTooltips);
  
  qTooltips.classList.add('Kemisago-q-tooltips');
  qTooltips.addEventListener('click', barIconClick);
  qTooltips.appendChild(icon);
  qTooltips.appendChild(qTooltipsContent);
  
  qTooltipsContent.classList.add('Kemisago-q-tooltips__content');
  qTooltipsContent.innerText = 'Kemisago转换';
  
  icon.classList.add('Kemisago-q-icon');
  icon.innerHTML = iconSvg;

  document.querySelector('.chat-func-bar')!.lastElementChild!.appendChild(barIcon);
  log('创建工具栏图标完成');
};

const style = document.createElement('link');
style.rel = 'stylesheet';
style.href = `local:///${LiteLoader.plugins[pluginSlug].path.plugin}/style/global.css`;
document.head.appendChild(style);
log('加载样式文件完成');

observeElement('.chat-func-bar', async () => {
  if(document.getElementsByClassName('Kemisago-bar').length == 0) await onMessageLoad();
}, true);

export const onSettingWindowCreated = async (view: HTMLElement) => {
  let userConfig = await LiteLoader.api.config.get(pluginSlug, config);
  view.innerHTML = await (await fetch(`local:///${LiteLoader.plugins[pluginSlug].path.plugin}/pages/settings.html`)).text();

  (view.querySelector('#pluginVersion') as HTMLParagraphElement).innerHTML = LiteLoader.plugins[pluginSlug].manifest.version;
  if(userConfig.ignoreTones) (view.querySelector('#ignoreTones') as HTMLButtonElement).setAttribute('is-active', '');

  (view.querySelector('#ignoreTones') as HTMLButtonElement).addEventListener('click', async () => {
    let userConfig = await LiteLoader.api.config.get(pluginSlug, config);
    if(userConfig.ignoreTones){
      userConfig.ignoreTones = false;
      (view.querySelector('#ignoreTones') as HTMLButtonElement).removeAttribute('is-active');
    }
    else{
      userConfig.ignoreTones = true;
      (view.querySelector('#ignoreTones') as HTMLButtonElement).setAttribute('is-active', '');
    }
    await LiteLoader.api.config.set(pluginSlug, userConfig);
  });

  (view.querySelector('#github') as HTMLButtonElement).addEventListener('click', () => {
    LiteLoader.api.openExternal('https://github.com/adproqwq/LiteLoaderQQNT-Kemisago');
  });
};