import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility function", () => {
  it("should concatenate basic strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should ignore empty strings (but preserve strings with only spaces)", () => {
    expect(cn("foo", "", "bar")).toBe("foo bar");
    expect(cn("foo", " ", "bar")).toBe("foo   bar");
  });

  it("should handle falsy values correctly (null, undefined, false, 0)", () => {
    expect(cn("foo", null, "bar", undefined, false, 0, "baz")).toBe(
      "foo bar baz"
    );
  });

  it("should handle numbers as class names (if non-zero)", () => {
    expect(cn(1, "foo", 23)).toBe("1 foo 23");
    expect(cn(0, "foo", 1)).toBe("foo 1");
  });

  it("should handle objects with conditional classes", () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
    expect(cn("a", { foo: true, bar: false }, "b")).toBe("a foo b");
    expect(cn({ foo: 1, bar: 0, baz: "hello" })).toBe("foo baz");
  });

  it("should handle arrays of class values", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
    expect(cn("a", ["foo", "bar"], "b")).toBe("a foo bar b");
  });

  it("should handle nested arrays", () => {
    expect(cn(["foo", ["bar", ["baz"]]])).toBe("foo bar baz");
    expect(cn("a", ["b", null, ["c", { d: true, e: false }]], "f")).toBe(
      "a b c d f"
    );
  });

  it("should handle mixed types including objects and arrays", () => {
    expect(
      cn(
        "a",
        { b: true, c: false },
        ["d", undefined, { e: true, f: 0 }],
        "g",
        123
      )
    ).toBe("a b d e g 123");
  });

  it("should de-duplicate identical class strings", () => {
    expect(cn("foo", "bar", "foo")).toBe("foo bar");
    expect(cn({ foo: true }, "foo", { foo: true })).toBe("foo");
    expect(cn("foo", "bar", "foo", { foo: true, bar: true })).toBe("foo bar");
  });

  it("should return an empty string for no arguments or all falsy/empty arguments", () => {
    expect(cn()).toBe("");
    expect(cn(null, undefined, false, 0)).toBe("");
    expect(cn({})).toBe("");
    expect(cn([])).toBe("");
    expect(cn([null, {}, [false]])).toBe("");
  });

  it("should handle classes with hyphens from object keys", () => {
    expect(cn({ "foo-bar": true, "baz-qux": false })).toBe("foo-bar");
  });

  it("should preserve leading/trailing spaces on individual string segments as per implementation", () => {
    expect(cn(" foo", "bar ")).toBe(" foo bar ");
    expect(cn("  leading", "trailing  ", "  both  ")).toBe(
      "  leading trailing     both  "
    );
  });

  it("should handle complex nested structures with various types", () => {
    const dynamicCondition = true;
    const anotherCondition = false;
    expect(
      cn(
        "base-class",
        dynamicCondition && "conditional-class-1",
        anotherCondition && "conditional-class-2",
        {
          "object-class-active": dynamicCondition,
          "object-class-inactive": anotherCondition,
          "numeric-key": 1,
        },
        [
          "array-class-1",
          null,
          dynamicCondition && [
            "nested-array-conditional",
            { "deep-nested-obj": true, another: 0 },
          ],
        ],
        0,
        42
      )
    ).toBe(
      "base-class conditional-class-1 object-class-active numeric-key array-class-1 nested-array-conditional deep-nested-obj 42"
    );
  });
});
