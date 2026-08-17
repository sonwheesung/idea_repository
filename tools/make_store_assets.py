# Idea Repository 스토어·앱 아이콘 그래픽 생성 (LinkMemo tools/make_store_assets.py·make_app_icons.py 승계)
# 심볼: 전구(아이디어) — 흰 전구 + 연블루 소켓 + 3개 광선. 4x 슈퍼샘플링 후 LANCZOS 다운스케일.
# 산출: tools/store/icon-512.png · feature-1024x500.png / assets/images/{icon,android-icon-*,splash-icon,favicon}.png
import os

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'tools', 'store')
ASSETS = os.path.join(ROOT, 'assets', 'images')
os.makedirs(OUT, exist_ok=True)
SS = 4

BLUE_TOP = (59, 130, 246)  # #3B82F6
BLUE_BOTTOM = (29, 78, 216)  # #1D4ED8
BLUE_DEEP = (17, 46, 120)
WHITE = (255, 255, 255, 255)
LIGHT = (199, 224, 254, 255)
AMBER = (253, 224, 71, 255)  # 광선 포인트


def vertical_gradient(size, top, bottom):
    w, h = size
    base = Image.new('RGB', (1, h))
    for y in range(h):
        t = y / max(h - 1, 1)
        base.putpixel((0, y), tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3)))
    return base.resize((w, h))


def rounded_mask(size, radius):
    m = Image.new('L', size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, size[0] - 1, size[1] - 1], radius=radius, fill=255)
    return m


def tint(layer, rgba):
    solid = Image.new('RGBA', layer.size, rgba)
    solid.putalpha(Image.eval(layer.split()[3], lambda a: int(a * rgba[3] / 255)))
    return solid


def bulb_symbol():
    """1000x1000 RGBA — 전구 심볼(투명 배경)."""
    C = 1000
    img = Image.new('RGBA', (C, C), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    cx = C // 2
    # 유리구
    r = 250
    cy = 400
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=WHITE)
    # 목(사다리꼴) — 구와 자연스럽게 이어지게
    d.polygon([(cx - 150, cy + 190), (cx + 150, cy + 190), (cx + 105, cy + 330), (cx - 105, cy + 330)], fill=WHITE)
    # 소켓(연블루 바 2개 + 바닥)
    d.rounded_rectangle([cx - 105, cy + 345, cx + 105, cy + 400], radius=26, fill=LIGHT)
    d.rounded_rectangle([cx - 90, cy + 415, cx + 90, cy + 468], radius=24, fill=LIGHT)
    d.rounded_rectangle([cx - 55, cy + 480, cx + 55, cy + 520], radius=20, fill=LIGHT)
    # 필라멘트 컷아웃(파란 선 — 배경색과 무관하게 딥블루)
    fil = ImageDraw.Draw(img)
    # 필라멘트 — 목 위쪽의 둥근 고리(작은 U자) + 두 다리
    fil.arc([cx - 95, cy - 20, cx + 95, cy + 150], 200, 340, fill=(*BLUE_DEEP, 255), width=32)
    fil.line([(cx - 88, cy + 70), (cx - 88, cy + 178)], fill=(*BLUE_DEEP, 255), width=32)
    fil.line([(cx + 88, cy + 70), (cx + 88, cy + 178)], fill=(*BLUE_DEEP, 255), width=32)
    # 광선 3개(앰버) — 좌상·상·우상
    for ang, (x0, y0, x1, y1) in {
        'l': (cx - 330, cy - 235, cx - 245, cy - 175),
        't': (cx, cy - 400, cx, cy - 300),
        'r': (cx + 330, cy - 235, cx + 245, cy - 175),
    }.items():
        d.line([(x0, y0), (x1, y1)], fill=AMBER, width=40)
    return img


def base_square(size, radius_frac=None):
    S = size * SS
    img = vertical_gradient((S, S), BLUE_TOP, BLUE_BOTTOM).convert('RGBA')
    glow = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse([S * 0.45, -S * 0.35, S * 1.35, S * 0.55], fill=(255, 255, 255, 46))
    img = Image.alpha_composite(img, glow.filter(ImageFilter.GaussianBlur(S * 0.09)))
    shade = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    ImageDraw.Draw(shade).ellipse([-S * 0.4, S * 0.62, S * 1.4, S * 1.6], fill=(*BLUE_DEEP, 70))
    img = Image.alpha_composite(img, shade.filter(ImageFilter.GaussianBlur(S * 0.10)))
    if radius_frac:
        img.putalpha(rounded_mask((S, S), int(S * radius_frac)))
    return img, S


