import React, { useEffect, useState } from 'react';
import { Api } from "@services/api";
import { Button, Table, Input, Modal, Text } from '@nextui-org/react';
import { TagSchema, UserSchema } from '@apiTypes/responseSchema';
import { PostTagSchema } from '@apiTypes/requestSchema';

export default function Users(props: {}) {
    const api: Api = new Api();
    const [usersUnwanted, setUsersUnwanted] = useState<UserSchema[]>([]);
    const [modalVisibility, setModalVisibility] = useState<boolean>(false);
    const [modalMessage, setmodalMessage] = useState<string>("");

    useEffect(() => {
        (async () => {
            const api: Api = new Api();
            await loadUsersUnwanted(api);
        })();
    }, [])

    const loadUsersUnwanted = async (api: Api) => {
        const usersUnwanted = await api.getUsersUnwanted();
        setUsersUnwanted(usersUnwanted || []);
    }


    const deleteUserUnwanted = async (id: string) => {
        await api.deleteUserUnwanted(id);
        await loadUsersUnwanted(api);
    }

    return <>
        <h1>Users Unwanted</h1>
        {usersUnwanted.length ?
            <Table
                aria-label="Tags Unwanted"
                css={{
                    height: "auto",
                    minWidth: "100%",
                }}
            >
                <Table.Header>
                    <Table.Column>ID</Table.Column>
                    <Table.Column>NAME</Table.Column>
                    <Table.Column>ORIGIN</Table.Column>
                    <Table.Column>CREATION</Table.Column>
                    <Table.Column>DELETE</Table.Column>
                </Table.Header>
                <Table.Body>
                    {usersUnwanted.map(tag =>
                        <Table.Row key={tag._id}>
                            <Table.Cell>{tag._id}</Table.Cell>
                            <Table.Cell>{tag.name}</Table.Cell>
                            <Table.Cell>{tag.origin}</Table.Cell>
                            <Table.Cell>{tag.creationDate}</Table.Cell>
                            <Table.Cell><Button color="error" onPress={() => { deleteUserUnwanted(tag._id) }} auto css={{ color: "black"}}>DELETE</Button></Table.Cell>
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