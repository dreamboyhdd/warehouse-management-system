import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { mainAction } from '../Redux/Actions';
import { APIKey } from '../Services/Api';
import I18n from '../Language';
import { GetDataFromLogin, Alerterror } from "../Utils";


const SelectPositionComp = ({
    onSelected = () => { },
    items = 0,
    PositionId = 0,
    isDisabled = false
}) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([])
    const [valueS, setValueS] = useState()
    const onSelecteItem = (item) => {
        onSelected(item)
        setValueS(item);
    }


    const WH_spPosition_List = async () => {
        // check load data all or follow DepartId
        if (PositionId === -1) {
            setValueS({ value: 0, label: 'Select Please' })
            setData([]);
            return;
        }
        try {
            const params = {
                Json: JSON.stringify({
                    PositionId: PositionId,
                    UserId: GetDataFromLogin("AccountId")
                }),
                func: "WH_spPosition_List",
                API_key: APIKey
            }

            const list = await mainAction.API_spCallServer(params, dispatch);
            if (list.length > 1) {
                const FirstData = { value: -1, label: 'Select Please' };
                let dataSelect = [];
                dataSelect.push(FirstData);
                setValueS(FirstData);
                list.forEach((element, index) => {
                    dataSelect.push({ value: element.PositionId, label: element.PositionName });

                });
                if (items != 0 && items != -1) {
                    let ar = list.find(a => a.PositionId === items);
                    setValueS({ value: ar.PositionId, label: ar.PositionName });
                } // Active
                setData(dataSelect)
            }
        } catch (error) {
            Alerterror(I18n.t("validate.Dataerror,pleasecontactITNETCO!"));
            console.log(error, "WH_spPosition_List")
        }

    }

    useEffect(() => {
        WH_spPosition_List()
    }, [PositionId]);

    useEffect(() => {
        if (items != 0 && items != -1) {
            let _ar = data.find(a => a.value == items)
            _ar ? setValueS(_ar) : setValueS({ value: -1, label: 'Select Please' })
        }
        else
            setValueS({ value: -1, label: 'Select Please' })
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

export const SelectPosition = React.memo(SelectPositionComp)