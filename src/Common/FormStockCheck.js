import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import I18n from '../Language'
import { APIKey } from '../Services/Api';
import Select from 'react-select';
import DateTimePicker from 'react-datetime-picker';
import $ from "jquery";
import { AudioTrue, AudioFalse, SelectCustomerRecipient, SelectAccount, SelectCustomer, SelectWarehouseContract, SelectProductGroup, DataTable } from "../Common";
import { mainAction } from '../Redux/Actions'
import { Alertwarning, Alertsuccess, Alerterror, GetDataFromLogin, FormatDateJson, FirstOrLastDayinMonth, FormatNumber, ExportExcel, ConfirmAlert, DateDiff, RemoveAccents } from "../Utils";
import { formatNumber } from "canvasjs-react-charts/canvasjs.min";

const FormStockCheck_ = React.forwardRef(
    (
        {
            Types = 1// 1 is outbound 2 is return outbound
        },
        ref
    ) => {
        //#region Khai báo biến
        const dispatch = useDispatch();
        const [zIndex, setzIndex] = useState(0)
        const [show1, setshow1] = useState(1)
        const [show2, setshow2] = useState(1)
        const [show3, setshow3] = useState(1)
        const [DataCheck, setDataCheck] = useState([])
        const [BrandId, setBrandId] = useState({ value: -1, label: 'Select please' })
        const [CodeInBound, setCodeInBound] = useState("");
        const [playAudioTrue, setplayAudioTrue] = useState(false);
        const [playAudioFalse, setplayAudioFalse] = useState(false);
        const [RecipientId, setRecipientId] = useState({ value: -1, label: 'Select please' })
        const [IsAcctive2, setIsAcctive2] = useState(true);
        const [CustomerContractData, setCustomerContractData] = useState([])
        const [InventoryData1, setInventoryData1] = useState([])
        const [InventoryData2, setInventoryData2] = useState([])
        const [Checkall, setCheckall] = useState(false);
        const [RecipientAddress, setRecipientAddress] = useState("");
        const [RecipientPhone, setRecipientPhone] = useState("");
        const RecipientPhoneRef = useRef();
        const RecipientNameRef = useRef();
        const RecipientCompanyRef = useRef();
        const RecipientAddressRef = useRef();
        const [RecipientName, setRecipientName] = useState("");
        const [RecipientCompany, setRecipientCompany] = useState("");
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
        const [Function, setFunction] = useState({ Id: 2, _funcsave: 'WH_spWareHouse_Check_Save', Name: 'VẬN HÀNH XUẤT KHO' });
        const [DataSearch, setDataSearch] = useState([]);
        const [DataOK, setDataOK] = useState([]);
        const [DataMain, setDataMain] = useState([])
        const [DataError, setDataError] = useState([]);
        const [IsAcctive, setIsAcctive] = useState(false);
        const [State, setState] = useState()
        const [IsRun, setIsRun] = useState(0)
        const [ModalImg, setModalImg] = useState({})
        const [dataarray, setdataarray] = useState({ Number: 0 })
        const [StrategyId, setStrategyId] = useState()
        //#endregion Khai báo biến
        useEffect(() => {
            DataOK.forEach(i => {
                WH_spProductPackaging_List(i.ProductId, i.key)// add data packaking in row item
                if (i.ProductPackagingId !== undefined) {
                    WH_spProduct_Check(i.ProductPackagingId, i.ProductId, i.key)
                }
            })
        }, [IsRun]);

        useEffect(() => {
            Types === 1 ? setdisable(false) : setdisable(true)
        }, []);
        //close choise
        $('body').on("click", function (event) {
            setIsAcctive(false)
            setzIndex(0)
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
                debugger
                let result = [], result2 = [];
                if (InventoryData2.length > 0) {
                    result = InventoryData2.filter(a => a.ProductCodeS.includes(e.target.value.trim().toUpperCase()))
                    if (result.length === 0) {
                        result = InventoryData2.filter(a => a.ProductNameS.includes(e.target.value.trim().toUpperCase()))
                    }
                    if (result.length === 0) {
                        result = InventoryData2.filter(a => a.CodeSeriImeS.includes(e.target.value.trim().toUpperCase()))
                    }
                }
                // if (InventoryData2.length > 0) {
                //     result2 = InventoryData2.filter(a => a.CodeSeriImeS.includes(e.target.value.trim().toUpperCase()))
                // }
                if (result.length > 0) {
                    setDataSearch(result);
                } else {
                    setDataSearch([{ ProductName: "No data inbound!" }]);
                }
                setIsAcctive(true)
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
                            if (ar.length > 0) {//kiểm tra từng it khi lặp
                                if (ar.find(a => a.ProductCodeS === i.toUpperCase()) !== undefined) {
                                    rowcheck = 1
                                }
                            }
                            if (DataOK.find(a => a.ProductCodeS === i.toUpperCase()) !== undefined) {
                                rowcheck = 1
                            }
                            if (rowcheck === 0) {
                                dtcheck = InventoryData2.filter(a => a.ProductCodeS === i.toUpperCase())
                                if (dtcheck.length > 0) {
                                    // dtcheck.key = (new Date().getMilliseconds() + k)
                                    let _a = [...dtcheck, ...DataOK]
                                    setDataOK(_a)
                                    ar.push(dtcheck)
                                    setIsRun(IsRun + 1)
                                }
                            }

                        }
                    })
                    if (ar.length == 0) {
                        setplayAudioFalse(new Date());
                        Alertwarning("Không có mã hợp lệ!")
                        return
                    } else {
                        setplayAudioTrue(new Date())
                    }
                }
            }

        }
        // WH_spProductPackaging_List f
        const WH_spProductPackaging_List = async (Id, key) => {
            try {
                const params = {
                    Json: JSON.stringify({ ProductId: Id }),
                    func: "WH_spProductPackaging_List",
                    API_key: APIKey
                }
                const list = await mainAction.API_spCallServer(params, dispatch);
                let dataSelect = []
                list.forEach((element, index) => {
                    dataSelect.push({ value: element.ProductPackagingId, UnitId: element.UnitId, NumberConversion: element.NumberConversion, label: element.UnitName });
                });

                DataOK.find(i => i.key === key).DataPackaging = dataSelect;
                setState({ data: DataOK })
            } catch (error) {
                Alerterror("Error,please contac IT NETCO!");
                console.log(error, "WH_spProductPackaging_List")
            }
        }

        const ClearFrom = (a) => {
            setDataCheck([])
            setInventoryData1([])
            setInventoryData2([])
            setRecipientId({ value: -1, label: 'Select please' })
            setDataOK([])
            setStrategyCode('')
            setDataError([])
            setAccountId([{}]);
            setDriver({ value: -1 });
            setWarehouse({ value: -1 });
            setWarehouseTo({ value: -1 });
            setArea({ value: -1 });
            setCustomerId({ value: -1 });
            setVehicle({ value: 0 });
            // setProvider({ value: -1 });
            // setCurator({ value: -1 });
            setPOcode("");
            setDescription("");
            setDates(new Date());
            setDataSearch([]);
            setID(0)
            // setdisable(true)
            setCustomerContractData([])
            setRecipientAddress("");
            setRecipientPhone("");
            setRecipientName("");
            setRecipientCompany("");
        }
        //choise
        const onSelecteProduct = (id, key, seri) => {
            debugger
            if (id === undefined) { return }
            if (key === 0) {
                let ar = DataSearch.find(a => a.ProductId === id);//find ở đây để k trùng (k+1) nữa vì 2 dòng giống nhau 
                let _arr = [{ ...ar }, ...DataOK,]; //use filter to push ar like this
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
                let ar = DataSearch.find(a => a.CodeSeriIme === seri);
                //--defaul values
                ar.ValuePackaging = {
                    NumberConversion: ar.UnitNumberconversion,
                    label: ar.UnitName,
                    value: ar.UnitId,
                    UnitId: ar.UnitId
                }
                ar.PackageNumber = 1
                ar.disableValuePackaging = true
                //
                setDataOK([{ ...ar }, ...DataOK])
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
                    //lưu numchecks  để trừ tồn các dòng đã nhập trước đó
                    let check = DataOK.filter(a => a.ProductId === _row.ProductId & a.key !== id), _check = 0;
                    if (check !== undefined) {
                        _check = check.reduce((a, v) => a = a + v.numchecks, 0)
                    } else { _check = 0 }
                    _row.ValuePackaging = e
                    _row.Inventoryshow = (~~((_row.Inventory - _check) / _row.ValuePackaging.NumberConversion))
                    _row.numchecks = (_row.Inventoryshow * _row.ValuePackaging.NumberConversion)
                    _row.sttcheck = true;
                    setState({ data: DataOK })
                    return
                }
            }
            else {
                _row.ValuePackaging = e
                _row.Inventoryshow = (~~(_row.Inventory / _row.ValuePackaging.NumberConversion))
                _row.numchecks = (_row.Inventoryshow * _row.ValuePackaging.NumberConversion)
                _row.PackageNumber = '';
                _row.TotalWeight = '';
                setState({ data: DataOK })
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
                Alerterror("Error,please contac IT NETCO!");
                console.log(error, "WH_spProduct_Check")
            }
        }
        const Deleterow = (Id) => {
            setDataOK(DataOK.filter(i => i.key !== Id))
        }
        // maximun Number
        const PackageNumberChange = (Id, value) => {
            let _DataOK = DataOK.find(a => a.key === Id),
                _va = parseInt(value.toString().replaceAll(',', ''));
            if (_va > _DataOK.NumberConversion) {
                _DataOK.PackageNumber = _DataOK.NumberConversion
                Alertwarning("Please enter maximun " + _DataOK.NumberConversion + " Item!")
            } else {
                debugger
                _DataOK.PackageNumber = _va
                //check reduce or increa
                if (_va > _DataOK.Inventoryshow) {
                    _DataOK.increase = _va - _DataOK.Inventoryshow
                    _DataOK.color = '#fd7e14'
                    $(".br2").addClass("shadowlct");
                    setTimeout(() => {
                        $(".br2").removeClass("shadowlct");
                    }, 100);
                }
                else if (_va < _DataOK.Inventoryshow) {
                    _DataOK.reduce = _DataOK.Inventoryshow - _va
                    _DataOK.color = '#d51dcfd1'
                    $(".br3").addClass("shadowlct");
                    setTimeout(() => {
                        $(".br3").removeClass("shadowlct");
                    }, 100);
                } else {
                    _DataOK.color = '#8c8c90'
                    _DataOK.increase = 0
                    _DataOK.reduce = 0
                }
            }
            //count total product changed
            if (_DataOK.PackageNumber !== _DataOK.Inventoryshow) {
                if (_DataOK.count !== 1) {
                    $(".br1").addClass("shadowlct");
                    setTimeout(() => {
                        $(".br1").removeClass("shadowlct");
                    }, 100);
                    _DataOK.count = 1
                }
            } else {
                _DataOK.count = 0
            }
            setState({ data: DataOK })
        }
        const WH_spWareHouse_CheckCode_Strategy = async (a) => {
            setDataOK([])
            if (a.key === "Enter") {
                try {
                    const params = {
                        Json: JSON.stringify({
                            Code: a.target.value.trim(),
                            UserId: GetDataFromLogin("AccountId"),
                            Keys: 4
                        }),
                        func: "WH_spWareHouse_CheckCode_Strategy",
                        API_key: APIKey
                    }
                    const result = await mainAction.API_spCallServer(params, dispatch);

                    if (result.Status !== "No") {
                        debugger
                        result.forEach((element, k) => {
                            result.find(i => i.Check_DetailId === element.Check_DetailId).ValuePackaging = { value: element.UnitId, NumberConversion: element.NumberConversion, label: element.UnitName };

                            element.reduce = 0;
                            element.increase = 0;
                            element.count = 0;
                        });
                        if (result[0].StaffId3 !== 0) {
                            setAccountId([{ value: result[0].StaffId1, label: result[0].StaffName1 }, { value: result[0].StaffId2, label: result[0].StaffName2 }, { value: result[0].StaffId3, label: result[0].StaffName3 }])
                        }
                        else if (result[0].StaffId2 !== 0) {
                            setAccountId([{ value: result[0].StaffId1, label: result[0].StaffName1 }, { value: result[0].StaffId2, label: result[0].StaffName2 }])
                        }
                        else if (result[0].StaffId1 !== 0) {
                            setAccountId([{ value: result[0].StaffId1, label: result[0].StaffName1 }])
                        }
                        setWarehouse({ value: result[0].WareHouseId })
                        setCustomerId({ value: result[0].CustomerId })
                        setDates(new Date(result[0].StrategyTime))
                        setDescription(result[0].Note)
                        setPOcode(result[0].POcode)
                        setID(result[0].Id)
                        setDataOK(result)
                        setDataMain(result)
                    } else {
                        Alertwarning(result.ReturnMess)
                    }
                } catch (error) {
                    Alerterror("Error,please contac IT NETCO!");
                    console.log(error, "WH_spWareHouse_CheckCode_Strategy")
                }
            }
        }

        // WH_spWareHouse_Check_Save 
        const WH_spWareHouse_Check_Save = async () => {
            //#region validate

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
            if ((AccountId.length > 3 || AccountId.length == 0 || AccountId.length == undefined || AccountId[0].value == undefined) && Types === 1) {
                Alertwarning("Please choose 1 or minimum 3 staffs!")
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
            let check = {}
            DataOK.map((i, k) => {
                if ((i.PackageNumber == 0 || i.PackageNumber == '' || i.PackageNumber == undefined) & Types === 2) {
                    check = { id: (k + 1), val: "num" }
                }
            });
            if (check.id !== undefined) {
                Alertwarning(`Please check the actual number of line numbers ${check.id}!`)
                return
            }
            debugger
            let ar = [];
            if (DataCheck.length > 0) {
                DataCheck.forEach((i, k) => {
                    ar.push({
                        ProductId: i.ProductId,
                        ProductName: i.ProductName,
                        ProductPrice: i.ProductPrice,
                        TotalPrice: i.TotalPrice,
                        PriceExchange: i.PriceExchange,
                        PackageNumber: i.Inventoryshow,// sl tồn từ hệ thống
                        TotalWeight: i.TotalWeight,
                        WeightExchange: i.WeightExchange,
                        NumberConversion: i.QuanlityExchange,
                        ProductPackagingId: i.UnitId,
                        ProductPackagingName: i.UnitName,
                        WareHouseId: Warehouse.value,
                        Lotnumber: i.CodeSeriIme,
                        DateofManufacture: FormatDateJson(i.DateofManufacture, 1),
                        DateExpiry: FormatDateJson(i.DateExpiry, 1)
                    })
                });
            } else {
                DataOK.forEach((i, k) => {
                    ar.push({
                        ProductId: i.ProductId,
                        ProductName: i.ProductName,
                        ProductPrice: i.ProductPrice,
                        TotalPrice: i.TotalPrice,
                        PriceExchange: i.PriceExchange,
                        PackageNumber: i.Inventoryshow,// sl tồn từ hệ thống
                        TotalWeight: i.TotalWeight,
                        WeightExchange: i.WeightExchange,
                        NumberConversion: i.QuanlityExchange,
                        ProductPackagingId: i.UnitId,
                        ProductPackagingName: i.UnitName,
                        WareHouseId: Warehouse.value,
                        Lotnumber: i.CodeSeriIme,
                        DateofManufacture: FormatDateJson(i.DateofManufacture, 1),
                        DateExpiry: FormatDateJson(i.DateExpiry, 1),
                        ActualNumber: i.PackageNumber// sl đã kiểm thưc tế
                    })
                });
            }

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
                        AreaId: Area.value,
                        CustomerId: CustomerId.value,
                        WareHouseId: Warehouse.value,
                        WareHouseToId: WarehouseTo.value,
                        CreateTime: FormatDateJson(Dates),
                        VehicleId: Vehicle.value,
                        DriverId: Driver.value,
                        DriverName: Driver.label,
                        POcode: POcode.trim(),
                        Note: Description.toString().replaceAll('"', "'"),
                        StaffId1: StaffId1,
                        StaffName1: StaffName1,
                        StaffId2: StaffId2,
                        StaffName2: StaffName2,
                        StaffId3: StaffId3,
                        StaffName3: StaffName3,
                        CreateId: GetDataFromLogin("AccountId"),
                        CreateName: GetDataFromLogin("AccountName"),
                        Type: Types,//1 check 2 actual
                        Detail: ar,
                        RecipientName: RecipientName,
                        RecipientAddress: RecipientAddress,
                        RecipientPhone: RecipientPhone,
                        RecipientCompany: RecipientCompany,
                        RecipientId: RecipientId.value,
                    }),
                    func: "WH_spWareHouse_Check_Save",
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
                    const _data = Object.values(
                        list.reduce(
                            (
                                a,
                                {
                                    ProductId,
                                    LocationId,
                                    LocationName
                                }
                            ) => {
                                a[LocationId] = a[LocationId] || {
                                    ProductId: ProductId,
                                    LocationId: LocationId,
                                    LocationName: LocationName
                                };
                                a[LocationId].ProductId = a[LocationId].ProductId + ";" + ProductId + ";"
                                return a;
                            },
                            {}
                        )
                    );
                    setCustomerContractData(_data)
                } else {
                    setCustomerContractData([])
                }
            } catch (error) {
                Alerterror("Error,please contac IT NETCO!");
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

                const list = await mainAction.API_spCallServer(params, dispatch);
                if (list.JsonReturn1.length !== undefined || list.JsonReturn2.length !== undefined) {
                    setInventoryData1(list.JsonReturn1)
                    setInventoryData2(list.JsonReturn2)
                } else {
                    setInventoryData1([])
                    setInventoryData2([])
                }
            } catch (error) {
                Alerterror("Error,please contac IT NETCO!");
                console.log(error, "WH_spWereHouse_Export_Inventory")
            }
        }
        const WH_spWereHouse_Export_Inventory_StockCheck = async (e, key) => {
            try {
                debugger
                if (CustomerId.value === undefined || CustomerId.value <= 0) {
                    Alertwarning("Please choise Customer ID!")
                    return
                }
                if (e.value === undefined || e.value <= 0) {
                    Alertwarning("Please choise Warehouse ID!")
                    return
                }
                const params = {
                    Json: JSON.stringify({
                        CustomerId: CustomerId.value,
                        WareHouseId: e.value,
                        UserId: GetDataFromLogin("AccountId"),
                        BrandId: BrandId.value
                    }),
                    func: "WH_spWereHouse_Export_Inventory_StockCheck",
                    API_key: APIKey
                }
                const list = await mainAction.API_spCallServer(params, dispatch);
                if (list.length > 0) {
                    if (key === 1) {
                        setInventoryData2(list)
                    } else {
                        setDataCheck(list)
                    }
                    setDataOK([])
                    setInventoryData1([])
                } else {
                    setDataOK([])
                    setInventoryData1([])
                    setInventoryData2([])
                }
            } catch (error) {
                setDataOK([])
                setInventoryData1([])
                setInventoryData2([])
                Alerterror("Error,please contac IT NETCO!");
                console.log(error, "WH_spWereHouse_Export_Inventory_StockCheck")
            }
        }
        //#region Tìm kiếm dữ liệu
        const SearchDataTable = (e) => {
            if (e != '') {
                let a = RemoveAccents(e.toLowerCase())
                let found = [];
                for (let i = 0; i < DataMain.length; i++) {
                    if (
                        RemoveAccents(DataMain[i]['ProductCode']).toLowerCase().includes(a)
                        ||
                        RemoveAccents(DataMain[i]['ProductName']).toLowerCase().includes(a)
                        ||
                        RemoveAccents(DataMain[i]['CodeSeriIme']).toLowerCase().includes(a)
                    ) {
                        found.unshift(DataMain[i]);
                    }
                }
                setDataOK(found);
            }
            else
                setDataOK(DataMain);
        }
        //#endregion
        const filterColor = (key) => {
            if (key !== 'all') {
                if (key === '#fd7e14' && show2 === 1) {
                    setDataOK([...DataMain.filter(a => a.color === key)])
                    setshow2(2)
                    return
                } else {
                    setDataOK([...DataMain])
                    setshow2(1)
                }
                if (key === '#d51dcfd1' && show3 === 1) {
                    setDataOK([...DataMain.filter(a => a.color === key)])
                    setshow3(2)
                    return
                } else {
                    setDataOK([...DataMain])
                    setshow3(1)
                    return
                }

            } else {
                if (show1 === 1) {
                    setDataOK([...DataMain.filter(a => a.color === '#d51dcfd1' || a.color === '#fd7e14')])
                    setshow1(2)
                } else {
                    setDataOK([...DataMain])
                    setshow1(1)
                }
            }
        }
        const columns = [

            {
                Header: 'Option',
                accessor: 'Id',
                special: true,
                show: true,
                filterable: false,
                sortable: false,
                textAlign: "center",
                Cell: (row) => (
                    <span>
                        <button type="button"
                            data-tooltip="Detail"
                            className="btn__detail__table btn__detail__table__delete"
                            data-toggle="modal" data-target="#myModal"
                            onClick={a => Deleterow((row.index + 1))}
                        >Delete
                        </button>
                    </span>)
            }
            , {
                Header: I18n.t('Report.STT'),
                special: true,
                filterable: false,
                sortable: false,
                Cell: (row) => <span>{row.index + 1}</span>,
            },
            {
                Header: "Brand",
                accessor: 'ProductGroupName'

            },
            {
                Header: "Product Code",
                accessor: 'ProductCode'
            },
            {
                Header: "Product Name",
                accessor: 'ProductName'

            },
            {
                Header: "Code SeriIme",
                accessor: 'CodeSeriIme'

            },
            {
                Header: "Image",
                accessor: "Image",
                Cell: (row) => (
                    <div>
                        <a
                            className="cursor"
                            data-toggle="modal"
                            data-target="#modalImg"
                            onClick={(e) => setModalImg({ Image: row.original.Image, ProductName: row.original.ProductName })}
                            title="Click to view large image"
                        >
                            {<img src={row.original.Image} height="30" width="50" />}
                        </a>
                    </div>
                )
            },
            {
                Header: "Unit Name",
                accessor: "UnitName"
            },
            {
                Header: "Inventory(Item)",
                accessor: "Inventoryshow",
                width: 180
            },
            {
                Header: "Total Weight(KG)",
                accessor: "TotalWeight",
                width: 180
            },
            {
                Header: "Date of Manufacture",
                accessor: "DateofManufacture",
                Cell: (obj) => FormatDateJson(obj.value)
            },
            {
                Header: "Date Expiry",
                accessor: "DateExpiry",
                Cell: (obj) => FormatDateJson(obj.value)
            }

        ];
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
                            <AudioTrue
                                playaudio={playAudioTrue}
                            />
                            <AudioFalse
                                playaudio={playAudioFalse}
                            />
                            <div className="body-padding">
                                <div className="tab-content" id="custom-tabs-two-tabContent">
                                    <div className="tab-pane fade show active" id="tab_1add" role="tabpanel" aria-labelledby="custom-tabs-two-home-tab">
                                        <div className="card-header" style={{ height: "30px !important;" }}>
                                            <div className='row'>
                                                <div className="col-sm-6">
                                                    <div className="dropdown">
                                                        <h3 className="dropbtn margin-5"><i className="fa-solid fa-plus"></i> {Types === 2 ? 'Stock check actual' : 'Add new Stock Check'}</h3>
                                                    </div>
                                                </div>

                                                <div className="col-sm-6">
                                                    <button type="button" className="btn btn-danger btn-xs float-right margin-left-5 height35"
                                                        onClick={a => ClearFrom(a)}
                                                    >
                                                        <i className="fa fa-trash mr-2 " />
                                                        {I18n.t('System.Cancel')}
                                                    </button><button type="button" className="btn btn-success btn-xs float-right  margin-left-5 height35"
                                                        onClick={e =>
                                                            WH_spWareHouse_Check_Save(e)
                                                        }>
                                                        <i className="fa fa-folder mr-2 " />
                                                        {I18n.t('System.Save')}
                                                    </button>
                                                    {Types === 1 ? <button type="button" className="btn btn-primary btn-xs float-right height35"
                                                        onClick={e =>
                                                            WH_spWereHouse_Export_Inventory_StockCheck(Warehouse, 2)
                                                        }>
                                                        <i className="fa fa-eye mr-2 " />
                                                        {I18n.t('System.View')}
                                                    </button> : ""}

                                                </div>
                                            </div>
                                        </div>
                                        <div className="">
                                            <div class="row right0">
                                                <div className="col-sm-12 col-md-3">
                                                    <div className="card linetop " style={{ height: '72vh' }}>
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label className="form__title" >Planned time<span className="form__title__note">(*)</span></label>
                                                                    <DateTimePicker className="form-control"
                                                                        ref={DateRef}
                                                                        onChange={date => setDates(date)}
                                                                        value={Dates}
                                                                        format='MM/dd/yyyy HH:mm:ss'
                                                                        isDisabled={Types === 1 ? false : true}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label className="form__title" >Code PO</label>
                                                                    <input type="text" className="form-control" ref={POcodeRef} value={POcode} disabled={Types === 1 ? false : true} onChange={a => setPOcode(a.target.value)} />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label className="form__title" >Check staff ID<span className="form__title__note">(*)</span></label>
                                                                    <SelectAccount
                                                                        onSelected={e => Activer(e)}
                                                                        WarehouseId={Warehouse.value}
                                                                        activer={AccountId}
                                                                        isMulti={true}
                                                                        ref={AccountIdRef}
                                                                        isDisabled={Types === 1 ? false : true}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label className="form__title" >Notes </label>
                                                                    <input type="text" className="form-control" value={Description} disabled={Types === 1 ? false : true} onChange={a => setDescription(a.target.value)} />
                                                                </div>
                                                            </div>
                                                            <div class={Types === 2 ? "col-md-12" : "display-none"}>
                                                                <div class="col-md-12">
                                                                    <div class="card mat-stat-card bottom03rem br1" onClick={a => filterColor('all')}>
                                                                        <div class="row align-items-center b-b-default">
                                                                            <div class="col-sm-12 b-r-default b-r-default">
                                                                                <div class="row align-items-center text-center">
                                                                                    <div class="col-2">
                                                                                        <i class="far fa-file-alt text-c-purple bori1"></i>
                                                                                    </div>
                                                                                    <div class="col-10 fontserif">
                                                                                        <span class='t-title'>{DataMain.reduce((a, v) => a = a + v.count, 0)}</span>
                                                                                        <p class="text-muted m-b-0"> Total Adjust</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="col-md-12">
                                                                    <div class="card mat-stat-card bottom03rem br2" onClick={a => filterColor('#fd7e14')}>
                                                                        <div class="row align-items-center b-b-default">
                                                                            <div class="col-sm-12 b-r-default b-r-default">
                                                                                <div class="row align-items-center text-center">
                                                                                    <div class="col-2">
                                                                                        <i class="fa-solid fa-arrow-up text-c-purple bori2"></i>
                                                                                    </div>
                                                                                    <div class="col-10 fontserif">
                                                                                        <span class='t-title'>{DataMain.reduce((a, v) => a = a + v.increase, 0)}</span>
                                                                                        <p class="text-muted m-b-0"> Total Increase</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="col-md-12">
                                                                    <div class="card mat-stat-card bottom03rem br3" onClick={a => filterColor('#d51dcfd1')}>
                                                                        <div class="row align-items-center b-b-default">
                                                                            <div class="col-sm-12 b-r-default b-r-default">
                                                                                <div class="row align-items-center text-center">
                                                                                    <div class="col-2">
                                                                                        <i class="fa-solid fa-arrow-down text-c-purple bori3"></i>
                                                                                    </div>
                                                                                    <div class="col-10 fontserif">
                                                                                        <span class='t-title'>{DataMain.reduce((a, v) => a = a + v.reduce, 0)}</span>
                                                                                        <p class="text-muted m-b-0"> Total Reduce</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-9">
                                                    <div className="card linetop" style={{ height: '72vh' }}>
                                                        <div className="row">
                                                            <div className="col-md-3">
                                                                <div className="form-group">
                                                                    <label className="form__title" > {I18n.t("Leftmenu.Customer")} ID<span className="form__title__note">(*)</span></label>
                                                                    <SelectCustomer
                                                                        onSelected={e => {
                                                                            setCustomerId(e)
                                                                            setWarehouse({ value: -1 })
                                                                            setWarehouseTo({ value: -1 })
                                                                            setRecipientId({ value: -1, label: 'Select please' })
                                                                        }}
                                                                        items={CustomerId.value}
                                                                        ref={CustomerIdRef}
                                                                        isDisabled={disable}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <div className="form-group">
                                                                    <label className="form__title" >Warehouse ID<span className="form__title__note">(*)</span></label>
                                                                    <SelectWarehouseContract
                                                                        onSelected={e => {
                                                                            setWarehouse(e)
                                                                            setDriver({ value: -1 })
                                                                            WH_spCustomerContract_Load(e.value)
                                                                            WH_spWereHouse_Export_Inventory_StockCheck(e, 1)
                                                                            setDataOK([])
                                                                            setInventoryData1([])
                                                                            setInventoryData2([])
                                                                            setCustomerContractData([])
                                                                            setDataCheck([])
                                                                        }}
                                                                        CustomerId={CustomerId.value}
                                                                        items={Warehouse.value}
                                                                        ref={WarehouseRef}
                                                                        isDisabled={disable}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className={Types === 1 ? "col-md-3" : "display-none"}>
                                                                <div className="form-group">
                                                                    <label className="form__title" >Brand ID</label>
                                                                    <SelectProductGroup
                                                                        onSelected={e => {
                                                                            setBrandId(e)
                                                                        }}
                                                                        items={BrandId.value}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className={Types === 1 ? "col-md-3" : "display-none"}>
                                                                <div className="form-group">
                                                                    <label className="form__title" >Search product</label>
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        class="icon icon-tabler icon-tabler-search iconsearch"
                                                                        width="44"
                                                                        height="44"
                                                                        viewBox="0 0 24 24"
                                                                        stroke-width="1.5"
                                                                        stroke="#2c3e50"
                                                                        fill="none"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    >
                                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                        <circle cx="10" cy="10" r="7" />
                                                                        <line x1="21" y1="21" x2="15" y2="15" />
                                                                    </svg>

                                                                    <input type="text" disabled={InventoryData1.length > 0 || InventoryData2.length > 0 ? false : true} className="form-control form-controlsearch" placeholder="Serial/Imei" value={SelectProduct} onChange={e => WH_spProduct_Search(e)} onKeyPress={e => WH_spProduct_Scan(e)} />
                                                                    <div className={IsAcctive === false ? "display-none" : ""}>
                                                                        <div className="col-md-12 col-sm-12 col-xs-12 div-sender">
                                                                            {
                                                                                DataSearch.map((item, index) => {
                                                                                    if (index <= 5)
                                                                                        return (
                                                                                            <div className="select-option-like" key={index} value={SelectProduct} onClick={e => onSelecteProduct(item.ProductId, item.Keys, item.CodeSeriIme)} > <img src={item.Image} width="48" /> {item.ProductName + '-' + item.CodeSeriIme}</div>
                                                                                        )
                                                                                })
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className={Types === 2 ? "col-md-3" : "display-none"}>
                                                                <div className="form-group">
                                                                    <label className="form__title" >Check stock</label>
                                                                    <input type="text" className="form-control"
                                                                        onKeyPress={a => WH_spWareHouse_CheckCode_Strategy(a)} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="table-responsive " style={{ height: '70vh' }}
                                                            onScroll={e => {
                                                                setzIndex(1)
                                                            }}>{
                                                                DataCheck.length > 0 ?
                                                                    <DataTable data={DataCheck} columns={columns} sizePage={15} />
                                                                    : <>
                                                                        <div className={DataMain.length > 0 ? "margin-top-15 col-sm-12 pull-right whiteSpace" : "display-none"}>
                                                                            <div class="col-xs-2 margin-top-15s pull-right">
                                                                                <div class="form-field bmd-form-group">
                                                                                    <input type="text" class="form-control border-radius10" placeholder="Searh Seri/Product" onChange={a => SearchDataTable(a.target.value.trim())} />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <table className="table table-head-fixed text-nowrap table__detail__with___btn table-sticky-thead ">
                                                                            <thead>
                                                                                <tr>
                                                                                    {Types === 1 ? <th>Options</th> : ""}
                                                                                    <th>STT</th>
                                                                                    <th>Brand</th>
                                                                                    <th>Product code</th>
                                                                                    <th>Product name</th>
                                                                                    {Types === 2 ? <th >Quantity Actual(Item)</th> : ""}
                                                                                    <th>Inventory(Item)</th>
                                                                                    <th>Serial/Imei</th>
                                                                                    <th style={{ zIndex: zIndex }}>Unit</th>
                                                                                    <th>Total Weight(KG)</th>
                                                                                    <th>Image</th>
                                                                                    {/* <th>Date of Manufacture</th>
                                                                        <th>Date Expiry</th> */}
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {
                                                                                    DataOK.map((item, k) => {
                                                                                        return (
                                                                                            <tr key={k + 1} className={item.key = (k + 1)} style={{ color: item.color }}>
                                                                                                {Types === 1 ? <td><button type="button" className="btn__detail__table btn__detail__table__delete" onClick={a => Deleterow((k + 1))}>Delete</button></td> : ""}
                                                                                                <td>{k + 1}</td>
                                                                                                <td>{item.ProductGroupName}</td>
                                                                                                <td>{item.ProductCode}</td>
                                                                                                <td>{item.ProductName}</td>
                                                                                                <td className={Types === 1 ? "display-none" : "min-width200"}>
                                                                                                    <div className="form-group">
                                                                                                        <input type="number" key={(k + 1)} min={0} value={item.PackageNumber}
                                                                                                            onChange={e => PackageNumberChange((k + 1), e.target.value)}
                                                                                                            className={`form-control top-2`} style={{ background: item.colorBr, color: item.colortext }}
                                                                                                        />
                                                                                                    </div>
                                                                                                </td>
                                                                                                <td className="min-width200">
                                                                                                    {item.Inventoryshow}
                                                                                                </td>

                                                                                                <td className="min-width200">
                                                                                                    {item.CodeSeriIme}
                                                                                                </td>
                                                                                                <td className="min-width200">
                                                                                                    {item.UnitName}
                                                                                                </td>
                                                                                                <td className="min-width200">
                                                                                                    {item.TotalWeight}
                                                                                                </td>
                                                                                                <td>
                                                                                                    <a
                                                                                                        className="cursor"
                                                                                                        data-toggle="modal"
                                                                                                        data-target="#modalImg"
                                                                                                        onClick={(e) => setModalImg({ Image: item.Image, ProductName: item.ProductName })}
                                                                                                        title="Lager"
                                                                                                    >
                                                                                                        <img src={item.Image} width="48" />
                                                                                                    </a>
                                                                                                </td>

                                                                                                {/* <td>{FormatDateJson(item.DateofManufacture, 1)}</td>
                                                                                    <td>{FormatDateJson(item.DateExpiry, 1)}</td> */}
                                                                                            </tr>
                                                                                        )
                                                                                    })
                                                                                }

                                                                            </tbody>
                                                                        </table>
                                                                    </>
                                                            }
                                                        </div>
                                                    </div>
                                                    {/* <div className="card linetop scrollermyscan" style={{ height: '350px' }}>
                                                        <div class="row" >
                                                            {
                                                                CustomerContractData.length > 0 && CustomerContractData.map((item, index) => {
                                                                    return (
                                                                        <>
                                                                            <div class="col-sm-12 col-md-2">
                                                                                <div className="Layout">
                                                                                    <div className="Layoutscan">
                                                                                        <div className={item.LocationId} style={{ padding: "5px" }}>
                                                                                            {item.LocationName}  <span className="red">({item.Number})</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </>

                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </div> */}
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
);
export const FormStockCheck = React.memo(FormStockCheck_);