def paste_center(img, sym, S, frac, dy=0.0):
    size = int(S * frac)
    sym = sym.resize((size, size), Image.LANCZOS)
    layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
    layer.paste(sym, (int(S / 2 - size / 2), int(S / 2 - size / 2 + S * dy)), sym)
    return Image.alpha_composite(img, layer)


def with_shadow(img, sym, S, frac, dy=0.0):
    img = paste_center(img, tint(sym, (10, 25, 70, 120)), S, frac, dy=dy + 0.022)
    return paste_center(img, sym, S, frac, dy=dy)


symbol = bulb_symbol()

# --- 스토어 아이콘 512 (Play 등록정보 — 둥근 모서리 마스킹은 Play가 하지만 풀블리드로 제출) ---
img, S = base_square(512)
img = with_shadow(img, symbol, S, 0.80)
img.resize((512, 512), Image.LANCZOS).convert('RGB').save(os.path.join(OUT, 'icon-512.png'))

# --- 피처 그래픽 1024x500 ---
W, H = 1024 * SS, 500 * SS
fg = vertical_gradient((W, H), BLUE_TOP, BLUE_BOTTOM).convert('RGBA')
glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
ImageDraw.Draw(glow).ellipse([-W * 0.1, -H * 0.6, W * 0.55, H * 0.9], fill=(255, 255, 255, 40))
fg = Image.alpha_composite(fg, glow.filter(ImageFilter.GaussianBlur(H * 0.12)))
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


f_title = fit_font(r'C:\Windows\Fonts\segoeuib.ttf', 'Idea Repository', 100)
f_sub = fit_font(r'C:\Windows\Fonts\segoeui.ttf', 'Your ideas. Your device. Yours to build.', 44)
d.text((tx, int(H * 0.30)), 'Idea Repository', font=f_title, fill=WHITE)
d.text((tx + 4, int(H * 0.56)), 'Your ideas. Your device. Yours to build.', font=f_sub, fill=(219, 234, 254, 255))
fg.resize((1024, 500), Image.LANCZOS).convert('RGB').save(os.path.join(OUT, 'feature-1024x500.png'))

# --- 앱 아이콘 assets (Expo) ---
img, S = base_square(1024)
img = with_shadow(img, symbol, S, 0.80)
img.resize((1024, 1024), Image.LANCZOS).save(os.path.join(ASSETS, 'icon.png'))

bg, S = base_square(1024)
bg.resize((1024, 1024), Image.LANCZOS).save(os.path.join(ASSETS, 'android-icon-background.png'))

S = 1024 * SS
fgi = Image.new('RGBA', (S, S), (0, 0, 0, 0))
fgi = with_shadow(fgi, symbol, S, 0.50)
fgi.resize((1024, 1024), Image.LANCZOS).save(os.path.join(ASSETS, 'android-icon-foreground.png'))

mono = Image.new('RGBA', (S, S), (0, 0, 0, 0))
mono = paste_center(mono, tint(symbol, (255, 255, 255, 255)), S, 0.50)
mono.resize((1024, 1024), Image.LANCZOS).save(os.path.join(ASSETS, 'android-icon-monochrome.png'))

# 스플래시 — 흰 배경 위 심볼은 안 보이므로 블루 원형 배지 안에 심볼
sp = Image.new('RGBA', (S, S), (0, 0, 0, 0))
badge = Image.new('RGBA', (S, S), (0, 0, 0, 0))
ImageDraw.Draw(badge).ellipse([S * 0.1, S * 0.1, S * 0.9, S * 0.9], fill=(*BLUE_TOP, 255))
sp = Image.alpha_composite(sp, badge)
sp = with_shadow(sp, symbol, S, 0.56)
sp.resize((1024, 1024), Image.LANCZOS).save(os.path.join(ASSETS, 'splash-icon.png'))

fav, S = base_square(48, radius_frac=0.22)
fav = paste_center(fav, symbol, S, 0.82)
fav.resize((48, 48), Image.LANCZOS).save(os.path.join(ASSETS, 'favicon.png'))
print('assets written')
