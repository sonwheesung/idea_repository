import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { BUSINESS, LINKS } from '@/lib/links';
import { useTheme } from '@/theme/use-theme';

// 정보(About) — 앱 이름·버전·태그라인 · 로컬 저장 안내 · 링크(처리방침·약관·문의·웹사이트) · 판매자 정보.
// 링크·사업자 값은 lib/links.ts 상수(단일 출처 common/BUSINESS_INFO.md), 라벨만 i18n.
export default function AboutScreen() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const version = Constants.expoConfig?.version ?? '0.0.0';
  const ko = i18n.language.startsWith('ko');

  const open = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(t('about.openFailed'));
    }
  };

  const links: { key: string; label: string; url: string; icon: keyof typeof Ionicons.glyphMap }[] = [
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
      <Card style={styles.card}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('about.dataTitle')}</Text>
        <Text style={[styles.bodyText, { color: theme.textMuted }]}>{t('data.notice.local')}</Text>
        <Text style={[styles.bodyText, { color: theme.textMuted }]}>{t('data.notice.loss')}</Text>
      </Card>

      {/* 링크 */}
      <Card style={styles.linkCard}>
        {links.map((link, index) => (
          <Pressable
            key={link.key}
            onPress={() => open(link.url)}
            accessibilityRole="link"
            style={({ pressed }) => [
              styles.linkRow,
              index > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.border },
              { opacity: pressed ? 0.7 : 1 },
            ]}>
            <Ionicons name={link.icon} size={18} color={theme.icon} />
            <Text style={[styles.linkLabel, { color: theme.text }]}>{link.label}</Text>
            <Ionicons name="open-outline" size={16} color={theme.textMuted} />
          </Pressable>
        ))}
      </Card>

      {/* Remove Ads(구매·복원) 행은 Phase 7에서, 공지·문의 행은 Phase 5에서 여기(또는 설정)에 추가한다. */}

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
  body: { padding: 16, gap: 18, paddingBottom: 32 },
  hero: { alignItems: 'center', gap: 4, paddingVertical: 12 },
  appName: { fontSize: 22, fontWeight: '700' },
  version: { fontSize: 13 },
  tagline: { fontSize: 14, marginTop: 6, textAlign: 'center' },
  card: { gap: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  bodyText: { fontSize: 14, lineHeight: 20 },
  linkCard: { padding: 0, gap: 0 },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  linkLabel: { flex: 1, fontSize: 16 },
  infoRow: { gap: 2, paddingVertical: 4 },
  infoLabel: { fontSize: 12 },
  infoValue: { fontSize: 15 },
  infoSub: { fontSize: 12 },
});
