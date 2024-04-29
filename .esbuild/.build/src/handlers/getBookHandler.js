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

// src/handlers/getBookHandler.ts
var getBookHandler_exports = {};
__export(getBookHandler_exports, {
  getBook: () => getBook
});
module.exports = __toCommonJS(getBookHandler_exports);

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

// src/handlers/getBookHandler.ts
var bookRepository = new BookRepository();
var getBook = async (event) => {
  if (!event.pathParameters || !event.pathParameters.id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "ID de libro no proporcionado en los par\xE1metros de la ruta" })
    };
  }
  const bookId = event.pathParameters.id;
  try {
    const book = await bookRepository.getBookById(bookId);
    if (!book) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No se encontr\xF3 el libro con el ID proporcionado" })
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          success: true,
          message: "Se obtuvo el libro con \xE9xito.",
          response: book
        }
      )
    };
  } catch (error) {
    console.error("Error al obtener el libro de la base de datos:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Ocurri\xF3 un error interno al obtener el libro" })
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getBook
});
