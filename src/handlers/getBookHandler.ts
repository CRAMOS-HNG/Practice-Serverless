import AWS from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { Book } from '../models/book';
import { BookRepository } from '../repositories/bookRepository';

const bookRepository = new BookRepository();

export const getBook: APIGatewayProxyHandler = async (event) => {
    if (!event.pathParameters || !event.pathParameters.id) {
        return {
            statusCode: 400, 
            body: JSON.stringify({ error: 'ID de libro no proporcionado en los parámetros de la ruta' })
        };
    }

    const bookId = event.pathParameters.id;

    try {
        const book = await bookRepository.getBookById(bookId);

        if (!book) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'No se encontró el libro con el ID proporcionado' })
            };
        }
        return {
            statusCode: 200,
            body: JSON.stringify(
                {
                    success: true,
                    message: "Se obtuvo el libro con éxito.",
                    response: book
                }
            )
        };
    } catch (error) {
        console.error('Error al obtener el libro de la base de datos:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Ocurrió un error interno al obtener el libro' })
        };
    }
};
