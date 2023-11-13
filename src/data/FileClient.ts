import { ApiFile } from "../types/types";

const fs = require('fs');

export const getApiArr = (path: string): string[] => {
    return fs.readdirSync(path).filter((file: string) => file.endsWith('.json'));
};

export const getApi = (path: string): ApiFile => {
    try{
        return JSON.parse(fs.readFileSync(path));
    }catch(e){
        console.log(e);
        return {
            key: '',
            endpoints: [],
        };
    }
};

export const createNewApi = (path: string) : ApiFile => {
    const fileArr = fs.readdirSync(path).filter((file: string) => file.endsWith('.json'));
    let key = 'api-1.json';
    let counter = 1;

    while(fileArr.includes(key)){
        counter++;
        key = `api-${counter}.json`;
    }

    let apiFile: ApiFile = {
        key: key,
        endpoints: [],
    };

    fs.writeFileSync(`${path}/${key}`, JSON.stringify(apiFile));
    return apiFile;
};

export const updateApiAsync = (path: string, api: ApiFile) => {
    fs.writeFile(path, JSON.stringify(api), (err: any) => {});
};
