import React, { Component } from "react";
import Head from "next/head";
import { scrollbar } from "@components/global/scrollbar";
import { NextUIProvider } from '@nextui-org/react';
import Styled from 'styled-components';
import { NavBar } from "@components/global/navBar";

export const MainPadding = Styled.span`
    top: 80px;
    width: 100%;
    height: calc(100% - 80px);
    position: absolute;
    left: 0;
`;

const App = ({ Component, pageProps }) => {
    return (
        <>
            <NextUIProvider>
                <Head>
                    <title>{Component.title}</title>
                    <meta property="og:title" content={Component.title} key="title" />
                </Head>

                <NavBar currentPage={Component.title}/>
                
                {/* MainPadding is the NavBar spacer */}
                <MainPadding>
                    <Component {...pageProps} />
                </MainPadding>


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
