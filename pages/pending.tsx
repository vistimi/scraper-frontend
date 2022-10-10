import React from 'react';
import { Labeller, LabellerProps } from '@components/global/labeller';

export default function ImagesPending() {
    const labellerProps: LabellerProps = {transferFrom: 'pending', transferTo: 'validation', editImages: true};
    return (
        <Labeller {...labellerProps}/>
    );
}