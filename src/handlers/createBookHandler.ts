import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';
import {APIGatewayProxyHandler} from 'aws-lambda'
import { BookDTO } from '../models/bookDTO';
import { Book } from '../models/book';
import { BookRepository } from '../repositories/bookRepository';

const bookRepository = new BookRepository();

export const addBook: APIGatewayProxyHandler = async(event) => {
    const { title, description }: BookDTO  = JSON.parse(event.body!);
    const createdAt = new Date();
    const id = uuidv4();

    const newBook: Book = {
        id,
        title,
        description,
        createdAt,
        stock: true
    }

    await bookRepository.createBook(newBook);

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                success: true,
                message: "Se creo el libro con éxito.",
                response: newBook
            }
        )
    }
}
