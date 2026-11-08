# BFY Akıllı Tahta

`akilli-tahta.html` opens the existing 18 public simulations with `?tahta=1`.
The same mode can be opened from the new button in each laboratory. The
simulation directory links to the classroom library.

The opt-in workspace (`bfy-board.js` / `bfy-board.css`) moves the live experiment
DOM into a classroom surface and restores it on exit. It does not rebuild the
scene, reset the physics or replace simulation input listeners. Drawing is an
independent SVG overlay; “Deneyi yönet” returns all pointer input to the scene.
Drawings are retained while entering/exiting on the same page, hidden outside
board mode, and cleared by navigation/reload. Undo supports the last 60 edits.

Teacher tools include enlarged controls, range steppers, native fullscreen with
a usable fallback, four pen colours, stroke erasing, undo, reversible clearing,
and a lesson drawer drawn from each page's existing three experiment cards.
The drawer reveals explanations only on request. The existing 3D rendering
quality settings and physical models remain in place.

## Related corrections

- Pendulum and projectile graph backing stores now resize when only height
  changes; classroom pendulum graph labels are larger.
- Failed HDR/background requests reject the shared environment-loading promise.
  Seven 3D laboratories now show an actionable retry screen instead of waiting
  indefinitely after a request failure.
- Classroom colours override low-contrast labels inherited from cinema pages.
- Previously unassociated visual slider labels are connected to their inputs.

## Verification (8 November 2026)

Served the checkout with `python3 -m http.server 8765 --bind 127.0.0.1` and
used the browser to open all 18 classroom routes. Every route mounted its
experiment and exposed all three lesson cards. Sampled rendering and controls
at 1920×1080, 1366×768 and 390×844. No horizontal document overflow at 390 px.

Manually verified:

- Circuit: 12 V / 12 Ω gives 1 A with a single lamp; two parallel lamps give
  total 2 A. The 0.5 V increment updates the model and meters.
- Pen, stroke eraser, undo, and return to interaction mode.
- Opening/revealing/advancing lessons; fullscreen entry/exit.
- Exiting the board restores the experiment and preserves the 12.5 V setting.
- Pendulum startup and motion, graph fit and graph size on the classroom layout.
- Topic filtering in the library.
- A separate test server returned HTTP 503 for the lab HDR; the retry message
  and button appeared instead of the perpetual loading overlay.
- JavaScript parsing and `git diff --check`.

This is browser validation, not physical smartboard certification. Multi-touch,
pen hardware, older board browsers, and classroom-device frame rates still
need a check on the intended board. First load requires network access; no new
offline or service-worker behaviour is claimed.


## Şahin garage and acceleration race (local revision)

- `sahin-ivme-yarisi.html` adds a nineteenth experiment. Original procedural geometry; plate 54 BFY 54; orbit/front/side/rear cameras; reduced ride height; opening trunk with reactive speakers; headlights/night; optional instrumental and device-local music.
- Reference photographs were inspected for geometry, not shipped as textures: [side](https://www.arabam.com/ilan/sahibinden-satilik-tofas-sahin-s/sahibinden-tofas-sahin-s-1997-model/33465590), [front](https://www.letgo.com/item/tofas-sahin-iid-1678570462), [rear](https://www.arabam.com/ilan/sahibinden-satilik-tofas-sahin-1-6/sahibinden-tofas-sahin-1-6-1994-model/37345508).
- Shortened the excessive front overhang while keeping the 2.48 m model wheelbase; corrected window/door proportions and rear plate position; replaced headlamp grid geometry with fine glass/reflector texture; reduced bumper and front lip thickness. This is an approximation, not a scanned car or a manufacturer CAD asset.
- Pure SI physics uses a = Fnet/m, x = at²/2, v = at and p = Fnet*t. Faster vehicle continues until slower vehicle finishes; no artificial stop at the line. Vehicle performance is a teaching model, not actual Şahin specifications. Visual/audio gears do not affect the net-force model.
- `bfy-sahin-audio.mjs` plays only device-selected recordings. No real Şahin engine clip is bundled: the found community sample pack clipped, and YouTube media download failed. The UI links the candidate video; it does not label an oscillator as a real engine. User music and engine files never upload. No Müslüm Gürses vocal was generated.
- Engine and music are opt-in and stop when the page is hidden. Audio levels have separate controls (engine capped at 60%). Real smartboard audio quality and performance remain hardware checks.
- Renderer uses local Three.js; no new network dependency is needed for the car or instrumental. Scene DPR capped at 2; UI/graph updates throttled to about 15 Hz while car motion remains per-frame.
