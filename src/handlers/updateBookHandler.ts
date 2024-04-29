import AWS from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { Book } from '../models/book';
import { BookRepository } from '../repositories/bookRepository';

const bookRepository = new BookRepository();

export const updateBook: APIGatewayProxyHandler = async (event) => {
    if (!event.pathParameters || !event.pathParameters.id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'ID de libro no proporcionado en los parámetros de la ruta' })
        };
    }

    const { id } = event.pathParameters;
    const { stock } = JSON.parse(event.body!);

    const updatedBook = await bookRepository.updateBookStock(id, stock);


    try {
        

        // Hacer algo con los datos obtenidos
        return {
            statusCode: 200,
            body: JSON.stringify(
                {
                    success: true,
                    message: "Se actualizó el stock del libro con éxito.",
                    response: updatedBook
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
