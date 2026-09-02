import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { OSS_PACKAGES } from '@/lib/oss-packages';
import { useTheme } from '@/theme/use-theme';

// 오픈소스 라이선스 고지 — 설정 → 정보(About) → Open-source licenses (docs/LEGAL_SYSTEM.md §10).
// 🔴 이 화면이 있어야 고지가 성립한다 — MIT/Apache-2.0은 저작권 고지·허가 문구 동봉이 라이선스 조건이다.
// 🚫 패키지명·라이선스명·저작권 줄은 번역하지 않는다(원문 유지가 고지 요건). t()는 인트로뿐.
// ⚠ 목록은 생성 파일(lib/oss-packages.ts — npm run licenses:build). 손으로 고치면 check:licenses가 잡는다.
export default function LicensesScreen() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Screen hasHeader scroll contentStyle={styles.body}>
      <Text style={[styles.intro, { color: theme.textMuted }]}>{t('licenses.intro')}</Text>
      <Card style={styles.card}>
        {OSS_PACKAGES.map((pkg, index) => (
          <View
            key={pkg.name}
            style={index === 0 ? styles.pkgFirst : [styles.pkg, { borderTopColor: theme.border }]}>
            <Text style={[styles.pkgName, { color: theme.text }]}>
              {pkg.name} {pkg.version}
            </Text>
            <Text style={[styles.pkgBody, { color: theme.textMuted }]}>{pkg.license}</Text>
            {/* 저작권 줄이 없는 패키지가 있다(LICENSE 파일 미동봉) — 지어내지 않고 비운다 */}
            {pkg.copyright.length > 0 ? (
              <Text style={[styles.pkgBody, { color: theme.textMuted }]}>{pkg.copyright}</Text>
            ) : null}
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: 16, gap: 12, paddingBottom: 32 },
  intro: { fontSize: 13, lineHeight: 19 },
  card: { gap: 0 },
  pkgFirst: { gap: 2 },
  pkg: { gap: 2, paddingTop: 10, marginTop: 10, borderTopWidth: StyleSheet.hairlineWidth },
  pkgName: { fontSize: 14, fontWeight: '600' },
  pkgBody: { fontSize: 12, lineHeight: 17 },
});
