export interface PollOptions {
  intervalMs: number;
  timeoutMs: number;
}

export async function pollUntilDone<T>(
  fetch: () => Promise<T>,
  isDone: (result: T) => boolean,
  options: PollOptions
): Promise<T> {
  const deadline = Date.now() + options.timeoutMs;

  for (;;) {
    const result = await fetch();
    if (isDone(result)) return result;

    if (Date.now() >= deadline) {
      throw new Error(`Polling timed out after ${options.timeoutMs}ms`);
    }

    await sleep(options.intervalMs);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
