import {JsonToken} from "./json-token";

type Tokens = Array<{ type: JsonToken, value?: string }>

export class JsonLexer {
  static tokenize(input: IterableIterator<string>): Tokens {
    const tokens: Tokens = [];
    let currentChar = input.next().value;
    while (currentChar !== undefined) {
      switch (currentChar) {
        case '{': {
          tokens.push({type: JsonToken.OPEN_BRACE});
          currentChar = input.next().value;
          break;
        }
        case '}': {
          tokens.push({type: JsonToken.CLOSE_BRACE});
          currentChar = input.next().value;
          break;
        }
        case '[':
          tokens.push({type: JsonToken.OPEN_BRACKET});
          currentChar = input.next().value;
          break;
        case ']': {
          tokens.push({type: JsonToken.CLOSE_BRACKET});
          currentChar = input.next().value;
          break;
        }
        case ':': {
          tokens.push({type: JsonToken.COLON});
          currentChar = input.next().value;
          break;
        }
        case ',': {
          tokens.push({type: JsonToken.COMMA});
          currentChar = input.next().value;
          break;
        }
        case ' ':
        case '\t':
        case '\n':
        case '\r': {
          tokens.push({type: JsonToken.WHITESPACE, value: currentChar});
          currentChar = input.next().value;
          break;
        }
        case '"': {
          let value = "";
          let nextChar = input.next().value;
          while (nextChar !== '"') {
            value += nextChar;
            nextChar = input.next().value;
          }
          tokens.push({type: JsonToken.STRING, value});
          currentChar = input.next().value;
          break;
        }
        case '-':
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9': {
          let value = currentChar;
          let nextChar = input.next().value;
          let isFloat = false;
          const numberTokens = ['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
          while (nextChar !== undefined && numberTokens.includes(nextChar)) {
            if (nextChar === '.') {
              if (isFloat) {
                throw new Error(`Unexpected character: ${nextChar}`);
              }
              isFloat = true;
            }
            value += nextChar;
            nextChar = input.next().value;
          }
          tokens.push({type: JsonToken.NUMBER, value});
          currentChar = nextChar;
          break;
        }
        case 't': {
          ['r', 'u', 'e'].forEach((char) => {
            const nextChar = input.next().value;
            if (nextChar !== char) {
              throw new Error(`Unexpected character: ${nextChar}`);
            }
          });
          tokens.push({type: JsonToken.BOOLEAN, value: 'true'});
          currentChar = input.next().value;
          break;
        }
        case 'f': {
          ['a', 'l', 's', 'e'].forEach((char) => {
            const nextChar = input.next().value;
            if (nextChar !== char) {
              throw new Error(`Unexpected character: ${nextChar}`);
            }
          });
          tokens.push({type: JsonToken.BOOLEAN, value: 'false'});
          currentChar = input.next().value;
          break;
        }
        case 'n': {
          ['u', 'l', 'l'].forEach((char) => {
            const nextChar = input.next().value;
            if (nextChar !== char) {
              throw new Error(`Unexpected character: ${nextChar}`);
            }
          });
          tokens.push({type: JsonToken.NULL});
          currentChar = input.next().value;
          break;
        }
        default: {
          throw new Error(`Unexpected character: ${currentChar}`);
        }
      }
    }

    return tokens;
  }
}
