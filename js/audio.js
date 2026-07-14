/* =====================================================================
   CURIOUSER — audio.js. Generative WebAudio, no files.
   A sweet nursery music-box that goes WRONG as you sink (detune, tempo-
   warp, late/doubled notes) and rights itself only as you surface toward
   waking. The tea-party is a clock stuck at six (a tick that never
   advances, a chime that never completes). The Cheshire Cat is a grin
   motif that appears and vanishes mid-phrase. The riverbank is the one
   fully-consonant sound in the game.
   setScene(key, waking, hub) · sting(kind) · blip(dir) · toggleMute()
   ===================================================================== */
const AUDIO = (() => {
let ctx=null, master=null, lp=null, current=null;
let muted=false; try{ muted=localStorage.getItem('alice_muted')==='1'; }catch(e){}
let waking=6, curIndex=0, boxTimer=null, clockTimer=null, extraTimer=null;

/* per-scene colour: root note, drone intervals, and flavour flags */
const CFG={
  title:      { root:60, drone:[0,7],      box:1, sweet:1 },
  fall:       { root:57, drone:[0,5,12],   box:1, falling:1 },
  hall:       { root:55, drone:[0,7],      box:1 },
  pool:       { root:53, drone:[0,3,7],    box:1, water:1 },
  caucus:     { root:60, drone:[0,4,7],    box:1, bright:1 },
  rabbithouse:{ root:56, drone:[0,5],      box:1, hurry:1 },
  caterpillar:{ root:52, drone:[0,1,7],    box:1, hookah:1 },
  kitchen:    { root:58, drone:[0,6],      box:0, chaos:1 },
  cheshire:   { root:59, drone:[0,7,11],   box:1, grin:1 },
  teaparty:   { root:55, drone:[0,2,7],    box:1, clock:1 },
  croquet:    { root:57, drone:[0,5,7],    box:0, march:1 },
  mockturtle: { root:50, drone:[0,3,7,10], box:1, weep:1 },
  trial:      { root:53, drone:[0,1,6],    box:0, march:1, tense:1 },
  wake:       { root:60, drone:[0,4,7,12], box:1, sweet:1, resolve:1 },
  dark:       { root:48, drone:[0,1],      box:1, hollow:1 },
  /* Through the Looking-Glass — the music-box plays the nursery tune in RETROGRADE (mirror:1) */
  lgmirror:   { root:60, drone:[0,7,12],   box:1, sweet:1, mirror:1 },
  lgboard:    { root:57, drone:[0,4,7],     box:1, mirror:1, bright:1 },
  lgwall:     { root:55, drone:[0,5,7],     box:1, mirror:1 },
  lgcrown:    { root:53, drone:[0,4,7,12],  box:1, mirror:1, march:1, bright:1 },
};
/* the nursery music-box tune (scale degrees over the root, +12 = up an octave) */
const NURSERY=[12,16,19,16,12,14,15,14, 12,16,19,24,19,16,12,7];
const midiHz=m=>440*Math.pow(2,(m-69)/12);
const wrongness=()=> Math.max(0, Math.min(1, (6-waking)/6));   /* 0 clean … 1 curdled */

function ensure(){ if(ctx) return true;
  try{ ctx=new (window.AudioContext||window.webkitAudioContext)();
    master=ctx.createGain(); master.gain.value=muted?0:.5;
    lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=2600;
    lp.connect(master); master.connect(ctx.destination); return true;
  }catch(e){ return false; } }
function noiseBuf(){ const b=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),d=b.getChannelData(0);
  let last=0; for(let i=0;i<d.length;i++){ const w=Math.random()*2-1; d[i]=(last+.02*w)/1.02; last=d[i]; d[i]*=3.2; }
  return b; }
function stopCurrent(){
  [boxTimer,clockTimer,extraTimer].forEach(t=>{if(t)clearTimeout(t);});
  boxTimer=clockTimer=extraTimer=null;
  if(!current) return;
  const t=ctx.currentTime;
  current.gains.forEach(g=>{try{g.gain.setTargetAtTime(0,t,.5);}catch(e){}});
  const dead=current;
  setTimeout(()=>dead.nodes.forEach(n=>{try{n.stop?n.stop():n.disconnect();}catch(e){}}),1800);
  current=null;
}
function osc(type,f,g0,dest){ const o=ctx.createOscillator(),g=ctx.createGain();
  o.type=type;o.frequency.value=f;g.gain.value=0;
  g.gain.setTargetAtTime(g0,ctx.currentTime,1.4);
  o.connect(g);g.connect(dest);o.start(); return {o,g}; }
/* a music-box note: bright sine ping + octave shimmer + short decay */
function ping(f,v,d,when,detune){ if(!ctx||muted) return;
  const now=(when||ctx.currentTime);
  const o=ctx.createOscillator(),g=ctx.createGain();
  o.type='sine'; o.frequency.value=f; if(detune) o.detune.value=detune;
  g.gain.setValueAtTime(0,now); g.gain.linearRampToValueAtTime(v,now+.008);
  g.gain.exponentialRampToValueAtTime(.0001,now+ (d||1.3));
  o.connect(g);g.connect(lp);o.start(now);o.stop(now+(d||1.3)+.05);
  /* faint octave, the glass of the music-box */
  const o2=ctx.createOscillator(),g2=ctx.createGain();
  o2.type='triangle'; o2.frequency.value=f*2;
  g2.gain.setValueAtTime(0,now); g2.gain.linearRampToValueAtTime(v*.25,now+.008);
  g2.gain.exponentialRampToValueAtTime(.0001,now+(d||1.3)*.6);
  o2.connect(g2);g2.connect(lp);o2.start(now);o2.stop(now+(d||1.3));
}
function bell(f,v,d,t){ if(!ctx||muted) return; const now=ctx.currentTime;
  const o=ctx.createOscillator(),g=ctx.createGain();
  o.type=t||'sine';o.frequency.value=f;
  g.gain.setValueAtTime(0,now);g.gain.linearRampToValueAtTime(v,now+.02);
  g.gain.exponentialRampToValueAtTime(.0001,now+d);
  o.connect(g);g.connect(lp);o.start(now);o.stop(now+d+.05); }

/* the box tune, warped by wrongness */
function scheduleBox(cfg){
  if(boxTimer) clearTimeout(boxTimer);
  let i=0;
  const SEQ = cfg.mirror ? NURSERY.slice().reverse() : NURSERY;   /* Looking-Glass: the tune runs backwards */
  const step=()=>{ if(!current||!cfg.box) return;
    const w=wrongness();
    const st=curIndex/8;                                     /* the Great Index: 0 wild … 1 corrected */
    const deg=SEQ[i%SEQ.length];
    /* sinking curdles the box warm-WRONG; the Index sterilises it cold-RIGHT (perfectly
       in tune, perfectly on time — and dead). The two pull against each other. */
    const detune = (Math.random()*2-1)*w*45*(1-st);          /* index files the wrong-tuning flat */
    const late = Math.random()*w*0.18*(1-st);                /* …and files the late notes on time */
    const f=midiHz(cfg.root+deg);
    ping(f, .12*(1-w*.4)*(cfg.sweet?1.1:1)*(1-st*.35), cfg.resolve?2.0:1.4, ctx.currentTime+late, detune);
    if(w>.5 && st<.5 && Math.random()<w*.5) ping(f, .05, 1.0, ctx.currentTime+late+0.09, detune-20); /* doubled ghost — the Index erases it */
    if(st>.5) bell(midiHz(cfg.root+31),.02+st*.02,.05,'square'); /* a cold filing-tick as sense hardens */
    i++;
    const base=cfg.resolve?560:520;
    const tempo = base*(1 + (Math.random()*2-1)*w*0.4*(1-st));  /* index makes the tempo metronomic */
    boxTimer=setTimeout(step, tempo);
  };
  boxTimer=setTimeout(step, 700);
}
/* tea-party: a clock stuck at six — a tick that never advances, a chime that never lands */
function scheduleClock(){
  if(clockTimer) clearTimeout(clockTimer);
  const tick=()=>{ if(!current) return;
    bell(midiHz(84),.03,.10,'square');                       /* tick */
    setTimeout(()=>bell(midiHz(84),.028,.10,'square'),620);  /* tock — but never the next hour */
    if(Math.random()<0.25){ [0,4].forEach((n,k)=>setTimeout(()=>bell(midiHz(72+n),.05,1.2),k*180)); } /* chime starts… and stops at two of six */
    clockTimer=setTimeout(tick, 1400);
  };
  clockTimer=setTimeout(tick,500);
}
/* cheshire: a rising two-note grin that vanishes mid-phrase */
function scheduleGrin(cfg){
  if(extraTimer) clearTimeout(extraTimer);
  const go=()=>{ if(!current) return;
    ping(midiHz(cfg.root+12),.09,1.1);
    if(Math.random()<0.6) setTimeout(()=>ping(midiHz(cfg.root+16),.08,1.4),200);  /* sometimes only the tail; sometimes it just… doesn't finish */
    extraTimer=setTimeout(go, 3600+Math.random()*3000);
  };
  extraTimer=setTimeout(go,1600);
}
/* queen / trial: martial thwacks + a heart-drum */
function scheduleMarch(cfg){
  if(extraTimer) clearTimeout(extraTimer);
  const go=()=>{ if(!current) return;
    bell(midiHz(cfg.root-12),.14,.18,'square');
    setTimeout(()=>bell(midiHz(cfg.root-12),.10,.2,'square'),260);   /* the two-beat heart */
    if(cfg.tense && Math.random()<0.4) setTimeout(()=>bell(midiHz(cfg.root-7),.06,.5,'sawtooth'),520);
    extraTimer=setTimeout(go, 1300);
  };
  extraTimer=setTimeout(go,400);
}
/* riverbank: birdsong whistles over the clean cadence */
function scheduleBirds(cfg){
  if(extraTimer) clearTimeout(extraTimer);
  const go=()=>{ if(!current) return;
    const base=midiHz(cfg.root+24+((Math.random()*5)|0));
    for(let k=0;k<3;k++) setTimeout(()=>{ const o=ctx.createOscillator(),g=ctx.createGain(),now=ctx.currentTime;
      o.type='sine'; o.frequency.setValueAtTime(base,now); o.frequency.linearRampToValueAtTime(base*1.5,now+.14);
      g.gain.setValueAtTime(0,now); g.gain.linearRampToValueAtTime(.05,now+.03); g.gain.exponentialRampToValueAtTime(.0001,now+.3);
      o.connect(g);g.connect(lp);o.start(now);o.stop(now+.35); }, k*130);
    extraTimer=setTimeout(go, 2600+Math.random()*3000);
  };
  extraTimer=setTimeout(go,1200);
}

function setScene(key, wk, index){
  waking = (wk===undefined?6:wk);
  curIndex = index||0;
  if(!ensure()) return;
  if(ctx.state==='suspended') ctx.resume();
  const cfg=CFG[key]||CFG.title;
  stopCurrent();
  const w=wrongness();
  lp.frequency.setTargetAtTime(cfg.resolve||cfg.bright?3200:cfg.hollow?900:2200 - w*800, ctx.currentTime, 1.0);
  const nodes=[],gains=[];
  /* drone bed */
  cfg.drone.forEach((iv,ix)=>{ const f=midiHz(cfg.root+iv-12);
    const a=osc(cfg.sweet||cfg.resolve?'triangle':'sawtooth', f, (ix===0?.05:.022), lp);
    a.o.detune.value=(ix%2?6:-6) + (Math.random()*2-1)*w*30;   /* the bed itself sours as you sink */
    nodes.push(a.o); gains.push(a.g);
  });
  /* noise bed for watery / chaotic scenes */
  if(cfg.water||cfg.chaos||cfg.weep){
    const src=ctx.createBufferSource(); src.buffer=noiseBuf(); src.loop=true;
    const f=ctx.createBiquadFilter(),g=ctx.createGain(); g.gain.value=0;
    f.type=cfg.chaos?'bandpass':'lowpass'; f.frequency.value=cfg.chaos?900:360; f.Q.value=.6;
    src.connect(f);f.connect(g);g.connect(lp);
    g.gain.setTargetAtTime(cfg.chaos?.05:.07,ctx.currentTime,2);
    src.start(); nodes.push(src); gains.push(g);
  }
  current={nodes,gains};
  if(cfg.box) scheduleBox(cfg);
  if(cfg.clock) scheduleClock();
  else if(cfg.grin) scheduleGrin(cfg);
  else if(cfg.march) scheduleMarch(cfg);
  else if(cfg.resolve) scheduleBirds(cfg);
}

function blip(dir){ if(!ctx||muted) return; const now=ctx.currentTime;
  const o=ctx.createOscillator(),g=ctx.createGain();
  o.type='sine';
  const a=dir==='grow'?midiHz(60):midiHz(76), b=dir==='grow'?midiHz(76):midiHz(60);
  o.frequency.setValueAtTime(a,now); o.frequency.exponentialRampToValueAtTime(b,now+.28);
  g.gain.setValueAtTime(.0001,now); g.gain.linearRampToValueAtTime(.08,now+.03);
  g.gain.exponentialRampToValueAtTime(.0001,now+.34);
  o.connect(g);g.connect(lp);o.start(now);o.stop(now+.4);
}
function sting(kind){ if(!ctx||muted) return;
  if(kind==='true') [0,4,7,12,16,19].forEach((n,i)=>setTimeout(()=>ping(midiHz(60+n),.12,2.4),i*180));
  else if(kind==='secret') [0,7,12,16,19,24,28].forEach((n,i)=>setTimeout(()=>ping(midiHz(60+n),.11,3),i*200));
  else if(kind==='wake') [0,4,7,12].forEach((n,i)=>setTimeout(()=>ping(midiHz(64+n),.10,1.8),i*150));
  else if(kind==='lost') [0,-1,-3,-5].forEach((n,i)=>setTimeout(()=>bell(midiHz(60+n),.10,2.4,'triangle'),i*320));
  else if(kind==='stay') [0,-2,-5,-9].forEach((n,i)=>setTimeout(()=>bell(midiHz(55+n),.10,3.4),i*420));
  else if(kind==='trapped') [0,0,0].forEach((n,i)=>setTimeout(()=>bell(midiHz(45),.14,2.8,'square'),i*300));
  else bell(midiHz(60),.06,.8);
}
function toggleMute(){ muted=!muted;
  try{ localStorage.setItem('alice_muted', muted?'1':'0'); }catch(e){}
  if(master) master.gain.setTargetAtTime(muted?0:.5,ctx.currentTime,.2);
  return muted; }
return { setScene, sting, blip, toggleMute };
})();
