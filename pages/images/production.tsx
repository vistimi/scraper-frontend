import React from 'react';
import { getSession } from "next-auth/react"
import { Labeller, LabellerProps } from '@components/global/labeller';

export default function Production() {
    const labellerProps: LabellerProps = {transferFrom: 'production', transferTo: 'pending', editImages: false};
    return (
        <Labeller {...labellerProps}/>
    );
}