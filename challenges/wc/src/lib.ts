import path from "node:path";
import * as fs from "node:fs/promises";

type Options = {
  lines: boolean;
  words: boolean;
  characters: boolean;
  bytes: boolean;
};

type CcwcOptionsWithFiles = {
  files: Array<string>;
  content?: never;
} & Options;

type CcwcOptionsWithContent = {
  files?: never;
  content: string;
} & Options;

export type CcwcOptions = CcwcOptionsWithFiles | CcwcOptionsWithContent;

export type CcwcResult = {
  lines?: number;
  words?: number;
  characters?: number;
  bytes?: number;
  fileName: string;
};

async function analyseFile(file: string, options: CcwcOptions): Promise<CcwcResult> {
  let numberOfBytes = 0;
  let numberOfWords = 0;
  let numberOfLines = 0;
  let numberOfCharacters = 0;

  const fileHandle = await fs.open(path.resolve(file));
  const readStream: NodeJS.ReadableStream = fileHandle.createReadStream();

  let previousCharIsAlphaNum = false;
  for await (const chunk of readStream) {
    numberOfBytes += chunk.length;
    chunk.toString().split('').forEach(byte => {
      if (byte === "\n") {
        numberOfLines += 1;
      }
      numberOfCharacters += 1;
      if (byte.charCodeAt(0) <= 32) {
        if (previousCharIsAlphaNum) {
          numberOfWords += 1;
          previousCharIsAlphaNum = false
        }
      } else {
        previousCharIsAlphaNum = true;
      }
    });
  }
  await fileHandle.close();

  return {
    fileName: file,
    bytes: options.bytes ? numberOfBytes : undefined,
    words: options.words ? numberOfWords : undefined,
    characters: options.characters ? numberOfCharacters : undefined,
    lines: options.lines ? numberOfLines : undefined
  }
}

export async function ccwc(options: CcwcOptions): Promise<CcwcResult[]> {

  let numberOfBytes = 0;

  if (options.files) {
    return Promise.all(options.files.map(file => analyseFile(file, options)));
  }
  console.log(numberOfBytes)
  return [];
}
