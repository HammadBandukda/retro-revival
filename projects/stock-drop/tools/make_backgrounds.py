"""Make the slide backgrounds from the client's warehouse photos in assets/photos/.

    python3 projects/stock-drop/tools/make_backgrounds.py

Crops each photo to 1080 x 1350 (Instagram 4:5) and writes template/bg/cover.jpg and
list.jpg. The slides darken them in CSS. Needs Pillow.
"""
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
PHOTOS = ROOT.parents[1] / "assets/photos"
OUT = ROOT / "template/bg"
W, H = 1080, 1350


def crop(name, left, top, width):
    """Crop a 4:5 box starting at (left, top), `width` pixels wide in the original photo."""
    im = Image.open(PHOTOS / name).convert("RGB")
    return im.crop((left, top, left + width, top + width * H // W)).resize((W, H), Image.LANCZOS)


OUT.mkdir(parents=True, exist_ok=True)
# Cover: the "Welcome to vintage world" banner sits top right, opposite the logo,
# with the stacked bales running down behind the text.
crop("warehouse-banner-bales.jpg", 0, 262, 686).save(OUT / "cover.jpg", quality=88)
# List slides: the stack of labelled jeans bales, softened so it stays texture behind the rows.
crop("warehouse-banner-jeans.jpg", 230, 600, 470).filter(ImageFilter.GaussianBlur(4)).save(OUT / "list.jpg", quality=84)
print("wrote", *(f.name for f in sorted(OUT.glob("*.jpg"))))
