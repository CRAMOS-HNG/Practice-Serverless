import { People } from "../models/people";
import { Species } from "../models/species";

export class Mapper {
    static mapPeopleAttributes(people: People): any {
        return {
            nombre: people.name,
            altura: people.height,
            masa: people.mass,
            color_cabello: people.hair_color,
            color_piel: people.skin_color,
            color_ojos: people.eye_color,
            anio_nacimiento: people.birth_year,
            genero: people.gender,
            especies: Mapper.mapSpeciesArray(people.species)
        };
    }

    static mapSpecies(species: Species): any {
        return {
            nombre: species.name,
            clasificacion: species.classification,
            designacion: species.designation,
            altura_promedio: species.average_height,
            colores_piel: species.skin_colors,
            colores_cabello: species.hair_colors,
            colores_ojos: species.eye_colors,
            esperanza_vida_promedio: species.average_lifespan,
            lenguaje: species.language
        };
    }

    static mapSpeciesArray(speciesArray: Species[]): any[] {
        return speciesArray.map((species) => Mapper.mapSpecies(species));
    }
}
