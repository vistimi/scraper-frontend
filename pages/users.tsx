import React, { useEffect, useState } from 'react';
import { Api } from "@services/api";
import { Button, Table, Modal, Text } from '@nextui-org/react';
import { UserSchema } from '@apiTypes/responseSchema';

export default function Users(props: {}) {
    const api: Api = new Api();
    const [usersUnwanted, setUsersUnwanted] = useState<UserSchema[]>([]);
    const [modalVisibility, setModalVisibility] = useState<boolean>(false);
    const [modalMessage, setmodalMessage] = useState<string>("");

    useEffect(() => {
        (async () => {
            try {
                const api: Api = new Api();
                await loadUsersUnwanted(api);
            } catch (error) {
                setmodalMessage(`${error}`); setModalVisibility(true);
            }
        })();
    }, [])

    const loadUsersUnwanted = async (api: Api) => {
        try {
            const usersUnwanted = await api.getUsersUnwanted();
            if (usersUnwanted) {
                usersUnwanted.forEach(user => user.creationDate = new Date(user.creationDate));
            }
            setUsersUnwanted(usersUnwanted || []);
        } catch (error) {
            throw error
        }
    }


    const deleteUserUnwanted = async (id: string) => {
        try {
            await api.deleteUserUnwanted(id);
            await loadUsersUnwanted(api);
        } catch (error) {
            setmodalMessage(`${error}`); setModalVisibility(true);
        }
    }

    return <>
        <h1>Users Unwanted</h1>
        {usersUnwanted.length ?
            <Table
                aria-label="Users Unwanted"
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
                    {usersUnwanted.map(user =>
                        <Table.Row key={user._id}>
                            <Table.Cell>{user._id}</Table.Cell>
                            <Table.Cell>{user.name}</Table.Cell>
                            <Table.Cell>{user.origin}</Table.Cell>
                            <Table.Cell>{user.creationDate.toDateString()}</Table.Cell>
                            <Table.Cell><Button color="error" onPress={() => { deleteUserUnwanted(user._id) }} auto css={{ color: "black" }}>DELETE</Button></Table.Cell>
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