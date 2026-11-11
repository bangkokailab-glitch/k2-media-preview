// Display the received original photographs directly: no video encode or image re-compression.
const photos = [
 ['01-cafe.png',640,360,.34],['02-meeting.png',640,360,.54],
 ['03-pool.png',640,360,.31],['04-bbq.png',640,427,.44],
 ['05-kitchen.png',1672,941,.53],['06-campus.png',640,360,.34],
 ['07-la.png',640,360,.29],['08-airport.png',640,360,.68],
 ['09-paris.png',640,360,.52],['10-office.png',640,360,.61]
];
const stepMs=3000, fadeMs=300;
export function heroSlides(siteAsset) {
 return `<div class="background hero-slideshow" aria-hidden="true" data-scene="1"><div class="hero-slide is-active"><div class="hero-slide-canvas"><img src="${siteAsset('hero-originals/01-cafe.png')}" width="640" height="360" alt="" fetchpriority="high" decoding="async" draggable="false"></div></div></div>`;
}
export function initHeroSlideshow(siteAsset) {
 const stage=document.querySelector('.hero-slideshow'),hero=stage?.closest('.hero');
 if(!stage||stage.dataset.initialized)return;
 stage.dataset.initialized='true';
 const mobile=matchMedia('(max-width:600px)'),desktop=matchMedia('(min-width:601px) and (pointer:fine)'),reduce=matchMedia('(prefers-reduced-motion:reduce)');
 const first=stage.querySelector('.hero-slide');
 const second=first.cloneNode(true);second.classList.remove('is-active');second.querySelector('img').removeAttribute('src');second.querySelector('img').removeAttribute('fetchpriority');stage.append(second);
 const layers=[first,second];layers.forEach((el,i)=>el.dataset.index=i?'1':'0');
 let current=0,active=0,timer=null,generation=0,ready=false,inView=true;
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
 };
 const stop=()=>{clearTimeout(timer);timer=null;generation++;stage.dataset.slideshowStatus=reduce.matches?'reduced-motion':'paused';};
 const arm=()=>{
  clearTimeout(timer);if(!eligible())return;
  stage.dataset.slideshowStatus='playing';
  prime((current+1)%photos.length).catch(()=>{});
  timer=setTimeout(advance,stepMs);
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
   layout();
   // Fade the new photo over an opaque old photo, so the background never flashes through.
   const previous=layers[active];
   previous.style.zIndex='0';layer.style.zIndex='1';layer.classList.add('is-active');
   setTimeout(()=>previous.classList.remove('is-active'),fadeMs+30);
   current=index;active=next;stage.dataset.scene=String(index+1);stage.dataset.transitionMs=String(fadeMs);delete stage.dataset.loadError;
   arm();
  }catch(error){stage.dataset.loadError='true';if(eligible())arm();}
 }
 const resume=()=>{stop();if(eligible())arm();};
 layout();
 const firstImg=first.querySelector('img');
 firstImg.decode().then(()=>{ready=true;stage.dataset.sourceMode='original-png';resume();}).catch(()=>{stage.dataset.loadError='true';});
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
