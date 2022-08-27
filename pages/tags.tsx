import React, { useEffect, useState } from 'react';
import { Api } from "@services/api";
import { Button, Table, Input } from '@nextui-org/react';
import { TagSchema } from '@apiTypes/responseSchema';
import { PostTagSchema } from '@apiTypes/requestSchema';
import { ModalError } from '@components/global/modal';
import { NavBar } from '@components/global/navBar';

export default function Tags() {
    const api: Api = new Api();
    const [tagsWanted, setTagsWanted] = useState<TagSchema[]>([]);
    const [tagsUnwanted, setTagsUnwanted] = useState<TagSchema[]>([]);
    const [modal, setModal] = useState<{ display: boolean, message: string }>({ display: false, message: "" });

    useEffect(() => {
        (async () => {
            const api: Api = new Api();
            await loadTagsWanted(api);
            await loadTagsUnwanted(api);
        })();
    }, [])

    const loadTagsWanted = async (api: Api) => {
        try {
            const tagsWanted = await api.getTagsWanted();
            if (tagsWanted) {
                tagsWanted.forEach(tag => tag.creationDate = new Date(tag.creationDate));
            }
            setTagsWanted(tagsWanted || []);
        } catch (error) {
            throw error
        }
    }

    const loadTagsUnwanted = async (api: Api) => {
        try {
            const tagsUnwanted = await api.getTagsUnwanted();
            if (tagsUnwanted) {
                tagsUnwanted.forEach(tag => tag.creationDate = new Date(tag.creationDate));
            }
            setTagsUnwanted(tagsUnwanted || []);
        } catch (error) {
            throw error
        }
    }


    const deleteTagUnwanted = async (id: string) => {
        try {
            await api.deleteTagUnwanted(id);
            await loadTagsUnwanted(api);
        } catch (error) {
            setModal({ display: true, message: `${error}` });
        }
    }

    const deleteTagWanted = async (id: string) => {
        try {
            await api.deleteTagWanted(id);
            await loadTagsWanted(api);
        } catch (error) {
            setModal({ display: true, message: `${error}` });
        }
    }

    const addTagWanted = async (e) => {
        try {
            if (e.key === 'Enter') {
                const body: PostTagSchema = {
                    name: e.target.value,
                    origin: {
                        "name": "gui",
                    }
                }
                await api.postTagWanted(body);
                await loadTagsWanted(api);
            }
        } catch (error) {
            setModal({ display: true, message: `${error}` });
        }
    }

    const addTagUnwanted = async (e) => {
        try {
            if (e.key === 'Enter') {
                const body: PostTagSchema = {
                    name: e.target.value,
                    origin: {
                        "name": "gui",
                    }
                }
                await api.postTagUnwanted(body);
                await loadTagsUnwanted(api);
            }
        } catch (error) {
            setModal({ display: true, message: `${error}` });
        }
    }

    return <>
        <NavBar />

        {/* Tags wanted deletion and addition */}
        <h1>Tags Wanted</h1>
        <Input label="Add Tag Wanted" placeholder="Tag Name" onKeyDown={addTagWanted} />
        {tagsWanted.length ?
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
                            <Table.Cell>{tag.origin.name}</Table.Cell>
                            <Table.Cell>{tag.creationDate.toDateString()}</Table.Cell>
                            <Table.Cell><Button color="error" onPress={() => { deleteTagWanted(tag._id) }} auto css={{ color: "black" }}>DELETE</Button></Table.Cell>
                        </Table.Row>)}
                </Table.Body>
            </Table> :
            <></>
        }

        {/* Tags unwanted deletion and addition */}
        <h1>Tags Unwanted</h1>
        <Input label="Add Tag Unwanted" placeholder="Tag Name" onKeyDown={addTagUnwanted} />
        {tagsUnwanted.length ?
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
                            <Table.Cell>{tag.origin.name}</Table.Cell>
                            <Table.Cell>{tag.creationDate.toDateString()}</Table.Cell>
                            <Table.Cell><Button color="error" onPress={() => { deleteTagUnwanted(tag._id) }} auto css={{ color: "black" }}>DELETE</Button></Table.Cell>
                        </Table.Row>)}
                </Table.Body>
            </Table> :
            <></>
        }

        {/* Error Modal */}
        <ModalError {...modal} />
    </>;
}