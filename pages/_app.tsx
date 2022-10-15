import React, { Component } from "react";
import Head from "next/head";
import { scrollbar } from "@components/global/scrollbar";
import { NextUIProvider } from '@nextui-org/react';
import { SessionProvider } from "next-auth/react"
import type { AppProps } from "next/app"
import { Session } from "next-auth";

// Use the <SessionProvider> to improve performance and allow components that call
// `useSession()` anywhere in your application to access the `session` object.
const App = ({ Component, pageProps }) => {
    return (
        <>
            <NextUIProvider>
                <Head>
                    <title>{Component.title}</title>
                    <meta property="og:title" content={Component.title} key="title" />
                </Head>

                <SessionProvider
                    // Provider options are not required but can be useful in situations where
                    // you have a short session maxAge time. Shown here with default values.
                    session={pageProps.session}
                >
                    <Component {...pageProps} />
                </SessionProvider>

                <style jsx global>{`
                        ${scrollbar}
                        body {
                            margin: 0;
                            font-family: Poppins;
                            background: white;
                            color: rgb(20, 20, 20);
                            
                            font-size: 14px; 
                            font-style: normal; 
                            font-variant: normal; 
                            font-weight: 800;    
                            overflow-x: hidden;           
                        }
                    `}
                </style>
            </NextUIProvider>
        </>
    );
};

App.displayName = 'MyApp';

export default App;
