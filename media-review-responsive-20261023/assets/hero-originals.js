// Latest supplied photographs, encoded at original dimensions as high-quality JPEG.
// Keep the existing kitchen, scene order, timing and centered copy.
const photos = [
 ['hero-photos-20261113/01-cafe.jpg',1672,941,.34],['hero-photos-20261113/02-meeting.jpg',1672,941,.54],
 ['hero-photos-20261113/03-pool.jpg',1672,941,.31],['hero-photos-20261113/04-bbq.jpg',1535,1025,.44],
 ['hero-originals/05-kitchen.png',1672,941,.53],['hero-photos-20261113/06-campus.jpg',1672,941,.34],
 ['hero-photos-20261113/07-la.jpg',1672,941,.29],['hero-photos-20261113/08-airport.jpg',1672,941,.68],
 ['hero-photos-20261113/09-paris.jpg',2560,1440,.52],['hero-photos-20261113/10-office.jpg',1672,941,.61]
];
const stepMs=3000, fadeMs=300;
export function heroSlides(siteAsset) {
 return `<div class="background hero-slideshow" aria-hidden="true" data-scene="1"><div class="hero-slide is-active"><div class="hero-slide-canvas"><img src="${siteAsset(photos[0][0])}" width="1672" height="941" alt="" fetchpriority="high" decoding="async" draggable="false"></div></div></div>`;
}
export function initHeroSlideshow(siteAsset) {
 const stage=document.querySelector('.hero-slideshow'),hero=stage?.closest('.hero');
 if(!stage||stage.dataset.initialized)return;
 stage.dataset.initialized='true';
 const mobile=matchMedia('(max-width:600px)'),desktop=matchMedia('(min-width:601px) and (pointer:fine)'),reduce=matchMedia('(prefers-reduced-motion:reduce)');
 const copy=hero.querySelector('.hero-copy');
 const category=hero.parentElement.querySelector('.categories');
 const syncCategoryHeight=()=>{
  if(category)hero.style.setProperty('--hero-category-height',`${Math.ceil(category.getBoundingClientRect().height)}px`);
 };
 const first=stage.querySelector('.hero-slide');
 const second=first.cloneNode(true);second.classList.remove('is-active');second.querySelector('img').removeAttribute('src');second.querySelector('img').removeAttribute('fetchpriority');stage.append(second);
 const layers=[first,second];layers.forEach((el,i)=>el.dataset.index=i?'1':'0');
 let current=0,active=0,timer=null,generation=0,ready=false,inView=true,transitioning=false;
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 // Match the photograph window, never the subject position. The copy stays
 // centered and visible through every slide, including the crossfade.
 const centerCopy=()=>{
  if(!copy)return;
  const frame=stage.getBoundingClientRect();
  const fixed=getComputedStyle(stage).position==='fixed';
  copy.dataset.position=fixed?'fixed':'absolute';
  copy.style.setProperty('--hero-copy-frame-top',`${fixed?frame.top:frame.top-hero.getBoundingClientRect().top}px`);
  copy.style.setProperty('--hero-copy-frame-height',`${frame.height}px`);
 };
 const cache=new Map();
 const eligible=()=>ready&&inView&&!document.hidden&&!reduce.matches;
 const url=i=>siteAsset(photos[i][0]);
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
    const trialFrame={
     0:{zoom:1.25,cx:.34,faceBottom:485},
     1:{zoom:1.32,cx:.61,faceBottom:505},
     2:{zoom:1.31,cx:.31,faceBottom:505},
     5:{zoom:1.25,cx:.35,faceBottom:485}
    }[index];
    if(trialFrame){
     const titleHeight=copy?.querySelector('h1')?.getBoundingClientRect().height||58;
     const safeZoom=(h/2+titleHeight/2+8)/(h*(1-trialFrame.faceBottom/ih));
     const scale=Math.max(w/iw,h/ih)*Math.max(trialFrame.zoom,safeZoom);
     const cw=iw*scale,ch=ih*scale;
     const left=Math.max(w-cw,Math.min(0,w/2-cw*trialFrame.cx));
     Object.assign(canvas.style,{width:`${cw}px`,height:`${ch}px`,left:`${left}px`,top:`${h-ch}px`});
     img.style.objectPosition='50% 50%';
    }else{
     Object.assign(canvas.style,{width:'100%',height:'100%',left:'0px',top:'0px'});
     const visible=ih*w/h,travel=iw-visible;
     const x=travel>0?Math.max(0,Math.min(1,(iw*cx-visible/2)/travel)):0.5;
     img.style.objectPosition=`${x*100}% 50%`;
    }
   }else{
    let cw=Math.max(w,h*16/9),ch=cw*9/16;
    let left=(w-cw)/2,top=(h-ch)*(desktop.matches?.4:.5);
    // Reframe only these PC photographs. Text, tablet and phone positions stay fixed.
    if(desktop.matches&&index<3){
     const title=copy?.querySelector('h1'),bounds=title?.getBoundingClientRect();
     if(bounds){
      const textLeft=(w-bounds.width)/2,textTop=(h-bounds.height)/2;
      const faceRight=index===0?616:index===2?655:650;
      const gap=index===1?8:18;
      const meetingTextTop=textTop+6,meetingFaceBottom=495,meetingGap=2;
      cw=Math.max(cw,(w-textLeft+gap)/(1-faceRight/iw));
      if(index===1){
       // Keep the three faces above or to the left of the central copy.
       cw=Math.max(cw,(h-meetingTextTop+meetingGap)/(1-meetingFaceBottom/ih)*16/9);
      }
      ch=cw*9/16;left=w-cw;
      top=index===1?Math.max(h-ch,Math.min(0,meetingTextTop-meetingGap-ch*meetingFaceBottom/ih)):(h-ch)*.4;
     }
    }
    Object.assign(canvas.style,{width:`${cw}px`,height:`${ch}px`,left:`${left}px`,top:`${top}px`});
    img.style.objectPosition=index===3?'50% 0%':'50% 50%';
   }
  }
  centerCopy();
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
  transitioning=false;
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
   transitioning=true;
   layout();
   // Fade the new photo over an opaque old photo, so the background never flashes through.
   const previous=layers[active];
   previous.style.zIndex='0';layer.style.zIndex='1';layer.classList.add('is-active');
   setTimeout(()=>{if(stamp===generation)previous.classList.remove('is-active');},fadeMs+30);
   current=index;active=next;stage.dataset.scene=String(index+1);stage.dataset.transitionMs=String(fadeMs);delete stage.dataset.loadError;
   centerCopy();
   await wait(fadeMs+40);
   if(stamp!==generation||!eligible())return;
   transitioning=false;
   arm(stepMs-fadeMs-40);
  }catch(error){transitioning=false;stage.dataset.loadError='true';if(eligible())arm();}
 }
 const resume=()=>{stop();if(eligible())arm();};
 syncCategoryHeight();
 layout();
 const firstImg=first.querySelector('img');
 firstImg.decode().then(()=>{ready=true;stage.dataset.sourceMode='latest-original-dimensions';resume();}).catch(()=>{stage.dataset.loadError='true';});
 document.fonts?.ready.then(layout);
 window.addEventListener('resize',layout,{passive:true});
 if('ResizeObserver'in window){
  new ResizeObserver(layout).observe(stage);
  if(category)new ResizeObserver(syncCategoryHeight).observe(category);
 }
 window.addEventListener('resize',syncCategoryHeight,{passive:true});
 document.addEventListener('visibilitychange',resume);
 window.addEventListener('pageshow',resume);
 reduce.addEventListener('change',resume);
 for(const query of [mobile,desktop])query.addEventListener('change',layout);
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{
  const visible=entries[0].isIntersecting;if(inView===visible)return;inView=visible;resume();
 },{threshold:0}).observe(hero);
}
