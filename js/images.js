/* CURIOUSER — generated-stills manifest (Tenniel dream-colour sheets, sliced local).
   Procedural SVG in art.js is the fallback for every key not listed here. When the
   sheets are generated (see BIBLE §10), add the scene keys below and drop the sliced
   JPGs into assets/scenes/. Until then the game runs entirely on the SVG fallback. */
const IMAGES = (() => {
  // Generated Tenniel-line dream-colour plates (nano_banana_pro), sliced to assets/scenes/.
  // Any key not listed here (e.g. 'dark') degrades to the procedural SVG in art.js.
  const scenes = ['title','fall','hall','pool','caucus','rabbithouse','caterpillar',
    'kitchen','cheshire','teaparty','croquet','mockturtle','trial','wake','index'];
  return { has:k=>scenes.includes(k), url:k=>`assets/scenes/${k}.jpg` };
})();
