import React, { Component, useEffect } from 'react';
import { Api } from "@services/api";
import { Button, Image, Collapse, Text, Pagination, Modal } from '@nextui-org/react';
import { ImageSchema } from '@apiTypes/responseSchema';
import { PostTagSchema } from '@apiTypes/requestSchema';

interface IndexProps { }
interface IndexState {
    ids: string[],
    image: ImageSchema,
    imageUrl: string,
    modalVisibility: boolean,
    modalMessage: string,
}
export default class Index extends Component<IndexProps, IndexState> {
    public static title: string = "index";
    private api: Api = new Api();

    constructor(props: IndexProps) {
        super(props);
        this.state = {
            ids: [],
            image: null,
            imageUrl: "",
            modalVisibility: false,
            modalMessage: "",
        }
    }

    async componentDidMount(): Promise<void> {
        const tags = await this.api.getImageIds("flickr");
        const ids = tags.map(tag => tag._id);
        this.setState({ ids });
    }

    componentDidUpdate(prevProps: Readonly<IndexProps>, prevState: Readonly<IndexState>): void {
        if (prevState.ids !== this.state.ids) {
            this.image(1)
        }
    }

    private image = async (page: number) => {
        const image = await this.api.getImage("flickr", this.state.ids[page - 1]);
        this.setState({ image, imageUrl: `${this.api.hostName()}/image/file/flickr/${image.path}` })
    };

    private tagUnwanted = async (name: string) => {
        const body: PostTagSchema = {
            name: name,
            origin: "gui",
        }
        try {
            await this.api.postTagUnwanted(body);
        } catch (error) {
            this.setState({modalVisibility: true, modalMessage: `${error}`})
        }

    }

    private setPage = (page: number) => {
        this.image(page);
    }

    private closeModal = () => {
        this.setState({ modalVisibility: false });
    };

    render() {
        return (
            <>
                <Pagination total={this.state.ids.length + 1} initialPage={1} onChange={(page) => { this.setPage(page) }} />
                {this.state.image ?
                    <>
                        <Image src={this.state.imageUrl} alt="Image" key={'file'} width={this.state.image.width} height={this.state.image.height} />
                        <div>_id: {this.state.image._id}</div>
                        <div>flickId: {this.state.image.flickId}</div>
                        <div>width: {this.state.image.width}</div>
                        <div>height: {this.state.image.height}</div>
                        <div>title: {this.state.image.title}</div>
                        <div>description: {this.state.image.description}</div>
                        <div>license: {this.state.image.license}</div>
                        <div>creationDate: {`${this.state.image.creationDate}`}</div>
                        <Collapse.Group>
                            {this.state.image.tags ?
                                this.state.image.tags.map(tag =>
                                    <Collapse title={tag.name} key={tag.name}>
                                        <Text>Origin: {tag.origin}</Text>
                                        <Text>Creation: {tag.creationDate}</Text>
                                        <Button shadow color="error" auto onPress={() => { this.tagUnwanted(tag.name) }}>Ban tag</Button>
                                    </Collapse>
                                ) :
                                <></>}
                        </Collapse.Group>
                    </> :
                    <></>
                }
                <Modal
                    closeButton
                    aria-labelledby="modal-title"
                    open={this.state.modalVisibility}
                    onClose={this.closeModal}
                >
                    <Modal.Header>
                        <Text id="modal-title" b size={18}>
                            Error message
                        </Text>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.modalMessage}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button auto flat color="error" onClick={this.closeModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}