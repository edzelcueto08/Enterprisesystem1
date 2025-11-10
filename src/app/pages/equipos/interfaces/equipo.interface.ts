export interface Equiporesponse {
    equipos: Equipo[];
}

export interface Equipo {
    id:          number;
    fullname:    string;
    username:    string;
    password:    string;
    campeonatos: number;
    ciudad:      string;
    role:        Role;
}

export enum Role {
    Libertadores = "Libertadores",
    Sudamericana = "Sudamericana",
}
