import {JsonLexer} from "./json-lexer";
import {JsonToken} from "./json-token";

describe("Lexer", () => {
  it("should tokenize an empty string", () => {
    const tokens = JsonLexer.tokenize(""[Symbol.iterator]());

    expect(tokens).toEqual([]);
  });

  it("should tokenize a simple string JSON value", () => {
    const tokens = JsonLexer.tokenize('"foo"'[Symbol.iterator]());

    expect(tokens).toEqual([
      {type: JsonToken.STRING, value: "foo"},
    ]);
  })

  it("should tokenize a simple number JSON value", () => {
    const tokens = JsonLexer.tokenize("42"[Symbol.iterator]());

    expect(tokens).toEqual([
      {type: JsonToken.NUMBER, value: "42"},
    ]);
  });

  it("should tokenize a simple negative number JSON value", () => {
    const tokens = JsonLexer.tokenize("-42"[Symbol.iterator]());

    expect(tokens).toEqual([
      {type: JsonToken.NUMBER, value: "-42"},
    ]);
  });

  it("should tokenize a simple float number JSON value", () => {
    const tokens = JsonLexer.tokenize("-42.001"[Symbol.iterator]());

    expect(tokens).toEqual([
      {type: JsonToken.NUMBER, value: "-42.001"},
    ]);
  });

  it("should throw if a number contains two dot", () => {
    expect(() => JsonLexer.tokenize("-42.001.001"[Symbol.iterator]())).toThrowError("Unexpected character: .");
  });

  it("should tokenize a boolean true JSON value", () => {
    expect(JsonLexer.tokenize("true"[Symbol.iterator]())).toEqual([{
      type: JsonToken.BOOLEAN,
      value: "true",
    }]);
  });

  it("should tokenize a boolean false JSON value", () => {
    expect(JsonLexer.tokenize("false"[Symbol.iterator]())).toEqual([{
      type: JsonToken.BOOLEAN,
      value: "false",
    }]);
  });

  it("should tokenize a null JSON value", () => {
    expect(JsonLexer.tokenize("null"[Symbol.iterator]())).toEqual([{
      type: JsonToken.NULL,
    }]);
  });

  it("should tokenize a whitespace JSON value", () => {
    expect(JsonLexer.tokenize(" "[Symbol.iterator]())).toEqual([{
      type: JsonToken.WHITESPACE,
      value: " ",
    }]);
  });

  it("should tokenize a carriage return JSON value", () => {
    expect(JsonLexer.tokenize("\r"[Symbol.iterator]())).toEqual([{
      type: JsonToken.WHITESPACE,
      value: "\r",
    }]);
  });

  it("should tokenize a tab JSON value", () => {
    expect(JsonLexer.tokenize("\t"[Symbol.iterator]())).toEqual([{
      type: JsonToken.WHITESPACE,
      value: "\t",
    }]);
  });

  it("should tokenize a new line JSON value", () => {
    expect(JsonLexer.tokenize("\n"[Symbol.iterator]())).toEqual([{
      type: JsonToken.WHITESPACE,
      value: "\n",
    }]);
  });

  it("should tokenize a colon JSON value", () => {
    expect(JsonLexer.tokenize(":"[Symbol.iterator]())).toEqual([{
      type: JsonToken.COLON,
    }]);
  });

  it("should tokenize a comma JSON value", () => {
    expect(JsonLexer.tokenize(","[Symbol.iterator]())).toEqual([{
      type: JsonToken.COMMA,
    }]);
  });

  it("should tokenize an empty JSON object", () => {
    const tokens = JsonLexer.tokenize("{}"[Symbol.iterator]());

    expect(tokens).toEqual([
      {type: JsonToken.OPEN_BRACE},
      {type: JsonToken.CLOSE_BRACE},
    ]);
  });

  it("should tokenize a simple JSON object", () => {
    const tokens = JsonLexer.tokenize('{"foo": "bar"}'[Symbol.iterator]());

    expect(tokens).toEqual([
      {type: JsonToken.OPEN_BRACE},
      {type: JsonToken.STRING, value: "foo"},
      {type: JsonToken.COLON},
      {type: JsonToken.WHITESPACE, value: " "},
      {type: JsonToken.STRING, value: "bar"},
      {type: JsonToken.CLOSE_BRACE},
    ]);
  });

  it("should tokenize a JSON object with two members", () => {
    const tokens = JsonLexer.tokenize('{"foo": "bar", "baz": 42}'[Symbol.iterator]());

    expect(tokens).toEqual([
      {type: JsonToken.OPEN_BRACE},
      {type: JsonToken.STRING, value: "foo"},
      {type: JsonToken.COLON},
      {type: JsonToken.WHITESPACE, value: " "},
      {type: JsonToken.STRING, value: "bar"},
      {type: JsonToken.COMMA},
      {type: JsonToken.WHITESPACE, value: " "},
      {type: JsonToken.STRING, value: "baz"},
      {type: JsonToken.COLON},
      {type: JsonToken.WHITESPACE, value: " "},
      {type: JsonToken.NUMBER, value: "42"},
      {type: JsonToken.CLOSE_BRACE},
    ]);
  });

  it("should tokenize an empty JSON array", () => {
    const tokens = JsonLexer.tokenize("[]"[Symbol.iterator]());

    expect(tokens).toEqual([
      {type: JsonToken.OPEN_BRACKET},
      {type: JsonToken.CLOSE_BRACKET},
    ]);
  });

  it("should tokenize a simple JSON array", () => {
    const tokens = JsonLexer.tokenize('["foo", "bar"]'[Symbol.iterator]());

    expect(tokens).toEqual([
      {type: JsonToken.OPEN_BRACKET},
      {type: JsonToken.STRING, value: "foo"},
      {type: JsonToken.COMMA},
      {type: JsonToken.WHITESPACE, value: " "},
      {type: JsonToken.STRING, value: "bar"},
      {type: JsonToken.CLOSE_BRACKET},
    ]);
  });

});

