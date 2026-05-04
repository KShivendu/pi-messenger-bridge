import { describe, expect, it } from "vitest";
import { parseRemoteMessengerBody } from "../src/remote-prompt.js";

describe("parseRemoteMessengerBody", () => {
  it("leaves normal text unchanged and does not steer", () => {
    expect(parseRemoteMessengerBody("hello")).toEqual({ body: "hello", steer: false });
  });

  it("does not treat /nowhere as the directive", () => {
    expect(parseRemoteMessengerBody("/nowhere")).toEqual({ body: "/nowhere", steer: false });
  });

  it("strips leading /now and sets steer", () => {
    expect(parseRemoteMessengerBody("/now fix this")).toEqual({
      body: "fix this",
      steer: true,
    });
  });

  it("accepts /NOW case-insensitively", () => {
    expect(parseRemoteMessengerBody("/NOW urgent")).toEqual({
      body: "urgent",
      steer: true,
    });
  });

  it("trims leading whitespace before detecting /now", () => {
    expect(parseRemoteMessengerBody("  \n/now go")).toEqual({ body: "go", steer: true });
  });

  it("uses placeholder when only /now is sent", () => {
    expect(parseRemoteMessengerBody("/now")).toEqual({
      body: "(empty message after /now)",
      steer: true,
    });
    expect(parseRemoteMessengerBody("/now   ")).toEqual({
      body: "(empty message after /now)",
      steer: true,
    });
  });
});
