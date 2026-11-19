import { useState, type ChangeEvent } from 'react';
import { uploadRules } from '@/data/portal';
import { ApiError, uploadToSignedUrl } from '@/shared/api/mockApi';
import { Button } from '@/shared/ui/Button';
import { Field, Input } from '@/shared/ui/Field';
import ProgressBar from '@/shared/ui/ProgressBar';
import type { UploadBucket, UploadedFile, UploadTarget } from '@/types';

type UploadState =
  | { step: 'idle' }
  | { step: 'uploading'; fileName: string; percent: number }
  | { step: 'done'; file: UploadedFile }
  | { step: 'error'; message: string };

interface FileUploadProps {
  id: string;
  label: string;
  /** Which bucket's limits apply: the bucket checks them, this field shows them. */
  bucket: UploadBucket;
  /** Asks the API for a signed upload URL, e.g. `name => requestFeedbackUploadUrl(reviewId, name)`. */
  requestUrl: (fileName: string) => Promise<UploadTarget>;
  onChange: (file: UploadedFile | null) => void;
  /** True while a file is uploading, so the form can hold its submit button until it finishes. */
  onBusyChange?: (busy: boolean) => void;
  hint?: string;
  invalid?: boolean;
}

/**
 * A file field that uploads as soon as a file is chosen, the way the API's signed-URL flow works:
 * ask for an upload URL, send the file straight to Storage with progress, then hand the result to the form.
 */
export default function FileUpload({ id, label, bucket, requestUrl, onChange, onBusyChange, hint, invalid }: FileUploadProps) {
  const [state, setState] = useState<UploadState>({ step: 'idle' });
  const rules = uploadRules[bucket];

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0];
    onChange(null);
    if (!file) {
      setState({ step: 'idle' });
      return;
    }
    setState({ step: 'uploading', fileName: file.name, percent: 0 });
    onBusyChange?.(true);
    try {
      const target = await requestUrl(file.name);
      const uploaded = await uploadToSignedUrl(target, file, percent => setState({ step: 'uploading', fileName: file.name, percent }));
      setState({ step: 'done', file: uploaded });
      onChange(uploaded);
    } catch (error) {
      // Clear the field so choosing the same file again triggers a new upload.
      input.value = '';
      setState({ step: 'error', message: error instanceof ApiError ? error.message : 'The upload failed. Try again.' });
    } finally {
      onBusyChange?.(false);
    }
  };

  const remove = () => {
    setState({ step: 'idle' });
    onChange(null);
  };

  return (
    <Field label={label} htmlFor={id} hint={hint ?? rules.hint}>
      {state.step === 'done' ? (
        <div className="flex min-h-11 items-center justify-between gap-4 rounded-field border border-line bg-surface px-3 py-2">
          <span className="min-w-0 truncate">{state.file.fileName}</span>
          <Button variant="ghost" className="px-3" onClick={remove}>Remove</Button>
        </div>
      ) : (
        <Input id={id} type="file" accept={rules.accept} onChange={handleChange} disabled={state.step === 'uploading'} aria-invalid={invalid || state.step === 'error' ? true : undefined}/>
      )}
      {state.step === 'uploading' && (
        <div className="grid gap-1.5">
          <ProgressBar value={state.percent} max={100} label={`Uploading ${state.fileName}`}/>
          <p className="text-sm text-muted" aria-live="polite">Uploading {state.fileName}: {state.percent}%</p>
        </div>
      )}
      {state.step === 'done' && <p className="text-sm text-muted" aria-live="polite">Uploaded.</p>}
      {state.step === 'error' && <p className="text-sm text-warn" role="alert">{state.message}</p>}
    </Field>
  );
}
