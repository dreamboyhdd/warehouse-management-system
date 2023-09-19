import React, { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


const ConfirmAlert_MasterComp = ({
    props
}) => {
    // export const ConfirmAlert_Master = (props) => {
    debugger
    const Delete = () => {
        alert(props.index);
    }

    const NotDelete = () => {
        alert(2);
    }
    return (
        confirmAlert({
            title: 'XÁC NHẬN XÓA',
            message: 'Bạn muốn xóa nó?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => Delete()
                },
                {
                    label: 'No',
                    onClick: () => NotDelete()
                }
            ]
        })
    )
}
export const ConfirmAlert_Master = React.memo(ConfirmAlert_MasterComp);