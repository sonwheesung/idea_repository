// 외부 링크·사업자 정보 상수 — 단일 출처는 `C:\project\common\BUSINESS_INFO.md`(커밋 금지 파일).
// 값이 바뀌면 이 파일과 docs/STORE_LISTING.md·처리방침을 함께 갱신한다.
// 고유명사·번호이므로 i18n 리소스가 아니라 코드 상수다(라벨만 i18n — app/about.tsx).

export const LINKS = {
  privacy: 'https://vivace-games.com/idearepository/privacy',
  terms: 'https://vivace-games.com/idearepository/terms',
  website: 'https://vivace-games.com',
  supportEmail: 'support@vivace-games.com',
  supportMailto: 'mailto:support@vivace-games.com',
} as const;

/** 판매자(사업자) 정보 — 유료 디지털 상품(Remove Ads) 판매자 표시 의무(전자상거래법) */
export const BUSINESS = {
  /** 법적 상호(국문) */
  legalNameKo: '휘성게임즈',
  /** 법적 상호(영문) */
  legalNameEn: 'Hwiseong Games',
  /** 공개 개발자명(브랜드) */
  brand: 'Vivace Games Studio',
  /** 대표자 */
  representativeKo: '손휘성',
  representativeEn: 'Son Hwi-seong',
  /** 사업자등록번호 */
  registrationNo: '749-25-02260',
  /** 통신판매업 신고번호 */
  ecommerceRegistrationNo: '제2026-울산중구-0170호',
  /** 사업장 주소 */
  addressKo: '울산광역시 중구 성안 5길 22, 2층 204호(성안동), 44421',
  addressEn: '204, 2F, 22 Seongan 5-gil, Jung-gu, Ulsan, 44421, Republic of Korea',
} as const;
