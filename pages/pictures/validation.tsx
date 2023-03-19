import React  from 'react';
import { getSession } from "next-auth/react"
import { Labeller, LabellerProps } from '@components/global/labeller';

export default function Validation() {
    const labellerProps: LabellerProps = {transferFrom: 'validation', transferTo: 'process', editImages: true};
    return (
        <Labeller {...labellerProps}/>
    );
}