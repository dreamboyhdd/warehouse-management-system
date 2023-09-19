import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import I18n from '../Language';

const SelectCustomerTypeComp = ({
    onSelected = () => { },
    IsLoad = -1,
    items = 0,
    isMulti = false,
}) => {

    const [data, setData] = useState([])
    const [valueS, setValueS] = useState({ value: "-1", label: 'Select Please' })
    const onSelecteItem = (item) => {
        onSelected(item)
        setValueS(item);
    }

    const WH_WH_spSelect_CustomerType = () => {
        setData(
            [
                { value: -1, label: "Select Please" },
                { value: 1, label: 'Khách Cá Nhân' },
                { value: 2, label: 'Khách Doanh Nghiệp' },
                { value: 3, label: 'Khách Sàn TMDT' },
                { value: 4, label: 'Khách Shop Online' },
                { value: 5, label: 'Khách Doanh Nghiệp CPN/Logistics' },
                { value: 6, label: 'Khách Mã Nội Bộ' },
            ]
        )
    }

    useEffect(() => {
        WH_WH_spSelect_CustomerType()
    }, [IsLoad]);

    useEffect(() => {
        if (items != 0 && items != -1) {
            let ar = data.find(a => a.value == items)
            ar ? setValueS(ar) : setValueS({ value: 0, label: 'Select Please' })
        }
        else {
            if (isMulti === false) {
                setValueS({ value: -1, label: 'Select Please' })
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


export const SelectCustomerType = React.memo(SelectCustomerTypeComp)