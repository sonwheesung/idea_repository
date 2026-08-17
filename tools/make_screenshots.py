# Idea Repository — LinkMemo tools/make_screenshots.py 승계. 입력 tools/store/shots/shot_*.png(adb screencap 1080x2400) → store_shot_N.png(1080x1920)
# 에뮬레이터 원본 스크린샷(1080x2400) → Play 폰 스크린샷 9:16 (1080x1920) 마케팅 프레임 합성
import os

from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'store', 'shots')
SS = 2  # 슈퍼샘플

BLUE_TOP = (37, 78, 190)
BLUE_BOTTOM = (23, 52, 130)


def vertical_gradient(size, top, bottom):
    w, h = size
    base = Image.new('RGB', (1, h))
    for y in range(h):
        t = y / max(h - 1, 1)
        base.putpixel((0, y), tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3)))
    return base.resize((w, h))


def load_font(size, bold=True):
    name = 'segoeuib.ttf' if bold else 'segoeui.ttf'
    return ImageFont.truetype(os.path.join('C:\\Windows\\Fonts', name), size)


def frame(shot_path, out_path, title, subtitle):
    W, H = 1080 * SS, 1920 * SS
    img = vertical_gradient((W, H), BLUE_TOP, BLUE_BOTTOM).convert('RGBA')

    # 은은한 글로우
    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([-W * 0.3, -H * 0.25, W * 1.3, H * 0.35], fill=(120, 170, 250, 55))
    glow = glow.filter(ImageFilter.GaussianBlur(H * 0.06))
    img = Image.alpha_composite(img, glow)

    d = ImageDraw.Draw(img)
    f_title = load_font(int(84 * SS))
    f_sub = load_font(int(44 * SS), bold=False)
    d.text((W / 2, 150 * SS), title, font=f_title, fill=(255, 255, 255, 255), anchor='mm')
    d.text((W / 2, 250 * SS), subtitle, font=f_sub, fill=(199, 219, 252, 235), anchor='mm')

    # 폰 목업 — 상태바 잘라낸 스크린샷을 둥근 프레임에
    shot = Image.open(shot_path).convert('RGB')
    # 상태바(위 100px)·하단 배너/제스처 바(아래 300px) 제거 — 테스트 광고·개발 토스트가 스토어 컷에 나오지 않게
    shot = shot.crop((0, 100, shot.width, shot.height - 300))
    pw = int(W * 0.76)
    ph = int(shot.height * pw / shot.width)
    shot = shot.resize((pw, ph), Image.LANCZOS)

    px = (W - pw) // 2
    py = int(360 * SS)
    radius = int(56 * SS)
    border = int(12 * SS)

    # 그림자
    sh = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    shd = ImageDraw.Draw(sh)
    shd.rounded_rectangle([px - border, py - border, px + pw + border, py + ph + border],
                          radius=radius + border, fill=(5, 15, 45, 160))
    sh = sh.filter(ImageFilter.GaussianBlur(30 * SS))
    img = Image.alpha_composite(img, sh)

    # 베젤(테두리)
    bezel = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    bd = ImageDraw.Draw(bezel)
    bd.rounded_rectangle([px - border, py - border, px + pw + border, py + ph + border],
                         radius=radius + border, fill=(15, 23, 42, 255))
    img = Image.alpha_composite(img, bezel)

    # 화면(둥근 마스크)
    mask = Image.new('L', (pw, ph), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle([0, 0, pw - 1, ph - 1], radius=radius, fill=255)
    screen = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    screen.paste(shot, (px, py), mask)
    img = Image.alpha_composite(img, screen)

    img = img.convert('RGB').resize((1080, 1920), Image.LANCZOS)
    img.save(out_path, quality=95)
    print('saved', out_path)


SHOTS = [
    ('shot_home.png', 'store_shot_1.png', 'All your ideas, one place', 'Status, progress, priority and tags at a glance'),
    ('shot_detail.png', 'store_shot_2.png', 'Turn ideas into projects', 'Problem, goal, core idea, notes and resources'),
    ('shot_new.png', 'store_shot_3.png', 'Capture in seconds', 'Only a name is required - add details later'),
    ('shot_search.png', 'store_shot_4.png', 'Find it instantly', 'Search notes and #tags, filter and sort'),
    ('shot_theme.png', 'store_shot_5.png', '12 themes, all free', 'Light, dark, pastel - pick your mood'),
    ('shot_privacy.png', 'store_shot_6.png', 'Your ideas stay on your device', 'No account, no cloud - not uploaded to our servers'),
]
for src, dst, title, sub in SHOTS:
    p = os.path.join(OUT, src)
    if os.path.exists(p):
        frame(p, os.path.join(OUT, dst), title, sub)
    else:
        print('skip (missing)', src)
