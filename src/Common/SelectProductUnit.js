import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { mainAction } from '../Redux/Actions';
import { APIKey } from '../Services/Api';
import I18n from '../Language';
import { GetDataFromLogin, Alerterror, Alertwarning } from "../Utils";


const SelectProductUnitComp = React.forwardRef(({
    onSelected = () => { },
    isDisabled = false,
    isMulti = false,
    activer = [],
    items = 0,
    UnitId = 0,
}, ref) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([])
    const [valueS, setValueS] = useState()
    const onSelecteItem = (item) => {
        onSelected(item)
        setValueS(item);
    }

    const WH_spProduct_Attribute_Unit_List = async () => {
        // check load data all or follow DepartId
        if (UnitId === null || UnitId === -1) {
            isMulti ? setValueS() : setValueS({ value: -1, label: 'Select Please' })
            setData([]);
            return;
        }
        try {
            const params = {
                Json: JSON.stringify({
                    UnitId: UnitId,
                    AccountId: GetDataFromLogin("AccountId")
                }),
                func: "WH_spProduct_Attribute_Unit_List",
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
                    dataSelect.push({ value: element.UnitId, label: element.UnitName, NumberConversion: element.NumberConversion });

                });
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
            }
        } catch (error) {
            Alerterror(I18n.t("validate.Dataerror,pleasecontactITNETCO!"));
            console.log(error, "WH_spProduct_Attribute_Unit_List")
        }

    }

    useEffect(() => {
        WH_spProduct_Attribute_Unit_List()
    }, [UnitId]);

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

export const SelectProductUnit = React.memo(SelectProductUnitComp)