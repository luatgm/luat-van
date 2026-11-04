
(() => {
  const pages=[...document.querySelectorAll('.book > .sheet')];
  const prev=document.getElementById('prev'), next=document.getElementById('next');
  const flip=document.getElementById('flip'), counter=document.getElementById('counter');
  const book=document.querySelector('.book');
  let current=0, busy=false;
  function sync(){
    pages.forEach((p,i)=>{
      p.classList.toggle('is-active',i===current);
      p.classList.remove('turning');
      p.hidden=i!==current;
    });
    counter.textContent=`${current+1} / ${pages.length}`;
    prev.disabled=current===0;
    next.disabled=current===pages.length-1;
    flip.textContent=current===pages.length-1?'↶ Về bìa thiệp':'📖 Lật trang';
  }
  function go(index){
    if(busy||index<0||index>=pages.length||index===current)return;
    busy=true;
    const old=pages[current];
    const forward=index>current;
    if(forward && !matchMedia('(prefers-reduced-motion: reduce)').matches){
      old.classList.add('turning');
      setTimeout(()=>{current=index;sync();busy=false},480);
    }else{
      current=index;sync();busy=false;
    }
  }
  prev.addEventListener('click',()=>go(current-1));
  next.addEventListener('click',()=>go(current+1));
  flip.addEventListener('click',()=>go(current===pages.length-1?0:current+1));
  let startX=0;
  book.addEventListener('touchstart',e=>{startX=e.changedTouches[0].screenX},{passive:true});
  book.addEventListener('touchend',e=>{
    const d=e.changedTouches[0].screenX-startX;
    if(Math.abs(d)>45)go(current+(d<0?1:-1));
  },{passive:true});
  document.addEventListener('keydown',e=>{
    if(e.key==='ArrowRight')go(current+1);
    if(e.key==='ArrowLeft')go(current-1);
  });
  const to=new URLSearchParams(location.search).get('to');
  if(to){
    document.querySelectorAll('.guest').forEach(el=>el.textContent=to.slice(0,100));
  }
  sync();
})();
