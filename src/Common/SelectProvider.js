import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { mainAction } from '../Redux/Actions';
import { APIKey } from '../Services/Api';
import I18n from '../Language';
import { GetDataFromLogin, Alerterror } from "../Utils";


const SelectProviderComp = React.forwardRef(({
    onSelected = () => { },
    items = 0,
    Id = 0,
    isDisabled = false,
    isMulti = false,
}, ref) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([])
    const [valueS, setValueS] = useState()
    const onSelecteItem = (item) => {
        onSelected(item)
        setValueS(item);
    }


    const WH_spProvider_Select = async () => {
        // check load data all or follow DepartId
        if (Id === -1) {
            setValueS({ value: -1, label: 'Select Please' })
            setData([]);
            return;
        }
        try {
            const params = {
                Json: JSON.stringify({
                    Id: Id,
                    UserId: GetDataFromLogin("AccountId")
                }),
                func: "WH_spProvider_Select",
                API_key: APIKey
            }

            const list = await mainAction.API_spCallServer(params, dispatch);
            if (list.length > 1) {
                const FirstData = { value: -1, label: 'Select Please' };
                let dataSelect = [];
                dataSelect.push(FirstData);
                setValueS(FirstData);
                list.forEach((element, index) => {
                    dataSelect.push({ value: element.Id, label: element.NameObj });

                });
                if (items != 0 && items != -1) {
                    let ar = list.find(a => a.StatusId === items);
                    setValueS({ value: ar.Id, label: ar.NameObj });
                } // Active
                setData(dataSelect)
            }
        } catch (error) {
            Alerterror(I18n.t("validate.Dataerror,pleasecontactITNETCO!"));
            console.log(error, "WH_spProvider_Select")
        }

    }

    useEffect(() => {
        WH_spProvider_Select()
    }, [Id]);

    useEffect(() => {
        if (items != 0 && items != -1) {
            let _ar = data.find(a => a.value == items)
            _ar ? setValueS(_ar) : setValueS({ value: -1, label: 'Select Please' })
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
            ref={ref}
        />
    )
});

export const SelectProvider = React.memo(SelectProviderComp)