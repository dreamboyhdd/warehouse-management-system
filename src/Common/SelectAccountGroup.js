import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { mainAction } from '../Redux/Actions';
import { APIKey } from '../Services/Api';
import I18n from '../Language';
import { GetDataFromLogin, Alerterror } from "../Utils";


const SelectAccountGroupComp = ({
    onSelected = () => { },
    items = 0,
    GroupId = 0,
    isDisabled = false
}) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([])
    const [valueS, setValueS] = useState()
    const onSelecteItem = (item) => {
        onSelected(item)
        setValueS(item);
    }


    const WH_spAccountGroup_List = async () => {
        // check load data all or follow DepartId
        if (GroupId === -1) {
            setValueS({ value: 0, label: 'Select Please' })
            setData([]);
            return;
        }
        try {
            const params = {
                Json: JSON.stringify({
                    GroupId: GroupId,
                    UserId: GetDataFromLogin("AccountId")
                }),
                func: "WH_spAccountGroup_List",
                API_key: APIKey
            }

            const list = await mainAction.API_spCallServer(params, dispatch);
            if (list.length > 1) {
                const FirstData = { value: 0, label: 'Select Please' };
                let dataSelect = [];
                dataSelect.push(FirstData);
                setValueS(FirstData);
                list.forEach((element, index) => {
                    dataSelect.push({ value: element.GroupId, label: element.GroupName });

                });
                if (items != 0 && items != -1) {
                    let ar = list.find(a => a.GroupId === items);
                    setValueS({ value: ar.GroupId, label: ar.GroupName });
                } // Active
                setData(dataSelect)
            }
        } catch (error) {
            Alerterror(I18n.t("validate.Dataerror,pleasecontactITNETCO!"));
            console.log(error, "WH_spAccountGroup_List")
        }

    }

    useEffect(() => {
        WH_spAccountGroup_List()
    }, [GroupId]);

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

export const SelectAccountGroup = React.memo(SelectAccountGroupComp)