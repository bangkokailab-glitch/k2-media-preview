import {initBackgroundVideo} from './background-video.js?v=20261023-reading';
const siteAsset=name=>new URL('./media/'+name,import.meta.url).href;
const menu=document.querySelector('.menu-toggle'), masthead=document.querySelector('.header');
function closeMenu(){masthead?.classList.remove('menu-open');menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','メニューを開く')}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';masthead.classList.toggle('menu-open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'メニューを閉じる':'メニューを開く')});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});document.addEventListener('click',e=>{if(masthead&&!masthead.contains(e.target))closeMenu()});matchMedia('(max-width:1100px)').addEventListener('change',closeMenu);
// Display-only snapshot: links have no destinations, including new-tab navigation.
document.addEventListener('click',event=>{if(event.target.closest('a')){event.preventDefault();event.stopImmediatePropagation()}},true);
document.addEventListener('auxclick',event=>{if(event.target.closest('a'))event.preventDefault()},true);
initBackgroundVideo(siteAsset);
