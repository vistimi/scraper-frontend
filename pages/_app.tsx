import React, { Component } from "react";
import Head from "next/head";
import { scrollbar } from "@components/global/scrollbar";
import { NextUIProvider } from '@nextui-org/react';

const App = ({ Component, pageProps }) => {
    return (
        <>
            <NextUIProvider>
                <Head>
                    <title>{Component.title}</title>
                    <meta property="og:title" content={Component.title} key="title" />
                </Head>

                <Component {...pageProps} />

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
