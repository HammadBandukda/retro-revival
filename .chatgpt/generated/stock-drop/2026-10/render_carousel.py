"""Render the October Stock Drop slides in the July 2026 visual style.

Run from the repository root with Pillow installed. The checked-in line-check.csv
is the rendering input; repository photos and the official logo remain the sources.
"""
from collections import defaultdict
from csv import DictReader
from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
W, H = 1080, 1350
INK = (13, 15, 14)
GOLD = (201, 153, 63)
GOLD_LIGHT = (224, 187, 104)
CREAM = (241, 230, 207)
MUTED = (194, 183, 159)
FONT_BOLD = "/usr/share/fonts/opentype/urw-base35/NimbusSansNarrow-Bold.otf"
FONT_REG = "/usr/share/fonts/opentype/urw-base35/NimbusSansNarrow-Regular.otf"
FONT_SANS = "/usr/share/fonts/opentype/urw-base35/NimbusSans-Bold.otf"


def font(size, bold=True, sans=False):
    path = FONT_SANS if sans else (FONT_BOLD if bold else FONT_REG)
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


def fit_font(draw, text, max_width, size, min_size=16, bold=True):
    while size > min_size and draw.textbbox((0, 0), text, font=font(size, bold))[2] > max_width:
        size -= 1
    return font(size, bold)


def centered(draw, xy, text, fnt, fill, anchor="mm"):
    draw.text(xy, text, font=fnt, fill=fill, anchor=anchor)


def photo_crop(name, box):
    image = Image.open(ROOT / "assets" / "photos" / name).convert("RGB")
    return image.crop(box).resize((W, H), Image.Resampling.LANCZOS)


def background(name, crop_box, brightness=0.37):
    image = photo_crop(name, crop_box)
    image = ImageEnhance.Brightness(image).enhance(brightness)
    shade = Image.new("RGB", (W, H), (0, 0, 0))
    image = Image.blend(image, shade, 0.24).convert("RGBA")
    # A restrained lower vignette keeps the table clear while retaining the photo.
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    pix = overlay.load()
    for y in range(H):
        alpha = int(16 + 34 * (y / H))
        for x in range(W):
            pix[x, y] = (0, 0, 0, alpha)
    return Image.alpha_composite(image, overlay)


def gold_brush():
    source = Image.open(OUT / "assets" / "gold-brush-source.png").convert("RGBA")
    alpha = source.getchannel("A")
    bounds = alpha.getbbox()
    source = source.crop(bounds)
    pixels = source.load()
    for y in range(source.height):
        for x in range(source.width):
            r, g, b, a = pixels[x, y]
            if not a:
                continue
            # Keep the generated brush texture, but normalize its stray color edges
            # to Retro Revival's antique gold palette.
            luma = (0.22 * r + 0.68 * g + 0.10 * b) / 255
            shade = 0.82 + 0.22 * luma
            pixels[x, y] = (int(GOLD[0] * shade), int(GOLD[1] * shade), int(GOLD[2] * shade), a)
    return source


BRUSH = None


def paste_brush(image, x, y, width, height):
    mark = BRUSH.resize((width, height), Image.Resampling.LANCZOS)
    image.alpha_composite(mark, (x, y))


