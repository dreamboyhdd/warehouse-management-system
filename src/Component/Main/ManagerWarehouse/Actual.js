import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import I18n from '../../../Language'
import { APIKey } from '../../../Services/Api';
import Select from 'react-select';
import DateTimePicker from 'react-datetime-picker';
import $, { parseJSON } from "jquery";
import { SelectArea, SettingColumn, SelectAccount, SelectCustomer, SelectWarehouseContract, SelectWarehouse, SelectVehicle, DataTable, SelectCurator, SelectProvider } from '../../../Common';
import { mainAction } from '../../../Redux/Actions'
import { Alertwarning, Alertsuccess, Alerterror, GetDataFromLogin, FormatDateJson, FirstOrLastDayinMonth, FormatNumber, ExportExcel, ConfirmAlert, DateDiff } from "../../../Utils";
import { formatNumber } from "canvasjs-react-charts/canvasjs.min";

export const Actual = () => {

    //#region Khai báo biến
    const dispatch = useDispatch();
    const [Checkall, setCheckall] = useState(false);
    const [disable, setdisable] = useState(true); // disable button 
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
    const [Function, setFunction] = useState({ Id: 1, _funcsave: 'WH_spWareHouse_Import_Save_V2', Name: 'vận hành nhập kho thực tế' });
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
            const params = {
                Json: JSON.stringify({
                    ProductCode: e.target.value.trim()
                }),
                func: "WH_spProduct_Search"
            }
            try {
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
    // WH_spProductPackaging_List 
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
                        NumberConversion: element.NumberConversion,
                        label: element.UnitName,
                        UnitConversionName: element.UnitConversionName,
                        UnitConversionId: element.UnitConversionId,
                    }
                );
            });

            DataOK.find(i => i.key === key).DataPackaging = dataSelect;
            setState({ data: DataOK })
        } catch (error) {
            Alerterror("Lỗi dữ liệu,vui lòng liên hệ IT NETCO !");
            console.log(error, "WH_spProductPackaging_List")
        }
    }

    const ClearFrom = (a) => {
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
    }

    const WH_spProduct_Scan = async (e) => {
        debugger
        if (e.charCode === 13) {
            if (e.target.value.trim() !== "") {
                setEnterCode("")
                let _data = e.target.value.trim().split(" ");

                let ar = [];
                let er = [...DataError];
                _data.forEach(i => {
                    if (i !== "") {
                        // if (DataOK.find(e => e.ProductCode.toUpperCase() === i.toUpperCase()) == undefined) {
                        //     ar.push({
                        //         ProductCode: i
                        //     })
                        // } else {
                        //     er.push({
                        //         ProductCode: i
                        //     })
                        // }
                        ar.push({
                            ProductCode: i
                        })
                    }
                })

                if (er.length > 0) {
                    setDataError(er)
                }
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
                        let _arr = [...DataOK, ...list]
                        setDataOK(_arr)
                        setIsRun(IsRun + 1)
                        //check error code
                        let _DataError = [...DataError]
                        ar.forEach(element => {
                            if (list.find(a => a.ProductCode.toUpperCase() === element.ProductCode.toUpperCase()) === undefined) {
                                _DataError.push({
                                    ProductCode: element.ProductCode
                                })
                            }
                        });
                        setDataError(_DataError)
                    } else {
                        setDataError([...DataError, ...ar])
                    }

                } catch (error) {
                    Alerterror("Lỗi dữ liệu,vui lòng liên hệ IT NETCO !");
                    console.log(error, "WH_spProduct_Scan")
                }
            }
        }

    }
    //choise
    const onSelecteProduct = (id) => {
        setSelectProduct("")
        if (id === undefined) { return }
        let ar = DataSearch.filter(a => a.ProductId === id);
        let _arr = [...DataOK, ...ar]; //use filter to push ar like this
        setDataOK(_arr)
        setSelectProduct("")
        setIsRun(IsRun + 1)
    }
    const activerDate = (id, val, key) => {
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
            Alertwarning("Vui lòng chọn kho!")
            _row.ValuePackaging = ''
            return
        }
        if (_DataPackaging.length > 0) {// check avalable packageing in a product
            if (_DataPackaging.find(i => i.ValuePackaging.value === e.value && i.key !== id) !== undefined) {
                Alertwarning("Đã tồn tại SP và đơn vị tính này!")
                _row.ValuePackaging = '';
                _row.TotalWeight = '';
                _row.TotalWeight = '';
                _row.sttcheck = false;
                setState({ data: DataOK })
                return
            } else {
                _row.ValuePackaging = e
                WH_spProduct_Check(e.value, _row.ProductId, _row.key)
                _row.sttcheck = true;
                setState({ data: DataOK })
                return
            }
        }
        else {
            _row.ValuePackaging = e
            WH_spProduct_Check(e.value, _row.ProductId, _row.key)
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
    // tính trọng lượng quy đổi/giá trị sp
    const WeightExchange = (Id, value) => {
        let va = value.toString().replaceAll(',', '')
        let _DataOK = DataOK.find(a => a.key === Id),
            _DataPackaging = _DataOK.DataPackaging;
        if (_DataOK.ValuePackaging == undefined || _DataOK.ValuePackaging === '') {
            Alertwarning("Vui lòng chọn đơn vị tính!")
            _DataOK.PackageNumber = ""
            setState({ data: DataOK })
            return
        }

        if (Function.Id !== '1' & _DataOK.NumberTotal < va) {
            _DataOK.PackageNumber = _DataOK.NumberTotal
            Alertwarning(`Vui lòng nhập tối đa ${_DataOK.NumberTotal}!`)
            setState({ data: DataOK })
            return
        }
        else {
            _DataOK.PackageNumber = va
        }

        //
        if (_DataOK.Checks > va) {
            _DataOK.colorBr = 'red'
            _DataOK.colortext = '#ffffff'
        }
        else if (_DataOK.Checks < va) {
            _DataOK.colorBr = '#43dbae'
            _DataOK.colortext = '#ffffff'
        }
        else {
            _DataOK.colorBr = ''
            _DataOK.colortext = ''
        }

        // let _ValuePackaging = _DataPackaging.find(a => a.value === _DataOK.ValuePackaging.value);
        let _ValuePackaging = _DataPackaging.find(a => a.value === _DataOK.DataPackaging[0].value);
        // số lượng nhập * số lượng quy đổi của đơn vị tính * trọng lượng quy đổi
        let _valueWeightExchange = parseInt(va) * _ValuePackaging.NumberConversion * _DataOK.WeightExchange;
        let _PriceExchange = parseInt(va) * _ValuePackaging.NumberConversion * _DataOK.PriceExchange;
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
        debugger
        console.log( Driver.label)
        return
        //#region validate
        if (StrategyCode === '') {
            Alertwarning("Vui lòng nhập mã chiến lược!")
            return
        }
        if (CustomerId.value === -1) {
            Alertwarning("Vui lòng chọn khách hàng!")
            CustomerIdRef.current.focus();
            return
        }
        else if (Warehouse.value === -1 && Function.Id !== 3) {
            Alertwarning("Vui lòng chọn kho!")
            WarehouseRef.current.focus();
            return
        }
        else if (Warehouse.value === -1 && Function.Id == 3) {
            Alertwarning("Vui lòng chọn kho xuất!")
            WarehouseRef.current.focus();
            return
        }
        else if (Dates === null) {
            Alertwarning("Vui lòng chọn thời gian dự kiến!")
            WarehouseRef.current.focus();
            return
        }
        else if (WarehouseTo.value === -1 && Function.Id == 3) {
            Alertwarning("Vui lòng chọn kho nhập!")
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
            Alertwarning("Vui lòng chọn tối đa 3 nhân viên!")
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
                // if (i.Lotnumber === "" || i.Lotnumber == undefined) {
                //     check = { id: (k + 1), val: "lot" }
                // }
                // else 
                if (i.Lotnumber === "" || i.Lotnumber == undefined) {
                    if (i.Iseri === 1) {
                        check = { id: (k + 1), val: "checksei" }
                    }
                }
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
            // if (check.val == 'lot' && Function.Id !== '3') {
            //     Alertwarning(`Vui lòng kiểm tra Số serial/Imei dòng số ${check.id}!`)
            //     return
            // } else 
            if (check.val == 'facture' && Function.Id !== '3') {
                Alertwarning(`Vui lòng kiểm tra ngày SX dòng số ${check.id}!`)
                return
            } else if (check.val == 'expiry' && Function.Id !== '3') {
                Alertwarning(`Vui lòng kiểm tra hạn SD dòng số ${check.id}!`)
                return
            } else if (check.val == 'pack') {
                Alertwarning(`Vui lòng kiểm tra đơn vị tính dòng số ${check.id}!`)
                return
            } else if (check.val == 'checksei') {
                Alertwarning(`Vui lòng kiểm tra Serial/Imei dòng số ${check.id}!`)
                return
            } else {
                Alertwarning(`Vui lòng kiểm tra SL dự kiến dòng số ${check.id}!`)
                return
            }
        }

        let ar = [];
        DataOK.forEach((i, k) => {
            if (i.ValuePackaging !== undefined & i.color !== 'red') {
                ar.push({
                    ProductId: i.ProductId,
                    ProductName: i.ProductName,
                    ProductCode: i.ProductCode,
                    ProductPrice: i.ProductPrice,
                    TotalPrice: i.TotalPrice,
                    PriceExchange: i.PriceExchange,
                    PackageNumber: i.PackageNumber,
                    TotalWeight: i.TotalWeight.toString().replaceAll(",", ""),
                    WeightExchange: i.WeightExchange,
                    ProductPackagingId: i.ValuePackaging.value,
                    ProductPackagingName: i.ValuePackaging.label,
                    NumberConversion: i.ValuePackaging.NumberConversion,
                    UnitConversionId: i.ValuePackaging.UnitConversionId,
                    UnitConversionName: i.ValuePackaging.UnitConversionName,
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
                    Lotnumber: i.Lotnumber,
                    DateofManufacture: FormatDateJson(i.DateofManufacture, 1),
                    DateExpiry: FormatDateJson(i.DateExpiry, 1),
                    Iseri: i.Iseri,
                    IsPrint: 0,
                })
            }

        });
        //#endregion validate

        if (ar.length == 0 && DataOK.length > 0) {
            Alertwarning("Vui lòng nhập số lượng sản phẩm!")
            return
        }
        if (ar.length == 0) {
            Alertwarning("Chưa có sản phẩm hợp lệ!")
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
                    Detail: ar
                }),
                func: Function._funcsave,
                API_key: APIKey
            }

            const list = await mainAction.API_spCallServer(params, dispatch);
            if (list.Status == 'OK') {
                Alertsuccess(list.ReturnMess)
                ClearFrom()
                setAccountId([{}]);
            } else {
                Alertwarning(list.ReturnMess)
            }
        } catch (error) {
            Alerterror("Lỗi dữ liệu,vui lòng liên hệ IT NETCO !");
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
                        data-tooltip="Chi tiết"
                        className="btn btn-sm btn-info mr-2 show__tip__left"
                        data-toggle="modal" data-target="#myModal"
                        onClick={e => setdataarray({ Number: dataarray.Number + 1, _row: row, keys: 'view' })}
                    >
                        <i className="fa-solid fa-eye"></i>
                    </button>
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
                    {
                        row.original.Status === 'Mới tạo' ?
                            <button key={row.index + 4}
                                data-tooltip="Tạo lệnh"
                                className="btn btn-sm btn-info show__tip__right"
                                onClick={(a) => setdataarray({ Number: dataarray.Number + 1, _row: row, keys: 'arrange' })}
                            >
                                <i className="fa fa-check"></i>
                            </button> : ""
                    }
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
            Header: "SL dự kiến",
            accessor: "PackageNumber",
        }, {
            Header: "NV hoàn thành",
            accessor: "TotalStaffFinished",
        }, {
            Header: "Số serial/Imei",
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
            Header: "Ghi chú",
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
            <a id={1} _funcsave={'WH_spWareHouse_Import_Save_V2'}>vận hành nhập kho thực tế</a>
            <a id={2} _funcsave={'WH_spWareHouse_Export_Save'}>vận hành xuất kho thực tế</a>
            <a id={3} _funcsave={'WH_spWareHouse_Transport_Save'}>vận hành chuyển kho thực tế</a>
            <a id={4} _funcsave={'WH_spWareHouse_Check_Save'} >vận hành kiểm kho thực tế</a>
        </div>
    )
    //#region modal detail product group
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
        <div className="content-wrapper pt-2">
            <section className="content">
                <div className="container-fluid">
                    <div className="card card-primary">
                        <ul className="nav float-left">
                            <li className="nav-item"><a id="tab_1" className="nav-link active" href="#tab_1add" data-toggle="tab">{I18n.t('System.Add')}</a></li>
                            <li className="nav-item"><a className="nav-link " href="#tab_2" data-toggle="tab">{I18n.t('System.List')}</a></li>
                        </ul>
                        <div className="body-padding">
                            <div className="tab-content" id="custom-tabs-two-tabContent">
                                <div className="tab-pane fade show active" id="tab_1add" role="tabpanel" aria-labelledby="custom-tabs-two-home-tab">
                                    <div className="card-header">
                                        <div className='row'>
                                            <div className="col-sm-6">
                                                <div className="dropdown">
                                                    <h3 className="dropbtn"><i className="fa-solid fa-plus"></i> {ID !== 0 ? 'Sửa ' : 'Thêm mới'} {Function.Name} <i className="fa-solid fa-caret-down"></i></h3>
                                                    <div className="dropdown-content">
                                                        {dropdown}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-sm-6 card-header-btn">
                                                <button type="button" className="btn btn-danger btn-sm float-right btn-header"
                                                    onClick={a => ClearFrom(a)}
                                                >
                                                    <i className="fa fa-trash mr-2 " />
                                                    {I18n.t('System.Cancel')}
                                                </button><button type="button" className="btn btn-success btn-sm float-right btn-header"
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
                                    <div className="card-body-form">
                                        <div className="row col-md-12">
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="form__title" >Mã chiến lược </label>
                                                    <input type="text" disabled={!disable} className="form-control" value={StrategyCode}
                                                        onKeyPress={a => WH_spWareHouse_CheckCode_Strategy(a)}
                                                        onChange={a => setStrategyCode(a.target.value.trim())}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="form__title" >Khách hàng <span className="form__title__note">(*)</span></label>
                                                    <SelectCustomer
                                                        onSelected={e => {
                                                            setCustomerId(e)
                                                            setWarehouse({ value: -1 })
                                                            setWarehouseTo({ value: -1 })
                                                        }}
                                                        items={CustomerId.value}
                                                        ref={CustomerIdRef}
                                                        isDisabled={true}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="form__title" >Kho {Function.Id == 3 ? 'xuất' : ''} <span className="form__title__note">(*)</span></label>
                                                    <SelectWarehouseContract
                                                        onSelected={e => {
                                                            setWarehouse(e)
                                                            setDriver({ value: -1 })
                                                            setAccountId([{}])
                                                        }}
                                                        CustomerId={CustomerId.value}
                                                        items={Warehouse.value}
                                                        ref={WarehouseRef}
                                                        isDisabled={true}
                                                    />
                                                </div>
                                            </div>
                                            <div className={Function.Id == 3 ? "col-md-3" : "display-none"}>
                                                <div className="form-group">
                                                    <label className="form__title" >Kho nhập <span className="form__title__note">(*)</span></label>
                                                    <SelectWarehouseContract
                                                        onSelected={e => setWarehouseTo(e)}
                                                        CustomerId={CustomerId.value}
                                                        items={WarehouseTo.value}
                                                        ref={WarehouseToRef}
                                                        isDisabled={true}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 margin-top-3">
                                                <div className="form-group">
                                                    <label className="form__title" >Thời gian dự kiến <span className="form__title__note">(*)</span></label>
                                                    <DateTimePicker className="form-control"
                                                        ref={DateRef}
                                                        onChange={date => setDates(date)}
                                                        value={Dates}
                                                        format='MM/dd/yyyy HH:mm:ss'
                                                        disabled={true}
                                                    />
                                                </div>
                                            </div>
                                            {/* <div className={Function.Id != '4' ? "col-md-3" : "display-none"}>
                                                <div className="form-group">
                                                    <label className="form__title" >Tên xe </label>
                                                    <SelectVehicle
                                                        onSelected={e => setVehicle(e)}
                                                        items={Vehicle.value}
                                                        ref={VehicleRef}
                                                        isDisabled={true}
                                                    />
                                                </div>
                                            </div>
                                            <div className={Function.Id != '4' ? "col-md-3" : "display-none"}>
                                                <div className="form-group">
                                                    <label className="form__title" >Tài xế</label>
                                                    <SelectAccount
                                                        onSelected={e => setDriver(e)}
                                                        WarehouseId={Warehouse.value}
                                                        items={Driver.value}
                                                        isDisabled={true}
                                                    />
                                                </div>
                                            </div> */}
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="form__title" >Mã PO</label>
                                                    <input type="text" className="form-control" ref={POcodeRef} disabled={true} value={POcode} onChange={a => setPOcode(a.target.value)} />
                                                </div>
                                            </div>
                                            {/* <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="form__title" >Nhà cung cấp <span className="form__title__note">(*)</span></label>
                                                    <SelectProvider
                                                        onSelected={e => setProvider(e)}
                                                        items={Provider.value}
                                                        ref={ProviderRef}
                                                        isDisabled={true}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="form__title" >Người phụ trách <span className="form__title__note">(*)</span></label>
                                                    <SelectCurator
                                                        onSelected={e => setCurator(e)}
                                                        items={Curator.value}
                                                        ref={CuratorRef}
                                                        isDisabled={true}
                                                    />
                                                </div>
                                            </div> */}

                                            {/* <div className={Function.Id == 3 ? "col-md-6" : "col-md-3"}> */}
                                            {/* <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="form__title" >Nhân viên thực hiện <span className="form__title__note">(*)</span></label>
                                                    <SelectAccount
                                                        onSelected={e => Activer(e)}
                                                        activer={AccountId}
                                                        WarehouseId={Warehouse.value}
                                                        isMulti={true}
                                                        ref={AccountIdRef}
                                                        isDisabled={disable}
                                                    />
                                                </div>
                                            </div> */}
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="form__title" >Nhân viên thực hiện <span className="form__title__note">(*)</span></label>
                                                    <SelectAccount
                                                        onSelected={e => Activer(e)}
                                                        // onAccountId={AccountId.value}
                                                        AccountId={AccountId.value}
                                                        activer={AccountId}
                                                        isMulti={true}
                                                        ref={AccountIdRef}
                                                        isDisabled={disable}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="form__title" >Ghi chú </label>
                                                    <input type="text" className="form-control" disabled={disable} value={Description} onChange={a => setDescription(a.target.value)} />
                                                </div>
                                            </div>

                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label className="form__title" >Scan mã SP <span className="form__title__note">(*)</span></label>
                                                    <input type="text" disabled={disable} placeholder="Nhập 1 hoặc nhiều mã,mỗi mã cách nhau bằng khoảng trắng" className="form-control border-radius10"
                                                        value={EnterCode}

                                                        onChange={(e) => setEnterCode(e.target.value)}
                                                        onKeyPress={(e) => {
                                                            WH_spProduct_Scan(e);
                                                        }}
                                                        isDisabled={disable}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row col-md-12 linetop">
                                                <div className="col-md-4">
                                                    <span className="spaninfored btn-danger"> <i class="fa-solid fa-circle-xmark"></i> Sản phẩm lỗi ({DataError.length}) </span>
                                                </div>
                                                <div className="col-md-12 ">
                                                    <div className="row padding-top10">
                                                        {
                                                            DataError.map((a, k) => {
                                                                return (
                                                                    <span className="span-error" key={a.key = k + 1} >{a.ProductCode} <i class="red fa-solid fa-circle-xmark" onClick={a => setDataError(DataError.filter(a => a.key !== (k + 1)))}></i></span>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row col-md-12 linetop">
                                                <div className="col-md-6">
                                                    <div className="col-md-12">
                                                        <span className="spaninfogreen btn-success"> <i class="fa-solid fa-circle-check"></i> Sản phẩm hợp lệ ({DataOK.length}) </span>
                                                    </div>
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
                                                            >
                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                <circle cx="10" cy="10" r="7" />
                                                                <line x1="21" y1="21" x2="15" y2="15" />
                                                            </svg>
                                                            <input type="text" disabled={disable} className="form-control form-controlsearch" placeholder="Tìm kiếm mã hoặc tên SP. Nhập ít nhất 4 kí tự" value={SelectProduct} onChange={e => WH_spProduct_Search(e)} />
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
                                                <div className="col-md-6">
                                                    <div className="row col-md-12">
                                                        <div className="col-md-12">
                                                            <span className="col-md-6 float-right margin-left-25"> <i className="fa-solid fa-circle icon-16ACBB"></i> Chênh lệch (ít hơn) SL dự kiến</span>
                                                            <span className="col-md-6 total float-right margin-bottom-40"> Tổng dự kiến : <span className="spancolor">{FormatNumber(DataOK.reduce((a, v) => a = a + (v.Checks !== undefined), 0))}</span> </span>
                                                            <span className="col-md-6 float-right margin-left-25"> <i className="fa-solid fa-circle icon-E16767"></i> Chênh lệch (cao hơn) SL dự kiến</span>
                                                            <span className="col-md-6 total float-right"> Tổng thực tế : <span className="spancolor">{FormatNumber(DataOK.reduce((a, v) => a = a + parseInt(v.PackageNumber), 0))}</span> </span>
                                                        </div>
                                                        {/* <div className="col-md-12 margin-top-20">
                                                             </div> */}
                                                    </div>
                                                </div>
                                                <div className="table-responsive p-0 mt-2 top-xs-20s" >
                                                    <table className="table table-head-fixed text-nowrap table__detail__with___btn margin-bottom-80 ">
                                                        <thead>
                                                            <tr>
                                                                <th>Tuỳ chọn</th>
                                                                <th>STT</th>
                                                                <th>Nhóm SP</th>
                                                                <th>Mã SP</th>
                                                                <th>Tên SP</th>
                                                                <th>Hình ảnh</th>
                                                                {Function.Id !== '3' ? <th>Số serial/Imei</th> : ""}
                                                                {Function.Id !== '3' ? <th>Ngày SX</th> : ""}
                                                                {Function.Id !== '3' ? <th>Hạn SD</th> : ""}
                                                                <th>Đơn vị tính</th>
                                                                {Function.Id != '4' ? <th>SL dự kiến</th> : ''}
                                                                <th>SL kiểm thực tế</th>
                                                                {Function.Id != '1' ? <th>SL tồn</th> : ''}
                                                                {Function.Id != '4' ? <th>TL quy đổi (kg)</th> : ''}
                                                                {Function.Id !== '3' ? <th>Ghi chú</th> : ""}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                DataOK.map((item, k) => {
                                                                    return (
                                                                        <tr key={k + 1} style={{ color: item.color }}>
                                                                            <td><button type="button" className="btn__detail__table btn__detail__table__delete" onClick={a => Deleterow((k + 1))}>Xoá</button></td>
                                                                            <td className={item.key = (k + 1)}>{k + 1}</td>
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
                                                                                        <input type="text" key={item.ProductId} min={0} value={item.Lotnumber} onChange={e => (item.Lotnumber = e.target.value)} className="form-control top-2" />
                                                                                    </div>
                                                                                </td>
                                                                                : ""}
                                                                            {Function.Id !== '3' ?
                                                                                <td >
                                                                                    <DateTimePicker className="form-control top-2"
                                                                                        onChange={date => {
                                                                                            activerDate((k + 1), date, "DateofManufacture")
                                                                                        }}
                                                                                        value={item.DateofManufacture}
                                                                                        format='MM/dd/yyyy'
                                                                                    />
                                                                                </td>
                                                                                : ""}
                                                                            {Function.Id !== '3' ?
                                                                                <td>
                                                                                    <DateTimePicker className="form-control top-2"
                                                                                        onChange={date => {
                                                                                            activerDate((k + 1), date, "DateExpiry")
                                                                                        }}
                                                                                        value={item.DateExpiry}
                                                                                        format='MM/dd/yyyy'
                                                                                    />
                                                                                </td>
                                                                                : ""}
                                                                            <td className="min-width200">
                                                                                <Select key={(k + 1)} className="SelectMeno min10 margin-5"
                                                                                    value={item.ValuePackaging}
                                                                                    onChange={e => OnclickPackaging(e, (k + 1))}
                                                                                    options={item.DataPackaging}
                                                                                />
                                                                            </td>
                                                                            {Function.Id != '4' ?
                                                                                <td className="min-width200">
                                                                                    <div className="form-group">
                                                                                        <input type="text" key={(k + 1)}
                                                                                            value={formatNumber(item.Checks)} disabled className="form-control top-2 Checks" />
                                                                                    </div>
                                                                                </td> : ""
                                                                            }
                                                                            <td className="min-width200">
                                                                                <div className="form-group">
                                                                                    <input type="text" key={(k + 1)} min={0} value={formatNumber(item.PackageNumber)}
                                                                                        onChange={e => WeightExchange((k + 1), e.target.value)}
                                                                                        className={`form-control top-2`} style={{ background: item.colorBr, color: item.colortext }} />
                                                                                </div>
                                                                            </td>
                                                                            {Function.Id != '1' ?
                                                                                <td className="min-width200">
                                                                                    <div className="form-group">
                                                                                        <input type="number" key={(k + 1)} min={0} disabled value={item.NumberTotal} className="form-control top-2 text-center" />
                                                                                    </div>
                                                                                </td> : ""
                                                                            }
                                                                            {Function.Id != '4' ?
                                                                                <td className="min-width200">
                                                                                    <div className="form-group">
                                                                                        <input type="text" key={(k + 1)} disabled value={item.TotalWeight} className="form-control top-2 text-center" />
                                                                                    </div>
                                                                                </td> : ""
                                                                            }
                                                                            {Function.Id !== '3' ?
                                                                                <td className="min-width200">
                                                                                    <div className="form-group">
                                                                                        <input type="text" key={item.ProductId} min={0} readOnly value={item.Statusdate} className="form-control top-2" />
                                                                                    </div>
                                                                                </td> : ""
                                                                            }

                                                                        </tr>
                                                                    )
                                                                })
                                                            }

                                                        </tbody>
                                                    </table>
                                                </div>
                                                {ViewImg}

                                            </div>
                                        </div>


                                    </div>
                                </div>
                                <div className="tab-pane fade" id="tab_2" role="tabpanel" aria-labelledby="custom-tabs-two-profile-tab">
                                    <div className="card-header">
                                        <div className="row" >
                                            <div className="col-sm-12 col-md-6">
                                                <div className="dropdown">
                                                    <h3 className="dropbtn"><i class="fa-solid fa-bars"></i> danh sách {Function.Name} ({DataList.length})<i className="fa-solid fa-caret-down"></i></h3>
                                                    <div className="dropdown-content">
                                                        {dropdown}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 card-header-btn">
                                                <button className="btn btn-warning btn-sm float-right btn-header"
                                                    onClick={e => Exportexcel(e)}
                                                >
                                                    <i className="fa fa-download mr-2" />
                                                    {I18n.t("System.Excel")}
                                                </button>
                                                <button type="button" className="btn btn-danger btn-sm float-right btn-header"
                                                    onClick={a => WH_spWareHouse_StrategyActual_Delete(-1)}
                                                >
                                                    <i className="fa fa-trash mr-2 " />
                                                    {I18n.t('System.Delete')}
                                                </button><button type="button" className="btn btn-primary btn-sm float-right btn-header"
                                                    onClick={e =>
                                                        WH_spWareHouse_StrategyActual_List(e)
                                                    }>
                                                    <i className="fa-solid fa-eye" /> Xem
                                                </button>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body-form">
                                        <div className="row col-md-12">
                                            <div className="col-md-3 margin-top-3">
                                                <div className="form-group">
                                                    <label className="form__title" >Từ ngày <span className="form__title__note">(*)</span></label>
                                                    <DateTimePicker className="form-control"
                                                        // ref={FromdateRef}
                                                        onChange={date => setFromdate(date)}
                                                        value={Fromdate}
                                                        format='MM/dd/yyyy HH:mm:ss'
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 margin-top-3">
                                                <div className="form-group">
                                                    <label className="form__title" >Đến ngày <span className="form__title__note">(*)</span></label>
                                                    <DateTimePicker className="form-control"
                                                        // ref={FromdateRef}
                                                        onChange={date => setTodate(date)}
                                                        value={Todate}
                                                        format='MM/dd/yyyy HH:mm:ss'
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="form__title" >Mã thực tế </label>
                                                    <input type="text" className="form-control" value={Code} onChange={a => setCode(a.target.value.trim())} />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="form__title" >Khách hàng </label>
                                                    <SelectCustomer
                                                        onSelected={e => {
                                                            setCusId(e)
                                                            setWarehouseTo({ value: -1 })
                                                        }}
                                                        items={CusId.value}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="form__title" >Kho {Function.Id == 3 ? 'xuất' : ""}</label>
                                                    <SelectWarehouse
                                                        onSelected={e => setWareHouseId(e)}
                                                        items={WareHouseId.value}
                                                    />
                                                </div>
                                            </div>
                                            <div className={Function.Id == 3 ? "col-md-3" : "display-none"}>
                                                <div className="form-group">
                                                    <label className="form__title" >Kho nhập</label>
                                                    <SelectWarehouse
                                                        onSelected={e => setWarehouseTo2(e)}
                                                        items={WarehouseTo2.value}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="form__title" >Nhân viên thực hiện </label>
                                                    <SelectAccount
                                                        onSelected={e => setStaffId(e)}
                                                        items={StaffId.value}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="form__title" >Thời gian dự kiến</label>
                                                    <DateTimePicker className="form-control"
                                                        onChange={date => setCreateTime(date)}
                                                        value={CreateTime}
                                                        format='MM/dd/yyyy'
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="form__title" >Trạng thái</label>
                                                    <Select
                                                        value={StatusId}
                                                        onChange={a => setStatusId(a)}
                                                        options={Status}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="form__title" >Người tạo</label>
                                                    <SelectAccount
                                                        onSelected={e => setCreateId(e)}
                                                        items={CreateId.value}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={DataList.length > 0 ? "" : "display-none"}>
                                        <SettingColumn
                                            columns={columns}
                                            Returndata={a => {
                                                setcolumns(a)
                                            }}
                                        />
                                        <DataTable
                                            data={DataList}
                                            columns={columns}
                                        />
                                    </div>
                                    {HtmlDetail}
                                    {ViewImgDetail}
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </section >
        </div >
    );

}