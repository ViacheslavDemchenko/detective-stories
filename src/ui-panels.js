(() => {
  'use strict';

  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  // Универсальные формулировки Матрицы подозреваемых для всех дел.
  // Новые детективные истории должны использовать этот набор без локальных переопределений.
  const UNIVERSAL_SUSPECT_MATRIX_COLUMNS = Object.freeze([
    Object.freeze({id:'motive',label:'Мотив',hint:'Наличие мотива у человека совершить преступление.'}),
    Object.freeze({id:'access',label:'Доступ',hint:'Имел ли человек доступ к объекту совершения преступления.'}),
    Object.freeze({id:'opportunity',label:'Возможность',hint:'Мог ли человек совершить преступление или любые действия, которые привели к этому в нужный момент.'}),
    Object.freeze({id:'alibi',label:'Алиби',hint:'Есть ли доказательства, подтверждающие непричастность подозреваемого к совершению преступления.'})
  ]);

  function suspectMatrixColumns(){
    return UNIVERSAL_SUSPECT_MATRIX_COLUMNS.map(column=>({...column}));
  }

  function resetModalClasses(){
    const modal=$('#modal');
    const shell=$('#modal .modal-shell');
    const body=$('#modalBody');
    modal?.classList.remove('detective-nonmodal','universal-system-panel');
    shell?.classList.remove('final-modal-shell','deduction-modal-shell','detective-modal-shell','investigation-modal-shell','case-tools-modal-shell');
    body?.classList.remove('final-modal-body','deduction-modal-body','materials-modal-body','detective-modal-body','investigation-modal-body','case-tools-modal-body');
  }

  function open(kicker,title,html,{shellClasses=[],bodyClasses=[],modalClasses=[]}={}){
    resetModalClasses();
    const modal=$('#modal');
    if(!modal) return;
    $('#modalKicker').textContent=kicker;
    $('#modalTitle').textContent=title;
    $('#modalBody').innerHTML=html;
    shellClasses.forEach(c=>$('#modal .modal-shell')?.classList.add(c));
    bodyClasses.forEach(c=>$('#modalBody')?.classList.add(c));
    modalClasses.forEach(c=>modal.classList.add(c));
    modal.classList.remove('hidden');
  }

  function people({kicker='ПОДОЗРЕВАЕМЫЕ',title='Люди',items=[]}={}){
    const html=`<div class="grid people-grid">${items.map(item=>`
      <div class="card suspect-card clickable" data-universal-suspect="${item.id}">
        <img src="${item.img||''}" alt="${item.name||''}">
        <div>
          <h3>${item.name||''}</h3>
          <p>${item.role||''}</p>
          <span class="status ${item.statusClass||'status-base'}">${item.statusText||''}</span>
        </div>
      </div>`).join('')}</div>`;
    open(kicker,title,html,{modalClasses:['universal-system-panel']});
  }

  function materialLibraryHtml({facts=[],unknownCount=0}={}){
    const kindClass=kind=>kind==='Улика'?'evidence':kind==='Показание'?'testimony':'deduction';
    const factCards=facts.map(f=>`<div class="card evidence-card evidence-library-card found material-kind-${kindClass(f.kind)}" data-material-kind="${f.kind}">
      <div class="evidence-icon">${f.iconHtml??f.icon??'◇'}</div>
      <div class="evidence-card-copy">
        <div class="evidence-card-top"><span class="evidence-status-badge found">${f.kind}</span></div>
        <h3>${f.title||''}</h3><p>${f.text||''}</p>
      </div>
    </div>`).join('');
    const unknownCards=Array.from({length:unknownCount},()=>`<div class="card evidence-card evidence-library-card missing" data-material-kind="Улика">
      <div class="evidence-icon">?</div><div class="evidence-card-copy"><div class="evidence-card-top"><span class="evidence-status-badge locked">Не найдено</span></div><h3>Неизвестная улика</h3><p>Исследуйте локации и проверяйте новые зацепки, чтобы открыть этот материал.</p></div></div>`).join('');
    return `
      <div class="evidence-summary evidence-summary-unified">
        <div><span class="tiny-label">МАТЕРИАЛОВ В ДЕЛЕ</span><strong>${facts.length}</strong></div>
        <small>Улики, показания и доказанные выводы отсюда используются в разделе «Расследование».</small>
      </div>
      <div class="material-library-tabs" role="tablist" aria-label="Фильтр материалов дела">
        <button type="button" class="material-library-tab legend-evidence active" data-material-filter="Улика" role="tab" aria-selected="true">Улики</button>
        <button type="button" class="material-library-tab legend-testimony" data-material-filter="Показание" role="tab" aria-selected="false">Показания</button>
        <button type="button" class="material-library-tab legend-deduction" data-material-filter="Вывод" role="tab" aria-selected="false">Выводы</button>
      </div>
      <div id="materialLibraryEmpty" class="material-library-empty hidden"></div>
      <div class="grid evidence-library">${factCards}${unknownCards}</div>`;
  }

  function applyMaterialFilter(kind){
    const cards=$$('.evidence-library-card[data-material-kind]');
    let visible=0;
    cards.forEach(card=>{
      const match=card.dataset.materialKind===kind;
      card.classList.toggle('material-filter-hidden',!match);
      if(match) visible+=1;
    });
    $$('[data-material-filter]').forEach(tab=>{
      const active=tab.dataset.materialFilter===kind;
      tab.classList.toggle('active',active);
      tab.setAttribute('aria-selected',active?'true':'false');
    });
    const empty=$('#materialLibraryEmpty');
    if(empty){
      empty.classList.toggle('hidden',visible>0);
      empty.textContent=kind==='Улика'
        ? 'В этой категории пока нет найденных или доступных улик.'
        : kind==='Показание'
          ? 'Пока нет зафиксированных показаний.'
          : 'Пока нет доказанных выводов.';
    }
  }

  function materials({kicker='МАТЕРИАЛЫ ДЕЛА',title='Материалы дела',facts=[],unknownCount=0}={}){
    open(kicker,title,materialLibraryHtml({facts,unknownCount}),{bodyClasses:['materials-modal-body'],modalClasses:['universal-system-panel']});
    $$('[data-material-filter]').forEach(tab=>tab.addEventListener('click',()=>applyMaterialFilter(tab.dataset.materialFilter)));
    applyMaterialFilter('Улика');
  }

  function notebookHtml(active,body){
    return `<div class="tabs">
      <button data-tab="timeline" class="${active==='timeline'?'active':''}">Хронология</button>
      <button data-tab="statements" class="${active==='statements'?'active':''}">Показания</button>
      <button data-tab="notes" class="${active==='notes'?'active':''}">Наблюдения</button>
    </div>${body}`;
  }

  function notebook({kicker='РАБОЧИЕ ЗАПИСИ',title='Блокнот',active='timeline',body=''}={}){
    open(kicker,title,notebookHtml(active,body),{modalClasses:['universal-system-panel']});
  }


  function suspectMatrixHtml({
    headingTitle='Кто действительно мог быть причастен?',
    headingText='Сравнивайте персонажей по четырем независимым критериям. Один мотив еще не делает человека виновным, а отсутствие алиби не доказывает причастность.',
    columns=[],
    rows=[],
    finalHtml='',
    detailHtml=''
  }={}){
    const head=columns.map(c=>`<th><b>${c.label||''}</b><small>${c.hint||''}</small></th>`).join('');
    const body=rows.map(row=>`<tr><th><div class="suspect-matrix-person"><img src="${row.img||''}" alt=""><span><b>${row.name||''}</b><small>${row.role||''}</small></span></div></th>${row.cellsHtml||''}</tr>`).join('');
    return `<div class="suspect-matrix-layout">
      <section class="suspect-matrix-main">
        <div class="case-tool-heading"><span class="tiny-label">МАТРИЦА ПОДОЗРЕВАЕМЫХ</span><h2>${headingTitle}</h2><p>${headingText}</p></div>
        <div class="suspect-matrix-scroll"><table class="suspect-matrix-table"><thead><tr><th>Персонаж</th>${head}</tr></thead><tbody>${body}</tbody></table></div>
      </section>
      <aside class="suspect-matrix-detail">${finalHtml||''}${detailHtml||''}</aside>
    </div>`;
  }


  function resetMatrixViewport(root=document){
    const scroll=root.querySelector?.('.suspect-matrix-scroll');
    if(!scroll) return;
    scroll.scrollLeft=0;
  }

  function investigation({title,tabTitle='Матрица подозреваемых',tabSubtitle='Сравните всех персонажей по фактам',body=''}={}){
    const html=`<div class="case-tools-shell">
      <div class="case-tool-tabs case-tool-tabs-single" role="tablist">
        <button class="case-tool-tab active" data-case-tool="matrix"><span>1</span><b>${tabTitle}</b><small>${tabSubtitle}</small></button>
      </div>
      <div id="caseToolBody" class="case-tool-body">${body}</div>
    </div>`;
    open('РАССЛЕДОВАНИЕ',title,html,{shellClasses:['deduction-modal-shell','investigation-modal-shell','case-tools-modal-shell'],bodyClasses:['deduction-modal-body','investigation-modal-body','case-tools-modal-body'],modalClasses:['universal-system-panel']});
  }

  window.DetectivePanels={open,people,materials,materialLibraryHtml,applyMaterialFilter,notebookHtml,notebook,suspectMatrixHtml,suspectMatrixColumns,resetMatrixViewport,investigation,resetModalClasses};
})();
