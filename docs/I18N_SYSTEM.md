# I18N_SYSTEM — 다국어·지역 표기

> 정책은 [`../CLAUDE.md`](../CLAUDE.md) §9. 2026-08-17 기획 확정 — ~~구현 0%~~ → 구현 현황표 참조(Phase 0·4 완료).
> **글로벌 출시가 전제**다 — 기본 언어 English. LinkMemo `docs/I18N_SYSTEM.md` 규약 승계.

## 구현 현황

| 영역 | 상태 |
|---|---|
| i18next · react-i18next · expo-localization 세팅(`lib/i18n.ts`) | ✅ 2026-08-17 Phase 0 — josa 포매터 추가 2026-08-20 |
| en(기본) · ko 리소스 | ✅ 2026-08-17 — 295키(2026-08-21) |
| 언어 수동 변경(설정 → 언어: 시스템 따르기 + en + ko) | ✅ 2026-08-17 — 설정 행 탭 → OptionSheet |
| 키 검사 스크립트(`check:i18n`) — LinkMemo `scripts/check-i18n.mjs` 이식 | ✅ 2026-08-17 — Phase 4에서 코드 사용 키 검사(④) 추가 |
| 날짜 로케일 표기(dayjs + 기기 지역) | ✅ 2026-08-17 — `lib/date.ts`(`ll`) |

---

## 1. 언어 (기획서 §25)

| 단계 | 언어 | 비고 |
|---|---|---|
| **초기 (MVP)** | **English(기본)** · 한국어 | 폴백은 영어 |
| 이후 후보 | ja · zh · es · fr · de · pt | **유입 국가 데이터로 순서 결정** — 미리 확정하지 않는다. zh는 간체·번체 별개(LinkMemo 실증) |

- 기기 언어 자동 감지, 미지원 언어는 영어 폴백. 설정에서 수동 변경 가능.
- **사용자가 작성하는 프로젝트 내용은 자동 번역하지 않는다**(기획서 §25). 기본 카테고리 7종도 영어 데이터 행이지
  번역 리소스가 아니다(CLAUDE.md §8).

---

## 2. 키 규약

UI 코드에 한국어/영어 문장을 직접 쓰지 않는다. 전 문자열이 번역 리소스를 거친다.

```
common.save / common.cancel / common.delete / common.edit / common.search / common.add / common.reset
project.new / project.name / project.summary / project.description / project.problem / project.goal
project.coreIdea / project.targetUser / project.progress / project.startDate / project.targetEndDate
project.nameRequired / project.deleteConfirm            ({{notes}}·{{resources}} 보간)
status.idea / status.planned / status.inProgress / status.onHold / status.cancelled / status.completed
priority.high / priority.medium / priority.low / priority.none
category.title / category.add / category.duplicate / category.deleteUsed   ({{count}} 보간)
category.deleteOption.clear / category.deleteOption.move
tag.add / tag.placeholder
note.add / note.edit / note.delete / note.placeholder
resource.add / resource.title / resource.url / resource.description / resource.invalidUrl / resource.open
sort.recentlyUpdated / sort.recentlyCreated / sort.name / sort.progress / sort.targetEndDate / sort.priority
filter.status / filter.category / filter.priority / filter.all / filter.empty / search.empty
home.empty.title / home.empty.body                        ← 데이터 손실 안내 포함
data.notice.local / data.notice.loss                      ← 저장 위치·손실 안내 (다른 안내와 키 분리)
settings.language / settings.theme · theme.system · theme.names.<id> / settings.categories / settings.removeAds / settings.restorePurchase / settings.notice / settings.inquiry
ads.* / purchase.*
ideation.* (도구 이름·설명·버튼·질문 카드) / approach.* (발상 방식 6값 표시명) / home.ideaLab   ← 2026-08-18 발상 도구
```

- 발상 도구의 **단어 풀·문장 틀은 JSON 리소스가 아니라 `db/ideation-pool.ts` TS 데이터**(언어별 객체, 2026-08-19 `features/ideation/pool.ts`에서 이동 — DB v3 시드) — `check:i18n` 대상 아님. 두 언어의 그룹 수·순서 동일을 코드에서 assert. 그룹 표시명만 i18n(`ideation.group.*` 16키), 단어 관리 화면 문구는 `ideation.words.*`.

