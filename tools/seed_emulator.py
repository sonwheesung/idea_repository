# 에뮬레이터 앱 DB에 스크린샷용 샘플 데이터 삽입 (dev 전용 — 배포 산출물과 무관)
# 사용: python tools/seed_emulator.py [emulator-5572] [en|ko]  — ko는 한국어 스토어 스크린샷용(2026-09-02, STORE_LISTING §7.1)
# 기본 serial = emulator-5572 (Idea Repository 배정 포트 — common/DEV_ALLOCATION.md §3. 2026-09-08 프로젝트별 AVD 정책)
import os
import subprocess
import sys
import time
import uuid

SERIAL = sys.argv[1] if len(sys.argv) > 1 else 'emulator-5572'
LANG = sys.argv[2] if len(sys.argv) > 2 else 'en'
PKG = 'com.vivacegames.idearepository'
ADB = os.path.join(os.environ.get('LOCALAPPDATA', ''), 'Android', 'Sdk', 'platform-tools', 'adb.exe')
DB = 'files/SQLite/idearepository.db'
now = int(time.time() * 1000)
day = 86400000


def u():
    return str(uuid.uuid4())


def q(s):
    return "'" + s.replace("'", "''") + "'"


# 카테고리 id는 시드된 이름으로 조회
projects = [
    dict(name='AI Game Balancer', summary='Analyze match data to spot balance problems before players do',
         description='A desktop + mobile companion that ingests match logs and flags overpowered units, maps and item combos.',
         category='Game', tags=['AI', 'Game', 'Analytics'], status='in_progress', progress=35, priority='high',
         problem='Balancing a competitive game by gut feeling is slow and biased. Data sits in logs nobody reads.',
         goal='Ship a v1 that surfaces the top 5 balance outliers per patch, with evidence.',
         core_idea='Cluster matches by composition, compute win-rate deltas, and explain them in plain language.',
         target_user='Indie and mid-size studios shipping live competitive games.',
         start='2026-08-01', end='2026-12-31', updated=now - 1 * 3600000,
         notes=[('MVP will not use an LLM — plain stats first, explanations later.', now - 3 * day),
                ('Add a "confidence" badge so designers know when the sample is too small.', now - 1 * day)],
         resources=[('Google Trends', 'https://trends.google.com', 'Market research'),
                    ('Balance talk (GDC)', 'https://www.gdcvault.com', 'Reference talk on live balancing')]),
    dict(name='Habit Tracker', summary='A tiny app that makes daily habits hard to forget',
         description=None, category='App', tags=['Mobile', 'Health'], status='planned', progress=20, priority='medium',
         problem='Most habit apps are bloated; users churn in a week.', goal='One-tap check-in, zero setup.',
         core_idea='Widget-first design. The app is optional; the widget is the product.', target_user='People building 1–3 habits at a time.',
         start='2026-09-01', end=None, updated=now - 5 * 3600000,
         notes=[('Look at how streaks are shown in Duolingo — do less.', now - 2 * day)],
         resources=[]),
    dict(name='Idea Marketplace', summary='A place to sell ideas you will never build',
         description=None, category='Web', tags=['SaaS', 'Marketplace'], status='idea', progress=10, priority='low',
         problem='Good ideas die in notebooks.', goal=None, core_idea=None, target_user='Makers with more ideas than time.',
         start=None, end=None, updated=now - 1 * day,
         notes=[], resources=[]),
    dict(name='Reading Log & Reviews', summary='Keep book notes and reviews in one place',
         description=None, category='Content', tags=['Books'], status='idea', progress=0, priority='none',
         problem=None, goal=None, core_idea=None, target_user=None, start=None, end=None, updated=now - 2 * day,
         notes=[], resources=[]),
    dict(name='Local Bakery Website', summary='Simple site with menu, hours and pre-orders',
         description=None, category='Business', tags=['Web', 'Client'], status='completed', progress=100, priority='none',
         problem=None, goal='Launch before the summer season.', core_idea=None, target_user='A neighborhood bakery.',
         start='2026-05-10', end='2026-06-30', updated=now - 6 * day,
         notes=[('Delivered. Client wants online payments next — separate project.', now - 6 * day)],
         resources=[('Vercel', 'https://vercel.com', 'Hosting')]),
]

