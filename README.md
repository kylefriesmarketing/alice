# CURIOUSER — Alice's Adventures, playable

*A branching playable book of **Alice's Adventures in Wonderland**, for [THE SHELF](https://kylefriesmarketing.github.io/games/).*

**▶ Play: https://kylefriesmarketing.github.io/alice/**

You are Alice. You followed a waistcoated rabbit down a hole and the world stopped making sense —
and now something is quietly *fixing* it. A Registrar is finishing the **Great Index**, to be read
aloud at the **Last Unbirthday** at midnight: one name for every creature, one answer for every
riddle, one meaning for every rule, and anything left undefined erased as an error. **When
Wonderland begins making sense, everything starts to disappear.**

You cannot win Wonderland. You can only **wake as yourself** — and keep Wonderland strange enough to
be worth waking from. Deliberately the opposite of a puzzle you solve: here, *being reasonable is
usually the trap*, and reason itself is what finishes the Index.

## The instruments

- **SIZE** — the star, and unlike any meter on the shelf: **bidirectional**. Too big to fit the
  door, too small to reach the key — *both* extremes are failure, and the right size is fleeting.
  The Caterpillar's mushroom eventually lets you grow and shrink at will (▽ / △, or `-` / `=`).
- **SELF** — who you still are. Wonderland erodes it — your name slips, your poems come out wrong.
  It gates the climactic act of defiance; at zero, you don't wake as Alice.
- **THE WAKING** — dream-depth, drawn as water rising or falling over the scene. Sink too deep and
  you never wake; surface toward the pale light of the riverbank and a fright can jolt you out.
- **IMPOSSIBLE THINGS** — the impossibilities you accept, catalogued across runs. *Six before
  breakfast* is a milestone — you can't wake *well* from a dream you fought the whole way.
- **CONTRADICTION** — proof that two impossible things can both be true. Spend it to **break** a
  Rule Card and keep Wonderland wild. Playing along and believing the impossible earns it.
- **THE GREAT INDEX** — how much of Wonderland has been corrected into sense. Reasoning and obeying
  the local rules complete it; nonsense, play and defiance hold it back. When it fills, the Last
  Unbirthday finishes and nothing may ever change again.

## Rule Cards & the nonsense negotiation

Every district shows a **Rule Card** — the local law the Great Index has pinned to it ("no one may
leave before tea is finished"; "a cat must remain attached to its grin"; "every rose must be the
approved red"). Every creature offers up to three postures. **REASON** is usually the trap (though
each room hides exactly one grounding truth that cuts through) — and reason *hardens the Index*.
**PLAY ALONG** is the humble, reliable way, gathers impossible things, and earns Contradiction.
**DEFY** is the growth move — literally. And you can **BREAK** a Rule Card outright by spending
Contradiction: leave the tea table while staying seated, protect a mispainted rose from ever being
fixed, jam a both-true-and-false line into the Index itself. Wrong choices are authored branches,
never retries.

## The wakings

Eight, rewarding different philosophies, not merely success. **A Wonderland That Changes** (the true
waking — write "Wonderland is true because it changes" and give the last page away) · **The Teller**
(the secret, earned across runs) · **The Riverbank** (wake as yourself) · **Off With Her Head** (the
startle) · **Everything in Its Place** (you let the Registrar win — Wonderland safe, beautiful, and
unable to surprise anyone again) · **Mabel** (a hollow waking) · **The Wrong Size Forever** · **The
Stay** (you never wake). No death, ever — a dream has other stakes.

## Built with

Vanilla JS, zero dependencies, all content data-driven — the same lean stack as **NOBODY** and the
rest of THE SHELF.

```
alice/
  index.html          title / game / waking / gallery
  css/style.css        Tenniel's engraved line, flooded with drifting dream-colour
  js/data.js           the garden of encounters + the wakings, as data
  js/engine.js         the loop: SIZE control, posture negotiation, drift, waking, persistence
  js/art.js            procedural SVG fallbacks + the SIZE gauge + the WAKING waterline
  js/audio.js          generative WebAudio — a music-box that curdles as you sink
  js/images.js         generated-stills manifest (SVG fallback until the sheets exist)
  serve.ps1            local static server (PowerShell HttpListener)
```

**Run locally:** `powershell -ExecutionPolicy Bypass -File serve.ps1 -Port 8381`, then open
`http://localhost:8381/index.html`.

**Debug:** press `` ~ `` for the pool of tears (jump nodes, set SIZE/SELF/WAKING, force wakings,
run the soak). `window.__alSoak(runs)` random-walks the graph and asserts no dead nodes, no
soft-locks, and every waking reachable. `m` mutes.

## Art & sound

Art north star is **John Tenniel's 1865 wood-engraving line** (public domain), flooded with
saturated, drifting dream-colour that drains toward pale real light as you wake and super-saturates
as you sink. Procedural SVG ships now; generated Tenniel-dream-colour sheets drop into
`assets/scenes/` later (see `BIBLE.md` §10). Sound is a generative WebAudio music-box that detunes
and tempo-warps as you sink and rights itself as you surface — plus a clock stuck at six, a grin
that vanishes mid-phrase, and the clean cadence of the riverbank.

## Copyright

*Alice's Adventures in Wonderland* (1865) and *Through the Looking-Glass* (1871) by Lewis Carroll,
and John Tenniel's original engravings, are **public domain worldwide**. All prose here is 100%
original; only short, famous, public-domain phrases are quoted. No Disney / Burton / American
McGee designs are referenced.

## Next

**THROUGH THE LOOKING-GLASS** as the unlocked second book — Looking-Glass is already a chess
problem: Alice a pawn advancing square by square to be crowned. Same engine, mirror-logic replacing
nonsense. See `BIBLE.md` §7.

— *The tea is always ready, the clock is stuck at six, and the little door is just too small.*
