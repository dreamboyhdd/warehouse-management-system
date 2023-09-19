import React, { useState, useEffect, useRef, useDebugValue } from "react";
import { useDispatch, useSelector } from 'react-redux';
import I18n from '../../../Language'
import { APIKey } from '../../../Services/Api';
import Select from 'react-select';
import DateTimePicker from 'react-datetime-picker';
import $ from "jquery";
import { SelectAccount, SelectCustomer, SelectWarehouseContract, SelectWarehouse, SelectVehicle, DataTable, SelectProvider, SelectCurator } from '../../../Common';
import { mainAction } from '../../../Redux/Actions'
import { Alertwarning, ConfirmAlert, Alertsuccess, Alerterror, GetDataFromLogin, FormatDateJson, FirstOrLastDayinMonth, FormatNumber, ExportExcel, DateDiff, setData } from "../../../Utils";
import { QRCodeSVG } from 'qrcode.react';
import Barcode from "react-barcode";
export const InBoundList = () => {

    //#region Khai báo biến

    const dispatch = useDispatch();
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
    const [EditSerialImei, setEditSerialImei] = useState('');
    const [InventoryProductId, setInventoryProductId] = useState('');
    const EditSerialImeiRef = useRef();
    const [Driver, setDriver] = useState({ value: -1 });
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
    //list 
    const [Fromdate, setFromdate] = useState(FirstOrLastDayinMonth(new Date(), 1))
    const FromdateRef = useRef()
    const [Todate, setTodate] = useState(new Date())
    const TodateRef = useRef()
    const [Code, setCode] = useState('')
    const [Fromprint, setFromprint] = useState('')
    const [Toprint, setToprint] = useState('')
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
    const [Datacolumn, setDatacolumn] = useState()

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

        if (dataarray.Number === 0) return
        if (dataarray.keys === 'check') {
            CheckOne(dataarray._row.original.Id, dataarray._row.original.IsCheck, 1)
        }
        else if (dataarray.keys === 'checkall') {
            CheckOne(0, Checkall, 1)
        }
        else if (dataarray.keys === 'checkDetail') {
            CheckOne(dataarray._row.original.Id, dataarray._row.original.IsCheck, 2)
        }
        else if (dataarray.keys === 'checkDetailAll') {
            CheckOne(1, Checkall, 2)
        }
        else if (dataarray.keys === 'view') {
            WH_spWareHouse_Import_SerialDetail(dataarray._row)
        } else if (dataarray.keys === 'edit') {
            Edit(dataarray._row)
        } else if (dataarray.keys === 'delete') {
            WH_spWareHouse_StrategyActual_Delete(dataarray._row.value)
        }
        else if (dataarray.keys === 'print') {
            PrintDetail(dataarray._row.value)
        }
    }, [dataarray]);

    $('body').on("click", function (event) {
        setIsAcctive(false)
    })

    const CheckOne = (Id, Check, key) => {
        if (key == 1) {
            let _DataList = [...DataList]
            if (Id == 0) {
                _DataList.forEach(i => {
                    if (i.Status === 'Mới tạo') {
                        i.IsCheck = !Checkall;
                    }
                })
                setCheckall(!Checkall)
            }
            else {
                if (Check === undefined)
                    Check = false;
                _DataList.find(p => p.Id == Id).IsCheck = !Check
            }
            setDataList(_DataList);
        }
    };

    const CheckOne2 = (Id, Check) => {
        let _DataDetailList = [...DataDetailList]
        if (Id == 1) {
            _DataDetailList.forEach(i => {
                i.IsCheck = !Checkall;
            })
            setCheckall(!Checkall)
        } else {
            if (Check === undefined)
                Check = false;
            _DataDetailList.find(p => p.InventoryProductId == Id.InventoryProductId).IsCheck = !Check
        }
        setDataDetailList(_DataDetailList);
    }
    const Checkprint = (s) => {
        debugger
        let _DataDetailList = [...DataDetailList],
            from = _DataDetailList.find(a => a.CodeSeriIme === Fromprint),
            to = _DataDetailList.find(a => a.CodeSeriIme === Toprint)
        if (from === undefined || to === undefined) {
            Alertwarning("No data to check print!")
            return
        }
        let _data = _DataDetailList.filter(a => a.InventoryProductId >= from.InventoryProductId && a.InventoryProductId <= to.InventoryProductId)
        _data.filter(a => a.IsCheck = true)
        setDataDetailList(_DataDetailList);
    }
    const WH_spProductPackaging_List = async (Id, key) => {
        debugger
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
            Alerterror("Lỗi dữ liệu,vui lòng liên hệ IT NETCO !");
            console.log(error, "WH_spProductPackaging_List")
        }

    }
    const [HtmlPrint, setHtmlPrint] = useState([]);
    const [WaitPrint, setWaitPrint] = useState([]);
    const PrintDetail = async (row) => {
        const params = {
            Json: JSON.stringify({
                Id: row,
                AccountId: GetDataFromLogin("AccountId"),
                Keys: Function.Id,
                Type: 2
            }),
            func: "WH_spWareHouse_StrategyActual_DetailList",
            API_key: APIKey
        }
        const result = await mainAction.API_spCallServer(params, dispatch);
        await setWaitPrint(Print_WarehouseReceipt(result[0], result))

        let html = $("#barcodeTarget").html();
        const iframe = document.createElement('iframe')
        iframe.name = 'printf'
        iframe.id = 'printf'
        iframe.height = 0;
        iframe.width = 0;
        document.body.appendChild(iframe)
        var newWin = window.frames["printf"];
        newWin.document.write(`<body onload="window.print()">${html}</body>`);
        newWin.document.close();
        setHtmlPrint([]);

    }
    const Print_WarehouseReceipt = (v, result) => {
        let Data = [...HtmlPrint];

        Data.push(
            <div className="bill" style={{ width: '720px', height: '1024px', pageBreakAfter: 'always', pageBreakBefore: 'always', border: '1px solid black' }}>
                <table style={{ width: '100%', height: '175px', fontWeight: '600', borderTop: '1px solid black', borderBottom: '1px solid black', textAlign: 'center', paddingTop: '15px' }}>
                    <tr>
                        <td style={{ width: '40%', verticalAlign: 'top' }}>
                            <img src="https://admin-netco.vps.vn//Image/ckfinder/files/logoNew.png" style={{ width: '254px', height: '70px', margiLeft: '-10px' }} />
                            <div style={{ fontSize: '10px', marginTop: '23px' }}> CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ CHUYỂN PHÁT NHANH NỘI BÀI</div>
                            <div style={{ fontSize: '9px', fontStyle: 'italic', marginTop: '5px', marginBottom: '10px', width: '270px' }}> Address (Headquarters): Tầng 8, Khối B, Tòa nhà Sông Đà, đường Phạm Hùng, Phường Mỹ Đình 1, Quận Nam Từ Liêm, TP Hà Nội</div>

                            <span style={{ fontSize: '9px', fontStyle: 'italic', paddingRight: '35px' }}>
                                Hotline : 19006463 - 024 38 356 356
                            </span>

                            <span style={{ fontSize: '9px', fontStyle: 'italic' }}>
                                Email : info@netco.com.vn
                            </span>
                        </td>
                        <td style={{ width: '60%', verticalAlign: 'top', marginRight: '1px' }}>
                            <div style={{ fontSize: '20px', marginBottom: '10px' }}>
                                <b>WAREHOUSE RECEIPT </b>
                            </div>
                            <div style={{ padding: "0px 5px", position: "relative", display: "'inline-block'" }}><div class="code" style={{ width: "25%" }} ><Barcode value={v.Code} height="35" /> </div></div>
                            <div>

                                <table style={{ width: '100%' }}>
                                    <tr>
                                        <td style={{ width: '50%', fontSize: '12px', textAlign: 'center', verticalAlign: 'top' }}>
                                            <div> <b>WareHouse Code</b> </div>
                                            <div> {v.WareHouseCode}</div>

                                        </td>
                                        <td style={{ width: '50%', fontSize: '12px', textAlign: 'center', verticalAlign: 'top' }}>

                                            <div><b> Import Code </b> </div>
                                            <div>
                                                <span style={{ border: '1px solid black', padding: '1px 10px' }}>{v.Code} </span>

                                            </div>
                                        </td>

                                    </tr>
                                    <tr>
                                        <td style={{ width: '50%', fontSize: '11px', textAlign: 'center', verticalAlign: 'top' }}>
                                            <div> <b> Import Date</b> </div>
                                            <div> {FormatDateJson(v.CreateTime)}</div>

                                        </td>
                                        <td style={{ width: '50%', fontSize: '11px', textAlign: 'center', verticalAlign: 'top' }}>

                                            <div><b> Print Date</b></div>
                                            <div> {FormatDateJson(new Date())}</div>
                                        </td>

                                    </tr>
                                </table>
                            </div>


                        </td>

                    </tr>
                </table>
                <table style={{ width: '100%', fontSize: '12px', padding: '10px 0px' }} cellspacing="0" cellpadding="5">
                    <tr>

                        <td style={{ width: '50%' }} >
                            <b style={{ display: 'inline-block', width: '100px', paddingBottom: '5px' }}><b> WareHouse Name </b></b>: {(v.WareHouseName)}<br />
                            <b style={{ display: 'inline-block', width: '100px', paddingBottom: '5px' }}><b>Prepare by </b></b> : {v.CreateName === undefined ? '' : v.CreateName} <br />
                            <b style={{ display: 'inline-block', width: '100px', paddingBottom: '5px' }}><b>Vehicle Name</b></b> : {v.NameVehicle === undefined ? '' : v.NameVehicle} <br />
                            <b style={{ display: 'inline-block', width: '100px', paddingBottom: '5px' }}><b>Note </b></b>: {(v.Note)}<br />

                        </td>
                        <td style={{ width: '50%' }}>
                            <b style={{ display: 'inline-block', width: '100px', paddingBottom: '5px' }}><b>Customer's name </b></b> : {v.CustomerName === undefined ? '' : v.CustomerName} <br />
                            <b style={{ display: 'inline-block', width: '100px', paddingBottom: '5px' }}><b>Company </b></b> : {v.CompanyName === undefined ? '' : v.CompanyName} <br />
                            <b style={{ display: 'inline-block', width: '100px', paddingBottom: '5px' }}><b>Phone </b></b> : {v.CompanyPhone === undefined ? '' : v.CompanyPhone} <br />
                            <b style={{ display: 'inline-block', width: '100px', paddingBottom: '5px' }}><b>Address</b></b> : {v.CompanyAddress === undefined ? '' : v.CompanyAddress} <br />
                        </td>
                    </tr>
                </table>
                <table style={{ marginTop: '20px', fontSize: '12px', width: '100%', borderCollapse: 'collapse' }} border="1" cellpadding="4">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Brand</th>
                            <th>SKU</th>
                            <th>Product name</th>
                            <th>Serial/Imei</th>
                            <th>Quantity</th>
                            <th>Weight</th>


                        </tr>
                    </thead>

                    <tbody>{
                        result.map((item, index) => {
                            return (<tr>
                                <td>{index + 1}</td>
                                <td>{item.ProductGroupName}</td>
                                <td>{item.ProductCode}</td>
                                <td>{item.ProductName}</td>
                                <td>{item.Lotnumber}</td>
                                <td style={{ textAlign: 'center' }}>{item.PackageNumber}</td>
                                <td style={{ textAlign: 'center' }}>{FormatNumber(item.TotalWeight)}</td>
                            </tr>)

                        })
                    }
                    </tbody>
                    <tfoot>
                        <tr style={{ height: '35px' }}>
                            <td colspan="5"><b>Total</b></td>
                            <td style={{ textAlign: 'center' }}> <b>{FormatNumber(result.reduce((a, i) => a = a + i.PackageNumber, 0))}</b></td>
                            <td style={{ textAlign: 'center' }}>
                                <b> {(result.reduce((a, i) => a = a + i.TotalWeight, 0))}</b>
                            </td>
                        </tr>
                    </tfoot>
                </table>


                <table style={{ width: '100%', height: '90px', paddingLeft: '5px', fontSize: '12px', borderRight: '1px solid black', borderLeft: '1px solid black', borderBottom: '1px solid black', paddingBottom: '8px' }}>
                    <tr>
                        <td >
                            <div style={{ marginTop: '5px', paddingLeft: '5px', fontSize: '11px', fontStyle: 'italic' }}> 1.Received goods in full quantity and in good condition.</div>
                            <div style={{ marginTop: '5px', paddingLeft: '5px', fontSize: '11px', fontStyle: 'italic' }}> 2.This delivery note is the proof of receipt of goods between the Warehouse and the customer, please sign, specify the name of the consignee & the date of receipt as the basis for consideration of future complaints.</div>
                        </td>

                    </tr>
                </table>

                <table style={{ width: '100%', fontSize: '12px', margintop: '100px', paddingTop: '20px' }} cellspacing="0" cellpadding="5">
                    <tr>
                        <td style={{ textAlign: 'center', width: '50%' }}>
                            <div style={{ marginTop: '15px' }}> Date: ....../........./............... </div>
                            <div style={{ marginTop: '5px' }}><b> Prepare by </b> </div>
                            <div style={{ fontStyle: 'italic', marginTop: '80px' }}><b>(Sign and write full name)</b> </div>
                        </td>
                        <td style={{ textAlign: 'center', width: '50%' }}>
                            <div style={{ marginTop: '15px' }}> Date: ....../........./............... </div>
                            <div style={{ marginTop: '5px' }}><b>Deliverer</b> </div>
                            <div style={{ fontStyle: 'italic', marginTop: '80px' }}><b>(Sign and write full name)</b> </div>
                        </td>

                    </tr>
                </table>

            </div>
        )
        setHtmlPrint(Data)
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
            Alerterror("Lỗi dữ liệu,vui lòng liên hệ IT NETCO !");
            console.log(error, "WH_spProduct_Check")
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
                    Type: 1
                }),
                func: "WH_spWareHouse_StrategyActual_List",
                API_key: APIKey
            }
            setCheckall(false)
            const list = await mainAction.API_spCallServer(params, dispatch);
            if (list.length > 0) {
                setDataList(list)
            } else {
                Alertwarning("Không có dữ liệu!")
                setDataList([])
            }
        } catch (error) {
            Alerterror("Lỗi dữ liệu,vui lòng liên hệ IT NETCO !");
            console.log(error, "WH_spWareHouse_StrategyActual_List")
        }

    }

    const WH_spWareHouse_StrategyActual_Delete = async (id) => {
        ConfirmAlert("Xóa chiến lược", "Bạn có chắc muốn xóa chiến lược này?", async () => {
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

                const params = {
                    Json: JSON.stringify({
                        ListId: ar,
                        AccountId: GetDataFromLogin("AccountId"),
                        AccountName: GetDataFromLogin("AccountName"),
                        Keys: Function.Id,
                        Type: 1
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

            } catch (error) {
                Alerterror("Lỗi dữ liệu,vui lòng liên hệ IT NETCO !");
                console.log(error, "WH_spWareHouse_StrategyActual_Delete")
            }
        })
    }

    const handleChangeSerialDetail = async () => {
        try {
            const params = {
                Json: JSON.stringify({
                    InventoryProductId: InventoryProductId,
                    CodeSeriIme: EditSerialImei,
                    AccountId: GetDataFromLogin("AccountId"),
                    AccountName: GetDataFromLogin("AccountName"),
                }),
                func: "WH_spWareHouseInventoryProduct_ChangeSerialImei",
                API_key: APIKey
            }
            debugger
            const result = await mainAction.API_spCallServer(params, dispatch);
            console.log(result)
            if (result[0].Status === "OK") {
                let _result = [...DataDetailList]
                const newResult = _result.map(p =>
                    p.InventoryProductId === result[0].InventoryProductId
                        ? { ...p, CodeSeriIme: result[0].CodeSeriIme }
                        : p
                );
                setEditSerialImei('')
                setDataDetailList(newResult)
                Alertsuccess(result[0].ReturnMess)
                return
            } else {
                Alertwarning(result[0].ReturnMess)
            }
        } catch (error) {

        }
    }

    const WH_spWareHouse_Import_SerialDetail = async (row) => {
        try {
            const params = {
                Json: JSON.stringify({
                    ImportId: row.value,
                    AccountId: GetDataFromLogin("AccountId"),
                    AccountName: GetDataFromLogin("AccountName"),
                }),
                func: "WH_spWareHouse_Import_SerialDetail",
                API_key: APIKey
            }
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.length > 0) {
                setDataDetailList(result)
                setTitle(row.original.Code)
                setFromprint('')
                setToprint('')
                const totalByProduct = Object.values(result.reduce((a,
                    { ProductId, ProductName }) => {
                    a[ProductId] = a[ProductId] ||
                    {
                        ProductId: ProductId,
                        ProductName: ProductName,
                    };
                    return a;
                }, {}));
                setCountGroup(totalByProduct.length)

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
        setDriver({ value: row.original.DriverId })
        setWarehouse({ value: row.original.WareHouseId })
        setWarehouseTo({ value: row.original.WareHouseToId })
        setArea({ value: row.original.AreaId })
        setCustomerId({ value: row.original.CustomerId })
        setPOcode(row.original.POcode)
        // setProvider({value: row.original.ProviderId })
        // setCurator({value: row.original.CuratorId })
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
                    Type: 1
                }),
                func: "WH_spWareHouse_StrategyActual_DetailList",
                API_key: APIKey
            }
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.length > 0) {
                result.forEach(element => {
                    result.find(i => i.ProductId === element.ProductId).ValuePackaging = { value: element.ProductPackagingId, NumberConversion: element.NumberConversion, label: element.ProductPackagingName };
                    setDataOK(result)
                });
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

    const Exportexcel = () => {
        const newData = DataList.map(element => {
            return {
                'Status': element.Status,
                'Inbound Code': element.Code,
                'Customer Name': element.CustomerName,
                'Staff Name 1': element.StaffName1,
                'Staff Name 2': element.StaffName2,
                'Staff Name 3': element.StaffName3,
                'TotalProduct': element.TotalProduct,
                'PO code': element.POcode,
                'Name Vehicle': element.NameVehicle,
                'Driver Name': element.DriverName,
                'StrategyT ime': FormatDateJson(element.StrategyTime),
                'Area': element.Name,
                'Ware HouseName': element.WareHouseName,
                'Note': element.Note,
                'Create Name': element.CreateName,
                'Create Time': FormatDateJson(element.CreateTime),
                'Edit Name': element.EditName,
                'Edit Time': FormatDateJson(element.EditTime)
            }
        })
        ExportExcel(newData, "List Inbound");
    }
    const viewImageInTable = (e) => {
        setModalImg({ ProductName: e.ProductName, Image: e.Image })
    }
    const columns = [
        {

            Header: (
                <div className="col-sm-12">
                    <div class="icheck-success d-inline">
                        <input type="checkbox" id="checkbox"
                            onChange={e => {
                                setdataarray({ Number: dataarray.Number + 1, keys: 'checkall' })
                            }} />
                        <label htmlFor="checkbox" className="label checkbox"></label>
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
                            key={row.original.Id}
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
            Header: 'Option',
            accessor: 'Id',
            special: true,
            show: true,
            filterable: false,
            sortable: false,
            width: 180,
            textAlign: "center",
            Cell: (row) => (
                <span>
                    <button type="button"
                        data-tooltip="Detail"
                        className="btn btn-sm btn-info mr-2 show__tip__left"
                        data-toggle="modal" data-target="#myModal"
                        onClick={e => setdataarray({ Number: dataarray.Number + 1, _row: row, keys: 'view' })}
                    >
                        <i className="fa-solid fa-eye"></i>
                    </button>
                    {/* {
                        row.original.Status === 'Mới tạo' ?
                            <button type="button"
                                data-tooltip="Sửa"
                                className="btn btn-sm btn-success mr-2 show__tip__left"
                                onClick={(e) => setdataarray({ Number: dataarray.Number + 1, _row: row, keys: 'edit' })}
                            >
                                <i className="fas fa-wrench"></i>
                            </button> : ""
                    } */}
                    {
                        <button key={row.index + 4}
                            data-tooltip="Print"
                            className="btn btn-sm btn-primary mr-2 show__tip__left"
                            onClick={(e) => setdataarray({ Number: dataarray.Number + 1, _row: row, keys: 'print' })}
                        >
                            <i className="fa fa-print"></i>
                        </button>
                    }
                    {
                        row.original.Status === 'Mới tạo' ?
                            <button type="button"
                                data-tooltip="Xoá"
                                className="btn btn-sm btn-danger mr-2 show__tip__right"
                                onClick={(a) => setdataarray({ Number: dataarray.Number + 1, _row: row, keys: 'delete' })}
                            >
                                <i className="fa fa-trash"></i>
                            </button> : ""
                    }
                </span>)
        }
        , {
            Header: I18n.t('Report.STT'),
            special: true,
            filterable: false,
            sortable: false,
            show: true,
            Cell: (row) => <span>{row.index + 1}</span>,
        },
        {
            Header: "Status",
            accessor: 'Status',
            width: 180,
            Cell: (obj) => {
                if (obj.value == 'Mới tạo') {
                    return <label className="btn labelradius10px new">{obj.value}</label>
                } else if (obj.value == 'Đã xác nhận') {
                    return <label className="btn labelradius10px older">{obj.value}</label>
                } else {
                    return <label className="btn labelradius10px confirmed">{obj.value}</label>
                }
            }
        },
        {
            Header: "Type",
            accessor: 'TypeTransport',
            show: false,
            keys: 1,
            width: 180,
            special: true,
            Cell: (obj) => obj.value === 'Nội bộ' ?
                <label className="btn labelradius10px new" style={{ backgroundColor: "#55A208", color: "#FFFFFF" }}>{obj.value}</label>
                :
                <label className="btn labelradius10px older" style={{ backgroundColor: "#EB8B0C", color: "#FFFFFF" }}>{obj.value}</label>
        },
        {
            Header: "InBound code",
            accessor: 'Code',
            width: 180

        },
        // {
        //     Header: "Mã thực tế",
        //     accessor: "StrategyCode",
        //     width: 180
        // },
        {
            Header: "Customer Code",
            accessor: "CustomerCode",
            width: 180
        }, {
            Header: "PO code",
            accessor: "POcode",
            width: 180
        },
        {
            Header: "Puttaway staff 1",
            accessor: "StaffName1",
            width: 180
        },
        {
            Header: "Puttaway staff 2",
            accessor: "StaffName2",
            width: 180
        },
        {
            Header: "Puttaway staff 3",
            accessor: "StaffName3",
            width: 180
        },
        {
            Header: "Total Product",
            accessor: "TotalProduct",
            width: 180
        },
        {
            Header: "Name Vehicle",
            accessor: "NameVehicle",
            width: 180,
        },
        {
            Header: "Driver Name",
            accessor: "DriverName",
            width: 180,
        },
        {
            Header: "License plates",
            accessor: "Licenseplates",
            width: 180,
        },
        {
            Header: "Person in charge",
            accessor: "StaffName",
            width: 180,
        },
        {
            Header: "PO code",
            accessor: "POcode",
            width: 180
        },
        {
            Header: "Planned time",
            accessor: "StrategyTime",
            Cell: (obj) => FormatDateJson(obj.value),
            width: 180
        },
        {
            Header: "Area",//
            accessor: "Name",
            show: true,
            keys: 2,
            special: true
        },
        {
            Header: "WareHouse Name",//
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
        },
        {
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
        },
        {
            Header: "Kho nhập",//
            accessor: "WareHouseNameTo",
            show: false,
            keys: 1,
            special: true
        },
        {
            Header: "Note",
            accessor: "Note",
            width: 180
        },
        {
            Header: "Create Name",
            accessor: "CreateName",
            width: 180
        },
        {
            Header: "Create Time",
            accessor: "CreateTime",
            Cell: (obj) => FormatDateJson(obj.value),
            width: 180
        },
        {
            Header: "Edit Name",
            accessor: "EditName",
            width: 180
        },
        {
            Header: "Edit Time",
            accessor: "EditTime",
            width: 180,
            Cell: (obj) => FormatDateJson(obj.value)
        }

    ];
    const handleChangePrint = async (ar, DataPrint) => {
        debugger
        try {
            const params = {
                Json: JSON.stringify({
                    ListId: ar,
                }),
                func: "WH_spWareHouseInventoryProduct_ChangeStatusPrint",
            }
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result[0].Status === "OK") {
                let datatemp = [...DataDetailList]
                const _datatemp = datatemp.map(e =>
                    e.IsCheck === true
                        ? { ...e, IsPrint: true }
                        : e
                )
                setDataDetailList(_datatemp)
                Alertsuccess(result[0].ReturnMess)

                await setPrintdataQRCode(DataPrint);
                $("#Printform").css("display", "block");
                $("#formaction").css("display", "none");
                $("footer").css("display", "none");
                $("#myModal").removeClass("show");
                $(".modal-backdrop.show").css("opacity", "0");
                window.print();
                $("#Printform").css("display", "none");
                $("#formaction").css("display", "block");
                $("footer").css("display", "block");
                $("#myModal").addClass("show");
                $(".modal-backdrop.show").css("opacity", "0.5");
                return
            } else {
                Alertwarning(result[0].ReturnMess)
            }
        } catch (error) {

        }
    }
    const [PrintdataQRCode, setPrintdataQRCode] = useState([]);
    const PrintQRCode = async () => {
        debugger
        const DataPrint = DataDetailList.filter(p => p.IsCheck === true);
        if (DataPrint.length === 0) {
            Alertwarning(I18n.t("System.Pleaseselecttheproducttoprint!"))
            return
        }
        const ar = [];
        DataPrint.map(e => {
            if (e.IsPrint === false) {
                ar.push({
                    Id: e.InventoryProductId,
                    AccountId: GetDataFromLogin("AccountId"),
                    AccountName: GetDataFromLogin("AccountName"),
                });
            }
        })

        if (ar.length > 0) {
            handleChangePrint(ar, DataPrint)
        } else {
            await setPrintdataQRCode(DataPrint);
            $("#Printform").css("display", "block");
            $("#formaction").css("display", "none");
            $("footer").css("display", "none");
            $("#myModal").removeClass("show");
            $(".modal-backdrop.show").css("opacity", "0");
            window.print();
            $("#Printform").css("display", "none");
            $("#formaction").css("display", "block");
            $("footer").css("display", "block");
            $("#myModal").addClass("show");
            $(".modal-backdrop.show").css("opacity", "0.5");
        }


    }
    const columnsDetail = [
        {
            Header: (
                <div className="col-sm-12">
                    <div class="icheck-success d-inline">
                        <input type="checkbox" id="checkboxdetail"
                            onChange={e => {
                                CheckOne2(1)
                            }}
                        />
                        <label htmlFor="checkboxdetail" className="label checkbox"></label>
                    </div>
                </div>),
            accessor: 'Id',
            filterable: false,
            sortable: false,
            width: 70,
            maxWidth: 70,
            minWidth: 70,
            special: true,
            show: true,
            textAlign: "center",
            Cell: (row) => (
                <div className="col-sm-12">
                    <div className="icheck-success d-inline">
                        <input type="checkbox"
                            id={row.original.InventoryProductId}
                            value={row.original.InventoryProductId}
                            checked={row.original.IsCheck}
                            // disabled={row.original.IsPrint ? true : false}
                            key={row.original.InventoryProductId}
                            onChange={e => {
                                CheckOne2(row.original, row.original.IsCheck)
                            }}
                        />
                        <label className="label checkbox" htmlFor={row.original.InventoryProductId}></label>
                    </div>
                </div>
            )
        },
        {
            Header: 'Options',
            accessor: 'Id',
            special: true,
            show: true,
            filterable: false,
            sortable: false,
            width: 200,
            maxWidth: 200,
            minWidth: 200,
            textAlign: "center",
            Cell: (row) => (
                <span>
                    <button
                        type="button"
                        data-tooltip="Edit serial"
                        className="btn btn-sm btn-info mr-2 show__tip__left"
                        data-toggle="modal"
                        data-target="#modalEditSerialEmei"
                        onClick={e => {
                            setEditSerialImei(row.original.CodeSeriIme)
                            setInventoryProductId(row.original.InventoryProductId)
                        }}
                    >
                        <i className="fas fa-wrench"></i>
                    </button>
                </span>

            )
        },
        {
            Header: I18n.t('Report.STT'),
            width: 50,
            filterable: false,
            sortable: false,
            Cell: (row) => <span>{row.index + 1}</span>
        },
        {
            Header: "Status",
            accessor: 'IsPrint',
            filterable: false,
            sortable: false,
            width: 110,
            Cell: (obj) => {
                if (obj.original.IsPrint == true) {
                    return <label className="btn labelradius10px new">Đã in</label>
                } else {
                    return <label className="btn labelradius10px older">Chưa in</label>
                }
            }
        },
        {
            Header: "Image",
            accessor: "Image",
            filterable: false,
            sortable: false,
            Cell: (row) => (
                <div>
                    <a
                        className="cursor"
                        data-toggle="modal"
                        data-target="#modalImg2"
                        onClick={(e) => {
                            viewImageInTable(row.original);
                        }}
                        title="Lagger Image"
                    >
                        {row.original.Image !== undefined ? <img src={row.original.Image} height="30" width="50" /> : <></>}
                    </a>
                </div>
            )
        },
        {
            Header: "Serial",
            accessor: 'CodeSeriIme',
            width: 180,
        },
        {
            Header: "Product Name",
            accessor: 'ProductName',
            width: 180,
        },
        {
            Header: "Product Code",
            accessor: 'ProductCode',
            width: 180,
        },
        {
            Header: "Quality(Item)",
            accessor: "Quality",
        },
        {
            Header: "Unit Name",
            accessor: 'UnitName',

        },
        {
            Header: "Dateof Manufacture",
            accessor: "DateofManufacture",
            Cell: (obj) => FormatDateJson(obj.value, 5)
        },
        {
            Header: "Date Expiry",
            accessor: "DateExpiry",
            Cell: (obj) => FormatDateJson(obj.value, 5)
        }, {
            Header: "Notes",
            accessor: "Statusdate"
        }

    ];

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

    //#region modal detail product group
    const HtmlDetail = (
        <div className="container">
            <div className="modal fade" id="myModal" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content width_height100 modal__detail__table">
                        <div class="modal-header">
                            <div className="row edit__user__header_f">
                                <h4 className="edit__user__title">
                                    <i className="fa fa-users mr-2" />
                                    Detail : {Title}
                                </h4>
                                <a className="btn btn-print"
                                    onClick={e => PrintQRCode()} >
                                    <i className='fas fa-print mr-2'></i>
                                    Print
                                </a>
                                <a className="btn btn__default" data-dismiss="modal">
                                    <i className="fa fa-times-circle edit__close__icon" />
                                </a>
                            </div>
                        </div>
                        <div class="modal-body">
                            <div className="card-body group__product card__info">
                                <div className="row col-md-6 card__info">
                                    <div className="card__h150w210 BG-9DDFD3">
                                        <p className="">Brand</p>
                                        <p>{CountGroup}</p>
                                    </div>
                                    <div className="boxtotal">
                                        <p className="">Serial</p>
                                        <p>{DataDetailList.length}</p>
                                    </div>
                                </div>
                                <div className="row col-md-6">
                                    <div className="col-md-5">
                                        <div className="form-group">
                                            <label className="form__title" >From print</label>
                                            <input type="text" className="form-control" value={Fromprint} onChange={a => setFromprint(a.target.value.trim())} placeholder='Serial' />
                                        </div>
                                    </div>
                                    <div className="col-md-5">
                                        <div className="form-group">
                                            <label className="form__title" >To print</label>
                                            <input type="text" className="form-control" value={Toprint} onChange={a => setToprint(a.target.value.trim())} placeholder='Serial' />
                                        </div>
                                    </div>
                                    <div className="col-md-2 margin-top-32">
                                        <button type="button" className="btn btn-danger btn-xs float-right height35 margin-left-5"
                                            onClick={a => Checkprint(a)}
                                        >
                                            <i className="fa fa-check mr-2 " />
                                            Check
                                        </button>
                                    </div>

                                </div>
                            </div>

                            <DataTable data={DataDetailList} columns={columnsDetail} />
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
    const modalEditSerialEmei = (
        <div class="modal fade" id="modalEditSerialEmei" tabindex="-1" role="dialog" aria-labelledby="modalImg" aria-hidden="true" >
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <div className="row edit__user__header_f">
                            <h4 className="edit__user__title">
                                <i class="fa-solid fa-pen-to-square mr-3"></i>
                                Edit Serial/Imei
                            </h4>
                            <a className="btn btn-print"
                                onClick={e => handleChangeSerialDetail()} >
                                <i class="fa-regular fa-floppy-disk mr-2"></i>
                                Save
                            </a>
                            <a className="btn btn__default" data-dismiss="modal">
                                <i className="fa fa-times-circle edit__close__icon" />
                            </a>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3"></div>
                        <div className="col-md-6 mt-3 pb-3">
                            <div className="form-group">
                                <label className="form__title " >Mã serial/imel</label>
                                <input type="text" className="form-control" ref={EditSerialImeiRef} value={EditSerialImei} onChange={a => setEditSerialImei(a.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-3"></div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="content-wrapper pt-2">
            <section className="content" id="formaction">
                <div className="container-fluid">
                    <div className="card card-primary">

                        <div className="body-padding">
                            <div className="tab-content" id="custom-tabs-two-tabContent">
                                <div className="tab-pane fade show active" id="tab_2" role="tabpanel" aria-labelledby="custom-tabs-two-profile-tab">
                                    <div className="card-header">
                                        <div className="row" >
                                            <div className="col-sm-12 col-md-6">
                                                <h3 className="card-title">
                                                    <i className="fa fa-bars" />
                                                    <span className="font-weight-bold">
                                                        {I18n.t("Leftmenu.InBoundList")} ({DataList.length})
                                                    </span>
                                                </h3>
                                            </div>
                                            <div className="col-sm-6 margin-5">
                                                <button type="button" className="btn btn-warning btn-xs float-right height35 margin-left-5"
                                                    onClick={e => Exportexcel(e)}>
                                                    <i className="fa fa-download mr-2" />
                                                    {I18n.t("System.Excel")}
                                                </button>
                                                <button type="button" className="btn btn-danger btn-xs float-right height35 margin-left-5"
                                                    onClick={a => WH_spWareHouse_StrategyActual_Delete(-1)}
                                                >
                                                    <i className="fa fa-trash mr-2 " />
                                                    {I18n.t('System.Delete')}
                                                </button>
                                                <button type="button" className="btn btn-primary btn-xs float-right height35"
                                                    onClick={e =>
                                                        WH_spWareHouse_StrategyActual_List(e)
                                                    }>
                                                    <i className="fa-solid fa-eye" />
                                                    {I18n.t('System.View')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="barcodeTarget" className="display-none">
                                        {HtmlPrint}
                                    </div>
                                    <div className="card-body-form">
                                        <div className="row col-md-12">
                                            <div className="col-md-3 marginTop-3">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t('System.FromDate')} <span className="form__title__note">(*)</span></label>
                                                    <DateTimePicker className="form-control"
                                                        ref={FromdateRef}
                                                        onChange={date => setFromdate(date)}
                                                        value={Fromdate}
                                                        format='MM/dd/yyyy HH:mm:ss'
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 marginTop-3">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t('System.ToDate')} <span className="form__title__note">(*)</span></label>
                                                    <DateTimePicker className="form-control"
                                                        ref={TodateRef}
                                                        onChange={date => setTodate(date)}
                                                        value={Todate}
                                                        format='MM/dd/yyyy HH:mm:ss'
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t('System.InBoundCode')} </label>
                                                    <input type="text" className="form-control" value={Code} onChange={a => setCode(a.target.value.trim())} />
                                                </div>
                                            </div>

                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t('Customer.Customer')} ID</label>
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
                                                    <label className="form__title" >{I18n.t('Customer.Warehouse')} ID</label>
                                                    <SelectWarehouse
                                                        onSelected={e => setWareHouseId(e)}
                                                        items={WareHouseId.value}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t('Actual.Executionstaff')} ID </label>
                                                    <SelectAccount
                                                        onSelected={e => setStaffId(e)}
                                                        items={StaffId.value}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t('Actual.Intendtime')}</label>
                                                    <DateTimePicker className="form-control"
                                                        onChange={date => setCreateTime(date)}
                                                        value={CreateTime}
                                                        format='MM/dd/yyyy'
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t('AccountGroup.Status')}</label>
                                                    <Select
                                                        value={StatusId}
                                                        onChange={a => setStatusId(a)}
                                                        options={Status}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t('System.Creater')} ID</label>
                                                    <SelectAccount
                                                        onSelected={e => setCreateId(e)}
                                                        items={CreateId.value}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={DataList.length > 0 ? "margin-bottom-40" : "display-none"}>
                                        <DataTable
                                            data={DataList}
                                            columns={columns}
                                        />
                                    </div>
                                    {HtmlDetail}
                                    {ViewImgDetail}
                                    {modalEditSerialEmei}
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </section >
            <div id="Printform" className="content-wrapper pt-2 text-center" style={{ width: "100%", display: "none" }}>

                {
                    PrintdataQRCode.map((item, index) => {
                        return (
                            <div className="col-md-12" style={{
                                height: '430px',
                                marginTop: (((index + 1) + 2) % 3) === 0 || (index + 1) === 1 ? '0px' : '80px',
                                padding: (((index + 1) + 2) % 3) === 0 || (index + 1) === 1 ? '10px 65px 65px 65px' : '65px 65px 65px 65px',
                                pageBreakAfter: ((index + 1) % 3) === 0 ? 'always' : '',
                            }}>
                                <div >
                                    <QRCodeSVG
                                        id={item.CodeSeriIme + 'view'}
                                        value={item.CodeSeriIme}
                                        size={300}
                                    />
                                    <h3 className="col-md-12" style={{ textAlign: "center", marginTop: '2px' }}>{item.CodeSeriIme}</h3>
                                    <h3 className="col-md-12" style={{ textAlign: "center" }}>{item.ProductCode} - {FormatDateJson(item.DateExpiry, 1)}</h3>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

        </div >
    );

}