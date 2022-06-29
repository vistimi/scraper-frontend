import React, { Component, useEffect } from 'react';
import { Api } from "@services/api";
import { Button, Image, Text, Pagination, Modal, Loading, Table } from '@nextui-org/react';
import { ImageSchema } from '@apiTypes/responseSchema';
import { DeleteImageSchema, PostImageUnwantedSchema, PostTagSchema, PostUserSchema } from '@apiTypes/requestSchema';

interface IndexProps { }
interface IndexState {
    ids: string[],
    image: ImageSchema,
    imageUrl: string,
    modalVisibility: boolean,
    modalMessage: string,
    origin: string,
}
export default class Index extends Component<IndexProps, IndexState> {
    public static title: string = "images";
    private api: Api = new Api();

    constructor(props: IndexProps) {
        super(props);
        this.state = {
            ids: [],
            image: null,
            imageUrl: "",
            modalVisibility: false,
            modalMessage: "",
            origin: "flickr",
        }
    }

    async componentDidMount(): Promise<void> {
        await this.getIds(this.state.origin)
    }

    componentDidUpdate(prevProps: Readonly<IndexProps>, prevState: Readonly<IndexState>): void {
        if (prevState.ids !== this.state.ids) {
            this.image(1)
        }
    }

    private getIds = async (origin: string) => {
        const tags = await this.api.getImageIds(origin);
        if (tags) {
            const ids = tags.map(tag => tag._id);
            this.setState({ ids, origin });
        } else {
            this.setState({ modalVisibility: true, modalMessage: `${origin} is empty` })
        }
    }

    private image = async (page: number) => {
        try {
            const image = await this.api.getImage(this.state.ids[page - 1]);
            this.setState({ image, imageUrl: `${this.api.hostName()}/image/file/${this.state.origin}/${image.path}` });
        } catch (error) {
            this.setState({ modalVisibility: true, modalMessage: `${error}` });
        }
    };

    private postTagUnwanted = async (name: string) => {
        const body: PostTagSchema = {
            name: name,
            origin: "gui",
        }
        try {
            await this.api.postTagUnwanted(body);
        } catch (error) {
            this.setState({ modalVisibility: true, modalMessage: `${error}` });
        }
    }

    private postTagWanted = async (name: string) => {
        const body: PostTagSchema = {
            name: name,
            origin: "gui",
        }
        try {
            await this.api.postTagWanted(body);
        } catch (error) {
            this.setState({ modalVisibility: true, modalMessage: `${error}` });
        }
    }

    private postUserUnwanted = async () => {
        const body: PostUserSchema = {
            origin: this.state.origin,
            name: this.state.image.user.name,
            originID: this.state.image.user.originID,
        }
        try {
            await this.api.postUserUnwanted(body);
        } catch (error) {
            this.setState({ modalVisibility: true, modalMessage: `${error}` });
        }
    }

    private setPage = (page: number) => {
        this.image(page);
    }

    private closeModal = () => {
        this.setState({ modalVisibility: false });
    };

    private deleteImage = async () => {
        const bodyPostImageUnwantedSchema: PostImageUnwantedSchema = {
            origin: this.state.origin,
            originID: this.state.image.originID,
        }
        await this.api.postImageUnwanted(bodyPostImageUnwantedSchema)

        const bodyDeleteImageSchema: DeleteImageSchema = {
            origin: this.state.origin,
            id: this.state.image._id,
        }
        await this.api.deleteImage(bodyDeleteImageSchema)
        await this.getIds(this.state.origin)
    }

    render() {
        return (
            <>
                <Button.Group>
                    <Button auto onPress={() => { this.getIds("flickr") }}>Flickr</Button>
                    <Button auto onPress={() => { this.getIds("unsplash") }}>Unsplash</Button>
                    <Button auto onPress={() => { this.getIds("pexels") }}>Pexels</Button>
                </Button.Group>

                {/* Image navigation */}
                <Pagination total={this.state.ids.length} initialPage={1} onChange={(page) => { this.setPage(page) }} />

                {/* Image informations */}
                {this.state.image ?
                    <>
                        <Image src={this.state.imageUrl} alt="Image" key={'file'} width={this.state.image.width} height={this.state.image.height} />
                        <div>_id: {this.state.image._id}</div>
                        <div>originID: {this.state.image.originID}</div>
                        <div>width: {this.state.image.width}</div>
                        <div>height: {this.state.image.height}</div>
                        <div>title: {this.state.image.title}</div>
                        <div>description: {this.state.image.description}</div>
                        <div>license: {this.state.image.license}</div>
                        <div>creationDate: {`${this.state.image.creationDate}`}</div>
                        {this.state.image.tags ?
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
                                    <Table.Column>DELETE</Table.Column>
                                    <Table.Column>ADD</Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {this.state.image.tags.map(tag =>
                                        <Table.Row key={tag.name}>
                                            <Table.Cell>{tag.name}</Table.Cell>
                                            <Table.Cell>{tag.origin}</Table.Cell>
                                            <Table.Cell>{tag.creationDate}</Table.Cell>
                                            <Table.Cell><Button color="error" onPress={() => { this.postTagUnwanted(tag.name) }} auto css={{ color: "black" }}>BAN TAG</Button></Table.Cell>
                                            <Table.Cell><Button color="success" onPress={() => { this.postTagWanted(tag.name) }} auto css={{ color: "black" }}>ADD TAG</Button></Table.Cell>
                                        </Table.Row>)}
                                </Table.Body>
                            </Table> :
                            <></>
                        }
                        <div>UserID: {this.state.image.user.originID}</div>
                        <div>UserName: {this.state.image.user.name}</div>
                        <Button shadow color="error" auto onPress={this.postUserUnwanted} css={{ color: "black" }}>REMOVE USER</Button>
                        <Button shadow color="error" auto onPress={this.deleteImage} css={{ color: "black" }}>REMOVE IMAGE</Button>
                    </> :
                    <></>
                }

                {/* Error Modal */}
                <Modal closeButton aria-labelledby="modal-title" open={this.state.modalVisibility} onClose={this.closeModal}>
                    <Modal.Header>
                        <Text id="modal-title" b size={18}>
                            Error message
                        </Text>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.modalMessage}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button auto flat color="error" onPress={this.closeModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}