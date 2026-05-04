const NOW_DIRECTIVE = /^\/now(\s|$)/i;

export interface ParsedRemoteMessengerBody {
  /** Text to forward to pi (after stripping `/now` when present). */
  body: string;
  /**
   * User prefixed with `/now`: abort the in-flight agent turn before delivering
   * this message. (This is not the same as Pi's `deliverAs: "steer"`, which only
   * queues user text for the next LLM step after tool calls, without aborting.)
   */
  interrupt: boolean;
}

/**
 * If the remote message begins with `/now` (after leading whitespace), strip it
 * and set {@link ParsedRemoteMessengerBody.interrupt}. Otherwise return the
 * original string unchanged.
 */
export function parseRemoteMessengerBody(raw: string): ParsedRemoteMessengerBody {
  const trimmed = raw.trimStart();
  if (!NOW_DIRECTIVE.test(trimmed)) {
    return { body: raw, interrupt: false };
  }
  let rest = trimmed.replace(NOW_DIRECTIVE, "").trimStart();
  if (rest.length === 0) {
    rest = "(empty message after /now)";
  }
  return { body: rest, interrupt: true };
}