def draw_icon(draw, x, y, size, kind, color=GOLD_LIGHT, width=4):
    """Small July-style gold outline icons, drawn natively for crisp export."""
    s = size / 64
    def p(px, py): return (int(x + px * s), int(y + py * s))
    def line(points, w=width): draw.line([p(*pt) for pt in points], fill=color, width=max(2, int(w*s)), joint="curve")
    def poly(points, fill=None, outline=color): draw.polygon([p(*pt) for pt in points], fill=fill, outline=outline)
    def ellipse(box, outline=color, fill=None, w=width):
        draw.ellipse((int(x+box[0]*s), int(y+box[1]*s), int(x+box[2]*s), int(y+box[3]*s)), outline=outline, fill=fill, width=max(2,int(w*s)))
    if kind in ("shirt", "tee"):
        poly([(21,8),(28,4),(36,4),(43,8),(59,18),(51,30),(44,25),(44,58),(20,58),(20,25),(13,30),(5,18)])
        line([(27,5),(29,13),(35,13),(37,5)])
    elif kind == "pants":
        poly([(15,7),(49,7),(46,29),(43,58),(32,58),(30,31),(27,58),(16,58),(18,29)])
        line([(15,16),(49,16)]); line([(30,9),(30,29)])
    elif kind == "shorts":
        poly([(15,8),(49,8),(47,38),(38,38),(31,30),(25,38),(17,38)])
        line([(15,17),(49,17)]); line([(31,17),(31,30)])
    elif kind == "cap":
        line([(8,33),(14,21),(27,14),(42,14),(53,22),(57,32)])
        line([(8,33),(45,33),(59,38),(55,43),(29,40),(11,38),(8,33)])
        line([(28,14),(28,26)])
    elif kind == "overalls":
        line([(21,9),(43,9),(43,24),(49,28),(47,58),(34,58),(32,39),(29,58),(16,58),(15,28),(21,24),(21,9)])
        line([(21,10),(25,23),(39,23),(43,10)]); line([(23,24),(40,24)])
    elif kind == "bale":
        poly([(9,18),(32,7),(55,18),(55,47),(32,58),(9,47)])
        line([(9,18),(32,29),(55,18)]); line([(32,29),(32,58)]); line([(20,12),(43,23)])
    elif kind == "child":
        ellipse((20,8,44,32)); line([(32,32),(32,48)]); line([(32,38),(17,46)]); line([(32,38),(47,46)]); line([(32,48),(21,59)]); line([(32,48),(43,59)])
    elif kind == "pin":
        ellipse((19,7,45,34)); ellipse((27,15,37,25),fill=None,w=3); line([(20,29),(32,58),(44,29)])
    elif kind == "snow":
        for ang in (0, 60, 120):
            import math
            a = math.radians(ang); dx, dy = 23*math.cos(a), 23*math.sin(a)
            line([(32-dx,32-dy),(32+dx,32+dy)], w=3)
            for sign in (-1,1):
                bx, by = 32+sign*dx*0.62, 32+sign*dy*0.62
                for side in (-1,1):
                    a2 = a + math.pi + side*0.75
                    line([(bx,by),(bx+8*math.cos(a2),by+8*math.sin(a2))],w=2)
    elif kind == "sun":
        ellipse((20,20,44,44),w=3)
        import math
        for deg in range(0,360,45):
            a=math.radians(deg); line([(32+20*math.cos(a),32+20*math.sin(a)),(32+27*math.cos(a),32+27*math.sin(a))],w=3)
    else:
        ellipse((7,7,57,57),w=3); line([(16,32),(27,43),(49,21)],w=4)


def icon_for(section):
    s = section.lower()
    if "children" in s: return "child"
    if "army" in s or "caps" in s: return "cap"
    if "shorts" in s: return "shorts"
    if "overalls" in s: return "overalls"
    if "pants" in s or "trousers" in s or "jeans" in s: return "pants"
    if "winter" in s: return "snow"
    if "summer" in s: return "sun"
    if "broken" in s: return "bale"
    return "shirt"


def fit_label(draw, text, x, y, maxw, size, fill=CREAM, anchor="lm"):
    fnt = fit_font(draw, text, maxw, size, 17)
    draw.text((x, y), text, font=fnt, fill=fill, anchor=anchor)


