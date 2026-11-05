// Let long discovery columns scroll naturally, then keep their end in view.
export function initArticleDiscovery(){
 const stack=document.querySelector('.discovery-sticky');
 const discoveryEnd=stack?.querySelector('.discovery-end');
 const header=document.querySelector('.header');
 const actions=document.querySelector('.article-mobile-actions');
 const footer=document.querySelector('.site-footer');
 if(!stack&&!actions)return;
 const desktop=matchMedia('(min-width:1051px)');
 const mobile=matchMedia('(max-width:767px)');
 let frame=0;
 function measure(){
  frame=0;
  if(stack){
   if(!desktop.matches){
    stack.style.removeProperty('--discovery-sticky-top');
    stack.removeAttribute('data-sticky-disabled');
   }
   else{
    const headerBottom=header?.getBoundingClientRect().bottom||0;
    // When the banner and author cannot both fit, keep them reachable by scrolling.
    const endHeight=discoveryEnd?.getBoundingClientRect().height||0;
    stack.toggleAttribute('data-sticky-disabled',endHeight+headerBottom+48>window.innerHeight);
    const top=Math.min(headerBottom+24,window.innerHeight-stack.offsetHeight-24);
    stack.style.setProperty('--discovery-sticky-top',`${Math.round(top)}px`);
   }
  }
  if(actions&&footer){
   const rect=footer.getBoundingClientRect();
   // Hiding does not change the footer's geometry, so the boundary cannot flicker.
   // The hidden attribute also removes both actions from keyboard navigation.
   actions.hidden=mobile.matches&&rect.top<=window.innerHeight&&rect.bottom>=0;
  }
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(measure);}
 const observer=new ResizeObserver(schedule);
 if(stack)observer.observe(stack);
 if(discoveryEnd)observer.observe(discoveryEnd);
 if(header)observer.observe(header);
 if(footer)observer.observe(footer);
 if(actions&&footer){
  const footerObserver=new IntersectionObserver(schedule,{threshold:0});
  footerObserver.observe(footer);
 }
 window.addEventListener('resize',schedule,{passive:true});
 desktop.addEventListener('change',schedule);
 mobile.addEventListener('change',schedule);
 document.fonts.ready.then(schedule);
 measure();
}
