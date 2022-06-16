import React, { Component } from 'react';
import { Api } from "@services/api";
import { Button } from '@nextui-org/react';


export default class Index extends Component<{}, {}> {
    public static title: string = "index";

    public static getInitialProps = async (context) => {
        try {
            const api = new Api();
            const dbName: string = context.pathname.slice(1);
            return { api };
        } catch (err) {
            return {};
        }
    };

    constructor(props) {
        super(props);
    };

    render() {
        return (
            <>
                <Button>Click me</Button>
                <div>Welcome to Next.js!</div>
            </>
        )
    }
}