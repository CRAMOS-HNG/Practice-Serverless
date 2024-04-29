import AWS from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { BookRepository } from '../repositories/bookRepository';

const bookRepository = new BookRepository();

export const deleteBook: APIGatewayProxyHandler = async (event) => {
    if (!event.pathParameters || !event.pathParameters.id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'ID de libro no proporcionado en los parámetros de la ruta' })
        };
    }

    const { id } = event.pathParameters;

    

    try {
        await bookRepository.deleteBook(id);

        return {
            statusCode: 200,
            body: JSON.stringify(
                {
                    success: true,
                    message: "Se eliminó el libro con éxito."
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
