import {initArticleDiscovery} from './article-discovery.js?v=20261031-client-sync';
import {initBackgroundVideo} from './background-video.js?v=20261031-client-sync';
// Client review is display-only. Keep markup/layout and text selection intact.
export function initPreviewMode(root) {
  root.querySelectorAll('a').forEach(link => {
    for (const attribute of ['href', 'target', 'download', 'ping', 'data-pending']) {
      link.removeAttribute(attribute);
    }
    link.dataset.previewInert = '';
    link.setAttribute('role', 'link');
    link.setAttribute('aria-disabled', 'true');
    link.setAttribute('tabindex', '-1');
    link.setAttribute('draggable', 'false');
  });
  const isPreviewLink = event => event.target instanceof Element &&
    event.target.closest('[data-preview-inert]');
  const stop = event => {
    event.preventDefault();
    event.stopImmediatePropagation();
  };
  ['click', 'auxclick', 'dragstart'].forEach(type => {
    root.addEventListener(type, event => {
      if (isPreviewLink(event)) stop(event);
    }, true);
  });
  root.addEventListener('keydown', event => {
    if (isPreviewLink(event) && ['Enter', ' '].includes(event.key)) stop(event);
  }, true);
  // Prevent search/contact navigation even when a lower-page URL is opened directly.
  root.querySelectorAll('form').forEach(form => {
    form.removeAttribute('action');
    form.removeAttribute('target');
    form.querySelectorAll('button[type="submit"], input[type="submit"]').forEach(button => {
      button.disabled = true;
    });
  });
  root.addEventListener('submit', stop, true);
}

initPreviewMode(document.querySelector('#app'));
const menu=document.querySelector('.menu-toggle'),masthead=document.querySelector('.header');
function closeMenu(){masthead?.classList.remove('menu-open');menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','メニューを開く')}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';masthead.classList.toggle('menu-open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'メニューを閉じる':'メニューを開く')});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
document.addEventListener('click',e=>{if(masthead&&!masthead.contains(e.target))closeMenu()});
matchMedia('(max-width:767px)').addEventListener('change',closeMenu);
if(document.body.dataset.page==='article')initArticleDiscovery();
initBackgroundVideo(name=>new URL('media/'+name,import.meta.url).href);
