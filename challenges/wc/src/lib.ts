import {Readable} from "stream";
import {CcwcOptions, CcwcResult} from "./ccwc";

export async function analyseStream(stream: Readable, options: Omit<CcwcOptions, "files">): Promise<CcwcResult> {
  let numberOfBytes = 0;
  let numberOfWords = 0;
  let numberOfLines = 0;
  let numberOfCharacters = 0;

  let previousCharIsAlphaNum = false;
  let chunk: Buffer;
  for await (chunk of stream) {
    numberOfBytes += chunk.length;
    chunk.toString().split('').forEach(char => {
      if (char === "\n") {
        numberOfLines += 1;
      }
      numberOfCharacters += 1;
      if (char.charCodeAt(0) <= 32) {
        if (previousCharIsAlphaNum) {
          numberOfWords += 1;
          previousCharIsAlphaNum = false
        }
      } else {
        previousCharIsAlphaNum = true;
      }
    });
  }

  return {
    bytes: options.bytes ? numberOfBytes : undefined,
    words: options.words ? numberOfWords : undefined,
    characters: options.characters ? numberOfCharacters : undefined,
    lines: options.lines ? numberOfLines : undefined
  }
}
