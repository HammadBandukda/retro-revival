"""Make the slide backgrounds from the client's July 2026 carousel.

The July PDF pages are flattened images, so the photos have text on top. This script
crops the warehouse photo from the cover page, paints out the bright text (filling each
gap from the photo around it), and softens the result. The slides darken it further in CSS.

    python3 projects/stock-drop/tools/make_backgrounds.py

Needs pdfimages (poppler-utils), Pillow and NumPy. Writes template/bg/cover.jpg and list.jpg.
"""
import subprocess, tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT.parents[1] / "assets/screenshots/2026-07-client-carousel.pdf"
OUT = ROOT / "template/bg"
W, H = 1080, 1350


def pages():
    tmp = Path(tempfile.mkdtemp())
    subprocess.run(["pdfimages", "-j", str(PDF), str(tmp / "p")], check=True)
    return [Image.open(p).convert("RGB") for p in sorted(tmp.glob("p-*.jpg"))]


def _box(a, r, axis):
    c = np.cumsum(np.pad(a, [(r + 1, r) if i == axis else (0, 0) for i in range(a.ndim)], mode="edge"), axis=axis)
    hi = np.take(c, range(2 * r + 1, c.shape[axis]), axis=axis)
    lo = np.take(c, range(0, c.shape[axis] - 2 * r - 1), axis=axis)
    return (hi - lo) / (2 * r + 1)


def blur(a, r):
    """Gaussian-like blur of a float array: three box passes per axis."""
    b = max(1, r // 2)
    for _ in range(3):
        a = _box(_box(a, b, 0), b, 1)
    return a


def paint_out_text(im, threshold, grow):
    """Fill bright marks (text, gold rules) from the photo around them."""
    a = np.asarray(im, dtype=np.float32)
    lum = a @ [0.299, 0.587, 0.114]
    mark = Image.fromarray(((lum > threshold) * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(grow))
    keep = 1 - np.asarray(mark, dtype=np.float32) / 255
    out = a.copy()
    for r in (4, 12, 32):  # widen the fill until every gap is covered
        k = blur(keep, r)
        fill = np.stack([blur(a[..., c] * keep, r) for c in range(3)], -1) / np.maximum(k, 1e-4)[..., None]
        holes = keep < 0.5
        out[holes] = np.where((k[holes] > 0.02)[:, None], fill[holes], out[holes])
        keep = np.maximum(keep, (k > 0.02).astype(np.float32))
        a = out
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def fit(im, box):
    return im.crop(box).resize((W, H), Image.LANCZOS)


p = pages()
OUT.mkdir(parents=True, exist_ok=True)
# Cover: the warehouse aisle with stacked bales (July page 1), above its info boxes.
cover = paint_out_text(fit(p[0], (230, 0, 870, 800)), threshold=95, grow=9)
cover.filter(ImageFilter.GaussianBlur(2)).save(OUT / "cover.jpg", quality=86)
# List slides: the shelves of bales on the right of the same photo, softer, so it stays texture.
bales = paint_out_text(fit(p[0], (752, 100, 980, 385)), threshold=95, grow=9)
bales.filter(ImageFilter.GaussianBlur(6)).save(OUT / "list.jpg", quality=84)
print("wrote", *(f.name for f in sorted(OUT.glob("*.jpg"))))
