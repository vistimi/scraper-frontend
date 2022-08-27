import React, { useEffect, useState } from 'react';
import { Api } from "@services/api";
import { Button, Pagination, Image, Table } from '@nextui-org/react';
import { ImageSchema } from '@apiTypes/responseSchema';
import { ModalError } from '@components/global/modal';
import { PostImageTransfer } from '@apiTypes/requestSchema';
import { NavBar } from '@components/global/navBar';

export default function ImagesWanted() {
    const api: Api = new Api();
    const collection: string = 'wanted';    // name of the db collection

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
        if (ids) {
            setIds(ids.map(tag => tag._id));
            setOrigin(origin);
        } else {
            setModal({ display: true, message: `${origin} is empty` });
        }
    }

    const imageFromPage = async (page: number) => {
        try {
            if (ids.length) {
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
            }
        } catch (error) {
            setModal({ display: true, message: `${error}` });
        }
    };

    const postImageTransfer = async () => {
        const body: PostImageTransfer = {
            originID: image.originID,
            from: collection,
            to: 'pending',
        }
        try {
            await api.postImageTransfer(body);
            setPage(page - 1);
            await getIDs(origin);
        } catch (error) {
            setModal({ display: true, message: `${error}` });
        }
    };


    return (
        <>
            <NavBar />

            <br />
            {/* Image origin */}
            <Button.Group>
                <Button auto onPress={async () => { await getIDs("flickr") }}>Flickr</Button>
                <Button auto onPress={async () => { await getIDs("unsplash") }}>Unsplash</Button>
                <Button auto onPress={async () => { await getIDs("pexels") }}>Pexels</Button>
            </Button.Group>

            {/* Image navigation */}
            <Pagination total={ids.length} initialPage={1} onChange={(page) => { imageFromPage(page) }} key='pagination' />

            {/* Image informations */}
            {image ?
                <>
                    <Image
                        src={`${api.hostName()}/image/file/${image.origin}/${image.originID}/${image.extension}?${new Date().toISOString()}`}
                        width={image.size[0].box.width}
                        height={image.size[0].box.height}
                        alt='image'
                    />
                    <Button shadow color="error" auto onPress={postImageTransfer} css={{ color: "black" }}>PENDING IMAGE</Button>
                    <div>_id: {image._id}</div>
                    <div>originID: {image.originID}</div>
                    <div>width: {image.size[0].box.width}</div>
                    <div>height: {image.size[0].box.height}</div>
                    <div>extension: {image.extension}</div>
                    <div>name: {image.name}</div>
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
                            </Table.Header>
                            <Table.Body>
                                {image.tags.map((tag, i) =>
                                    <Table.Row key={i}>
                                        <Table.Cell>{tag.name}</Table.Cell>
                                        <Table.Cell>{tag.origin.name}</Table.Cell>
                                        <Table.Cell>{tag.creationDate.toDateString()}</Table.Cell>
                                    </Table.Row>)}
                            </Table.Body>
                        </Table> :
                        <></>
                    }
                    <div>UserID: {image.user.originID}</div>
                    <div>UserName: {image.user.name}</div>
                </> :
                <></>
            }

            {/* Error Modal */}
            <ModalError {...modal} />
        </>
    );
}