/* =====================================================================
   CURIOUSER — art.js. Procedural SVG fallbacks (generated stills preferred).
   John Tenniel's 1865 engraved LINE — black cross-hatched silhouette —
   flooded with saturated, drifting, WRONG dream-colour. A colouring-book
   that colours itself, and colours itself wrong.
   Exposes: ART.paint(el,key,seed), ART.sizeGauge(size), ART.waterline(waking).
   ===================================================================== */
const ART = (() => {
const W=900, H=540;
function rng(s){ let h=1779033703^String(s).length;
  for(let i=0;i<String(s).length;i++){h=Math.imul(h^String(s).charCodeAt(i),3432918353);h=h<<13|h>>>19;}
  return function(){h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);
    return ((h^=h>>>16)>>>0)/4294967296;};}
const G=(id,st)=>`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">`+st.map(s=>`<stop offset="${s[0]}" stop-color="${s[1]}"/>`).join('')+`</linearGradient>`;
const RG=(id,st)=>`<radialGradient id="${id}">`+st.map(s=>`<stop offset="${s[0]}" stop-color="${s[1]}" stop-opacity="${s[2]!==undefined?s[2]:1}"/>`).join('')+`</radialGradient>`;
const rect=(x,y,w,h,f,o)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"${o!==undefined?` opacity="${o}"`:''}/>`;
const circ=(x,y,r,f,o)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"${o!==undefined?` opacity="${o}"`:''}/>`;
const line=(x1,y1,x2,y2,c,w,o)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w||1.4}"${o!==undefined?` opacity="${o}"`:''}/>`;
const path=(d,f,st,sw,o)=>`<path d="${d}"${f?` fill="${f}"`:' fill="none"'}${st?` stroke="${st}" stroke-width="${sw||2}"`:''}${o!==undefined?` opacity="${o}"`:''}/>`;

const INK='#1a1410', LINE='#241c14';
/* cross-hatch a region (Tenniel's engraving feel) */
function hatch(x,y,w,h,c,gap,ang){ gap=gap||7; c=c||INK; let d='';
  if(ang===2){ for(let i=-h;i<w;i+=gap) d+=`M${x+i},${y} l${h},${h} `; }
  else if(ang===1){ for(let i=0;i<w+h;i+=gap) d+=`M${x+i},${y} l${-h},${h} `; }
  else { for(let i=0;i<h;i+=gap) d+=`M${x},${y+i} l${w},0 `; }
  return `<path d="${d}" stroke="${c}" stroke-width=".9" opacity=".5"/>`;
}
/* a Tenniel Alice silhouette (pinafore, hairband), height hh, at (x, baseY) */
function alice(x,baseY,hh,c){ c=c||INK; const w=hh*0.42;
  return `<g transform="translate(${x},${baseY})">`+
    /* skirt */ path(`M${-w*.5},0 Q${-w*.62},${-hh*.42} ${-w*.28},${-hh*.5} L${w*.28},${-hh*.5} Q${w*.62},${-hh*.42} ${w*.5},0 Q0,${hh*.06} ${-w*.5},0 Z`,c)+
    /* apron */ path(`M${-w*.22},${-hh*.5} L${w*.22},${-hh*.5} L${w*.16},${-hh*.06} Q0,${hh*.02} ${-w*.16},${-hh*.06} Z`,'#f4ecd8',null,0,.9)+
    /* bodice */ path(`M${-w*.22},${-hh*.5} Q0,${-hh*.66} ${w*.22},${-hh*.5} L${w*.14},${-hh*.72} L${-w*.14},${-hh*.72} Z`,c)+
    /* head */ circ(0,-hh*.82,hh*.12,c)+
    /* hair fall + band */ path(`M${-hh*.12},${-hh*.84} Q${-hh*.16},${-hh*.6} ${-hh*.06},${-hh*.56} M${hh*.12},${-hh*.84} Q${hh*.16},${-hh*.6} ${hh*.06},${-hh*.56}`,null,c,hh*.05,.9)+
    line(-hh*.12,-hh*.9,hh*.12,-hh*.9,'#f4ecd8',hh*.03,.9)+
    `</g>`;
}
/* toadstool */
function mushroom(x,y,s,cap){ cap=cap||'#c0392b'; return `<g transform="translate(${x},${y}) scale(${s})">`+
  path(`M-46,0 Q-52,-40 0,-46 Q52,-40 46,0 Q0,14 -46,0 Z`,cap,INK,2)+
  circ(-18,-24,5,'#f4ecd8',.9)+circ(14,-30,6,'#f4ecd8',.9)+circ(24,-14,4,'#f4ecd8',.9)+
  path(`M-12,0 Q-16,44 -6,64 L8,64 Q16,40 12,0 Z`,'#efe6cf',INK,1.8)+`</g>`;}
