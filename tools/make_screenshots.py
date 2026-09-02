# Idea Repository — LinkMemo tools/make_screenshots.py 승계. 입력 tools/store/shots/shot_*.png(adb screencap 1080x2400) → store_shot_N.png(1080x1920)
# 에뮬레이터 원본 스크린샷(1080x2400) → Play 폰 스크린샷 9:16 (1080x1920) 마케팅 프레임 합성
# 2026-09-02 ko 지원: 사용 `python tools/make_screenshots.py [en|ko]` — ko는 shot_*_ko.png → store_shot_ko_N.png, Malgun Gothic
import os
import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'store', 'shots')
SS = 2  # 슈퍼샘플

BLUE_TOP = (37, 78, 190)
BLUE_BOTTOM = (23, 52, 130)

FONTS = {  # Segoe UI에는 한글 글리프가 없다 — 언어별 폰트
    'en': ('segoeuib.ttf', 'segoeui.ttf'),
    'ko': ('malgunbd.ttf', 'malgun.ttf'),
}


def vertical_gradient(size, top, bottom):
    w, h = size
    base = Image.new('RGB', (1, h))
    for y in range(h):
        t = y / max(h - 1, 1)
        base.putpixel((0, y), tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3)))
    return base.resize((w, h))


def load_font(size, bold=True, lang='en'):
    name = FONTS[lang][0 if bold else 1]
    return ImageFont.truetype(os.path.join('C:\\Windows\\Fonts', name), size)


def fit_font(draw, text, start_size, max_w, bold=True, lang='en'):
    # 캡션이 프레임 폭을 넘으면 줄어들 때까지 축소(ko 자간이 넓어 필요 — en도 안전망)
    size = start_size
    while size > 20 * SS:
        f = load_font(size, bold=bold, lang=lang)
        if draw.textlength(text, font=f) <= max_w:
            return f
        size -= 2 * SS
    return load_font(20 * SS, bold=bold, lang=lang)


def frame(shot_path, out_path, title, subtitle, lang='en'):
    W, H = 1080 * SS, 1920 * SS
    img = vertical_gradient((W, H), BLUE_TOP, BLUE_BOTTOM).convert('RGBA')

    # 은은한 글로우
    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([-W * 0.3, -H * 0.25, W * 1.3, H * 0.35], fill=(120, 170, 250, 55))
    glow = glow.filter(ImageFilter.GaussianBlur(H * 0.06))
    img = Image.alpha_composite(img, glow)

    d = ImageDraw.Draw(img)
    max_w = int(W * 0.92)
    f_title = fit_font(d, title, int(84 * SS), max_w, bold=True, lang=lang)
    f_sub = fit_font(d, subtitle, int(44 * SS), max_w, bold=False, lang=lang)
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


SHOTS = {
    'en': [
        ('shot_home.png', 'store_shot_1.png', 'All your ideas, one place', 'Status, progress, priority and tags at a glance'),
        ('shot_detail.png', 'store_shot_2.png', 'Turn ideas into projects', 'Problem, goal, core idea, notes and resources'),
        ('shot_new.png', 'store_shot_3.png', 'Capture in seconds', 'Only a name is required - add details later'),
        ('shot_search.png', 'store_shot_4.png', 'Find it instantly', 'Search notes and #tags, filter and sort'),
        ('shot_theme.png', 'store_shot_5.png', '12 themes, all free', 'Light, dark, pastel - pick your mood'),
        ('shot_privacy.png', 'store_shot_6.png', 'Your ideas stay on your device', 'No account, no cloud - not uploaded to our servers'),
    ],
    'ko': [  # 캡션 정본: docs/STORE_LISTING.md §7.1
        ('shot_home_ko.png', 'store_shot_ko_1.png', '모든 아이디어를 한곳에', '상태·진행률·우선순위·태그를 한눈에'),
        ('shot_detail_ko.png', 'store_shot_ko_2.png', '아이디어를 프로젝트로', '문제점·목표·핵심 아이디어·노트·자료까지'),
        ('shot_new_ko.png', 'store_shot_ko_3.png', '몇 초면 기록됩니다', '이름만 입력하면 저장 — 세부 정보는 나중에'),
        ('shot_search_ko.png', 'store_shot_ko_4.png', '바로 다시 찾기', '노트와 #태그 검색, 필터·정렬'),
        ('shot_theme_ko.png', 'store_shot_ko_5.png', '테마 12종, 전부 무료', '라이트·다크·파스텔 — 취향대로'),
        ('shot_privacy_ko.png', 'store_shot_ko_6.png', '아이디어는 기기에만 저장', '계정 없음 · 클라우드 없음 — 서버로 보내지 않아요'),
    ],
}

LANG = sys.argv[1] if len(sys.argv) > 1 else 'en'
for src, dst, title, sub in SHOTS[LANG]:
    p = os.path.join(OUT, src)
    if os.path.exists(p):
        frame(p, os.path.join(OUT, dst), title, sub, lang=LANG)
    else:
        print('skip (missing)', src)