def table(draw, rows, x, y, width, row_h=42, name_size=27):
    name_w = int(width * 0.64)
    qty_w = int(width * 0.16)
    pack_w = width - name_w - qty_w
    header_h = 34
    draw.rounded_rectangle((x, y, x+width, y+header_h+(len(rows)*row_h)), radius=5,
                           fill=(9,10,9,224), outline=GOLD, width=2)
    draw.rectangle((x+1, y+1, x+width-1, y+header_h), fill=GOLD)
    dtext = draw
    fhead = font(20, True, True)
    dtext.text((x+14,y+header_h//2), "DESCRIPTION", font=fhead, fill=INK, anchor="lm")
    dtext.text((x+name_w+qty_w//2,y+header_h//2), "BALES", font=fhead, fill=INK, anchor="mm")
    dtext.text((x+name_w+qty_w+pack_w//2,y+header_h//2), "PACKING", font=fhead, fill=INK, anchor="mm")
    dtext.line((x+name_w,y,x+name_w,y+header_h+len(rows)*row_h), fill=GOLD, width=1)
    dtext.line((x+name_w+qty_w,y,x+name_w+qty_w,y+header_h+len(rows)*row_h), fill=GOLD, width=1)
    for i,row in enumerate(rows):
        top=y+header_h+i*row_h
        if i%2==1:
            dtext.rectangle((x+1,top,x+width-1,top+row_h),fill=(28,25,19,255))
        dtext.line((x,top+row_h,x+width,top+row_h),fill=(201,153,63,175),width=1)
        name=row["Bale name shown"]
        fnt=fit_font(dtext,name,name_w-24,name_size,17)
        dtext.text((x+14,top+row_h//2),name,font=fnt,fill=CREAM,anchor="lm")
        dtext.text((x+name_w+qty_w//2,top+row_h//2),row["Bales"],font=font(25,True),fill=CREAM,anchor="mm")
        dtext.text((x+name_w+qty_w+pack_w//2,top+row_h//2),row["Packing shown"],font=fit_font(dtext,row["Packing shown"],pack_w-8,22,16),fill=CREAM,anchor="mm")
    return header_h+len(rows)*row_h


def footer(image):
    draw=ImageDraw.Draw(image,"RGBA")
    y=1244
    draw.line((44,y,1036,y),fill=GOLD,width=2)
    # Location pin, message bubble, and Instagram camera use simple line marks.
    draw_icon(draw,54,y+17,34,"pin",width=3)
    draw.text((98,y+31),"WAREHOUSE C5 · LAT KRABANG, BANGKOK",font=font(22,True),fill=CREAM,anchor="lm")
    draw.rounded_rectangle((550,y+17,588,y+48),radius=9,outline=GOLD_LIGHT,width=3)
    draw.polygon([(561,y+48),(557,y+56),(573,y+48)],fill=GOLD_LIGHT)
    draw.text((602,y+31),"+66 94 395 4613",font=font(22,True),fill=CREAM,anchor="lm")
    draw.ellipse((844,y+18,877,y+51),outline=GOLD_LIGHT,width=3)
    draw.ellipse((853,y+27,868,y+42),outline=GOLD_LIGHT,width=2)
    draw.ellipse((869,y+22,873,y+26),fill=GOLD_LIGHT)
    draw.text((884,y+31),"@retrorevival.thailand",font=fit_font(draw,"@retrorevival.thailand",164,18,16),fill=CREAM,anchor="lm")


def section_header(image, section, y, title_size=33):
    draw=ImageDraw.Draw(image,"RGBA")
    draw_icon(draw,60,y-25,54,icon_for(section),width=4)
    draw.text((132,y),section.upper(),font=fit_font(draw,section.upper(),850,title_size,24),fill=CREAM,anchor="lm")
    draw.line((132,y+31,1020,y+31),fill=GOLD,width=2)


def paint_cover(rows_by_slide, sections_order):
    image=background("warehouse-banner-bales.jpg",(0,262,686,1119),0.48)
    draw=ImageDraw.Draw(image,"RGBA")
    # Framing follows the July cover's gold edge and dark photo treatment.
    draw.rectangle((22,22,1058,1328),outline=(201,153,63,190),width=2)
    logo=Image.open(OUT/"assets"/"logo-traced-light.png").convert("RGBA")
    logo.thumbnail((220,166),Image.Resampling.LANCZOS)
    image.alpha_composite(logo,((W-logo.width)//2,28))
    draw=ImageDraw.Draw(image,"RGBA")
    centered(draw,(W//2,273),"OCTOBER",font(126,True),CREAM)
    centered(draw,(W//2,369),"STOCK DROP",fit_font(draw,"STOCK DROP",860,108,92),GOLD_LIGHT)
    paste_brush(image,105,414,870,94)
    draw=ImageDraw.Draw(image,"RGBA")
    centered(draw,(W//2,461),"OCTOBER 2026",font(43,True,True),INK)

    # 17 sections in the July-style two-column icon list.
    x0,y0,w,h=55,540,970,520
    draw.rounded_rectangle((x0,y0,x0+w,y0+h),radius=8,fill=(7,9,8,214),outline=GOLD,width=2)
    draw.line((540,y0+22,540,y0+h-22),fill=GOLD,width=2)
    left=sections_order[:9]; right=sections_order[9:]
    row_h=53
    for col,items in enumerate((left,right)):
        x=78+col*482
        for i,section in enumerate(items):
            y=y0+30+i*row_h
            draw_icon(draw,x,y+2,40,icon_for(section),width=3)
            fit_label(draw,section,x+56,y+22,395,27,CREAM)
            if i<len(items)-1:
                draw.line((x+55,y+43,x+440,y+43),fill=(201,153,63,120),width=1)

    # Keep the real warehouse banner visible at upper right; the cover footer is concise.
    draw=ImageDraw.Draw(image,"RGBA")
    draw_icon(draw,66,1114,42,"bale",width=3)
    draw.text((123,1127),"WAREHOUSE C5 · LAT KRABANG, BANGKOK",font=font(27,True),fill=GOLD_LIGHT,anchor="lm")
    draw.text((123,1165),"20 MINUTES FROM SUVARNABHUMI AIRPORT",font=font(23,True),fill=CREAM,anchor="lm")
    draw=ImageDraw.Draw(image,"RGBA")
    draw.rounded_rectangle((632,1184,1020,1290),radius=5,fill=GOLD,outline=GOLD_LIGHT,width=2)
    draw.text((672,1212),"WHATSAPP",font=font(19,True,True),fill=INK,anchor="lm")
    draw.text((672,1252),"+66 94 395 4613",font=font(27,True,True),fill=INK,anchor="lm")
    draw.text((66,1284),"@retrorevival.thailand",font=font(21,True),fill=CREAM,anchor="lm")
    return image.convert("RGB")


def load_rows():
    rows_by_slide=defaultdict(list)
    with (OUT/"line-check.csv").open(encoding="utf-8-sig",newline="") as f:
        for r in DictReader(f):
            rows_by_slide[int(r["Slide"])].append(r)
    for rows in rows_by_slide.values():
        rows.sort(key=lambda x:int(x["Source CSV row"]))
    sections_order=[]
    for slide in sorted(rows_by_slide):
        for row in rows_by_slide[slide]:
            if row["Section shown"] not in sections_order:
                sections_order.append(row["Section shown"])
    return rows_by_slide,sections_order


def render_inner(slide_no, rows):
    # Reuse the real warehouse photo crops described by the source build script.
    if slide_no in (2,4,6,8):
        image=background("warehouse-banner-jeans.jpg",(230,600,700,1187),0.36)
    else:
        image=background("warehouse-banner-roof.jpg",(0,220,719,1119),0.34)
    draw=ImageDraw.Draw(image,"RGBA")
    draw.rectangle((22,22,1058,1328),outline=(201,153,63,180),width=2)
    draw.text((58,62),"OCTOBER 2026",font=font(26,True),fill=GOLD_LIGHT,anchor="lm")
    draw.text((1022,62),"RETRO REVIVAL THAILAND",font=font(21,True),fill=CREAM,anchor="rm")
    draw.line((58,94,1022,94),fill=GOLD,width=2)
    grouped=[]
    for row in rows:
        if not grouped or grouped[-1][0]!=row["Section shown"]:
            grouped.append((row["Section shown"],[]))
        grouped[-1][1].append(row)
    y=135
    # Large readable tables, with a distinct icon-led title for each section.
    for section,section_rows in grouped:
        section_header(image,section,y,title_size=36 if len(grouped)==1 else 29)
        y+=55
        remaining=max(38,min(56,(1155-y-20)//max(len(section_rows),1)))
        table_h=table(ImageDraw.Draw(image,"RGBA"),section_rows,60,y,960,row_h=remaining,name_size=27 if remaining>=39 else 24)
        y+=table_h+22
    footer(image)
    return image.convert("RGB")


def main():
    global BRUSH
    BRUSH=gold_brush()
    rows_by_slide,sections=load_rows()
    cover=paint_cover(rows_by_slide,sections)
    cover.save(OUT/"01.png",compress_level=6)
    for slide_no in range(2,9):
        rows=rows_by_slide[slide_no]
        render_inner(slide_no,rows).save(OUT/f"{slide_no:02}.png",compress_level=6)


if __name__=="__main__":
    main()
