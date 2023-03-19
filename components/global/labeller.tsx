import React, { useEffect, useState } from 'react';
import { Api } from "@services/api";
import { Button, Collapse, Pagination, Table } from '@nextui-org/react';
import { PictureSchema, TagSchema, UserSchema } from 'schemas/responseSchema';
import { DeleteImageTagSchema, PostImageTransfer, PostImageUnwantedSchema } from 'schemas/requestSchema';
import { ImageEditor } from '@components/image/imageEditor';
import { NavBar } from '@components/global/navBar';

export interface LabellerProps {
    transferFrom: string,
    transferTo: string,
    editImages: boolean,
}

export const Labeller = (props: LabellerProps): JSX.Element => {
    const api: Api = new Api();
    const collection: string = props.transferFrom;

    const [ids, setIds] = useState<string[]>([]);
    const [image, setImage] = useState<PictureSchema>(null);
    const [modal, setModal] = useState<{ display: boolean, message: string }>({ display: false, message: "" });
    const [origin, setOrigin] = useState<string>("flickr");
    const [page, setPage] = useState<number>(1);

    // when the elements are mounted, called once per lifetime
    useEffect(() => {
        (async () => {
            await getIDs(origin);
        })();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        (async () => {
            await imageFromPage(page);
        })();
    }, [ids]) // eslint-disable-line react-hooks/exhaustive-deps

    /**
     * getIds fetches all IDs and reload the first image
     * @param origin the name of the original website
     */
    const getIDs = async (origin: string) => {
        const ids = await api.getImageIds(origin, collection);
        if (ids?.length) {
            setIds(ids.map(tag => tag.id));
            setOrigin(origin);
        } else {
            setModal({ display: true, message: `${origin} is empty` });
        }
    }

    const imageFromPage = async (page: number) => {
        try {
            if (ids?.length) {
                const image = await api.getImage(origin, ids[page - 1], collection);
                image.creationDate = new Date(image.creationDate);
                image.tags?.forEach(tag => tag.creationDate = new Date(tag.creationDate));
                image.sizes?.forEach(size => size.creationDate = new Date(size.creationDate));
                image.sizes?.sort((a, b) => Number(b.creationDate) - Number(a.creationDate)); // most recent date first
                setImage(image)
            }
        } catch (error) {
            setModal({ display: true, message: `${error}` });
        }
    };

    const postTagUnwanted = async (name: string) => {
        const body: TagSchema = {
            name: name,
            originName: "gui"
        }
        try {
            await api.postTagUnwanted(body);
            await getIDs(origin);
        } catch (error) {
            setModal({ display: true, message: `${error}` });
        }
    }

    const postTagWanted = async (name: string) => {
        const body: TagSchema = {
            name: name,
            originName: "gui"
        }
        try {
            await api.postTagWanted(body);
        } catch (error) {
            setModal({ display: true, message: `${error}` });
        }
    }

    const postUserUnwanted = async () => {
        const body: UserSchema = {
            origin: origin,
            name: image.user.name,
            originID: image.user.originID,
        }
        try {
            await api.postUserUnwanted(body);
            await getIDs(origin);
        } catch (error) {
            setModal({ display: true, message: `${error}` });
        }
    }

    const postImageUnwanted = async () => {
        const bodyPostImageUnwantedSchema: PostImageUnwantedSchema = {
            origin: origin,
            id: image.id,
        }
        await api.postImageUnwanted(bodyPostImageUnwantedSchema);   // insert unwanted image
        await api.deleteImage(image.origin, image.id, image.name);   // delete pending image
        setPage(page - 1);
        await getIDs(origin);
    };

    const deleteImage = async () => {
        await api.deleteImage(image.origin, image.id, image.name);   // delete pending image
        setPage(page - 1);
        await getIDs(origin);
    };

    const deleteImageTag = async (id: string) => {
        const body: DeleteImageTagSchema = {
            id: image.id,
            origin: image.origin,
            tagID: id,
        }
        try {
            await api.deleteImageTag(body);
            await imageFromPage(page);
        } catch (error) {
            setModal({ display: true, message: `${error}` });
        }
    };


    const postImageTransfer = async () => {
        const body: PostImageTransfer = {
            origin: image.origin,
            id: image.id,
            from: collection,
            to: props.transferTo,
        }
        try {
            await api.postImageTransfer(body);
            await getIDs(origin);
            setPage(page - 1);
        } catch (error) {
            setModal({ display: true, message: `${error}` });
        }
    };

    return (
        <>
            <NavBar />
            
            {/* Image origin */}
            <Button.Group>
                <Button auto onPress={async () => { await getIDs("flickr") }}>Flickr</Button>
                <Button auto onPress={async () => { await getIDs("unsplash") }}>Unsplash</Button>
                <Button auto onPress={async () => { await getIDs("pexels") }}>Pexels</Button>
            </Button.Group>

            {/* Image navigation */}
            <Pagination total={ids?.length} initialPage={1} onChange={(page) => { imageFromPage(page); setPage(page) }} key='pagination' />

            {/* Image informations */}
            {image ?
                <>
                    <ImageEditor
                        api={api}
                        image={image}
                        updateParent={async () => { await imageFromPage(page) }}
                        interactWithCanvas={props.editImages}
                        key='imageEditor'
                    />
                    <Button shadow color="success" auto onPress={postImageTransfer} css={{ color: "black" }}>TRANSFER IMAGE</Button>
                    {image.tags ?
                        <Collapse.Group>
                            <Collapse title="Custom tags" expanded>
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
                                        {image.tags.filter(tag => !!tag.boxInformation?.confidence).map((tag, i) =>
                                            <Table.Row key={i}>
                                                <Table.Cell>{tag.name}</Table.Cell>
                                                <Table.Cell>{tag.originName}</Table.Cell>
                                                <Table.Cell>{tag.creationDate.toDateString()}</Table.Cell>
                                                <Table.Cell><Button color="error" onPress={() => { postTagUnwanted(tag.name) }} auto css={{ color: "black" }}>UNWANTED TAG</Button></Table.Cell>
                                                <Table.Cell><Button color="success" onPress={() => { postTagWanted(tag.name) }} auto css={{ color: "black" }}>WANTED TAG</Button></Table.Cell>
                                                <Table.Cell><Button color="warning" onPress={() => { deleteImageTag(tag.id) }} auto css={{ color: "black" }}>REMOVE TAG</Button></Table.Cell>
                                            </Table.Row>)}
                                    </Table.Body>
                                </Table>
                                <br />
                            </Collapse>
                            <Collapse title="Original tags">
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
                                    </Table.Header>
                                    <Table.Body>
                                        {image.tags.filter(tag => !tag.boxInformation?.confidence).map((tag, i) =>
                                            <Table.Row key={i}>
                                                <Table.Cell>{tag.name}</Table.Cell>
                                                <Table.Cell>{tag.originName}</Table.Cell>
                                                <Table.Cell>{tag.creationDate.toDateString()}</Table.Cell>
                                            </Table.Row>)}
                                    </Table.Body>
                                </Table>
                                <br />
                            </Collapse>
                        </Collapse.Group> :
                        <></>
                    }
                    {
                        props.editImages ?
                            <>
                                <div>_id: {image.id}</div>
                                <div>originID: {image.originID}</div>
                                <div>width: {image.sizes[0].box.width}</div>
                                <div>height: {image.sizes[0].box.height}</div>
                                <div>extension: {image.extension}</div>
                                <div>name: {image.name}</div>
                                <div>license: {image.license}</div>
                                <div>creationDate: {image.creationDate.toDateString()}</div>
                                <div>title: {image.title}</div>
                                <div>description: {image.description}</div>
                                <div>UserID: {image.user.originID}</div>
                                <div>UserName: {image.user.name}</div>
                                <Button shadow color="error" auto onPress={deleteImage} css={{ color: "black" }}>REMOVE IMAGE</Button>
                                <Button shadow color="error" auto onPress={postUserUnwanted} css={{ color: "black" }}>UNDESIRED USER</Button>
                                <Button shadow color="error" auto onPress={postImageUnwanted} css={{ color: "black" }}>UNDESIRED IMAGE</Button>
                            </>
                            : <></>
                    }

                </> :
                <></>
            }

            {/* Error Modal */}
            {/* <ModalError {...modal} /> */}
        </>
    );
}