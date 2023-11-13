/*import Database from 'better-sqlite3';
import { Endpoint } from "../types/types";

let db : any;

const initDb = () => {
    db = new Database('foobar.db', { fileMustExist: false });
    db.prepare(`CREATE TABLE api (
        key TEXT PRIMARY KEY,
    )`).run();

    db.prepare(`CREATE TABLE endpoint (
        url TEXT PRIMARY KEY,
        status INTEGER,
        response TEXT,
        parent_api_key TEXT,
        FOREIGN KEY(api_key) REFERENCES api(id)
    )`).run();
};

try{
    db = new Database('foobar.db', { fileMustExist: true });
}catch(e){
    initDb();
}

export const getApis = () => {
    const rows = db.prepare(`SELECT * FROM api`).all();
    return rows;
};

export const deleteApi = (apiKey: string) => {
    db.prepare('DELETE FROM endpoint WHERE api_key = ?').run(apiKey);
    db.prepare('DELETE FROM api WHERE key = ?').run(apiKey);
};

export const getEndpoints = (apiKey:string) => {
    const rows = db.prepare(`SELECT * FROM endpoint WHERE id = ?`).all(apiKey);
    return rows;
};

export const insertApi = (apiKey:string) => {
    db.prepare('INSERT INTO api (key) VALUES (?)').run(apiKey);
};

export const insertEndpoint = (endpoint:Endpoint) => {
    db.prepare('INSERT INTO endpoint (url, status, response, api_key) VALUES (?)').run(endpoint.url, endpoint.status, endpoint.response, endpoint.api_key);
};

export const updateEndpointUrl = (newUrl: string, url: string) => {
    db.prepare('UPDATE endpoint SET url = ? WHERE url = ?').run(newUrl, url);
};

export const updateEndpointStatus = (status: number, url: string) => {
    db.prepare('UPDATE endpoint SET status = ? WHERE url = ?').run(status, url);
};

export const updateEndpointResponse = (response: string, url: string) => {
    db.prepare('UPDATE endpoint SET response = ? WHERE url = ?').run(response, url);
};

export const deleteEndpoint = (url: string) => {
    db.prepare('DELETE FROM endpoint WHERE url = ?').run(url);
};

*/


