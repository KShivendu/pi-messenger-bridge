const NOW_DIRECTIVE = /^\/now(\s|$)/i;

export interface ParsedRemoteMessengerBody {
  /** Text to forward to pi (after stripping `/now` when present). */
  body: string;
  /** User asked to steer (interrupt current run) instead of queueing. */
  steer: boolean;
}

/**
 * If the remote message begins with `/now` (after leading whitespace), strip it
 * and mark the message for Pi `sendUserMessage(..., { deliverAs: "steer" })`.
 * Otherwise return the
 * original string unchanged for queue-as-follow-up when pi is busy.
 */
export function parseRemoteMessengerBody(raw: string): ParsedRemoteMessengerBody {
  const trimmed = raw.trimStart();
  if (!NOW_DIRECTIVE.test(trimmed)) {
    return { body: raw, steer: false };
  }
  let rest = trimmed.replace(NOW_DIRECTIVE, "").trimStart();
  if (rest.length === 0) {
    rest = "(empty message after /now)";
  }
  return { body: rest, steer: true };
}
