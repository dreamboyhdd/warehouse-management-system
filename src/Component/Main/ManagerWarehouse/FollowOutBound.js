import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import I18n from '../../../Language'
import { APIKey } from '../../../Services/Api';
import Select from 'react-select';
import DateTimePicker from 'react-datetime-picker';
import $, { parseJSON } from "jquery";
import { SelectArea, SelectCustomerRecipient, SelectAccount, SelectCustomer, SelectWarehouseContract, SelectWarehouse, SelectVehicle, DataTable, SelectCurator, SelectProvider } from '../../../Common';
import { mainAction } from '../../../Redux/Actions'
import { Alertwarning, Alertsuccess, Alerterror, GetDataFromLogin, FormatDateJson, FirstOrLastDayinMonth, FormatNumber, ExportExcel, ConfirmAlert, DateDiff, RegEpxPhone } from "../../../Utils";
import { formatNumber } from "canvasjs-react-charts/canvasjs.min";

export const FollowOutBound = () => {
    //#region 
    //#region Khai báo biến
    const dispatch = useDispatch();
    const [RecipientId, setRecipientId] = useState({ value: -1, label: 'Select please' })
    const [IsAcctive2, setIsAcctive2] = useState(true);
    const [CustomerContractData, setCustomerContractData] = useState([])
    const [InventoryData1, setInventoryData1] = useState([])
    const [InventoryData2, setInventoryData2] = useState([])
    const [Checkall, setCheckall] = useState(false);
    const [RecipientAddress, setRecipientAddress] = useState();
    const [RecipientPhone, setRecipientPhone] = useState();
    const RecipientPhoneRef = useRef();
    const RecipientNameRef = useRef();
    const RecipientCompanyRef = useRef();
    const RecipientAddressRef = useRef();
    const [RecipientName, setRecipientName] = useState();
    const [RecipientCompany, setRecipientCompany] = useState();
    const [disable, setdisable] = useState(false); // disable button 
    const [StrategyCode, setStrategyCode] = useState('');
    const [Warehouse, setWarehouse] = useState({ value: -1 });
    const WarehouseRef = useRef()
    const [WarehouseTo, setWarehouseTo] = useState({ value: -1 });
    const WarehouseToRef = useRef()
    const [Area, setArea] = useState({ value: -1 });
    const [AccountId, setAccountId] = useState([]);
    const AccountIdRef = useRef()
    const [ID, setID] = useState(0);
    const [Status, setStatus] = useState([{ value: -1, label: 'Vui lòng chọn' }, { value: 0, label: 'Mới tạo' }, { value: 1, label: 'Đang tiến hành' }, { value: 2, label: 'Hoàn tất' }]);
    const [StatusId, setStatusId] = useState({ value: -1, label: 'Vui lòng chọn' });
    const [CustomerId, setCustomerId] = useState({ value: -1 });
    const CustomerIdRef = useRef()
    const [Vehicle, setVehicle] = useState({ value: 0 });
    const VehicleRef = useRef()
    const [Provider, setProvider] = useState({ value: 0 });
    const ProviderRef = useRef()
    const [Curator, setCurator] = useState({ value: 0 });
    const CuratorRef = useRef()
    const [POcode, setPOcode] = useState('');
    const POcodeRef = useRef()
    const [Driver, setDriver] = useState({ value: -1 });
    const [Description, setDescription] = useState("");
    const [EnterCode, setEnterCode] = useState();
    const [SelectProduct, setSelectProduct] = useState();
    const [Dates, setDates] = useState(new Date());
    const [Excel, setExcel] = useState([])
    const [DataExcel, setDateExcel] = useState([])
    const DateRef = useRef();
    const [Function, setFunction] = useState({ Id: 2, _funcsave: 'WH_spWareHouse_Export_Save', Name: 'VẬN HÀNH XUẤT KHO' });
    const [DataSearch, setDataSearch] = useState([]);
    const [DataOK, setDataOK] = useState([]);
    const [DataError, setDataError] = useState([]);
    const [IsAcctive, setIsAcctive] = useState(false);
    const [State, setState] = useState()
    const [IsRun, setIsRun] = useState(0)
    const [ModalImg, setModalImg] = useState({})
    const [dataarray, setdataarray] = useState({ Number: 0 })
    const [StrategyId, setStrategyId] = useState()

    //list 
    const [Fromdate, setFromdate] = useState(FirstOrLastDayinMonth(new Date(), 1))
    const FromdateRef = useRef()
    const [Todate, setTodate] = useState(new Date())
    const TodateRef = useRef()
    const [Code, setCode] = useState('')
    const [Title, setTitle] = useState('')
    const [CountGroup, setCountGroup] = useState(0)
    const [CusId, setCusId] = useState({ value: 0 })
    const [Area_Id, setArea_Id] = useState({ value: -1 })
    const [WareHouseId, setWareHouseId] = useState({ value: 0 })
    const [WarehouseTo2, setWarehouseTo2] = useState({ value: 0 })
    const [StaffId, setStaffId] = useState({ value: 0 })
    const [CreateTime, setCreateTime] = useState('')
    const [CreateId, setCreateId] = useState({ value: 0 })
    const [DataList, setDataList] = useState([])
    const [DataDetailList, setDataDetailList] = useState([])
    const [DataDetailArrange, setDataDetailArrange] = useState([])
    const [Datacolumn, setDatacolumn] = useState([])

    //#endregion Khai báo biến
    useEffect(() => {
        DataOK.forEach(i => {
            WH_spProductPackaging_List(i.ProductId, i.key)// add data packaking in row item
            if (i.ProductPackagingId !== undefined) {
                WH_spProduct_Check(i.ProductPackagingId, i.ProductId, i.key)
            }
        })
    }, [IsRun]);
    //IsRun restart data packaging and check product

    useEffect(() => {
        setDatacolumn(columns)
    }, []);

    //call from table column
    useEffect(() => {
        if (dataarray.Number === 0) return

        if (dataarray.keys === 'check') {
            CheckOne(dataarray._row.original.Id, dataarray._row.original.IsCheck)
        } else if (dataarray.keys === 'view') {
            WH_spWareHouse_StrategyActual_DetailList(dataarray._row)
        } else if (dataarray.keys === 'edit') {
            Edit(dataarray._row)
        } else if (dataarray.keys === 'delete') {
            WH_spWareHouse_StrategyActual_Delete(dataarray._row.value)
        } else if (dataarray.keys === 'arrange') {
            WH_spWareHouse_Strategy_AutoArrange(dataarray._row.value)
        }
    }, [dataarray]);

    //close choise
    $('body').on("click", function (event) {
        setIsAcctive(false)
    })

    // Search 
    const WH_spProduct_Search = async (e) => {
        setSelectProduct(e.target.value)
        setIsAcctive(false)
        if (e.target.value.length < 4) {
            setDataSearch([]);
            return
        }
        else {
            if (e.target.value.length > 9) {
                return
            }
            // const params = {
            //     Json: JSON.stringify({
            //         ProductCode: e.target.value.trim()
            //     }),
            //     func: "WH_spProduct_Search"
            // }
            try {
                //const result = await mainAction.API_spCallServer(params, dispatch);
                let result = [], result2 = [];
                if (InventoryData1.length > 0) {
                    result = InventoryData1.filter(a => a.ProductCodeS.includes(e.target.value.trim().toUpperCase()))
                    if (result.length === 0) {
                        result = InventoryData1.filter(a => a.ProductNameS.includes(e.target.value.trim().toUpperCase()))
                    }
                }
                if (InventoryData2.length > 0) {
                    result2 = InventoryData2.filter(a => a.CodeSeriImeS.includes(e.target.value.trim().toUpperCase()))
                }

                if (result.length > 0) {
                    setDataSearch(result);
                } else if (result2.length > 0) {
                    setDataSearch(result2);
                } else {
                    setDataSearch([{ ProductName: "No data inbound!" }]);
                }
                setIsAcctive(true)
            } catch (e) {
                Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT Netco!");
                console.log("WH_spProduct_Search", e)
            }
        }
    }
    const WH_spProduct_Scan = async (e) => {
        if (e.charCode === 13) {
            if (e.target.value.trim() !== "") {
                debugger
                setSelectProduct("")
                let _data = e.target.value.trim().split(" ");
                let ar = [], dtcheck = [], rowcheck = 0;
                _data.forEach(i => {
                    dtcheck = [];
                    if (i !== "") {
                        if (ar.length > 0) {
                            if (ar.find(a => a.CodeSeriImeS === i.toUpperCase()) !== undefined) {
                                rowcheck = 1
                            }
                        }
                        if (DataOK.find(a => a.CodeSeriImeS === i.toUpperCase()) !== undefined) {
                            rowcheck = 1
                        }
                        if (rowcheck === 0) {
                            dtcheck = InventoryData1.find(a => a.ProductCodeS === i.toUpperCase())
                            if (dtcheck === undefined) {
                                dtcheck = InventoryData2.find(a => a.CodeSeriImeS === i.toUpperCase())
                                if (dtcheck !== undefined) {
                                    //--defaul values
                                    dtcheck.ValuePackaging = {
                                        NumberConversion: dtcheck.UnitNumberconversion,
                                        label: dtcheck.UnitName,
                                        value: dtcheck.UnitId
                                    }
                                    dtcheck.PackageNumber = 1
                                    dtcheck.disableValuePackaging = true
                                    //--
                                }
                            } else {
                                setIsRun(IsRun + 1)
                            }
                            if (dtcheck !== undefined) {
                                DataOK.push({ ...dtcheck })
                                setState({ dt: DataOK })
                                ar.push(dtcheck)

                            }
                        }

                    }
                })
                if (ar.length == 0) {
                    Alertwarning("Không có mã hợp lệ!")
                    return
                }
                // try {
                // const params = {
                //     Json: JSON.stringify(ar),
                //     func: "WH_spProduct_Scan",
                //     API_key: APIKey
                // }
                // const list = await mainAction.API_spCallServer(params, dispatch);

                // if (list.length > 0) {
                //     let _arr = [...DataOK, ...list]
                //     setDataOK(_arr)
                //     setIsRun(IsRun + 1)
                //     //check error code
                //     let _DataError = [...DataError]
                //     ar.forEach(element => {
                //         if (list.find(a => a.ProductCode.toUpperCase() === element.ProductCode.toUpperCase()) === undefined) {
                //             _DataError.push({
                //                 ProductCode: element.ProductCode
                //             })
                //         }
                //     });
                //     setDataError(_DataError)
                // } else {
                //     setDataError([...DataError, ...ar])
                // }

                // } catch (error) {
                //     Alerterror("Lỗi dữ liệu,vui lòng liên hệ IT NETCO !");
                //     console.log(error, "WH_spProduct_Scan")
                // }
            }
        }

    }
    // WH_spProductPackaging_List f
    const WH_spProductPackaging_List = async (Id, key) => {
        try {
            debugger
            const params = {
                Json: JSON.stringify({ ProductId: Id }),
                func: "WH_spProductPackaging_List",
                API_key: APIKey
            }
            const list = await mainAction.API_spCallServer(params, dispatch);
            let dataSelect = []
            list.forEach((element, index) => {
                dataSelect.push({ value: element.ProductPackagingId, NumberConversion: element.NumberConversion, label: element.UnitName });
            });

            DataOK.find(i => i.key === key).DataPackaging = dataSelect;
            setState({ data: DataOK })
        } catch (error) {
            Alerterror("Lỗi dữ liệu,vui lòng liên hệ IT NETCO !");
            console.log(error, "WH_spProductPackaging_List")
        }
    }

    const ClearFrom = (a) => {
        setRecipientId({ value: -1, label: 'Select please' })
        setDataOK([])
        setStrategyCode('')
        setDataError([])
        setAccountId([{}]);
        setDriver({ value: -1 });
        setWarehouse({ value: -1 });
        setWarehouseTo({ value: -1 });
        setArea({ value: -1 });
        setCustomerId({ value: 0 });
        setVehicle({ value: 0 });
        // setProvider({ value: -1 });
        // setCurator({ value: -1 });
        setPOcode("");
        setDescription("");
        setDates(new Date());
        setDataSearch([]);
        setID(0)
        setdisable(true)
        setCustomerContractData([])
        setRecipientAddress("");
        setRecipientPhone("");
        setRecipientName("");
        setRecipientCompany("");
    }


    //choise
    const onSelecteProduct = (id, key, seri) => {
        if (id === undefined) { return }
        if (key === 0) {
            let ar = DataSearch.find(a => a.ProductId === id);//find ở đây để k trùng (k+1) nữa vì 2 dòng giống nhau 
            let _arr = [...DataOK, { ...ar }]; //use filter to push ar like this
            setDataOK(_arr)
            setSelectProduct("")
            setIsRun(IsRun + 1)
            if (ar.WareHouseLocationId !== undefined && CustomerContractData.find(a => a.LocationId === ar.WareHouseLocationId) !== undefined) {
                CustomerContractData.find(a => a.LocationId === ar.WareHouseLocationId).Check = true
                setState({ dt: CustomerContractData })
            }
        } else {

            if (DataOK.find(a => a.CodeSeriIme === seri) !== undefined) {
                Alertwarning("Code seriIme already exist!")
                return
            }
            debugger
            let ar = DataSearch.find(a => a.CodeSeriIme === seri);
            //--defaul values
            ar.ValuePackaging = {
                NumberConversion: ar.UnitNumberconversion,
                label: ar.UnitName,
                value: ar.UnitId
            }
            ar.PackageNumber = 1
            ar.disableValuePackaging = true
            //
            let _arr = [...DataOK, { ...ar }]; //use filter to push ar like this
            setDataOK(_arr)
            setSelectProduct("")
            // setIsRun(IsRun + 1)
            if (ar.WareHouseLocationId !== undefined & CustomerContractData.find(a => a.LocationId === ar.WareHouseLocationId) !== undefined) {
                CustomerContractData.find(a => a.LocationId === ar.WareHouseLocationId).Check = true
                setState({ dt: CustomerContractData })
            }
        }

    }
    const OnclickPackaging = async (e, id) => {
        debugger
        let u = DataOK
        let _row = DataOK.find(i => i.key === id),
            _DataPackaging = DataOK.filter(i => i.ValuePackaging !== undefined && i.ValuePackaging !== '');
        if ((Warehouse.value === 0 || Warehouse.value === -1) && Function.Id != 1) {
            Alertwarning("Vui lòng chọn kho!")
            _row.ValuePackaging = ''
            return
        }
        if (_DataPackaging.length > 0 && _row.Keys === 0) {// check avalable packageing in a product and isnot seri
            if (_DataPackaging.find(i => i.ValuePackaging.value === e.value && i.key !== id) !== undefined) {
                Alertwarning("Đã tồn tại SP và đơn vị tính này!")
                _row.ValuePackaging = '';
                _row.TotalWeight = '';
                _row.sttcheck = false;
                setState({ data: DataOK })
                return
            } else {
                _row.ValuePackaging = e
                _row.Inventoryshow = (~~(_row.Inventory / _row.ValuePackaging.NumberConversion))
                // WH_spProduct_Check(e.value, _row.ProductId, _row.key)
                _row.sttcheck = true;
                setState({ data: DataOK })
                return
            }
        }
        else {
            _row.ValuePackaging = e
            _row.Inventoryshow = (~~(_row.Inventory / _row.ValuePackaging.NumberConversion))
            //WH_spProduct_Check(e.value, _row.ProductId, _row.key)
            _row.PackageNumber = '';
            _row.TotalWeight = '';
        }
    }
    const WH_spProduct_Check = async (PackagingId, ProductId, key) => {
        if (Function.Id == 1) { return }//type import wh return F
        try {

            const params = {
                Json: JSON.stringify({
                    ProductPackagingId: PackagingId,
                    ProductId: ProductId,
                    WarehouseId: Warehouse.value
                }),
                func: "WH_spProduct_Check",
                API_key: APIKey
            }
            const result = await mainAction.API_spCallServer(params, dispatch);
            let _PackageNumber = 0, _row = DataOK.find(a => a.key == key);
            if (Function.Id == 2 || Function.Id == 3) {// export wh 
                if (isNaN(parseInt(_row.PackageNumber)) !== true) {
                    _PackageNumber = parseInt(_row.PackageNumber)
                } else { _PackageNumber = 0 }
            }
            if (result.length > 0) {
                _row.NumberTotal = result[0].NumberTotal + _PackageNumber
                if (Function.Id == 4) {
                    _row.PackageNumber = result[0].NumberTotal
                }
            } else {
                _row.NumberTotal = + _PackageNumber
                Alertwarning("Không có dữ liệu nhập kho!")
            }
            setState({ data: DataOK })
        } catch (error) {
            Alerterror("Lỗi dữ liệu,vui lòng liên hệ IT NETCO !");
            console.log(error, "WH_spProduct_Check")
        }
    }
    const Deleterow = (Id) => {
        setDataOK(DataOK.filter(i => i.key !== Id))
    }
    // tính trọng lượng quy đổi/giá trị sp & check tồn
    const WeightExchange = (Id, value) => {
        let _DataOK = DataOK.find(a => a.key === Id),
            _DataPackaging = _DataOK.DataPackaging,
            _va = parseInt(value.toString().replaceAll(',', ''));
        if (_DataOK.ValuePackaging == undefined || _DataOK.ValuePackaging === '') {
            Alertwarning("Please select the unit!")
            _DataOK.PackageNumber = ""
            setState({ data: DataOK })
            return
        }
        let no = [];//find min number
        _DataOK.DataPackaging.forEach(a => {
            if (_DataOK.ValuePackaging.NumberConversion < a.NumberConversion) {
                no.push(a.NumberConversion)
            }
        })
        if (no.length > 0) {
            if ((_va * _DataOK.ValuePackaging.NumberConversion) >= Math.min(...no)) {
                Alertwarning("Please enter maximun " + (~~((Math.min(...no) / _DataOK.ValuePackaging.NumberConversion) - 1)) + " " + _DataOK.ValuePackaging.label + " !")
                return
            }
        }
        let va = (_va * _DataOK.ValuePackaging.NumberConversion),// số lượng nhập * số lượng quy đổi của đơn vị tính
            dtcheck = DataOK.filter(a => a.ProductId === _DataOK.ProductId && a.key !== Id && a.numchecks !== undefined),// tổng só nhập hiện tại Cua cac dòng khác
            dtInventory = (InventoryData1.find(a => a.ProductId === _DataOK.ProductId).Inventory - (dtcheck.length === 0 ? 0 : dtcheck.reduce((a, v) => a = a + v.numchecks, 0)))// tổng số tồn - số lượng quy đổi đã nhập ở các dòng khác
        if (Function.Id !== '1' & dtInventory < va) {
            let a = (dtInventory / _DataOK.ValuePackaging.NumberConversion)
            _DataOK.PackageNumber = (~~a)
            _DataOK.numchecks = dtInventory// cập nhật số đã nhân quy đổi để lần sau sum tổng đúng
            Alertwarning(`Vui lòng nhập tối đa ${~~a} ${_DataOK.ValuePackaging.label}!`)
            setState({ data: DataOK })
            if (_DataOK.WareHouseLocationId !== undefined & CustomerContractData.find(a => a.LocationId === _DataOK.WareHouseLocationId) !== undefined) {
                CustomerContractData.find(a => a.LocationId === _DataOK.WareHouseLocationId).Number = (~~a)
                setState({ dt: CustomerContractData })
            }
            return
        }
        else {
            if (_DataOK.WareHouseLocationId !== undefined & CustomerContractData.find(a => a.LocationId === _DataOK.WareHouseLocationId) !== undefined) {
                CustomerContractData.find(a => a.LocationId === _DataOK.WareHouseLocationId).Number = _va
                setState({ dt: CustomerContractData })
            }
            _DataOK.PackageNumber = _va
            _DataOK.numchecks = va// cập nhật số đã nhân quy đổi để lần sau sum tổng đúng
        }
        debugger
        // let _ValuePackaging = _DataPackaging.find(a => a.value === _DataOK.ValuePackaging.value);
        let _ValuePackaging = _DataPackaging.find(a => a.value === _DataOK.DataPackaging[0].value);
        // số lượng nhập * số lượng quy đổi của đơn vị tính * trọng lượng quy đổi
        let _valueWeightExchange = _va * _ValuePackaging.NumberConversion * _DataOK.WeightExchange;
        let _PriceExchange = _va * _ValuePackaging.NumberConversion * _DataOK.PriceExchange;
        _DataOK.TotalWeight = FormatNumber(_valueWeightExchange / 1000);
        _DataOK.TotalPrice = _PriceExchange;
        setState({ data: DataOK })
    }
    //CheckSave
    const CheckSave = () => {
        if (Function.Id == 2 || Function.Id == 3) {
            DataOK.forEach((i, k) => {
                if (parseInt(i.NumberTotal) < parseInt(i.PackageNumber)) {
                    i.PackageNumber = i.NumberTotal
                }
            });
            setState({ data: DataOK })
        }
        ActualSave()
    }
    // ActualSave 
    const ActualSave = async () => {
        //#region validate
        debugger
        if (CustomerId.value === -1) {
            Alertwarning("Please choose customer ID!")
            CustomerIdRef.current.focus();
            return
        }
        else if (Warehouse.value === -1 && Function.Id !== 3) {
            Alertwarning("Please choose warehouse!")
            WarehouseRef.current.focus();
            return
        }
        else if (Dates === null) {
            Alertwarning("Please select an estimated time!")
            WarehouseRef.current.focus();
            return
        }
        else if (WarehouseTo.value === -1 && Function.Id == 3) {
            Alertwarning("Please select the inbound repository!")
            WarehouseToRef.current.focus();
            return
        }
        // else if (Vehicle.value === 0) {
        //     Alertwarning("Vui lòng chọn xe!")
        //     VehicleRef.current.focus();
        //     return
        // }
        //#region 
        let StaffId1 = 0,
            StaffName1 = '',
            StaffId2 = 0,
            StaffName2 = '',
            StaffId3 = 0,
            StaffName3 = '';
        //#endregion
        if (AccountId.length > 3 || AccountId.length == 0 || AccountId.length == undefined || AccountId[0].value == undefined) {
            Alertwarning("Please choose minimum 3 staffs!")
            AccountIdRef.current.focus();
            return
        } else {
            //staff 1
            AccountId.map((i, k) => {
                if (k === 0) {
                    StaffId1 = i.value
                    StaffName1 = i.label
                }
                if (k === 1) {
                    StaffId2 = i.value
                    StaffName2 = i.label
                }
                if (k === 2) {
                    StaffId3 = i.value
                    StaffName3 = i.label
                }
            })
        }
        if (RecipientName === "") {
            Alertwarning("Please enter the recipient's name!");
            RecipientNameRef.current.focus();
            return
        }
        if (RecipientPhone === "" || !RegEpxPhone(RecipientPhone.trim())) {
            Alertwarning("Power number is not in the correct format!");
            RecipientPhoneRef.current.focus();
            return
        }
        if (RecipientAddress === "") {
            Alertwarning("Please enter the recipient's address!");
            RecipientAddressRef.current.focus();
            return
        }
        if (RecipientCompany === "") {
            Alertwarning("Please enter the recipient company!");
            RecipientCompanyRef.current.focus();
            return
        }

        let check = {}
        DataOK.map((i, k) => {
            if (i.sttcheck !== false) {
                // if (i.CodeSeriIme == "" || i.CodeSeriIme == undefined) {
                //     check = { id: (k + 1), val: "lot" }
                // }
                // else 
                if (i.ValuePackaging == 0 || i.ValuePackaging == "" || i.ValuePackaging == undefined) {
                    check = { id: (k + 1), val: "pack" }
                }
                else if (i.PackageNumber == 0 || i.PackageNumber == '' || i.PackageNumber == undefined) {
                    check = { id: (k + 1), val: "num" }
                }
            }
        });
        if (check.id !== undefined) {
            // if (check.val == 'lot' && Function.Id !== '3') {
            //     Alertwarning(`Vui lòng kiểm tra số lô dòng số ${check.id}!`)
            //     return
            // } else
            if (check.val == 'pack') {
                Alertwarning(`Please check the unit line number ${check.id}!`)
                return
            } {
                Alertwarning(`Please check the quantity of line numbers ${check.id}!`)
                return
            }
        }

        let ar = [];
        DataOK.forEach((i, k) => {
            if (i.ValuePackaging !== undefined & i.color !== 'red') {
                ar.push({
                    ProductId: i.ProductId,
                    ProductName: i.ProductName,
                    ProductPrice: i.ProductPrice,
                    TotalPrice: i.TotalPrice,
                    PriceExchange: i.PriceExchange,
                    PackageNumber: i.PackageNumber,
                    TotalWeight: 0,//i.TotalWeight.toString().replaceAll(",", ""),
                    WeightExchange: i.WeightExchange,
                    NumberConversion: i.ValuePackaging.NumberConversion,
                    ProductPackagingId: i.ValuePackaging.value,
                    ProductPackagingName: i.ValuePackaging.label,
                    WareHouseId: 0,
                    WareHouseAreaId: 0,
                    WareHouseShelvesId: 0,
                    WareHouseFloorId: 0,
                    WareHouseLocationId: 0,
                    WareHouseFromId: 0,
                    WareHouseAreaFromId: 0,
                    WareHouseShelvesFromId: 0,
                    WareHouseFloorFromId: 0,
                    WareHouseLocationFromId: 0,
                    Lotnumber: i.CodeSeriIme,
                    DateofManufacture: FormatDateJson(i.DateofManufacture, 1),
                    DateExpiry: FormatDateJson(i.DateExpiry, 1)
                })
            }

        });
        //#endregion validate

        if (ar.length == 0 && DataOK.length > 0) {
            Alertwarning("Please enter product quantity!")
            return
        }
        if (ar.length == 0) {
            Alertwarning("No valid products yet!")
            return
        }
        try {
            const params = {
                Json: JSON.stringify({
                    Id: ID,
                    StrategyId: StrategyId,
                    Code: StrategyCode,
                    AreaId: Area.value,
                    CustomerId: CustomerId.value,
                    WareHouseId: Warehouse.value,
                    WareHouseToId: WarehouseTo.value,
                    CreateTime: FormatDateJson(Dates),
                    VehicleId: Vehicle.value,
                    DriverId: Driver.value,
                    DriverName: Driver.label,
                    POcode: POcode.trim(),
                    // ProviderId: Provider.value,
                    // CuratorId: Curator.value,
                    Note: Description.toString().replaceAll('"', "'"),
                    StaffId1: StaffId1,
                    StaffName1: StaffName1,
                    StaffId2: StaffId2,
                    StaffName2: StaffName2,
                    StaffId3: StaffId3,
                    StaffName3: StaffName3,
                    CreateId: GetDataFromLogin("AccountId"),
                    CreateName: GetDataFromLogin("AccountName"),
                    Type: 2,//loại thực tế
                    Detail: ar,
                    RecipientName: RecipientName,
                    RecipientAddress: RecipientAddress,
                    RecipientPhone: RecipientPhone,
                    RecipientCompany: RecipientCompany,
                    RecipientId: RecipientId.value
                }),
                func: "WH_spWareHouse_Export_Save",
                API_key: APIKey
            }

            const list = await mainAction.API_spCallServer(params, dispatch);
            console.log(params, "params")
            if (list.Status == 'OK') {
                Alertsuccess(list.ReturnMess)
                ClearFrom()
                setAccountId([{}]);
            } else {
                Alertwarning(list.ReturnMess)
            }
        } catch (error) {
            Alerterror("Data error, please contact IT NETCO !");
            console.log(error, Function._funcsave)
        }

    }

    // WH_spWareHouse_StrategyActual_List 
    const WH_spWareHouse_StrategyActual_List = async () => {
        if (Fromdate === '' | Fromdate === null) {
            Alertwarning("Vui lòng chọn Từ ngày!")
            // FromdateRef.current.focus();
            return
        }
        if (Todate === '' | Todate === null) {
            Alertwarning("Vui lòng chọn Đến ngày!")
            // TodateRef.current.focus();
            return
        }
        try {
            const params = {
                Json: JSON.stringify({
                    Fromdate: FormatDateJson(Fromdate),
                    Todate: FormatDateJson(Todate),
                    Code: Code,
                    CustomerId: CusId.value === -1 ? 0 : CusId.value,
                    AreaId: Area_Id.value === -1 ? 0 : Area_Id.value,
                    WareHouseId: WareHouseId.value === -1 ? 0 : WareHouseId.value,
                    WareHouseIdTo: WarehouseTo2.value === -1 ? 0 : WarehouseTo2.value,
                    StaffId: StaffId.value === -1 ? 0 : StaffId.value,
                    CreateTime: FormatDateJson(CreateTime, 1),
                    Status: StatusId.value,
                    CreateId: CreateId.value === -1 ? 0 : CreateId.value,
                    Keys: Function.Id,
                    Type: 2
                }),
                func: "WH_spWareHouse_StrategyActual_List",
                API_key: APIKey
            }
            const list = await mainAction.API_spCallServer(params, dispatch);
            if (list.length > 0) {
                setDataList(list)
            } else {
                Alertwarning("Không có dữ liệu!")
                setExcel([])
                setDateExcel([])
                setDataList([])
            }
        } catch (error) {
            setExcel([])
            setDateExcel([])
            setDataList([])
            Alerterror("Lỗi dữ liệu,vui lòng liên hệ IT NETCO !");
            console.log(error, "WH_spWareHouse_StrategyActual_List")
        }

    }

    // WH_spWareHouse_Strategy_AutoArrange 
    const WH_spWareHouse_Strategy_AutoArrange = async (Id) => {
        try {
            const params = {
                Json: JSON.stringify({
                    AccountId: GetDataFromLogin("AccountId"),
                    Id: Id,
                    Keys: Function.Id
                }),
                func: "WH_spWareHouse_Strategy_AutoArrange",
                API_key: APIKey
            }
            const list = await mainAction.API_spCallServer(params, dispatch);
            Alertsuccess(list.ReturnMess)
        } catch (error) {
            Alerterror("Lỗi dữ liệu,vui lòng liên hệ IT NETCO !");
            console.log(error, "WH_spWareHouse_Strategy_AutoArrange")
        }

    }

    const CheckOne = (Id, Check) => {
        let _DataList = [...DataList]
        if (Id == 0) {
            _DataList.forEach(i => {
                if (i.Status === 'Mới tạo') {
                    i.IsCheck = !Checkall;
                }
            })
            setCheckall(!Checkall)
        } else {
            if (Check === undefined)
                Check = false;
            _DataList.find(p => p.Id == Id).IsCheck = !Check
        }
        setDataList(_DataList);
    };

    const WH_spWareHouse_StrategyActual_Delete = async (id) => {
        try {
            const ar = [];
            if (id === -1) {
                let data = DataList.filter(a => a.IsCheck === true)
                if (data.length === 0) {
                    Alertwarning('Vui lòng chọn chiến lược để xóa!')
                    return
                }
                data.forEach(element => {
                    ar.push(
                        { Id: element.Id }
                    )
                });
            } else {
                ar.push({
                    Id: id
                })
                DataList.find(a => a.Id === id).IsCheck = true
            }
            ConfirmAlert("Xóa phiếu thực tế", "Bạn có chắc muốn xóa phiếu thực tế này?", async () => {
                const params = {
                    Json: JSON.stringify({
                        ListId: ar,
                        AccountId: GetDataFromLogin("AccountId"),
                        AccountName: GetDataFromLogin("AccountName"),
                        Keys: Function.Id,
                        Type: 2
                    }),
                    func: "WH_spWareHouse_StrategyActual_Delete",
                    API_key: APIKey
                }
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result.Status === "OK") {
                    Alertsuccess(result.ReturnMess)
                    setDataList(DataList.filter(a => a.IsCheck !== true))
                    return
                } else {
                    Alertwarning(result.ReturnMess)
                }
            })
        } catch (error) {
            Alerterror("Lỗi dữ liệu,vui lòng liên hệ IT NETCO !");
            console.log(error, "WH_spWareHouse_StrategyActual_Delete")
        }
    }

    const WH_spWareHouse_StrategyActual_DetailList = async (row) => {
        try {
            const params = {
                Json: JSON.stringify({
                    Id: row.value,
                    AccountId: GetDataFromLogin("AccountId"),
                    Keys: Function.Id,
                    Type: 2 //1 -- chien luoc 2 thực tế
                }),
                func: "WH_spWareHouse_StrategyActual_DetailList",
                API_key: APIKey
            }
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.length > 0) {
                setDataDetailList(result)
                setTitle({ code: row.original.Code, number: row.original.TotalProduct, ratio: ((parseInt(result.reduce((a, v) => a = a + v.ExpectedNumber, 0)) / parseInt(row.original.TotalProduct)) * 100) })

                //count group product
                const Counts = Object.values(result.reduce((e, { ProductsGroupId }) => {
                    e[ProductsGroupId] = e[ProductsGroupId] || { Count: 0 };
                    // e[ProductsGroupId].Count++;
                    return e;
                }, {}));
                setCountGroup(Counts.length)
                //count group product
            } else {
                setDataDetailList([])
                Alertwarning("Không có dữ liệu chi tiết!")
            }
        } catch (error) {
            setDataDetailList([])
            Alerterror("Lỗi dữ liệu,vui lòng liên hệ IT NETCO !");
            console.log(error, "WH_spWareHouse_StrategyActual_DetailList")
        }
    }
    const WH_spWareHouse_Arrange_Detail = async (ProductId, row) => {
        try {

            const params = {
                Json: JSON.stringify({
                    Id: row.original.Id,
                    AccountId: GetDataFromLogin("AccountId"),
                    Keys: Function.Id,
                    ProductId: ProductId
                }),
                func: "WH_spWareHouse_Arrange_Detail",
                API_key: APIKey
            }
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.length > 0) {
                setDataDetailArrange(result)
            } else {
                Alertwarning("Lỗi dữ liệu chi tiết!")
            }
        } catch (error) {
            Alerterror("Lỗi dữ liệu,vui lòng liên hệ IT NETCO !");
            console.log(error, "WH_spWareHouse_Arrange_Detail")
        }
    }
    const WH_spWareHouse_CheckCode_Strategy = async (a) => {
        setDataOK([])
        if (a.key === "Enter") {
            try {
                const params = {
                    Json: JSON.stringify({
                        Code: a.target.value.trim(),
                        UserId: GetDataFromLogin("AccountId"),
                        Keys: Function.Id,
                    }),
                    func: "WH_spWareHouse_CheckCode_Strategy",
                    API_key: APIKey
                }
                const result = await mainAction.API_spCallServer(params, dispatch);

                if (result.Status !== "No") {
                    debugger
                    console.log(result)
                    setdisable(false)
                    if (result[0].StaffId3 !== 0) {
                        setAccountId([{ value: result[0].StaffId1, label: result[0].StaffName1 }, { value: result[0].StaffId2, label: result[0].StaffName2 }, { value: result[0].StaffId3, label: result[0].StaffName3 }])
                    }
                    else if (result[0].StaffId2 !== 0) {
                        setAccountId([{ value: result[0].StaffId1, label: result[0].StaffName1 }, { value: result[0].StaffId2, label: result[0].StaffName2 }])
                    }
                    else if (result[0].StaffId1 !== 0) {
                        setAccountId([{ value: result[0].StaffId1, label: result[0].StaffName1 }])
                    }
                    setDriver({ value: result[0].DriverId })
                    setWarehouse({ value: result[0].WareHouseId })
                    setWarehouseTo({ value: result[0].WareHouseToId })
                    setArea({ value: result[0].AreaId })
                    setCustomerId({ value: result[0].CustomerId })
                    setDates(new Date(result[0].StrategyTime))
                    setVehicle({ value: result[0].VehicleId })
                    setDescription(result[0].Note)
                    setStrategyId(result[0].Id)
                    setPOcode(result[0].POcode)
                    setProvider({ value: result[0].ProviderId })
                    setCurator({ value: result[0].CuratorId })
                    debugger
                    result.forEach((element, k) => {
                        result.find(i => i.ProductId === element.ProductId).ValuePackaging = { value: element.ProductPackagingId, NumberConversion: element.NumberConversion, label: element.ProductPackagingName };
                    });
                    setDataOK(result)
                    setIsRun(IsRun + 1)
                } else {
                    Alertwarning(result.ReturnMess)
                }
            } catch (error) {
                Alerterror("Lỗi dữ liệu,vui lòng liên hệ IT NETCO !");
                console.log(error, "WH_spWareHouse_CheckCode_Strategy")
            }
        }
    }

    const Edit = async (row) => {
        setDataOK([])
        setdisable(true)
        if (row.original.StaffId3 !== 0) {
            setAccountId([{ value: row.original.StaffId1, label: row.original.StaffName1 }, { value: row.original.StaffId2, label: row.original.StaffName2 }, { value: row.original.StaffId3, label: row.original.StaffName3 }])
        }
        else if (row.original.StaffId2 !== 0) {
            setAccountId([{ value: row.original.StaffId1, label: row.original.StaffName1 }, { value: row.original.StaffId2, label: row.original.StaffName2 }])
        }
        else if (row.original.StaffId1 !== 0) {
            setAccountId([{ value: row.original.StaffId1, label: row.original.StaffName1 }])
        }
        document.querySelector("#tab_1").click();
        setStrategyCode(row.original.StrategyCode)
        setDriver({ value: row.original.DriverId })
        setWarehouse({ value: row.original.WareHouseId })
        setWarehouseTo({ value: row.original.WareHouseToId })
        setArea({ value: row.original.AreaId })
        setCustomerId({ value: row.original.CustomerId })
        setDates(new Date(row.original.StrategyTime))
        setVehicle({ value: row.original.VehicleId })
        setDescription(row.original.Note)
        setID(row.original.Id)

        try {
            const params = {
                Json: JSON.stringify({
                    Id: row.original.Id,
                    AccountId: GetDataFromLogin("AccountId"),
                    Keys: Function.Id,
                    Type: 2
                }),
                func: "WH_spWareHouse_StrategyActual_DetailList",
                API_key: APIKey
            }
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.length > 0) {
                result.forEach((element, k) => {
                    result.find(i => i.ProductId === element.ProductId).ValuePackaging = { value: element.ProductPackagingId, NumberConversion: element.NumberConversion, label: element.ProductPackagingName };
                });
                setDataOK(result)
                setIsRun(IsRun + 1)
            } else {
                Alertwarning("Lỗi dữ liệu chi tiết!")
            }
            setdisable(false)
        } catch (error) {
            Alerterror("Lỗi dữ liệu,vui lòng liên hệ IT NETCO !");
            console.log(error, "WH_spWareHouse_StrategyActual_DetailList")
        }

    }

    const Activer = (e) => {
        if (e === null) {
            setAccountId([{}])
            return
        }
        setAccountId([...e])
    }
    //WH_spCustomerContract_Load DATA LOCATION
    const WH_spCustomerContract_Load = async (ID) => {
        if (ID === 0 || ID === undefined || ID === -1) { return }
        try {
            const params = {
                Json: JSON.stringify({
                    CustomerId: CustomerId.value,
                    WareHouseId: ID,
                    UserId: GetDataFromLogin("AccountId")
                }),
                func: "WH_spCustomerContract_Load",
                API_key: APIKey
            }
            const list = await mainAction.API_spCallServer(params, dispatch);
            if (list.length > 0) {
                setCustomerContractData(list)
            } else {
                Alertwarning("Không có dữ liệu thuê kho!")
                setCustomerContractData([])
            }
        } catch (error) {
            Alerterror("Lỗi dữ liệu,vui lòng liên hệ IT NETCO !");
            console.log(error, "WH_spCustomerContract_Load")
        }
    }
    const WH_spWereHouse_Export_Inventory = async (ID) => {
        if (ID === 0 || ID === undefined || ID === -1) { return }
        try {
            const params = {
                Json: JSON.stringify({
                    CustomerId: CustomerId.value,
                    WareHouseId: ID,
                    UserId: GetDataFromLogin("AccountId")
                }),
                func: "WH_spWereHouse_Export_Inventory",
                API_key: APIKey
            }
            debugger
            const list = await mainAction.API_spCallServer(params, dispatch);
            if (list.JsonReturn1.length !== undefined || list.JsonReturn2.length !== undefined) {
                setInventoryData1(list.JsonReturn1)
                setInventoryData2(list.JsonReturn2)
            } else {
                Alertwarning("Không có dữ liệu nhập kho !")
                setInventoryData1([])
                setInventoryData2([])
            }
        } catch (error) {
            Alerterror("Lỗi dữ liệu,vui lòng liên hệ IT NETCO !");
            console.log(error, "WH_spWereHouse_Export_Inventory")
        }
    }
    const Exportexcel = () => {
        const newData = DataList.map(element => {
            return {
                'Trạng thái': element.Status,
                'Loại': element.TypeTransport,
                'Mã chiến lược': element.StrategyCode,
                'Mã thực tế': element.Code,
                'Mã KH': element.CustomerName,
                'NV thực hiện 1': element.StaffName1,
                'NV thực hiện 2': element.StaffName2,
                'NV thực hiện 3': element.StaffName3,
                'SL sản phảm': element.TotalProduct,
                'Mã PO': element.POcode,
                'Nhà cung cấp': element.ProviderName,
                'Người phụ trách': element.CuratorName,
                'Tên xe': element.NameVehicle,
                'Tài xế': element.DriverName,
                'Thời gian dự kiến': FormatDateJson(element.StrategyTime),
                'Khu vực': element.Name,
                'Kho': element.WareHouseName,
                'KV xuất': element.Name,
                'Kho xuất': element.WareHouseName,
                'KV nhập': element.NameTo,
                'Kho nhập': element.WareHouseNameTo,
                'Ghi chú': element.Note,
                'Người tạo': element.CreateName,
                'Ngày tạo': FormatDateJson(element.CreateTime),
                'Người sửa': element.EditName,
                'Ngày sửa': FormatDateJson(element.EditTime)
            }
        })
        newData.forEach(function (x) {
            if (columns.find(a => a.accessor === 'Status') === undefined) { delete x["Trạng thái"] }
            else if (columns.find(a => a.accessor === 'Status').show === false) { delete x["Trạng thái"] }
            if (columns.find(a => a.accessor === 'TypeTransport') === undefined) { delete x["Loại"] }
            else if (columns.find(a => a.accessor === 'TypeTransport').show === false) { delete x["Loại"] }
            if (columns.find(a => a.accessor === 'StrategyCode') === undefined) { delete x["Mã chiến lược"] }
            else if (columns.find(a => a.accessor === 'StrategyCode').show === false) { delete x["Mã chiến lược"] }
            if (columns.find(a => a.accessor === 'Code') === undefined) { delete x["Mã thực tế"] }
            else if (columns.find(a => a.accessor === 'Code').show === false) { delete x["Mã thực tế"] }
            if (columns.find(a => a.accessor === 'CustomerName') === undefined) { delete x["Mã KH"] }
            else if (columns.find(a => a.accessor === 'CustomerName').show === false) { delete x["Mã KH"] }
            if (columns.find(a => a.accessor === 'StaffName1') === undefined) { delete x["NV thực hiện 1"] }
            else if (columns.find(a => a.accessor == 'StaffName1').show === false) { delete x["NV thực hiện 1"] }
            if (columns.find(a => a.accessor === 'StaffName2') === undefined) { delete x["NV thực hiện 2"] }
            else if (columns.find(a => a.accessor == 'StaffName2').show === false) { delete x["NV thực hiện 2"] }
            if (columns.find(a => a.accessor === 'StaffName3') === undefined) { delete x["NV thực hiện 3"] }
            else if (columns.find(a => a.accessor == 'StaffName3').show === false) { delete x["NV thực hiện 3"] }
            if (columns.find(a => a.accessor === 'StrategyTime') === undefined) { delete x["Thời gian dự kiến"] }
            else if (columns.find(a => a.accessor == 'StrategyTime').show === false) { delete x["Thời gian dự kiến"] }
            if (columns.find(a => a.accessor === 'Note') === undefined) { delete x["Ghi chú"] }
            else if (columns.find(a => a.accessor == 'Note').show === false) { delete x["Ghi chú"] }
            if (columns.find(a => a.accessor === 'TotalProduct') === undefined) { delete x["SL sản phảm"] }
            else if (columns.find(a => a.accessor === 'TotalProduct').show === false) { delete x["SL sản phảm"] }
            if (columns.find(a => a.accessor === 'POcode') === undefined) { delete x["Mã PO"] }
            else if (columns.find(a => a.accessor === 'POcode').show === false) { delete x["Mã PO"] }
            if (columns.find(a => a.accessor === 'ProviderName') === undefined) { delete x["Nhà cung cấp"] }
            else if (columns.find(a => a.accessor === 'ProviderName').show === false) { delete x["Nhà cung cấp"] }
            if (columns.find(a => a.accessor === 'CuratorName') === undefined) { delete x["Người phụ trách"] }
            else if (columns.find(a => a.accessor === 'CuratorName').show === false) { delete x["Người phụ trách"] }
            if (columns.find(a => a.accessor === 'NameVehicle') === undefined) { delete x["Tên xe"] }
            else if (columns.find(a => a.accessor === 'NameVehicle').show === false) { delete x["Tên xe"] }
            if (columns.find(a => a.accessor === 'DriverName') === undefined) { delete x["Tài xế"] }
            else if (columns.find(a => a.accessor === 'DriverName').show === false) { delete x["Tài xế"] }
            if (columns.find(a => a.Header === 'Khu vực') === undefined) { delete x["Khu vực"] }
            else if (columns.find(a => a.Header === 'Khu vực').show === false) { delete x["Khu vực"] }
            if (columns.find(a => a.Header === 'Kho') === undefined) { delete x["Kho"] }
            else if (columns.find(a => a.Header === 'Kho').show === false) { delete x["Kho"] }
            if (columns.find(a => a.Header === 'KV xuất') === undefined) { delete x["KV xuất"] }
            else if (columns.find(a => a.Header === 'KV xuất').show === false) { delete x["KV xuất"] }
            if (columns.find(a => a.Header === 'Kho xuất') === undefined) { delete x["Kho xuất"] }
            else if (columns.find(a => a.Header === 'Kho xuất').show === false) { delete x["Kho xuất"] }
            if (columns.find(a => a.accessor == 'NameTo') === undefined) { delete x["KV nhập"] }
            else if (columns.find(a => a.accessor === 'NameTo').show === false) { delete x["KV nhập"] }
            if (columns.find(a => a.accessor == 'WareHouseNameTo') === undefined) { delete x["Kho nhập"] }
            else if (columns.find(a => a.accessor === 'WareHouseNameTo').show === false) { delete x["Kho nhập"] }
            if (columns.find(a => a.accessor == 'CreateName') === undefined) { delete x["Người tạo"] }
            else if (columns.find(a => a.accessor === 'CreateName').show === false) { delete x["Người tạo"] }
            if (columns.find(a => a.accessor == 'CreateTime') === undefined) { delete x["Ngày tạo"] }
            else if (columns.find(a => a.accessor === 'CreateTime').show === false) { delete x["Ngày tạo"] }
            if (columns.find(a => a.accessor == 'EditName') === undefined) { delete x["Người sửa"] }
            else if (columns.find(a => a.accessor === 'EditName').show === false) { delete x["Người sửa"] }
            if (columns.find(a => a.accessor == 'EditTime') === undefined) { delete x["Ngày sửa"] }
            else if (columns.find(a => a.accessor === 'EditTime').show === false) { delete x["Ngày sửa"] }
        });
        ExportExcel(newData, "Danh sách " + Function.Name);
    }
    const viewImageInTable = (e) => {
        setModalImg({ ProductName: e.ProductName, Image: e.Image })
    }
    //set show col special
    const show_Column_Special = (id) => {
        Datacolumn.map(column => {
            if (column.keys === 1) {
                column.show = id == 3 ? true : false;
                return column;
            }
            if (column.keys === 2) {
                column.show = id != 3 ? true : false;
                return column;
            } else {
                return column;
            }
        })
        setcolumns(Datacolumn)
    };
    const [columns, setcolumns] = useState([
        {
            Header: (<div className="col-sm-12">
                <div className="icheck-success d-inline">
                    <input type="checkbox"
                        // value={Checkall}
                        defaultChecked={Checkall === true ? "checked" : ""}
                        id='Checkall'
                        name='Checkall'
                        key='Checkall'
                        onChange={e => {
                            setdataarray({ Number: dataarray.Number + 1, _row: {}, keys: 'checkall' })

                        }}
                    />
                    <label className="label checkbox" htmlFor='Checkall'></label>
                </div>
            </div>),
            accessor: 'Id',
            filterable: false,
            sortable: false,
            width: 50,
            maxWidth: 50,
            special: true,
            show: true,
            textAlign: "center",
            Cell: (row) => (
                <div className="col-sm-12">
                    <div className="icheck-success d-inline">
                        <input type="checkbox"
                            id={row.original.Id} value={row.original.Id}
                            checked={row.original.IsCheck}
                            disabled={row.original.Status === 'Mới tạo' ? false : true}
                            onChange={e => {
                                setdataarray({ Number: dataarray.Number + 1, _row: row, keys: 'check' })
                            }}
                        />
                        <label className="label checkbox" htmlFor={row.original.Id}></label>
                    </div>
                </div>
            )
        },
        {
            Header: 'Tùy chọn',
            accessor: 'Id',
            special: true,
            show: true,
            filterable: false,
            sortable: false,
            width: 180,
            textAlign: "center",
            key: 'Id',
            Cell: (row) => (
                <span>
                    <button key={row.index + 1}
                        data-tooltip="Detail"
                        className="btn btn-sm btn-info mr-2 show__tip__left"
                        data-toggle="modal" data-target="#myModal"
                        onClick={e => setdataarray({ Number: dataarray.Number + 1, _row: row, keys: 'view' })}
                    >
                        <i className="fa-solid fa-eye"></i>
                    </button>
                    {
                        <button key={row.index + 4}
                            data-tooltip="Print"
                            className="btn btn-sm btn-success mr-2 show__tip__left"
                            onClick={(e) => setdataarray({ Number: dataarray.Number + 1, _row: row, keys: 'print' })}
                        >
                            <i className="fas fa-wrench"></i>
                        </button>
                    }
                    {
                        row.original.Status === 'Mới tạo' ?
                            <button key={row.index + 2}
                                data-tooltip="Sửa"
                                className="btn btn-sm btn-success mr-2 show__tip__left"
                                onClick={(e) => setdataarray({ Number: dataarray.Number + 1, _row: row, keys: 'edit' })}
                            >
                                <i className="fas fa-wrench"></i>
                            </button> : ""
                    }
                    {
                        row.original.Status === 'Mới tạo' ?
                            <button key={row.index + 3}
                                data-tooltip="Xoá"
                                className="btn btn-sm btn-danger mr-2 show__tip__right"
                                onClick={(a) => setdataarray({ Number: dataarray.Number + 1, _row: row, keys: 'delete' })}
                            >
                                <i className="fa fa-trash"></i>
                            </button> : ""
                    }
                    {/* {
                        row.original.Status === 'Mới tạo' ?
                            <button key={row.index + 4}
                                data-tooltip="Tạo lệnh"
                                className="btn btn-sm btn-info show__tip__right"
                                onClick={(a) => setdataarray({ Number: dataarray.Number + 1, _row: row, keys: 'arrange' })}
                            >
                                <i className="fa fa-check"></i>
                            </button> : ""
                    } */}
                </span>)
        }, {
            Header: I18n.t('Report.STT'),
            accessor: 'Id',
            special: true,
            filterable: false,
            sortable: false,
            show: true,
            Cell: (row) => <span>{row.index + 1}</span>,
        },
        {
            Header: "Trạng thái",
            accessor: 'Status',
            width: 180,
            Cell: (obj) => obj.value === 'Mới tạo' ? <label className="btn labelradius10px new">{obj.value}</label> :
                <label className="btn labelradius10px older">{obj.value}</label>
        },
        {
            Header: "Loại",
            accessor: 'TypeTransport',
            show: false,
            keys: 1,
            width: 180,
            special: true,
            Cell: (obj) => obj.value === 'Nội bộ' ?
                <label className="btn labelradius10px new">{obj.value}</label>
                :
                <label className="btn labelradius10px older">{obj.value}</label>
        }, {
            Header: "Mã chiến lược",
            accessor: "StrategyCode",
            width: 180
        },
        {
            Header: "Mã thực tế",
            accessor: 'Code',
            width: 180

        },
        {
            Header: "Mã KH",
            accessor: "CustomerCode",
            width: 180
        },
        {
            Header: "NV thực hiện 1",
            accessor: "StaffName1",
            width: 180
        },
        {
            Header: "NV thực hiện 2",
            accessor: "StaffName2",
            width: 180
        },
        {
            Header: "NV thực hiện 3",
            accessor: "StaffName3",
            width: 180
        },
        {
            Header: "SL sản phẩm",
            accessor: "TotalProduct",
            width: 180
        },
        {
            Header: "Tên xe",
            accessor: "NameVehicle",
            width: 180,
            show: false,
        },
        {
            Header: "Tài xế",
            accessor: "DriverName",
            width: 180,
            show: false,
        },
        {
            Header: "Mã PO",
            accessor: "POcode",
            width: 180
        },
        // {
        //     Header: "Người phụ trách",
        //     accessor: "CuratorName",
        //     width: 180
        // }, 
        // {
        //     Header: "Nhà cung cấp",
        //     accessor: "ProviderName",
        //     width: 180
        // },
        {
            Header: "Thời gian dự kiến",
            accessor: "StrategyTime",
            Cell: (obj) => FormatDateJson(obj.value),
            width: 180
        },
        {
            Header: "Khu vực",//
            accessor: "Name",
            show: true,
            keys: 2,
            special: true
        }, {
            Header: "Kho",//
            accessor: "WareHouseName",
            show: true,
            keys: 2,
            special: true
        },
        {
            Header: "KV xuất",//
            accessor: "Name",
            show: false,
            keys: 1,
            special: true
        }, {
            Header: "Kho xuất",//
            accessor: "WareHouseName",
            show: false,
            keys: 1,
            special: true
        },
        {
            Header: "KV nhập",//
            accessor: "NameTo",
            show: false,
            keys: 1,
            special: true
        }, {
            Header: "Kho nhập",//
            accessor: "WareHouseNameTo",
            show: false,
            keys: 1,
            special: true
        }, {
            Header: "Ghi chú",
            accessor: "Note",
            width: 180
        }, {
            Header: "Người tạo",
            accessor: "CreateName",
            width: 180
        }, {
            Header: "Ngày tạo",
            accessor: "CreateTime",
            Cell: (obj) => FormatDateJson(obj.value),
            width: 180
        }, {
            Header: "Người sửa",
            accessor: "EditName",
            width: 180
        }, {
            Header: "Ngày sửa",
            accessor: "EditTime",
            width: 180,
            Cell: (obj) => FormatDateJson(obj.value)
        }

    ]);
    const ViewImgDetail = (
        <div class="modal fade" id="modalImg2" role="dialog2">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <div className="row edit__user__header">
                            <h4 className="">
                                <i className="fa-solid fa-image mr-2"></i>
                                {ModalImg.ProductName}
                            </h4>
                            <a className="btn btn__default" data-dismiss="modal">
                                <i className="fa fa-times-circle edit__close__icon" />
                            </a>
                        </div>
                    </div>
                    <div class="modal-body text-center">
                        <img src={ModalImg.Image} width="800" />
                    </div>
                </div>
            </div>
        </div>
    );
    const columnsDetail = [
        {
            Header: 'Tùy chọn',
            accessor: 'ProductId',
            show: true,
            filterable: false,
            sortable: false,
            width: 180,
            textAlign: "center",
            Cell: (row) => (
                <span>
                    <button key={row.index + 1}
                        data-tooltip="Chi tiết"
                        className="btn btn-sm btn-info mr-2 show__tip__left"
                        onClick={e => WH_spWareHouse_Arrange_Detail(row.value, row)}
                    >
                        <i className="fa-solid fa-eye"></i>
                    </button>
                </span>)
        }, {
            Header: I18n.t('Report.STT'),
            filterable: false,
            sortable: false,
            Cell: (row) => <span>{row.index + 1}</span>
        },
        {
            Header: "Nhóm SP",
            accessor: 'ProductGroupName',

        },
        {
            Header: "Mã SP",
            accessor: 'ProductCode',

        },
        {
            Header: "Hình ảnh",
            accessor: "Image",
            Cell: (row) => (
                <div>
                    <a
                        className="cursor"
                        data-toggle="modal"
                        data-target="#modalImg2"
                        onClick={(e) => {
                            viewImageInTable(row.original);
                        }}
                        title="Click để xem hình lớn"
                    >
                        {row.original.Image !== undefined ? <img src={row.original.Image} height="30" width="50" /> : ""}
                    </a>
                </div>
            )
        },
        {
            Header: "Đơn vị quy đổi",
            accessor: "ProductPackagingName",
        },
        {
            Header: "Số lượng",
            accessor: "PackageNumber",
        }, {
            Header: "NV hoàn thành",
            accessor: "TotalStaffFinished",
        }, {
            Header: "Số lô",
            accessor: "Lotnumber",
        }, {
            Header: "Ngày SX",
            accessor: "DateofManufacture",
            Cell: (obj) => FormatDateJson(obj.value)
        }, {
            Header: "Hạn SD",
            accessor: "DateExpiry",
            Cell: (obj) => FormatDateJson(obj.value)
        }, {
            Header: "Trạng thái lô",
            accessor: "Statusdate"
        }

    ];

    const columnsDetailCheck = [
        {
            Header: 'Tùy chọn',
            accessor: 'ProductId',
            show: true,
            // filterable: false,
            // sortable: false,
            width: 180,
            textAlign: "center",
            Cell: (row) => (
                <span>
                    <button key={row.index + 1}
                        data-tooltip="Chi tiết"
                        className="btn btn-sm btn-info mr-2 show__tip__left"
                        onClick={e => WH_spWareHouse_Arrange_Detail(row.value, row)}
                    >
                        <i className="fa-solid fa-eye"></i>
                    </button>
                </span>)
        }, {
            Header: I18n.t('Report.STT'),
            filterable: false,
            sortable: false,
            Cell: (row) => <span>{row.index + 1}</span>
        },
        {
            Header: "Nhóm SP",
            accessor: 'ProductGroupName',

        },
        {
            Header: "Mã SP",
            accessor: 'ProductCode',

        },
        {
            Header: "Hình ảnh",
            accessor: "Image",
            Cell: (row) => <img src={row.value} width="48" />
        },
        {
            Header: "Đơn vị quy đổi",
            accessor: "ProductPackagingName",
        },
        {
            Header: "SL tồn",
            accessor: "PackageNumber",
        },
        {
            Header: "Sl Scan thực tế",
            accessor: 'ExpectedNumber',

        }, {
            Header: "NV hoàn thành",
            accessor: "TotalStaffFinished",
        }

    ];
    const columnsDetailArrange = [
        {
            Header: I18n.t('Report.STT'),
            filterable: false,
            sortable: false,
            Cell: (row) => <span>{row.index + 1}</span>
        },
        {
            Header: "NV thực hiện",
            accessor: 'CreateName',
        },
        {
            Header: "Sl dự kiến",
            accessor: 'ExpectedNumber',

        },
        {
            Header: "Thời gian hoàn thành",
            accessor: "ScanTime",
            Cell: (obj) => FormatDateJson(obj.value)
        },
        {
            Header: "Kho",
            accessor: "WareHouseName",
        },
        {
            Header: "Khu vực",
            accessor: "WareHouseAreaName",
        }, {
            Header: "Kệ ",
            accessor: "ShelvesName",
        }, {
            Header: "Tầng ",
            accessor: "FloorName",
        }, {
            Header: "Location",
            accessor: "LocationName",
        }, {
            Header: "SL tương ứng",
            accessor: "ActualNumber",
        }

    ];
    const dropdown = (
        <div
            onClick={e => {
                setFunction({ Id: e.target.id, _funcsave: e.target.attributes._funcsave.value, Name: e.target.innerText })
                setDataList([])
                setDataOK([])
                setID(0)
                show_Column_Special(e.target.id)
                ClearFrom()
            }}
        >
            <a id={1} _funcsave={'WH_spWareHouse_Import_Save'}>vận hành nhập kho thực tế</a>
            <a id={2} _funcsave={'WH_spWareHouse_Export_Save'}>vận hành xuất kho thực tế</a>
            <a id={3} _funcsave={'WH_spWareHouse_Transport_Save'}>vận hành chuyển kho thực tế</a>
            <a id={4} _funcsave={'WH_spWareHouse_Check_Save'} >vận hành kiểm kho thực tế</a>
        </div>
    )
    //#region modal detail product group
    //#region function

    const HtmlDetail = (
        <div className="container">
            <div className="modal fade" id="myModal" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content width_height100 modal__detail__table">
                        <div class="modal-header">
                            <div className="row edit__user__header">
                                <h4 className="">
                                    <i className="fa fa-users mr-2" />
                                    Chi tiết {Title.code}
                                </h4>
                                <a className="btn btn__default" data-dismiss="modal"
                                    onClick={a => setTitle({})}
                                >
                                    <i className="fa fa-times-circle edit__close__icon" />

                                </a>
                            </div>
                        </div>
                        <div className="card-header">
                            <div className='row col-md-12 text-center size20-weight300'>
                                <span className="col-md-6"> <i className="fa-solid fa-circle icon-red"></i> Tổng SL SP: <span className="green">{Title.number}</span></span>
                                <span className="col-md-6"> <i className="fa-solid fa-circle icon-red"></i> Đã hoàn thành: <span className="green">{Title.ratio}%</span></span>
                            </div>
                        </div>
                        <div className="modal-body">
                            <div className={DataDetailArrange.length > 0 ? "" : "display-none"}>
                                <div className="row">
                                    <div className="col-sm-12 card-header-btn bottom">
                                        <button type="button" className="btn btn-success btn-sm float-right"
                                            onClick={e =>
                                                setDataDetailArrange([])
                                            }
                                        >
                                            <i className="fa fa-undo" /> Trở lại
                                        </button>
                                    </div>
                                </div>
                                <DataTable data={DataDetailArrange} columns={columnsDetailArrange} />
                            </div>
                            <div className={DataDetailArrange.length == 0 ? "" : "display-none"}>

                                {Function.Id == 4 ?
                                    <DataTable data={DataDetailList} columns={columnsDetailCheck} />
                                    :
                                    <DataTable data={DataDetailList} columns={columnsDetail} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    const ViewImg = (
        <div class="modal fade" id="modalImg" tabindex="-1" role="dialog" aria-labelledby="modalImg" aria-hidden="true" >
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <div className="row edit__user__header">
                            <h4 className="">
                                <i className="fa-solid fa-image mr-2"></i>
                                {ModalImg.ProductName}
                            </h4>
                            <a className="btn btn__default" data-dismiss="modal">
                                <i className="fa fa-times-circle edit__close__icon" />
                            </a>
                        </div>
                    </div>
                    <div class="modal-body text-center">
                        <img src={ModalImg.Image} width="800" />
                    </div>
                </div>
            </div>
        </div>
    );
    return (
        <div className="content-wrapper pt-2 small">
            <section className="content">
                <div className="container-fluid">
                    <div className="card card-primary">
                        {/* <ul className="nav float-left">
                            <li className="nav-item"><a id="tab_1" className="nav-link active" href="#tab_1add" data-toggle="tab">{I18n.t('System.Add')}</a></li>
                            <li className="nav-item"><a className="nav-link " href="#tab_2" data-toggle="tab">{I18n.t('System.List')}</a></li>
                        </ul> */}
                        <div className="body-padding">
                            <div className="tab-content" id="custom-tabs-two-tabContent">
                                <div className="tab-pane fade show active" id="tab_1add" role="tabpanel" aria-labelledby="custom-tabs-two-home-tab">
                                    <div className="card-header" style={{ height: "30px !important;" }}>
                                        <div className='row'>
                                            <div className="col-sm-6">
                                                <div className="dropdown">
                                                    <h3 className="dropbtn margin-5"><i className="fa-solid fa-plus"></i> {ID !== 0 ? 'EDit ' : 'ADD NEW'} OUTBOUND OPERATION</h3>
                                                    {/* <div className="dropdown-content">
                                                        {dropdown} <i className="fa-solid fa-caret-down"></i>
                                                    </div> */}
                                                </div>
                                            </div>

                                            <div className="col-sm-6 margin-5">
                                                <button type="button" className="btn btn-danger btn-xs float-right margin-left-5 height35"
                                                    onClick={a => ClearFrom(a)}
                                                >
                                                    <i className="fa fa-trash mr-2 " />
                                                    {I18n.t('System.Cancel')}
                                                </button><button type="button" className="btn btn-success btn-xs float-right height35"
                                                    onClick={e =>
                                                        // ActualSave(e)
                                                        CheckSave()
                                                    }>
                                                    <i className="fa fa-folder mr-2 " />
                                                    {I18n.t('System.Save')}
                                                </button>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="">
                                        <div class="row right0">
                                            <div className="col-sm-12 col-md-12">
                                                <div className="card linetop brbox">
                                                    <div class="row" >
                                                        {
                                                            // CustomerContractData.length > 0 && CustomerContractData.map((item, index) => {
                                                            // return (
                                                            <>
                                                                <div className="col-sm-4 col-md-4 flodder">
                                                                    <span> 11</span>
                                                                </div>
                                                                <div className="col-sm-4 col-md-4 flodder">
                                                                    <span className=""> 22</span>
                                                                </div>
                                                                <div className="col-sm-4 col-md-4 flodder">
                                                                    <span className=""> 55</span>
                                                                </div>
                                                                <div className="col-sm-4 col-md-4 Layoutmyscanct">
                                                                    <span className="borlay"> 11</span>
                                                                </div>
                                                                <div className="col-sm-4 col-md-4 Layoutmyscanct">
                                                                    <span className="borlay"> 11</span>
                                                                </div>
                                                                <div className="col-sm-4 col-md-4 Layoutmyscanct">
                                                                    <span className="borlay"> 11</span>
                                                                </div>
                                                            </>

                                                            //     )
                                                            // })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            {ViewImg}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </section >
        </div >
    );

}