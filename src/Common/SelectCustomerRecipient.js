import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { mainAction } from '../Redux/Actions';
import { APIKey } from '../Services/Api';
import I18n from '../Language';
import { GetDataFromLogin, Alerterror, Alertwarning } from "../Utils";

const SelectCustomerRecipientComp = React.forwardRef(({
    onSelected = () => { },
    CustomerId = 0,
    items = 0,
    isDisabled = false,
    isMulti = false
}, ref) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([])
    const [valueS, setValueS] = useState()
    const onSelecteItem = (item) => {
        onSelected(item)
        setValueS(item);
    }

    const WH_spCustomerRecipient_Load = async () => {
        // check load data all or follow CustomerId
        if (CustomerId === -1) {
            setValueS({ value: -1, label: 'Select Please' })
            setData([]);
            return;
        }
        try {
            
            const params = {
                Json: JSON.stringify({
                    CustomerId: CustomerId,
                    UserId: GetDataFromLogin("AccountId")
                }),
                func: "WH_spCustomerRecipient_Load",
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
                    dataSelect.push({ value: element.RecipientId, name: element.RecipientName,phone:element.RecipientPhone,company:element.RecipientCompany, label: element.RecipientAddress });

                });
                if (items != 0 && items != -1) {
                    let ar = list.find(a => a.CustomerId === items);
                    setValueS({ value: ar.RecipientId, name: ar.RecipientName,phone:ar.RecipientPhone,company:ar.RecipientCompany, label: ar.RecipientAddress });
                } // Active
                setData(dataSelect)
            }else{ setData([])}

        } catch (error) {
            Alerterror(I18n.t("validate.Dataerror,pleasecontactITNETCO!"));
            console.log(error, "WH_spCustomerRecipient_Load")
        }

    }

    useEffect(() => {
        WH_spCustomerRecipient_Load()
    }, [CustomerId]);

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
            isDisabled={isDisabled}
            isMulti={isMulti}
            ref={ref}
        />
    )
});

export const SelectCustomerRecipient = React.memo(SelectCustomerRecipientComp)