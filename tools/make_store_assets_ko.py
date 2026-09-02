# 한국어 피처 그래픽 1024x500 — make_store_assets.py의 피처 블록만 분리 복제 (2026-09-02, STORE_LISTING §7.1)
# 원본 스크립트를 재실행하면 앱 아이콘 assets까지 다시 쓰므로 건드리지 않는다. 구도·심볼 동일, 태그라인만 한국어.
import os

from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'store')
SS = 4

BLUE_TOP = (59, 130, 246)
BLUE_BOTTOM = (29, 78, 216)
BLUE_DEEP = (17, 46, 120)
WHITE = (255, 255, 255, 255)
LIGHT = (199, 224, 254, 255)
AMBER = (253, 224, 71, 255)


def vertical_gradient(size, top, bottom):
    w, h = size
    base = Image.new('RGB', (1, h))
    for y in range(h):
        t = y / max(h - 1, 1)
        base.putpixel((0, y), tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3)))
    return base.resize((w, h))


def tint(layer, rgba):
    solid = Image.new('RGBA', layer.size, rgba)
    solid.putalpha(Image.eval(layer.split()[3], lambda a: int(a * rgba[3] / 255)))
    return solid


def bulb_symbol():
    C = 1000
    img = Image.new('RGBA', (C, C), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    cx = C // 2
    r = 250
    cy = 400
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=WHITE)
    d.polygon([(cx - 150, cy + 190), (cx + 150, cy + 190), (cx + 105, cy + 330), (cx - 105, cy + 330)], fill=WHITE)
    d.rounded_rectangle([cx - 105, cy + 345, cx + 105, cy + 400], radius=26, fill=LIGHT)
    d.rounded_rectangle([cx - 90, cy + 415, cx + 90, cy + 468], radius=24, fill=LIGHT)
    d.rounded_rectangle([cx - 55, cy + 480, cx + 55, cy + 520], radius=20, fill=LIGHT)
    fil = ImageDraw.Draw(img)
    fil.arc([cx - 95, cy - 20, cx + 95, cy + 150], 200, 340, fill=(*BLUE_DEEP, 255), width=32)
    fil.line([(cx - 88, cy + 70), (cx - 88, cy + 178)], fill=(*BLUE_DEEP, 255), width=32)
    fil.line([(cx + 88, cy + 70), (cx + 88, cy + 178)], fill=(*BLUE_DEEP, 255), width=32)
    for x0, y0, x1, y1 in [(cx - 330, cy - 235, cx - 245, cy - 175), (cx, cy - 400, cx, cy - 300),
                           (cx + 330, cy - 235, cx + 245, cy - 175)]:
        d.line([(x0, y0), (x1, y1)], fill=AMBER, width=40)
    return img


W, H = 1024 * SS, 500 * SS
fg = vertical_gradient((W, H), BLUE_TOP, BLUE_BOTTOM).convert('RGBA')
glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
ImageDraw.Draw(glow).ellipse([-W * 0.1, -H * 0.6, W * 0.55, H * 0.9], fill=(255, 255, 255, 40))
fg = Image.alpha_composite(fg, glow.filter(ImageFilter.GaussianBlur(H * 0.12)))
symbol = bulb_symbol()
sym_size = int(H * 0.72)
sym = symbol.resize((sym_size, sym_size), Image.LANCZOS)
layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
layer.paste(tint(sym, (10, 25, 70, 110)), (int(W * 0.08), int(H * 0.14) + int(H * 0.02)), tint(sym, (10, 25, 70, 110)))
layer.paste(sym, (int(W * 0.08), int(H * 0.14)), sym)
fg = Image.alpha_composite(fg, layer)
d = ImageDraw.Draw(fg)
tx = int(W * 0.40)
max_w = W - tx - int(W * 0.05)


def fit_font(path, text, start, min_size=20):
    size = start
    while size > min_size:
        f = ImageFont.truetype(path, int(size * SS))
        if d.textlength(text, font=f) <= max_w:
            return f
        size -= 2
    return ImageFont.truetype(path, int(min_size * SS))


TAGLINE = '내 아이디어. 내 기기. 내가 만든다.'  # §3.2 한국어 설명 도입부와 동일
f_title = fit_font(r'C:\Windows\Fonts\segoeuib.ttf', 'Idea Repository', 100)
f_sub = fit_font(r'C:\Windows\Fonts\malgun.ttf', TAGLINE, 44)  # 한글은 Malgun Gothic
d.text((tx, int(H * 0.30)), 'Idea Repository', font=f_title, fill=WHITE)
d.text((tx + 4, int(H * 0.56)), TAGLINE, font=f_sub, fill=(219, 234, 254, 255))
fg.resize((1024, 500), Image.LANCZOS).convert('RGB').save(os.path.join(OUT, 'feature-ko-1024x500.png'))
print('saved', os.path.join(OUT, 'feature-ko-1024x500.png'))
