(() => {
  if (window.__pcMouseMinimalLoaded) return;
  window.__pcMouseMinimalLoaded = true;

  const defaults = {enabled:true, speed:1.5, size:22};
  let cfg = {...defaults};
  let px = Math.round(innerWidth/2), py = Math.round(innerHeight/2);
  let padPointer = null, lastX = 0, lastY = 0, scrollMode = false;
  let headDrag = null, leftHeld = false;

  const root = document.createElement('div');
  root.id = 'pcm-root';
  root.innerHTML = '<div id="pcm-head"><b>PC MOUSE</b><button id="pcm-hide" title="Ocultar">−</button></div><div id="pcm-pad"><span>Desliza para mover</span></div><div id="pcm-actions"><button id="pcm-left">Izq.</button><button id="pcm-right">Der.</button><button id="pcm-scroll">Rueda</button></div>';
  const cursor = document.createElement('div');
  cursor.id = 'pcm-cursor';
  cursor.innerHTML = '<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><path d="M3 2v18l5-5 4 7 3-2-4-7h7z" fill="#fff" stroke="#111" stroke-width="1.5" stroke-linejoin="round"/></svg>';
  document.documentElement.append(root, cursor);

  const pad = root.querySelector('#pcm-pad');
  const head = root.querySelector('#pcm-head');
  const left = root.querySelector('#pcm-left');
  const right = root.querySelector('#pcm-right');
  const wheel = root.querySelector('#pcm-scroll');
  const hint = pad.querySelector('span');

  function underCursor() {
    const el = document.elementFromPoint(px, py);
    return el && !root.contains(el) && el !== cursor ? el : null;
  }
  function updateCursor() {
    cursor.style.left = Math.max(0, Math.min(innerWidth-1, px)) + 'px';
    cursor.style.top = Math.max(0, Math.min(innerHeight-1, py)) + 'px';
    cursor.style.width = cfg.size + 'px';
    cursor.style.height = cfg.size + 'px';
  }
  function dispatchMouse(type, button=0, buttons=0) {
    const el = underCursor();
    if (!el) return;
    el.dispatchEvent(new MouseEvent(type, {
      bubbles:true, cancelable:true, view:window,
      clientX:px, clientY:py, screenX:px, screenY:py,
      button, buttons
    }));
  }
  function dispatchPointer(type, button=0, buttons=0) {
    const el = underCursor();
    if (!el || !window.PointerEvent) return;
    el.dispatchEvent(new PointerEvent(type, {
      bubbles:true, cancelable:true, view:window,
      clientX:px, clientY:py, pointerId:77,
      pointerType:'mouse', isPrimary:true, button, buttons
    }));
  }
  function move(dx,dy) {
    if (scrollMode) {
      window.scrollBy({top:dy*cfg.speed*2,left:dx*cfg.speed*2,behavior:'auto'});
      return;
    }
    px = Math.max(0,Math.min(innerWidth-1,px+dx*cfg.speed));
    py = Math.max(0,Math.min(innerHeight-1,py+dy*cfg.speed));
    updateCursor();
    dispatchPointer('pointermove',leftHeld?0:-1,leftHeld?1:0);
    dispatchMouse('mousemove',-1,leftHeld?1:0);
  }
  function downLeft() {
    if (leftHeld) return;
    leftHeld = true;
    dispatchPointer('pointerdown',0,1);
    dispatchMouse('mousedown',0,1);
    left.classList.add('active');
  }
  function upLeft() {
    if (!leftHeld) return;
    dispatchPointer('pointerup',0,0);
    dispatchMouse('mouseup',0,0);
    leftHeld = false;
    left.classList.remove('active');
  }
  function rightClick() {
    const el=underCursor(); if(!el)return;
    dispatchPointer('pointerdown',2,2);
    dispatchMouse('mousedown',2,2);
    dispatchPointer('pointerup',2,0);
    dispatchMouse('mouseup',2,0);
    el.dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,cancelable:true,view:window,clientX:px,clientY:py,button:2}));
  }
  function clickLeft(){downLeft();setTimeout(upLeft,70);}

  pad.addEventListener('pointerdown',e=>{
    e.preventDefault(); pad.setPointerCapture(e.pointerId);
    padPointer=e.pointerId;lastX=e.clientX;lastY=e.clientY;
  });
  pad.addEventListener('pointermove',e=>{
    if(padPointer!==e.pointerId)return;
    e.preventDefault();
    const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;
    move(dx,dy);
  });
  const stopPad=e=>{if(padPointer===e.pointerId)padPointer=null;};
  pad.addEventListener('pointerup',stopPad);pad.addEventListener('pointercancel',stopPad);

  left.addEventListener('pointerdown',e=>{e.preventDefault();downLeft();});
  left.addEventListener('pointerup',e=>{e.preventDefault();upLeft();});
  left.addEventListener('pointercancel',upLeft);
  left.addEventListener('pointerleave',e=>{if(leftHeld && e.buttons===0)upLeft();});
  left.addEventListener('click',e=>e.preventDefault());
  right.addEventListener('click',e=>{e.preventDefault();rightClick();});
  wheel.addEventListener('click',()=>{
    scrollMode=!scrollMode;wheel.classList.toggle('active',scrollMode);
    hint.textContent=scrollMode?'Modo rueda: desliza para desplazar':'Desliza para mover';
  });
  root.querySelector('#pcm-hide').addEventListener('click',()=>root.classList.add('hidden'));

  head.addEventListener('pointerdown',e=>{
    if(e.target.id==='pcm-hide')return;
    const r=root.getBoundingClientRect();
    headDrag={x:e.clientX,y:e.clientY,left:r.left,top:r.top};
    head.setPointerCapture(e.pointerId);
  });
  head.addEventListener('pointermove',e=>{
    if(!headDrag)return;
    const nx=Math.max(0,Math.min(innerWidth-root.offsetWidth,headDrag.left+e.clientX-headDrag.x));
    const ny=Math.max(0,Math.min(innerHeight-root.offsetHeight,headDrag.top+e.clientY-headDrag.y));
    root.style.left=nx+'px';root.style.top=ny+'px';root.style.right='auto';root.style.bottom='auto';
  });
  const stopDrag=()=>headDrag=null;
  head.addEventListener('pointerup',stopDrag);head.addEventListener('pointercancel',stopDrag);

  function apply(v) {
    cfg={...cfg,...v};
    root.classList.toggle('hidden',!cfg.enabled);
    updateCursor();
  }
  if (typeof chrome!=='undefined' && chrome.storage?.sync) {
    chrome.storage.sync.get(defaults,apply);
    chrome.storage.onChanged.addListener(changes=>{
      const v={};for(const k in changes)v[k]=changes[k].newValue;apply(v);
    });
  } else apply(defaults);
  window.addEventListener('resize',updateCursor);
  updateCursor();
})();