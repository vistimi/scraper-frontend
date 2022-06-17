import { ImageSchema, TagSchema } from "@apiTypes/apiSchema";

export class Api {
    public static host = process.env.NEXT_PUBLIC_API_URL;
    public authorization: string = null;

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
        }
        return await fetch(`${Api.host}${path}`, requestOptions);
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

        return await fetch(`${Api.host}${path}`, requestOptions);
    };

    private put = async (path: string, body: string | FormData): Promise<Response> => {
        const requestOptions = {
            method: 'PUT',
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

        return await fetch(`${Api.host}${path}`, requestOptions);
    };

    private delete = async (path: string, body: FormData): Promise<Response> => {
        const requestOptions = {
            method: 'DELETE',
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

        return await fetch(`${Api.host}${path}`, requestOptions);
    };

    private checkBadStatus = (res) => {
        if (res.status >= 300) {
            const messages = ["Bad Request", "Server Error"];
            const index = res.status >= 500;

            throw new Error(`${messages[Number(index)]}: ${res.status}`);
        }
    }

    public getTagsWanted = async (): Promise<TagSchema[]> => {
        try {
            const res = await this.get(`/tags/wanted`);
            this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            return err;
        }
    };

    public getTagsUnwanted = async (): Promise<TagSchema[]> => {
        try {
            const res = await this.get(`/tags/unwanted`);
            this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            return err;
        }
    };

    public postTagWanted = async (): Promise<TagSchema[]> => {
        try {
            const res = await this.get(`/tag/wanted`,);
            this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            return err;
        }
    };

    public postTagUnwanted = async (): Promise<TagSchema[]> => {
        try {
            const res = await this.get(`/tag/unwanted`,);
            this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            return err;
        }
    };

    public getImageIds = async (collection: string): Promise<TagSchema[]> => {
        try {
            const res = await this.get(`/images/id/${collection}`);
            this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            return err;
        }
    };

    public getImage = async (collection: string, id: string): Promise<ImageSchema> => {
        try {
            const res = await this.get(`/image/${collection}/${id}`);
            console.log(res)
            this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            return err;
        }
    };

    public putImage = async (body: FormData): Promise<any> => {
        try {
            const res = await this.put(`/image`, body);
            this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            return err;
        }
    };

    public deleteImage = async (body: FormData): Promise<any> => {
        try {
            const res = await this.delete(`/image`, body);
            this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            return err;
        }
    };
}