/* a playing-card gardener / soldier */
function card(x,y,s,suit,c){ c=c||'#c0392b'; return `<g transform="translate(${x},${y}) scale(${s})">`+
  rect(-16,-46,32,52,'#f4ecd8',1)+`<rect x="-16" y="-46" width="32" height="52" fill="none" stroke="${INK}" stroke-width="2"/>`+
  path(`M0,-38 q7,-8 12,0 q4,7 -12,16 q-16,-9 -12,-16 q5,-8 12,0 z`,c)+
  circ(0,-52,7,'#f4ecd8',1)+`<circle cx="0" cy="-52" r="7" fill="none" stroke="${INK}" stroke-width="1.6"/>`+
  line(-12,6,-16,26,INK,2)+line(12,6,16,26,INK,2)+`</g>`;}
/* framed vignette border in the drifting accent */
function frame(c){ c=c||'#c9a227'; return `<rect x="14" y="14" width="${W-28}" height="${H-28}" fill="none" stroke="${c}" stroke-width="2.2" opacity=".55"/>`+
  `<rect x="20" y="20" width="${W-40}" height="${H-40}" fill="none" stroke="${c}" stroke-width=".8" opacity=".4"/>`;}

/* ---- the scenes (each: drifting wash + engraved line) ---- */
const P={
title(r){ return G('t',[[0,'#2a1a4a'],[.45,'#6a2f6e'],[1,'#b5486a']])+rect(0,0,W,H,'url(#t)')
  +Array.from({length:40},()=>circ(r()*W,r()*H,r()*1.6+.3,'#f4ecd8',.3+r()*.4)).join('')
  /* the little door, far off, too small */
  +rect(W/2-26,H-150,52,120,'#1a1230')+path(`M${W/2-26},${H-150} q26,-30 52,0`,'#1a1230')
  +circ(W/2+14,H-92,4,'#c9a227')
  +alice(W/2-140,H-70,150,INK)
  +hatch(W/2-210,H-90,150,80,INK,9,1)
  /* cheshire grin in the foliage */
  +path(`M${W-230},120 q60,54 120,0`,null,'#f4ecd8',7)+Array.from({length:7},(_,i)=>line(W-224+i*18,120+Math.sin(i)*6,W-224+i*18,150,'#f4ecd8',5,.9)).join('')
  +circ(W-250,96,10,'#7be0c0',.9)+circ(W-150,96,10,'#7be0c0',.9)
  +frame('#c9a227');},

fall(r){ return G('fa',[[0,'#20143a'],[.5,'#3a2050'],[1,'#5a2a4a']])+rect(0,0,W,H,'url(#fa)')
  /* the well: shelves and jars drifting up */
  +Array.from({length:7},(_,i)=>{const y=40+i*74;
    return rect(60,y,W-120,10,'#3a2c1a')+ `<rect x="60" y="${y}" width="${W-120}" height="10" fill="none" stroke="${INK}" stroke-width="1.4"/>`
      +Array.from({length:6},(_,k)=>{const x=110+k*(W-220)/5+ (r()-.5)*20;
        return rect(x-9,y-26,18,26,'#8a6a3a',.9)+`<rect x="${x-9}" y="${y-26}" width="18" height="26" fill="none" stroke="${INK}" stroke-width="1.2"/>`;}).join('');}).join('')
  +alice(W/2,H*.5+40,150,INK)
  +path(`M${W/2-40},${H*.5-120} q40,30 80,0`,null,'#c9a227',2,.5)
  +frame('#7a5ea0');},

hall(r){ return G('ha',[[0,'#122a2a'],[.5,'#1c3a3a'],[1,'#0e2420']])+rect(0,0,W,H,'url(#ha)')
  /* a colonnade of tall locked doors */
  +Array.from({length:5},(_,i)=>{const x=70+i*168;
    return rect(x,120,120,300,'#0c1c1a')+`<rect x="${x}" y="120" width="120" height="300" fill="none" stroke="${INK}" stroke-width="2.4"/>`
      +path(`M${x},120 q60,-40 120,0`,'#0c1c1a',INK,2)+circ(x+100,280,5,'#c9a227');}).join('')
  +rect(0,420,W,120,'#081613')
  /* the little curtained door + glass table with the golden key */
  +rect(W/2+150,470,44,54,'#0c1c1a')+`<rect x="${W/2+150}" y="470" width="44" height="54" fill="none" stroke="#c9a227" stroke-width="2"/>`
  +line(W/2-170,470,W/2-70,470,INK,2)+line(W/2-150,470,W/2-150,520,INK,2)+line(W/2-90,470,W/2-90,520,INK,2)
  +circ(W/2-120,462,7,'#e8c84a',1)+`<circle cx="${W/2-120}" cy="462" r="7" fill="none" stroke="${INK}" stroke-width="1.4"/>`
  +alice(W/2-10,500,140,INK)
  +frame('#e8c84a');},

pool(r){ return G('po',[[0,'#0e2038'],[.5,'#123a5a'],[1,'#1c5a6e']])+rect(0,0,W,H,'url(#po)')
  +rect(0,300,W,240,'#164a5e')
  +Array.from({length:6},(_,i)=>{const y=316+i*36;let d='';
    for(let x=-40;x<W+40;x+=52)d+=`M${x},${y} q13,-14 26,-9 q11,4 8,11`;
    return `<path d="${d}" stroke="#7fd0d0" stroke-width="2" fill="none" opacity="${.5-i*.05}"><animateTransform attributeName="transform" type="translate" values="0,0;-52,0;0,0" dur="${9+i*2}s" repeatCount="indefinite"/></path>`;}).join('')
  /* swimmers: mouse, dodo silhouettes */
  +path(`M240,330 q18,-10 40,-4 q10,4 4,12 q-30,8 -48,-2 z`,INK)+line(238,330,222,326,INK,2)
  +`<g transform="translate(560,320)">`+path(`M0,0 q-6,-40 18,-46 q30,-4 30,20 q0,20 -18,26 z`,INK)+line(40,-10,64,-18,INK,3)+`</g>`
  +alice(120,300,120,INK)
  +frame('#7fd0d0');},

caucus(r){ return G('ca',[[0,'#3a2a10'],[.5,'#6a5218'],[1,'#8a6a20']])+rect(0,0,W,H,'url(#ca)')
  +path(`M0,360 Q220,330 450,352 Q680,372 900,340 L900,540 L0,540 Z`,'#4a3a14')
  /* a ragged ring of running creatures */
  +Array.from({length:9},(_,i)=>{const a=i/9*6.28,x=450+Math.cos(a)*250,y=360+Math.sin(a)*60;
    return `<g transform="translate(${x},${y}) scale(${.7+r()*.4})">`+path(`M0,0 q-8,-24 4,-30 q14,-6 16,8 q2,14 -8,22 z`,INK)+line(0,-4,r()*10-5,-24,INK,2)+`</g>`;}).join('')
  +alice(450,360,120,INK)
  +circ(450,240,26,'#e8c84a',.4)
  +frame('#e8c84a');},

rabbithouse(r){ return G('rh',[[0,'#2a1a2e'],[.5,'#4a2440'],[1,'#6a2e44']])+rect(0,0,W,H,'url(#rh)')
  +rect(250,150,400,340,'#2a1622')+`<rect x="250" y="150" width="400" height="340" fill="none" stroke="${INK}" stroke-width="2.6"/>`
  +path(`M230,150 L450,40 L670,150 Z`,'#3a1e2e',INK,2.4)
  /* a giant Alice bursting the house: arm out a window, foot up a chimney */
  +rect(560,200,70,80,'#160a14')+`<rect x="560" y="200" width="70" height="80" fill="none" stroke="${INK}" stroke-width="2"/>`
  +path(`M560,240 q-90,-10 -150,20`,null,'#e8b4c0',22)+circ(400,264,20,'#e8b4c0')
  +rect(430,60,40,54,'#160a14')+path(`M470,150 q40,-70 -6,-96`,null,'#e8b4c0',26)
  /* pebble-cakes on the ground */
  +Array.from({length:5},(_,i)=>circ(300+i*80,470,7,'#efe6cf',1)+`<circle cx="${300+i*80}" cy="470" r="7" fill="none" stroke="${INK}" stroke-width="1.2"/>`).join('')
  +frame('#e88aa0');},

caterpillar(r){ return G('cp',[[0,'#10261a'],[.5,'#1c4a2e'],[1,'#2e6a3a']])+rect(0,0,W,H,'url(#cp)')
  +Array.from({length:6},(_,i)=>path(`M${80+i*140},540 Q${100+i*140},300 ${80+i*140},120`,null,'#123a22',18,.8)).join('')
  +mushroom(450,300,2.2,'#8a4fbf')
  /* the blue caterpillar coiled on top, hookah smoke */
  +`<g transform="translate(420,232)">`+path(`M0,0 q40,-10 60,10 q-16,6 -30,2 q26,10 40,2 q-14,10 -34,4 q22,12 40,2`,null,'#3a6ad0',13)+circ(-6,-4,10,'#3a6ad0')+`</g>`
  +path(`M470,200 q40,-40 20,-90 q30,40 6,90`,null,'#bfe0ff',3,.6)
  +Array.from({length:5},(_,i)=>circ(490+i*10,110-i*16,4+i,'#bfe0ff',.4)).join('')
  +alice(150,430,150,INK)
  +frame('#8a4fbf');},

kitchen(r){ return G('ki',[[0,'#4a2a10'],[.5,'#7a3a14'],[1,'#9a4a18']])+rect(0,0,W,H,'url(#ki)')
  /* smoke everywhere */
  +Array.from({length:9},()=>circ(r()*W,r()*H,20+r()*40,'#d8c0a0',.16)).join('')
  +rect(120,380,660,120,'#3a2010')
  /* cauldron + hurled crockery */
  +path(`M400,360 q60,-10 120,0 q-6,60 -60,64 q-54,-4 -60,-64 z`,'#241208',INK,2.4)
  +Array.from({length:6},(_,i)=>{const x=200+i*90,y=140+r()*120;
    return `<g transform="translate(${x},${y}) rotate(${r()*90})">`+circ(0,0,14,'#efe6cf',1)+`<circle r="14" fill="none" stroke="${INK}" stroke-width="1.6"/>`+`</g>`;}).join('')
  +alice(680,470,130,INK)
  /* the duchess: broad silhouette on a stool */
  +`<g transform="translate(240,470)">`+path(`M-60,0 Q-70,-100 0,-110 Q70,-100 60,0 Z`,INK)+circ(0,-130,30,INK)+path(`M-40,-150 h80 l-16,-16 h-48 z`,INK)+`</g>`
  +frame('#e0a020');},

cheshire(r){ return G('ch',[[0,'#1a1030'],[.5,'#3a1a52'],[1,'#5a2464']])+rect(0,0,W,H,'url(#ch)')
  +Array.from({length:5},(_,i)=>path(`M${-40+i*40},540 Q${120+i*150},260 ${40+i*160},60`,null,'#2a1440',22,.7)).join('')
  /* the great grin, floating, cat mostly gone */
  +`<g transform="translate(450,240)">`
  +path(`M-140,0 Q0,150 140,0`,null,'#f4ecd8',12)
  +Array.from({length:11},(_,i)=>line(-120+i*24,Math.abs(i-5)*7,-120+i*24,Math.abs(i-5)*7+46,'#f4ecd8',8,.95)).join('')
  +circ(-90,-70,16,'#9be0b0',.9)+circ(90,-70,16,'#9be0b0',.9)+circ(-90,-70,6,INK)+circ(90,-70,6,INK)
  +path(`M-150,-30 q-30,-20 -20,-54 M150,-30 q30,-20 20,-54`,null,'#f4ecd8',4,.5)
  +`</g>`
  +frame('#9be0b0');},

teaparty(r){ return G('tp',[[0,'#2a2410'],[.5,'#5a4a18'],[1,'#7a5a1c']])+rect(0,0,W,H,'url(#tp)')
  +path(`M40,360 L860,360 L820,420 L80,420 Z`,'#efe6cf',INK,2.4)   /* long table */
  +Array.from({length:9},(_,i)=>{const x=90+i*88;
    return path(`M${x-13},350 q13,-6 26,0 l-3,-22 q-10,-4 -20,0 z`,'#f4ecd8',INK,1.6)+line(x+13,338,x+22,332,INK,1.4);}).join('')  /* teacups */
  +alice(120,470,120,INK)
  /* hatter with a big hat, march hare */
  +`<g transform="translate(560,360)">`+path(`M-30,0 Q-36,-70 0,-76 Q36,-70 30,0 Z`,INK)+rect(-34,-116,68,20,INK)+rect(-24,-160,48,46,INK)+line(20,-150,44,-150,'#efe6cf',3)+`</g>`
  +`<g transform="translate(680,360)">`+path(`M-24,0 Q-28,-56 0,-62 Q28,-56 24,0 Z`,INK)+line(-8,-62,-16,-96,INK,4)+line(8,-62,16,-96,INK,4)+`</g>`
  /* stopped clock at six */
  +circ(770,150,40,'#efe6cf',1)+`<circle cx="770" cy="150" r="40" fill="none" stroke="${INK}" stroke-width="2.4"/>`+line(770,150,770,120,INK,3)+line(770,150,770,182,INK,3)
  +frame('#e0c020');},

croquet(r){ return G('cq',[[0,'#123010'],[.5,'#1c5a1c'],[1,'#2a7a24']])+rect(0,0,W,H,'url(#cq)')
  +path(`M0,380 Q450,350 900,380 L900,540 L0,540 Z`,'#1e5e1c')
  /* the rose-tree: white roses being painted red */
  +line(150,380,150,200,INK,6)+Array.from({length:7},(_,i)=>{const x=110+r()*80,y=180+r()*90,red=i<4;
    return circ(x,y,13,red?'#c0392b':'#f4ecd8',1)+`<circle cx="${x}" cy="${y}" r="13" fill="none" stroke="${INK}" stroke-width="1.6"/>`;}).join('')
  /* card gardeners painting */
  +card(240,470,1,'♠','#c0392b')+card(300,478,.9,'♣','#c0392b')
  /* flamingo mallet + hedgehog ball */
  +`<g transform="translate(560,470)">`+path(`M0,0 L0,-90 Q0,-110 20,-108 Q10,-96 12,-84`,null,'#e86aa0',6)+circ(20,-108,7,'#e86aa0')+`</g>`
  +circ(660,486,12,INK)+Array.from({length:8},(_,i)=>line(660,486,660+Math.cos(i)*16,486+Math.sin(i)*10,INK,2)).join('')
  +alice(760,486,120,INK)
  +frame('#e04030');},

mockturtle(r){ return G('mt',[[0,'#101a34'],[.5,'#18345a'],[1,'#20507a']])+rect(0,0,W,H,'url(#mt)')
  +rect(0,400,W,140,'#123a52')
  +path(`M0,400 Q220,384 450,400 Q680,416 900,398`,null,'#7fb0d0',2,.6)
  /* mock turtle: turtle body, calf's head, weeping */
  +`<g transform="translate(400,430)">`+path(`M-70,0 Q-80,-60 0,-70 Q80,-60 70,0 Q0,20 -70,0 Z`,'#2a5a3a',INK,2.4)
  +circ(-88,-70,22,'#7a6a4a',INK)+line(-100,-92,-108,-104,INK,3)+line(-76,-92,-68,-104,INK,3)
  +path(`M-92,-58 q-6,26 -2,44`,null,'#8fd0e0',2.4,.8)+`</g>`
  /* gryphon */
  +`<g transform="translate(640,430)">`+path(`M0,0 Q-10,-70 40,-80 Q90,-70 70,0 Z`,INK)+path(`M40,-80 q30,-20 54,-8 q-16,10 -22,24`,INK)+line(20,0,16,30,INK,3)+line(50,0,54,30,INK,3)+`</g>`
  +frame('#8fd0e0');},

trial(r){ return G('tr',[[0,'#2a1010'],[.5,'#5a1820'],[1,'#7a2028']])+rect(0,0,W,H,'url(#tr)')
  /* the throne + the King & Queen of Hearts */
  +rect(360,120,180,150,'#3a1218')+`<rect x="360" y="120" width="180" height="150" fill="none" stroke="#e8c84a" stroke-width="2.4"/>`
  +path(`M420,120 q30,-30 60,0`,'#c0392b',INK,2)
  /* the pack: rows of cards */
  +Array.from({length:14},(_,i)=>card(90+i*56,470,.62,'♥','#c0392b')).join('')
  /* the tarts on a dish */
  +`<g transform="translate(450,340)">`+path(`M-40,0 q40,-16 80,0 q-8,10 -40,10 q-32,0 -40,-10 z`,'#e0a020',INK,1.8)+`</g>`
  /* Alice, grown tall */
  +alice(710,470,220,INK)
  +frame('#e8c84a');},

wake(r){ return G('wk',[[0,'#bfe0e8'],[.5,'#e8e0c8'],[1,'#cfe0b0']])+rect(0,0,W,H,'url(#wk)')
  +circ(160,120,50,'#f4e6a0',.8)
  +path(`M0,360 Q220,336 450,356 Q680,376 900,352 L900,540 L0,540 Z`,'#8fb060')   /* the green bank */
  +path(`M0,420 Q220,404 450,420 Q680,436 900,416`,null,'#6f98c0',3,.7)             /* the river */
  +Array.from({length:12},()=>{const x=r()*W,y=380+r()*80;return path(`M${x},${y} q-3,-16 0,-26`,null,'#3a6a2a',2,.7);}).join('')
  +alice(450,380,120,'#3a2a1a')
  +frame('#8fb060');},

dark(r){ return G('dk',[[0,'#0a0a12'],[.6,'#14101c'],[1,'#1a1424']])+rect(0,0,W,H,'url(#dk)')
  +Array.from({length:26},()=>circ(r()*W,r()*H,r()*1.4+.3,'#4a4a6a',.4+r()*.4)).join('')
  +alice(450,360,110,'#2a2438')
  +path(`M310,220 q140,80 280,0`,null,'#3a3450',6,.5)   /* a faded grin */
  +frame('#3a3450');},
};
P.riverbank=P.wake;

