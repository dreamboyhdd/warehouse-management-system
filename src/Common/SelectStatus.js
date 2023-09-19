import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { mainAction } from '../Redux/Actions';
import { APIKey } from '../Services/Api';
import I18n from '../Language';
import { GetDataFromLogin, Alerterror } from "../Utils";


const SelectStatusComp = ({
    onSelected = () => { },
    items = 0,
    StatusId = 0,
    isDisabled = false
}) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([])
    const [valueS, setValueS] = useState()
    const onSelecteItem = (item) => {
        onSelected(item)
        setValueS(item);
    }


    const WH_spStatus_List = async () => {
        // check load data all or follow DepartId
        if (StatusId === -1) {
            setValueS({ value: 0, label: 'Select Please' })
            setData([]);
            return;
        }
        try {
            const params = {
                Json: JSON.stringify({
                    StatusId: StatusId,
                    UserId: GetDataFromLogin("AccountId")
                }),
                func: "WH_spStatus_List",
                API_key: APIKey
            }

            const list = await mainAction.API_spCallServer(params, dispatch);
            if (list.length > 1) {
                const FirstData = { value: 0, label: 'Select Please' };
                let dataSelect = [];
                dataSelect.push(FirstData);
                setValueS(FirstData);
                list.forEach((element, index) => {
                    dataSelect.push({ value: element.StatusId, label: element.StatusName });

                });
                if (items != 0 && items != -1) {
                    let ar = list.find(a => a.StatusId === items);
                    setValueS({ value: ar.StatusId, label: ar.StatusName });
                } // Active
                setData(dataSelect)
            }
        } catch (error) {
            Alerterror(I18n.t("validate.Dataerror,pleasecontactITNETCO!"));
            console.log(error, "WH_spStatus_List")
        }

    }

    useEffect(() => {
        WH_spStatus_List()
    }, [StatusId]);

    useEffect(() => {
        if (items != 0 && items != -1) {
            let _ar = data.find(a => a.value == items)
            _ar ? setValueS(_ar) : setValueS({ value: 0, label: 'Select Please' })
        }
        else
            setValueS({ value: 0, label: 'Select Please' })
    }, [items]);

    return (
        <Select className="SelectMeno"
            value={valueS}
            onChange={onSelecteItem}
            options={data}
            isDisabled={isDisabled}
        />
    )
}

export const SelectStatus = React.memo(SelectStatusComp)