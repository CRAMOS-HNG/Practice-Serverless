// models/Species.ts
export class Species {
    name: string;
    classification: string;
    designation: string;
    average_height: string;
    skin_colors: string;
    hair_colors: string;
    eye_colors: string;
    average_lifespan: string;
    language: string;

    constructor(speciesData: any) {
        this.name = speciesData.name;
        this.classification = speciesData.classification;
        this.designation = speciesData.designation;
        this.average_height = speciesData.average_height;
        this.skin_colors = speciesData.skin_colors;
        this.hair_colors = speciesData.hair_colors;
        this.eye_colors = speciesData.eye_colors;
        this.average_lifespan = speciesData.average_lifespan;
        this.language = speciesData.language;
    }
}
