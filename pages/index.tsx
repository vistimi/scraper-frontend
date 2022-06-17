import React, { Component, useState } from 'react';
import { Api } from "@services/api";
import { Button, Image } from '@nextui-org/react';
import { ImageSchema, TagSchema } from "@apiTypes/apiSchema";

interface IndexState {
    image: ImageSchema,
    imageUrl: string,
}
export default class Index extends Component<{}, IndexState> {
    public static title: string = "index";
    private api: Api = new Api();

    constructor(props: {}) {
        super(props);
        this.state = {
            image: null,
            imageUrl: ""
        }
    }

    private image = async () => {
        const image = await this.api.getImage("flickr", "62ac9e12190855a25499923f");
        this.setState({ image, imageUrl: `${this.api.hostName()}/image/load/flickr/${image.path}` })
    };

    render() {
        return (
            <>
                <Button onPress={this.image}>Click me</Button>
                {this.state.image ?
                    <>
                        <Image src={this.state.imageUrl} alt="Image" />
                        <div>_id: {this.state.image._id}</div>
                        <div>flickId: {this.state.image.flickId}</div>
                        <div>width: {this.state.image.width}</div>
                        <div>height: {this.state.image.height}</div>
                        <div>title: {this.state.image.title}</div>
                        <div>description: {this.state.image.description}</div>
                        <div>license: {this.state.image.license}</div>
                        <div>tags: {this.state.image.tags.map(tag => <>
                            <div>name: {tag.name}</div>
                            <div>origin: {tag.origin}</div>
                            <div key={tag.name}>creationDate: {`${tag.creationDate}`}</div>
                        </>
                        )}</div>
                        <div>creationDate: {`${this.state.image.creationDate}`}</div>
                    </> :
                    <></>
                }
            </>
        )
    }
}