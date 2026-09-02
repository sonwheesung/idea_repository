import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { ListGroup, ListRow, type ListRowIcon } from '@/components/list-row';
import { PrivacyOverview } from '@/components/privacy-overview';
import { Screen } from '@/components/screen';
import { APP_VERSION } from '@/lib/app-version';
import { BUSINESS, LINKS } from '@/lib/links';
import { useTheme } from '@/theme/use-theme';

// 정보(About) — 앱 이름·버전·태그라인 · 로컬 저장 안내 · 링크(처리방침·약관·문의·웹사이트) · 판매자 정보.
// 링크·사업자 값은 lib/links.ts 상수(단일 출처 common/BUSINESS_INFO.md), 라벨만 i18n.
// 링크 행은 ListGroup + flat ListRow(docs/UI_GUIDE.md §5.2, 2026-08-23) — 설명 없음(목록 단위 전무).
export default function AboutScreen() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const version = APP_VERSION;
  const ko = i18n.language.startsWith('ko');

  const open = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(t('about.openFailed'));
    }
  };

  const links: { key: string; label: string; url: string; icon: ListRowIcon }[] = [
    { key: 'privacy', label: t('about.privacy'), url: LINKS.privacy, icon: 'shield-checkmark-outline' },
    { key: 'terms', label: t('about.terms'), url: LINKS.terms, icon: 'document-text-outline' },
    { key: 'contact', label: t('about.contact'), url: LINKS.supportMailto, icon: 'mail-outline' },
    { key: 'website', label: t('about.website'), url: LINKS.website, icon: 'globe-outline' },
  ];

  return (
    <Screen hasHeader scroll contentStyle={styles.body}>
      {/* 앱 이름 · 버전 · 태그라인 */}
      <View style={styles.hero}>
        <Text style={[styles.appName, { color: theme.text }]}>{t('common.appName')}</Text>
        <Text style={[styles.version, { color: theme.textMuted }]}>{t('about.version', { version })}</Text>
        <Text style={[styles.tagline, { color: theme.textMuted }]}>{t('about.tagline')}</Text>
      </View>

      {/* 로컬 저장 안내 (CLAUDE.md §6 — 정직한 표현 규칙) */}
      {/* Privacy at a glance — 첫 실행 웰컴 시트와 같은 내용을 여기서 다시 본다 (2026-08-17) */}
      <Card style={styles.card}>
        <PrivacyOverview />
      </Card>

      {/* 링크 */}
      <ListGroup>
        {links.map((link) => (
          <ListRow
            key={link.key}
            variant="flat"
            icon={link.icon}
            title={link.label}
            trailing="external"
            accessibilityRole="link"
            onPress={() => void open(link.url)}
          />
        ))}
        {/* 오픈소스 라이선스 고지 — MIT/Apache 동봉 조건(docs/LEGAL_SYSTEM.md §10). 내부 화면이라 chevron */}
        <ListRow
          variant="flat"
          icon="code-slash-outline"
          title={t('about.licenses')}
          onPress={() => router.push('/licenses')}
        />
      </ListGroup>

      {/* Remove Ads(구매·복원) 행은 Phase 7에서 설정 화면에 추가한다. */}

      {/* 판매자(사업자) 정보 — 유료 디지털 상품 판매자 표시 의무 */}
      <Card style={styles.card}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('about.business.title')}</Text>
        <InfoRow
          label={t('about.business.legalName')}
          value={ko ? BUSINESS.legalNameKo : BUSINESS.legalNameEn}
          sub={
            ko ? `${BUSINESS.legalNameEn} · ${BUSINESS.brand}` : `${BUSINESS.legalNameKo} · ${BUSINESS.brand}`
          }
        />
        <InfoRow
          label={t('about.business.representative')}
          value={ko ? BUSINESS.representativeKo : BUSINESS.representativeEn}
          sub={ko ? BUSINESS.representativeEn : BUSINESS.representativeKo}
        />
        <InfoRow label={t('about.business.registrationNo')} value={BUSINESS.registrationNo} />
        <InfoRow label={t('about.business.ecommerceNo')} value={BUSINESS.ecommerceRegistrationNo} />
        <InfoRow
          label={t('about.business.address')}
          value={ko ? BUSINESS.addressKo : BUSINESS.addressEn}
          sub={ko ? BUSINESS.addressEn : BUSINESS.addressKo}
        />
        <InfoRow label={t('about.business.contact')} value={LINKS.supportEmail} />
      </Card>
    </Screen>
  );
}

function InfoRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  const theme = useTheme();
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: theme.textMuted }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: theme.text }]} selectable>
        {value}
      </Text>
      {sub ? (
        <Text style={[styles.infoSub, { color: theme.textMuted }]} selectable>
          {sub}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: 16, gap: 12, paddingBottom: 32 },
  hero: { alignItems: 'center', gap: 4, paddingVertical: 12 },
  appName: { fontSize: 22, fontWeight: '700' },
  version: { fontSize: 13 },
  tagline: { fontSize: 14, marginTop: 6, textAlign: 'center' },
  card: { gap: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  infoRow: { gap: 2, paddingVertical: 4 },
  infoLabel: { fontSize: 12 },
  infoValue: { fontSize: 15 },
  infoSub: { fontSize: 12 },
});
