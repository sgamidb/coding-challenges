import {Readable, Stream} from "stream";
import {analyseStream} from "../src/lib";

describe('lib', () => {
  let stream: Readable;

  it('should return the number of bytes in stream', async () => {
    const buffer = Buffer.from("A simple string.\nAnd simple words!");
    stream = new Stream.Readable();
    stream._read = () => {
    };
    stream.push(buffer);
    stream.push(null)

    const result = await analyseStream(stream, {
      bytes: true,
      lines: false,
      words: false,
      characters: false
    });

    expect(result.bytes).toEqual(34)
  })


})
