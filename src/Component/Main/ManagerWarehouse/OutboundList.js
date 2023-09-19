import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import I18n from '../../../Language'
import { APIKey } from '../../../Services/Api';
import Select from 'react-select';
import DateTimePicker from 'react-datetime-picker';
import $, { parseJSON } from "jquery";
import { SelectArea, SettingColumn, SelectAccount, SelectCustomer, SelectWarehouseContract, SelectWarehouse, SelectVehicle, DataTable, GetInfoFromTMS } from '../../../Common';
import { mainAction } from '../../../Redux/Actions'
import { Alertwarning, Alertsuccess, Alerterror, GetDataFromLogin, FormatDateJson, FirstOrLastDayinMonth, FormatNumber, ExportExcel, ConfirmAlert, DateDiff, RegEpxPhoneVN, Loading } from "../../../Utils";
import Barcode from "react-barcode";
import Axios from 'axios'
export const OutboundList = () => {

    //#region Khai báo biến
    const dispatch = useDispatch();
    const [InfoTMS, setInfoTMS] = useState([]);
    const [IsLoad, setIsLoad] = useState(1);
    const [Checkall, setCheckall] = useState(false);
    const [disable, setdisable] = useState(false); // disable button 
    const [StrategyCode, setStrategyCode] = useState('');
    const [Warehouse, setWarehouse] = useState({ value: -1 });
    const [WarehouseTo, setWarehouseTo] = useState({ value: -1 });
    const [Area, setArea] = useState({ value: -1 });
    const [AccountId, setAccountId] = useState([]);
    const AccountIdRef = useRef()
    const [ID, setID] = useState(0);
    const [Status, setStatus] = useState([{ value: -1, label: 'Please search' }, { value: 0, label: 'Mới tạo' }, { value: 1, label: 'Đang tiến hành' }, { value: 2, label: 'Hoàn tất' }]);
    const [StatusId, setStatusId] = useState({ value: -1, label: 'Please search' });
    const [CustomerId, setCustomerId] = useState({ value: -1 });
    const CustomerIdRef = useRef()
    const [Vehicle, setVehicle] = useState({ value: 0 });
    const VehicleRef = useRef()
    const ProviderRef = useRef()
    const CuratorRef = useRef()
    const POcodeRef = useRef()
    const [Driver, setDriver] = useState({ value: -1 });
    const [Description, setDescription] = useState("");
    const [Dates, setDates] = useState(new Date());
    const [Excel, setExcel] = useState([])
    const [DataExcel, setDateExcel] = useState([])
    const DateRef = useRef();
    const [Function, setFunction] = useState({ Id: 2, _funcsave: 'WH_spWareHouse_Export_Save', Name: 'Outbound OPERATION' });
    const [DataOK, setDataOK] = useState([]);
    const [IsAcctive, setIsAcctive] = useState(false);
    const [IsRun, setIsRun] = useState(0)
    const [ModalImg, setModalImg] = useState({})
    const [dataarray, setdataarray] = useState({ Number: 0 })

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

    const [OutboundCode, setOutboundCode] = useState("");
    const [OutboundId, setOutboundId] = useState(0);
    const [WaybillCode, setWaybillCode] = useState("");
    const WaybillRef = useRef();
    //#endregion
    //call from table column
    useEffect(() => {

        if (dataarray.keys === 'view') {
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
    //print
    const [HtmlPrint, setHtmlPrint] = useState([]);
    const [WaitPrint, setWaitPrint] = useState([]);
    const PrintDetail = async (Id, Code) => {
        try {
            debugger
            let listcode = [], listid = [];
            if (Id !== undefined) {
                listcode.push(
                    { Code: Code }
                )
                listid.push(
                    { Id: Id }
                )
            } else {
                let _DataList = DataList.filter(a => a.IsCheck == true);
                _DataList.forEach(a => {
                    listcode.push(
                        { Code: a.Code }
                    )
                    listid.push(
                        { Id: a.Id }
                    )
                })
                if (listid.length === 0) {
                    Alertwarning("Please choise row to print!")
                    return
                }
            }

            const results = await Axios.post(
                'https://api-v4-erp.vps.vn/api/ApiMain/API_spCallServer',
                {
                    Json: JSON.stringify({
                        ListCode: listcode
                    }),
                    func: "CPN_spLading_PrintInfoToWMS_V2",
                    API_key: "netcoApikey2025",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            const params = {
                Json: JSON.stringify({
                    ListId: listid
                }),
                func: "WH_spWareHouse_StrategyActual_PrintDetail_V2",
                API_key: APIKey
            }
            const result = await mainAction.API_spCallServer(params, dispatch);
            await setWaitPrint(Print_Order(listcode, result, results.data !== "" ? JSON.parse(results.data) : []))

        } catch (e) {
            Alerterror("Error,contact IT Netco!");
            console.log(e, "CPN_spOfficer_SendInfoToWMS")
        }



    }
    const Print_Order = async (listcode, data, TMS) => {
        await setHtmlPrint(listcode.map((it, index) => {
            let items = data.find(a => a.ExportCode === it.Code)
            let result = data.filter(a => a.ExportCode === it.Code)
            let dtTMS = TMS.find(a => a.Code === it.Code)
            return (<div className="bill" style={{ width: '720px', height: '1024px', pageBreakAfter: 'always', pageBreakBefore: 'always', border: '1px solid black' }}>
                {
                    dtTMS?.PaymentType === 1 && dtTMS?.COD > 0 ? (
                        <div style={{ position: "absolute", zIndex: 10, opacity: 0.3, marginTop: "35vh", marginLeft: "20vw", fontSize: "100px", fontWeight: 600, transform: "rotate(45deg)", fontFamily: "Arial" }}>COD-TTĐN</div>) : (null)
                }
                {
                    dtTMS?.PaymentType !== 1 && dtTMS?.COD > 0 ? (
                        <div style={{ position: "absolute", zIndex: 10, opacity: 0.4, marginTop: "35vh", marginLeft: "30vw", fontSize: "100px", fontWeight: 600, transform: "rotate(45deg)", fontFamily: "Arial" }}>COD</div>) : (null)
                }
                {
                    dtTMS?.PaymentType === 1 && dtTMS?.COD === 0 ? (
                        <div style={{ position: "absolute", zIndex: 10, opacity: 0.4, marginTop: "35vh", marginLeft: "30vw", fontSize: "100px", fontWeight: 600, transform: "rotate(45deg)", fontFamily: "Arial" }}>TTĐN</div>) : (null)
                }
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
                                <b>BIÊN BẢN GIAO HÀNG</b>
                            </div>
                            <div style={{ padding: "0px 5px", position: "relative", display: "'inline-block'" }}><div class="code" style={{ width: "25%" }} ><Barcode value={items.ExportCode} height="35" /> </div></div>
                            <div>

                                <table style={{ width: '100%' }}>
                                    <tr>
                                        <td style={{ width: '50%', fontSize: '12px', textAlign: 'center', verticalAlign: 'top' }}>
                                            <div> <b>Mã kho</b> </div>
                                            <div> {items.WareHouseCode}</div>

                                        </td>
                                        <td style={{ width: '50%', fontSize: '12px', textAlign: 'center', verticalAlign: 'top' }}>
                                            <div><b> Mã order </b> </div>
                                            <div>
                                                <span style={{ border: '1px solid black', padding: '1px 10px' }}>{items.ExportCode} </span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: '50%', fontSize: '11px', textAlign: 'center', verticalAlign: 'top' }}>
                                            <div> <b> Ngày order</b> </div>
                                            <div> {FormatDateJson(items.CreateTime)}</div>

                                        </td>
                                        <td style={{ width: '50%', fontSize: '11px', textAlign: 'center', verticalAlign: 'top' }}>

                                            <div><b> Ngày in</b></div>
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
                            <b style={{ display: 'inline-block', width: '100px', paddingBottom: '5px' }}><b> Tên kho </b></b>: {(items.WareHouseName)}<br />
                            <b style={{ display: 'inline-block', width: '100px', paddingBottom: '5px' }}><b>Phụ trách </b></b>: {items.CreateName === undefined ? '' : items.CreateName} <br />
                            <b style={{ display: 'inline-block', width: '100px', paddingBottom: '5px' }}><b>Mã PO </b></b>: {items.POcode === undefined ? '' : items.POcode} <br />
                            <b style={{ display: 'inline-block', width: '100px', paddingBottom: '5px' }}><b>Dự kiến giao </b></b>: {FormatDateJson(items.CreateTimeExport)}<br />
                            <b style={{ display: 'inline-block', width: '100px', paddingBottom: '5px' }}><b>SĐT người gửi  </b></b>: {dtTMS?.CustomerPhone}<br />
                            <b style={{ display: 'inline-block', width: '100px', paddingBottom: '5px' }}><b>Tên người gửi  </b></b>: {dtTMS?.CustomerName}<br />
                            <b style={{ display: 'inline-block', width: '100px', paddingBottom: '5px' }}><b>Địa chỉ gửi </b></b>: {dtTMS?.CustomerAddress}<br />
                            <b style={{ display: 'inline-block', width: '100px', paddingBottom: '5px' }}><b>Tỉnh đi </b></b>: {dtTMS?.CitySendCode}<br />
                            <b style={{ display: 'inline-block', width: '100px', paddingBottom: '5px' }}><b>COD </b></b>: {dtTMS?.COD} <br />
                            <b style={{ display: 'inline-block', width: '100px', paddingBottom: '5px' }}><b>Giá lắp đặt </b></b>: {dtTMS?.LDPrice} <br />

                        </td>
                        <td style={{ width: '50%' }}>
                            <b style={{ display: 'inline-block', width: '100px', paddingBottom: '5px' }}><b>Loại thanh toán </b></b> : {dtTMS?.PaymentTypeName} <br />
                            <b style={{ display: 'inline-block', width: '100px', paddingBottom: '5px' }}><b>Tổng số kiện </b></b> : {dtTMS?.Number} <br />
                            <b style={{ display: 'inline-block', width: '100px', paddingBottom: '5px' }}><b>Tổng T.lượng </b></b> : {dtTMS?.Weight} <br />
                            <b style={{ display: 'inline-block', width: '100px', paddingBottom: '5px' }}><b>Tổng K.lượng </b></b> : {dtTMS?.Mass} <br />
                            <b style={{ display: 'inline-block', width: '100px', paddingBottom: '5px' }}><b>Tên người nhận </b></b> : {dtTMS?.RecipientName} <br />
                            <b style={{ display: 'inline-block', width: '100px', paddingBottom: '5px' }}><b>Công ty</b></b> : {dtTMS?.RecipientCompany} <br />
                            <b style={{ display: 'inline-block', width: '100px', paddingBottom: '5px' }}><b>Số điện thoại</b></b> : {dtTMS?.RecipientPhone} <br />
                            <b style={{ display: 'inline-block', width: '100px', paddingBottom: '5px' }}><b>Địa chỉ</b></b> : {dtTMS?.RecipientAddress}<br />
                        </td>
                    </tr>
                </table>
                <table style={{ marginTop: '20px', fontSize: '12px', width: '100%', borderCollapse: 'collapse' }} border="1" cellpadding="4">
                    <thead>
                        <tr>
                            <th>STT.</th>
                            <th>Nhóm SP</th>
                            <th>SKU</th>
                            <th>Tên SP</th>
                            <th>Serial/Imei</th>
                            <th>Số lượng</th>
                            <th>SL thực tế</th>
                        </tr>
                    </thead>
                    <tbody>{
                        result.map((item, index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{item.ProductGroupName}</td>
                                    <td>{item.ProductCode}</td>
                                    <td>{item.ProductName}</td>
                                    <td>{item.Lotnumber}</td>
                                    <td style={{ textAlign: 'center' }}>{item.PackageNumber}</td>
                                    <td></td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                    <tfoot>
                        <tr style={{ height: '35px' }}>
                            <td colspan="5"><b>Tổng</b></td>
                            <td style={{ textAlign: 'center' }}> <b>{FormatNumber(result.reduce((a, i) => a = a + i.PackageNumber, 0))}</b></td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>


                <table style={{ width: '100%', height: '90px', paddingLeft: '5px', fontSize: '12px', borderRight: '1px solid black', borderLeft: '1px solid black', borderBottom: '1px solid black', paddingBottom: '8px' }}>
                    <tr>
                        <td >
                            {/* <div style={{ marginTop: '5px', paddingLeft: '5px', fontSize: '11px', fontStyle: 'italic' }}> 1.Received goods in full quantity and in good condition.</div>
                       <div style={{ marginTop: '5px', paddingLeft: '5px', fontSize: '11px', fontStyle: 'italic' }}> 2.This delivery note is the proof of receipt of goods between the Warehouse and the customer, please sign, specify the name of the consignee & the date of receipt as the basis for consideration of future complaints.</div>
                       <div style={{ marginTop: '5px', paddingLeft: '5px', fontSize: '11px', fontStyle: 'italic' }}> 3.The minutes are made in 2 copies, each party keeps one copy of the same value.</div> */}
                            <div style={{ marginTop: '5px', paddingLeft: '5px', fontSize: '11px', fontStyle: 'italic' }}> 1.Đã nhận được hàng với số lượng đầy đủ và trong tình trạng tốt.</div>
                            <div style={{ marginTop: '5px', paddingLeft: '5px', fontSize: '11px', fontStyle: 'italic' }}> 2.Phiếu xuất kho này là bằng chứng nhận hàng giữa Kho và khách hàng, quý khách vui lòng ký tên, ghi rõ tên người nhận hàng & ngày nhận hàng để làm cơ sở xem xét khiếu nại sau này.</div>
                            <div style={{ marginTop: '5px', paddingLeft: '5px', fontSize: '11px', fontStyle: 'italic' }}> 3.Biên bản được lập thành 2 bản, mỗi bên giữ một bản có giá trị như nhau.</div>
                        </td>
                    </tr>
                </table>
                <table style={{ width: '100%', fontSize: '12px', margintop: '100px', paddingTop: '20px' }} cellspacing="0" cellpadding="5">
                    <tr>
                        <td style={{ textAlign: 'center', width: '50%' }}>
                            <div style={{ marginTop: '15px' }}> Ngày: ....../........./............... </div>
                            <div style={{ marginTop: '5px' }}><b> Người phụ trách </b> </div>
                            <div style={{ fontStyle: 'italic', marginTop: '80px' }}><b>(Ký và ghi rõ họ tên)</b> </div>
                        </td>
                        <td style={{ textAlign: 'center', width: '50%' }}>
                            <div style={{ marginTop: '15px' }}> Ngày: ....../........./............... </div>
                            <div style={{ marginTop: '5px' }}><b>Người nhận</b> </div>
                            <div style={{ fontStyle: 'italic', marginTop: '80px' }}><b>(Ký và ghi rõ họ tên)</b> </div>
                        </td>
                    </tr>
                </table>
            </div>)
        }));
        // setHtmlPrint(Data)
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

    // WH_spWareHouse_StrategyActual_List 
    const WH_spWareHouse_StrategyActual_List = async () => {
        if (Fromdate === '' | Fromdate === null) {
            Alertwarning("Please search from date!")
            // FromdateRef.current.focus();
            return
        }
        if (Todate === '' | Todate === null) {
            Alertwarning("Please search to date!")
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
            debugger
            if (list.length > 0) {
                setDataList(list)
            } else {
                Alertwarning("No data!")
                setExcel([])
                setDateExcel([])
                setDataList([])
            }
        } catch (error) {
            setExcel([])
            setDateExcel([])
            setDataList([])
            Alerterror("Error,contact IT Netco!");
            console.log(error, "WH_spWareHouse_StrategyActual_List")
        }

    }
    const CPN_spLading_Save_V3 = async (obj, obj1, listid) => {
        const params = {
            Json: JSON.stringify({
                ListBill: obj,
                Products: obj1
            }),
            func: "CPN_spLading_Save_V3"
        }
        debugger
        try {
            const result = await Axios.post(
                'https://api-v4-erp.vps.vn/api/ApiMain/API_spCallServer',
                {
                    Json: JSON.stringify({
                        ListBill: obj,
                        Products: obj1
                    }),
                    func: "CPN_spLading_Save_V3",
                    API_key: "netcoApikey2025",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            debugger
            let dt = JSON.parse(result.data)
            if (dt.Status == "Thành Công !") {
                setIsLoad(1)
                Alertsuccess(dt.Status + ' TotalLading: ' + dt.TotalLading + ' LadingCode: ' + dt.LadingCode);
                WH_spWareHouse_UpdateIsCreateBill(listid)
                return
            }
        } catch (e) {
            setIsLoad(1)
            Alerterror("Error,contact IT Netco!");
            console.log(e, "CPN_spLading_Save_V3")
        }
    }
    const CPN_spLading_Upload_Excel = async (obj, obj1, listid) => {
        const params = {
            Json: JSON.stringify({
                ListBill: obj,
                Products: obj1
            }),
            func: "CPN_spLading_Upload_Excel_V3"
        }
        debugger
        try {
            const result = await Axios.post(
                'https://api-v4-erp.vps.vn/api/ApiMain/API_spCallServer',
                {
                    Json: JSON.stringify({
                        ListBill: obj,
                        Products: obj1
                    }),
                    func: "CPN_spLading_Upload_Excel_V3",
                    API_key: "netcoApikey2025",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            debugger
            let dt = JSON.parse(result.data)
            if (dt[0].Status == "Error") {
                Alertwarning(result[0].ReturnMess);
                setIsLoad(1)
                return
            }
            CPN_spLading_Save_V3(JSON.parse(dt[0].ListBill), JSON.parse(dt[0].ListProduct), listid)

        } catch (e) {
            Alerterror("Error,contact IT Netco!");
            console.log(e, "CPN_spLading_Upload_Excel_V3")
            setIsLoad(1)
        }
    }
    const CPN_spLading_CreateCode_V3 = async (main, detail, listid) => {
        try {
            const params = {
                Json: JSON.stringify({
                    ListBill: main,
                    Products: detail
                }),
                func: "CPN_spLading_CreateCode_V3",
                API_key: "netcoApikey2025"
            }
            // const list = await mainAction.API_spCallServerTMS(params, dispatch);
            debugger
            const list = await Axios.post(
                'https://api-v4-erp.vps.vn/api/ApiMain/API_spCallServer',
                {
                    Json: JSON.stringify({
                        ListBill: main,
                        Products: detail
                    }),
                    func: "CPN_spLading_CreateCode_V3",
                    API_key: "netcoApikey2025",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            let dt = JSON.parse(list.data)
            if (dt[0].ListJsonNotOke !== undefined & dt[0].ListJsonNotOke !== '{}') {
                console.log(JSON.parse(dt[0].ListJsonNotOke), "ListJsonNotOke")
                Alertwarning("Invalid data!")
                setIsLoad(1)
            } else {
                CPN_spLading_Upload_Excel(JSON.parse(dt[0].ListJsonOke), JSON.parse(dt[0].Products), listid);
                console.log(JSON.parse(dt[0].ListJsonOke), "ListJsonOke")
                console.log(JSON.parse(dt[0].Products), "Products")
            }
        } catch (error) {
            Alerterror("Error,contact IT Netco!");
            console.log(error, "CPN_spLading_CreateCode_V3")
            setIsLoad(1)
        }

    }
    const CreatBill = async () => {
        try {
            setIsLoad(0)
            debugger
            let data = DataList.filter(a => a.IsCheck === true)
            if (data.length <= 0) {
                Alertwarning("Please select the line to operate !")
                return
            }
            let _ar = []
            data.forEach((i, k) => {
                _ar.push({
                    AccountId: GetDataFromLogin("AcountId"),
                    Id: i.Id,
                    Keys: 0
                })
            })
            const params = {
                Json: JSON.stringify({
                    ListId: _ar
                }),
                func: "WH_spWareHouse_ListCreateBill",
                API_key: APIKey
            }
            const list = await mainAction.API_spCallServer(params, dispatch);
            if (list.Status === 'NO') {
                Alertwarning('Bill already exists ' + list.ReturnMess)
                setIsLoad(1)
                return
            }
            if (list.DataDetail.length > 0) {
                let arrmain = [], arrdetail = [], listserri = '';
                list.DataMain.forEach((i, k) => {
                    // listserri = ''
                    // if (list.DataDetail.filter(a => a.ExportCode === i.Code & a.Lotnumber !== '').length > 0) {
                    //     list.DataDetail.filter(a => a.ExportCode === i.Code & a.Lotnumber !== '').forEach(a => {
                    //         listserri = listserri + a.Lotnumber + ';'
                    //     });
                    // }
                    arrmain.push({
                        //#region 
                        STT: (k + 1),
                        Code: i.Code, //Mã vận đơn
                        PartnerCode: "", //Mã đối tác
                        CustomerCode: i.CustomerCodeTMS, //Mã KH   "SGN00006",//
                        AddressCode: "", //Mã địa chỉ
                        RecipientAddress: i.RecipientAddress, //Địa chỉ nhận
                        CityRecipientNameTo: i.ProvinceName, //Tên tỉnh đến
                        DistrictNameTo: i.DistrictName, //huyện đến
                        WardsNameTo: i.WardName, //tên phường xã
                        RecipientName: i.RecipientName, //Tên người nhận
                        RecipientPhone: i.RecipientPhone, //Số điện thoại nhận
                        RecipientCompany: i.Recipientcompany, //tên cty nhận
                        ServiceCode: i.ServiceCode, //Mã dịch vụ
                        PaymentType: i.Payment, //Hình thức thanh toán
                        Weight: i.Weight, //trọng lượng
                        Mass: i.Mass, //Số khối
                        Number: i.PackageNumberTMS, //Số kiện
                        Length: "", //Dài
                        Height: "", //Rộng
                        Width: "", //Cao
                        THBB: i.Recallrecords, //Thu hồi biên bản
                        BP: i.Delivery, //Báp phát
                        Pack: "", //đóng gói
                        HD: "", //Hóa đơn
                        COD: i.COD, //Tiền COD
                        HHKG: "", //Tiền khai giá
                        NPDK: "", //Nhận phát đồng kiểm
                        PTT: "", //Phát tận tay
                        HQK: "", //Hàng quá khổ
                        PST: "", //Phát siêu thị
                        PDPQ: "", //Phát đảo phú quốc
                        OnSiteDeliveryPrice: "", //Phần trăm ngoại tuyến
                        Discount: "", //Phần trăm giảm giá
                        CustomerName_Reality: i.Senderreallyname, //Tên ng gửi thực tế
                        CustomerAddress_Reality: i.Addresssenderreally, //Đ / C người gửi thực tế
                        CustomerPhone_Reality: i.Senderphone, //Số ĐT người gửi thực tế
                        ProductName: i.ProductName, //Tên sản phẩm
                        ProductCode: i.ProductCode, //Mã sản phẩm
                        ProductDescription: "", //Nội dung sản phẩm
                        Quanlity: i.TotalProduct, //Số lượng sản phẩm
                        CodeProvider: "",
                        Description: i.Description, //Nội dung mô tả,đã bỏ phần nối mã seri bằng dấu ;
                        Noted: i.Note, //Ghi chú
                        TypeLading: 17, //Key check tạo vận đơn
                        OfficerID: InfoTMS.OfficerID === undefined ? null : InfoTMS.OfficerID,//id ng tạo
                        OfficerName: InfoTMS.OfficerName === undefined ? null : InfoTMS.OfficerName,//tên ng tạo
                        PostOffceId: InfoTMS.PostOfficeId === undefined ? 0 : InfoTMS.PostOfficeId//pos ng tạo
                        //#endregion
                    })

                })
                list.DataDetail.forEach((i, k) => {
                    arrdetail.push({
                        //#region 
                        STT: (k + 1),
                        Code: i.ExportCode,
                        CodeProvider: "",
                        ProductCode: i.ProductCode,
                        Quanlity: i.PackageNumber,
                        ProductDescription: "",
                        ProductName: i.ProductName,
                        STTProduct: (k + 1)
                        //#endregion
                    })
                })
                let listid = []
                list.DataMain.forEach((i, k) => {
                    listid.push({
                        AccountId: GetDataFromLogin("AccountId"),
                        Id: i.Id
                    })
                })

                CPN_spLading_CreateCode_V3(arrmain, arrdetail, listid)

            } else {
                Alertwarning("No data result !")
                setIsLoad(1)
            }
        } catch (error) {
            Alerterror("Error,contact IT Netco!");
            setIsLoad(1)
            console.log(error, "WH_spWareHouse_StrategyActual_List")
        }

    }
    //UPDATE TRẠNG THÁI TẠO BILL
    const WH_spWareHouse_UpdateIsCreateBill = async (listid) => {
        try {
            //1 list id
            debugger
            const params = {
                Json: JSON.stringify({
                    ListId: listid
                }),
                func: "WH_spWareHouse_UpdateIsCreateBill",
                API_key: APIKey
            }
            const result = await mainAction.API_spCallServer(params, dispatch);
            console.log(result, "WH_spWareHouse_UpdateIsCreateBill result")
        } catch (error) {
            Alerterror("Error,contact IT Netco!");
            console.log(error, "WH_spWareHouse_UpdateIsCreateBill")
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
            Alerterror("Error,contact IT Netco!");
            console.log(error, "WH_spWareHouse_Strategy_AutoArrange")
        }

    }
    const CheckOne = (Id, Check) => {
        let _DataList = [...DataList]
        if (Id == 0) {
            _DataList.forEach(i => {
                i.IsCheck = !Checkall;
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
                let dataflase = DataList.filter(a => a.IsCheck === true && a.Status !== 'Mới tạo')
                let data = DataList.filter(a => a.IsCheck === true)
                if (dataflase.length > 0) {
                    Alertwarning('Please check rows is "Mới tạo" to delete !')
                    return
                }
                if (data.length === 0) {
                    Alertwarning('Please check row to delete !')
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
            ConfirmAlert("Delete", "Are you sure ?", async () => {
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
            Alerterror("Error,contact IT Netco!");
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
            Alerterror("Error,contact IT Netco!");
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
            Alerterror("Error,contact IT Netco!");
            console.log(error, "WH_spWareHouse_Arrange_Detail")
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
        // document.querySelector("#tab_1").click();
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
            Alerterror("Error,contact IT Netco!");
            console.log(error, "WH_spWareHouse_StrategyActual_DetailList")
        }

    }
    const Exportexcel = () => {
        debugger
        const newData = DataList.map(element => {
            return {
                'Status': element.Status,
                // 'Loại': element.TypeTransport,
                //'Mã chiến lược': element.StrategyCode,
                'Outbound Code': element.Code,
                'Customer Name': element.CustomerName,
                'Staff Name 1': element.StaffName1,
                'Staff Name 2': element.StaffName2,
                'Staff Name 3': element.StaffName3,
                'TotalProduct': element.TotalProduct,
                'PO code': element.POcode,
                'Recipient Name': element.RecipientName,
                'Recipient Phone': element.RecipientPhone,
                // 'Recipient Address': element.RecipientAddress,
                // 'Recipient Company': element.RecipientCompany,
                // 'Nhà cung cấp': element.ProviderName,
                // 'Người phụ trách': element.CuratorName,
                'Name Vehicle': element.NameVehicle,
                'Driver Name': element.DriverName,
                'StrategyT ime': FormatDateJson(element.StrategyTime),
                'Area': element.Name,
                'Ware HouseName': element.WareHouseName,
                // 'KV xuất': element.Name,
                // 'Kho xuất': element.WareHouseName,
                // 'KV nhập': element.NameTo,
                // 'Kho nhập': element.WareHouseNameTo,
                'Note': element.Note,
                'Create Name': element.CreateName,
                'Create Time': FormatDateJson(element.CreateTime),
                'Edit Name': element.EditName,
                'Edit Time': FormatDateJson(element.EditTime)
            }
        })
        ExportExcel(newData, Function.Name);
    }
    const viewImageInTable = (e) => {
        setModalImg({ ProductName: e.ProductName, Image: e.Image })
    }
    const columns = [
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
                            CheckOne(0, Checkall)
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
                            // disabled={row.original.WaybillCode === undefined ? false : true}
                            onChange={e => {
                                CheckOne(row.original.Id, row.original.IsCheck)
                            }}
                        />
                        <label className="label checkbox" htmlFor={row.original.Id}></label>
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
            width: 180,
            textAlign: "center",
            key: 'Id',
            Cell: (row) => (
                <span>
                    <button key={row.index + 1}
                        data-tooltip="Detail"
                        className="btn btn-sm btn-info mr-2 show__tip__left"
                        data-toggle="modal" data-target="#myModal"
                        onClick={e => WH_spWareHouse_StrategyActual_DetailList(row)}
                    >
                        <i className="fa-solid fa-eye"></i>
                    </button>
                    {
                        <button key={row.index + 4}
                            data-tooltip="Print"
                            className="btn btn-sm btn-primary mr-2 show__tip__left"
                            onClick={(e) => PrintDetail(row.original.Id, row.original.Code)}
                        >
                            <i className="fa fa-print"></i>
                        </button>
                    }
                    {
                        row.original.Status === 'Mới tạo' ?
                            <button key={row.index + 3}
                                data-tooltip="Xoá"
                                className="btn btn-sm btn-danger mr-2 show__tip__right"
                                onClick={(a) => WH_spWareHouse_StrategyActual_Delete(row.value)}
                            >
                                <i className="fa fa-trash"></i>
                            </button> : ""
                    }
                    {
                        row.original.StatusCode === 5 & row.original.WaybillCode === undefined ?
                            <button key={row.index + 5}
                                data-tooltip="Sửa"
                                data-toggle="modal" data-target="#modal3"
                                className="btn btn-sm btn-warning mr-2 show__tip__right"
                                onClick={(a) => { setOutboundCode(row.original.Code); setOutboundId(row.original.Id) }}
                            >
                                <i className="fa fa-edit"></i>
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
            Header: "Status",
            accessor: 'Status',
            width: 180,
            Cell: (obj) => {
                if (obj.original.StatusCode === 0) {
                    return <label className="btn labelradius10px" style={{ backgroundColor: "#ffc1071f", color: "#ffc107" }}>{obj.value}</label>
                }
                if (obj.original.StatusCode === 1) {
                    return <label className="btn labelradius10px" style={{ backgroundColor: "#F1FFFD", color: "#127D58" }}>{obj.value}</label>
                }
                if (obj.original.StatusCode === 2) {
                    return <label className="btn labelradius10px" style={{ backgroundColor: "#3498db26", color: "#3498db" }}>{obj.value}</label>
                }
                if (obj.original.StatusCode === 3) {
                    return <label className="btn labelradius10px" style={{ backgroundColor: "#bb86fc2e", color: "#8d5dc9" }}>{obj.value}</label>
                }
                if (obj.original.StatusCode === 4) {
                    return <label className="btn labelradius10px" style={{ backgroundColor: "#e74c3c2e", color: "#e74c3c" }}>{obj.value}</label>
                }
                if (obj.original.StatusCode === 5) {
                    return <label className="btn labelradius10px" style={{ backgroundColor: "#07bc0c17", color: "#07bc0c" }}>{obj.value}</label>
                }
                if (obj.original.StatusCode === 6) {
                    return <label className="btn labelradius10px" style={{ backgroundColor: "#3498db38", color: "#0777c3" }}>{obj.value}</label>
                }
                if (obj.original.StatusCode === 7) {
                    return <label className="btn labelradius10px" style={{ backgroundColor: "#fd7e141a", color: "#fd7e14" }}>{obj.value}</label>
                }
            }
        },
        {
            Header: "Outbound Code",
            accessor: 'Code',
            width: 180

        },
        {
            Header: "Waybill Code",
            accessor: "WaybillCode",
            width: 180
        },
        {
            Header: "Customer Code",
            accessor: "CustomerCode",
            width: 180
        },
        {
            Header: "Total Product",
            accessor: "TotalProduct",
            width: 180
        },
        {
            Header: "Total Weight",
            accessor: "TotalWeight",
            width: 180
        },
        {
            Header: "Name Vehicle",
            accessor: "NameVehicle",
            width: 180,
            show: false,
        },
        {
            Header: "Driver Name",
            accessor: "DriverName",
            width: 180,
            show: false,
        },
        {
            Header: "PO code",
            accessor: "POcode",
            width: 180
        },
        {
            Header: "Province",
            accessor: "ProvinceName",
            width: 180
        },
        {
            Header: "District",
            accessor: "DistrictName",
            width: 180
        },
        {
            Header: "Ward",
            accessor: "WardName",
            width: 180
        },
        {
            Header: "Recipient Address",
            accessor: "RecipientAddress",
            width: 180
        },
        {
            Header: "Recipient Name",
            accessor: "RecipientName",
            width: 180
        },
        {
            Header: "Recipient Phone",
            accessor: "RecipientPhone",
            width: 180
        },
        {
            Header: "Plan Time",
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
        }, {
            Header: "WareHouse Name",//
            accessor: "WareHouseName",
            show: true,
            keys: 2,
            special: true
        }, {
            Header: "Ghi chú",
            accessor: "Note",
            width: 180
        }, {
            Header: "Create Name",
            accessor: "CreateName",
            width: 180
        }, {
            Header: "Create Time",
            accessor: "CreateTime",
            Cell: (obj) => FormatDateJson(obj.value),
            width: 180
        }, {
            Header: "Edit Name",
            accessor: "EditName",
            width: 180
        }, {
            Header: "Edit Time",
            accessor: "EditTime",
            width: 180,
            Cell: (obj) => FormatDateJson(obj.value)
        },
        {
            Header: "Staff Name 1",
            accessor: "StaffName1",
            width: 180
        },
        {
            Header: "Staff Name 2",
            accessor: "StaffName2",
            width: 180
        },
        {
            Header: "Staff Name 3",
            accessor: "StaffName3",
            width: 180
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
    const columnsDetail = [
        // {
        //     Header: 'Options',
        //     accessor: 'ProductId',
        //     show: true,
        //     filterable: false,
        //     sortable: false,
        //     width: 180,
        //     textAlign: "center",
        //     Cell: (row) => (
        //         <span>
        //             <button key={row.index + 1}
        //                 data-tooltip="Detail"
        //                 className="btn btn-sm btn-info mr-2 show__tip__left"
        //                 onClick={e => WH_spWareHouse_Arrange_Detail(row.value, row)}
        //             >
        //                 <i className="fa-solid fa-eye"></i>
        //             </button>
        //         </span>)
        // },
        {
            Header: I18n.t('Report.STT'),
            filterable: false,
            sortable: false,
            Cell: (row) => <span>{row.index + 1}</span>
        },
        {
            Header: "Product Group Name",
            accessor: 'ProductGroupName',

        },
        {
            Header: "Product Code",
            accessor: 'ProductCode',

        },
        {
            Header: "Image",
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
                        title="Click to view Image"
                    >
                        {row.original.Image !== undefined ? <img src={row.original.Image} height="30" width="50" /> : ""}
                    </a>
                </div>
            )
        },
        {
            Header: "Product Packaging Name",
            accessor: "ProductPackagingName",
        },
        {
            Header: "Package Number",
            accessor: "PackageNumber",
        }, {
            Header: "Total Staff Finished",
            accessor: "TotalStaffFinished",
        }, {
            Header: "Serial/Imei",
            accessor: "Lotnumber",
        }, {
            Header: "Status date",
            accessor: "Statusdate"
        }

    ];

    const columnsDetailCheck = [
        {
            Header: 'Options',
            accessor: 'ProductId',
            show: true,
            // filterable: false,
            // sortable: false,
            width: 180,
            textAlign: "center",
            Cell: (row) => (
                <span>
                    <button key={row.index + 1}
                        data-tooltip="Detail"
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
            Header: "Product Group Name",
            accessor: 'ProductGroupName',

        },
        {
            Header: "Product Code",
            accessor: 'ProductCode',

        },
        {
            Header: "Image",
            accessor: "Image",
            Cell: (row) => <img src={row.value} width="48" />
        },
        {
            Header: "Product Packaging Name",
            accessor: "ProductPackagingName",
        },
        {
            Header: "Package Number",
            accessor: "PackageNumber",
        },
        {
            Header: "Expected Number",
            accessor: 'ExpectedNumber',

        }, {
            Header: "Total Staff Finished",
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
            Header: "Create Name",
            accessor: 'CreateName',
        },
        {
            Header: "Expected Number",
            accessor: 'ExpectedNumber',

        },
        {
            Header: "Scan Time",
            accessor: "ScanTime",
            Cell: (obj) => FormatDateJson(obj.value)
        },
        {
            Header: "Ware House Name",
            accessor: "WareHouseName",
        },
        {
            Header: "Ware House Area Name",
            accessor: "WareHouseAreaName",
        }, {
            Header: "Shelves Name ",
            accessor: "ShelvesName",
        }, {
            Header: "Floor Name ",
            accessor: "FloorName",
        }, {
            Header: "Location",
            accessor: "LocationName",
        }, {
            Header: "Actual Number",
            accessor: "ActualNumber",
        }

    ];
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
                                    Detail {Title.code}
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
                                <span className="col-md-6"> <i className="fa-solid fa-circle icon-red"></i> Total product: <span className="green">{Title.number}</span></span>
                                <span className="col-md-6"> <i className="fa-solid fa-circle icon-red"></i> Success: <span className="green"></span></span>
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
                                            <i className="fa fa-undo" /> Return
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
    //#endregion

    //#region Cập nhật waybill cho phiếu xuất kho
    const OutboundUpdateWaybill = async () => {
        if (WaybillCode === "") {
            Alertwarning("Please input the waybill code!")
            return;
        }
        try {
            const params = {
                Json: JSON.stringify({
                    WaybillCode: WaybillCode,
                    ExportId: OutboundId,
                    CreaterId: GetDataFromLogin("AccountId")
                }),
                func: "WH_spWareHouse_StrategyActual_UpdateWaybill",
                API_key: APIKey
            }
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === 0) {
                let list = [...DataList]
                list.find(p => p.Id === OutboundId).StatusCode = 6;
                list.find(p => p.Id === OutboundId).Status = "Hoàn tất";
                setDataList(list);
                Alertsuccess("Success !")
            }
            else {
                Alertwarning("Lỗi dữ liệu chi tiết!")
            }
            setdisable(false)
        } catch (error) {
            Alerterror("Error,contact IT Netco!");
            console.log(error, "WH_spWareHouse_StrategyActual_UpdateWaybill")
        }

    }

    const EditWaybill = (
        <div class="modal fade" id="modal3" tabindex="-1" role="dialog" aria-labelledby="modal3" aria-hidden="true" >
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <div className="row edit__user__header">
                            <h4 className="">
                                <i className="fa fa-edit mr-2"></i>
                                ADD WAYBILL {OutboundCode}
                            </h4>
                            <a className="btn btn__default" data-dismiss="modal">
                                <i className="fa fa-times-circle edit__close__icon" />
                            </a>
                        </div>
                    </div>
                    <div class="modal-body">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label className="form__title" >Waybill code</label>
                                <input type="text" className="form-control" value={WaybillCode} onChange={(e) => setWaybillCode(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-12 text-center">
                            <button type="button" className="btn btn-danger btn-sm" onClick={(e) => { OutboundUpdateWaybill() }}>{I18n.t("System.Save")}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    //#endregion

    return (
        <div className="content-wrapper pt-2 small">
            <section className="content">
                <div className="container-fluid">
                    <div className="card card-primary">
                        <div className="body-padding">
                            <div className="tab-content" id="custom-tabs-two-tabContent">
                                <div className="tab-pane fade show active" role="tabpanel" aria-labelledby="custom-tabs-two-profile-tab">
                                    <div className="card-header">
                                        {IsLoad === 0 && <Loading />}
                                        <div className="row" >
                                            <div className="col-sm-12 col-md-6">
                                                <div className="dropdown">
                                                    <h3 className="dropbtn"><i class="fa-solid fa-bars"></i> List OutBound ({DataList.length})</h3>
                                                    {/* <div className="dropdown-content">
                                                        {dropdown}
                                                    </div> */}
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <button type="button" className="btn btn-danger btn-xs float-right height35 margin-left-5"
                                                    onClick={e =>
                                                        WH_spWareHouse_StrategyActual_Delete(-1)
                                                    }
                                                >
                                                    <i className="fa fa-trash" /> Delete
                                                </button>
                                                <button className="btn btn-warning btn-xs float-right height35 margin-left-5"
                                                    onClick={e => Exportexcel(e)}
                                                >
                                                    <i className="fa fa-download mr-2" />
                                                    {I18n.t("System.Excel")}
                                                </button>
                                                <button type="button" className="btn btn-primary btn-xs float-right height35 margin-left-5"
                                                    onClick={a => PrintDetail()}
                                                >
                                                    <i className="fa fa-print mr-2 " />
                                                    Print
                                                </button>
                                                <button type="button" className="btn btn-success btn-xs float-right  margin-left-5 height35"
                                                    onClick={e =>
                                                        WH_spWareHouse_StrategyActual_List(e)
                                                    }>
                                                    <i className="fa-solid fa-eye" /> View
                                                </button>


                                            </div>
                                        </div>
                                    </div>
                                    <div className="">
                                        <div className="row col-md-12 mt-3">
                                            <div className="col-md-3 margin-top-3">
                                                <div className="form-group">
                                                    <label className="form__title" >From date <span className="form__title__note">(*)</span></label>
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
                                                    <label className="form__title" >To date <span className="form__title__note">(*)</span></label>
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
                                                    <label className="form__title" >Outbound Code </label>
                                                    <input type="text" className="form-control" value={Code} onChange={a => setCode(a.target.value.trim())} />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="form__title" >Customer ID </label>
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
                                                    <label className="form__title" >Warehouse ID</label>
                                                    <SelectWarehouse
                                                        onSelected={e => setWareHouseId(e)}
                                                        items={WareHouseId.value}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="form__title" >Putaway staff</label>
                                                    <SelectAccount
                                                        onSelected={e => setStaffId(e)}
                                                        items={StaffId.value}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="form__title" >Planned time</label>
                                                    <DateTimePicker className="form-control"
                                                        onChange={date => setCreateTime(date)}
                                                        value={CreateTime}
                                                        format='MM/dd/yyyy'
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="form__title" >Status</label>
                                                    <Select
                                                        value={StatusId}
                                                        onChange={a => setStatusId(a)}
                                                        options={Status}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="form__title" >Creater ID</label>
                                                    <SelectAccount
                                                        onSelected={e => setCreateId(e)}
                                                        items={CreateId.value}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="barcodeTarget" className="display-none">
                                        {HtmlPrint}
                                    </div>
                                    <div className={DataList.length > 0 ? "margin-bottom-40" : "display-none"}>
                                        <DataTable
                                            data={DataList}
                                            columns={columns}
                                        />
                                    </div>
                                    {HtmlDetail}
                                    {ViewImgDetail}
                                    {EditWaybill}
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </section >
        </div >
    );

}