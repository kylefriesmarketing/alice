/* =====================================================================
   CURIOUSER — a playable book of Alice's Adventures in Wonderland.
   For THE SHELF. All content is data-driven; the engine reads this file.

   You are Alice. You cannot win Wonderland — you can only WAKE, and the
   trick is to wake as yourself. Four instruments:
     SIZE   (-3..+3, 0 = your true size) — the one hard rule, bidirectional:
            too big and too small are BOTH failure. The Caterpillar's mushroom
            makes it controllable at will.
     SELF   (0..6) — who you still are. Gates DEFY. Zero = you wake as Mabel.
     WAKING (0..12) — dream-depth. HIGH = near the riverbank (pale, calm water
            low); LOW = deep in the dream (colours drown, water high); 0 = you
            never wake (THE STAY).
     IMPOSSIBLE THINGS — the impossibilities you accept, catalogued across runs.
            Six before breakfast is a milestone; you cannot wake WELL from a
            dream you fought the whole way.

   Every creature-encounter offers up to three postures:
     REASON  — usually the trap (frustration is a kind of drowning), BUT each
               room hides exactly one grounding truth (key:true) that cuts through.
     PLAY    — accept the impossible on its terms. The humble, reliable way; builds
               IMPOSSIBLE THINGS. Overused, you play along so well you never leave.
     DEFY    — refuse to be governed. The growth move. Gated by SELF.

   NODE  = { id, region, scene, title, epigraph?, text(str|fn(S)),
     gate?:{min?,max?,onWrong,note?},            // wrong SIZE on arrival → authored branch
     consumables?:[{label,note?,size,id,fx?}],   // DRINK ME / cake / pebble-cakes (reusable)
     choices:[CHOICE]|fn(S), onArrive?(S), grantsMushroom?:bool }
   CHOICE = { t, pre?, kind?:'reason'|'play'|'defy', req?(S), key?:bool,
     self?, waking?, size?, add?:'an impossible thing', fx?(S),
     go|end (str|fn) }
   ===================================================================== */
