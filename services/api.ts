
import {DocumentContext} from "next/document";

export class Api {
    public static host = process.env.NEXT_PUBLIC_API_URL;
    public authorization: string = null;
    private context: DocumentContext;

    constructor() {
    }

    public hostName = (): string => {
        return Api.host;
    }

    private emptyPromise = (element?: any): Promise<any> => {
        return new Promise((resolve) => {
            resolve(element ? element : null);
        });
    }

    private get = async (path: string): Promise<Response> => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        }


        return await fetch(`${Api.host}/${path}`, requestOptions);
    };

    private post = async (path: string, body: string | FormData): Promise<Response> => {
        const requestOptions = {
            method: 'POST',
            headers: typeof body == "string" ? {
                    'Content-Type': 'application/json',
                    'Authorization': this.authorization,
                    'Access-Control-Allow-Origin': '*'
                } :
                {
                    'Authorization': this.authorization,
                    'Access-Control-Allow-Origin': '*'
                },
            body
        };

        return await fetch(`${Api.host}/${path}`, requestOptions);
    };

    private delete = async (path: string, body: string): Promise<Response> => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.authorization,
                'Access-Control-Allow-Origin': '*'
            },
            body
        };

        return await fetch(`${Api.host}/${path}`, requestOptions);
    };

    private checkBadStatus = (res) => {
        if (res.status >= 300) {
            const messages = ["Bad Request", "Server Error"];
            const index = res.status >= 500;

            throw new Error(`${messages[Number(index)]}: ${res.status}`);
        }
    }
}