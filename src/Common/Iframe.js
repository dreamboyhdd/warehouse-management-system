import React from 'react';
import { Loader } from '../Utils';

export const Iframe = ({ url, className }) => {
    if (!url) {
        return <Loader />;
    }

    return (
        <iframe src={url} className={className} ></iframe>
    );
};

