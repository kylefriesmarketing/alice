/* =====================================================================
   CURIOUSER — data2.js — THROUGH THE LOOKING-GLASS (the second book).
   Unlocked once you have woken from Wonderland at least once.

   Where Wonderland was a garden of nonsense you wandered, the Looking-Glass
   is a CHESS PROBLEM you advance through: Alice is a white pawn on the second
   square, and to be crowned Queen she must reach the eighth. And where
   Wonderland's trap was REASON, the Looking-Glass inverts it: here everything
   runs backwards, and the trap is going FORWARDS — the sensible, direct,
   face-value move. To arrive you must walk away; to read you must reverse; to
   keep still you must run. The mirror-move advances you; the forwards-move
   costs you.

   New spine: SQUARE (2→8). Reach the eighth square and keep yourself through
   the mad coronation feast, and you wake crowned. It mutates ALICE in place
   (loaded after data.js).
   ===================================================================== */
(() => {
if(typeof ALICE==='undefined') return;

Object.assign(ALICE.regions, {
  lg_house:  { name:'The Looking-Glass House' },
  lg_garden: { name:'The Garden of Live Flowers' },
  lg_board:  { name:'The Great Chessboard' },
  lg_wood:   { name:'The Wood Where Things Have No Names' },
  lg_hall:   { name:'The Eighth Square' },
});

Object.assign(ALICE.nodes, {

/* ---------- the mirror ---------- */
lg_mirror:{ region:'lg_house', scene:'lgmirror', title:'Through the Glass',
  epigraph:'let\'s pretend the glass has gone all soft, like gauze',
  text:`The fire is warm and the black kitten will not hold still to be scolded, and you are half-telling it about the Looking-Glass house — the room you can see in the mirror over the mantel, the same as this one only the wrong way round — when the glass goes soft as gauze, and you step up onto the mantelpiece, and through.

The Looking-Glass room is the same and not. The clock on the chimney-piece has the face of a little old man, and it grins at you. The fire burns, and the pictures on the wall seem alive, and on the table lies a book — but when you open it, every word runs the wrong way. It is the poem <em>Jabberwocky</em>, and it is gibberish: <em>"sdrawkcab."</em>

Here is the first lesson of the second book, and it is the exact reverse of the first: in Wonderland, reason was the trap. <em>Here, going forwards is the trap.</em>`,
  choices:[
    { t:'Read the book straight, as it is written, and puzzle at the backwards words until they make sense.', pre:'forwards — the trap', kind:'reason', fail:true,
      note:'the harder you stare, the more it will not resolve; "brillig" and "slithy toves" are nonsense forwards, and staring at nonsense forwards is how you get nowhere in this house', waking:-1, go:'lg_garden' },
    { t:'Hold the book up to the mirror, so its backwards words run the right way round again, and read it reflected.', pre:'the mirror-move', kind:'play', key:true,
      note:'in the glass the words reverse and resolve, and the whole strange poem pours into you — the vorpal blade, the Tumtum tree, the frabjous day; you understand it exactly as much as anyone ever understands that poem, which is to say gloriously', self:1, add:'a poem you can only read in a mirror', go:'lg_garden' },
    { t:'Never mind the book — go and see the garden through the far door, walking as the room wants you to walk.', pre:'let the house be backwards',
      go:'lg_garden' },
  ]},

/* ---------- the garden of live flowers ---------- */
lg_garden:{ region:'lg_garden', scene:'lgboard', title:'The Garden That Walks Away',
  text:`Out of the house and into a garden, and you mean to get to the top of a hill to see the lie of the land — but the path keeps giving itself a little shake and turning into the house's front door again. Walk straight at the hill, and you arrive back where you started, every time.

The flowers here talk, and are frank to the point of rudeness — a Tiger-lily, a Rose, a bank of Daisies all shrieking at once — and it is a Rose who tells you the trick of it, tossing her head: <em>"I should advise you to walk the other way."</em>

In the distance, small as a chess-piece, a figure in red is walking — the Red Queen. Walk toward her and you will end at the door. So.`,
  choices:[
    { t:'Walk straight toward the Red Queen, directly, the sensible way you would approach anyone.', pre:'forwards — the trap', kind:'reason', fail:true,
      note:'the path shakes and folds you back to the door, and again, and again; directness is precisely the thing this garden refuses', waking:-1, go:'lg_garden2' },
    { t:'Take the Rose\'s advice and walk deliberately AWAY from the Queen — the wrong way, the mirror way.', pre:'the mirror-move', kind:'play', key:true,
      note:'walking away, you come round upon her at once, face to face, full-sized; in a reversed world the road to a thing runs off in the other direction', self:1, go:'lg_garden2' },
    { t:'Ask the flowers how a rose can talk at all — and whether they are not frightened, out here with no one to protect them.', pre:'pass the time',
      note:'"we can talk," says the Tiger-lily, "when there\'s anybody worth talking to" — and the Rose adds that the tree in the middle could protect them: "it can bark." "It says Bough-wough," cries a Daisy, "that\'s why its branches are called boughs!"', add:'a garden of flowers that talk, and only when it is worth it', go:'lg_garden2' },
  ]},
lg_garden2:{ region:'lg_garden', scene:'lgboard', title:'It Takes All the Running You Can Do',
  onArrive:S=>{ if(S.square===undefined) S.square=2; },
  text:`The Red Queen is enormous now, and brisk, and takes you by the hand, and suddenly you are both running — running hard, the trees and the whole landscape whipping past — and yet when you stop, gasping, you are under the very same tree you started from. <em>"Faster!"</em> cries the Queen. <em>"Don't try to talk!"</em>

<em>"In our country,"</em> you pant, when at last she lets you rest, <em>"you'd generally get to somewhere else — if you ran very fast for a long time, as we've been doing."</em>

<em>"A slow sort of country!"</em> said the Queen. <em>"Now, HERE, you see, it takes all the running YOU can do, to keep in the same place. If you want to get somewhere else, you must run at least twice as fast as that."</em>

Then she shows you the country laid out below: a great chessboard, brooks and hedges dividing it into squares. <em>"You're a Pawn now,"</em> she says, <em>"on the Second Square. When you get to the Eighth, you'll be a Queen."</em>`,
  choices:[
    { t:'Run toward the Eighth Square as hard as you can, straight for the goal.', pre:'forwards — the trap', kind:'reason', fail:true,
      note:'you run yourself breathless and stay exactly where you are; in this country running AT the thing you want only holds you in place', waking:-1, go:'lg_train' },
    { t:'Run twice as fast as fast — past sense, past effort, the mirror way, until the running itself carries you off the square.', pre:'the mirror-move', kind:'play', key:true,
      note:'you run past the point where running means anything, and the board itself moves under you; that is how one travels here — not by aiming, but by overrunning', self:1, waking:1, go:'lg_train' },
    { t:'Curtsey to the Queen and simply accept the rules of the board — pawn to the Eighth, square by square, to be crowned.', pre:'take your place', kind:'play',
      add:'that you might run a whole race and win it by standing still', go:'lg_train' },
  ]},

/* ---------- square 3→4: the railway leap ---------- */
lg_train:{ region:'lg_board', scene:'lgboard', title:'The Leap of the Second Square',
  onArrive:S=>{ if(S.square<3) S.square=3; },
  text:`A whistle, and you are in a railway carriage full of passengers who all seem to think you are travelling the wrong way — a Guard looks at you first through a telescope, then a microscope, then an opera-glass, and pronounces that you are travelling the wrong way and, worse, that <em>you have not got a ticket.</em> A chorus of voices insists you must be <em>labelled</em>: "she must be labelled 'Lass, with care'—"

A tiny Gnat, no bigger than a chicken by your ear, murmurs the joke of it. And the carriage gathers itself to jump — for this is the Second Square, and a pawn's first move goes <em>two squares at once</em> — over the brook to the Fourth.

You could insist on doing this properly: a ticket, a label, a fixed name and destination like a sensible traveller. Or you could let the leap simply take you.`,
  choices:[
    { t:'Insist on being ticketed and labelled and set right — sort out who you are and where you are going before you let the train move.', pre:'forwards — the trap', kind:'reason', fail:true,
      note:'the passengers file you eagerly, and being filed is exactly what you are trying not to be in this book; the leap happens anyway, but it drags you', waking:-1, size:0, go:'lg_tweedles' },
    { t:'Let the leap take you — unticketed, unlabelled, two squares at a bound over the brook.', pre:'the mirror-move', kind:'play', key:true,
      note:'you go up with the whole carriage, clear over the brook, and come down changed and free of every label they tried to pin on you — on the Fourth Square', self:1, add:'a leap of two squares over a brook, with no ticket at all', go:'lg_tweedles' },
  ]},

/* ---------- square 4: Tweedledum and Tweedledee ---------- */
lg_tweedles:{ region:'lg_board', scene:'lgboard', title:'Tweedledum and Tweedledee',
  onArrive:S=>{ if(S.square<4) S.square=4; },
  epigraph:'contrariwise',
  text:`Two fat little men under a tree, marked DUM and DEE on their collars, standing so still you take them for waxworks. When they speak they finish each other and contradict each other in the same breath. <em>"Contrariwise,"</em> says Tweedledee, <em>"if it was so, it might be; and if it were so, it would be; but as it isn't, it ain't. That's logic."</em>

They recite you the whole sad tale of the Walrus and the Carpenter and the trusting oysters, and neither can decide which of the two was the more to blame, and then they show you the Red King, asleep and snoring under a nearby tree, and say the thing that puts a cold finger on the back of your neck:

<em>"He's dreaming now,"</em> said Tweedledee. <em>"And what do you think he's dreaming about? You! And if he left off dreaming about you, where do you suppose you'd be? Nowhere. You're only a sort of thing in his dream. If that there King was to wake, you'd go out — bang! — just like a candle."</em>`,
  choices:[
    { t:'"I am NOT a thing in a dream — I am real!" Insist on it, and prove it, and argue them down.', pre:'forwards — the trap', kind:'reason', fail:true,
      note:'"you won\'t make yourself a bit realer by crying," says Tweedledee, unmoved — and the more you argue that you are not a dream the thinner and more dreamlike you feel', self:-1, waking:-1, go:'lg_wool' },
    { t:'Allow that you might well be a thing in someone\'s dream — and be perfectly cheerful about it, since a dream is as true a place to be as any.', pre:'the mirror-move', kind:'play', key:true,
      note:'meeting the idea without panic, you feel MORE yourself, not less; if you are a dream, you are a dream that knows it and does not mind, which is the only kind worth being', self:1, add:'that you may be a thing in the Red King\'s dream, and that this is all right', go:'lg_wool' },
    { t:'Whatever you are, do NOT wake the Red King. Step softly, and leave the poor snoring man his sleep, and yourself your existence.', pre:'let sleeping kings lie', kind:'play',
      note:'you tiptoe away from the great snoring bulk of him; better a dreamed girl who goes on than a real one who was never there at all', add:'a king whose sleep you dared not end, in case it ended you', go:'lg_wool' },
  ]},

/* ---------- square 5: the White Queen who lives backwards ---------- */
lg_wool:{ region:'lg_board', scene:'lgboard', title:'Living Backwards',
  onArrive:S=>{ if(S.square<5) S.square=5; },
  text:`The White Queen comes drifting by, pinned together all wrong, muttering, and she lives — you slowly understand — <em>backwards.</em> Her memory works both ways: she remembers best the things that happen the week after next. She cries out and nurses her finger a long while <em>before</em> she pricks it on her brooch, so that the pricking, when it comes, is a relief. Jam, she says, is served every other day: <em>"jam to-morrow and jam yesterday — but never jam to-day."</em>

Then she is a Sheep in a little dark shop, knitting with a great many needles, and the shop is the strangest yet: whenever you look hard at any shelf to see what it holds, <em>that</em> shelf is always empty, though the ones around it are crammed — the thing you want flows away up to the ceiling the instant you fix your eyes on it.`,
  choices:[
    { t:'Fix your eyes firmly on the shelf with the lovely bright thing, and look straight at it until you can take hold of it.', pre:'forwards — the trap', kind:'reason', fail:true,
      note:'the moment you look straight at it, it drifts up and away and the shelf is bare; in this shop, looking directly AT a thing is exactly how to lose it', waking:-1, go:'lg_humpty' },
    { t:'Don\'t look at it directly — look at the shelf just ABOVE, and let the thing you want stay at the corner of your eye, and reach for it sideways.', pre:'the mirror-move', kind:'play', key:true,
      note:'kept at the edge of sight, the bright thing holds still, and your hand closes on it; some things in a glass-world can only be had by not quite looking', self:1, go:'lg_humpty' },
    { t:'Believe the White Queen when she screams before the pin has pricked her — take her backwards memory as simply true, and comfort her for a hurt that has not happened yet.', pre:'the mirror-move', kind:'play',
      note:'you soothe a wound that is still in her future, and she calms, and you have accepted the deepest rule of the glass: that here, cause can perfectly well come after effect', self:1, waking:1, add:'a queen who remembers the future and bleeds before the pin', go:'lg_humpty' },
  ]},

/* ---------- square 6: Humpty Dumpty ---------- */
lg_humpty:{ region:'lg_board', scene:'lgwall', title:'A Word Means What I Choose',
  onArrive:S=>{ if(S.square<6) S.square=6; },
  epigraph:'the question is which is to be master — that\'s all',
  text:`On a high, narrow wall, balanced impossibly, sits an enormous egg with a face — Humpty Dumpty, who takes instant offence at everything and explains the world with vast, teetering confidence. When you object that a word cannot simply mean whatever one likes, he is scornful:

<em>"When I use a word,"</em> Humpty Dumpty said, in rather a scornful tone, <em>"it means just what I choose it to mean — neither more nor less."</em>

<em>"The question is,"</em> said you, <em>"whether you CAN make words mean so many different things."</em>

<em>"The question is,"</em> said Humpty Dumpty, <em>"which is to be master — that's all."</em>

He offers to explain the whole of <em>Jabberwocky</em> to you — brillig and slithy and mimsy and the mome raths — if only you will let words mean exactly what he says they mean, and not one thing more.`,
  choices:[
    { t:'Hold the line: a word has a real meaning, fixed and shared, and no one — not even an egg — gets to simply decide otherwise.', pre:'forwards — the trap', kind:'reason', fail:true,
      note:'you are, by the rules of the waking world, entirely correct, and it gets you exactly nowhere; Humpty snorts and refuses to explain a single word, and you leave the poem as dark as you found it', waking:-1, go:'lg_knight' },
    { t:'Let him be master of his words — accept that here a word means what its speaker chooses — and take the whole mad, generous glossary he pours out in return.', pre:'the mirror-move', kind:'play', key:true,
      note:'you let "slithy" mean lithe-and-slimy and "mimsy" mean flimsy-and-miserable because HE says so, and in return the impenetrable poem cracks open like — well — like an egg; meaning here is a thing you agree to, not a thing you find', self:1, add:'a word that means exactly, and only, what its speaker chooses', go:'lg_knight' },
    { t:'Warn him, gently, that he is sitting very high on a very narrow wall, and that eggs and walls are a poor combination.', pre:'a kindness he will not take', kind:'play',
      note:'"if I ever DID fall off," he says with enormous dignity, "the King has promised — with his very own mouth — to send all his horses and all his men." You do not have the heart to finish the rhyme for him', add:'a great fall that all the king\'s horses could not undo', go:'lg_knight' },
  ]},

/* ---------- square 7→8: the White Knight ---------- */
lg_knight:{ region:'lg_board', scene:'lgboard', title:'The White Knight',
  onArrive:S=>{ if(S.square<7) S.square=7; },
  text:`A Red Knight and a White Knight thunder up, both claiming you prisoner, and have a long clattering battle of falling off their horses (they can only fight by tumbling off, it seems), and the White Knight wins by the simple method of the Red Knight galloping away. And then the gentlest thing in either book: the White Knight, elderly and mild and forever sliding off his horse head-first, insists on seeing you safely to the last brook — the edge of the Eighth Square — because after that, he says, you will be a Queen, and he may come no further.

He is a hopeless, dear inventor: a mousetrap on his saddle in case of mice, anklets against sharks, a pudding made of blotting-paper. He offers to sing you a song to comfort you. <em>"The name of the song is called 'Haddocks' Eyes,'"</em> he begins, and gets so tangled in what the song is called versus what the song IS that the song itself is nearly lost — and it is, when he finally sings it, unbearably sweet and sad, and you know you will remember the tune long after you have forgotten everything else about the glass.`,
  choices:[
    { t:'Sit and listen to the whole of his ridiculous, heartbreaking song, and thank him for it, and let the goodbye be a real one.', pre:'the mirror-move: go slow to arrive', kind:'play', key:true,
      note:'you give the last gentle creature of the dream your full attention, and carry his tune up out of the glass with you; the kindest way to the Eighth Square, it turns out, is not to hurry across it', self:1, waking:1, add:'the sweetest, saddest song, remembered whole', go:'lg_crown' },
    { t:'Thank him kindly but hurry on — the crown is one brook away, and you have run this whole board to reach it.', pre:'forwards — a smaller trap', kind:'reason', fail:true,
      note:'you cross the brook a Queen, but with the Knight\'s song only half-heard behind you, and something warm is left on the wrong side of the water', waking:-1, go:'lg_crown' },
  ]},

/* ---------- square 8: the coronation and the mad feast ---------- */
lg_crown:{ region:'lg_hall', scene:'lgcrown', title:'The Eighth Square',
  onArrive:S=>{ S.square=8; },
  epigraph:'a golden crown, and rather heavy',
  text:S=>`You jump the last brook — and something heavy settles on your head. A crown. You are a Queen.

The Red Queen and the White Queen sit on either side of you, and they are not congratulatory; they are an examination. <em>"Can you do Addition?"</em> the Red Queen demands. <em>"What's one and one and one and one and one and one and one and one and one and one?"</em> <em>"I don't know,"</em> you say, <em>"I lost count."</em> <em>"She can't do Addition,"</em> the Red Queen says with contempt.

And then a feast — a great mad feast in your honour that will not behave. The candles grow up to the ceiling like a bed of rushes. The bottles put plates on their heads for wings and flutter about. The leg of mutton is formally introduced to you and bows, and it is considered <em>very</em> rude to cut anything you have been introduced to. The guests lie down in the dishes. The soup ladle walks up the table toward your chair. It is coming apart, all of it, into pure roaring nonsense — and you are the Queen of it, and ${S.square>=8?'you have crossed the whole board the mirror way to be here':'you have come a long way to be here'}, and the question now is only how you will end it.`,
  choices:S=>{
    const c=[];
    const fails=(S.flags&&S.flags.mirrorFail)||0;
    c.push({ t:'Rise to your full height as a Queen and let the whole roaring feast be exactly as mad as it likes — you have kept yourself across eight squares of nonsense and you are not going to lose your head at the table.', pre:'a Queen, and yourself', kind:'play',
      note:'you meet the collapse the way you learned to meet everything in the glass: without panic, without insisting it make sense; and being a Queen who does not mind the madness is its own kind of waking', self:1, waking:2,
      go: s => (s.self>=4 && fails<=2) ? 'lg_crown_end' : 'lg_crown_end2' });
    c.push({ t:'Seize the tablecloth in both hands and pull — bring the whole feast down in a crash — and grab the Red Queen, who has shrunk to the size of a doll, and shake her, and shake her, and shake—', pre:'end it yourself', kind:'defy',
      note:'you shake the little Queen harder and harder and she grows shorter, and rounder, and softer, and blacker—', end:'lg_kitten' });
    if(fails>=3 || S.self<=1) c.push({ t:'Let it all come apart without you — sink into the roar of it, and let the feast decide, since nothing here has ever done what you wanted anyway.', pre:'give the glass its way', kind:'reason',
      note:'you stop trying to be anyone in particular, and the nonsense closes over you like water', end:'lg_unmade' });
    return c;
  }},
lg_crown_end:{ region:'lg_hall', scene:'lgcrown', title:'—',
  text:`The feast roars to its climax and you rise up over all of it — <em>"I can't stand this any longer!"</em> — and seize the tablecloth, and the whole mad banquet goes up into the air, and comes down as—`,
  choices:[
    { t:'—the ordinary evening, and the fire, and the warm dark room.', end:'lg_queen' },
  ]},
lg_crown_end2:{ region:'lg_hall', scene:'lgcrown', title:'—',
  text:`You keep your feet, more or less, through the collapse — a Queen, if a rattled one — and the roar rises and the candles reach the ceiling and the whole glass-world tips, and comes down as—`,
  choices:[
    { t:'—the ordinary evening, and the fire, and the warm dark room.', end:'lg_queen' },
  ]},

});

/* ---------- the Looking-Glass wakings ---------- */
Object.assign(ALICE.endings, {
  lg_queen:{ kind:'true', scene:'wake', title:'Queen Alice',
    verse:'You crossed the whole board the mirror way, and were crowned, and were still yourself.',
    text:S=>`You are back in the great arm-chair, by the fire, and the black kitten is in your lap, and you are quite out of breath, and crowned with nothing but firelight.

But you were a Queen. You crossed all eight squares of the Looking-Glass — and you did it the mirror way: you walked away from what you wanted, and ran to stand still, and let words mean what their speakers chose, and never once tried to force the backwards world to run forwards for you. That is the whole trick of a glass, and of a good deal else: you cannot make a reflected world obey the rules of the real one. You can only learn to move the way it moves — and keep yourself, all the way through, so that the girl who is crowned at the eighth square is the same girl who stepped up onto the mantelpiece.

${S.self>=5?'You kept nearly all of yourself across the whole board. Queens are made of exactly that.':'You are a little breathless, and a little changed, but you are unmistakably, entirely yourself — and a Queen besides.'}

You look at the kitten. <em>"Which do you think it was?"</em> you ask it — but of course it only purrs, and will not say whether it was you who dreamed the Red King, or the Red King who dreamed you.`,
  },
  lg_kitten:{ kind:'secret', scene:'wake', title:'Which Dreamed It?',
    verse:'And the kitten only purred. Which do you think it was?',
    text:`— the black kitten, in your hands, in the arm-chair, being shaken, and you stop at once, ashamed, and set it down.

Because that is how the glass lets you go: you shook the Red Queen, and she shrank and softened and blacked into the kitten who was on your lap the whole time, and the roaring feast was only the fire and the ticking clock, and you never left the warm room at all. Or did you? The white kitten had nothing to do with it — it was having its face washed by the old cat — so it MUST have been the black kitten who was the Red Queen, and if the black kitten was the Red Queen, then you were in the Red King's dream, and the Red King was in yours, and—

You take the kitten up to the looking-glass to show it its own puzzled face. <em>"Now, Kitty, let's consider who it was that dreamed it all. This is a serious question, my dear, and you should NOT go on licking your paw like that — as if Dinah hadn't washed you this morning!"</em>

It was a long dream, and a backwards one, and you came home from it yourself. Which, in the end, is the only answer that matters — whoever did the dreaming.`,
  },
  lg_unmade:{ kind:'stay', scene:'dark', title:'The Wood With No Names',
    verse:'You insisted the glass run forwards. The glass unmade you instead.',
    text:`It comes apart, and you with it.

You spent the whole board pushing forwards — staring straight at the thing you wanted, running at your goal, demanding that words hold still and that memory run the right way and that a dream admit it was not one. And a glass-world will indulge that for a while, the way still water indulges a stone. But you never learned to move the mirror way, and so when the eighth square came apart, there was nothing in you that knew how to come apart <em>with</em> it and reassemble on the far side.

So you drift back, instead, into the wood where things have no names — the still, kind, terrible wood you passed through early, where you could not remember what you were called and did not, for a while, mind. A fawn walked beside you there once, unafraid, until you both came out the far side and it remembered you were a human child and bolted. This time you do not come out the far side. You stay among the nameless trees, unworded, a girl-shaped forgetting, while somewhere very far off a fire burns down in an empty arm-chair and a kitten mews to be let out.`,
  },
});

ALICE.startLG='lg_mirror';
ALICE.newRunLG=()=>({ node:'lg_mirror', book:'lookingglass',
  size:0, self:4, waking:6, square:2, mushroom:false,
  contradiction:0, index:0, journal:[], impossibleThings:[], seen:{}, flags:{} });

})();
