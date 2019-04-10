import React from "react";
import {Button, Col} from 'react-bootstrap'
import {
    ProfileWrapper,
} from "./profile-uploader.style";

/**
 * Basic Uploader UI Component Example
 */

type Props = {
    onDrag: () => void,
    onDrop: () => void,
    onDragLeave: () => void,
    onClickFile: () => void,
    overrideEventDefaults: () => void,
    uploadedFiles: Array<Object>,
    uploadedFiles: Array<UploadedFiles>,
    className: String,
};

export const ProfileUploader = (props: Props) => {
    return (
        <ProfileWrapper
            {...{
                onDragStart: props.overrideEventDefaults,
                onDragOver: props.overrideEventDefaults,
                onDragEnd: props.overrideEventDefaults,
                onDrag: props.overrideEventDefaults,
                onDragLeave: props.onDragLeave,
                onDragEnter: props.onDragEnter,
                onDrop: props.onDrop,
                className: props.className
            }}
        >
            {/*{props.uploadedFiles && props.uploadedFiles.length > 0 && (*/}
            {/*<ImgStyle src={props.uploadedFiles[props.uploadedFiles.length - 1].uri} alt="profile" />*/}
            {/*)}*/}
            <Button variant='outline-dark' onClick={props.onClickFile}>
                Upload File
            </Button >
            {/*<Button variant='outline-dark'>*/}
            {/*Link File*/}
            {/*</Button>*/}
        </ProfileWrapper>
    );
};