function paint(container,key,seed){
  const r=rng(seed||key);
  const fn=P[key]||P.title;
  container.querySelectorAll('svg.scene-svg,img.scene-img').forEach(e=>e.remove());
  const svg=`<svg class="scene-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${fn.call(P,r)}</svg>`;
  container.insertAdjacentHTML('afterbegin', svg);
}

/* =====================================================================
   THE SIZE GAUGE — the screenshot that sells the game. A little Tenniel
   Alice swelling and shrinking against notched wallpaper. size: -3..+3.
   ===================================================================== */
function sizeGauge(size){
  const GW=64, GH=112;
  size=Math.max(-3,Math.min(3,size|0));
  let s=`<svg class="size-gauge" viewBox="0 0 ${GW} ${GH}" width="${GW}" height="${GH}" role="img" aria-label="your size: ${size} (0 is your true size)">`;
  /* striped wallpaper */
  s+=`<rect x="0" y="0" width="${GW}" height="${GH}" fill="#171a22"/>`;
  for(let x=6;x<GW;x+=11) s+=`<line x1="${x}" y1="4" x2="${x}" y2="${GH-4}" stroke="#2a2f3c" stroke-width="4"/>`;
  /* notches for -3..+3 */
  const cx=GW/2, baseY=GH-12, unit=13;
  for(let i=-3;i<=3;i++){ const y=baseY - (i+3)*(unit); const on=i===size;
    s+=`<line x1="4" y1="${y}" x2="${GW-4}" y2="${y}" stroke="${i===0?'#c9a227':'#39404e'}" stroke-width="${i===0?1.6:1}" opacity="${i===0?.9:.5}"/>`;
    if(on) s+=`<circle cx="6" cy="${y}" r="2.6" fill="#e0403a"/>`;
  }
  /* the figure: height maps to size (thimble → house) */
  const heights={'-3':10,'-2':18,'-1':30,'0':44,'1':62,'2':84,'3':104};
  const hh=heights[size];
  const col = size===0?'#e8dcc0':(size>0?'#e8b4c0':'#8fd0d0');
  /* mini alice */
  const w=hh*0.4;
  s+=`<g transform="translate(${cx},${baseY})">`
    +`<path d="M${-w*.5},0 Q${-w*.6},${-hh*.44} ${-w*.26},${-hh*.5} L${w*.26},${-hh*.5} Q${w*.6},${-hh*.44} ${w*.5},0 Z" fill="${col}" stroke="#120c08" stroke-width="1"/>`
    +`<path d="M${-w*.2},${-hh*.5} Q0,${-hh*.66} ${w*.2},${-hh*.5} L${w*.12},${-hh*.74} L${-w*.12},${-hh*.74} Z" fill="${col}" stroke="#120c08" stroke-width="1"/>`
    +`<circle cx="0" cy="${-hh*.84}" r="${Math.max(3,hh*.12)}" fill="${col}" stroke="#120c08" stroke-width="1"/>`
    +`<line x1="${-hh*.12}" y1="${-hh*.92}" x2="${hh*.12}" y2="${-hh*.92}" stroke="#c9a227" stroke-width="${Math.max(1.4,hh*.03)}"/>`
    +`</g>`;
  /* danger tint at the extremes */
  if(size<=-3||size>=3) s+=`<rect x="0" y="0" width="${GW}" height="${GH}" fill="#e0403a" opacity=".12"/>`;
  s+=`</svg>`;
  return s;
}

