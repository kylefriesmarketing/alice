/* =====================================================================
   CURIOUSER — engine.js
   The loop: scene render, the SIZE control, the posture negotiation,
   the drift (WAKING), the waking (endings), and persistence.
   Instruments: SIZE (bidirectional, the star), SELF (gates DEFY),
   WAKING (dream-depth → the waterline + colour), IMPOSSIBLE THINGS
   (the cross-run catalogue). No death, ever.
   ===================================================================== */
(() => {
const NODES=ALICE.nodes, ENDINGS=ALICE.endings, REGIONS=ALICE.regions;
const K_P='alice_persist', K_R='alice_run';
const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

/* ---------------- persistence ---------------- */
function defP(){ return { runs:0, wakings:{}, impossibleEver:{}, bestSelf:0,
  sixBreakfast:false, dreamDepth:0, lookingGlass:false, lastTitle:null, lastKind:null, lastImpossible:[] }; }
function loadP(){ try{ const p=JSON.parse(localStorage.getItem(K_P));
  if(p){ const d=defP(); const o=Object.assign(d,p);
    o.wakings=p.wakings||{}; o.impossibleEver=p.impossibleEver||{}; return o; } }catch(e){}
  return defP(); }
function saveP(){ try{ localStorage.setItem(K_P, JSON.stringify(P)); }catch(e){} }
let P=loadP();

let S=null;
function newRun(){ return ALICE.newRun(); }
function saveRun(){ if(S){ try{ localStorage.setItem(K_R, JSON.stringify(S)); }catch(e){} } }
function clearRun(){ try{ localStorage.removeItem(K_R); }catch(e){} }
function loadRun(){ try{ return JSON.parse(localStorage.getItem(K_R)); }catch(e){ return null; } }

const fmt=t=>String(typeof t==='function'?t(S,P):t);
const impCount=()=> S? S.impossibleThings.length : 0;

function show(id){ ['title-screen','game-screen','ending-screen','gallery']
  .forEach(s=>$(s).classList.toggle('hidden', s!==id)); }

/* ---------------- scene painter: image first, SVG fallback ------------ */
function paintScene(el, key, seed){
  if (typeof IMAGES!=='undefined' && IMAGES.has(key)){
    const cur=el.querySelector('img.scene-img');
    if(cur && cur.dataset.key===key) return;
    const img=document.createElement('img');
    img.className='scene-img'; img.dataset.key=key; img.alt='';
    img.style.opacity='0';
    img.onerror=()=>ART.paint(el,key,seed);
    const reveal=()=>{ setTimeout(()=>{img.style.opacity='1';},30);
      setTimeout(()=>{[...el.children].forEach(c=>{if(c!==img && c.id!=='waterline')c.remove();});},1000); };
    img.onload=reveal; img.src=IMAGES.url(key);
    el.insertBefore(img, el.firstChild);
    if(img.complete&&img.naturalWidth>0) reveal();
  } else ART.paint(el, key, seed);
}

/* ---------------- title: the remembered dream ---------------- */
function titleScreen(){
  show('title-screen');
  paintScene($('title-art'),'title','r'+P.runs);
  AUDIO.setScene('title', 6);
  $('btn-continue').classList.toggle('hidden', !loadRun());
  const el=$('title-song');
  const everImp=Object.keys(P.impossibleEver).length;
  if(!P.runs){
    el.innerHTML='<span class="muse">You are on the riverbank, growing sleepy over your sister\'s book, when a White Rabbit with pink eyes takes a watch from its waistcoat-pocket and says, "Oh dear! I shall be too late!" — late for the <em>Last Unbirthday</em>, though you don\'t know that yet.<br><br>Wonderland is being put in order. Somewhere below, a Registrar is finishing the Great Index — one name for every creature, one answer for every riddle, one meaning for every rule — and when it is done, nothing will ever be allowed to change again. The trick is to wake as yourself, before Wonderland stops being able to surprise you.</span>';
  } else {
    let deep;
    if(everImp>=ALICE.TELLER_EVER) deep='You have been down the hole so many times that the dream is nearly as real to you as the bank. You could tell it to someone now, all of it, from the fall to the flying cards — and perhaps you are meant to.';
    else if(everImp>=6) deep='Each time you go down, you come back up remembering a little more of it — a grin, a garden, a stopped clock. Six impossible things, and counting, believed before breakfast.';
    else if(P.runs>=1) deep='The dream is half-remembered on waking, the way dreams are: a rabbit, a long fall, a door too small. You feel there was more, just past the edge of it.';
    el.innerHTML='<span class="muse">'+deep+'</span>'+
      '<span class="verse">impossible things believed, all told: <b>'+everImp+'</b>'+(P.sixBreakfast?' &nbsp;·&nbsp; six before breakfast ✦':'')+'</span>';
  }
}
$('btn-begin').onclick=()=>{ S=newRun(); lastNode=null; show('game-screen'); render(S.node); };
$('btn-continue').onclick=()=>{ const r=loadRun(); if(!r) return titleScreen();
  S=r; if(!S.impossibleThings)S.impossibleThings=[]; if(!S.flags)S.flags={}; if(!S.seen)S.seen={};
  if(S.contradiction===undefined)S.contradiction=2; if(S.index===undefined)S.index=3; if(!S.journal)S.journal=[];
  lastNode=null; show('game-screen'); render(S.node); };

/* ---------------- galleries ---------------- */
$('gallery-close').onclick=titleScreen;
$('btn-wakings').onclick=()=>{
  const ids=Object.keys(ENDINGS);
  const got=ids.filter(i=>P.wakings[i]).length;
  const KIND={true:'the true waking',secret:'past the last page',wake:'a waking, of a kind',
    lost:'a hollow waking',stay:'no waking at all',trapped:'kept by the dream',
    index:'corrected into sense',change:'a wonderland that changes'};
  let h=`<div class="gallery-sub">${got} of ${ids.length} ways the dream can end. You cannot die in Wonderland — but you can wake well, wake wrong, or never wake at all.</div>`;
  h+=`<div class="grid-cells">`+ids.map(i=>{ const e=ENDINGS[i];
    return P.wakings[i]
      ? `<div class="cell k-${e.kind}"><span class="ek">${KIND[e.kind]||e.kind}</span>${e.title}</div>`
      : `<div class="cell locked">— undreamed —</div>`; }).join('')+`</div>`;
  $('gallery-title').textContent='How the Dream Ends';
  $('gallery-body').innerHTML=h;
  show('gallery');
};
$('btn-impossible').onclick=()=>{
  const ever=Object.keys(P.impossibleEver);
  let h=`<div class="gallery-sub">“Why, sometimes I've believed as many as six impossible things before breakfast.” — the impossible things you have accepted, across every dream, kept forever. ${P.sixBreakfast?'<b>You have managed the full six in a single morning.</b>':'Believe six in one run to earn your breakfast.'}</div>`;
  h+= ever.length
    ? `<div class="imp-list">`+ever.map(t=>`<div class="imp-row"><span class="imp-mark">✦</span>${t}</div>`).join('')+`</div>`
    : `<div class="gallery-sub">None yet. You have argued with the dream instead of believing it. That is the trap — reason is a scalpel here, never a hammer. Play along, and see what you can bring yourself to accept.</div>`;
  $('gallery-title').textContent='Six Impossible Things Before Breakfast';
  $('gallery-body').innerHTML=h;
  show('gallery');
};
$('btn-cast').onclick=()=>{
  let h=`<div class="gallery-sub">Everyone you meet down the hole. None of them will help you; one of them will tell you the truth, which is not the same thing.</div>`;
  h+=Object.values(ALICE.cast).map(c=>
    `<div class="cast-entry"><div class="cast-name">${c.name}</div><div class="cast-role">${c.role}</div><div class="cast-note">${c.note}</div></div>`).join('');
  $('gallery-title').textContent='All Mad Here';
  $('gallery-body').innerHTML=h;
  show('gallery');
};

/* ---------------- HUD: SIZE (star) + SELF + WONDER + the waterline ------- */
const SIZE_WORDS={'-3':'thimble','-2':'tiny','-1':'small','0':'yourself','1':'tall','2':'huge','3':'house-high'};
function hudSize(){
  const gauge=ART.sizeGauge(S.size);
  let ctrl='';
  if(S.mushroom){
    ctrl=`<div class="size-ctrl" role="group" aria-label="the mushroom — change your size">
      <button id="sz-shrink" ${S.size<=-3?'disabled':''} title="nibble the shrinking side" aria-label="grow shorter">▽</button>
      <span class="sz-word">${SIZE_WORDS[S.size]}</span>
      <button id="sz-grow" ${S.size>=3?'disabled':''} title="nibble the growing side" aria-label="grow taller">△</button>
    </div>`;
  } else {
    ctrl=`<div class="size-ctrl no-mush" title="you cannot yet control your size — find what changes it"><span class="sz-word">${SIZE_WORDS[S.size]}</span></div>`;
  }
  return `<div class="hud-block size-block" title="SIZE — the one thing you truly control. Too big and too small are BOTH failure; the right size is fleeting and situational.">
    <span class="hlab">size</span>${gauge}${ctrl}</div>`;
}
function hudSelf(){
  const n=clamp(S.self,0,6);
  const pips=Array.from({length:6},(_,i)=>`<i class="${i<n?'on':''}"></i>`).join('');
  return `<div class="hud-block" title="SELF — who you still are. Wonderland erodes it: your name slips, your poems come out wrong. Defiance needs enough of it. At zero, you do not wake as yourself.">
    <span class="hlab">self${n<=2?' <em>slipping</em>':''}</span><div class="self-pips${n<=2?' low':''}">${pips}</div></div>`;
}
function hudWonder(){
  const n=impCount();
  const six=n>=ALICE.SIX_BEFORE_BREAKFAST;
  return `<div class="hud-block" title="${n} impossible thing${n===1?'':'s'} accepted so far this dream${six?' — six before breakfast!':''}. You cannot wake WELL from a dream you fought the whole way.">
    <span class="hlab">impossible</span><div class="wonder-count${six?' six':''}">✦ ${n}${six?' <span>· six!</span>':''}</div></div>`;
}
function hudContra(){
  const n=clamp(S.contradiction,0,6);
  const pips=Array.from({length:6},(_,i)=>`<i class="${i<n?'on':''}"></i>`).join('');
  return `<div class="hud-block" title="CONTRADICTION — proof that two impossible things can both be true. Spend it to BREAK a Rule Card and keep Wonderland wild. Playing along and believing the impossible earns it.">
    <span class="hlab">contradiction</span><div class="contra-pips">${pips}</div></div>`;
}
function hudIndex(){
  const n=clamp(S.index,0,8), frac=n/8;
  const done=n>=8;
  return `<div class="hud-block index-block${n>=6?' high':''}" title="THE GREAT INDEX — how much of Wonderland has been corrected into sense. Reasoning and obeying the local rules complete it; nonsense, play and defiance hold it back. When it fills, the Last Unbirthday finishes and nothing may ever change again.">
    <span class="hlab">the index${done?' <em>complete</em>':''}</span>
    <div class="index-bar"><span style="width:${Math.round(frac*100)}%"></span></div></div>`;
}
function paintHUD(){
  $('hud').innerHTML=`<div class="hud-panel">${hudSize()}<div class="hud-sep"></div>${hudSelf()}<div class="hud-sep"></div>${hudContra()}<div class="hud-sep"></div>${hudWonder()}<div class="hud-sep"></div>${hudIndex()}</div>`;
  if(S.mushroom){
    const g=$('sz-grow'), sh=$('sz-shrink');
    if(g) g.onclick=()=>changeSize(1);
    if(sh) sh.onclick=()=>changeSize(-1);
  }
  paintWater();
}
function paintWater(){
  const w=$('waterline'); if(!w) return;
  w.innerHTML=ART.waterline(S.waking);
}
function changeSize(d){
  if(!S.mushroom) return;
  const before=S.size;
  S.size=clamp(S.size+d,-3,3);
  if(S.size!==before){ AUDIO.blip(d>0?'grow':'shrink'); render(S.node, true); }
}

/* ---------------- render ---------------- */
let lastNode=null;
function render(nodeId, sameNode){
  const n=NODES[nodeId];
  if(!n){ console.error('missing node',nodeId); return titleScreen(); }
  const fresh = lastNode!==nodeId;
  S.node=nodeId;

  /* one-time arrival effects (only on genuine navigation) */
  if(fresh){
    S.seen[nodeId]=(S.seen[nodeId]||0)+1;
    if(n.onArriveGrow && S.size<1) S.size=1;        // the dream's grip loosening at the trial
    if(n.grantsMushroom) S.mushroom=true;
    if(n.onArrive) n.onArrive(S);
  }
  lastNode=nodeId;

  /* the SIZE gate: wrong size on arrival routes to an authored branch */
  if(n.gate){
    const g=n.gate, bad=(g.min!==undefined && S.size<g.min)||(g.max!==undefined && S.size>g.max);
    if(bad && g.onWrong && g.onWrong!==nodeId){ lastNode=null; return render(g.onWrong); }
  }

  const reg=REGIONS[n.region]||{name:''};
  paintScene($('scene-art'), n.scene||n.region, nodeId+P.runs);
  AUDIO.setScene(n.scene||n.region, S.waking, n.hub);
  paintHUD();

  $('region-name').textContent=reg.name;
  $('node-title').textContent=fmt(n.title);
  $('node-epigraph').innerHTML = n.epigraph ? '“'+n.epigraph+'”' : '';
  $('node-epigraph').style.display = n.epigraph ? '' : 'none';
  $('node-text').innerHTML=fmt(n.text);

  /* the local Rule Card the Great Index has pinned to this district */
  const rc=$('rulecard'); const ruleTxt = typeof n.rule==='function'?n.rule(S):n.rule;
  if(ruleTxt){ rc.style.display='';
    rc.innerHTML=`<span class="rc-lab">the rule here</span><span class="rc-text">${ruleTxt}</span>`;
  } else rc.style.display='none';

  /* Wonderland desaturates and squares up as the Index corrects it */
  const sat=clamp(1 - S.index*0.09, 0.28, 1), con=1 + S.index*0.02;
  $('scene-art').style.filter = S.index>0 ? `saturate(${sat.toFixed(2)}) contrast(${con.toFixed(2)})` : '';

  /* consumables on the table (size-changers) */
  const cbox=$('consumables'); cbox.innerHTML='';
  const cons = typeof n.consumables==='function'?n.consumables(S):n.consumables;
  if(cons && cons.length){
    cons.forEach(c=>{
      const b=document.createElement('button'); b.className='item';
      b.innerHTML=`<span class="item-do">${c.label}</span>`+(c.note?`<span class="item-note">${c.note}</span>`:'');
      b.onclick=()=>useConsumable(c);
      cbox.appendChild(b);
    });
  }

  /* choices / postures */
  const box=$('choices'); box.innerHTML='';
  const list=typeof n.choices==='function'?n.choices(S):n.choices;
  (list||[]).forEach(c=>{
    if(c.req && !c.req(S,P)) return;
    const b=document.createElement('button');
    b.className='choice'+(c.kind?' k-'+c.kind:'')+(c.key?' key':'')+(c.rule?' rule-'+c.rule:'');
    let pre=c.pre||'';
    if(c.kind && !pre) pre=c.kind;
    /* rule tag: OBEY / BEND / BREAK (with Contradiction cost) */
    let tag='';
    if(c.rule==='obey') tag='<b class="rtag obey">obey</b> ';
    else if(c.rule==='bend') tag='<b class="rtag bend">bend</b> ';
    else if(c.rule==='break') tag=`<b class="rtag break">break · spend ${c.cost||1} ✶</b> `;
    else if(c.kind) tag='<b class="kmark">'+c.kind+'</b> · ';
    b.innerHTML=(pre||tag?`<span class="c-pre">${tag}${pre}</span>`:'')+fmt(c.t);
    b.onclick=()=>choose(c);
    box.appendChild(b);
  });

  $('text-panel').scrollTop=0;
  saveRun();
}

function useConsumable(c){
  if(c.size!==undefined) S.size=clamp(S.size+c.size,-3,3);
  if(c.fx) c.fx(S);
  AUDIO.blip(c.size>0?'grow':'shrink');
  lastNode=null;               // allow gate re-eval, but this is still the "same" scene
  render(S.node, true);
}

function applyDeltas(c){
  if(c.size!==undefined) S.size=clamp(S.size+c.size,-3,3);
  if(c.self!==undefined) S.self=clamp(S.self+c.self,0,6);
  if(c.waking!==undefined) S.waking=clamp(S.waking+c.waking,0,12);
  if(c.add){ if(!S.impossibleThings.includes(c.add)) S.impossibleThings.push(c.add); }
  /* THE GREAT INDEX — Wonderland is being corrected into sense. Reasoning and
     obeying the local Rule Cards harden it; nonsense, play and defiance keep it
     wild. Breaking a rule spends CONTRADICTION. (explicit index/contra override) */
  if(S.index===undefined) S.index=3; if(S.contradiction===undefined) S.contradiction=2;
  let di=c.index, dc=c.contra;
  if(di===undefined){
    if(c.rule==='obey') di=2;
    else if(c.rule==='break') di=-2;
    else if(c.kind==='reason' && !c.key) di=1;
    else if(c.kind==='play') di=-1;
    else if(c.kind==='defy') di=-1;
  }
  if(dc===undefined){
    if(c.rule==='break') dc=-(c.cost||1);
    else if(c.kind==='play') dc=1;         // embracing the impossible fuels Contradiction
  }
  if(di) S.index=clamp(S.index+di,0,8);
  if(dc) S.contradiction=clamp(S.contradiction+dc,0,6);
  if(c.honest) S.flags.honestUncertainty=1;
  if(c.journal){ if(!S.journal) S.journal=[]; S.journal.push(fmt(c.journal)); }
}

function choose(c){
  applyDeltas(c);
  if(c.fx) c.fx(S,P);
  const endId=typeof c.end==='function'?c.end(S,P):c.end;
  if(endId) return ending(endId);
  /* sank too deep — the dream closes over (the Stay), unless already ending */
  if(S.waking<=0) return ending('e_stay');
  /* the Great Index finished writing itself — Wonderland corrected into sense */
  if(S.index>=8) return ending('e_index');
  let goId=typeof c.go==='function'?c.go(S,P):c.go;
  if(!goId) return titleScreen();
  render(goId);
}

/* ---------------- endings (the wakings) ---------------- */
function tally(e){
  let t='';
  if(e.kind==='change')
    t=`woke as yourself · the Index reopened · ${impCount()} impossible things kept, and free to change`;
  else if(e.kind==='index')
    t=`the Great Index is complete · Wonderland corrected, and safe, and perfectly still`;
  else if(e.kind==='true'||e.kind==='secret')
    t=`woke as yourself · ${impCount()} impossible things kept · self ${clamp(S.self,0,6)} of 6`;
  else if(e.kind==='wake')
    t=`woke, but thinly · ${impCount()} of the dream carried up`;
  else if(e.kind==='lost')
    t=`woke hollow · self worn down to ${clamp(S.self,0,6)}`;
  else if(e.kind==='trapped')
    t=`the wrong size, kept · you gave up being able to change`;
  else
    t=`never woke · ${impCount()} impossible things, believed, and lost`;
  if(impCount()>=ALICE.SIX_BEFORE_BREAKFAST) t+=`  ·  ✦ six before breakfast`;
  return t;
}
function ending(id){
  const e=ENDINGS[id];
  if(!e){ console.error('missing ending',id); return titleScreen(); }
  P.runs++; P.wakings[id]=(P.wakings[id]||0)+1;
  P.lastTitle=e.title; P.lastKind=e.kind;
  P.lastImpossible=(S.impossibleThings||[]).slice();
  (S.impossibleThings||[]).forEach(t=>{ P.impossibleEver[t]=1; });
  P.bestSelf=Math.max(P.bestSelf, clamp(S.self,0,6));
  if(impCount()>=ALICE.SIX_BEFORE_BREAKFAST) P.sixBreakfast=true;
  P.dreamDepth=Math.min(10, P.runs);
  saveP(); clearRun();

  AUDIO.sting(e.kind);
  paintScene($('ending-art'), e.scene||'wake', id+P.runs);
  AUDIO.setScene(e.scene||'wake', e.kind==='true'||e.kind==='secret'?12:(e.kind==='stay'||e.kind==='lost'?1:8));
  const KIND={true:'the true waking',secret:'past the last page of the book',wake:'a waking, of a kind',
    lost:'a hollow waking',stay:'no waking at all',trapped:'kept by the dream',
    index:'corrected into sense',change:'a wonderland that changes'};
  $('ending-kind').textContent=KIND[e.kind]||e.kind;
  $('ending-kind').className='k-'+e.kind;
  $('ending-title').textContent=e.title;
  $('ending-text').innerHTML=fmt(e.text);
  $('ending-tally').innerHTML=tally(e);
  $('ending-verse').textContent=e.verse||'';

  /* the share line travels */
  const sh=$('btn-share');
  if(sh){ sh.textContent='⎘ Tell the Dream';
    sh.onclick=async()=>{
      const text=`“${e.title}” — ${e.verse||'a dream of Wonderland.'}\n\nCURIOUSER — Alice's Adventures, playable:\nhttps://kylefriesmarketing.github.io/alice/`;
      try{
        if(navigator.share){ await navigator.share({title:'CURIOUSER', text}); }
        else{ await navigator.clipboard.writeText(text); sh.textContent='Copied for the telling ✓';
          setTimeout(()=>{sh.textContent='⎘ Tell the Dream';},2200); }
      }catch(err){}
    };
  }
  show('ending-screen');
}
$('btn-again').onclick=titleScreen;

/* ---------------- keys: number-choose, debug (~), mute (m) ---------------- */
document.addEventListener('keydown',e=>{
  const inField=e.target&&e.target.matches&&e.target.matches('input,select,textarea');
  if(!inField){
    if(!$('game-screen').classList.contains('hidden')){
      if(/^[1-9]$/.test(e.key)){
        const b=[...document.querySelectorAll('#choices .choice')][+e.key-1];
        if(b){ b.click(); return; }
      }
      if(S && S.mushroom){
        if(e.key==='-'||e.key==='_'){ changeSize(-1); return; }
        if(e.key==='='||e.key==='+'){ changeSize(1); return; }
      }
    } else if(!$('ending-screen').classList.contains('hidden') && e.key==='Enter'){
      return $('btn-again').click();
    }
  }
  if(e.key==='`'||e.key==='~'){
    const d=$('debug-panel'); d.classList.toggle('hidden');
    if(d.classList.contains('hidden')) return;
    d.innerHTML=`<b>~ the pool of tears (debug)</b>
      <div class="dbg-row">node <select id="dbg-node">${Object.keys(NODES).map(k=>`<option ${S&&S.node===k?'selected':''}>${k}</option>`).join('')}</select>
      <button id="dbg-go">go</button></div>
      <div class="dbg-row">size <input id="dbg-size" size="2" value="${S?S.size:0}">
      self <input id="dbg-self" size="2" value="${S?S.self:4}">
      waking <input id="dbg-waking" size="2" value="${S?S.waking:6}">
      <label><input type="checkbox" id="dbg-mush" ${S&&S.mushroom?'checked':''}> mushroom</label>
      <button id="dbg-apply">apply</button></div>
      <div class="dbg-row">waking <select id="dbg-end">${Object.keys(ENDINGS).map(k=>`<option>${k}</option>`).join('')}</select>
      <button id="dbg-endgo">see</button>
      <button id="dbg-soak">soak 300</button>
      <button id="dbg-wipe" title="wipe all persistence">wipe</button></div>
      <div class="dbg-row" id="dbg-out"></div>`;
    $('dbg-go').onclick=()=>{ if(!S){S=newRun();show('game-screen');} lastNode=null; render($('dbg-node').value); };
    $('dbg-apply').onclick=()=>{ if(!S)return;
      S.size=clamp(+$('dbg-size').value||0,-3,3); S.self=clamp(+$('dbg-self').value||0,0,6);
      S.waking=clamp(+$('dbg-waking').value||0,0,12); S.mushroom=$('dbg-mush').checked;
      render(S.node,true); };
    $('dbg-endgo').onclick=()=>{ if(!S){S=newRun();} ending($('dbg-end').value); };
    $('dbg-soak').onclick=()=>{ const r=__alSoak(300); $('dbg-out').textContent=JSON.stringify(r); };
    $('dbg-wipe').onclick=()=>{ localStorage.removeItem(K_P); localStorage.removeItem(K_R); P=loadP(); S=null; titleScreen(); };
  } else if(e.key==='m' && !inField) AUDIO.toggleMute();
});

/* ==================================================================
   __alSoak(runs) — waking-reachability + soft-lock soak (headless,
   no DOM). Random-walks postures/consumables/size like a confused
   dreamer. Asserts: every go/end target exists, no dead nodes, no
   stuck states. Returns {runs, endings:{}, deadNodes, stuck, err}.
   ================================================================== */
function __alSoak(runs){
  runs=runs||300;
  const rnd=()=> Math.random();
  const out={ runs, endings:{}, deadNodes:[], stuck:0, err:null, maxSteps:0 };
  const badTargets=new Set();
  try{
    for(let r=0;r<runs;r++){
      let s=ALICE.newRun();
      let steps=0, guard=0;
      while(steps<600){
        guard++; if(guard>2000){ out.stuck++; break; }
        const n=NODES[s.node];
        if(!n){ badTargets.add(s.node); break; }
        if(n.onArriveGrow && s.size<1) s.size=1;
        if(n.grantsMushroom) s.mushroom=true;
        if(n.onArrive) n.onArrive(s);
        s.seen[s.node]=(s.seen[s.node]||0)+1;
        /* gate redirect */
        if(n.gate){ const g=n.gate, bad=(g.min!==undefined&&s.size<g.min)||(g.max!==undefined&&s.size>g.max);
          if(bad && g.onWrong && g.onWrong!==s.node){ if(!NODES[g.onWrong]) badTargets.add(g.onWrong); s.node=g.onWrong; continue; } }
        /* sometimes fiddle size (mushroom or consumables) before choosing */
        const cons=typeof n.consumables==='function'?n.consumables(s):n.consumables;
        if(cons&&cons.length&&rnd()<0.4){ const c=cons[(rnd()*cons.length)|0];
          if(c.size!==undefined) s.size=clamp(s.size+c.size,-3,3); if(c.fx)c.fx(s); continue; }
        if(s.mushroom && rnd()<0.35){ s.size=clamp(s.size+(rnd()<0.5?-1:1),-3,3); continue; }
        const list=(typeof n.choices==='function'?n.choices(s):n.choices)||[];
        const avail=list.filter(c=>!c.req||c.req(s,P));
        if(!avail.length){
          /* no choices: is there any consumable/size escape? if not, dead */
          if(cons&&cons.length){ const c=cons[0]; if(c.size!==undefined)s.size=clamp(s.size+c.size,-3,3); continue; }
          if(s.mushroom){ s.size=clamp(s.size+1,-3,3); continue; }
          if(!out.deadNodes.includes(s.node)) out.deadNodes.push(s.node);
          out.stuck++; break;
        }
        const c=avail[(rnd()*avail.length)|0];
        if(c.size!==undefined) s.size=clamp(s.size+c.size,-3,3);
        if(c.self!==undefined) s.self=clamp(s.self+c.self,0,6);
        if(c.waking!==undefined) s.waking=clamp(s.waking+c.waking,0,12);
        if(c.add && !s.impossibleThings.includes(c.add)) s.impossibleThings.push(c.add);
        if(s.index===undefined)s.index=3; if(s.contradiction===undefined)s.contradiction=2;
        let di=c.index,dc=c.contra;
        if(di===undefined){ if(c.rule==='obey')di=2; else if(c.rule==='break')di=-2;
          else if(c.kind==='reason'&&!c.key)di=1; else if(c.kind==='play')di=-1; else if(c.kind==='defy')di=-1; }
        if(dc===undefined){ if(c.rule==='break')dc=-(c.cost||1); else if(c.kind==='play')dc=1; }
        if(di)s.index=clamp(s.index+di,0,8); if(dc)s.contradiction=clamp(s.contradiction+dc,0,6);
        if(c.honest)s.flags.honestUncertainty=1;
        if(c.fx) c.fx(s,P);
        const endId=typeof c.end==='function'?c.end(s,P):c.end;
        if(endId){ if(!ENDINGS[endId]) badTargets.add(endId);
          out.endings[endId]=(out.endings[endId]||0)+1; break; }
        if(s.waking<=0){ out.endings['e_stay']=(out.endings['e_stay']||0)+1; break; }
        if(s.index>=8){ out.endings['e_index']=(out.endings['e_index']||0)+1; break; }
        let go=typeof c.go==='function'?c.go(s,P):c.go;
        if(!go){ out.endings['(title)']=(out.endings['(title)']||0)+1; break; }
        if(!NODES[go]) badTargets.add(go);
        s.node=go; steps++;
      }
      out.maxSteps=Math.max(out.maxSteps,steps);
    }
  }catch(e){ out.err=String(e&&e.stack||e); }
  if(badTargets.size) out.err=(out.err?out.err+' | ':'')+'missing targets: '+[...badTargets].join(',');
  return out;
}
window.__alSoak=__alSoak;
window.__alState=()=>S;

titleScreen();
})();
