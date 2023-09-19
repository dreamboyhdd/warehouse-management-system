import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { mainAction } from '../Redux/Actions';
import { APIKey } from '../Services/Api';
import I18n from '../Language';
import { GetDataFromLogin, Alerterror } from "../Utils";

const SelectVehicleComp  = React.forwardRef(({
    onSelected = () => { },
    VehicleId = 0,
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

    const WH_spVehicle_List = async () => {
        // check load data all or follow VehicleId
        if (VehicleId === -1) {
            setValueS({ value: -1, label: 'Select Please' })
            setData([]);
            return;
        }
        try {
            const params = {
                Json: JSON.stringify({
                    VehicleId: VehicleId,
                    UserId: GetDataFromLogin("AccountId")
                }),
                func: "WH_spVehicle_List",
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
                dataSelect.push({ value: element.VehicleId, label: element.NameVehicle });

            });
            if (items != 0 && items != -1) {
                let ar = list.find(a => a.VehicleId === items);
                setValueS({ value: ar.VehicleId, label: ar.NameVehicle });
            } // Active
            setData(dataSelect)
        } catch (error) {
            Alerterror(I18n.t("validate.Dataerror,pleasecontactITNETCO!"));
            console.log(error, "WH_spVehicle_List")
        }

    }

    useEffect(() => {
        WH_spVehicle_List()
    }, [VehicleId]);

    useEffect(() => {
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
            isMulti={isMulti}
        />
    )
});

export const SelectVehicle = React.memo(SelectVehicleComp)