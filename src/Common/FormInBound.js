import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import I18n from '../Language'
import { APIKey } from '../Services/Api';
import Select from 'react-select';
import DateTimePicker from 'react-datetime-picker';
import $ from "jquery";
import { AudioTrue, AudioFalse, SelectVehicle, SelectAccount, SelectCustomer, SelectWarehouseContract, SelectCustomerStaff,SelectGroup} from "../Common";
import { mainAction } from '../Redux/Actions'
import { Alertwarning, Alertsuccess, Alerterror, GetDataFromLogin, FormatDateJson, FirstOrLastDayinMonth, FormatNumber, ExportExcel, ConfirmAlert, DateDiff, RegEpxPhone } from "../Utils";
import { formatNumber } from "canvasjs-react-charts/canvasjs.min";

const FormInBoundComp = React.forwardRef(
    (
        {
            Types = 1// 1 is outbound 2 is return outbound
        },
        ref
    ) => {
        //#region Khai báo biến
        const dispatch = useDispatch();
        const [Checkrow, setCheckrow] = useState(9)
        const [CodeOubound, setCodeOubound] = useState("")
        const [Licenseplates, setLicenseplates] = useState("")
        const [CustomerStaff, setCustomerStaff] = useState({ value: -1 })
        const [SelectGroupId, setSelectGroupId] = useState({ value: -1 })
        const [CustomerContractData, setCustomerContractData] = useState([])
        const [zIndex, setzIndex] = useState(0)
        const [disable, setdisable] = useState(false); // disable button 
        const [Warehouse, setWarehouse] = useState({ value: -1 });
        const [Checkall, setCheckall] = useState(false);
        const WarehouseRef = useRef();
        const [WarehouseTo, setWarehouseTo] = useState({ value: -1 });
        const WarehouseToRef = useRef();
        const [Area, setArea] = useState({ value: -1 });
        const [AccountId, setAccountId] = useState([]);
        const AccountIdRef = useRef();
        const [ID, setID] = useState(0);
        const [Status, setStatus] = useState([{ value: -1, label: 'Vui lòng chọn' }, { value: 0, label: 'Mới tạo' }, { value: 1, label: 'Đã xác nhận' }, { value: 2, label: 'Đã tạo thực tế' }]);
        const [StatusId, setStatusId] = useState({ value: -1, label: 'Vui lòng chọn' });
        const [CustomerId, setCustomerId] = useState({ value: -1 });
        const CustomerIdRef = useRef();
        const [Vehicle, setVehicle] = useState({ value: 0 });
        const VehicleRef = useRef();
        const [Provider, setProvider] = useState({ value: 0 });
        const ProviderRef = useRef();
        const [Curator, setCurator] = useState({ value: 0 });
        const CuratorRef = useRef();
        const [POcode, setPOcode] = useState('');
        const POcodeRef = useRef();
        const [Driver, setDriver] = useState("");
        const [Description, setDescription] = useState("");
        const [EnterCode, setEnterCode] = useState();
        const [SelectProduct, setSelectProduct] = useState();
        const [Dates, setDates] = useState(new Date());
        const DateRef = useRef();
        const [Function, setFunction] = useState({ Id: 1, _funcsave: 'WH_spWareHouse_Import_Save_V2', Name: 'chiến lược nhập kho' });
        const [DataSearch, setDataSearch] = useState([]);
        const [DataOK, setDataOK] = useState([]);
        const [DataError, setDataError] = useState([]);
        const [IsAcctive, setIsAcctive] = useState(false);
        const [State, setState] = useState()
        const [IsRun, setIsRun] = useState(0)
        const [ModalImg, setModalImg] = useState({})
        const [dataarray, setdataarray] = useState({ Number: 0 })
        //#endregion Khai báo biến

        useEffect(() => {
            DataOK.forEach(i => {
                WH_spProductPackaging_List(i.ProductId, i.key)// add data packaking in row item
                if (i.ProductPackagingId !== undefined) {
                    WH_spProduct_Check(i.ProductPackagingId, i.ProductId, i.key)
                }
            })
        }, [IsRun]);

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
                const params = {
                    Json: JSON.stringify({
                        ProductCode: e.target.value.trim()
                    }),
                    func: "WH_spProduct_Search"
                }
                try {
                    debugger
                    const result = await mainAction.API_spCallServer(params, dispatch);
                    if (result.length > 0) {
                        setDataSearch(result);
                    } else {
                        setDataSearch([{ ProductName: "Không có dữ liệu" }]);
                    }
                    setIsAcctive(true)

                } catch (e) {
                    Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT Netco!");
                    console.log("WH_spProduct_Search", e)
                }
            }
        }

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
                    dataSelect.push(
                        {
                            value: element.ProductPackagingId,
                            UnitId: element.UnitId,
                            label: element.UnitName,
                            NumberConversion: element.NumberConversion,
                        }
                    );
                });

                DataOK.find(i => i.key === key).DataPackaging = dataSelect;
                setState({ data: DataOK })
            } catch (error) {
                Alerterror("Error, please contact IT NETCO !");
                console.log(error, "WH_spProductPackaging_List")
            }

        }
        const ClearFrom = (a) => {
            setLicenseplates('')
            setCustomerStaff({ value: -1 })
            setCodeOubound("")
            setDataOK([])
            setDataError([])
            setDriver('');
            // setProvider({ value: -1 });
            // setCurator({ value: -1 });
            setPOcode("");
            setWarehouse({ value: -1 });
            setWarehouseTo({ value: -1 });
            setArea({ value: -1 });
            setCustomerId({ value: -1 });
            setVehicle({ value: 0 });
            setDescription("");
            setDates(new Date());
            setDataSearch([]);
            setID(0)
            setAccountId([{}]);
        }
        //scan product
        const WH_spProduct_Scan = async (e) => {
            if (e.charCode === 13) {
                if (e.target.value.trim() !== "") {
                    let _data = e.target.value.trim().split(" ");
                    setSelectProduct("")
                    let ar = [];
                    _data.forEach(i => {
                        if (i !== "") {
                            ar.push({
                                ProductCode: i
                            })
                        }

                    })
                    if (ar.length == 0) {
                        console.log(DataError)
                        Alertwarning("Không có mã hợp lệ!")
                        return
                    }
                    try {
                        const params = {
                            Json: JSON.stringify(ar),
                            func: "WH_spProduct_Scan",
                            API_key: APIKey
                        }
                        const list = await mainAction.API_spCallServer(params, dispatch);
                        if (list.length > 0) {
                            debugger
                            list.map((a, i) => {
                                a.key = new Date().getMilliseconds() + i
                            })
                            setDataOK([...list, ...DataOK])
                            setIsRun(IsRun + 1)
                        } else {
                            Alertwarning("Không có mã hợp lệ!")
                        }
                    } catch (error) {
                        Alerterror("Error, please contact IT NETCO !");
                        console.log(error, "WH_spProduct_Scan")
                    }
                }
            }


        }
        //choise
        const onSelecteProduct = (id) => {
            debugger
            if (id === undefined) { return }
            let ar = DataSearch.find(a => a.ProductId === id);//find ở đây để k trùng (k+1) nữa vì 2 dòng giống nhau 
            ar.key = new Date().getMilliseconds()
            let _arr = [{ ...ar }, ...DataOK]; //use filter to push ar like this
            setDataOK(_arr)
            setSelectProduct("")
            setIsRun(IsRun + 1)
        }
        const activerDate = (id, val, key) => {
            debugger
            let _row = DataOK.find(i => i.key === id)
            if (key === 'DateExpiry') {
                _row.DateExpiry = val
                let _new = FormatDateJson(new Date()), _ex = FormatDateJson(val), numdate = DateDiff(_new, _ex);
                if (numdate <= 0) {
                    _row.Statusdate = `Quá hạn (${numdate})`
                } else if (numdate <= 15) {
                    _row.Statusdate = `Sắp hết hạn (${numdate})`
                }
                else if (numdate >= 15) {
                    _row.Statusdate = `Chưa hết hạn (${numdate})`
                }
            } else {
                _row.DateofManufacture = val
            }
            setState({ data: DataOK })
        }
        const OnclickPackaging = async (e, id) => {
            let _row = DataOK.find(i => i.key === id),
                _DataPackaging = DataOK.filter(i => i.ValuePackaging !== undefined && i.ValuePackaging !== '');
            if ((Warehouse.value === 0 || Warehouse.value === -1) && Function.Id != 1) {
                Alertwarning("Please choise Warehouse ID!")
                _row.ValuePackaging = ''
                return
            }
            if (_row.Lotnumber !== '' & _row.Lotnumber !== undefined) {
                _row.TotalWeight = FormatNumber(1 * e.NumberConversion * _row.WeightExchange)
                if (CustomerContractData.find(a => a.ProductId.includes(_row.ProductId + ";")) !== undefined) {
                    let _a = CustomerContractData.find(a => a.ProductId.includes(_row.ProductId + ";"))
                    _a.Number = 1
                    setState({ dt: CustomerContractData })
                    //LocationName
                    $("." + _a.LocationId).addClass("brlct");
                    setTimeout(() => {
                        $("." + _a.LocationId).removeClass("brlct");
                    }, 500);
                }
            }
            if (_DataPackaging.length > 0) {// check avalable packageing in a product
                if (_DataPackaging.find(i => i.ValuePackaging.value === e.value && i.key !== id) !== undefined) {
                    Alertwarning("This product and unit already exists!")
                    _row.ValuePackaging = '';
                    _row.TotalWeight = '';
                    _row.sttcheck = false;
                    setState({ data: DataOK })
                    return
                }
                else {
                    _row.ValuePackaging = e
                    _row.TotalWeight = '';
                    _row.PackageNumber = '';
                    _row.sttcheck = true;
                    setState({ data: DataOK })
                    return
                }

            }
            else {
                _row.ValuePackaging = e
                _row.PackageNumber = '';
                _row.TotalWeight = '';
            }
        }
        const WH_spProduct_Check = async (PackagingId, ProductId, key) => {
            if (Function.Id == 1) { return }//type import wh return 
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
                if (Function.Id == 2 || Function.Id == 3) {// export wh 1
                    if (isNaN(parseInt(_row.PackageNumber)) !== true) {
                        _PackageNumber = parseInt(_row.PackageNumber)
                    } else { _PackageNumber = 0 }
                }
                if (result.length > 0) {
                    _row.NumberTotal = (result[0].NumberTotal + _PackageNumber)
                    // _row.NumberTotal = (result[0].NumberTotal) // dùng khi thêm mới chiến lược

                    // if (dataarray.keys === 'edit') {
                    //     _row.NumberTotal = (result[0].NumberTotal) //dùng khi sửa chiến lược
                    // }
                    // else {
                    //     _row.NumberTotal = (result[0].NumberTotal + _PackageNumber) //dùng khi thêm  chiến lược
                    // }
                    if (Function.Id == 4) {
                        _row.PackageNumber = result[0].NumberTotal
                    }
                } else {
                    _row.NumberTotal = + _PackageNumber
                    Alertwarning("Không có dữ liệu nhập kho!")
                }
                setState({ data: DataOK })
            } catch (error) {
                Alerterror("Error, please contact IT NETCO !");
                console.log(error, "WH_spProduct_Check")
            }
        }
        const Deleterow = (Id) => {
            setDataOK(DataOK.filter(i => i.key !== Id))


        }
        const handleChangeSerial = (id, value) => {
            debugger
            let _DataOK = DataOK.find(a => a.key === id);
            _DataOK.Lotnumber = value.trim()
            _DataOK.PackageNumber = 1
            if (value.trim() !== '') {
                _DataOK.disablePackageNumber = true
            } else {
                _DataOK.disablePackageNumber = false
            }
            setState({ data: DataOK })
        }
        // tính trọng lượng quy đổi/giá trị sp
        const WeightExchange = (Id, value) => {
            debugger
            let _DataOK = DataOK.find(a => a.key === Id),
                _DataPackaging = _DataOK.DataPackaging,
                _va = parseInt(value.toString().replaceAll(',', ''));
            if (_DataOK.ValuePackaging == undefined || _DataOK.ValuePackaging === '') {
                Alertwarning("Please choise Unit!")
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
            _DataOK.PackageNumber = value
            if (CustomerContractData.find(a => a.ProductId.includes(_DataOK.ProductId + ";")) !== undefined) {
                let _st = CustomerContractData.find(a => a.ProductId.includes(_DataOK.ProductId + ";"))
                _st.Number = (~~value)
                setState({ dt: CustomerContractData })
                //LocationName
                $("." + _st.LocationId).addClass("brlct");
                setTimeout(() => {
                    $("." + _st.LocationId).removeClass("brlct");
                }, 500);
            }
            let _ValuePackaging = _DataPackaging.find(a => a.value === _DataOK.ValuePackaging.value);
            // số lượng nhập * số lượng quy đổi của đơn vị tính * trọng lượng quy đổi
            let _valueWeightExchange = parseInt(value) * _ValuePackaging.NumberConversion * _DataOK.WeightExchange;
            let _PriceExchange = parseInt(value) * _ValuePackaging.NumberConversion * _DataOK.PriceExchange;
            _DataOK.TotalWeight = FormatNumber(_valueWeightExchange / 1000); // tổng là KG
            //_DataOK.TotalWeight = FormatNumber(_valueWeightExchange); // tổng là gam
            _DataOK.TotalPrice = _PriceExchange;
            setState({ data: DataOK })
        }
        // WH_spWareHouse_Import_Save_V3 
        const WH_spWareHouse_Import_Save_V3 = async () => {
            //#region validate
            if (CustomerId.value === -1) {
                Alertwarning("Please choose customer ID!")
                CustomerIdRef.current.focus();
                return
            }
            else if (Warehouse.value === -1) {
                Alertwarning("Please choose warehouse!")
                WarehouseRef.current.focus();
                return
            }
            else if (Dates === null) {
                Alertwarning("Please select an estimated time!")
                WarehouseRef.current.focus();
                return
            }
            if (Function.Id !== 1 && POcode !== '') {
                const params = {
                    Json: JSON.stringify({
                        Code: 0,
                        AccountId: GetDataFromLogin("AccountId"),
                        AccountName: GetDataFromLogin("AccountName"),
                    }),
                    func: "WH_spWareHouse_Export_CheckPOcode",
                };
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result.length > 0) {
                    result.Status === "NO" && Alertwarning(result.ReturnMess)
                    return
                }
            }

            //#region 
            let StaffId1 = 0,
                StaffName1 = '',
                StaffId2 = 0,
                StaffName2 = '',
                StaffId3 = 0,
                StaffName3 = '';
            //#endregion
            if (AccountId.length > 3 || AccountId.length == 0 || AccountId.length == undefined || AccountId[0].value == undefined) {
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
                if (i.sttcheck !== false) {
                    debugger
                    // if (i.Lotnumber === "" || i.Lotnumber == undefined) {
                    //     if (i.Iseri === 1) {
                    //         check = { id: (k + 1), val: "checksei" }
                    //     }
                    // }
                    if (i.DateofManufacture === "" || i.DateofManufacture === undefined) {
                        check = { id: (k + 1), val: "facture" }
                    }
                    if (i.DateExpiry === "" || i.DateExpiry === undefined) {
                        check = { id: (k + 1), val: "expiry" }
                    }
                    if (i.ValuePackaging === 0 || i.ValuePackaging === "" || i.ValuePackaging === undefined) {
                        check = { id: (k + 1), val: "pack" }
                    }
                    if (i.PackageNumber === 0 || i.PackageNumber === '' || i.PackageNumber === undefined) {
                        check = { id: (k + 1), val: "num" }
                    }
                }
            });
            if (check.id !== undefined) {
                if (check.val == 'checksei') {
                    Alertwarning(`Please check Serial/Imei line number ${check.id}!`)
                    return
                }
                else if (check.val == 'facture' && Function.Id !== '3') {
                    Alertwarning(`Please check date of manufacture line number ${check.id}!`)
                    return
                } else if (check.val == 'expiry' && Function.Id !== '3') {
                    Alertwarning(`Please check the expiry date line number ${check.id}!`)
                    return
                } else if (check.val == 'pack') {
                    Alertwarning(`Please check the unit number line ${check.id}!`)
                    return
                } else {
                    Alertwarning(`Please check the number of input line number ${check.id}!`)
                    return
                }
            }
            let ar = [];
            DataOK.forEach((i, k) => {
                if (i.ValuePackaging !== undefined && i.sttcheck !== false) {

                    ar.push({
                        ProductId: i.ProductId,
                        ProductName: i.ProductName,
                        ProductCode: i.ProductCode,
                        ProductPrice: i.ProductPrice ? i.ProductPrice : '',
                        TotalPrice: i.TotalPrice ? i.TotalPrice : '',
                        PriceExchange: i.PriceExchange ? i.PriceExchange : '',
                        WareHouseId: Warehouse.value,
                        DateofManufacture: FormatDateJson(i.DateofManufacture, 1),
                        DateExpiry: FormatDateJson(i.DateExpiry, 1),
                        PackageNumber: i.PackageNumber, // Số lượng nhập
                        UnitId: i.ValuePackaging.UnitId, // Id đơn vị tính
                        UnitName: i.ValuePackaging.label, // Tên đơn vị tính
                        UnitNumberConversion: i.ValuePackaging.NumberConversion, // Số lượng quy đổi ( 10 cái = 1 hộp)
                        UnitIdDefault: i.UnitId, // Id đơn vị tính MẶC ĐỊNH
                        UnitNameDefault: i.UnitName, // Tên đơn vị tính MẶC ĐỊNH
                        UnitNumberConversionDefault: i.QuanlityExchange, // Số lượng quy đổi ( 10 cái = 1 hộp) MẶC ĐỊNH
                        NumberConversion: i.ValuePackaging.NumberConversion,
                        Iseri: i.Iseri,
                        IsPrint: 0,
                        Lotnumber: i.Lotnumber ? i.Lotnumber : '',
                        CustomerId: CustomerId.value,
                        TotalWeight: i.TotalWeight.toString().replaceAll(",", ""),
                        WeightExchange: i.WeightExchange,
                        UnitType: i.ValuePackaging.NumberConversion === 1 ? 0 : 1
                    })

                }

            });
            //#endregion validate
            if (ar.length == 0 && DataOK.length > 0) {
                Alertwarning("Please enter product!")
                return
            }
            if (ar.length == 0) {
                Alertwarning("No valid products yet!")
                return
            }
            try {
                setdisable(true)
                const params = {
                    Json: JSON.stringify({
                        Id: ID,
                        AreaId: Area.value,
                        CustomerId: CustomerId.value,
                        CustomerName: CustomerId.label,
                        WareHouseId: Warehouse.value,
                        WareHouseToId: WarehouseTo.value,
                        CreateTime: FormatDateJson(Dates),
                        VehicleId: Vehicle.value,
                        DriverId: 0,
                        DriverName: Driver,
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
                        Type: Types,//1 inbound 2 return outbound
                        Detail: ar,
                        Licenseplates: Licenseplates,
                        CustomerStaffId: CustomerStaff.value,
                        GroupId:SelectGroupId.value
                    }),
                    func: "WH_spWareHouse_Import_Save_V3",
                    API_key: APIKey
                }

                const list = await mainAction.API_spCallServer(params, dispatch);
                console.log(params, "WH_spWareHouse_Import_Save_V3")
                if (list[0].Status === 'ExistSeri') {
                    list.map(e => {
                        Alertwarning(`Code ${e.ProductCode} have Serial/Imei ${e.CodeSeriIme} already exist!`)
                    })
                }
                if (list[0].Status == 'OK') {
                    Alertsuccess(list[0].ReturnMess)
                    ClearFrom()
                } else {
                    Alertwarning(list[0].ReturnMess)
                }
                setdisable(false)
            } catch (error) {
                Alerterror("Error, please contact IT NETCO !");
                console.log(error, "WH_spWareHouse_Import_Save_V3")
            }

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
                }
                else {
                    //Alertwarning("No data InBound!")
                    setCustomerContractData([])
                }
            } catch (error) {
                Alerterror("Error, please contact IT NETCO !");
                console.log(error, "WH_spCustomerContract_Load")
            }
        }
        const Activer = (e) => {
            if (e === null) {
                setAccountId([{}])
                return
            }
            setAccountId([...e])
        }

        const WH_spWereHouse_ReturnOutBound = async (a) => {
            setDataOK([])
            if (a.key === "Enter") {
                try {
                    const params = {
                        Json: JSON.stringify({
                            Code: a.target.value.trim(),
                            UserId: GetDataFromLogin("AccountId")
                        }),
                        func: "WH_spWereHouse_ReturnOutBound",
                        API_key: APIKey
                    }
                    const result = await mainAction.API_spCallServer(params, dispatch);
                    debugger
                    if (result.Status !== 'No') {
                        setdisable(true)
                        if (result[0].StaffId3 !== 0) {
                            setAccountId([{ value: result[0].StaffId1, label: result[0].StaffName1 }, { value: result[0].StaffId2, label: result[0].StaffName2 }, { value: result[0].StaffId3, label: result[0].StaffName3 }])
                        }
                        else if (result[0].StaffId2 !== 0) {
                            setAccountId([{ value: result[0].StaffId1, label: result[0].StaffName1 }, { value: result[0].StaffId2, label: result[0].StaffName2 }])
                        }
                        else if (result[0].StaffId1 !== 0) {
                            setAccountId([{ value: result[0].StaffId1, label: result[0].StaffName1 }])
                        }
                        setWarehouse({ value: result[0].WareHouseId, label: result[0].WareHouseName })
                        setCustomerId({ value: result[0].CustomerId, label: result[0].CustomerName })
                        setDates(new Date(result[0].StrategyTime))
                        setDescription(result[0].Note)
                        setPOcode(result[0].POcode)
                        setID(result[0].Id)
                        result.forEach((element, k) => {
                            result.find(i => i.PckingId === element.PckingId).ValuePackaging = { value: element.UnitIdActive, UnitId: element.UnitIdActive, NumberConversion: element.NumberConversionActive, label: element.UnitNameActive };
                            element.key = new Date().getMilliseconds() + k
                            element.disablePackageNumber = true
                        });
                        setDataOK(result)
                    } else {
                        Alertwarning(result.ReturnMess)
                        setDataOK([])
                    }
                } catch (error) {
                    Alerterror("Error, please contact IT NETCO !");
                    console.log(error, "WH_spWereHouse_ReturnOutBound")
                }
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
                            <div className="body-padding">
                                <div className="tab-content" id="custom-tabs-two-tabContent">
                                    <div className="tab-pane fade show active" id="tab_1add" role="tabpanel" aria-labelledby="custom-tabs-two-home-tab">
                                        <div className="card-header">
                                            <div className='row'>
                                                <div className="col-sm-6">
                                                    <div className="dropdown">
                                                        <h3 className="dropbtn margin-5"><i className="fa-solid fa-plus"></i>  {Types === 1 ? "Add new inbound" : "Return Outbound"}</h3>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <button type="button" className="btn btn-danger btn-xs margin-left-5 float-right"
                                                        onClick={a => ClearFrom(a)}
                                                    >
                                                        <i className="fa fa-trash mr-2 " />
                                                        {I18n.t('System.Cancel')}
                                                    </button><button type="button" className="btn btn-success btn-xs float-right"
                                                        onClick={e =>
                                                            WH_spWareHouse_Import_Save_V3(e)
                                                        }>
                                                        <i className="fa fa-folder mr-2 " />
                                                        {I18n.t('System.Save')}
                                                    </button>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="">
                                            <div className="row right0">
                                                <div className="col-sm-12 col-md-3">
                                                    <div className="card linetop " style={{ height: '716px' }}>
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label className="form__title" >Planned time <span className="form__title__note">(*)</span></label>
                                                                    <DateTimePicker className="form-control"
                                                                        ref={DateRef}
                                                                        onChange={date => {
                                                                            setDates(date)
                                                                        }}
                                                                        value={Dates}
                                                                        // disabled={disable}
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
                                                                    <label className="form__title" >Putaway staff ID <span className="form__title__note">(*)</span></label>
                                                                    <SelectAccount
                                                                        onSelected={e => Activer(e)}
                                                                        WarehouseId={Warehouse.value}
                                                                        activer={AccountId}
                                                                        isMulti={true}
                                                                        ref={AccountIdRef}
                                                                    // isDisabled={disable}
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
                                                            {/* <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label className="form__title" >Vehicle </label>
                                                                    <SelectVehicle
                                                                        onSelected={e => setVehicle(e)}
                                                                        items={Vehicle.value}
                                                                        ref={VehicleRef}
                                                                    //isDisabled={disable}
                                                                    />
                                                                </div>
                                                            </div> */}
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label className="form__title" >License plates </label>
                                                                    <input type="text" className="form-control" rows="3" value={Licenseplates} onChange={a => setLicenseplates(a.target.value)} />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label className="form__title" >Driver</label>
                                                                    <input type="text" className="form-control" rows="3" value={Driver} onChange={a => setDriver(a.target.value)} />

                                                                    {/* <SelectAccount
                                                                        onSelected={e => setDriver(e)}
                                                                        // WarehouseId={Warehouse.value}
                                                                        items={Driver.value}
                                                                    //isDisabled={disable}
                                                                    /> */}
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label className="form__title" >Notes </label>
                                                                    <textarea type="text" className="form-control" rows="3" value={Description} onChange={a => setDescription(a.target.value)} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-9">
                                                    <div className="card linetop" style={{ height: '350px' }}>
                                                        <div className="row">
                                                            <div className="col-md-3">
                                                                <div className="form-group">
                                                                    <label className="form__title" >Customer ID <span className="form__title__note">(*)</span></label>
                                                                    <SelectCustomer
                                                                        onSelected={e => {
                                                                            setCustomerId(e)
                                                                            setWarehouse({ value: -1 })
                                                                            setWarehouseTo({ value: -1 })
                                                                        }}
                                                                        items={CustomerId.value}
                                                                        ref={CustomerIdRef}
                                                                        isDisabled={disable}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <div className="form-group">
                                                                    <label className="form__title" >Warehouse ID <span className="form__title__note">(*)</span></label>
                                                                    <SelectWarehouseContract
                                                                        onSelected={e => {
                                                                            setWarehouse(e)
                                                                            // setDriver({ value: -1 })
                                                                            WH_spCustomerContract_Load(e.value)
                                                                            setCustomerContractData([])
                                                                        }}
                                                                        CustomerId={CustomerId.value}
                                                                        items={Warehouse.value}
                                                                        ref={WarehouseRef}
                                                                        isDisabled={disable}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className={Types === 1 ? "col-md-6" : "display-none"}>
                                                                <div className="col-md-12 margin-top-20">
                                                                    <div className="form-group">
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
                                                                            style={{ height: '43px' }}
                                                                        >
                                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                            <circle cx="10" cy="10" r="7" />
                                                                            <line x1="21" y1="21" x2="15" y2="15" />
                                                                        </svg>
                                                                        <input type="text" disabled={Warehouse.value > 0 ? false : true} className="form-control form-controlsearch" placeholder="Code/Serial/Imei" value={SelectProduct} onChange={e => WH_spProduct_Search(e)} onKeyPress={e => WH_spProduct_Scan(e)} />
                                                                        <div className={IsAcctive === false ? "display-none" : ""}>
                                                                            <div className="col-md-12 col-sm-12 col-xs-12 div-sender">
                                                                                {
                                                                                    DataSearch.map((item, index) => {
                                                                                        return (
                                                                                            <div className="select-option-like" key={index} value={SelectProduct} onClick={e => onSelecteProduct(item.ProductId)} > <img src={item.Image} width="48" /> {item.ProductName}</div>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className={Types === 2 ? "col-md-3" : "display-none"}>
                                                                <div className="form-group">
                                                                    <label className="form__title" >Order Code </label>
                                                                    <input type="text" className="form-control" value={CodeOubound}
                                                                        onKeyPress={a => WH_spWereHouse_ReturnOutBound(a)}
                                                                        onChange={a => setCodeOubound(a.target.value)} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="table-responsive scrollermyscan" style={{ height: '350px' }}
                                                            onScroll={e => {
                                                                setzIndex(1)
                                                            }}>
                                                            <table className="table margin-bottom-80 table-head-fixed text-nowrap table__detail__with___btn table-sticky-thead ">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Options</th>
                                                                        <th>STT</th>
                                                                        <th>Brand</th>
                                                                        <th>Product code</th>
                                                                        <th>Product name</th>
                                                                        <th>Image</th>
                                                                        <th>Serial/Imei</th>
                                                                        <th style={{ zIndex: zIndex }}>Date of Manufacture</th>
                                                                        <th style={{ zIndex: zIndex }}>Date Expiry</th>
                                                                        <th style={{ zIndex: zIndex }}>Unit</th>
                                                                        <th>Quantity</th>
                                                                        <th>Converted weight (kg)</th>
                                                                        <th>Notes</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        DataOK.map((item, k) => {
                                                                            if (k <= Checkrow) {
                                                                                return (
                                                                                    <tr key={(k + 1)}>
                                                                                        <td>
                                                                                            {
                                                                                                Types === 1 ?
                                                                                                    <button type="button" className="btn__detail__table btn__detail__table__delete" onClick={a => Deleterow(item.key)}>Xoá</button>
                                                                                                    : ""
                                                                                            }
                                                                                        </td>
                                                                                        <td className={item.key}>{k + 1}</td>
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
                                                                                                <img src={item.Image} width="30" />
                                                                                            </a>
                                                                                        </td>
                                                                                        <td className="min-width200">
                                                                                            <div>
                                                                                                <input type="text" min={0} key={item.key} disabled={Types === 2 ? true : false} value={item.Lotnumber} onChange={e => handleChangeSerial(item.key, e.target.value)} className="form-control top-2" />
                                                                                            </div>
                                                                                        </td>
                                                                                        <td >
                                                                                            <DateTimePicker className="form-control top-2"
                                                                                                onChange={date => {
                                                                                                    activerDate(item.key, date, "DateofManufacture")
                                                                                                }}
                                                                                                // disabled={disable}
                                                                                                value={item.DateofManufacture}
                                                                                                format='MM/dd/yyyy'
                                                                                            />
                                                                                        </td>
                                                                                        <td>
                                                                                            <DateTimePicker className="form-control top-2"
                                                                                                onChange={date => {
                                                                                                    activerDate(item.key, date, "DateExpiry")
                                                                                                }}
                                                                                                // disabled={disable}
                                                                                                value={item.DateExpiry}
                                                                                                format='MM/dd/yyyy'
                                                                                            />
                                                                                        </td>
                                                                                        <td className="min-width200">
                                                                                            <Select key={new Date()} className="SelectMeno min10 margin-5"
                                                                                                value={item.ValuePackaging}
                                                                                                onChange={e => OnclickPackaging(e, item.key)}
                                                                                                options={item.DataPackaging}
                                                                                                isDisabled={disable}
                                                                                            />
                                                                                        </td>
                                                                                        <td className="min-width200">
                                                                                            <div className="form-group">
                                                                                                <input type="number" key={item.key} min={0} disabled={item.disablePackageNumber}
                                                                                                    value={item.PackageNumber} onChange={e => WeightExchange(item.key, e.target.value)} className="form-control top-2" />
                                                                                            </div>
                                                                                        </td>
                                                                                        <td className="min-width200">
                                                                                            <div className="form-group">
                                                                                                <input type="text" key={item.key} disabled value={item.TotalWeight} className="form-control top-2 text-center" />
                                                                                            </div>
                                                                                        </td>
                                                                                        <td className="min-width200">
                                                                                            <div className="form-group">
                                                                                                <input type="text" key={item.key} min={0} disabled value={item.Statusdate} className="form-control top-2" />
                                                                                            </div>
                                                                                        </td>

                                                                                    </tr>
                                                                                )
                                                                            }
                                                                        })
                                                                    }

                                                                </tbody>
                                                            </table>
                                                            <div className={DataOK.length > 9 ? "text-center" : "display-none"}><button type="button" className="btn btn-success btn-xs" onClick={a => setCheckrow(Checkrow + 10)}> + Load more</button></div>
                                                        </div>
                                                        {ViewImg}
                                                    </div>
                                                    <div className="card linetop scrollermyscan" style={{ height: '350px' }}>
                                                        <div class="row" >
                                                            {
                                                                CustomerContractData.length > 0 && CustomerContractData.map((item, index) => {
                                                                    return (
                                                                        <>
                                                                            <div class="col-sm-12 col-md-2">
                                                                                <div className="Layout">
                                                                                    <div className="Layoutscan">
                                                                                        <div className={item.ProductId + ' ' + item.LocationId} style={{ padding: "5px" }}>
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
export const FormInBound = React.memo(FormInBoundComp);