/* =====================================================================
   THE WAKING WATERLINE — dream-depth drawn as water over the scene.
   waking 0..12. HIGH waking = near the surface = little water, pale.
   LOW waking = deep = the water rises and the colour super-saturates.
   Returns SVG for the #waterline overlay (viewBox 0..100, non-uniform).
   ===================================================================== */
function waterline(waking){
  waking=Math.max(0,Math.min(12,waking));
  const cover=Math.max(0, Math.min(0.82, (12-waking)/12*0.82));   /* fraction of height submerged */
  const top=(1-cover)*100;
  if(cover<=0.001) return '';
  const deep = waking<=4;
  const c1 = deep?'#0a2a4a':'#2a6a8a', c2 = deep?'#06121f':'#123a52';
  let s=`<svg viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">`;
  s+=`<defs><linearGradient id="wl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}" stop-opacity="${deep?.55:.32}"/><stop offset="1" stop-color="${c2}" stop-opacity="${deep?.8:.5}"/></linearGradient></defs>`;
  /* wavering surface */
  s+=`<path d="M0,${top} q12,-3 25,0 t25,0 t25,0 t25,0 L100,100 L0,100 Z" fill="url(#wl)">`
    +`<animate attributeName="d" dur="${deep?5:8}s" repeatCount="indefinite" values="`
    +`M0,${top} q12,-3 25,0 t25,0 t25,0 t25,0 L100,100 L0,100 Z;`
    +`M0,${top} q12,3 25,0 t25,0 t25,0 t25,0 L100,100 L0,100 Z;`
    +`M0,${top} q12,-3 25,0 t25,0 t25,0 t25,0 L100,100 L0,100 Z"/></path>`;
  /* the surface line itself */
  s+=`<path d="M0,${top} q12,-3 25,0 t25,0 t25,0 t25,0" fill="none" stroke="${deep?'#3a7a9a':'#8fd0e0'}" stroke-width=".5" opacity=".6"/>`;
  s+=`</svg>`;
  return s;
}

return { paint, sizeGauge, waterline };
})();
