import { describe, expect, it } from "vitest";
import { parseRemoteMessengerBody } from "../src/remote-prompt.js";

describe("parseRemoteMessengerBody", () => {
  it("leaves normal text unchanged and does not interrupt", () => {
    expect(parseRemoteMessengerBody("hello")).toEqual({ body: "hello", interrupt: false });
  });

  it("does not treat /nowhere as the directive", () => {
    expect(parseRemoteMessengerBody("/nowhere")).toEqual({
      body: "/nowhere",
      interrupt: false,
    });
  });

  it("strips leading /now and sets interrupt", () => {
    expect(parseRemoteMessengerBody("/now fix this")).toEqual({
      body: "fix this",
      interrupt: true,
    });
  });

  it("accepts /NOW case-insensitively", () => {
    expect(parseRemoteMessengerBody("/NOW urgent")).toEqual({
      body: "urgent",
      interrupt: true,
    });
  });

  it("trims leading whitespace before detecting /now", () => {
    expect(parseRemoteMessengerBody("  \n/now go")).toEqual({ body: "go", interrupt: true });
  });

  it("uses placeholder when only /now is sent", () => {
    expect(parseRemoteMessengerBody("/now")).toEqual({
      body: "(empty message after /now)",
      interrupt: true,
    });
    expect(parseRemoteMessengerBody("/now   ")).toEqual({
      body: "(empty message after /now)",
      interrupt: true,
    });
  });
});
