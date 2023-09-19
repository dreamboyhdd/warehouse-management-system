import React, { useEffect, useState } from "react";
import Select from "react-select";
import I18n from "../Language";
import DateTimePicker from "react-datetime-picker";
import { SelectCustomer, SelectWarehouse, SelectInventory,SelectWarehouseArea } from "../Common";
import { FirstOrLastDayinMonth } from "../Utils";

const FormInventoryComp = React.forwardRef(
    (
        {
            onCustomer = () => { },
            onWareHouse = () => { },
            onWareHouseArea = () => { },
            onProductCode = () => { },
            onProductSeries = () => { },
            onInventoryType = () => { }
        },
        ref
    ) => {
        const [InventoryType, setInventoryType] = useState({ value: 0 });
        const [CustomerId, setCustomerId] = useState({ value: 0 });
        const [WareHouseId, setWareHouseId] = useState({ value: -1 });
        const [WareHouseAreaId, setWareHouseAreaId] = useState({ value: 0 });
        const [ProductCode, setProductCode] = useState("");
        const [ProductSeries, setProductSeries] = useState("");

        const handleProductCode = (item) => {
            onProductCode(item);
            setProductCode(item);
        };

        const handleProductSeries = (item) => {
            onProductSeries(item);
            setProductSeries(item);
        };

        const handleSelectCustomer = (item) => {
            onCustomer(item);
            setCustomerId(item);
        };

        const handleSelectWareHouse = (item) => {
            onWareHouse(item);
            setWareHouseId(item);
        };

        const handleInventoryType = (item) => {
            onInventoryType(item);
            setInventoryType(item);
        };

        return (
            <>
                <div className="row">
                    <div className="col-md-2">
                        <div className="form-group">
                            <label className="form__title">Types</label>
                            <SelectInventory
                                onSelected={(e) => {
                                    handleInventoryType(e);
                                }}
                                items={InventoryType.value}
                            />
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="form-group">
                            <label className="form__title" >Product code </label>
                            <input type="text" className="form-control" value={ProductCode} onChange={a => handleProductCode(a.target.value)} />
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="form-group">
                            <label className="form__title" >Product series </label>
                            <input type="text" className="form-control" value={ProductSeries} onChange={a => handleProductSeries(a.target.value)} />
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="form-group">
                            <label className="form__title">
                                Customer ID
                            </label>
                            <SelectCustomer
                                onSelected={(e) => {
                                    handleSelectCustomer(e);
                                    handleSelectWareHouse({ value: -1 });
                                }}
                                items={CustomerId.value}
                            />
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="form-group">
                            <label className="form__title">Warehouse ID</label>
                            <SelectWarehouse
                                onSelected={(e) => handleSelectWareHouse(e)}
                                items={WareHouseId.value}
                            />
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="form-group">
                            <label className="form__title">{I18n.t("AccountGroup.Warehouse")} Area ID</label>
                            <SelectWarehouseArea
                                onSelected={(e) => {
                                    onWareHouseArea(e)
                                    setWareHouseAreaId(e)
                                }}
                                WareHouseId={WareHouseId.value}
                                items={WareHouseAreaId.value}
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    }
);
export const FormInventory = React.memo(FormInventoryComp);
