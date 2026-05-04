import { describe, expect, it } from "vitest";
import { parseRemoteMessengerBody } from "../src/remote-prompt.js";

describe("parseRemoteMessengerBody", () => {
  it("default queue: leaves normal text unchanged", () => {
    expect(parseRemoteMessengerBody("hello")).toEqual({ body: "hello", mode: "queue" });
  });

  it("queue: does not treat /nowhere as interrupt", () => {
    expect(parseRemoteMessengerBody("/nowhere")).toEqual({ body: "/nowhere", mode: "queue" });
  });

  it("queue: does not treat /steering as steer", () => {
    expect(parseRemoteMessengerBody("/steering x")).toEqual({ body: "/steering x", mode: "queue" });
  });

  it("interrupt: /now strips prefix", () => {
    expect(parseRemoteMessengerBody("/now fix this")).toEqual({
      body: "fix this",
      mode: "interrupt",
    });
  });

  it("interrupt: /abort strips prefix", () => {
    expect(parseRemoteMessengerBody("/abort stop")).toEqual({
      body: "stop",
      mode: "interrupt",
    });
  });

  it("interrupt: /NOW case-insensitive", () => {
    expect(parseRemoteMessengerBody("/NOW urgent")).toEqual({
      body: "urgent",
      mode: "interrupt",
    });
  });

  it("interrupt: trims leading whitespace before directive", () => {
    expect(parseRemoteMessengerBody("  \n/now go")).toEqual({ body: "go", mode: "interrupt" });
  });

  it("interrupt: empty after /now", () => {
    expect(parseRemoteMessengerBody("/now")).toEqual({
      body: "(empty message after /now or /abort)",
      mode: "interrupt",
    });
    expect(parseRemoteMessengerBody("/now   ")).toEqual({
      body: "(empty message after /now or /abort)",
      mode: "interrupt",
    });
  });

  it("steer: strips /steer prefix", () => {
    expect(parseRemoteMessengerBody("/steer hint")).toEqual({
      body: "hint",
      mode: "steer",
    });
  });

  it("steer: /STEER case-insensitive", () => {
    expect(parseRemoteMessengerBody("/STEER ok")).toEqual({ body: "ok", mode: "steer" });
  });

  it("steer: empty after /steer", () => {
    expect(parseRemoteMessengerBody("/steer")).toEqual({
      body: "(empty message after /steer)",
      mode: "steer",
    });
  });

  it("lines starting with /now are interrupt (body may still mention /steer)", () => {
    expect(parseRemoteMessengerBody("/now /steer x")).toEqual({
      body: "/steer x",
      mode: "interrupt",
    });
  });
});
