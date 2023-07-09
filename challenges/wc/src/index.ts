import {parseArgs, ParseArgsConfig} from "node:util";
import {ccwc, CcwcOptions, CcwcResult} from "./lib";


async function run() {
  const options = getArgs();
  const result = await ccwc(options);
  printResult(result)
}

function getArgs(): CcwcOptions {
  const config: ParseArgsConfig = {
    options: {
      characters: {
        type: "boolean",
        default: false,
        multiple: false,
        short: "m",
      },
      words: {
        type: "boolean",
        default: false,
        multiple: false,
        short: "w",
      },
      lines: {
        type: "boolean",
        default: false,
        multiple: false,
        short: "l",
      },
      bytes: {
        type: "boolean",
        default: false,
        multiple: false,
        short: "c",
      },
    },
    allowPositionals: true,
  };
  const {values, positionals} = parseArgs(config);

  return {
    words: values.words === true,
    characters: values.characters === true,
    lines: values.lines === true,
    bytes: values.bytes === true,
    files: positionals,
  };
}

function printResult(result: CcwcResult[]) {
  result.forEach(row => {
    let lineToPrint = "";
    if (row.lines) {
      lineToPrint += row.lines.toString().padStart(8, ' ');
    }
    if (row.words) {
      lineToPrint += row.words.toString().padStart(8, ' ');
    }
    if (row.characters) {
      lineToPrint += row.characters.toString().padStart(8, ' ');
    } else if (row.bytes) {
      lineToPrint += row.bytes.toString().padStart(8, ' ');
    }
    lineToPrint += " " + row.fileName;
    console.log(lineToPrint);
  })
}

run().catch(console.error);
