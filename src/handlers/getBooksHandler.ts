import AWS from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { BookDTO } from '../models/bookDTO'; // Importa el DTO de Book aquí
import { BookRepository } from '../repositories/bookRepository';

const bookRepository = new BookRepository();

export const getBooks: APIGatewayProxyHandler = async (event) => {

    const books = await bookRepository.getAllBooks();

    try {
        
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: "Se obtuvo el listado de libros con éxito.",
                response: books
            })
        };
        
    } catch (error) {
        console.error('Error al obtener los libros:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Ocurrió un error al obtener los libros' })
        };
    }
};
