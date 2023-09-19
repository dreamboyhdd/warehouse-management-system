import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { mainAction } from '../Redux/Actions';
import { APIKey } from '../Services/Api';
import I18n from '../Language';
import { GetDataFromLogin, Alerterror } from "../Utils";


const SelectWarehouseContractComp = React.forwardRef(({
    onSelected = () => { },
    items = 0,
    WareHouseId = 0,
    CustomerId = 0,
    isDisabled = false,
    isMulti = false
}, ref) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([])
    const [valueS, setValueS] = useState({value:0})
    const onSelecteItem = (item) => {
        onSelected(item)
        setValueS(item);
    }
    // useEffect(() => {
    //     if (valueS.value !== 0)
    //         onSelecteItem(valueS)
    // }, [valueS]);
    const WH_spWareHouse_Contract_List = async () => {
        // check load data all or follow DepartId
        if (WareHouseId === -1) {
            setValueS({ value: -1, label: 'Select Please' })
            setData([]);
            return;
        }
        if (CustomerId === -1) {
            setValueS({ value: -1, label: 'Select Please' })
            setData([]);
            return;
        }
        try {
            const params = {
                Json: JSON.stringify({
                    CustomerId: CustomerId,
                    WareHouseId: WareHouseId,
                    UserId: GetDataFromLogin("AccountId")
                }),
                func: "WH_spWareHouse_Contract_List",
                API_key: APIKey
            }
            const list = await mainAction.API_spCallServer(params, dispatch);
            const FirstData = { value: -1, label: 'Select Please' };
            let dataSelect = [];
            if (isMulti === false) {
                dataSelect.push(FirstData);
                setValueS(FirstData);
            }
            list.forEach((element, index) => {
                dataSelect.push({ value: element.WareHouseId, name: element.WareHouseName, label: element.WareHouseCode + '-' + element.WareHouseName });
            });
            if (items != 0 && items != -1) {
                let ar = list.find(a => a.WareHouseId === items);
                setValueS({ value: ar.WareHouseId, label: ar.WareHouseName });
            } // Active
            setData(dataSelect)
        } catch (error) {
            Alerterror(I18n.t("validate.Dataerror,pleasecontactITNETCO!"));
            console.log(error, "WH_spWareHouse_Contract_List")
        }
    }

    useEffect(() => {
        WH_spWareHouse_Contract_List()
    }, [WareHouseId, CustomerId]);

    useEffect(() => {
        debugger
        if (items != 0 && items != -1) {
            let ar = data.filter(a => a.value == items)
            setValueS(ar)
        } else {
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
            isDisabled={isDisabled}
            ref={ref}
        />
    )
});

export const SelectWarehouseContract = React.memo(SelectWarehouseContractComp)