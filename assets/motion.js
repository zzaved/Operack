(function(){
 var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 // reveal on scroll: h2, paragraphs, stats, quotes, cards
 var sel='section h2, section .two > *, section .big, section .q, section table, section .inv, section .rule, .strip, .hero h1, .hero .lead, .hero .btn';
 var els=[].slice.call(document.querySelectorAll(sel));
 els.forEach(function(e,i){ if(!e.classList.contains('rv')) e.classList.add('rv'); });
 [].slice.call(document.querySelectorAll('.two')).forEach(function(g){[].slice.call(g.children).forEach(function(c,i){c.classList.add('d'+Math.min(i+1,3));});});
 // diagram lines draw themselves
 [].slice.call(document.querySelectorAll('svg.diagram path')).forEach(function(p){
   if(p.getAttribute('stroke-dasharray')||p.getAttribute('filter')) return;
   try{var L=p.getTotalLength(); p.style.strokeDasharray=L; p.style.strokeDashoffset=L; p.classList.add('draw');}catch(e){}
 });
 function countUp(el){
   var t=el.textContent, n=parseFloat(t); if(isNaN(n)) return;
   var suf=t.replace(/[0-9.]/g,''), st=null;
   function f(ts){ if(!st) st=ts; var k=Math.min((ts-st)/1100,1); k=1-Math.pow(1-k,3); el.textContent=Math.round(n*k)+suf; if(k<1) requestAnimationFrame(f); }
   requestAnimationFrame(f);
 }
 var io=new IntersectionObserver(function(es){es.forEach(function(e){
   if(!e.isIntersecting) return; var t=e.target; t.classList.add('in');
   if(t.matches('svg.diagram')) [].slice.call(t.querySelectorAll('path.draw')).forEach(function(p,i){setTimeout(function(){p.style.strokeDashoffset=0;},i*60);});
   if(t.classList.contains('big') && !reduce) countUp(t);
   io.unobserve(t);
 });},{threshold:.18,rootMargin:'0px 0px -8% 0px'});
 if(reduce){ els.concat([].slice.call(document.querySelectorAll('.rv'))).forEach(function(e){e.classList.add('in');}); document.querySelectorAll('path.draw').forEach(function(p){p.style.strokeDashoffset=0;}); return; }
 [].slice.call(document.querySelectorAll('.rv')).forEach(function(e){io.observe(e);});
 // scroll velocity -> horizontal motion blur on the hero image; parallax on hero and streaks
 var img=document.querySelector('.hero .heroimg'), std=document.getElementById('velstd'), strips=[].slice.call(document.querySelectorAll('.strip'));
 var lastY=window.scrollY, v=0, ticking=false;
 function frame(){
   var y=window.scrollY; v=v*0.82+Math.abs(y-lastY)*0.18; lastY=y;
   if(std) std.setAttribute('stdDeviation',Math.min(v*1.6,40).toFixed(1)+' 0');
   if(img) img.style.transform='translateX('+(y*0.35)+'px)';
   strips.forEach(function(s){var r=s.getBoundingClientRect(); var c=(r.top+r.height/2-window.innerHeight/2); s.style.transform='translateX('+(-c*0.12)+'px) scaleX(1.08)';});
   if(v>0.3) requestAnimationFrame(frame); else { ticking=false; if(std) std.setAttribute('stdDeviation','0 0'); }
 }
 window.addEventListener('scroll',function(){ if(!ticking){ticking=true; requestAnimationFrame(frame);} },{passive:true});
})();
