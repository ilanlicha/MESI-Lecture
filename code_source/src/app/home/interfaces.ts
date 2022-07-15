export interface Files {
    name: string;
    status: string;
}

export interface Applications {
    _id: string;
    name: string;
    ins: string;
    description: string;
    status: string;
    portFront: number;
    frontEnd: string;
    portBack: number;
    backEnd: string;
    dockerCompose: string;
    sourceFiles: Files[];
    configFiles: Files[];
}

export interface ApiResponse {
    message: string;
    status: number;
}

export interface ApiFilesResponse {
    files: Files[]
}




export interface Book {
    _id: string;
    name: string;
    auteur: string;
    description: string;
    couvertureData: Buffer;
    pageIndex: number;
    motIndex: number;
}

export interface Content {
    info: [
        title: string,
        author: string
    ];
    section: [
        id: string,
        htmlString: string
    ];
}