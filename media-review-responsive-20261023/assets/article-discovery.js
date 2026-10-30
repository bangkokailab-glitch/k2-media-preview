// Let long discovery columns scroll naturally, then keep their end in view.
export function initArticleDiscovery(){
 const stack=document.querySelector('.discovery-sticky');
 const header=document.querySelector('.header');
 if(!stack)return;
 const desktop=matchMedia('(min-width:1051px)');
 let frame=0;
 function measure(){
  frame=0;
  if(!desktop.matches){stack.style.removeProperty('--discovery-sticky-top');return;}
  const headerBottom=header?.getBoundingClientRect().bottom||0;
  const top=Math.min(headerBottom+24,window.innerHeight-stack.offsetHeight-24);
  stack.style.setProperty('--discovery-sticky-top',`${Math.round(top)}px`);
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(measure);}
 const observer=new ResizeObserver(schedule);
 observer.observe(stack);if(header)observer.observe(header);
 window.addEventListener('resize',schedule,{passive:true});
 desktop.addEventListener('change',schedule);
 document.fonts.ready.then(schedule);
 measure();
}
