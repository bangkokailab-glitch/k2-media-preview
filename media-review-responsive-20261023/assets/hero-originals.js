// Display the received original photographs directly: no video encode or image re-compression.
const photos = [
 ['01-cafe.png',640,360,.34],['02-meeting.png',640,360,.54],
 ['03-pool.png',640,360,.31],['04-bbq.png',640,427,.44],
 ['05-kitchen.png',1672,941,.53],['06-campus.png',640,360,.34],
 ['07-la.png',640,360,.29],['08-airport.png',640,360,.68],
 ['09-paris.png',640,360,.52],['10-office.png',640,360,.61]
];
// Face/head rectangles reviewed against each supplied original, in source pixels.
// Preserve source photos/ratios; prefer moving the centered copy into free space.
const faceAreas = [
 [[154,90,245,190],[78,140,124,183],[265,150,337,195],[379,158,628,224]],
 [[142,111,263,222],[279,98,369,199],[440,120,523,212]],
 [[87,128,151,198],[204,143,266,212]],
 [[8,68,43,110],[80,82,113,126],[106,76,179,163],[270,91,328,163],[429,49,493,137],[507,79,578,166],[563,108,640,212],[204,156,267,228],[322,212,375,262]],
 [[483,162,630,318],[936,263,1052,383],[1060,419,1189,551],[1197,405,1341,553]],
 [[93,142,140,189],[197,84,254,141],[284,143,347,217],[350,183,640,222]],
 [[134,190,157,213],[171,197,195,229]],
 [[428,144,479,201],[199,144,223,173],[283,115,299,137],[169,138,184,158],[122,150,138,169],[82,140,100,161]],
 [[24,165,47,187],[47,211,78,245],[78,202,109,241],[130,209,156,241],[165,211,198,245],[344,201,363,224],[311,208,425,240]],
 []
];
const stepMs=3000, fadeMs=300, copyFadeMs=140;
export function heroSlides(siteAsset) {
 return `<div class="background hero-slideshow" aria-hidden="true" data-scene="1"><div class="hero-slide is-active"><div class="hero-slide-canvas"><img src="${siteAsset('hero-originals/01-cafe.png')}" width="640" height="360" alt="" fetchpriority="high" decoding="async" draggable="false"></div></div></div>`;
}
export function initHeroSlideshow(siteAsset) {
 const stage=document.querySelector('.hero-slideshow'),hero=stage?.closest('.hero');
 if(!stage||stage.dataset.initialized)return;
 stage.dataset.initialized='true';
 const mobile=matchMedia('(max-width:600px)'),desktop=matchMedia('(min-width:601px) and (pointer:fine)'),reduce=matchMedia('(prefers-reduced-motion:reduce)');
 const copy=hero.querySelector('.hero-copy'),title=copy?.querySelector('h1');
 const first=stage.querySelector('.hero-slide');
 const second=first.cloneNode(true);second.classList.remove('is-active');second.querySelector('img').removeAttribute('src');second.querySelector('img').removeAttribute('fetchpriority');stage.append(second);
 const layers=[first,second];layers.forEach((el,i)=>el.dataset.index=i?'1':'0');
 let current=0,active=0,timer=null,generation=0,ready=false,inView=true,transitioning=false;
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 const placeCopy=()=>{
  if(!copy||!title)return;
  title.style.removeProperty('letter-spacing');
  const frame=stage.getBoundingClientRect(),image=layers[active].querySelector('img');
  let rect=image.getBoundingClientRect();
  let text=title.getBoundingClientRect();
  if(!frame.width||!frame.height||!text.height)return;
  const [,iw,ih]=photos[current],scale=Math.max(rect.width/iw,rect.height/ih);
  const [px,py]=getComputedStyle(image).objectPosition.split(' ').map(v=>parseFloat(v)/100);
  const gap=14,edge=12,maxTop=frame.height-edge-text.height,center=(frame.height-text.height)/2;
  const candidatesForFrame=()=>{
   text=title.getBoundingClientRect();
   const left=(frame.width-text.width)/2,right=left+text.width;
   rect=image.getBoundingClientRect();
   const ox=rect.left-frame.left+(rect.width-iw*scale)*px;
   const oy=rect.top-frame.top+(rect.height-ih*scale)*py;
   const faces=faceAreas[current].map(([x1,y1,x2,y2])=>({
    left:ox+x1*scale,right:ox+x2*scale,top:oy+y1*scale,bottom:oy+y2*scale
   })).filter(f=>f.right>left-gap&&f.left<right+gap&&f.bottom>0&&f.top<frame.height);
   const fits=y=>y>=edge&&y<=maxTop&&faces.every(f=>y+text.height+gap<=f.top||y-gap>=f.bottom);
   return [center,edge,maxTop,...faces.flatMap(f=>[f.top-gap-text.height,f.bottom+gap])]
    .filter(fits).sort((a,b)=>Math.abs(a-center)-Math.abs(b-center));
  };
  let safe=candidatesForFrame();
  // Short PC windows can crop away all free space below the BBQ faces.
  // Try another vertical crop, still filling the frame at the original ratio.
  // Prefer retaining the top of the photograph (and people's heads).
  const canvas=image.parentElement,originalTop=canvas.style.top;
  if(!safe.length&&!mobile.matches){
   // Tighten only tracking (never font size) when free space is especially
   // narrow. Try the smallest crop adjustment first, retaining the faces.
   const tracking=parseFloat(getComputedStyle(title).letterSpacing);
   for(const tighter of [false,true]){
    if(tighter){if(tracking<=4)break;title.style.letterSpacing='4px';}
    for(const fraction of [1,.75,.5,.25,0]){
     canvas.style.top=`${parseFloat(originalTop)*fraction}px`;
     safe=candidatesForFrame();if(safe.length)break;
    }
    if(safe.length)break;
   }
   if(!safe.length){canvas.style.top=originalTop;safe=candidatesForFrame();}
  }
  const fixed=getComputedStyle(stage).position==='fixed';
  const top=safe.length?safe[0]:Math.max(0,center);
  copy.dataset.position=fixed?'fixed':'absolute';
  copy.style.setProperty('--hero-copy-top',`${(fixed?frame.top:frame.top-hero.getBoundingClientRect().top)+top}px`);
  hero.dataset.copyPlacement=safe.length?'face-safe':'needs-space';
  hero.dataset.copyReady='true';
 };
 const cache=new Map();
 const eligible=()=>ready&&inView&&!document.hidden&&!reduce.matches;
 const url=i=>siteAsset('hero-originals/'+photos[i][0]);
 const prime=i=>{
  if(cache.has(i))return cache.get(i);
  const img=new Image();img.decoding='async';img.src=url(i);
  const request=img.decode().then(()=>img).catch(error=>{cache.delete(i);throw error;});cache.set(i,request);return request;
 };
 const layout=()=>{
  hero.classList.toggle('hero-scroll-frame',innerWidth>600&&hero.offsetHeight>innerHeight);
  const {width:w,height:h}=stage.getBoundingClientRect();
  if(!w||!h)return;
  for(const layer of layers){
   const index=Number(layer.dataset.index),[,iw,ih,cx]=photos[index],canvas=layer.firstElementChild,img=canvas.firstElementChild;
   if(mobile.matches){
    Object.assign(canvas.style,{width:'100%',height:'100%',left:'0px',top:'0px'});
    const visible=ih*w/h,travel=iw-visible;
    const x=travel>0?Math.max(0,Math.min(1,(iw*cx-visible/2)/travel)):0.5;
    img.style.objectPosition=`${x*100}% 50%`;
   }else{
    const cw=Math.max(w,h*16/9),ch=cw*9/16;
    Object.assign(canvas.style,{width:`${cw}px`,height:`${ch}px`,left:`${(w-cw)/2}px`,top:`${(h-ch)*(desktop.matches?.4:.5)}px`});
    img.style.objectPosition=index===3?'50% 0%':'50% 50%';
   }
  }
  placeCopy();
 };
 const stop=()=>{
  clearTimeout(timer);timer=null;generation++;
  if(transitioning){
   for(const [i,layer]of layers.entries()){
    layer.style.transition='none';layer.classList.toggle('is-active',i===active);layer.style.zIndex=i===active?'1':'0';
   }
   void stage.offsetWidth;
   layers.forEach(layer=>layer.style.removeProperty('transition'));
  }
  transitioning=false;copy?.classList.remove('is-changing');placeCopy();
  stage.dataset.slideshowStatus=reduce.matches?'reduced-motion':'paused';
 };
 const arm=(delay=stepMs)=>{
  clearTimeout(timer);if(!eligible())return;
  stage.dataset.slideshowStatus='playing';
  prime((current+1)%photos.length).catch(()=>{});
  timer=setTimeout(advance,delay);
 };
 async function advance(){
  timer=null;if(!eligible())return;
  const stamp=generation,index=(current+1)%photos.length;
  try{
   await prime(index);
   if(stamp!==generation||!eligible())return;
   const next=1-active,layer=layers[next],img=layer.querySelector('img');
   layer.dataset.index=String(index);img.src=url(index);img.width=photos[index][1];img.height=photos[index][2];
   await img.decode();
   if(stamp!==generation||!eligible())return;
   // Hide the copy while BOTH faces are visible during the photograph dissolve.
   transitioning=true;copy?.classList.add('is-changing');
   await wait(copyFadeMs+20);
   if(stamp!==generation||!eligible())return;
   layout();
   // Fade the new photo over an opaque old photo, so the background never flashes through.
   const previous=layers[active];
   previous.style.zIndex='0';layer.style.zIndex='1';layer.classList.add('is-active');
   setTimeout(()=>{if(stamp===generation)previous.classList.remove('is-active');},fadeMs+30);
   current=index;active=next;stage.dataset.scene=String(index+1);stage.dataset.transitionMs=String(fadeMs);delete stage.dataset.loadError;
   placeCopy();
   await wait(fadeMs+40);
   if(stamp!==generation||!eligible())return;
   transitioning=false;copy?.classList.remove('is-changing');
   arm(stepMs-copyFadeMs-60-fadeMs);
  }catch(error){transitioning=false;copy?.classList.remove('is-changing');stage.dataset.loadError='true';if(eligible())arm();}
 }
 const resume=()=>{stop();if(eligible())arm();};
 layout();
 const firstImg=first.querySelector('img');
 firstImg.decode().then(()=>{ready=true;stage.dataset.sourceMode='original-png';resume();}).catch(()=>{stage.dataset.loadError='true';});
 document.fonts?.ready.then(layout);
 window.addEventListener('resize',layout,{passive:true});
 if('ResizeObserver'in window)new ResizeObserver(layout).observe(stage);
 document.addEventListener('visibilitychange',resume);
 window.addEventListener('pageshow',resume);
 reduce.addEventListener('change',resume);
 for(const query of [mobile,desktop])query.addEventListener('change',layout);
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{
  const visible=entries[0].isIntersecting;if(inView===visible)return;inView=visible;resume();
 },{threshold:0}).observe(hero);
}
