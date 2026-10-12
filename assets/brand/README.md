# Brand Assets

| File | What it is | Use it for |
| :- | :- | :- |
| `logo-primary.png` | Official logo from Figma, 1280×853, off-white background | The source of truth |
| `logo-primary-trimmed.png` | The same file, cropped to the logo | Raster use (the carousel cover today) |
| `logo-traced.svg` | Vector trace, full colour, transparent background | Light backgrounds, any size |
| `logo-traced-light.svg` | Vector trace with a cream wordmark | Dark backgrounds and photos (the Stock Drop cover) |
| `tools/trace_logo.py` | The script that made both SVGs | Re-tracing from a sharper PNG |
| `tools/trace-check.png` | Original vs traced vs light, side by side | Checking the trace |

Colours and usage rules: [brand direction](../../docs/strategy/brand-direction.md).

## About the traced SVGs

- **A working copy, not the original artwork.** They're traced from the 1280px PNG, so fine details are softer than a designer's master file. The small "THAILAND" on the ribbon is as blurry as in the PNG, and the shield's thin brown frame is simplified to navy and gold. If the client supplies the original vector, it replaces these ([open question 10](../../docs/client/open-questions.md)).
- **Shapes are traced, not redrawn.** Only colours were snapped to the four brand inks.

## Recolouring

Each shape has a class, and its fill matches the brand colour:

| Class | Colour | Covers |
| :- | :- | :- |
| `rr-navy-crest` | `#1C2C3C` | Shield and the bars under the lions |
| `rr-navy-text` | `#1C2C3C` (cream `#F7F6F4` in the light file) | "RETRO REVIVAL THAILAND" |
| `rr-gold` | `#B88830` | Lions, shield frame |
| `rr-gold-light` | `#E6CF95` | RR monogram, highlights |
| `rr-cream` | `#F7F6F4` | Ribbon and leaf |

- **In Figma or Illustrator:** select by colour and change it.
- **In code:** inline the SVG and override the classes, for example `.rr-gold { fill: #C9A24A; }`.

## Re-tracing

```
pip install vtracer pillow numpy
python3 assets/brand/tools/trace_logo.py
```

Save a sharper PNG over `logo-primary-trimmed.png` first. The script snaps colours to the four inks, removes anti-aliased slivers, traces in cutout mode (so holes are real holes), and names the layers.
