// Background media only: no playback UI, with a static poster when autoplay is unavailable.
export function initBackgroundVideo(siteAsset){
 const video=document.querySelector('#background-video');
 if(!video)return;
 const poster=document.querySelector('.hero-poster');
 const mobile=matchMedia('(max-width:600px)'), reduce=matchMedia('(prefers-reduced-motion:reduce)');
 let generation=0;
 const hide=()=>video.classList.remove('is-playing');
 video.controls=false;video.removeAttribute('controls');
 video.muted=true;video.defaultMuted=true;video.playsInline=true;
 video.setAttribute('muted','');video.setAttribute('playsinline','');video.setAttribute('webkit-playsinline','');
 video.setAttribute('disablepictureinpicture','');video.setAttribute('disableremoteplayback','');
 video.addEventListener('playing',()=>{if(!reduce.matches&&!document.hidden)video.classList.add('is-playing')});
 video.addEventListener('pause',hide);video.addEventListener('error',hide);video.addEventListener('emptied',hide);
 const start=()=>{
  if(reduce.matches||document.hidden){video.pause();hide();return;}
  video.muted=true;const request=generation;
  const result=video.play();
  result?.catch(()=>{if(request===generation)hide()});
 };
 const source=()=>{
  generation++;hide();
  const time=Number.isFinite(video.currentTime)?video.currentTime:0;
  const url=siteAsset(mobile.matches?'k2-background-mobile-30s.mp4':'k2-background-30s.mp4');
  const still=siteAsset(mobile.matches?'poster-mobile.jpg':'poster.jpg');
  video.poster=still;if(poster)poster.src=still;
  video.autoplay=!reduce.matches;
  video.addEventListener('loadedmetadata',()=>{if(time>0&&Number.isFinite(video.duration))video.currentTime=Math.min(time,video.duration-.1)},{once:true});
  video.src=url;video.load();start();
 };
 mobile.addEventListener('change',source);
 reduce.addEventListener('change',()=>{video.autoplay=!reduce.matches;start()});
 document.addEventListener('visibilitychange',start);
 window.addEventListener('pageshow',start);
 source();
}
