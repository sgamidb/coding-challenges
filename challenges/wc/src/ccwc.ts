import * as fs from "node:fs/promises";
import {analyseStream} from "./lib";

export type CcwcOptions = {
  lines: boolean;
  words: boolean;
  characters: boolean;
  bytes: boolean;
  files: Array<string>;
};

export type CcwcResult = {
  lines?: number;
  words?: number;
  characters?: number;
  bytes?: number;
  fileName?: string;
};

export async function ccwc(options: CcwcOptions): Promise<CcwcResult[]> {
  let results: CcwcResult[] = [];
  if (options.files.length > 0) {
    for (const file of options.files) {
      const fd = await fs.open(file);
      try {
        const stream = fd.createReadStream({
          highWaterMark: 256,
        });
        const result = {
          ...await analyseStream(stream, options),
          fileName: file
        }
        results.push(result);
      } catch (e) {
        console.error(e);
      } finally {
        await fd.close();
      }
    }
    return results;
  }

  return [await analyseStream(process.stdin, options)];
}