const ALICE = (() => {

const regions = {
  fall:       { name:'Down the Rabbit-Hole' },
  hall:       { name:'The Hall of Doors' },
  pool:       { name:'The Pool of Tears' },
  caucus:     { name:'A Caucus-Race' },
  rabbithouse:{ name:"The White Rabbit's House" },
  caterpillar:{ name:'Advice from a Caterpillar' },
  wood:       { name:'The Wood With No Names' },
  kitchen:    { name:"The Duchess's Kitchen" },
  cheshire:   { name:'The Cheshire Cat' },
  teaparty:   { name:'A Mad Tea-Party' },
  croquet:    { name:"The Queen's Croquet-Ground" },
  mockturtle: { name:"The Mock Turtle's Tale" },
  trial:      { name:'Who Stole the Tarts?' },
  wake:       { name:'The Riverbank' },
};

/* ---- the recurring cast, for the gallery ---- */
const cast = {
  rabbit:{ name:'The White Rabbit', role:'always late, always ahead',
    note:'Waistcoat, watch, and a perpetual grievance with the time. He never explains and never waits, and following him is the closest thing Wonderland offers to a map. You will spend the whole dream one hurry behind him.' },
  cheshire:{ name:'The Cheshire Cat', role:'the one honest guide',
    note:'The only creature down here who tells you the truth: that everyone is mad, including you, or you would not have come. He arrives grin-first and leaves grin-last, and he is right about everything in a way that helps you not at all.' },
  caterpillar:{ name:'The Caterpillar', role:'three inches of contempt',
    note:'He smokes a hookah and asks the worst question in the world — "Who are you?" — and will not accept that you are not sure. He is unbearable, and he gives you the one durable rule of Wonderland, and both of those are true at once.' },
  duchess:{ name:'The Duchess', role:'pepper and morals',
    note:'She finds a moral in everything and pepper in the rest. She will hand you a baby, sneeze at you, and hurry off to her croquet, and the baby will not stay a baby. Everything she says is either menace or mush, and the tea-party has taught her nothing.' },
  hatter:{ name:'The Hatter & the March Hare', role:'stuck at six o\'clock',
    note:'They quarrelled with Time and Time stopped for them at tea, so it is always tea-time and never washing-up. They are rude on principle and hospitable out of habit, and the Dormouse sleeps through the argument, which is the only sensible thing anyone does here.' },
  queen:{ name:'The Queen of Hearts', role:'the death-that-isn\'t',
    note:'She rules by the only verb she knows, and shouts it a hundred times a day, and nobody is ever actually shorter by a head at the end of it. Her croquet has no rules, her roses are the wrong colour on purpose, and her fury is the loudest thing in the dream — which, near the surface, is exactly why it can wake you.' },
  sister:{ name:'Your Sister', role:'the voice from the bank',
    note:'She is reading on the riverbank in the warm afternoon while you sleep with your head in her lap. She is the whole waking world, dwindled to one faraway voice, and if you surface far enough you will hear her call you by your own right name.' },
};

/* ---- the nodes: the garden as a graph ---- */
const nodes = {

/* ===================== DOWN THE RABBIT-HOLE (tutorial) ===================== */
n_fall:{ region:'fall', scene:'fall', title:'The Fall',
  epigraph:'and burning with curiosity, she ran across the field',
  text:`There was a rabbit. That is how these things start — with a small white lie of a rabbit, in a waistcoat, taking a watch out of its pocket and saying, quite clearly, that it was going to be <em>late</em>.

You went down the hole after it without one thought of how in the world you were to get out again. And now you are falling. Not fast — the way you fall in dreams, slow enough to notice the cupboards and bookshelves and jars lining the walls of the well as they drift up past you, slow enough to be bored, slow enough to wonder how far you have come and whether you will fall clean through the earth and come out among the people who walk with their heads downward.

You are the right size. Remember that. It will not last.`,
  choices:[
    { t:'Take a jar of marmalade off a passing shelf, out of tidiness, and set it on the next shelf down.', pre:'a well-brought-up sort of fall',
      self:1, add:'a fall polite enough to tidy up during', go:'n_fall2' },
    { t:'Talk aloud to the dark, to keep yourself company, and practise your curtsey for whoever is at the bottom.', pre:'manners, all the way down',
      go:'n_fall2' },
    { t:'Simply fall, and watch, and let the strangeness be strange without arguing with it.', pre:'the first lesson, learned early',
      waking:1, add:'a fall with no bottom worth mentioning', go:'n_fall2' },
  ]},
n_fall2:{ region:'fall', scene:'fall', title:'Thump.',
  text:`Thump! Thump! Down upon a heap of sticks and dry leaves, and the fall is over, and you are not hurt in the least. The Rabbit is still ahead — a flash of white, a mutter of <em>"Oh my ears and whiskers, how late it's getting!"</em> — and then it hands itself round a corner and is gone.

You are in a long, low hall, lit by a row of lamps hanging from the roof. Ahead the Rabbit's footsteps fade. You came all this way down; there is nothing to do but go on.

Except the hall is not quite as you half-remember it. Every door wears a small brass plate now, freshly screwed on, giving its one correct name. A notice on the wall reads: <em>PLEASE DO NOT BE MORE THAN ONE THING AT A TIME.</em> And somewhere far below, very faintly, you can hear a great book being written — one careful, permanent line at a time.

<span class="tut">This is a dream, and Wonderland is being <em>corrected</em> — put in order, made to make sense, before midnight and the Last Unbirthday. You cannot die here, and you cannot win. You can only wake as yourself — and keep Wonderland strange enough to be worth waking from. The one thing you fully control is your <em>size</em>. Mind it. Every door here is built to the wrong measurements on purpose — or was, before they started fixing them.</span>`,
  choices:[
    { t:'Follow, before the last door swings shut.', go:'n_hall' },
  ]},

/* ===================== THE HALL OF DOORS / POOL OF TEARS ===================== */
n_hall:{ region:'hall', scene:'hall', title:'The Hall of Doors',
  epigraph:'how she longed to get out of that dark hall',
  rule:'The Rule of the Hall (freshly pinned): only the correctly-sized may use a door.',
  gate:{ max:1, onWrong:'n_pool', note:'grown too large for the hall' },
  onArrive:S=>{ if(S.flags.hallSolved) return; },
  text:S=>{
    const key = S.flags.hasKey ? 'You have the little golden key warm in your fist.' : 'On the glass table sits a little golden key — far too small for any of the grand doors, and the table is nearly at your eye-line.';
    const sz = S.size<=-2 ? '\n\nYou are small now — thimble-small — and the world has gone up and enormous around you.' : (S.size>=1 ? '\n\nYou seem a little larger than you ought to be. The ceiling is closer than it was.' : '');
    return `Doors, all round the hall, and every one of them locked — you go down one side and up the other, trying each, and come sadly back to the middle wondering how you are ever to get out.

Then: a curtain you had not noticed, and behind it a little door, hardly fifteen inches high. You kneel and look along the passage beyond into the loveliest garden you ever saw — cool fountains, bright beds of flowers — and you cannot so much as get your head through the doorway.

${key}

On the same table (or was it there before?) a bottle says <em>DRINK ME</em> in large letters, and beside it a very small cake says <em>EAT ME</em> in currants. The dream sets its table plainly. It is you who are the wrong size for it.${sz}`;
  },
  consumables:[
    { label:'Drink from the bottle marked DRINK ME', id:'drink', size:-2,
      note:'a curious mixed flavour of cherry-tart, custard, pineapple, roast turkey, toffee and hot buttered toast — and you shut up like a telescope' },
    { label:'Eat a bite of the cake marked EAT ME', id:'cake', size:2,
      note:'and you open out like the largest telescope that ever was' },
  ],
  choices:S=>{
    const c=[];
    if(!S.flags.hasKey && S.size>=0)
      c.push({ t:'Reach up and take the golden key from the glass table while you are still tall enough.', pre:'plan ahead',
        self:1, fx:s=>s.flags.hasKey=1, go:'n_hall' });
    if(!S.flags.hasKey && S.size<=-1)
      c.push({ t:'Try to reach the key — it is miles above you now, on a table of polished glass.', pre:'too small',
        note:'you slip and slither and cannot climb the leg of the table', waking:-1, go:'n_hall' });
    if(S.flags.hasKey && S.size<=-2)
      c.push({ t:'Unlock the little door and step through into the garden.', pre:'the right size, and the key', kind:'play',
        self:1, waking:1, fx:s=>s.flags.hallSolved=1, add:'a door built to keep you out, opened by shrinking', go:'n_hall_garden' });
    if(S.size<=-2 && !S.flags.hasKey)
      c.push({ t:'Kneel at the open little door — you fit now, but the key is up on the table and the door is locked fast.', pre:'small, and shut out',
        note:'you sit down and begin to cry; grow first, and fetch the key', waking:-1, go:'n_hall' });
    if(S.size>=0 && S.size<=1)
      c.push({ t:'Kneel and breathe the garden air through the fifteen-inch door, and want, more than anything, to be small.', pre:'the wanting',
        go:'n_hall' });
    c.push({ t:'Sit down on the cold tiles and think it through: which do you need to be — larger, or smaller?', pre:'take stock',
      note:'the key wants you tall; the door wants you tiny; you cannot be both at once', go:'n_hall' });
    return c;
  }},
n_hall_garden:{ region:'hall', scene:'hall', title:'The Threshold',
  text:`The key turns. The door opens. You step through — into the passage, into the smell of warm earth and cut grass, into a garden that is everything a garden has ever promised to be.

And it recedes. Not quickly. As you walk toward the fountains they hold their distance, exactly, the way the horizon does; the bright beds stay always a little ahead. You could walk toward this garden your whole life.

Somewhere behind you a watch ticks, and the White Rabbit hurries across the far end of the hall muttering about a Duchess who will have him executed, and drops a pair of white kid gloves and a fan, and is gone. You are small, and quick, and you still have your wits about you.`,
  choices:[
    { t:'Let the garden be a garden that recedes. Some things are truer for being out of reach. Follow the Rabbit instead.', kind:'play',
      waking:1, add:'a garden that walks away as you walk to it', go:'n_caucus' },
    { t:'Snatch up the fan the Rabbit dropped and follow, fanning yourself in the heat.', pre:'careful — the fan is not just a fan',
      size:-1, note:'you fan yourself and go on shrinking, quietly, without noticing', fx:s=>s.flags.tookFan=1, go:'n_caucus' },
  ]},
n_pool:{ region:'pool', scene:'pool', title:'The Pool of Tears',
  epigraph:'I wish I hadn\'t cried so much!',
  text:S=>`You have grown. Grown and grown, up past nine feet, your head folded against the roof of the hall, one elbow jammed in the fireplace and your chin on your knees — far too big now for any door in the world, the little one least of all.

And it is too much, suddenly, all of it, and you begin to cry. Great pooling tears, gallons of them, four inches deep and spreading down the whole length of the hall. You cry the way only something enormous can cry, and the pool rises, and you go on making it worse.

${S.size>=3?'You are as large as it is possible to be, and the water is warm, and part of you wants to give the whole thing up and simply fill the hall like a flood.':'If you could only get small again you might swim clear — and there, floating, is the Rabbit\'s white fan.'}`,
  consumables:[
    { label:'Drink again from the DRINK ME bottle (it followed you, of course)', id:'drink', size:-2,
      note:'down you telescope, faster than you like' },
  ],
  choices:S=>{
    const c=[];
    if(S.size>=-1 && S.size<=1)
      c.push({ t:'Take up the floating fan and fan yourself smaller until you can swim.', pre:'the right size at last',
        size:-1, waking:1, fx:s=>s.flags.smallish=1, go:'n_pool_swim' });
    if(S.size<=-2)
      c.push({ t:'You are small enough now — strike out and swim for the far shore before the pool becomes an ocean.', pre:'swim', kind:'play',
        add:'weeping a whole sea and then swimming in it', go:'n_pool_swim' });
    if(S.size>=2)
      c.push({ t:'Give it up. Let the pool rise. It is warm, and being enormous is at least a kind of safety, and the crying is almost pleasant now.', pre:'the flood',
        waking:-2, note:'the water climbs, and something in you settles toward the bottom of the dream', go:'n_pool_give' });
    c.push({ t:'Fish the fan out of the water and hold it — do not fan yet — and get your bearings.', pre:'steady',
      go:'n_pool' });
    return c;
  }},
n_pool_swim:{ region:'pool', scene:'pool', title:'Swimming Company',
  gate:{ min:-2, onWrong:'n_pool_drown', note:'shrunk so small the pool is an ocean' },
  text:`You swim. The pool has become a small warm sea, and you are not the only swimmer in it — a Mouse paddles past, offended by your very presence; a Duck, a Dodo, a Lory and an Eaglet flounder behind, and a good many other creatures besides, all of them washed off the same tide of your weeping.

You strike out together for the shore, a queer bedraggled procession, and haul yourselves up onto the bank, dripping and cross and thoroughly out of sorts. The Dodo, who has an air of authority chiefly because it uses long words, declares that the best thing to get dry is a Caucus-race.`,
  choices:[
    { t:'Ask, reasonably, what on earth a Caucus-race is.', kind:'reason', pre:'the trap of sense', key:true,
      note:'the Dodo says the best way to explain it is to do it — and, honestly, it is', self:1, go:'n_caucus' },
    { t:'Say nothing sensible; simply line up to run, wherever the running is.', kind:'play',
      go:'n_caucus' },
  ]},
n_pool_drown:{ region:'pool', scene:'pool', title:'A Thimble on the Tide',
  text:`You shrank too far. Thimble-small, mouse-small, and the pool is not a pool now but a green heaving ocean and you are a speck upon it, and a warm wave folds you under.

You do not drown — you cannot die here — but you go down into the warm dark of your own tears, and it is very like giving up, and it takes something out of you to claw back to the light. A wave, at last, tips you up onto the shingle, coughing, spent, and much shaken about who exactly this small wet person is.`,
  choices:[
    { t:'Lie on the shingle and gather yourself, and your name, back together.', self:-1, waking:-2,
      go:'n_caucus' },
  ]},
n_pool_give:{ region:'pool', scene:'pool', title:'The Warm Flood', scene2:true,
  text:`The water rises to your folded knees, your jammed elbow, your chin. It is warm as a bath and the crying has become almost a comfort, and being the largest thing in the hall means nothing can push you anywhere you do not already fill.

You could stay like this. Enormous, weeping, safe, the flood closing over the little locked door forever. The dream would like that. The dream is patient.`,
  choices:[
    { t:'No. Get small. Get out. Grope through the water for the fan and fan yourself free.', pre:'not yet, and not like this',
      waking:1, size:-2, go:'n_pool' },
    { t:'Stay. Fill the hall. Let the warm water close the little door for good.', pre:'the give-up', kind:'defy',
      end:'e_stay' },
  ]},

/* ===================== A CAUCUS-RACE ===================== */
n_caucus:{ region:'caucus', scene:'caucus', title:'Everybody Has Won',
  epigraph:'the best way to explain it is to do it',
  text:`The Dodo marks out a race-course in a sort of circle — <em>the exact shape doesn't matter,</em> it says — and dots all the wet, cross creatures along it here and there. There is no <em>"One, two, three, and away,"</em> but everyone begins running whenever they like and leaves off whenever they like, so it is not easy to know when the race is over.

When they have all been running half an hour and are quite dry again, the Dodo suddenly calls out that the race is done, and everybody crowds round it, panting, asking <em>"But who has won?"</em>

This question the Dodo cannot answer without a great deal of thought. At last it says: <em>"Everybody has won, and all must have prizes."</em>`,
  choices:[
    { t:'Point out — quite correctly — that a race with no start, no finish and no rules cannot really be a race at all.', kind:'reason', pre:'the trap of sense',
      note:'the creatures fall silent and look at you as if you had said something rather sad; the Lory turns its back', self:-1, waking:-1, go:'n_caucus_prize' },
    { t:'Run when you feel like running, stop when you feel like stopping, and dry off with the rest — and privately allow that everyone winning is a fine way to run a race.', kind:'play', pre:'the way through',
      waking:1, add:'a race with no rules that everybody wins', go:'n_caucus_prize' },
    { t:'Demand a proper winner be named, and refuse to accept prizes all round.', kind:'defy', pre:'stand your ground', req:s=>s.self>=3,
      note:'you get your way, and the party sours, and a prize meant for everyone is a poor thing to win alone', self:-1, waking:-1, go:'n_caucus_prize' },
  ]},
n_caucus_prize:{ region:'caucus', scene:'caucus', title:'Your Own Thimble',
  text:S=>`Prizes, then. The Dodo solemnly requires that <em>you</em> hand them round — a comfit apiece, exactly enough to go around — and then, since you must have a prize too, it asks what you have in your pocket. A thimble, only a thimble. The Dodo takes it, and presents it back to you with great ceremony: <em>"We beg your acceptance of this elegant thimble."</em>

You accept your own thimble as a gift, and bow, and try very hard not to laugh, because the whole solemn company would think it dreadfully rude — and because, ${S.impossibleThings.length?'somewhere between the race and the thimble, the rules of the waking world have quietly stopped applying, and you find you do not mind':'somehow, it is the kindest ceremony you have ever been part of'}.

Then a sharp bark, a scurry — a small white shape — <em>"The Duchess! The Duchess! Oh, she'll have me beheaded, as sure as ferrets are ferrets!"</em> — and the Rabbit is off again, and this time you run after it in earnest.`,
  choices:[
    { t:'Follow the Rabbit — into a neat little house with a brass plate reading W. RABBIT.', go:'n_rabbit' },
  ]},

/* ===================== THE WHITE RABBIT'S HOUSE (the too-big failure) ===================== */
n_rabbit:{ region:'rabbithouse', scene:'rabbithouse', title:'Mary Ann, Fetch My Gloves',
  epigraph:'it\'ll be no use their putting their heads down and saying "Come up again, dear!"',
  text:`The Rabbit sees you at its door and does not see <em>you</em> at all. <em>"Mary Ann! Mary Ann!"</em> it snaps. <em>"What are you doing out here? Run home this moment and fetch me a pair of gloves and a fan! Quick, now!"</em> — and it points up its own stairs, and is too full of hurry to notice it has just sent a strange girl to burgle its bedroom.

You go, because it is easier than arguing with a rabbit. Upstairs, a tidy little room, a table by the window, and on the table — of course — a bottle. No label this time. Only a bottle, and the memory of the last one, and the strong dream-certainty that <em>something interesting is sure to happen whenever you eat or drink anything at all here.</em>`,
  consumables:[
    { label:'Drink from the little unlabelled bottle', id:'growbottle', size:3,
      note:'and before you are half through it your head presses the ceiling and you have to stoop to save your neck' },
  ],
  choices:S=>{
    const c=[];
    if(S.size>=2){
      c.push({ t:'Too late — you are filling the house, an arm out the window, a foot up the chimney. There is nothing to do but wait, and be enormous, and be stuck.', pre:'far too big', go:'n_rabbit_big' });
    } else {
      c.push({ t:'Refuse the bottle. You are not Mary Ann, and you are not anyone\'s to be sent for gloves.', kind:'reason', pre:'the grounding truth', key:true,
        note:'you say it aloud — "I am not Mary Ann" — and something in you holds its shape; you pocket the gloves and go back down, still yourself', self:1, go:'n_rabbit_out' });
      c.push({ t:'Drink it. Last time a bottle was the whole adventure — why should this one be different?', kind:'play', pre:'curiosity, again',
        size:3, note:'and it is different, and it is worse', go:'n_rabbit_big' });
    }
    return c;
  }},
n_rabbit_big:{ region:'rabbithouse', scene:'rabbithouse', title:'Filling the House',
  text:`You are enormous. One arm out of the window, one foot jammed up the chimney, your knees against the door, and the little house creaks around you like a shoe that is much too small. You could not leave now if you wished to; you are the wrong size to fit your own escape.

Outside, the Rabbit is beside itself, and there is a great deal of small furious consultation, and then the animals begin to throw pebbles at you through the window — sharp little pebbles that, the moment they touch the floor of the room, turn quietly into little cakes.

The dream is offering you the exit. It is spelled the way the last one was: <em>eat, and change.</em>`,
  consumables:[
    { label:'Eat one of the little pebble-cakes', id:'pebble', size:-2,
      note:'and the moment it is down you begin, blessedly, to shrink' },
  ],
  choices:S=>{
    const c=[];
    if(S.size<=0)
      c.push({ t:'Small enough! Bolt out of the door, through the crowd of small creatures, and away into the wood.', pre:'escape', kind:'play',
        waking:1, add:'a houseful of you, escaped by eating a pebble', go:'n_wood' });
    if(S.size>0 && S.size<=1)
      c.push({ t:'Nearly there — you can move now; squeeze for the door before you grow again.', pre:'almost', go:'n_wood' });
    if(S.size>=2)
      c.push({ t:'Give up on ever being the right size. Settle in. Be the giant in the little house; let the wood forget there was a door at all.', pre:'the trap of scale', kind:'defy',
        note:'you stop reaching for the cakes; the house closes around you like a fist', end:'e_wrongsize' });
    return c;
  }},
n_rabbit_out:{ region:'rabbithouse', scene:'rabbithouse', title:'Down the Stairs, Still Yourself',
  text:`You come back down the stairs the same size you went up, which in Wonderland is a small triumph and possibly a first. The Rabbit snatches the gloves without thanks and is gone about its Duchess business, and you are left in the neat front garden of a rabbit, holding onto your own name with both hands.

A path leads off between the trees. It is the only way that is not back. Somewhere ahead the wood begins — the wood where, they say, things forget what they are called.`,
  choices:[
    { t:'Walk on into the wood.', waking:1, go:'n_wood' },
  ]},

/* ===================== THE WOOD → THE CATERPILLAR ===================== */
n_wood:{ region:'wood', scene:'caterpillar', title:'A Blue Coil of Smoke',
  rule:'The Rule of the Wood: every creature must state one fixed identity, and keep it.',
  text:S=>`The wood is cool and green and very quiet, and the path winds until it comes to a great mushroom, taller than you are${S.size<=-1?' — and you are small just now, so it is taller than a house':''}, with something on the top of it.

On the top of it, exactly its own height and perfectly at its ease, sits a large blue Caterpillar, arms folded, smoking a long hookah, and taking not the smallest notice of you or of anything else in the world.

For a long while it says nothing. Then it takes the hookah out of its mouth, and regards you through the smoke with an air of immense, languid contempt, and asks — in a voice like a slow door — the worst question there is.

<em>"Who,"</em> it says, <em>"are </em>you<em>?"</em>`,
  choices:[
    { t:'"I— I hardly know, sir, just at present. I knew who I was when I got up this morning, but I think I must have changed several times since then."', kind:'reason', pre:'honest, not stubborn', key:true,
      note:'it is the truest thing you can say, and saying it keeps you whole; the Caterpillar, though rude, does not let you go', self:1, honest:true, journal:'I did not know exactly who I was, and I said so, and it was true.', go:'n_cat_poem' },
    { t:'"Who are YOU? You are only a caterpillar three inches high, and you have no business asking."', kind:'reason', pre:'the trap: pull rank',
      note:'you define yourself by looking down on something small, and lose a little of your own footing; the smoke chills', self:-1, waking:-1, go:'n_cat_poem' },
    { t:'Answer its impossible questions on their own terms — riddle for riddle, nonsense for nonsense, quite unbothered.', kind:'play', pre:'the way through',
      add:'grave advice, gravely taken, from a caterpillar', waking:1, go:'n_cat_poem' },
    { t:'"I think you ought to tell me who YOU are, first." Turn to go.', kind:'defy', pre:'stand your ground — early', req:s=>s.self>=3,
      note:'it calls you back with the promise of something important — which you need — so you swallow your exit and stay', self:-1, go:'n_cat_poem' },
  ]},
n_cat_poem:{ region:'wood', scene:'caterpillar', title:'Repeat "You Are Old, Father William"',
  text:`<em>"Repeat,"</em> says the Caterpillar, <em>"'You are old, Father William.'"</em>

You open your mouth to recite the poem you have known since you were small — and it comes out <em>wrong.</em> The words wander off on their own business. Father William stands on his head; he balances an eel on the end of his nose; the whole sensible verse turns inside-out in your mouth and will not be corrected, and you hear yourself saying things you never learned.

It is frightening, a little, to feel your own memory rewrite itself while you watch. <em>"That is not said right,"</em> the Caterpillar observes, with satisfaction.`,
  choices:[
    { t:'Force it. Insist on the real words. Say them louder, slower, correctly, until the poem behaves.', kind:'reason', pre:'fight the wrongness',
      note:'the harder you push, the wronger it comes; fighting the dissolution is how you feed it', self:-1, waking:-1, go:'n_cat_gift' },
    { t:'Let the nonsense-poem be what it wants to be. Laugh at Father William and his eel. In a dream your own memory rewrites itself — so let it.', kind:'play', pre:'meet it with humour', key:false,
      note:'you meet the dissolution with a laugh instead of a panic, and that — the whole game in one breath — is how you keep yourself', self:1, waking:1, add:'my own poem, cheerfully rewritten', go:'n_cat_gift' },
  ]},
n_cat_gift:{ region:'wood', scene:'caterpillar', title:'One Side, and the Other',
  grantsMushroom:true,
  text:`The Caterpillar has had enough of you, which is its permanent condition. It yawns, shakes itself, and gets down off the mushroom to crawl away into the grass — but as it goes it says, over its shoulder, the one plainly useful thing anyone will tell you in all of Wonderland:

<em>"One side will make you grow taller, and the other side will make you grow shorter."</em>

<em>"One side of </em>what<em>?"</em> you ask.

<em>"Of the mushroom,"</em> says the Caterpillar, as if you had asked it aloud on purpose to be tiresome, and in another moment it is out of sight.

You break off a piece from each side. From now on you can grow and shrink <em>whenever you choose.</em> It is the only real power the dream has given you — and the first thing it does, before you learn the trick of it, is send your chin crashing down onto your own feet.`,
  choices:[
    { t:'Nibble, overcorrect wildly — shoot up until your neck rises above the treetops like a serpent through the leaves.', pre:'the comedy of too much',
      size:2, fx:s=>s.flags.longneck=1, go:'n_pigeon' },
    { t:'Nibble carefully, a crumb at a time, until you are your own right height again for the first time in ages.', pre:'fine control, learned',
      fx:s=>s.size=0, self:1, go:'n_pigeon' },
  ]},
n_pigeon:{ region:'wood', scene:'caterpillar', title:'Serpent!',
  text:S=>`${S.flags.longneck?'Your neck has gone up and up on a great stalk, high above a green sea of treetops, and you are steering your own head about through the leaves like a snake when':'You are working out the trick of the mushroom, growing and shrinking by crumbs, when'} a Pigeon flies straight into your face in a fury of feathers.

<em>"Serpent!"</em> it shrieks. <em>"Serpent! I've tried the roots of trees, and I've tried banks, and I've tried hedges, and there is no keeping serpents off my eggs!"</em>

<em>"But I am not a serpent,"</em> you say. <em>"I am a little girl."</em>

<em>"A likely story!"</em> says the Pigeon. <em>"You've a serpent's neck, and you eat eggs, and that's the whole of a serpent as far as I'm concerned. No — you're some kind of serpent, and there's no use denying it."</em>

And the dreadful thing is that you <em>have</em> eaten eggs, and your neck <em>is</em> very long, and for one swimming moment you are not entirely sure the Pigeon is wrong.`,
  choices:[
    { t:'Hold your shape. "I am a little girl" — and mean it, whatever your neck is doing.', kind:'reason', pre:'the grounding truth', key:true,
      note:'you refuse to be argued out of yourself by a frightened bird; SELF holds', self:1, go:'n_pigeon_out' },
    { t:'Concede the point, a little. Perhaps, down here, a girl can be a serpent for the length of an afternoon.', kind:'play', pre:'let the dream be true',
      note:'you accept an impossible thing about yourself — and it costs you a shaving of who you are to do it', self:-1, add:'that a girl might be a serpent, a little, on a Tuesday', go:'n_pigeon_out' },
    { t:'Shrink deliberately back down small, so the neck is gone and the argument with it.', pre:'change the subject by changing size',
      size:-2, go:'n_pigeon_out' },
  ]},
n_pigeon_out:{ region:'wood', scene:'caterpillar', title:'The Right Size for a Door',
  text:`The Pigeon, satisfied or exhausted, settles back down among its eggs muttering, and lets you go.

You nibble yourself carefully back toward your own true height — you are getting good at this, at being your own size on purpose — and walk on until the trees thin out and you come, quite suddenly, upon a little house about four feet high. From the kitchen chimney pours an unreasonable quantity of smoke, and from the kitchen door pours an unreasonable quantity of noise.

Whoever lives here, they are not having a quiet afternoon.`,
  choices:[
    { t:'Make yourself a sensible size for a four-foot door, and go in.', pre:'you can do that now', fx:s=>{ if(s.size>1)s.size=1; if(s.size<-1)s.size=-1; }, go:'n_kitchen' },
  ]},

/* ===================== THE DUCHESS'S KITCHEN (reason-trap showcase) ===================== */
n_kitchen:{ region:'kitchen', scene:'kitchen', title:'Pepper and Uproar',
  epigraph:'there was certainly too much of it in the air',
  text:`The kitchen is full of smoke from end to end. The Duchess sits in the middle of it on a three-legged stool, nursing a howling baby; the Cook leans over the fire stirring a great cauldron of soup that is plainly all pepper — you can't stop sneezing, and neither can the Duchess, and neither can the baby, who sneezes and howls and howls and sneezes without one moment between.

The only two creatures in the kitchen who do <em>not</em> sneeze are the Cook, and a large grinning Cat lying on the hearth. And now the Cook, quite without warning, begins taking everything within reach and hurling it at the Duchess and the baby — fire-irons first, then a shower of saucepans, plates, and dishes. The Duchess takes no notice even when they hit her.

<em>"Oh, PLEASE mind what you're doing!"</em> you cry, hopping about in an agony of terror. And the Duchess says, dreamily, <em>"If everybody minded their own business, the world would go round a deal faster than it does."</em>`,
  choices:[
    { t:'Argue the plain facts: the cook has no right to throw saucepans, the pepper is a menace, and someone will be hurt.', kind:'reason', pre:'the trap: manners and rights',
      note:'the Duchess finds a moral in it and flings it back at you; being right, here, is exactly like not being here at all', self:-1, waking:-1, go:'n_kitchen_baby' },
    { t:'Give up on sense entirely. Sneeze when you sneeze, duck when you duck, and let the kitchen be as mad as it insists on being.', kind:'play', pre:'stop fighting the smoke',
      waking:1, add:'a soup that is all pepper and a house that throws its own crockery', go:'n_kitchen_baby' },
    { t:'The baby. Never mind the argument — that baby is choking on pepper. Cross the kitchen and get it out of here.', kind:'reason', pre:'the grounding truth', key:true,
      note:'not a point to be won but a thing that is simply, plainly true: the child needs air; you pick it up and carry it out, and no moral in the world argues back', self:1, waking:1, fx:s=>s.flags.tookBaby=1, go:'n_kitchen_baby' },
  ]},
n_kitchen_baby:{ region:'kitchen', scene:'kitchen', title:'A Baby, or a Pig',
  text:S=>{
    if(S.flags.tookBaby) return `You carry the baby out into the air, and it is a queer little bundle, snorting and writhing, its nose remarkably turned-up, more snout than nose, and its eyes getting extremely small for a baby. And as you look down at it, half in love and half in alarm, it grunts — unmistakably — and its face is a pig's face, and there is nothing to do but set it gently down on its trotters and watch it trot off, quite comfortably, into the wood.

It made a far handsomer pig than it ever did a baby. You are almost sorry to see it go — and not sorry at all that it is happy.`;
    return `The Duchess flings the baby at you — <em>"Here! You may nurse it if you like! I must go and get ready to play croquet with the Queen"</em> — and sweeps out, and you are left holding a snorting, writhing bundle in the smoke. You carry it out into the air before it chokes, and by the time you reach the door its nose is a snout and its eyes are two small bright pig's eyes, and it grunts, and squirms free, and trots off into the wood a perfectly contented little pig.

It made a far handsomer pig than it ever did a baby.`;
  },
  choices:[
    { t:'Accept it: a baby is better off, sometimes, as a pig. Wish it well.', kind:'play', pre:'the way through',
      add:'a baby that does far better as a pig', waking:1, go:'n_kitchen_cat' },
    { t:'Refuse to accept that a baby just became a pig. Babies do not become pigs. Insist on it, to the empty wood.', kind:'reason', pre:'the trap',
      note:'the wood does not answer; the pig does not come back; you have won an argument with nobody', self:-1, waking:-1, go:'n_kitchen_cat' },
  ]},
n_kitchen_cat:{ region:'kitchen', scene:'cheshire', title:'The Grin on the Bough',
  rule:'The Rule of the Wood (Index-approved): a cat must remain attached to its grin.',
  text:`A few yards off, in the branches of a tree, sits the grinning Cat from the hearth. It has very long claws and a great many teeth, all of them showing, so you decide to treat it with respect.

<em>"Cheshire Puss,"</em> you begin, a little timidly, <em>"would you tell me, please, which way I ought to go from here?"</em>

<em>"That depends a good deal on where you want to get to,"</em> says the Cat.

<em>"I don't much care where—"</em>

<em>"Then it doesn't much matter which way you go."</em>

You try again. <em>"But I don't want to go among mad people."</em>

<em>"Oh, you can't help that,"</em> says the Cat. <em>"We're all mad here. I'm mad. You're mad."</em>

<em>"How do you know I'm mad?"</em>

<em>"You must be,"</em> says the Cat, <em>"or you wouldn't have come here."</em>`,
  choices:[
    { t:'Watch the Cat vanish — slowly, tail first, until nothing is left but the grin hanging in the air — and believe your own eyes.', kind:'play', pre:'the keystone impossible thing',
      note:'a grin with no cat behind it; you have seen a good many odd things, but never that, and you let yourself simply believe it', add:'a grin with no cat left behind it', waking:2, fx:s=>s.flags.sawGrin=1, go:'n_cheshire_fork' },
    { t:'Insist the grinning is impossible without a cat, and demand the Cat stay whole while it talks to you.', kind:'reason', pre:'the trap',
      note:'"well, I\'ve often seen a cat without a grin," you say, "but a grin without a cat!" — and the Cat, amused, vanishes anyway, and you have learned nothing except that you cannot make the dream be reasonable', self:-1, go:'n_cheshire_fork' },
  ]},
n_cheshire_fork:{ region:'cheshire', scene:'cheshire', title:'Which Way From Here', hub:true,
  text:S=>`The grin fades — or the Cat comes back around it; it is hard to say which way that works — and it points you, lazily, two ways at once with the same paw.

<em>"In THAT direction,"</em> it says, waving toward one edge of the wood, <em>"lives a Hatter; and in THAT direction, a March Hare. Visit either you like: they're both mad."</em>

And, because it is the one honest creature in the dream, it adds the only useful map you will get: ${S.flags.sawGrin?'that the way out is not a place at all, but a size and a self and a moment; that you will know the door when you have grown enough to walk through it; and that most people down here forget they ever meant to leave.':'that most people down here forget, in the end, that they ever meant to leave at all — and that forgetting is the only thing in Wonderland that is truly dangerous.'}

Then it begins to vanish again, and asks, kindly, whether you have decided where you are going.`,
  choices:[
    { t:'To the March Hare\'s — to the tea-party, where it is always six o\'clock.', pre:'the maddest room in the dream', go:'n_tea' },
    { t:'Straight on toward the Queen\'s — there is a garden out there you have been trying to reach since the very first door.', pre:'toward the croquet-ground', req:s=>s.flags.teaDone||s.self>=0, go:'n_croquet' },
    { t:'Ask the Cat, while any of it is still here, whether YOU are real, or only being dreamed.', kind:'reason', pre:'the question under all the others',
      note:'"you\'re part of somebody\'s dream," the Cat allows, "and so am I; the only question that matters is whose, and whether he wakes gently" — and it is gone, grin and all', waking:1, self:1, go:'n_cheshire_fork' },
  ]},

/* ===================== THE MAD TEA-PARTY (purest posture room) ===================== */
n_tea:{ region:'teaparty', scene:'teaparty', title:'No Room! No Room!',
  epigraph:'have some wine, said the March Hare (there was no wine)',
  rule:'The Rule of the Table (pinned by the Index): no one may leave before tea is finished — and tea is never finished.',
  text:`A table set out under a tree in front of the house, and a great many cups crowded down one end of it, and three of them making the most of the crowd: a Hatter, a March Hare, and a Dormouse fast asleep between them, which the other two are using as a cushion for their elbows.

<em>"No room! No room!"</em> they cry the moment they see you.

<em>"There's PLENTY of room,"</em> you say indignantly, and sit down in a large arm-chair at one end.

<em>"Have some wine,"</em> the March Hare offers. You look all round the table, but there is nothing on it but tea. <em>"I don't see any wine,"</em> you say. <em>"There isn't any,"</em> says the March Hare. And the Hatter opens his eyes very wide and says only: <em>"Why is a raven like a writing-desk?"</em>`,
  choices:[
    { t:'"I believe I can guess that," you say — and set about actually solving the riddle, sensibly, like a puzzle with an answer.', kind:'reason', pre:'the trap: riddles have answers',
      note:'they let you tie yourself in knots for a good while before admitting they haven\'t the least idea of the answer themselves; sense, spent on a thing with no answer, is just drowning in a chair', self:-1, waking:-2, go:'n_tea_time' },
    { t:'Answer the riddle with a riddle of your own, and take more tea though you\'ve had none, and let the nonsense be a game you are playing rather than a test you are failing.', kind:'play', pre:'the way through',
      note:'the Hatter almost smiles; the Hare passes the butter; you are, briefly, one of them, in the good way', add:'a riddle that was never meant to have an answer', waking:1, go:'n_tea_time' },
    { t:'"Time isn\'t a thing you can quarrel with — and you\'ve been quarrelling with it." Say it gently. It is why the clock stopped.', kind:'reason', pre:'the grounding truth', key:true,
      note:'the Hatter goes quiet; it is the truest thing said at this table in a hundred years of tea; he quarrelled with Time and Time stopped for him at six, and you can see he knows it', self:1, waking:1, go:'n_tea_time' },
    { t:'Leave the table without leaving it — get up and go while your teacup stays warm in your still-occupied chair, and let the two facts argue behind you.', rule:'break', cost:1, req:s=>s.contradiction>=1,
      note:'you spend a contradiction, and for one glorious impossible moment you are both seated and gone; the Hatter, who has spent a hundred years unable to do exactly this, applauds', add:'being both at the table and away from it, at once', self:1, waking:1, fx:s=>s.flags.teaDone=1, go:'n_tea_leave' },
  ]},
n_tea_time:{ region:'teaparty', scene:'teaparty', title:'Always Six O\'Clock',
  text:`The Hatter tells you, as if it explained everything, that it is always six o'clock now. He quarrelled with Time back in March — murdered the time, the Queen said, when he was singing — and ever since, Time won't do a thing the Hatter asks, and it stays six o'clock, tea-time, forever, with never a minute's pause to wash the cups.

So they move round the table as the things get used up, always a clean place farther on, round and round, and it will be tea-time here until the end of the dream. The Dormouse, roused, begins a story about three little sisters who lived at the bottom of a treacle-well, and is nudged and bullied and half-drowned in the teapot for it, and you begin to see how a person could sit down at this table and simply never get up again.

The tea is warm. The chair is deep. It is always six o'clock, and no one here is ever going anywhere, and that is either the most restful thing in the world or the most frightening, depending on how sleepy you let yourself become.`,
  choices:[
    { t:'Take your leave. Get up from the deep chair while you still remember you meant to — there is a door in a tree out there, and a garden past it.', pre:'the hard part is standing up', kind:'defy',
      waking:1, self:1, fx:s=>s.flags.teaDone=1, go:'n_tea_leave' },
    { t:'Believe six impossible things before your tea, just to keep pace with the company — unbirthdays, treacle-wells, murdered Time and all.', kind:'play', pre:'one more cup',
      add:'a clock stopped at tea-time for a hundred years', waking:-1, fx:s=>s.flags.teaDone=1, go:'n_tea_stay_warn' },
    { t:'Stay. Just for a while. Just until the next clean cup. The garden has waited this long; it can wait a little more.', pre:'just one more, and then one more', kind:'reason',
      waking:-2, go:'n_tea_stay_warn' },
  ]},
n_tea_stay_warn:{ region:'teaparty', scene:'teaparty', title:'One More, and Then One More',
  text:S=>`The tea is very warm. Another clean place farther round; another cup; the Dormouse murmuring its treacle-story again from the top, exactly the same, and it is soothing to hear a thing that never changes and never ends.

You have shifted seats ${1+(S.seen&&S.seen.n_tea_stay_warn?1:0)} times without noticing. The garden — was there a garden? There was a reason you came. It is on the tip of your mind, like a name you have almost forgotten, like the name of a girl you used to be.

${S.waking<=3?'It is getting hard, now, to remember that you are only visiting. The chair knows your shape. The party has made room for you at last.':'Somewhere very far off, on the other side of the afternoon, you think you hear someone calling a name that might be yours.'}`,
  choices:S=>{
    const c=[];
    c.push({ t:'Stand up NOW — push the warm chair back, thank them, and go before the party closes over you for good.', pre:'wake up, a little', kind:'defy',
      waking:2, self:1, fx:s=>s.flags.teaDone=1, go:'n_tea_leave' });
    c.push({ t:'One more cup. Surely one more cup does no harm.', pre:'the dream purring',
      waking:-2, go: s=> (s.waking<=1 ? 'n_tea_forever' : 'n_tea_stay_warn') });
    return c;
  }},
n_tea_forever:{ region:'teaparty', scene:'teaparty', title:'A Clean Place Farther On',
  text:`One more cup. And then the party moves round, and there is a clean place farther on, and you move round with it, because that is what one does here, and there is no reason you can now remember to do anything else.

The garden is gone from your mind entirely. So is the hall, and the little door, and the long slow fall, and the field, and the bank, and the sister reading in the sun. There was a girl who wanted, very much, to get somewhere — but she has taken the empty chair at the tea-party, and it fits her, and it is always six o'clock, and it always will be.

Have some tea. There's plenty of room.`,
  choices:[
    { t:'…', end:'e_stay' },
  ]},
n_tea_leave:{ region:'teaparty', scene:'teaparty', title:'The Door in the Tree',
  text:`You get up — it is genuinely hard, like waking a limb that has gone to sleep — and the moment you are on your feet the party pays you no more attention, and the Dormouse is being stuffed into the teapot again, and you walk away and do not look back.

In the trunk of one of the trees there is a door. You have grown wise about doors. You open it, and find yourself back in the long hall, with the little glass table and the little golden door — and this time you have the mushroom in your pocket, and you know exactly what to do.`,
  choices:[
    { t:'Eat a careful crumb, unlock the little door, and go through at last into the garden.', pre:'the size you need, and the key you kept',
      fx:s=>{ s.size=-2; }, waking:1, go:'n_croquet' },
  ]},

/* ===================== THE QUEEN'S CROQUET-GROUND ===================== */
n_croquet:{ region:'croquet', scene:'croquet', title:'The Roses Are the Wrong Colour',
  epigraph:'off with her head!',
  rule:'The Rule of the Garden: every rose must be the one approved red; every colour must have one name.',
  onArrive:S=>{ if(S.size<0) S.size=0; },
  text:`The garden at last — and it was never as calm as it looked through the little door. By the entrance stands a great rose-tree bearing white roses, and three gardeners shaped exactly like playing-cards — flat, oblong, hands and feet at the corners — are busily painting the white roses red, in a great hurry, and getting a good deal of the paint on one another and on the grass.

You ask why, and the Two of Spades says, low and frightened, that they planted a white rose-tree by mistake where the Queen wanted red, and if she finds out, they will all lose their heads. And then a trumpet, and a procession — soldiers, courtiers, the King and Queen of Hearts, the whole pack — and the Queen sees the gardeners flat on their faces and the white showing through the wet red paint, and turns the colour of the roses, and screams the only word she knows.`,
  choices:[
    { t:'See the truth of it: the roses are painted. Someone here is so afraid of the Queen they would rather lie in fresh paint than be caught telling her no.', kind:'reason', pre:'the grounding truth', key:true,
      note:'you understand the whole cruel little kingdom in a glance — it runs on fear, and paint, and a word that is never actually carried out; seeing the lie clearly steadies you', self:1, waking:1, go:'n_croquet_game' },
    { t:'Play her game. Take a flamingo for a mallet and a hedgehog for a ball and join the maddest croquet ever played, all out of turn and all at once.', kind:'play', pre:'the way through',
      note:'the flamingo will not keep its neck straight and the hedgehog keeps unrolling and walking off, and the soldiers who make the arches get up and wander, and it is glorious nonsense', add:'a croquet of live flamingos and hedgehogs that will not hold still', waking:1, go:'n_croquet_game' },
    { t:'Kneel by one white rose the gardeners missed and declare it an <em>official exception</em> — a rose allowed, by special decree, to be exactly the wrong colour forever.', rule:'break', cost:1, req:s=>s.contradiction>=1,
      note:'you spend a contradiction to carve a hole in the Index itself — one protected impossibility the Great Book cannot correct; the terrified gardeners will guard it with their lives', add:'a mispainted rose, protected by law from ever being fixed', self:1, go:'n_croquet_game' },
    { t:'Tell the Queen, to her face, that painting roses and shouting "off with her head" is a childish way to run a garden.', kind:'defy', pre:'stand your ground — early', req:s=>s.self>=3,
      note:'the whole court holds its breath; the Queen goes purple; you are not ready to end it here and now, and defiance without the final ground beneath it just earns you a death-sentence nobody quite carries out — this time', self:-1, waking:-1, go:'n_croquet_condemned' },
  ]},
n_croquet_game:{ region:'croquet', scene:'croquet', title:'Off With Everyone\'s Head',
  text:`It is not a game so much as a tantrum with equipment. The Queen stalks about the ground shouting <em>"Off with his head!"</em> and <em>"Off with her head!"</em> roughly once a minute, at gardeners, at soldiers, at her own guests, at the weather; and the soldiers dutifully take the condemned into custody, and by the end there is scarcely anyone left <em>not</em> under sentence of death, and — you begin to notice — no one has actually been executed at all. The sentences pile up and evaporate. It is all sound.

The grinning Cat appears in the air above the ground — just the head, this time, which starts an argument about whether you can behead a thing that has no body — and while the King and the executioner and the Queen quarrel about it, the Cat catches your eye and asks, quietly, under the noise, how you are getting on, and whether you have thought at all about how you mean to wake.`,
  choices:[
    { t:'Not yet. There is a melancholy Gryphon over there, and it wants to take you to hear the saddest story in Wonderland. Go with it.', pre:'a detour into grief', go:'n_mock' },
    { t:'Tell the Cat you are ready — that the noise is only noise, the deaths aren\'t deaths, and it is nearly time to end this. Let it lead you to where the dream comes to a head.', pre:'toward the trial', req:s=>s.self>=2, go:'n_trial' },
    { t:'Let the Queen\'s scream land on YOU this time — stand square in front of her and let her cry "off with her head" at you, and see what it does.', pre:'the startle', kind:'defy',
      go: s => s.waking>=9 ? 'n_startle' : 'n_croquet_condemned' },
  ]},
n_croquet_condemned:{ region:'croquet', scene:'croquet', title:'The Sentence That Evaporates',
  text:S=>`<em>"OFF WITH HER HEAD!"</em>

The word lands on you like a slap — and ${S.waking>=9?'for a heartbeat the whole garden flinches white, and you feel the jolt of it go up through you toward the light—':'nothing happens. The soldiers shuffle. The Queen has already turned to scream at someone else. Down here, this deep in the dream, the loudest thing in the kingdom is just weather; it cannot reach you, and it cannot wake you.'}

The Cat's grin lingers a moment in the air, sympathetic. <em>Deeper than that,</em> it seems to say, <em>and even her worst is only more dream. You'll have to come up nearer the light before a fright can do you any good.</em>`,
  choices:[
    { t:'Slip away from the croquet-ground while the Queen is busy condemning the sky, and find the Gryphon.', go:'n_mock' },
    { t:'Go with the Cat toward the trial, where all of this is heading.', req:s=>s.self>=2, go:'n_trial' },
  ]},
n_mock:{ region:'mockturtle', scene:'mockturtle', title:'The Mock Turtle\'s Tale',
  text:`The Gryphon leads you along the shore to where the Mock Turtle sits alone on a ledge of rock, sighing as if his heart would break. He was a real Turtle once, he tells you — that is the whole of his sorrow, and he tells it beautifully, at great length, weeping between the words: <em>"Once,"</em> he says, <em>"I was a real Turtle."</em>

He recites his schooldays under the sea — Reeling and Writhing, and the different branches of Arithmetic: Ambition, Distraction, Uglification and Derision — and then he and the Gryphon dance you the Lobster-Quadrille on the sand, and sing, and it is all very silly and somehow unbearably sad, because underneath every joke the Mock Turtle is grieving, simply and hopelessly, for the real thing he used to be.

And you know something about that. You have been losing your own shape all afternoon.`,
  choices:[
    { t:'"You\'re allowed to be sad about who you used to be." Say it plainly, and mean it, and sit with him in it a while.', kind:'reason', pre:'the grounding truth', key:true,
      note:'it is not advice and not a fix; it is just true, and the Mock Turtle weeps harder and holds your hand with one flipper, and something in you that was fraying is, for a moment, mended', self:1, waking:1, add:'a grief so real it dances the Lobster-Quadrille', go:'n_mock_out' },
    { t:'Dance the Lobster-Quadrille and sing the whale-song and let the sad silliness carry you both, without trying to fix a single thing.', kind:'play', pre:'the way through',
      add:'a turtle who is mock, and mourns the real one', waking:1, go:'n_mock_out' },
    { t:'Point out that a "Mock Turtle" is only a soup, and he was never a real turtle, so there is nothing to cry about.', kind:'reason', pre:'the trap: correct the grief',
      note:'you are technically right and it is the cruellest thing anyone has said all day; the Gryphon looks at you, and you look at your feet', self:-1, waking:-1, go:'n_mock_out' },
  ]},
n_mock_out:{ region:'mockturtle', scene:'mockturtle', title:'A Trumpet in the Distance',
  text:`Far off, a trumpet. <em>"The trial's beginning!"</em> cries the Gryphon, and seizes you by the hand, and hurries you away up the shore without waiting for the end of the Mock Turtle's song — which trails after you across the sand, growing fainter, the saddest and most beautiful nonsense you have ever heard, and then gone.

<em>"What trial is it?"</em> you pant, but the Gryphon only says <em>"Come on!"</em> and runs faster, and the shore becomes a path and the path becomes a great doorway, and you are swept in with a crowd of every card and creature you have met all day, into the courtroom, where the whole dream has gathered to come to a head.`,
  choices:[
    { t:'Go in to the trial.', go:'n_trial' },
  ]},

/* ===================== THE TRIAL — the climax ===================== */
n_trial:{ region:'trial', scene:'trial', title:'The Last Unbirthday',
  epigraph:'she had never been in a court of justice before',
  rule:'The Rule of the Court: the sentence must be known before the evidence — the last rule the Great Index still needs to file.',
  onArrive:S=>{ S.flags.atTrial=1; },
  text:S=>`The courtroom is the antechamber of the Last Unbirthday. At the back of the hall, taller than the throne, the Great Index turns on itself like a cathedral built of card-catalogue drawers — and beside it stands the <em>Registrar</em>, patient and courteous and almost kind, waiting for midnight, when it will read the Index aloud and every name and road and riddle in Wonderland will become final, and correct, and unable to change, forever.

${S.index>=6?'The reading has all but begun. The roses have gone the one approved red; the cards stand in numbered rows; the air is orderly and quiet and just slightly dead. You are nearly too late.':'But first there is one last piece of nonsense to file.'} The King and Queen of Hearts sit in judgement; the whole pack of cards and every creature of the day are crowded in; on a dish sits a plate of stolen tarts. The evidence is gibberish and knows it — a trembling witness, a jury writing down their own names in case they forget, the King inventing law as he goes: <em>"Rule Forty-two: all persons more than a mile high to leave the court."</em>

Which is when you notice you are growing. Not by mushroom, not by cake — on your own, the dream's grip loosening finger by finger, and you rise toward the ceiling and the light, and the Registrar looks up at you with something almost like hope, and almost like fear, as if it half-remembers having been your size, once, a very long time ago.`,
  onArriveGrow:true,
  choices:S=>{
    const c=[];
    c.push({ t:'"There\'s nothing written on that paper — it isn\'t evidence at all." Say it clearly, into the nonsense, a true thing in a room built to keep truth out.', kind:'reason', pre:'the grounding truth', key:true,
      note:'the court blusters; the King flounders; and the plain fact of it stands there unanswerable, and you feel yourself grow another foot toward the ceiling and the light', self:1, waking:2, size:1, go:'n_trial' });
    if(S.contradiction>=2) c.push({ t:'Slip one contradiction into the Great Index itself — a single line that is both perfectly true and perfectly false — so the Book snags on it and can never finish reading.', rule:'break', cost:2, req:s=>s.contradiction>=2,
      note:'you spend two contradictions; the Registrar\'s machinery shudders and stalls on the impossible line, and the whole cathedral of drawers hangs open, unfinishable — Wonderland has room to breathe again', index:-3, self:1, add:'a line in the Index that is both true and false at once', go:'n_trial' });
    c.push({ t:'Play the trial as the theatre it is — testify in perfect nonsense, out-mad the mad court, and let the whole absurd machine run.', kind:'play', pre:'the way through',
      add:'a jury of twelve creatures all wrong at once', waking:1, go:'n_trial_verdict' });
    if(S.self>=4)
      c.push({ t:'GROW. Rise up to your full size, taller than the throne, taller than the fear — and tell them exactly what they are.', kind:'defy', pre:'the pack of cards', size:2,
        go:'n_trial_defy' });
    c.push({ t:'Try, quietly, to remember your own name — your real one, from the field, from before the rabbit — and hold onto it while the court roars.', pre:'who you are, under all of it',
      go: s => s.self<=1 ? 'n_trial_mabel' : 'n_trial_name' });
    c.push({ t:'Let them have their verdict. Sit down small in the great courtroom and let the dream decide, since it always meant to.', pre:'give it up', kind:'reason',
      waking:-2, go:'n_trial_verdict' });
    return c;
  }},
n_trial_name:{ region:'trial', scene:'trial', title:'Your Own Right Name',
  text:`You hold onto it — the name your sister calls up the garden at tea-time, the name on your copybooks, the name you had before the rabbit and the hole and the whole long strange afternoon. It is still there. Frayed, but there. You are still, unmistakably, yourself, and you have carried yourself all the way down here and all the way back to the edge of the light.

The court is roaring. The Queen is on her feet. And you are very nearly as tall as the room.`,
  choices:[
    { t:'Now — stand to your full height and say the thing that ends it.', kind:'defy', pre:'the pack of cards', req:s=>s.self>=3, size:2, self:1, go:'n_trial_defy' },
    { t:'Say it in nonsense instead, gently, and let the trial run its mad course to a verdict.', kind:'play', add:'your own name, kept through a whole dream', waking:1, go:'n_trial_verdict' },
  ]},
n_trial_defy:{ region:'trial', scene:'trial', title:'Nothing But a Pack of Cards',
  text:`<em>"Let the jury consider their verdict,"</em> the King says, for about the twentieth time.

<em>"No, no!"</em> says the Queen. <em>"Sentence first — verdict afterwards."</em>

<em>"Stuff and nonsense!"</em> you hear yourself say, loud and clear, your full height now, towering over the whole silly court. <em>"The idea of having the sentence first!"</em>

<em>"Hold your tongue!"</em> says the Queen, turning purple.

<em>"I won't!"</em> you say.

<em>"Off with her head!"</em> she shrieks at the top of her voice, and nobody moves, and you look down at the whole shouting kingdom of them — the painted roses, the murdered time, the evaporating deaths, the frightened flat little cards — and you feel the last of the fear go out of you, and you say it:

<em>"Who cares for you? You're nothing but a pack of cards!"</em>`,
  choices:[
    { t:'And the whole pack rises into the air and comes flying down at you—', pre:'the dream comes apart',
      end: (S,P)=>{
        const many = S.impossibleThings.length;
        const wild = S.index<=2;                     // you kept Wonderland from being corrected
        const changesReady = wild && many>=4 && S.self>=4 && S.flags.honestUncertainty;
        const tellerReady = P && P.impossibleEver && Object.keys(P.impossibleEver).length>=8 && S.self>=5 && many>=6;
        if(S.index>=7) return 'e_index';             // the Great Index all but finished — even this is filed
        if(changesReady) return 'e_changes';         // the deepest waking: Wonderland kept, by letting it change
        if(tellerReady) return 'e_teller';
        if(S.self>=4 && many>=4) return 'e_riverbank';
        return 'e_startle';
      } },
  ]},
n_trial_verdict:{ region:'trial', scene:'trial', title:'Sentence First',
  text:S=>`The trial grinds on toward its foregone, backwards conclusion — sentence first, verdict afterwards — and you have played along so beautifully, testified so madly, been such a good guest of the nonsense, that you have quite forgotten you were ever going to do anything but watch.

<em>"Off with her head!"</em> the Queen is shrieking, and this time perhaps she means you, and ${S.waking>=8?'you are near enough to the surface that the shriek jolts through you like cold water—':'you are so deep in the dream, so warm and willing in the great courtroom, that the shriek is only more of the pleasant roaring, and you settle back to see how the story ends, and it does not end, and you are still there settling back—'}`,
  choices:S=>{
    const c=[];
    if(S.waking>=8)
      c.push({ t:'Wake — grab the jolt of the scream and pull yourself up toward the light on it.', pre:'the startle saves the shallow', end:'e_startle' });
    if(S.self>=4)
      c.push({ t:'No — grow, and stand, and defy them before it is too late.', pre:'find your full size', kind:'defy', size:2, go:'n_trial_defy' });
    c.push({ t:'Let it close over you. Watch the story that never ends, from the warm chair it keeps for you.', pre:'sink', end: s=> s.self<=0 ? 'e_mabel' : 'e_stay' });
    return c;
  }},
n_trial_mabel:{ region:'trial', scene:'trial', title:'Am I Ada, or Mabel?',
  text:`You reach for your name, and it is not there.

You try to be sure of things you used to be sure of. Four times five is twelve, and four times six is thirteen, and London is the capital of Paris — no, that is not right either, but you cannot find the right one, and every fact you reach for turns to nonsense in your hand the way the poem did on the mushroom.

<em>"I'm sure I'm not Ada,"</em> you say, small in the great roaring room, <em>"for her hair goes in such long ringlets, and mine doesn't go in ringlets at all. And I'm sure I can't be Mabel, for I know all sorts of things, and she knows such a very little!"</em> But you cannot, now, remember a single one of the things you know, and you cannot remember which of them you are, and you are so tired, and the courtroom is so warm.`,
  choices:[
    { t:'Grasp for one true thing — anything — one plain fact of the waking world to climb out on.', pre:'reach', req:s=>s.self>=1,
      self:1, waking:1, go:'n_trial' },
    { t:'Let the name go. Perhaps you are Mabel after all. Perhaps it does not matter who wakes, so long as somebody does.', pre:'the hollow waking', end:'e_mabel' },
  ]},
n_startle:{ region:'trial', scene:'wake', title:'The Jolt',
  text:`The scream goes through you like cold water down the back of the neck, and the garden flinches white, and there is a lurching, and a rushing, and the whole painted kingdom tips sideways and slides off you like a dropped tablecloth—`,
  choices:[
    { t:'—and you open your eyes.', end:'e_startle' },
  ]},

};

/* ===================== THE WAKINGS (endings) ===================== */
const endings = {
  e_riverbank:{ kind:'true', scene:'wake', title:'The Riverbank',
    verse:'She woke as herself, and kept the wonder without being kept by it.',
    text:`You wake.

Your head is in your sister's lap, on the warm bank, in the ordinary afternoon, and she is brushing away a few dead leaves that have fluttered down from the trees onto your face. The river runs. A sheep-bell tinkles somewhere. The tarts, the trumpet, the whole flying pack of cards are already thinning into leaves and light and the small far sounds of the real world.

You grew back. That was the trick of it — you grew back to your own full size, and you were still, all the way through, yourself; and you believed the impossible things while you were among them, so that now, awake, you get to keep them, the way you keep a good dream instead of shuddering it off. A grin with no cat. A race that everyone won. A garden that walks away as you walk to it.

You sit up in the sun, and think what a wonderful dream it has been, and know — the way you know the truest things, without being told — that you will remember the way down, and that you did not leave any of yourself behind.`,
  },
  e_teller:{ kind:'secret', scene:'wake', title:'The Teller',
    verse:'The only way to keep Wonderland forever is to give it away.',
    text:`You wake — as yourself, with the whole dream intact and shining, every impossible thing catalogued and believed and kept — and you run up the garden to tell it, all of it, before it fades.

And that is the secret the dream was for.

Long after, on some other warm afternoon, there will be a smaller person at your knee — a real one, with a real name — asking for a story; and you will begin, <em>"There was a rabbit,"</em> and the whole of Wonderland will pour out of you as fresh as the day you fell into it, because you never woke it out of yourself, you only carried it up into the light to hand on.

That is how a dream outlives the dreamer: it stops being a dream and becomes a story that never ends, told down and down the years, curiouser at every telling. You did not escape Wonderland. You made it portable. You gave it away, and so you get to keep it forever, and so does everyone you give it to.`,
  },
  e_startle:{ kind:'wake', scene:'wake', title:'Off With Her Head',
    verse:'The loudest thing in the kingdom, near the surface, is a way out.',
    text:`You wake with a gasp, sitting bolt upright on the bank, heart going like a rabbit's.

You got out — the scream did it, the Queen's one word turning at the last instant from a threat into an alarm-clock, jolting you up and out of the deep water of the dream before it could close over you. That is a real way to wake, and not a bad one; plenty of good dreamers have surfaced on a fright.

But it was quick, and it was rough, and already the dream is going faster than you can hold it — the grin, the garden, the treacle-well, all sliding away half-caught. You woke as yourself. You just didn't get to keep very much. You sit in the ordinary sun with the strong sense of having left something wonderful behind in a room you can no longer find the door to.

Next time, perhaps, you might come up more gently — and bring more of it with you.`,
  },
  e_mabel:{ kind:'lost', scene:'dark', title:'Mabel',
    verse:'You surfaced. You are just not sure whose face it is.',
    text:`You wake. That much you manage. But you wake wrong.

You sit up on the bank in the warm afternoon and you cannot, for the life of you, be sure whose life it is. There is a sister here who calls you by a name, and you answer to it, because it is easier than the alternative, but it does not fit; it is a coat that belongs to somebody else. So much of you got left down there — traded away a shaving at a time to caterpillars and pigeons and warm chairs, spent on being right, worn thin on the long way down — that what came back up is only most of a girl.

<em>"I'm sure I'm not Ada,"</em> you say faintly, to nobody, <em>"and I'm sure I can't be Mabel."</em> But you cannot think who the third choice was, and the harder you reach for her the further she recedes, like a garden you will now be walking toward for a very long time.

It is a waking. It is its own small grief.`,
  },
  e_stay:{ kind:'stay', scene:'teaparty', title:'The Stay',
    verse:'You played along so well you forgot you ever meant to leave.',
    text:`You do not wake.

There is no horror in it, which is the horror. You simply sink the last little way, past the point where anyone comes back, into the warm and endless middle of the dream — the empty chair at the tea-party, the flood over the little door, the clean place always farther on. You are not hurt. You are not afraid. You are, if anything, content, which is worse than any of the endings that hurt, because there is nobody left inside it to mind.

Somewhere far above, on a bank you can no longer remember, a sister shakes a sleeping child gently by the shoulder and cannot wake her, and the afternoon goes on being warm, and the river goes on running, and the dream closes over the last of you like still water closing over a dropped stone — smiling, and gone.

Have some tea. There's plenty of room. There always was.`,
  },
  e_index:{ kind:'index', scene:'index', title:'Everything in Its Place',
    verse:'Wonderland was saved. It only stopped being Wonderland to do it.',
    text:`Midnight. The Registrar reads the last line of the Great Index aloud, and Wonderland holds still to hear it.

And it is — you have to admit — beautiful. The roses are all the one approved red. The Cheshire Cat sits whole and attached to a grin that no longer wanders. The tea is poured in measured cups and the clock says a quarter past, then twenty past, then half — Time moving at last, obedient, in a straight and reasonable line. Every path is labelled. Every creature has one name. Every riddle has been given its one correct answer, and the answers are all filed, and nothing down here will ever frighten or delight or surprise anyone, ever again, because surprise has been catalogued as an error and gently erased.

You helped. Every rule you obeyed, every impossible thing you argued with instead of believing, was another line finished. The Registrar thanks you, kindly, because it is not a monster — it only wanted to keep the dream safe, and this is what keeping a thing perfectly safe turns out to mean.

You wake. Your sister asks what you dreamed, and you tell her, precisely, completely, every detail correct. And already you can feel it: you will never dream it again. There is nothing left in it that hasn't been decided.`,
  },
  e_changes:{ kind:'change', scene:'wake', title:'A Wonderland That Changes',
    verse:'Wonderland is true because it changes. Keep it by letting it go.',
    text:S=>`Midnight, and the Registrar hands you the pen to write the final definition of Wonderland — one sentence, exact, forever.

And you understand it, finally, all at once: the Registrar is you. An older, frightened you, who started a Book of Exact Remembering because she felt Wonderland fading — and who learned, too late, that every messy memory she pinned down with one precise word was a possible Wonderland she quietly killed. The Great Index is nothing but love turned into a cage.

So you do not write the sentence it wants. You write the only true one: <em>"Wonderland is true because it changes."</em> ${S.impossibleThings.length>=6?'You have believed six impossible things before breakfast, and every one of them refuses to hold still, and that is the point of them.':'You have believed enough impossible things to know they were never meant to keep their shape.'}

The Great Index does not burn. It reopens — becomes a book of possible editions, every page pencilled and erasable, the grin free to wander off its cat again, the roses free to come up whatever colour they like. And you give the last blank page not to the Registrar to file, but to the world, to whoever dreams next.

You wake on the warm bank, yourself all the way through, and the final pages of your journal are blank on purpose — room left, for the next time down. The light is still on. It always was.`,
  },
  e_wrongsize:{ kind:'trapped', scene:'rabbithouse', title:'The Wrong Size Forever',
    verse:'Not hurt. Only kept, by the geometry of the dream.',
    text:`You stop reaching for the cakes. You stop trying to be the right size for the door.

And the dream, which asks so little, gives you exactly what you have settled for: you stay the wrong size, forever. Too big to leave the little house — an arm out the window, a foot up the chimney, a giant folded into a room that will never let you out because you will never again be small enough to try. Or (it comes to the same thing, in the end) so small that the grass closes over your head and the world simply misplaces you, a speck among the roots, unlooked-for and unfound.

You cannot die here. That is not the mercy it sounds like. You are perfectly safe, and perfectly stuck, imprisoned not by any monster but by pure arithmetic — a body and a doorway that will never again agree on a number. The afternoon goes on without you. The garden recedes. You are exactly as large, or as little, as you gave up being able to change.`,
  },
};

/* ---- cross-run milestones ---- */
const SIX_BEFORE_BREAKFAST = 6;   // impossible things in one run = the White Queen's milestone
const TELLER_EVER = 8;            // distinct impossible things ever believed, for the secret waking

return {
  start:'n_fall',
  nodes, endings, regions, cast,
  SIX_BEFORE_BREAKFAST, TELLER_EVER,
  // starting run state
  newRun(){ return { node:'n_fall', size:0, self:4, waking:6, mushroom:false,
    contradiction:2, index:3, journal:[],
    impossibleThings:[], seen:{}, flags:{} }; },
};
})();
