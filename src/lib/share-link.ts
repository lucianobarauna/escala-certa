export type ShareOutcome = 'native' | 'clipboard' | 'manual' | 'cancelled';

export type ShareParams = {
  title: string;
  text: string;
  url: string;
};

type NativeOutcome = Extract<ShareOutcome, 'native' | 'cancelled'> | null;

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError';
}

async function tryNativeShare(params: ShareParams): Promise<NativeOutcome> {
  try {
    if (typeof navigator.share !== 'function') return null;
    if (typeof navigator.canShare === 'function' && !navigator.canShare(params)) return null;
    await navigator.share(params);
    return 'native';
  } catch (error) {
    return isAbortError(error) ? 'cancelled' : null;
  }
}

async function tryCopy(url: string) {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}

export async function shareLink(params: ShareParams): Promise<ShareOutcome> {
  const nativeOutcome = await tryNativeShare(params);
  if (nativeOutcome) return nativeOutcome;
  return (await tryCopy(params.url)) ? 'clipboard' : 'manual';
}