projects_ko = [  # EN 데이터의 한국어판 — 카테고리명은 시드 그대로 영어(§8: 기본 카테고리 = 영어 데이터 행)
    dict(name='AI 게임 밸런서', summary='매치 데이터를 분석해 밸런스 문제를 유저보다 먼저 찾아내기',
         description='매치 로그를 읽어 과성능 유닛·맵·아이템 조합을 짚어 주는 데스크톱 + 모바일 컴패니언.',
         category='Game', tags=['AI', '게임', '데이터분석'], status='in_progress', progress=35, priority='high',
         problem='감으로 하는 대전 게임 밸런싱은 느리고 편향된다. 데이터는 아무도 안 읽는 로그에 잠들어 있다.',
         goal='패치마다 상위 5개 밸런스 이상치를 근거와 함께 보여주는 v1 출시.',
         core_idea='조합별로 매치를 묶어 승률 차이를 계산하고, 쉬운 말로 설명해 준다.',
         target_user='라이브 대전 게임을 운영하는 인디·중소 스튜디오.',
         start='2026-08-01', end='2026-12-31', updated=now - 1 * 3600000,
         notes=[('MVP에는 LLM을 쓰지 않는다 — 통계 먼저, 설명은 나중에.', now - 3 * day),
                ('표본이 작을 때를 알 수 있게 "신뢰도" 배지를 붙이자.', now - 1 * day)],
         resources=[('Google Trends', 'https://trends.google.com', '시장 조사'),
                    ('밸런싱 강연 (GDC)', 'https://www.gdcvault.com', '라이브 밸런싱 참고 강연')]),
    dict(name='습관 트래커', summary='매일 습관을 잊기 어렵게 만드는 아주 작은 앱',
         description=None, category='App', tags=['모바일', '건강'], status='planned', progress=20, priority='medium',
         problem='습관 앱 대부분이 무겁다. 사용자는 일주일이면 떠난다.', goal='설정 없는 원탭 체크인.',
         core_idea='위젯 우선 설계. 앱은 옵션이고 위젯이 곧 제품이다.', target_user='한 번에 습관 1~3개를 만드는 사람.',
         start='2026-09-01', end=None, updated=now - 5 * 3600000,
         notes=[('Duolingo의 스트릭 표현을 보되 — 더 덜어내자.', now - 2 * day)],
         resources=[]),
    dict(name='아이디어 마켓', summary='끝내 만들지 못할 아이디어를 파는 곳',
         description=None, category='Web', tags=['SaaS', '마켓플레이스'], status='idea', progress=10, priority='low',
         problem='좋은 아이디어가 노트 속에서 죽는다.', goal=None, core_idea=None, target_user='시간보다 아이디어가 많은 메이커.',
         start=None, end=None, updated=now - 1 * day,
         notes=[], resources=[]),
    dict(name='독서 기록 & 리뷰', summary='책 메모와 리뷰를 한곳에 모으기',
         description=None, category='Content', tags=['책'], status='idea', progress=0, priority='none',
         problem=None, goal=None, core_idea=None, target_user=None, start=None, end=None, updated=now - 2 * day,
         notes=[], resources=[]),
    dict(name='동네 빵집 웹사이트', summary='메뉴·영업시간·예약 주문이 있는 간단한 사이트',
         description=None, category='Business', tags=['웹', '외주'], status='completed', progress=100, priority='none',
         problem=None, goal='여름 시즌 전에 오픈하기.', core_idea=None, target_user='동네 빵집 사장님.',
         start='2026-05-10', end='2026-06-30', updated=now - 6 * day,
         notes=[('납품 완료. 다음엔 온라인 결제를 원하심 — 별도 프로젝트로.', now - 6 * day)],
         resources=[('Vercel', 'https://vercel.com', '호스팅')]),
]

if LANG == 'ko':
    projects = projects_ko

sql = ['PRAGMA foreign_keys = ON;', 'BEGIN;']
for p in projects:
    pid = u()
    sql.append(
        "INSERT INTO projects (id,name,summary,description,category_id,problem,goal,core_idea,target_user,progress,status,priority,start_date,target_end_date,created_at,updated_at) VALUES ("
        + ','.join([q(pid), q(p['name']), q(p['summary']) if p['summary'] else 'NULL', q(p['description']) if p['description'] else 'NULL',
                    f"(SELECT id FROM categories WHERE name = {q(p['category'])})",
                    q(p['problem']) if p['problem'] else 'NULL', q(p['goal']) if p['goal'] else 'NULL',
                    q(p['core_idea']) if p['core_idea'] else 'NULL', q(p['target_user']) if p['target_user'] else 'NULL',
                    str(p['progress']), q(p['status']), q(p['priority']),
                    q(p['start']) if p['start'] else 'NULL', q(p['end']) if p['end'] else 'NULL',
                    str(p['updated'] - 7 * day), str(p['updated'])]) + ');')
    for t in p['tags']:
        tid = u()
        sql.append(f"INSERT OR IGNORE INTO tags (id,name,created_at) VALUES ({q(tid)},{q(t)},{now});")
        sql.append(f"INSERT OR IGNORE INTO project_tags (project_id,tag_id) VALUES ({q(pid)},(SELECT id FROM tags WHERE name = {q(t)} COLLATE NOCASE));")
    for content, at in p['notes']:
        sql.append(f"INSERT INTO notes (id,project_id,content,created_at,updated_at) VALUES ({q(u())},{q(pid)},{q(content)},{at},{at});")
    for title, url, desc in p['resources']:
        sql.append(f"INSERT INTO resources (id,project_id,title,url,description,created_at,updated_at) VALUES ({q(u())},{q(pid)},{q(title)},{q(url)},{q(desc)},{now},{now});")
sql.append('COMMIT;')

script = '\n'.join(sql)
local = os.path.join(os.path.dirname(os.path.abspath(__file__)), '_seed.sql')
with open(local, 'w', encoding='utf-8') as f:
    f.write(script)
subprocess.run([ADB, '-s', SERIAL, 'push', local, '/data/local/tmp/seed.sql'], check=True)
subprocess.run([ADB, '-s', SERIAL, 'shell', f'run-as {PKG} sh -c "cat /data/local/tmp/seed.sql | sqlite3 {DB}"'], check=True)
out = subprocess.run([ADB, '-s', SERIAL, 'shell', f'run-as {PKG} sqlite3 {DB} "SELECT count(*) FROM projects; SELECT count(*) FROM notes; SELECT count(*) FROM tags;"'],
                     capture_output=True, text=True)
print('projects/notes/tags:', out.stdout.replace('\n', ' '), out.stderr)
os.remove(local)
