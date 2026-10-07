(() => {
  'use strict';

  // Универсальная система собираемых объектов для всех детективных историй.
  // Координаты и размеры всегда задаются в процентах от общей 16:9 scene-stage,
  // поэтому объект масштабируется и кадрируется вместе с фоном локации.
  const clamp = (value, min, max, fallback) => {
    const n = Number(value);
    return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
  };

  function resolveHost(host){
    if(!host) return null;
    return typeof host === 'string' ? document.querySelector(host) : host;
  }

  function itemBox(item){
    return {
      x: clamp(item?.x, -50, 150, 0),
      y: clamp(item?.y, -50, 150, 0),
      w: clamp(item?.w, .1, 150, 10),
      h: clamp(item?.h, .1, 150, 10),
      rotate: clamp(item?.rotate, -360, 360, 0),
      z: clamp(item?.z, 0, 99, 1),
      hitPad: clamp(item?.hitPad, 0, 40, 4)
    };
  }

  function render(options={}){
    const host = resolveHost(options.host);
    if(!host) return [];

    const items = Array.isArray(options.items) ? options.items : [];
    const isAvailable = typeof options.isAvailable === 'function' ? options.isAvailable : (()=>true);
    const isCollected = typeof options.isCollected === 'function' ? options.isCollected : (()=>false);
    const onCollect = typeof options.onCollect === 'function' ? options.onCollect : (()=>{});

    host.replaceChildren();
    const visible=[];

    items.forEach(item=>{
      if(!item || !item.id || !item.image) return;
      if(!isAvailable(item) || isCollected(item)) return;

      const box=itemBox(item);
      const button=document.createElement('button');
      button.type='button';
      button.className='collectible-object';
      button.dataset.collectibleId=item.id;
      button.setAttribute('aria-label', item.label || 'Улика');
      button.style.left=`${box.x}%`;
      button.style.top=`${box.y}%`;
      button.style.width=`${box.w}%`;
      button.style.height=`${box.h}%`;
      button.style.zIndex=String(box.z);
      button.style.setProperty('--collectible-rotate', `${box.rotate}deg`);
      button.style.setProperty('--collectible-hit-pad', `${box.hitPad}px`);

      const image=document.createElement('img');
      image.className='collectible-object-image';
      image.src=item.image;
      image.alt='';
      image.draggable=false;
      button.appendChild(image);

      const label=document.createElement('span');
      label.className='collectible-object-label';
      label.textContent=item.label || 'Улика';
      button.appendChild(label);

      button.addEventListener('click', event=>{
        event.preventDefault();
        event.stopPropagation();
        if(button.disabled) return;
        button.disabled=true;
        try{
          onCollect(item, button);
        } finally {
          // Если обработчик не перерисовал слой, предмет снова доступен.
          if(button.isConnected) button.disabled=false;
        }
      });

      host.appendChild(button);
      visible.push(item.id);
    });

    return visible;
  }

  function clear(host){
    const node=resolveHost(host);
    if(node) node.replaceChildren();
  }

  window.DetectiveCollectibles=Object.freeze({
    version:'1.0.0',
    render,
    clear
  });
})();
