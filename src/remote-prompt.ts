const INTERRUPT_RE = /^\/(?:now|abort)(\s|$)/i;
const STEER_RE = /^\/steer(\s|$)/i;

/** How a messenger line should be delivered when pi is busy. */
export type RemoteDeliveryMode = "queue" | "steer" | "interrupt";

export interface ParsedRemoteMessengerBody {
  /** Text to forward to pi (prefix stripped when a mode keyword was used). */
  body: string;
  mode: RemoteDeliveryMode;
}

function stripDirective(
  trimmed: string,
  re: RegExp,
  mode: "interrupt" | "steer",
  emptyLabel: string
): ParsedRemoteMessengerBody {
  const rest = trimmed.replace(re, "").trimStart();
  return { body: rest.length > 0 ? rest : emptyLabel, mode };
}

/**
 * Detects an optional leading directive (after whitespace):
 *
 * - **`/now` or `/abort`** — interrupt: caller should abort the run, then send.
 * - **`/steer`** — Pi `deliverAs: "steer"`: queue for the next LLM step after tools.
 * - **otherwise** — queue (`followUp`) when pi is busy (default).
 */
export function parseRemoteMessengerBody(raw: string): ParsedRemoteMessengerBody {
  const trimmed = raw.trimStart();
  if (INTERRUPT_RE.test(trimmed)) {
    return stripDirective(trimmed, INTERRUPT_RE, "interrupt", "(empty message after /now or /abort)");
  }
  if (STEER_RE.test(trimmed)) {
    return stripDirective(trimmed, STEER_RE, "steer", "(empty message after /steer)");
  }
  return { body: raw, mode: "queue" };
}
