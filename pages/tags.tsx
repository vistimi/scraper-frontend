import React, { useEffect, useState } from 'react';
import { Api } from "@services/api";
import { Button, Table, Input, Modal, Text } from '@nextui-org/react';
import { TagSchema } from '@apiTypes/responseSchema';
import { PostTagSchema } from '@apiTypes/requestSchema';

interface IndexProps { }
interface IndexState {
    tagsUnwanted: TagSchema[],
    tagsWanted: TagSchema[],
}

export default function Tags(props: IndexProps) {
    const api: Api = new Api();
    const [tagsWanted, setTagsWanted] = useState<TagSchema[]>([]);
    const [tagsUnwanted, setTagsUnwanted] = useState<TagSchema[]>([]);
    const [modalVisibility, setModalVisibility] = useState<boolean>(false);
    const [modalMessage, setmodalMessage] = useState<string>("");

    useEffect(() => {
        (async () => {
            const api: Api = new Api();
            await loadTagsWanted(api);
            await loadTagsUnwanted(api);
        })();
    }, [])

    const loadTagsWanted = async (api: Api) => {
        const tagsWanted = await api.getTagsWanted();
        setTagsWanted(tagsWanted || []);
    }

    const loadTagsUnwanted = async (api: Api) => {
        const tagsUnwanted = await api.getTagsUnwanted();
        setTagsUnwanted(tagsUnwanted || []);
    }


    const deleteTagUnwanted = async (id: string) => {
        await api.deleteTagUnwanted(id);
        await loadTagsUnwanted(api);
    }

    const deleteTagWanted = async (id: string) => {
        await api.deleteTagWanted(id);
        await loadTagsWanted(api);
    }

    const addTagWanted = async (e) => {
        try {
            if (e.key === 'Enter') {
                const body: PostTagSchema = {
                    name: e.target.value,
                    origin: "gui",
                }
                await api.postTagWanted(body);
                await loadTagsWanted(api);
            }
        }
        catch (error) {
            setmodalMessage(`${error}`);
            setModalVisibility(true);
        }
    }

    const addTagUnwanted = async (e) => {
        try {
            if (e.key === 'Enter') {
                const body: PostTagSchema = {
                    name: e.target.value,
                    origin: "gui",
                }
                await api.postTagUnwanted(body);
                await loadTagsUnwanted(api);
            }
        }
        catch (error) {
            setmodalMessage(`${error}`);
            setModalVisibility(true);
        }
    }

    return <>
        {/* Tags wanted deletion and addition */}
        {tagsWanted.length ?
            <>
                <h1>Tags Wanted</h1>
                <Table
                    aria-label="Tags Wanted"
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
                        {tagsWanted.map(tag =>
                            <Table.Row key={tag._id}>
                                <Table.Cell>{tag._id}</Table.Cell>
                                <Table.Cell>{tag.name}</Table.Cell>
                                <Table.Cell>{tag.origin}</Table.Cell>
                                <Table.Cell>{tag.creationDate}</Table.Cell>
                                <Table.Cell><Button color="error" onPress={() => { deleteTagWanted(tag._id) }}>DELETE</Button></Table.Cell>
                            </Table.Row>)}
                    </Table.Body>
                </Table>
            </> :
            <></>
        }
        <Input label="Add Tag Wanted" placeholder="Tag Name" onKeyDown={addTagWanted} />

        {/* Tags unwanted deletion and addition */}
        {tagsUnwanted.length ?
            <>
                <h1>Tags Unwanted</h1>
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
                        {tagsUnwanted.map(tag =>
                            <Table.Row key={tag._id}>
                                <Table.Cell>{tag._id}</Table.Cell>
                                <Table.Cell>{tag.name}</Table.Cell>
                                <Table.Cell>{tag.origin}</Table.Cell>
                                <Table.Cell>{tag.creationDate}</Table.Cell>
                                <Table.Cell><Button color="error" onPress={() => { deleteTagUnwanted(tag._id) }}>DELETE</Button></Table.Cell>
                            </Table.Row>)}
                    </Table.Body>
                </Table>
            </> :
            <></>
        }
        <Input label="Add Tag Unwanted" placeholder="Tag Name" onKeyDown={addTagUnwanted} />

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