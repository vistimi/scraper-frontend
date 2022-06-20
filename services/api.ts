import { ImageSchema, TagSchema } from "@apiTypes/responseSchema";
import { DeleteImageSchema, PostTagSchema, PutImageSchema } from "@apiTypes/requestSchema";

export class Api {
    public static host = process.env.NEXT_PUBLIC_API_URL;
    public authorization: string = null;

    constructor() {
    }

    public hostName = (): string => {
        return Api.host;
    }

    private get = async (path: string): Promise<Response> => {
        const requestOptions = {
            method: 'GET',
        }
        return await fetch(`${Api.host}${path}`, requestOptions);
    };

    private post = async (path: string, body: string): Promise<Response> => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        };
        return await fetch(`${Api.host}${path}`, requestOptions);
    };

    private put = async (path: string, body: string): Promise<Response> => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        };
        return await fetch(`${Api.host}${path}`, requestOptions);
    };

    private delete = async (path: string, body: string): Promise<Response> => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        };
        return await fetch(`${Api.host}${path}`, requestOptions);
    };

    private checkBadStatus = async (res: Response): Promise<void | Error> => {
        if (res.status >= 300) {
            const messages = ["Bad Request", "Server Error"];
            const index = res.status >= 500;
            throw new Error(`${messages[Number(index)]} ${res.status}! message: ${JSON.stringify(await res.json(), null, 2)}`);
        }
    }

    public getTagsWanted = async (): Promise<TagSchema[]> => {
        try {
            const res = await this.get(`/tags/wanted`);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err;
        }
    };

    public getTagsUnwanted = async (): Promise<TagSchema[]> => {
        try {
            const res = await this.get(`/tags/unwanted`);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err;
        }
    };

    public postTagWanted = async (body: PostTagSchema): Promise<any> => {
        try {
            const str = JSON.stringify(body);
            const res = await this.post(`/tag/wanted`, str);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err;
        }
    };

    public postTagUnwanted = async (body: PostTagSchema): Promise<any> => {
        try {
            const str = JSON.stringify(body);
            const res = await this.post(`/tag/unwanted`, str);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err
        }

    };

    public getImageIds = async (collection: string): Promise<TagSchema[]> => {
        try {
            const res = await this.get(`/images/id/${collection}`);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err;
        }
    };

    public getImage = async (collection: string, id: string): Promise<ImageSchema> => {
        try {
            const res = await this.get(`/image/${collection}/${id}`);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err;
        }
    };

    public putImage = async (body: PutImageSchema): Promise<any> => {
        try {
            const str = JSON.stringify(body);
            const res = await this.put(`/image`, str);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err;
        }
    };

    public deleteImage = async (body: DeleteImageSchema): Promise<any> => {
        try {
            const str = JSON.stringify(body);
            const res = await this.delete(`/image`, str);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err;
        }
    };
}