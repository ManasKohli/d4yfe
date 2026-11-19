import { useCallback, useEffect, useEffectEvent, useState } from 'react';

type AsyncState<T> = { key: string; base: string; data?: T; error?: unknown };

/**
 * Loads data for `key` and reloads when `key` changes or `reload()` is called.
 * `loading` is true until the result for the current key (and reload) arrives; stale results are dropped.
 * During a reload of the same key, the previous data stays visible so the page doesn't blank out.
 */
export default function useAsync<T>(key: string, load: () => Promise<T>) {
  const [version, setVersion] = useState(0);
  const [state, setState] = useState<AsyncState<T>>({ key: '', base: '' });
  const run = useEffectEvent(load);
  const stateKey = `${key}#${version}`;

  useEffect(() => {
    let live = true;
    run().then(
      data => { if (live) setState({ key: stateKey, base: key, data }); },
      (error: unknown) => { if (live) setState({ key: stateKey, base: key, error }); },
    );
    return () => { live = false; };
  }, [stateKey, key]);

  const reload = useCallback(() => setVersion(current => current + 1), []);
  const current = state.key === stateKey;
  return { data: state.base === key ? state.data : undefined, error: current ? state.error : undefined, loading: !current, reload };
}
