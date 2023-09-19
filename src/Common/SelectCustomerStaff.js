import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { mainAction } from '../Redux/Actions';
import { APIKey } from '../Services/Api';
import I18n from '../Language';
import { GetDataFromLogin, Alerterror, Alertwarning } from "../Utils";

const _SelectCustomerStaff = React.forwardRef(({
    onSelected = () => { },
    CustomerId = 0,
    StaffId = 0,
    items = 0,
    isMulti = false,
    isDisabled = false
}, ref) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([])
    const [valueS, setValueS] = useState({ value: 0 })
    const onSelecteItem = (item) => {
        onSelected(item)
        setValueS(item);
    }
   
    const WH_spCustomerStaff_Select = async () => {
        // check load data all or follow CustomerId
        if (CustomerId === -1) {
            setValueS({ value: -1, label: 'Select Please' })
            setData([]);
            return;
        }
        if (StaffId === -1) {
            setValueS({ value: -1, label: 'Select Please' })
            setData([]);
            return;
        }
        try {

            const params = {
                Json: JSON.stringify({
                    CustomerId: CustomerId,
                    StaffId: StaffId,
                    UserId: GetDataFromLogin("AccountId")
                }),
                func: "WH_spCustomerStaff_Select",
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
                    dataSelect.push({ value: element.StaffId, name: element.StaffName, label: element.StaffName });

                });
                if (items != 0 && items != -1) {
                    let ar = list.find(a => a.StaffId === items);
                    setValueS({ value: ar.StaffId, name: ar.StaffName, label: ar.StaffName });
                } // Active
                setData(dataSelect)
            }else{
                setValueS({ value: -1, label: 'Select Please' })
                setData([]);
                return;
            }

        } catch (error) {
            Alerterror(I18n.t("validate.Dataerror,pleasecontactITNETCO!"));
            console.log(error, "WH_spCustomerStaff_Select")
        }

    }

    useEffect(() => {
        WH_spCustomerStaff_Select()
    }, [CustomerId]);

    useEffect(() => {
        debugger
        if (items != 0 && items != -1) {
            let ar = data.filter(a => a.value == items)
            ar ? setValueS( data.find(a => a.value == items)) : setValueS({ value: 0, label: 'Select Please' })
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

export const SelectCustomerStaff = React.memo(_SelectCustomerStaff)