import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { mainAction } from '../Redux/Actions';
import { APIKey } from '../Services/Api';
import I18n from '../Language';
import { GetDataFromLogin, Alerterror } from "../Utils";


const SelectAreaComp = React.forwardRef(({
    onSelected = () => { },
    onAreaId = 0,
    AreaId = 0,
    isDisabled = false,
    isMulti = false,
    activer = [],

}, ref) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([])
    const [valueS, setValueS] = useState()
    const onSelecteItem = (item) => {
        onSelected(item)
        setValueS(item);
    }


    const WH_spArea_List = async () => {
        
        // check load data all or follow DepartId
        if (AreaId === -1) {
            setValueS({ value: 0, label: 'Select' })
            setData([]);
            return;
        }
        try {
            const params = {
                Json: JSON.stringify({
                    Id: AreaId,
                    UserId: GetDataFromLogin("AccountId")
                }),
                func: "WH_spArea_List",
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
                dataSelect.push({ value: element.AreaId, label: element.Name });

            });
            if (onAreaId != 0 && onAreaId != -1) {
                let ar = list.find(a => a.AreaId === onAreaId);
                setValueS({ value: ar.AreaId, label: ar.Name });
            } // Active

            // Active
            if (activer.length > 0) {
                let datatam = [], valuetam = "";
                activer.forEach((element, index) => {
                    if (element.value !== -1) {
                        valuetam = dataSelect.find(a => a.value == element.value);
                        datatam.push(valuetam);
                    }
                });
                setValueS(datatam);
            }
            setData(dataSelect)
        } catch (error) {
            Alerterror(I18n.t("validate.Dataerror,pleasecontactITNETCO!"));
            console.log(error, "WH_spArea_List")
        }

    }

    useEffect(() => {
        WH_spArea_List()
    }, [AreaId]);

    useEffect(() => {
        if (isMulti === true) { return }

        let ar = data.find(a => a.value == onAreaId)
        ar ? setValueS(ar) : setValueS({ value: 0, label: 'Select Please' })

        
    }, [onAreaId]);

    useEffect(() => {
        if (isMulti === false) { return }
        if (activer.length > 0) {
            let datatam = [], valuetam = "";
            activer.forEach((element, index) => {
                if (element.value !== -1) {
                    valuetam = data.find(a => a.value == element.value);
                    datatam.push(valuetam);
                }
            });
            setValueS(datatam);
            return
        }
    }, [activer]);

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

export const SelectArea = React.memo(SelectAreaComp)