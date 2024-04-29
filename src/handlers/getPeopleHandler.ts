import { APIGatewayProxyHandler } from 'aws-lambda';
import axios from 'axios';
import { instanceSWAPI } from '../services/baseAPI.service';
import { PeopleDTO } from '../models/peopleDTO';
import { SpeciesDTO } from '../models/speciesDTO';
import { Species } from '../models/species';
import { People } from '../models/people';
import { Mapper } from '../utilities/autoMapperProfiles';

export const getPeople: APIGatewayProxyHandler = (event) => {
    const pathParameters = event.queryStringParameters?.id;
    const endpeople = `/people/${pathParameters}/`;

    return instanceSWAPI.get(endpeople)
        .then((response) => {
            if (response.status !== 200) {
                throw new Error('Error al obtener los datos del personaje de SWAPI');
            }

            const peopleDTO: PeopleDTO = response.data;
            const speciesPromises = peopleDTO.species.map((speciesUrl: string) => axios.get<SpeciesDTO>(speciesUrl));

            return Promise.all(speciesPromises)
                .then((speciesResponses) => {
                    const speciesData: Species[] = speciesResponses.map((speciesResponse) => new Species(speciesResponse.data));
                    const people = new People(peopleDTO, speciesData);
                    
                    // Mapea los atributos de inglés a español
                    const mappedPeople = Mapper.mapPeopleAttributes(people);
                    const mappedSpeciesData = Mapper.mapSpeciesArray(speciesData);

                    // Agrega los datos mapeados al objeto de respuesta
                    mappedPeople.especies = mappedSpeciesData;

                    return {
                        statusCode: 200,
                        body: JSON.stringify({
                            success: true,
                            message: "Se obtuvo la API con éxito.",
                            response: mappedPeople
                        })
                    };
                });
        })
        .catch((error) => {
            console.error('Error al procesar la solicitud:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Ocurrió un error interno al procesar la solicitud' })
            };
        });
};
