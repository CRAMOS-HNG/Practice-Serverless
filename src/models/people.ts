// models/People.ts

import { PeopleDTO } from "./peopleDTO";
import { Species } from "./species";

export class People {
    name: string;
    height: string;
    mass: string;
    hair_color: string;
    skin_color: string;
    eye_color: string;
    birth_year: string;
    gender: string;
    species: Species[];

    constructor(peopleDTO: PeopleDTO, speciesData: Species[]) {
        this.name = peopleDTO.name;
        this.height = peopleDTO.height;
        this.mass = peopleDTO.mass;
        this.hair_color = peopleDTO.hair_color;
        this.skin_color = peopleDTO.skin_color;
        this.eye_color = peopleDTO.eye_color;
        this.birth_year = peopleDTO.birth_year;
        this.gender = peopleDTO.gender;
        this.species = speciesData; 
    }
}
