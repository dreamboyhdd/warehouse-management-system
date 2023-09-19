import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { mainAction } from '../Redux/Actions';
import { APIKey } from '../Services/Api';
import I18n from '../Language';
import { GetDataFromLogin, Alerterror } from "../Utils";


const SelectWarehouseMultiComp = React.forwardRef(({
    onSelected = () => { },
    items = 0,
    Area = [],
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

    const WH_spWareHouse_ListMulti = async () => {
        // check load data all or follow DepartId
        debugger
        if (Area === null || Area.length === 0) {
            debugger
            isMulti ? setValueS() : setValueS({ value: -1, label: 'Select Please' })
            setData([]);
            return;
        }
        let ar = []
        Area.forEach((item, key) => {
            if (item.value !== -1) {
                ar.push({
                    AreaId: item.value
                })
            }
        })
        try {
            const params = {
                Json: JSON.stringify({
                    Area: ar
                }),
                func: "WH_spWareHouse_ListMulti",
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
                dataSelect.push({ value: element.WareHouseId, label: element.WareHouseName });

            });
            if (items != 0 && items != -1) {
                let ar = list.find(a => a.WareHouseId === items);
                setValueS({ value: ar.WareHouseId, label: ar.WareHouseName });
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
            console.log(error, "WH_spWareHouse_ListMulti")
        }
    }

    useEffect(() => {
        WH_spWareHouse_ListMulti()
    }, [Area]);

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
        debugger
        if (activer === null) {
            setValueS(null)
            return
        }
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

export const SelectWarehouseMulti = React.memo(SelectWarehouseMultiComp)