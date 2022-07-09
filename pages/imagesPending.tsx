import React, { useEffect, useState } from 'react';
import { Api } from "@services/api";
import { Button, Text, Pagination, Modal, Table } from '@nextui-org/react';
import { ImageSchema } from '@apiTypes/responseSchema';
import { PostImageUnwantedSchema, PostTagSchema, PostUserSchema, PutImageTagsPullSchema } from '@apiTypes/requestSchema';
import { ImageEditor } from '@components/image/imageEditor';
import { ModalError } from '@components/global/modal';

export default function ImagesPending(props: {}) {
    const api: Api = new Api();
    const collection: string = 'pending';

    const [ids, setIds] = useState<string[]>([]);
    const [image, setImage] = useState<ImageSchema>(null);
    const [modal, setModal] = useState<{ display: boolean, message: string }>({ display: false, message: "" });
    const [origin, setOrigin] = useState<string>("flickr");
    const [page, setPage] = useState<number>(1);

    // when the elements are mounted, called once per lifetime
    useEffect(() => {
        (async () => {
            await getIDs(origin);
        })();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // when the ids from one origin are changing
    useEffect(() => {
        (async () => {
            if (ids.length) await imageFromPage(1);
        })();
    }, [ids]) // eslint-disable-line react-hooks/exhaustive-deps

    /**
     * getIds fetches all IDs from 
     * @param origin the name of the original website
     */
    const getIDs = async (origin: string) => {
        const tags = await api.getImageIds(origin, collection);
        if (tags) {
            setIds(tags.map(tag => tag._id));
            setOrigin(origin);
        } else {
            setModal({ display: true, message: `${origin} is empty` });
        }
    }

    const imageFromPage = async (page: number) => {
        try {
            const image = await api.getImage(ids[page - 1], collection);
            image.creationDate = new Date(image.creationDate);
            if (image.tags) {
                image.tags.forEach(tag => tag.creationDate = new Date(tag.creationDate));
            }
            if (image.size) {
                image.size.forEach(size => size.creationDate = new Date(size.creationDate));
                image.size.sort((a, b) => Number(b.creationDate) - Number(a.creationDate)); // most recent date first
            }
            setImage(image)
        } catch (error) {
            setModal({ display: true, message: `${error}` });
        }
    };

    const postTagUnwanted = async (name: string) => {
        const body: PostTagSchema = {
            name: name,
            origin: {
                "name": "gui",
            }
        }
        try {
            await api.postTagUnwanted(body);
        } catch (error) {
            setModal({ display: true, message: `${error}` });
        }
    }

    const postTagWanted = async (name: string) => {
        const body: PostTagSchema = {
            name: name,
            origin: {
                "name": "gui",
            }
        }
        try {
            await api.postTagWanted(body);
        } catch (error) {
            setModal({ display: true, message: `${error}` });
        }
    }

    const postUserUnwanted = async () => {
        const body: PostUserSchema = {
            origin: origin,
            name: image.user.name,
            originID: image.user.originID,
        }
        try {
            await api.postUserUnwanted(body);
        } catch (error) {
            setModal({ display: true, message: `${error}` });
        }
    }

    const closeModal = () => {
        setModal({ display: false, message: `` });
    };

    const deleteImage = async () => {
        const bodyPostImageUnwantedSchema: PostImageUnwantedSchema = {
            origin: origin,
            originID: image.originID,
        }
        await api.postImageUnwanted(bodyPostImageUnwantedSchema)
        await api.deleteImage(image._id)
        await getIDs(origin)
    };

    const putImageTagsPull = async (name: string) => {
        const body: PutImageTagsPullSchema = {
            id: image._id,
            origin: image.origin,
            names: [name],
        }
        try {
            await api.putImageTagsPull(body);
            await imageFromPage(page);
        } catch (error) {
            setModal({ display: true, message: `${error}` });
        }
    };

    return (
        <>
            <br />
            {/* Image origin */}
            <Button.Group>
                <Button auto onPress={async () => { await getIDs("flickr") }}>Flickr</Button>
                <Button auto onPress={async () => { await getIDs("unsplash") }}>Unsplash</Button>
                <Button auto onPress={async () => { await getIDs("pexels") }}>Pexels</Button>
            </Button.Group>

            {/* Image navigation */}
            <Pagination total={ids.length} initialPage={1} onChange={(page) => { imageFromPage(page); setPage(page) }} key='pagination' />

            {/* Image informations */}
            {image ?
                <>
                    <ImageEditor api={api} image={image} updateParent={async () => { await imageFromPage(page) }} key='imageEditor' />
                    <div>_id: {image._id}</div>
                    <div>originID: {image.originID}</div>
                    <div>width: {image.size[0].box.width}</div>
                    <div>height: {image.size[0].box.height}</div>
                    <div>extension: {image.extension}</div>
                    <div>license: {image.license}</div>
                    <div>creationDate: {image.creationDate.toDateString()}</div>
                    <div>title: {image.title}</div>
                    <div>description: {image.description}</div>
                    {image.tags ?
                        <Table
                            aria-label="Tags Wanted"
                            css={{
                                height: "auto",
                                minWidth: "100%",
                            }}
                        >
                            <Table.Header>
                                <Table.Column>NAME</Table.Column>
                                <Table.Column>ORIGIN</Table.Column>
                                <Table.Column>CREATION</Table.Column>
                                <Table.Column>UNWANTED</Table.Column>
                                <Table.Column>WANTED</Table.Column>
                                <Table.Column>REMOVE</Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {image.tags.map((tag, i) =>
                                    <Table.Row key={i}>
                                        <Table.Cell>{tag.name}</Table.Cell>
                                        <Table.Cell>{tag.origin.name}</Table.Cell>
                                        <Table.Cell>{tag.creationDate.toDateString()}</Table.Cell>
                                        <Table.Cell><Button color="error" onPress={() => { postTagUnwanted(tag.name) }} auto css={{ color: "black" }}>UNWANTED TAG</Button></Table.Cell>
                                        <Table.Cell><Button color="success" onPress={() => { postTagWanted(tag.name) }} auto css={{ color: "black" }}>WANTED TAG</Button></Table.Cell>
                                        <Table.Cell><Button color="warning" onPress={() => { putImageTagsPull(tag.name) }} auto css={{ color: "black" }}>REMOVE TAG</Button></Table.Cell>
                                    </Table.Row>)}
                            </Table.Body>
                        </Table> :
                        <></>
                    }
                    <div>UserID: {image.user.originID}</div>
                    <div>UserName: {image.user.name}</div>
                    <Button shadow color="error" auto onPress={postUserUnwanted} css={{ color: "black" }}>REMOVE USER</Button>
                    <Button shadow color="error" auto onPress={deleteImage} css={{ color: "black" }}>REMOVE IMAGE</Button>
                </> :
                <></>
            }

            {/* Error Modal */}
            <ModalError {...modal}/>
        </>
    );
}