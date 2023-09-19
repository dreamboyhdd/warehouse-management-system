import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import I18n from '../Language';

const SelectInventoryComp = ({
    onSelected = () => { },
    IsLoad = -1,
    items = 0,
    isMulti = false,
}) => {

    const [data, setData] = useState([])
    const [valueS, setValueS] = useState({ value: 0, label: "All" })
    const onSelecteItem = (item) => {
        onSelected(item)
        setValueS(item);
    }

    const SelectInventory = () => {
        setData(
            [
                { value: 0, label: "All" },
                { value: 1, label: "Is inventory" },
                { value: 2, label: "Sold out" }
            ]
        )
    }

    useEffect(() => {
        SelectInventory()
    }, [IsLoad]);

    useEffect(() => {
        if (items != 0 && items != -1) {
            let ar = data.find(a => a.value == items)
            ar ? setValueS(ar) : setValueS({ value: 0, label: 'All' })
        }
        else {
            if (isMulti === false) {
                setValueS({ value: -1, label: 'All' })
            } else {
                setValueS([])
            }
        }
    }, [items]);

    return (
        <Select className="SelectMeno"
            value={valueS}
            onChange={onSelecteItem}
            options={data}
            isMulti={isMulti}
        />
    )
}


export const SelectInventory = React.memo(SelectInventoryComp)