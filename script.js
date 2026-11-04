const pages=[...document.querySelectorAll('.book .flip-page')];
const prev=document.getElementById('prev');
const next=document.getElementById('next');
const flip=document.getElementById('flip');
const counter=document.getElementById('counter');
let current=0, busy=false;
function refresh(){
 pages.forEach((p,i)=>{p.hidden=i!==current;p.style.transform='';p.style.opacity='';p.style.zIndex='';});
 counter.textContent=`${current+1} / ${pages.length}`;
 prev.disabled=current===0;next.disabled=current===pages.length-1;
 flip.textContent=current===pages.length-1?'↶ Về bìa thiệp':'📖 Lật trang';
}
async function turn(target){
 if(busy||target<0||target>=pages.length||target===current)return;
 busy=true;
 const forward=target>current;
 const oldPage=pages[current],newPage=pages[target];
 newPage.hidden=false;
 newPage.style.zIndex='1';oldPage.style.zIndex='2';
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(!reduce){
  const duration=620;
  const oldAnim=oldPage.animate([
   {transform:'rotateY(0deg)',filter:'brightness(1)',opacity:1},
   {transform:`rotateY(${forward?-88:88}deg)`,filter:'brightness(.8)',opacity:.55}
  ],{duration,easing:'cubic-bezier(.45,0,.25,1)',fill:'forwards'});
  await oldAnim.finished.catch(()=>{});
  oldAnim.cancel();
 }
 current=target;
 refresh();busy=false;
}
prev.addEventListener('click',()=>turn(current-1));
next.addEventListener('click',()=>turn(current+1));
flip.addEventListener('click',()=>turn(current===pages.length-1?0:current+1));
const book=document.querySelector('.book');let startX=null;
book.addEventListener('touchstart',e=>{startX=e.touches[0].clientX},{passive:true});
book.addEventListener('touchend',e=>{if(startX===null)return;const dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>45)turn(current+(dx<0?1:-1));startX=null},{passive:true});
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')turn(current+1);if(e.key==='ArrowLeft')turn(current-1)});
const guest=new URLSearchParams(location.search).get('to');if(guest){document.querySelectorAll('.guest').forEach(el=>el.textContent=guest.slice(0,100));}
refresh();
