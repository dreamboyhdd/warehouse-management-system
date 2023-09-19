import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { mainAction } from '../Redux/Actions';
import { APIKey } from '../Services/Api';
import I18n from '../Language';
import { GetDataFromLogin, Alerterror, Alertwarning } from "../Utils";

const SelectLocationAddressComp = React.forwardRef(({
    onSelected = () => { },
    ParentId = 0,
    Type = 1,//1 là tỉnh thành, 2 quận huyện, 3 phường xã, 4 quốc gia
    items = 0,
    activer = [],
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

    const WH_spLocation_Select = async () => {
        if (ParentId === -1) {
            isMulti ? setValueS() : setValueS({ value: -1, label: 'Select Please' })
            setData([]);
            return;
        }
        try {
            const params = {
                Json: JSON.stringify({
                    ParentId: ParentId,
                    Type: Type,
                    UserId: GetDataFromLogin("AccountId")
                }),
                func: "WH_spLocation_Select",
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
                    dataSelect.push({ value: element.LocationId, label: element.Name });

                });
                // Active
                if (items != 0 && items != -1) {
                    let ar = dataSelect.find(a => a.value === items);
                    setValueS(ar);
                }
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
            } 
        } catch (error) {
            Alerterror(I18n.t("validate.Dataerror,pleasecontactITNETCO!"));
            console.log(error, "WH_spLocation_Select")
        }

    }

    useEffect(() => {
        WH_spLocation_Select()
    }, [ParentId, Type]);

    useEffect(() => {
        let ar = data.find(a => a.value == items)
        ar ? setValueS(ar) : setValueS({ value: 0, label: 'Select Please' })
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
            isMulti={isMulti}
            ref={ref}
        />
    )
});
export const SelectLocationAddress = React.memo(SelectLocationAddressComp)