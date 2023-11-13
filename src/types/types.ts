export type Endpoint = {
    url: string,
    method: string,
    status: number,
    response: string,
};

export type ApiFile = {
    key: string,
    endpoints: Endpoint[],
};