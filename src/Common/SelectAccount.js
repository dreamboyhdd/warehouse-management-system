import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { mainAction } from '../Redux/Actions';
import { APIKey } from '../Services/Api';
import I18n from '../Language';
import { GetDataFromLogin, Alerterror, Alertwarning } from "../Utils";

const SelectAccountComp = React.forwardRef(({
    onSelected = () => { },
    onAccountId = 0,
    AccountId = 0,
    AccountGroupId = 0,
    WarehouseId = 0,
    items = 0,
    activer = [],
    isDisabled = false,
    isMulti = false,
    PositionId = 0,
    ManagerId = 0
}, ref) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([])
    const [valueS, setValueS] = useState()

    const onSelecteItem = (item) => {
        onSelected(item)
        setValueS(item);
    }

    const WH_spAccount_Select = async () => {
        // check load data all or follow AccountId
        if (AccountId === -1) {
            isMulti ? setValueS() : setValueS({ value: -1, label: 'Select Please' })
            setData([]);
            return;
        }
        if (WarehouseId === -1) {
            isMulti ? setValueS() : setValueS({ value: -1, label: 'Select Please' })
            setData([]);
            return;
        }
        if (AccountGroupId === -1) {
            isMulti ? setValueS() : setValueS({ value: -1, label: 'Select Please' })
            setData([]);
            return;
        }
        if (PositionId === -1) {
            isMulti ? setValueS() : setValueS({ value: -1, label: 'Select Please' })
            setData([]);
            return;
        }
        if (ManagerId === -1) {
            isMulti ? setValueS() : setValueS({ value: -1, label: 'Select Please' })
            setData([]);
            return;
        }
        try {
            const params = {
                Json: JSON.stringify({
                    AccountId: AccountId,
                    AccountGroupId: AccountGroupId,
                    WarehouseId: WarehouseId,
                    PositionId: PositionId,
                    ManagerId: ManagerId,
                    UserId: GetDataFromLogin("AccountId")
                }),
                func: "WH_spAccount_Select",
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
                    dataSelect.push({ value: element.AccountId, label: element.AccountName });

                });
                // Active
                if (items != 0 && items != -1) {
                    let ar = dataSelect.find(a => a.value === items);
                    setValueS(ar);
                    onSelected(ar)
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
            console.log(error, "WH_spAccount_Select")
        }

    }

    useEffect(() => {
        WH_spAccount_Select()
    }, [AccountId, AccountGroupId, WarehouseId, PositionId]);

    useEffect(() => {
        
        if (isMulti === true) { return }
        let ar = data.find(a => a.value == items)
        ar ? setValueS(ar) : setValueS({ value: 0, label: 'Select Please'})
        
    }, [items]);

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
            isMulti={isMulti}
            ref={ref}
            // ignoreAccents={true}
        />
    )
});
export const SelectAccount = React.memo(SelectAccountComp)