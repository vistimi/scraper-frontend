import { ImageSchema, TagSchema, UserSchema } from "@apiTypes/responseSchema";
import { PostTagSchema, PostUserSchema, PostImageUnwantedSchema, PutImageTagsPushSchema, PutImageTagsPullSchema, ImageCropSchema, PostImageTransfer } from "@apiTypes/requestSchema";

export class Api {
    public static host = process.env.NEXT_PUBLIC_API_URL;
    public authorization: string = null;

    constructor() {
        if (!Api.host) console.error(`NEXT_PUBLIC_API_URL in env not defined`);
    }

    /** Functions general */

    public hostName = (): string => {
        return Api.host;
    }

    private get = async (path: string): Promise<Response> => {
        const requestOptions = {
            method: 'GET',
        }
        console.log(`${Api.host}${path}`)
        console.log(`${this.authorization}`)
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

    /** Routes for one image wanted and pending */

    /**
     * getImageFile fetch the image file
     */
     public getImageFile = async (origin: string, originID: string, extension: string): Promise<any> => {
        try {
            const res = await this.get(`/image/file/${origin}/${originID}/${extension}`);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err;
        }
    };

    public getImage = async (id: string, collection: string): Promise<ImageSchema> => {
        try {
            const res = await this.get(`/image/${id}/${collection}`);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err;
        }
    };

    public putImageTagsPush = async (body: PutImageTagsPushSchema): Promise<any> => {
        try {
            const str = JSON.stringify(body);
            const res = await this.put(`/image/tags/push`, str);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err;
        }
    };

    public putImageTagsPull = async (body: PutImageTagsPullSchema): Promise<any> => {
        try {
            const str = JSON.stringify(body);
            const res = await this.put(`/image/tags/pull`, str);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err;
        }
    };

    /**
     * putImageCrop update the size, tag boxes and file of a pending image
     * @param body ImageCropSchema
     */
     public putImageCrop = async (body: ImageCropSchema): Promise<any> => {
        try {
            const str = JSON.stringify(body);
            const res = await this.put(`/image/crop`, str);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err;
        }
    };

    /**
     * postImageCrop creates a new image when cropped
     * @param body ImageCropSchema
     */
     public postImageCrop = async (body: ImageCropSchema): Promise<any> => {
        try {
            const str = JSON.stringify(body);
            const res = await this.post(`/image/crop`, str);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err;
        }
    };

    public postImageTransfer = async (body: PostImageTransfer): Promise<any> => {
        try {
            const str = JSON.stringify(body);
            const res = await this.post(`/image/transfer`, str);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err;
        }
    };

    public deleteImage = async (id: string): Promise<any> => {
        try {
            const res = await this.delete(`/image/${id}`);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err;
        }
    };

    /** Routes for images wanted and pending */

    public getImageIds = async (origin: string, collection: string): Promise<ImageSchema[]> => {
        try {
            const res = await this.get(`/images/id/${origin}/${collection}`);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err;
        }
    };

    /** Routes for one image unwanted */

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

    public deleteImageUnwanted = async (id: string): Promise<any> => {
        try {
            const res = await this.delete(`/image/unwanted/${id}`);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err;
        }
    };

    /** Routes for images unwanted */

    public getImagesUnwanted = async (): Promise<ImageSchema[]> => {
        try {
            const res = await this.get(`/images/unwanted`);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err;
        }
    };

    /** Routes for one tag */

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

    /** Routes for tags */

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

    /** Routes for one unwanted user */

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

     /** Routes for unwanted users */

     public getUsersUnwanted = async (): Promise<UserSchema[]> => {
        try {
            const res = await this.get(`/users/unwanted`);
            await this.checkBadStatus(res);
            return await res.json();
        } catch (err) {
            throw err;
        }
    };
}