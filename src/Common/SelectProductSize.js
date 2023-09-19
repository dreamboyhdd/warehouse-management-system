import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { mainAction } from '../Redux/Actions';
import { APIKey } from '../Services/Api';
import I18n from '../Language';
import { GetDataFromLogin, Alerterror, Alertwarning } from "../Utils";


const SelectProductSizeComp = React.forwardRef(({
    onSelected = () => { },
    isDisabled = false,
    isMulti = false,
    activer = [],
    items = 0,
    SizeId = 0,
}, ref) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([])
    const [valueS, setValueS] = useState()
    const onSelecteItem = (item) => {
        onSelected(item)
        setValueS(item);
    }

    const WH_spProduct_Attribute_Size_List = async () => {
        // check load data all or follow DepartId
        if (SizeId === null || SizeId === -1) {
            isMulti ? setValueS() : setValueS({ value: -1, label: 'Select Please' })
            setData([]);
            return;
        }
        try {
            const params = {
                Json: JSON.stringify({
                    SizeId: SizeId,
                    AccountId: GetDataFromLogin("AccountId")
                }),
                func: "WH_spProduct_Attribute_Size_List",
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
                    dataSelect.push({ value: element.SizeId, label: element.SizeName, SizeCode: element.SizeCode });

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
            console.log(error, "WH_spProduct_Attribute_Size_List")
        }

    }

    useEffect(() => {
        WH_spProduct_Attribute_Size_List()
    }, [SizeId]);

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

export const SelectProductSize = React.memo(SelectProductSizeComp)