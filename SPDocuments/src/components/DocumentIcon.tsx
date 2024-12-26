import * as React from 'react';
import { TypeIconMapping } from '../types/TypeIconMapping';
import { FileIconElement } from '../types/DocumentListTypes';

const DocumentIcon: React.FC<{ fileType: string }> = (props) => {
    const { fileType } = props;
    const imageName: string | undefined = TypeIconMapping.find((element: FileIconElement) => element.Key === fileType)?.Value;
    const imageUrl = imageName ? `https://res-1.cdn.office.net/files/fabric-cdn-prod_20240610.001/assets/item-types/20/${imageName}.svg`
        : 'https://res-2-gcch.cdn.office.net/files/fabric-cdn-prod_20240610.001/assets/item-types/20/genericfile.svg'

    return (
        <img src={imageUrl} alt={imageName ? imageName : "genericfile-icon"} />
    );
};

export default DocumentIcon;
