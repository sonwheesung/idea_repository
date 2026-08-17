# I18N_SYSTEM — 다국어·지역 표기

> 정책은 [`../CLAUDE.md`](../CLAUDE.md) §9. 2026-08-17 기획 확정 — 구현 0%.
> **글로벌 출시가 전제**다 — 기본 언어 English. LinkMemo `docs/I18N_SYSTEM.md` 규약 승계.

## 구현 현황

| 영역 | 상태 |
|---|---|
| i18next · react-i18next · expo-localization 세팅(`lib/i18n.ts`) | ❌ |
| en(기본) · ko 리소스 | ❌ |
| 언어 수동 변경(설정 → 언어: 시스템 따르기 + en + ko) | ❌ |
| 키 검사 스크립트(`check:i18n`) — LinkMemo `scripts/check-i18n.mjs` 이식 | ❌ |
| 날짜 로케일 표기(dayjs + 기기 지역) | ❌ |

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
settings.language / settings.appearance(system·light·dark) / settings.categories / settings.removeAds / settings.restorePurchase / settings.notice / settings.inquiry
ads.* / purchase.*
```

- 네임스페이스 = 도메인. 상태·우선순위 표시명은 **DB 코드값(`in_progress`)과 별개의 키**로 — DB에는 코드만, 화면에는 `t()`.
- ⚠ 성격이 다른 고지 문구는 키를 분리해 재사용을 막는다(조각·LinkMemo 규약) — 데이터 손실 안내(`data.notice.*`)를
  다른 화면 안내와 섞어 쓰지 않는다.
- 보간은 i18next `{{count}}`로, 문자열 이어붙이기 금지. **복수형 접미사(`_one`/`_other`)는 쓰지 않는다**(2026-08-17) —
  Hermes의 `Intl.PluralRules` 지원이 불확실해 형제 앱(조각·LinkMemo)도 안 쓴다. 영어는 `project(s)`식 단일 키.

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
- 가격은 번역 대상이 아니다 — **스토어 가격 정보를 그대로 표시**(CLAUDE.md §7.1). "₩1,500"을 리소스에 넣지 않는다.

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
