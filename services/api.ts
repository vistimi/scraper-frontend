import { ImageSchema, TagSchema, UserSchema } from "schemas/responseSchema";
import { PostTagSchema, PostUserSchema, PostImageUnwantedSchema, PutImageTagsPushSchema, PutImageTagsPullSchema, ImageCropSchema, PostImageTransfer, ImageCopySchema } from "schemas/requestSchema";
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

    private handleRequest = async (path: string, requestOptions): Promise<any> => {
        const res = await fetch(`${Api.host}${path}`, requestOptions);
        if (!res) throw new Error('no response');
        const responseObject = await res.json();
        if (!responseObject) return;
        if (responseObject.status >= 300) throw new Error(`status: ${responseObject.status}, message: ${JSON.stringify(await responseObject, null, 2)}`);
        return responseObject;
    }

    private get = async (path: string): Promise<any> => {
        try {
            const requestOptions = {
                method: 'GET',
            };
            return this.handleRequest(path, requestOptions);
        } catch (err) {
            throw err;
        }
    };

    private post = async (path: string, body: string): Promise<any> => {
        try {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body
            };
            return this.handleRequest(path, requestOptions);
        } catch (err) {
            throw err;
        }
    };

    private put = async (path: string, body: string): Promise<any> => {
        try {
            const requestOptions = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body
            };
            return this.handleRequest(path, requestOptions);
        } catch (err) {
            throw err;
        }
    };

    private delete = async (path: string, body?: string): Promise<any> => {
        try {
            const requestOptions = {
                method: 'DELETE',
                headers: body ? {
                    'Content-Type': 'application/json'
                } : {},
                body
            };
            return this.handleRequest(path, requestOptions);
        } catch (err) {
        }
    };

    /** Routes for one image wanted and pending */

    /**
     * getImageFile fetch the image file
     */
    public getImageFile = async (origin: string, originID: string, extension: string): Promise<{ dataType: string, dataFile: string[] }> => {
        try {
            return await this.get(`/image/file/${origin}/${originID}/${extension}`);
        } catch (err) {
            throw err;
        }
    };

    public getImage = async (id: string, collection: string): Promise<ImageSchema> => {
        try {
            return await this.get(`/image/${id}/${collection}`);
        } catch (err) {
            throw err;
        }
    };

    public putImageTagsPush = async (body: PutImageTagsPushSchema): Promise<any> => {
        try {
            const str = JSON.stringify(body);
            return await this.put(`/image/tags/push`, str);
        } catch (err) {
            throw err;
        }
    };

    public putImageTagsPull = async (body: PutImageTagsPullSchema): Promise<any> => {
        try {
            const str = JSON.stringify(body);
            return await this.put(`/image/tags/pull`, str);
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
            return await this.put(`/image/crop`, str);
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
            return await this.post(`/image/crop`, str);
        } catch (err) {
            throw err;
        }
    };

    public copyImage = async (body: ImageCopySchema): Promise<any> => {
        try {
            const str = JSON.stringify(body);
            return await this.post(`/image/copy`, str);
        } catch (err) {
            throw err;
        }
    };

    public postImageTransfer = async (body: PostImageTransfer): Promise<any> => {
        try {
            const str = JSON.stringify(body);
            return await this.post(`/image/transfer`, str);
        } catch (err) {
            throw err;
        }
    };

    public deleteImage = async (id: string): Promise<any> => {
        try {
            return await this.delete(`/image/${id}`);
        } catch (err) {
            throw err;
        }
    };

    /** Routes for images wanted and pending */

    public getImageIds = async (origin: string, collection: string): Promise<ImageSchema[]> => {
        try {
            return await this.get(`/images/id/${origin}/${collection}`);
        } catch (err) {
            throw err;
        }
    };

    /** Routes for one image unwanted */

    public postImageUnwanted = async (body: PostImageUnwantedSchema): Promise<any> => {
        try {
            const str = JSON.stringify(body);
            return await this.post(`/image/unwanted`, str);
        } catch (err) {
            throw err
        }

    };

    public deleteImageUnwanted = async (id: string): Promise<any> => {
        try {
            return await this.delete(`/image/unwanted/${id}`);
        } catch (err) {
            throw err;
        }
    };

    /** Routes for images unwanted */

    public getImagesUnwanted = async (): Promise<ImageSchema[]> => {
        try {
            return await this.get(`/images/unwanted`);
        } catch (err) {
            throw err;
        }
    };

    /** Routes for one tag */

    public postTagWanted = async (body: PostTagSchema): Promise<any> => {
        try {
            const str = JSON.stringify(body);
            return await this.post(`/tag/wanted`, str);
        } catch (err) {
            throw err;
        }
    };

    public postTagUnwanted = async (body: PostTagSchema): Promise<any> => {
        try {
            const str = JSON.stringify(body);
            return await this.post(`/tag/unwanted`, str);
        } catch (err) {
            throw err
        }

    };

    public deleteTagWanted = async (id: string): Promise<any> => {
        try {
            return await this.delete(`/tag/wanted/${id}`);
        } catch (err) {
            throw err;
        }
    };

    public deleteTagUnwanted = async (id: string): Promise<any> => {
        try {
            return await this.delete(`/tag/unwanted/${id}`);
        } catch (err) {
            throw err;
        }
    };

    /** Routes for tags */

    public getTagsWanted = async (): Promise<TagSchema[]> => {
        try {
            return await this.get(`/tags/wanted`);
        } catch (err) {
            throw err;
        }
    };

    public getTagsUnwanted = async (): Promise<TagSchema[]> => {
        try {
            return await this.get(`/tags/unwanted`);
        } catch (err) {
            throw err;
        }
    };

    /** Routes for one unwanted user */

    public postUserUnwanted = async (body: PostUserSchema): Promise<any> => {
        try {
            const str = JSON.stringify(body);
            return await this.post(`/user/unwanted`, str);
        } catch (err) {
            throw err
        }

    };

    public deleteUserUnwanted = async (id: string): Promise<any> => {
        try {
            return await this.delete(`/user/unwanted/${id}`);
        } catch (err) {
            throw err;
        }
    };

    /** Routes for unwanted users */

    public getUsersUnwanted = async (): Promise<UserSchema[]> => {
        try {
            return await this.get(`/users/unwanted`);
        } catch (err) {
            throw err;
        }
    };
}