- 네임스페이스 = 도메인. 상태·우선순위 표시명은 **DB 코드값(`in_progress`)과 별개의 키**로 — DB에는 코드만, 화면에는 `t()`.
- ⚠ 성격이 다른 고지 문구는 키를 분리해 재사용을 막는다(조각·LinkMemo 규약) — 데이터 손실 안내(`data.notice.*`)를
  다른 화면 안내와 섞어 쓰지 않는다.
- 보간은 i18next `{{count}}`로, 문자열 이어붙이기 금지. **복수형 접미사(`_one`/`_other`)는 쓰지 않는다**(2026-08-17) —
  Hermes의 `Intl.PluralRules` 지원이 불확실해 형제 앱(조각·LinkMemo)도 안 쓴다. 영어는 `project(s)`식 단일 키.
- **한국어 조사(을/를·이/가…)는 `es-hangul`로 처리한다**(2026-08-20 사용자 지적 "만약에 화면 을/를 안 맞는데" — 라이브러리 도입):
  - `lib/josa.ts` — `koJosa(word, pair)`(단어+조사) · `koJosaPick(word, pair)`(조사만). 마지막 글자가 완성형 한글이
    아니면(영어·숫자·'…') `을(를)` 병기로 폴백 — throw 금지.
  - i18next 포매터 `josa`/`josaPick` 등록(`lib/i18n.ts`). ko 리소스에서 `{{x, josa(pair: 이/가)}}`,
    따옴표 뒤엔 `“{{word}}”{{word, josaPick(pair: 을/를)}}` 형태로 쓴다. en 리소스는 평문 `{{x}}` 그대로.
  - ~~`"{{name}}" 을(를)"` 병기 표기~~ → josaPick으로 정정(project·category·ideation.words의 deleteTitle 3키).
  - 발상 도구 문장 틀(`{X}를` 등 — JSON 아님)은 `features/ideation/template.ts` `fillTemplate`이 `{X}+조사`를
    `koJosa`로 치환(IDEATION_SYSTEM §3.4).
  - `check:i18n` 보간 비교는 **변수명 기준**(포매터 옵션 무시) — `{{x, josa(...)}}` ↔ `{{x}}`는 일치로 본다.

---

## 3. 날짜·숫자 (기획서 §26)

- 시작일·마감일·노트 작성일·카드의 "Updated Aug 14"는 **기기 지역 설정**으로 표기 — dayjs `L`/`ll` 포맷 + locale.

  | 지역 | 예 |
  |---|---|
  | 한국 | `2026.08.14` |
  | 미국 | `08/14/2026` |
  | 일본 | `2026/08/14` |

- 저장은 로케일 무관(`YYYY-MM-DD` / epoch ms — DATABASE.md). 표기만 현지화. 문자열 조합으로 날짜를 만들지 않는다.
- 진행률 `35%`는 숫자 포맷 대상 아님(퍼센트 기호 위치가 언어별로 다르지만 MVP는 `{{n}}%` 고정 — 필요 시 키로).
- 가격은 번역 대상이 아니다 — **스토어 가격 정보를 그대로 표시**(CLAUDE.md §7.1). "₩3,300"을 리소스에 넣지 않는다.

---

## 4. 언어 추가 절차

1. `locales/<lang>.json` 추가(영어 기준으로 전 키 번역)
2. `npm run check:i18n` 통과 — 키 누락·잉여 · 다른 언어 파일에 한글 잔존 · `{{보간}}` 일치
3. dayjs locale import 추가
4. 스토어 등록정보(설명·스크린샷 캡션)도 같은 릴리스에서 함께
5. 이 문서와 `docs/README.md` 구현 현황 갱신

## 5. 주의

- 기계 번역 상태로 출시하는 언어는 릴리스 노트에 ⚠ 검수 전임을 남긴다(LinkMemo ja·zh 선례).
- 기본 카테고리·태그·프로젝트 내용은 사용자 데이터 — 언어를 바꿔도 바뀌지 않는다(의도).
