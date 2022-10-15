import React, { useEffect, useState } from 'react';
import { getSession } from "next-auth/react"
import { Api } from "@services/api";
import { Button, Table } from '@nextui-org/react';
import { ImageSchema } from 'schemas/responseSchema';
import { NavBar } from '@components/global/navBar';

export default function Undesired() {
    const api: Api = new Api();
    const [imagesUnwanted, setImagesUnwanted] = useState<ImageSchema[]>([]);
    const [modal, setModal] = useState<{ display: boolean, message: string }>({ display: false, message: "" });

    useEffect(() => {
        (async () => {
            try {
                await loadImagesUnwanted();
            } catch (error) {
                setModal({ display: true, message: `${error}` });
            }
        })();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const loadImagesUnwanted = async () => {
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
            await loadImagesUnwanted();
        } catch (error) {
            setModal({ display: true, message: `${error}` });
        }
    }

    return <>
        <NavBar/>

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
        {/* <ModalError {...modal} /> */}
    </>;
}