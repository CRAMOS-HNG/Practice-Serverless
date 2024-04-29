import AWS from 'aws-sdk';
import { Book } from '../models/book';

export class BookRepository {
    private dynamodb: AWS.DynamoDB.DocumentClient;
    private tableName: string = 'tbBook';

    constructor() {
        this.dynamodb = new AWS.DynamoDB.DocumentClient();
    }

    async createBook(book: Book): Promise<void> {
        await this.dynamodb.put({
            TableName: this.tableName,
            Item: book
        }).promise();
    }

    async getAllBooks(): Promise<Book[]> {
        const result = await this.dynamodb.scan({
            TableName: this.tableName
        }).promise();

        return result.Items as Book[];
    }

    async getBookById(id: string): Promise<Book | null> {
        const result = await this.dynamodb.get({
            TableName: this.tableName,
            Key: { id }
        }).promise();
        return result.Item as Book | null;
    }

    async updateBookStock(id: string, newStock: boolean): Promise<Book | null> {
        try {
            // Definir los parámetros de la actualización en DynamoDB
            const params = {
                TableName: this.tableName,
                Key: { id },
                UpdateExpression: 'set stock = :stock',
                ExpressionAttributeValues: {
                    ':stock': newStock
                },
                ReturnValues: 'ALL_NEW'
            };
    
            const result = await this.dynamodb.update(params).promise();
    
            const updatedBook = result.Attributes as Book;
    
            return updatedBook;
        } catch (error) {
            console.error('Error al actualizar el stock del libro en DynamoDB:', error);
            return null;
        }
    }
    
    
    async deleteBook(id: string): Promise<void> {
        await this.dynamodb.delete({
            TableName: this.tableName,
            Key: { id }
        }).promise();
    }
}
