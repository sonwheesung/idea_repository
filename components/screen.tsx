import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useKeyboard } from '@/hooks/use-keyboard';
import { useTheme } from '@/theme/use-theme';

interface ScreenProps {
  children: ReactNode;
  /**
   * 스택 헤더가 있는 화면은 상단 인셋을 헤더가 이미 먹으므로 상단만 뺀다.
   * 하단(제스처 바·홈 인디케이터)은 **모든 화면**에서 Screen이 처리한다 — 2026-08-17 실기기 지적:
   * 헤더 화면에 edges=[]를 주면 저장 버튼·목록 마지막 행이 제스처 바 밑으로 들어갔다.
   */
  hasHeader?: boolean;
  /** true면 Screen이 ScrollView를 소유하고 키보드 가림을 처리한다(폼 화면). 목록(FlatList) 화면은 false */
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  /** 하단 고정 영역 — 배너 자리(메인·상세). 키보드가 올라오면 숨긴다(입력창 위를 광고가 덮으면 최악) */
  footer?: ReactNode;
}

/** 포커스된 입력창과 키보드 사이에 남길 여유 */
const FOCUS_MARGIN = 16;

/**
 * 모든 화면의 바깥 틀 — **화면에서 SafeAreaView·(폼의) ScrollView를 직접 쓰지 않는다.**
 * 세이프에어리어와 키보드 가림을 여기 한 곳에서 처리한다(조각 `components/Screen.tsx` 승계 —
 * 2026-08-17 실기기: 태그 입력이 키보드에 가려지는 문제로 도입).
 */
export function Screen({ children, hasHeader = false, scroll = false, contentStyle, footer }: ScreenProps) {
  const theme = useTheme();
  const keyboard = useKeyboard();
  const rootRef = useRef<View>(null);
  const scrollRef = useRef<ScrollView>(null);
  const scrollOffsetRef = useRef(0);
  const [overlap, setOverlap] = useState(0);

  const edges: Edge[] = hasHeader ? ['bottom', 'left', 'right'] : ['top', 'bottom', 'left', 'right'];

  /*
   * 키보드에 가려지는 높이만큼 스크롤 영역을 **줄인다**(아래 여백을 더하는 게 아니다).
   * 여백만 더하면 손으로 스크롤해야 닿는다. 영역 자체가 짧아지면 안드로이드 ScrollView가
   * 크기 변화에 맞춰 포커스된 입력창을 보이는 데까지 스스로 스크롤해 준다.
   * 창이 이미 줄어드는 기기(adjustResize가 먹는 경우)에서는 겹침이 0으로 계산되어 아무 일도
   * 하지 않는다 — 두 경우를 코드로 나누지 않고 실제로 재서 판단한다.
   */
  useEffect(() => {
    if (keyboard.height === 0) {
      setOverlap(0);
      return;
    }
    const measure = () => {
      rootRef.current?.measureInWindow((_x, y, _width, height) => {
        setOverlap(Math.max(0, y + height - keyboard.screenY));
      });
    };
    // 두 번 잰다. 창이 줄어드는 기기는 레이아웃이 끝난 뒤라야 값이 맞고,
    // 키보드가 뜬 뒤 제안 줄·툴바가 붙어 높이가 한 번 더 커지는 경우가 있다(Gboard).
    const early = setTimeout(measure, 60);
    const late = setTimeout(measure, 350);
    return () => {
      clearTimeout(early);
      clearTimeout(late);
    };
  }, [keyboard.height, keyboard.screenY]);

  // 스크롤 화면의 iOS는 automaticallyAdjustKeyboardInsets가 같은 일을 하므로 여기서 또 줄이면 두 번 밀린다.
  const scrollOverlap = Platform.OS === 'android' ? overlap : 0;

  // 영역을 줄여도 안 올라오는 경우를 대비한 보완책. 이미 올라왔으면 겹침이 없어 그냥 지나간다.
  useEffect(() => {
    if (scrollOverlap === 0 || !scroll) return;
    const timer = setTimeout(() => {
      const focused = TextInput.State.currentlyFocusedInput();
      if (focused === null) return;
      focused.measureInWindow((_x, y, _width, height) => {
        const hidden = y + height + FOCUS_MARGIN - keyboard.screenY;
        if (hidden > 0) scrollRef.current?.scrollTo({ y: scrollOffsetRef.current + hidden, animated: true });
      });
    }, 180);
    return () => clearTimeout(timer);
  }, [scrollOverlap, keyboard.screenY, scroll]);

  return (
    <SafeAreaView ref={rootRef} edges={edges} style={[styles.safe, { backgroundColor: theme.background }]}>
      {scroll ? (
        <ScrollView
          ref={scrollRef}
          style={[styles.flex, { marginBottom: scrollOverlap }]}
          contentContainerStyle={contentStyle}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
          onScroll={(e) => {
            scrollOffsetRef.current = e.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
          // iOS는 이 옵션만으로 포커스된 입력창을 키보드 위로 밀어준다.
          automaticallyAdjustKeyboardInsets>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, contentStyle, { marginBottom: overlap }]}>{children}</View>
      )}
      {footer !== undefined && keyboard.height === 0 ? footer : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
});
