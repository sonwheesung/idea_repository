import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@/components/dialog';
import { TextField } from '@/components/text-field';
import type { Resource, ResourceInput } from '@/features/resources/api';
import { suggestResourceTitle } from '@/features/resources/url';

interface ResourceDialogProps {
  initial: Resource | null;
  onCancel: () => void;
  /** 에러 문구(i18n 적용 후)를 반환하면 닫지 않는다 */
  onSubmit: (input: ResourceInput) => string | null;
}

/** 관련 자료 추가/수정 다이얼로그 — URL만 필수, 제목은 도메인으로 자동 제안 (PROJECT_SYSTEM §7). 껍데기는 공용 Dialog. */
export function ResourceDialog({ initial, onCancel, onSubmit }: ResourceDialogProps) {
  const { t } = useTranslation();
  const [url, setUrl] = useState(initial?.url ?? '');
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [error, setError] = useState<string | undefined>();

  const suggestion = url.trim() ? suggestResourceTitle(url) : '';

  const submit = () => {
    const err = onSubmit({ url, title: title.trim() || suggestion, description });
    if (err) setError(err);
  };

  return (
    <Dialog
      title={initial ? t('resource.edit') : t('resource.add')}
      onConfirm={submit}
      confirmDisabled={!url.trim()}
      onCancel={onCancel}>
      <TextField
        label={t('resource.url')}
        required
        value={url}
        onChangeText={(v) => {
          setUrl(v);
          if (error) setError(undefined);
        }}
        error={error}
        placeholder="example.com/article"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        autoFocus={!initial}
      />
      <TextField
        label={t('resource.title')}
        value={title}
        onChangeText={setTitle}
        placeholder={suggestion || t('resource.titlePlaceholder')}
      />
      <TextField
        label={t('resource.description')}
        value={description}
        onChangeText={setDescription}
        placeholder={t('resource.descriptionPlaceholder')}
      />
    </Dialog>
  );
}
