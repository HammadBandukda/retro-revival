# Traces the official logo PNG into recolourable SVGs.
#   pip install vtracer pillow numpy
#   python3 assets/brand/tools/trace_logo.py
# Writes assets/brand/logo-traced.svg and logo-traced-light.svg. Re-run if the client sends a
# sharper PNG (save it over logo-primary-trimmed.png first).
import re, tempfile
from pathlib import Path
import numpy as np, vtracer
from PIL import Image, ImageFilter

BRAND = Path(__file__).resolve().parents[1]
outdir = str(BRAND)
src = Image.open(BRAND / "logo-primary-trimmed.png").convert("RGB")

# 1. Upscale 3x, then snap every pixel to one of the 4 inks: background, navy, gold, light gold.
big = src.resize((src.width * 3, src.height * 3), Image.LANCZOS)
inks = np.array([[247,246,244],[28,44,60],[184,136,48],[230,207,149]], float)
a = np.asarray(big).astype(float)
dist = ((a[:, :, None, :] - inks[None, None]) ** 2).sum(-1)
dist[int(0.62 * a.shape[0]):, :, 2:] = np.inf      # wordmark: navy or background only
labels = dist.argmin(-1).astype(np.uint8)
# 2. Remove anti-aliased slivers (they read as gold outlines) with a mode filter.
labels = np.asarray(Image.fromarray(labels * 60).filter(ImageFilter.ModeFilter(7))) // 60
tmp = Path(tempfile.mkdtemp())
Image.fromarray(inks[labels].astype(np.uint8)).save(tmp / "quantized.png")

# 3. Trace in cutout mode, so holes (letter counters, gaps) are real holes.
vtracer.convert_image_to_svg_py(str(tmp / "quantized.png"), str(tmp / "raw.svg"),
    colormode="color", hierarchical="cutout", mode="spline", filter_speckle=12,
    color_precision=8, layer_difference=8, corner_threshold=60, length_threshold=4.0,
    max_iterations=10, splice_threshold=45, path_precision=2)
s = (tmp / "raw.svg").read_text()

# 4. Name the layers and write the SVGs.
W, H = map(int, re.search(r'width="(\d+)" height="(\d+)"', s).groups())
PAL = {"bg": (247,246,244), "navy": (28,44,60), "gold": (184,136,48), "gold-light": (230,207,149)}
HEX = {k: "#%02X%02X%02X" % v for k, v in PAL.items()}
def role(hexcol):
    c = tuple(int(hexcol[i:i+2], 16) for i in (1,3,5))
    return min(PAL, key=lambda k: sum((a-b)**2 for a, b in zip(c, PAL[k])))
SHIELD_X = (0.41*W, 0.585*W)   # the shield column: ribbon and the leaf on top
CREST_BOTTOM = 0.62*H          # wordmark sits below the crest
paths = []
for t in re.findall(r'<path[^>]*>', s):
    d = re.search(r'd="([^"]+)"', t).group(1)
    fill = re.search(r'fill="(#[0-9A-Fa-f]{6})"', t).group(1)
    tr = re.search(r'translate\(([-\d.]+),([-\d.]+)\)', t)
    tx, ty = (float(tr.group(1)), float(tr.group(2))) if tr else (0.0, 0.0)
    nums = [float(n) for n in re.findall(r'-?\d+(?:\.\d+)?', d)]
    xs, ys = nums[0::2], nums[1::2]
    b = (tx+min(xs), ty+min(ys), tx+max(xs), ty+max(ys))
    r = role(fill)
    if r == "bg":
        inside_shield = b[0] >= SHIELD_X[0] and b[2] <= SHIELD_X[1] and b[3] < CREST_BOTTOM
        if not inside_shield:
            continue            # background or a gap: leave it transparent
        r = "cream"             # the ribbon and the leaf are cream in the original
    elif r == "navy":
        r = "navy-text" if b[1] > CREST_BOTTOM else "navy-crest"
    paths.append((r, re.sub(r'(\d+\.\d)\d+', r'\1', d), tx, ty))
def write(name, colors, title):
    style = "\n".join(f"  .rr-{k} {{ fill: {v}; }}" for k, v in colors.items())
    tf = lambda tx, ty: f' transform="translate({tx:g},{ty:g})"' if (tx or ty) else ""
    body = "\n".join(f'<path class="rr-{r}" fill="{colors[r]}" d="{d}"{tf(tx, ty)}/>' for r, d, tx, ty in paths)
    open(f"{outdir}/{name}", "w").write(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W//3}" height="{H//3}" role="img" aria-label="Retro Revival Thailand">
<title>{title}</title>
<!-- Traced from assets/brand/logo-primary-trimmed.png (vtracer cutout, 3x). Not the original
     artwork. Recolour by editing the fills, or override the .rr-* classes when inlined:
     rr-navy-crest, rr-navy-text, rr-gold, rr-gold-light, rr-cream. Background is transparent. -->
<style>
{style}
</style>
{body}
</svg>
''')
base = {"navy-crest": HEX["navy"], "navy-text": HEX["navy"], "gold": HEX["gold"], "gold-light": HEX["gold-light"], "cream": HEX["bg"]}
write("logo-traced.svg", base, "Retro Revival Thailand")
write("logo-traced-light.svg", dict(base, **{"navy-text": HEX["bg"]}), "Retro Revival Thailand (light wordmark, for dark backgrounds)")
from collections import Counter; print(Counter(p[0] for p in paths), len(paths))
