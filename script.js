const spreads=[...document.querySelectorAll('.spread')];
const sheets=spreads.flatMap(spread=>[...spread.querySelectorAll('.sheet')]);
const prev=document.getElementById('prev'),next=document.getElementById('next'),flip=document.getElementById('flip'),counter=document.getElementById('counter');
const mq=window.matchMedia('(max-width: 700px)');
let current=0;
function total(){return mq.matches?sheets.length:spreads.length}
function show(i,dir=1){
 const count=total();if(i<0||i>=count)return;
 current=i;
 spreads.forEach((spread,idx)=>{
  const active=mq.matches?Math.floor(i/2)===idx:i===idx;
  spread.hidden=!active;
  const children=[...spread.querySelectorAll('.sheet')];
  children.forEach((sheet,j)=>{sheet.hidden=mq.matches?(!active||i%2!==j):!active});
  if(active){spread.classList.remove('flip-next','flip-prev');void spread.offsetWidth;spread.classList.add(dir>0?'flip-next':'flip-prev')}
 });
 prev.disabled=i===0;next.disabled=i===count-1;
 flip.textContent=i===count-1?'↶ Về bìa thiệp':'📖 Lật thiệp';
 counter.textContent=`${i+1} / ${count}`;
}
prev.addEventListener('click',()=>show(current-1,-1));
next.addEventListener('click',()=>show(current+1,1));
flip.addEventListener('click',()=>show(current===total()-1?0:current+1,current===total()-1?-1:1));
const book=document.querySelector('.book');let startX=null;
book.addEventListener('touchstart',e=>{startX=e.touches[0].clientX},{passive:true});
book.addEventListener('touchend',e=>{if(startX===null)return;const delta=e.changedTouches[0].clientX-startX;if(Math.abs(delta)>40)show(current+(delta<0?1:-1),delta<0?1:-1);startX=null},{passive:true});
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')show(current+1,1);if(e.key==='ArrowLeft')show(current-1,-1)});
mq.addEventListener('change',()=>show(0));
const name=new URLSearchParams(location.search).get('to');if(name){document.querySelectorAll('.guest').forEach(el=>el.textContent=name.slice(0,100))}
show(0);
