import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { mainAction } from '../Redux/Actions';
import { APIKey } from '../Services/Api';
import I18n from '../Language';
import { GetDataFromLogin, Alerterror, Alertwarning } from "../Utils";

const SelectCustomerComp = React.forwardRef(({
    onSelected = () => { },
    CustomerId = 0,
    AreaId = 0,
    items = 0,
    isDisabled = false,
    isMulti = false
}, ref) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([])
    const [valueS, setValueS] = useState({ value: 0 })
    const onSelecteItem = (item) => {
        onSelected(item)
        setValueS(item);
    }
    // useEffect(() => {
    //     if (valueS.value !== 0)
    //         onSelecteItem(valueS)
    // }, [valueS]);
    const WH_spCustomer_Select = async () => {
        // check load data all or follow CustomerId
        if (CustomerId === -1) {
            setValueS({ value: -1, label: 'Select Please' })
            setData([]);
            return;
        }
        if (AreaId === -1) {
            setValueS({ value: -1, label: 'Select Please' })
            setData([]);
            return;
        }
        try {

            const params = {
                Json: JSON.stringify({
                    CustomerId: CustomerId,
                    AreaId: AreaId,
                    UserId: GetDataFromLogin("AccountId")
                }),
                func: "WH_spCustomer_Select",
                API_key: APIKey
            }
            const list = await mainAction.API_spCallServer(params, dispatch);
            if (list.length > 0) {
                const FirstData = { value: -1, label: 'Select Please' };
                let dataSelect = [];
                if (isMulti === false) {
                    dataSelect.push(FirstData);
                    setValueS(FirstData);
                }
                list.forEach((element, index) => {
                    dataSelect.push({ value: element.CustomerId, name: element.CustomerName, label: element.CustomerName });

                });
                if (items != 0 && items != -1) {
                    let ar = list.find(a => a.CustomerId === items);
                    setValueS({ value: ar.CustomerId, name: ar.CustomerName, label: ar.CustomerName });
                } // Active
                setData(dataSelect)
            }

        } catch (error) {
            Alerterror(I18n.t("validate.Dataerror,pleasecontactITNETCO!"));
            console.log(error, "WH_spCustomer_Select")
        }

    }

    useEffect(() => {
        WH_spCustomer_Select()
    }, [CustomerId]);

    useEffect(() => {
        debugger

        if (items != 0 && items != -1) {
            setValueS(data.filter(a => a.value == items))
            // let ar =
            // ar ? setValueS( data.find(a => a.value == items)) : setValueS({ value: 0, label: 'Select Please' })
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
            isDisabled={isDisabled}
            isMulti={isMulti}
            ref={ref}
        />
    )
});

export const SelectCustomer = React.memo(SelectCustomerComp)