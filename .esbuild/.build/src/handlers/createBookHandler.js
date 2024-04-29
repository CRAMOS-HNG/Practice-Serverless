var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/handlers/createBookHandler.ts
var createBookHandler_exports = {};
__export(createBookHandler_exports, {
  addBook: () => addBook
});
module.exports = __toCommonJS(createBookHandler_exports);

// node_modules/uuid/dist/esm-node/rng.js
var import_crypto = __toESM(require("crypto"));
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    import_crypto.default.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

// node_modules/uuid/dist/esm-node/regex.js
var regex_default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

// node_modules/uuid/dist/esm-node/validate.js
function validate(uuid) {
  return typeof uuid === "string" && regex_default.test(uuid);
}
var validate_default = validate;

// node_modules/uuid/dist/esm-node/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).substr(1));
}
function stringify(arr, offset = 0) {
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
  if (!validate_default(uuid)) {
    throw TypeError("Stringified UUID is invalid");
  }
  return uuid;
}
var stringify_default = stringify;

// node_modules/uuid/dist/esm-node/v4.js
function v4(options, buf, offset) {
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return stringify_default(rnds);
}
var v4_default = v4;

// src/repositories/bookRepository.ts
var import_aws_sdk = __toESM(require("aws-sdk"));
var BookRepository = class {
  dynamodb;
  tableName = "tbBook";
  constructor() {
    this.dynamodb = new import_aws_sdk.default.DynamoDB.DocumentClient();
  }
  async createBook(book) {
    await this.dynamodb.put({
      TableName: this.tableName,
      Item: book
    }).promise();
  }
  async getAllBooks() {
    const result = await this.dynamodb.scan({
      TableName: this.tableName
    }).promise();
    return result.Items;
  }
  async getBookById(id) {
    const result = await this.dynamodb.get({
      TableName: this.tableName,
      Key: { id }
    }).promise();
    return result.Item;
  }
  async updateBookStock(id, newStock) {
    try {
      const params = {
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: "set stock = :stock",
        ExpressionAttributeValues: {
          ":stock": newStock
        },
        ReturnValues: "ALL_NEW"
      };
      const result = await this.dynamodb.update(params).promise();
      const updatedBook = result.Attributes;
      return updatedBook;
    } catch (error) {
      console.error("Error al actualizar el stock del libro en DynamoDB:", error);
      return null;
    }
  }
  async deleteBook(id) {
    await this.dynamodb.delete({
      TableName: this.tableName,
      Key: { id }
    }).promise();
  }
};

// src/handlers/createBookHandler.ts
var bookRepository = new BookRepository();
var addBook = async (event) => {
  const { title, description } = JSON.parse(event.body);
  const createdAt = /* @__PURE__ */ new Date();
  const id = v4_default();
  const newBook = {
    id,
    title,
    description,
    createdAt,
    stock: true
  };
  await bookRepository.createBook(newBook);
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        success: true,
        message: "Se creo el libro con \xE9xito.",
        response: newBook
      }
    )
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addBook
});
