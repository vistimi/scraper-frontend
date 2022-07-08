import React, { useEffect, useState } from 'react';
import { Api } from "@services/api";
import { Button, Table, Input, Modal, Text } from '@nextui-org/react';
import { ImageSchema, TagSchema, UserSchema } from '@apiTypes/responseSchema';
import { DeleteImageSchema, DeleteImageUnwantedSchema, PostTagSchema } from '@apiTypes/requestSchema';

export default function ImagesUnwanted(props: {}) {
    const api: Api = new Api();
    const [imagesUnwanted, setImagesUnwanted] = useState<ImageSchema[]>([]);
    const [modalVisibility, setModalVisibility] = useState<boolean>(false);
    const [modalMessage, setmodalMessage] = useState<string>("");

    useEffect(() => {
        (async () => {
            try {
                const api: Api = new Api();
                await loadImagesUnwanted(api);
            } catch (error) {
                setmodalMessage(`${error}`); setModalVisibility(true);
            }
        })();
    }, [])

    const loadImagesUnwanted = async (api: Api) => {
        try {
            const imagesUnwanted = await api.getImagesUnwanted();
            if (imagesUnwanted) {
                imagesUnwanted.forEach(image => image.creationDate = new Date(image.creationDate));
            }
            setImagesUnwanted(imagesUnwanted || []);
        } catch (error) {
            throw error
        }
    }


    const deleteImageUnwanted = async (id: string) => {
        try {
            await api.deleteImageUnwanted(id);
            await loadImagesUnwanted(api);
        } catch (error) {
            setmodalMessage(`${error}`); setModalVisibility(true);
        }
    }

    return <>
        <h1>Images Unwanted</h1>
        {imagesUnwanted.length ?
            <Table
                aria-label="Images Unwanted"
                css={{
                    height: "auto",
                    minWidth: "100%",
                }}
            >
                <Table.Header>
                    <Table.Column>ID</Table.Column>
                    <Table.Column>ORIGIN</Table.Column>
                    <Table.Column>ORIGINID</Table.Column>
                    <Table.Column>CREATION</Table.Column>
                    <Table.Column>DELETE</Table.Column>
                </Table.Header>
                <Table.Body>
                    {imagesUnwanted.map(image =>
                        <Table.Row key={image._id}>
                            <Table.Cell>{image._id}</Table.Cell>
                            <Table.Cell>{image.origin}</Table.Cell>
                            <Table.Cell>{image.originID}</Table.Cell>
                            <Table.Cell>{image.creationDate.toDateString()}</Table.Cell>
                            <Table.Cell><Button color="error" onPress={() => { deleteImageUnwanted(image._id) }} auto css={{ color: "black" }}>DELETE</Button></Table.Cell>
                        </Table.Row>)}
                </Table.Body>
            </Table> :
            <></>
        }

        {/* Error Modal */}
        <Modal closeButton aria-labelledby="modal-title" open={modalVisibility} onClose={() => { setModalVisibility(false) }}>
            <Modal.Header>
                <Text id="modal-title" b size={18}>Error message</Text>
            </Modal.Header>
            <Modal.Body>{modalMessage}</Modal.Body>
            <Modal.Footer>
                <Button auto flat color="error" onPress={() => { setModalVisibility(false) }}>Close</Button>
            </Modal.Footer>
        </Modal>
    </>;
}