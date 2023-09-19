import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import I18n from '../Language'
import { APIKey } from '../Services/Api';
import Select from 'react-select';
import DateTimePicker from 'react-datetime-picker';
import $ from "jquery";
import { AudioTrue, AudioFalse, SelectCustomerRecipient, SelectAccount, SelectCustomer, SelectWarehouseContract, FromExcelOutboundV2, FromExcelOutbound,SelectCustomerStaff,SelectGroup } from "../Common";
import { mainAction } from '../Redux/Actions'
import { Alertwarning, Alertsuccess, Alerterror, GetDataFromLogin, FormatDateJson, FirstOrLastDayinMonth, FormatNumber, Loading, ConfirmAlert, DateDiff, RegEpxPhone } from "../Utils";
import { formatNumber } from "canvasjs-react-charts/canvasjs.min";

const FormOutBoundComp = React.forwardRef(
    (
        {
            Types = 1// 1 is outbound 2 is return outbound
        },
        ref
    ) => {

        // useEffect(async () =>{
        //     const pr1 = {
        //         Json: 'hoangvan@123',
        //         func: "EncryptString",
        //     };
        //     const EncryptPassword = await mainAction.EncryptString(pr1, dispatch);
        //     console.log(EncryptPassword,"đwd")
        // })
        //#region Khai báo biến
        const dispatch = useDispatch();
        const [CustomerStaff, setCustomerStaff] = useState({ value: -1 })
        const [SelectGroupId, setSelectGroupId] = useState({ value: -1 })
        const [Checkrow, setCheckrow] = useState(9)
        const [IsLoad, setIsLoad] = useState(1);
        const [zIndex, setzIndex] = useState(0)
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
        //#endregion Khai báo biến
        useEffect(() => {
            DataOK.forEach(i => {
                WH_spProductPackaging_List(i.ProductId, i.key)// add data packaking in row item
                if (i.ProductPackagingId !== undefined) {
                    WH_spProduct_Check(i.ProductPackagingId, i.ProductId, i.key)
                }
            })
        }, [IsRun]);
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

                    setSelectProduct("")
                    let _data = e.target.value.trim().split(" ");
                    let ar = [], dtcheck = [], rowcheck = 0;
                    _data.forEach((i, k) => {
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
                                    // if (dtcheck !== undefined) {
                                    //     //--defaul values
                                    //     dtcheck.ValuePackaging = {
                                    //         NumberConversion: dtcheck.UnitNumberconversion,
                                    //         label: dtcheck.UnitName,
                                    //         value: dtcheck.UnitId
                                    //     }
                                    //     // dtcheck.PackageNumber = 1
                                    //     // dtcheck.disableValuePackaging = true
                                    //     //--
                                    // }   
                                } else {
                                    setIsRun(IsRun + 1)
                                }
                                if (dtcheck !== undefined) {
                                    dtcheck.key = (new Date().getMilliseconds() + k)
                                    //DataOK.push({ ...dtcheck })
                                    let _a = [{ ...dtcheck }, ...DataOK]
                                    setDataOK(_a)
                                    ar.push(dtcheck)
                                    setIsRun(IsRun + 1)
                                }
                            }

                        }
                    })
                    if (ar.length == 0) {
                        setplayAudioFalse(new Date());
                        Alertwarning("No data avalable!")
                        return
                    } else {
                        setplayAudioTrue(new Date())
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
                    //     Alerterror("Error,please contect IT NETCO !");
                    //     console.log(error, "WH_spProduct_Scan")
                    // }
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
                Alerterror("Error,please contect IT NETCO !");
                console.log(error, "WH_spProductPackaging_List")
            }
        }

        const ClearFrom = (a) => {
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
            debugger
            if (id === undefined) { return }
            if (key === 0) {
                let ar = DataSearch.find(a => a.ProductId === id);
                ar.key = new Date().getMilliseconds()
                let _arr = [{ ...ar }, ...DataOK]; //use filter to push ar like this
                setDataOK(_arr)
                setSelectProduct("")
                setIsRun(IsRun + 1)
                if (ar.WareHouseLocationId !== undefined && CustomerContractData.find(a => a.LocationId === ar.WareHouseLocationId) !== undefined) {
                    CustomerContractData.find(a => a.LocationId === ar.WareHouseLocationId).Check = true
                    setState({ dt: CustomerContractData })
                }
            }
            // else {

            //     if (DataOK.find(a => a.CodeSeriIme === seri) !== undefined) {
            //         Alertwarning("Code seriIme already exist!")
            //         return
            //     }
            //     let ar = DataSearch.find(a => a.CodeSeriIme === seri);

            //     //--defaul values
            //     ar.ValuePackaging = {
            //         NumberConversion: ar.UnitNumberconversion,
            //         label: ar.UnitName,
            //         value: ar.UnitId
            //     }
            //     ar.PackageNumber = 1
            //     ar.disableValuePackaging = true

            //     setDataOK([{...ar},...DataOK])
            //     setSelectProduct("")
            //     // setIsRun(IsRun + 1)
            //     if (ar.WareHouseLocationId !== undefined & CustomerContractData.find(a => a.LocationId === ar.WareHouseLocationId) !== undefined) {
            //         CustomerContractData.find(a => a.LocationId === ar.WareHouseLocationId).Check = true
            //         setState({ dt: CustomerContractData })
            //     }
            // }

        }
        const OnclickPackaging = async (e, id) => {
            let _row = DataOK.find(i => i.key === id),
                _DataPackaging = DataOK.filter(i => i.ValuePackaging !== undefined && i.ValuePackaging !== '');
            if ((Warehouse.value === 0 || Warehouse.value === -1) && Function.Id != 1) {
                Alertwarning("Please choise Warehouse ID!")
                _row.ValuePackaging = ''
                return
            }
            if (_DataPackaging.length > 0) {// && _row.Keys === 0 check avalable packageing in a product and isnot seri
                if (_DataPackaging.find(i => i.ValuePackaging.value === e.value && i.key !== id && _row.Keys === 0) !== undefined) {
                    Alertwarning("This product and unit already exists!")
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
                    _row.PackageNumber = 0;
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
                Alerterror("Error,please contect IT NETCO !");
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
            debugger
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
            debugger
            let va = (_va * _DataOK.ValuePackaging.NumberConversion),// số lượng nhập * số lượng quy đổi của đơn vị tính
                dtcheck = DataOK.filter(a => a.ProductId === _DataOK.ProductId && a.key !== Id && a.numchecks !== undefined && ((_DataOK.Keys === 1 && a.CodeSeriImeS === _DataOK.CodeSeriImeS) || _DataOK.Keys === 0)),// tổng só nhập hiện tại Cua cac dòng khác và tính theo seri hay k seri
                _Inventory = _DataOK.Keys === 1 ? InventoryData2.find(a => a.CodeSeriImeS === _DataOK.CodeSeriImeS).Inventory : InventoryData1.find(a => a.ProductId === _DataOK.ProductId).Inventory,// kiểm tra nếu là xuất theo seri thì lấy tồn theo seri và ngược lại theo sản phẩm
                dtInventory = (_Inventory - (dtcheck.length === 0 ? 0 : dtcheck.reduce((a, v) => a = a + v.numchecks, 0)))// tổng số tồn - số lượng quy đổi đã nhập ở các dòng khác
            if (dtInventory < va) {
                let a = (dtInventory / _DataOK.ValuePackaging.NumberConversion)
                if (a < 0) { a = 0 }
                _DataOK.PackageNumber = (~~a)
                _DataOK.numchecks = dtInventory// cập nhật số đã nhân quy đổi để lần sau sum tổng đúng
                Alertwarning(`Please enter maximun ${~~a} ${_DataOK.ValuePackaging.label}!`)
                setState({ data: DataOK })
                if (_DataOK.WareHouseLocationId !== undefined & CustomerContractData.find(a => a.LocationId === _DataOK.WareHouseLocationId) !== undefined) {
                    CustomerContractData.find(a => a.LocationId === _DataOK.WareHouseLocationId).Number = (~~a)
                    setState({ dt: CustomerContractData })
                    //LocationName
                    $("." + _DataOK.WareHouseLocationId).addClass("brlct");
                    setTimeout(() => {
                        $("." + _DataOK.WareHouseLocationId).removeClass("brlct");
                    }, 500);
                }
                return
            }
            else {

                if (_DataOK.WareHouseLocationId !== undefined & CustomerContractData.find(a => a.LocationId === _DataOK.WareHouseLocationId) !== undefined) {
                    CustomerContractData.find(a => a.LocationId === _DataOK.WareHouseLocationId).Number = _va
                    setState({ dt: CustomerContractData })

                    $("." + _DataOK.WareHouseLocationId).addClass("brlct");
                    setTimeout(() => {
                        $("." + _DataOK.WareHouseLocationId).removeClass("brlct");
                    }, 500);
                }
                _DataOK.PackageNumber = _va
                _DataOK.numchecks = va// cập nhật số đã nhân quy đổi để lần sau sum tổng đúng
            }

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
            DataOK.forEach((i, k) => {
                if (parseInt(i.Inventory) < parseInt(i.PackageNumber)) {
                    i.Inventory = i.NumberTotal
                }
            });
            setState({ data: DataOK })
            ActualSave()
        }
        // ActualSave 
        const ActualSave = async () => {
            //#region validate
            try {
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
                if ((AccountId.length > 3 || AccountId.length == 0 || AccountId.length == undefined || AccountId[0].value == undefined)) {
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
                if (Types === 1) {
                    if (RecipientName === "") {
                        Alertwarning("Please enter the recipient's name!");
                        RecipientNameRef.current.focus();
                        return
                    }
                    if (RecipientPhone === "") {
                        Alertwarning("Please enter the recipient's phone!");
                        RecipientPhoneRef.current.focus();
                        return
                    }
                    if (RecipientPhone !== "" & !RegEpxPhone(RecipientPhone.trim())) {
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
                            TotalWeight: i.TotalWeight.toString().replaceAll(",", ""),
                            WeightExchange: i.WeightExchange,
                            NumberConversion: i.ValuePackaging.NumberConversion,
                            ProductPackagingId: i.ValuePackaging.UnitId,
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
                        Type: Types,//1 outbound 2 return inbound 
                        Detail: ar,
                        RecipientName: RecipientName,
                        RecipientAddress: RecipientAddress,
                        RecipientPhone: RecipientPhone,
                        RecipientCompany: RecipientCompany,
                        RecipientId: RecipientId.value,
                        CustomerStaffId: CustomerStaff.value,
                        GroupId:SelectGroupId.value
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
                    // Alertwarning("No data Inbound!")
                    setCustomerContractData([])
                }
            } catch (error) {
                Alerterror("Error,please contect IT NETCO !");
                console.log(error, "WH_spCustomerContract_Load")
            }
        }
        const WH_spWereHouse_Export_Inventory = async (ID) => {
            debugger
            if (ID === 0 || ID === undefined || ID === -1) { return }
            try {
                setIsLoad(0)
                const params = {
                    Json: JSON.stringify({
                        CustomerId: CustomerId.value,
                        WareHouseId: ID,
                        UserId: GetDataFromLogin("AccountId"),
                        Types: Types
                    }),
                    func: "WH_spWereHouse_Export_Inventory",
                    API_key: APIKey
                }
debugger
                const list = await mainAction.API_spCallServer(params, dispatch);
                if (list.JsonReturn1.length !== undefined || list.JsonReturn2.length !== undefined) {
                    setInventoryData1(list.JsonReturn1)
                    setInventoryData2(list.JsonReturn2)
                    setIsLoad(1)
                } else {
                    setIsLoad(1)
                    Alertwarning("No data inbound !")
                    setInventoryData1([])
                    setInventoryData2([])
                }
            } catch (error) {
                Alerterror("Error,please contect IT NETCO !");
                setIsLoad(1)
                console.log(error, "WH_spWereHouse_Export_Inventory")
            }
        }
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
                            <ul className="nav float-left">
                                <li className="nav-item">
                                    <a
                                        id="tab_1"
                                        className="nav-link active"
                                        href="#tab_1add"
                                        data-toggle="tab"
                                    >
                                        {I18n.t("System.Add")}
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        id="tab_2"
                                        className="nav-link "
                                        href="#tab_2add"
                                        data-toggle="tab"
                                    >
                                        Excel
                                    </a>
                                </li>
                            </ul>
                            <AudioTrue
                                playaudio={playAudioTrue}
                            />
                            <AudioFalse
                                playaudio={playAudioFalse}
                            />
                               {/* {IsLoad === 0 && <Loading />} */}
                            <div className="body-padding" style={{height: "900px"}}>
                                <div className="tab-content" id="custom-tabs-two-tabContent">
                                    <div className="tab-pane fade show active" id="tab_1add" role="tabpanel" aria-labelledby="custom-tabs-two-home-tab">
                                        <div className="card-header" style={{ height: "30px !important;" }}>
                                            <div className='row'>
                                                <div className="col-sm-6">
                                                    <div className="dropdown">
                                                        <h3 className="dropbtn margin-5"><i className="fa-solid fa-plus"></i> ADD NEW {Types === 2 ? 'Return inbound' : 'OUTBOUND'}</h3>
                                                    </div>
                                                </div>

                                                <div className="col-sm-6">
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
                                                <div className="col-sm-12 col-md-3">
                                                    <div className="card linetop " style={{ height: '769px' }}>
                                                        <div className="row">
                                                            {/* <div className={Types === 2 ? "display-none" : "col-md-12"}>
                                                                <div className="form-group">
                                                                    <label className="form__title red" >Odder by Odder</label>
                                                                    <input type="text" className="form-control" value={CodeInBound} onChange={a => setCodeInBound(a.target.value)} />
                                                                </div>
                                                            </div> */}
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label className="form__title" >Planned time<span className="form__title__note">(*)</span></label>
                                                                    <DateTimePicker className="form-control"
                                                                        ref={DateRef}
                                                                        onChange={date => setDates(date)}
                                                                        value={Dates}
                                                                        format='MM/dd/yyyy HH:mm:ss'
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label className="form__title" >Code PO</label>
                                                                    <input type="text" className="form-control" ref={POcodeRef} value={POcode} onChange={a => setPOcode(a.target.value)} />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label className="form__title" >Staff ID<span className="form__title__note">(*)</span></label>
                                                                    <SelectAccount
                                                                        onSelected={e => Activer(e)}
                                                                        activer={AccountId}
                                                                        WarehouseId={Warehouse.value}
                                                                        isMulti={true}
                                                                        ref={AccountIdRef}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label className="form__title" >Person in charge ID</label>
                                                                    <SelectCustomerStaff
                                                                        onSelected={e => setCustomerStaff(e)}
                                                                        items={CustomerStaff.value}
                                                                        CustomerId={CustomerId.value}
                                                                    //isDisabled={disable}
                                                                    />
                                                                </div>
                                                            </div>
                                                            {/* <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label className="form__title" >Group ID</label>
                                                                    <SelectGroup
                                                                        onSelected={e => setSelectGroupId(e)}
                                                                        items={SelectGroupId.value}
                                                                        CustomerId={CustomerId.value}
                                                                    />
                                                                </div>
                                                            </div> */}
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label className="form__title" >Notes </label>
                                                                    <input type="text" className="form-control" value={Description} onChange={a => setDescription(a.target.value)} />
                                                                </div>
                                                            </div>
                                                            <div className={Types === 2 ? "display-none" : "col-md-12"}>
                                                                <div className="margin-left-10">
                                                                    <div className="row">
                                                                        <a
                                                                            className="form-collapse-link"
                                                                        // onClick={(e) => setIsAcctive2(!IsAcctive2)}
                                                                        >
                                                                            {IsAcctive2 ? (
                                                                                <i
                                                                                    className="fa-solid fa-angles-right"
                                                                                    style={{ margin: "0 5px 0 0" }}
                                                                                />
                                                                            ) : (
                                                                                <i
                                                                                    className="fa-solid fa-angles-down"
                                                                                    style={{ margin: "0 5px 0 2px" }}
                                                                                />
                                                                            )}
                                                                            Receiver
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-12">
                                                                    <div className="form-group">
                                                                        <label className="form__title" >Customer Recipient ID</label>
                                                                        <SelectCustomerRecipient
                                                                            onSelected={e => {
                                                                                setRecipientName(e.name)
                                                                                setRecipientAddress(e.label)
                                                                                setRecipientPhone(e.phone)
                                                                                setRecipientCompany(e.company)
                                                                                setRecipientId(e)
                                                                            }}
                                                                            items={RecipientId.value}
                                                                            CustomerId={CustomerId.value}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-12">
                                                                    <div className="form-group">
                                                                        <label className="form__title">
                                                                            Recipient's name<span className="form__title__note">(*)</span>
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            value={RecipientName}
                                                                            ref={RecipientNameRef}
                                                                            onChange={(e) => setRecipientName(e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-12">
                                                                    <div className="form-group">
                                                                        <label className="form__title">
                                                                            Recipient's phone<span className="form__title__note">(*)</span>
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            className="form-control"
                                                                            value={RecipientPhone}
                                                                            ref={RecipientPhoneRef}
                                                                            onChange={(e) =>
                                                                                setRecipientPhone(e.target.value)
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-12">
                                                                    <div className="form-group">
                                                                        <label className="form__title">
                                                                            Receiving address<span className="form__title__note">(*)</span>
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            value={RecipientAddress}
                                                                            ref={RecipientAddressRef}
                                                                            onChange={(e) =>
                                                                                setRecipientAddress(e.target.value)
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-12">
                                                                    <div className="form-group">
                                                                        <label className="form__title">
                                                                            Recipient's company<span className="form__title__note">(*)</span>
                                                                        </label>
                                                                        <input
                                                                            type="email"
                                                                            className="form-control"
                                                                            value={RecipientCompany}
                                                                            ref={RecipientCompanyRef}
                                                                            onChange={(e) => setRecipientCompany(e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-9">
                                                    <div className="card linetop" style={{ height: '403px' }}>
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
                                                                            WH_spWereHouse_Export_Inventory(e.value)
                                                                            setDataOK([])
                                                                            setInventoryData1([])
                                                                            setInventoryData2([])
                                                                            setCustomerContractData([])
                                                                        }}
                                                                        CustomerId={CustomerId.value}
                                                                        items={Warehouse.value}
                                                                        ref={WarehouseRef}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label className="form__title" >Search product<span className="form__title__note">(*)</span></label>
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

                                                                    <input type="text" disabled={InventoryData1.length > 0 || InventoryData2.length > 0 ? false : true} className="form-control form-controlsearch" placeholder="Code/Serial/Imei" value={SelectProduct} onChange={e => WH_spProduct_Search(e)} onKeyPress={e => WH_spProduct_Scan(e)} />
                                                                    <div className={IsAcctive === false ? "display-none" : ""}>
                                                                        <div className="col-md-12 col-sm-12 col-xs-12 div-sender">
                                                                            {
                                                                                DataSearch.map((item, index) => {
                                                                                    if (index <= 5)
                                                                                        return (
                                                                                            <div className="select-option-like" key={index} value={SelectProduct} onClick={e => onSelecteProduct(item.ProductId, 0, item.CodeSeriIme)} > <img src={item.Image} width="48" /> {item.ProductName + '-' + item.CodeSeriIme}</div>
                                                                                        )
                                                                                })
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="table-responsive scrollermyscan" style={{ height: '350px' }}
                                                            onScroll={e => {
                                                                setzIndex(1)
                                                            }}>
                                                            <table className="table table-head-fixed text-nowrap table__detail__with___btn table-sticky-thead ">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Options</th>
                                                                        <th>STT</th>
                                                                        <th>Brand</th>
                                                                        <th>Product code</th>
                                                                        <th>Product name</th>
                                                                        <th>Image</th>
                                                                        <th>Serial/Imei</th>
                                                                        <th style={{ zIndex: zIndex }}>Unit</th>
                                                                        <th>Quantity</th>
                                                                        <th>Inventory</th>
                                                                        <th>Converted weight (kg)</th>
                                                                        <th>Date of Manufacture</th>
                                                                        <th>Date Expiry</th>
                                                                        <th>Inbound Date</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        DataOK.map((item, k) => {
                                                                            if (k <= Checkrow) {
                                                                                return (
                                                                                    <tr key={k + 1} className={item.key} style={{ color: item.color }}>
                                                                                        <td><button type="button" className="btn__detail__table btn__detail__table__delete" onClick={a => Deleterow(item.key)}>Delete</button></td>
                                                                                        <td>{k + 1}</td>
                                                                                        <td>{item.ProductGroupName}</td>
                                                                                        <td>{item.ProductCode}</td>
                                                                                        <td>{item.ProductName}</td>
                                                                                        <td>
                                                                                            <a
                                                                                                className="cursor"
                                                                                                data-toggle="modal"
                                                                                                data-target="#modalImg"
                                                                                                onClick={(e) => setModalImg({ Image: item.Image, ProductName: item.ProductName })}
                                                                                                title="Click để xem hình lớn"
                                                                                            >
                                                                                                <img src={item.Image} width="48" />
                                                                                            </a>
                                                                                        </td>
                                                                                        {Function.Id !== '3' ?
                                                                                            <td className="min-width200">
                                                                                                <div>
                                                                                                    <input type="text" key={item.key} min={0} disabled value={item.CodeSeriIme} onChange={e => (item.CodeSeriIme = e.target.value)} className="form-control top-2" />
                                                                                                </div>
                                                                                            </td>
                                                                                            : ""}

                                                                                        <td className="min-width200">
                                                                                            <Select key={item.key} className={"SelectMeno min10 margin-5"}
                                                                                                value={item.ValuePackaging}
                                                                                                onChange={e => OnclickPackaging(e, item.key)}
                                                                                                options={item.DataPackaging}
                                                                                            // isDisabled={item.disableValuePackaging}
                                                                                            />
                                                                                        </td>

                                                                                        <td className="min-width200">
                                                                                            <div className="form-group">
                                                                                                <input type="number" key={item.key} min={0} value={item.PackageNumber}
                                                                                                    onChange={e => WeightExchange(item.key, e.target.value)}
                                                                                                    className={`form-control top-2`} style={{ background: item.colorBr, color: item.colortext }}
                                                                                                />
                                                                                            </div>
                                                                                        </td>
                                                                                        {Function.Id != '1' ?
                                                                                            <td className="min-width200">
                                                                                                <div className="form-group">
                                                                                                    <input type="number" key={item.key} min={0} disabled value={item.Inventoryshow} className="form-control top-2 text-center" />
                                                                                                </div>
                                                                                            </td> : ""
                                                                                        }
                                                                                        {Function.Id != '4' ?
                                                                                            <td className="min-width200">
                                                                                                <div className="form-group">
                                                                                                    <input type="text" key={item.key} disabled value={item.TotalWeight} className="form-control top-2 text-center" />
                                                                                                </div>
                                                                                            </td> : ""
                                                                                        }
                                                                                        <td>{FormatDateJson(item.DateofManufacture, 1)}</td>
                                                                                        <td>{FormatDateJson(item.DateExpiry, 1)}</td>
                                                                                        <td>{FormatDateJson(item.ImportDate)}</td>
                                                                                    </tr>
                                                                                )
                                                                            }
                                                                        })
                                                                    }
                                                                </tbody>
                                                            </table>
                                                            <div className={DataOK.length > 9 ? "text-center" : "display-none"}><button type="button" className="btn btn-success btn-xs" onClick={a => setCheckrow(Checkrow + 10)}> + Load more</button></div>
                                                        </div>
                                                    </div>
                                                    <div className="card linetop scrollermyscan" style={{ height: '450px' }}>
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
                                                    </div>
                                                </div>
                                                {ViewImg}
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div
                                        className="tab-pane fade"
                                        id="tab_2add"
                                        role="tabpanel"
                                        aria-labelledby="custom-tabs-two-profile-tab"
                                    >
                                        <FromExcelOutboundV2
                                        Types={Types}
                                        />
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div >
                </section >
            </div >
        );

    }
);
export const FormOutBound = React.memo(FormOutBoundComp);