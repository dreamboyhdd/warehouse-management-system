import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { mainAction } from '../Redux/Actions';
import { APIKey } from '../Services/Api';
import I18n from '../Language';
import { GetDataFromLogin, Alerterror } from "../Utils";


const SelectWarehouseAreaMultiComp = React.forwardRef(({
    onSelected = () => { },
    items = 0,
    WareHouse = [],
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

    const WH_spWareHouse_Area_ListMulti = async () => {
        // check load data all or follow DepartId
        if (WareHouse === null || WareHouse.length === 0) {
            isMulti ? setValueS() : setValueS({ value: -1, label: 'Select Please' })
            setData([]);
            return;
        }
        let ar = []
        WareHouse.forEach((item, key) => {
            if (item.value !== -1) {
                ar.push({
                    WareHouseId: item.value
                })
            }
        })
        
        try {
            const params = {
                Json: JSON.stringify({
                    WareHouseAr: ar
                }),
                func: "WH_spWareHouse_Area_ListMulti",
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
                dataSelect.push({ value: element.WareHouseAreaId, label: element.WareHouseAreaName });

            });
            if (items != 0 && items != -1) {
                let ar = list.find(a => a.WareHouseAreaId === items);
                setValueS({ value: ar.WareHouseAreaId, label: ar.WareHouseAreaName });
            } // Active
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
            console.log(error, "WH_spWareHouse_Area_ListMulti")
        }
    }

    useEffect(() => {
        WH_spWareHouse_Area_ListMulti()
    }, [WareHouse]);

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

    useEffect(() => {
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

export const SelectWarehouseAreaMulti = React.memo(SelectWarehouseAreaMultiComp)