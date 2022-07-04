import { ImageSchema, TagSchema, UserSchema } from "@apiTypes/responseSchema";
import { DeleteImageSchema, PostTagSchema, PostUserSchema, PostImageUnwantedSchema, DeleteImageUnwantedSchema, PutImageTagsSchema, PutImageFileSchema } from "@apiTypes/requestSchema";

export class Api {
    public static host = process.env.NEXT_PUBLIC_API_URL;
    public authorization: string = null;

    constructor() {
        if (Api.host === null) throw new Error(`NEXT_PUBLIC_API_URL in env not defined`);
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

    private delete = async (path: string, body?: string): Promise<Response> => {
        const requestOptions = {
            method: 'DELETE',
            headers: body ? {
                'Content-Type': 'application/json'
            } : {},
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

    public deleteTagWanted = async (id: string): Promise<any> => {
        try {
            const res = await this.delete(`/tag/wanted/${id}`);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err;
        }
    };

    public deleteTagUnwanted = async (id: string): Promise<any> => {
        try {
            const res = await this.delete(`/tag/unwanted/${id}`);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err;
        }
    };

    public getImageIds = async (origin: string): Promise<TagSchema[]> => {
        try {
            const res = await this.get(`/images/id/${origin}`);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err;
        }
    };

    public getImage = async (id: string): Promise<ImageSchema> => {
        try {
            const res = await this.get(`/image/${id}`);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err;
        }
    };

    public putImageTags = async (body: PutImageTagsSchema): Promise<any> => {
        try {
            const str = JSON.stringify(body);
            const res = await this.put(`/image/tags`, str);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err;
        }
    };

    /**
     * putImageFile update the size of the image
     * @param body PutImageFileSchema
     */
    public putImageFile = async (body: PutImageFileSchema): Promise<any> => {
        try {
            const str = JSON.stringify(body);
            const res = await this.put(`/image/file`, str);
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

    public postUserUnwanted = async (body: PostUserSchema): Promise<any> => {
        try {
            const str = JSON.stringify(body);
            const res = await this.post(`/user/unwanted`, str);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err
        }

    };

    public deleteUserUnwanted = async (id: string): Promise<any> => {
        try {
            const res = await this.delete(`/user/unwanted/${id}`);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err;
        }
    };

    public getUsersUnwanted = async (): Promise<UserSchema[]> => {
        try {
            const res = await this.get(`/users/unwanted`);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err;
        }
    };

    public postImageUnwanted = async (body: PostImageUnwantedSchema): Promise<any> => {
        try {
            const str = JSON.stringify(body);
            const res = await this.post(`/image/unwanted`, str);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err
        }

    };

    public deleteImageUnwanted = async (body: DeleteImageUnwantedSchema): Promise<any> => {
        try {
            const str = JSON.stringify(body);
            const res = await this.delete(`/image/unwanted`, str);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err;
        }
    };

    public getImagesUnwanted = async (): Promise<ImageSchema[]> => {
        try {
            const res = await this.get(`/images/unwanted`);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err;
        }
    };
}