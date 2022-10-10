import React from 'react';
import { Labeller, LabellerProps } from '@components/global/labeller';

export default function ImagesWanted() {
    const labellerProps: LabellerProps = {transferFrom: 'production', transferTo: 'pending', editImages: false};
    return (
        <Labeller {...labellerProps}/>
    );
}