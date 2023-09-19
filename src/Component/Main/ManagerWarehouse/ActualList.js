import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import I18n from '../../../Language'
import { APIKey } from '../../../Services/Api';
import Select from 'react-select';
import DateTimePicker from 'react-datetime-picker';
import $, { parseJSON } from "jquery";
import { SelectArea, SettingColumn, SelectAccount, SelectCustomer, SelectWarehouseContract, SelectWarehouse, SelectVehicle, DataTable, SelectCurator, SelectProvider } from '../../../Common';
import { mainAction } from '../../../Redux/Actions'
import { Alertwarning, Alertsuccess, Alerterror, GetDataFromLogin, FormatDateJson, FirstOrLastDayinMonth, FormatNumber, ExportExcel, ConfirmAlert, DateDiff, RegEpxPhoneVN } from "../../../Utils";
import { formatNumber } from "canvasjs-react-charts/canvasjs.min";

export const ActualList = () => {

    //#region Khai báo biến
    const dispatch = useDispatch();
    const [IsAcctive2, setIsAcctive2] = useState(true);
    const [CustomerContractData, setCustomerContractData] = useState([])
    const [InventoryData1, setInventoryData1] = useState([])
    const [InventoryData2, setInventoryData2] = useState([])
    const [Checkall, setCheckall] = useState(false);
    const [RecipientAddress, setRecipientAddress] = useState();
    const [RecipientPhone, setRecipientPhone] = useState();
    const RecipientPhoneRef = useRef();
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
    const [Status, setStatus] = useState([{ value: -1, label: 'Please search' }, { value: 0, label: 'Mới tạo' }, { value: 1, label: 'Đang tiến hành' }, { value: 2, label: 'Hoàn tất' }]);
    const [StatusId, setStatusId] = useState({ value: -1, label: 'Please search' });
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
    const [Function, setFunction] = useState({ Id: 2, _funcsave: 'WH_spWareHouse_Export_Save', Name: 'Outbound OPERATION' });
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

    const [OutboundCode, setOutboundCode] = useState("");
    const [OutboundId, setOutboundId] = useState(0);
    const [WaybillCode, setWaybillCode] = useState("");
    const WaybillRef = useRef();

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
        } else if (dataarray.keys === 'print') {
            PrintDetail(dataarray._row.value)
        }
    }, [dataarray]);

    //close choise
    $('body').on("click", function (event) {
        setIsAcctive(false)
    })

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
        setCustomerContractData([])
        setRecipientAddress("");
        setRecipientPhone("");
        setRecipientName("");
        setRecipientCompany("");
    }

    //print
    const PrintDetail = async (row) => {
        const params = {
            Json: JSON.stringify({
                Id: row,
                AccountId: GetDataFromLogin("AccountId"),
                Keys: Function.Id,
                Type: 2 //1 -- chien luoc 2 thực tế
            }),
            func: "WH_spWareHouse_StrategyActual_DetailList",
            API_key: APIKey
        }
        const result = await mainAction.API_spCallServer(params, dispatch);
        let _htmlprint = (
            `<div className="bill" style="width:720px;height: 1024px;page-break-before: always;page-Break-After: always; border:1px solid black">
                             
                                 <table style="width:100%;height: 175px;font-weight:600;border-top: 1px solid black;border-bottom: 1px solid black;text-align:center;padding-top: 15px;">
                                     <tr>
                                         <td style="width:40%;vertical-align:top;">
                                            <img src="https://admin-netco.vps.vn//Image/ckfinder/files/logoNew.png" style="width: 254px;height:70px;margin-left:-10px"/>
                                            <div style="font-Size: 10px; margin-Top: 23px"> CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ CHUYỂN PHÁT NHANH NỘI BÀI</div>
                                            <div style="font-Size: 9px;font-Style: italic; margin-Top: 5px; margin-Bottom: 10px;width:270px"> Address (Headquarters): Tầng 8, Khối B, Tòa nhà Sông Đà, đường Phạm Hùng, Phường Mỹ Đình 1, Quận Nam Từ Liêm, TP Hà Nội</div>

                                            <span style="font-Size: 9px; font-Style: italic; padding-Right: 35px">
                                                Hotline : 19006463 - 024 38 356 356
                                            </span>

                                            <span style="font-Size: 9px; font-Style: italic">
                                                Email : info@netco.com.vn
                                            </span>
                                         </td>
                                         <td style="width:60%;vertical-align:top;margin-right: 1px;text-alin">
                                            <div style="font-size:20px; margin-bottom:10px">
                                               <b>ORDER </b>
                                            </div>
                                            <div style="width: 100%;position: relative;display:inline-block;height:70px;margin-bottom: 5px;text-align:center">
                                                <div style="font-family: 'Libre Barcode 128 Text';font-size: 60px;font-weight:200">${result[0].ExportCode}
                                                </div>
                                            </div>
                                         <div>

                                         <table style="width:100%">
                                                <tr>
                                                    <td style="width:50%;font-Size: 12px; text-Align: center;vertical-align:top;">
                                                       <div> <b>WareHouse Code</b> </div>
                                                       <div> ${result[0].WareHouseCode}</div>
                                                       
                                                    </td>
                                                    <td style="width:50%;font-Size: 12px; text-Align :center;vertical-align:top;">
                                                      
                                                    <div><b> Order Code </b> </div>
                                                       <div> <span style='border: 1px solid black;padding: 1px 10px;'><b>${result[0].ExportCode} <span></div>
                                                    </td>
                                                   
                                                </tr>
                                                <tr>
                                                <td style="width:50%;font-Size: 11px; text-Align: center;vertical-align:top;">
                                                   <div> <b> Order Date</b> </div>
                                                   <div> ${FormatDateJson(result[0].CreateTime)}</div>
                                                   
                                                </td>
                                                <td style="width:50%;font-Size: 11px; text-Align :center;vertical-align:top;">
                                                  
                                                <div><b> Print Date</b></div>
                                                   <div> ${FormatDateJson(new Date())}</div>
                                                </td>
                                               
                                            </tr>
                                            </table>
                                         </div> 
                                            
                                            
                                         </td>
                                   
                                     </tr>
                                 </table>
                                 <table style="width:100%;font-size:12px; padding:10px 0px" cellspacing="0" cellpadding="5">
                                     <tr>
                                         
                                         <td colspan="" >
                                             <b style="display: inline-block;width:100px ;padding-bottom: 5px;"><b> WareHouse Name </b></b>: ${(result[0].WareHouseName)}<br />   
                                             <b style="display: inline-block;width:100px;padding-bottom: 5px;"><b>Prepare by </b></b> : ${result[0].CreateName === undefined ? '' : result[0].CreateName} <br />           
                                             <b style="display: inline-block;width:100px;padding-bottom: 5px;"><b>Code PO </b></b> : ${result[0].POcode === undefined ? '' : result[0].POcode} <br />           
                                             <b style="display: inline-block;width:100px ;padding-bottom: 5px;"><b>Planned time </b></b>: ${FormatDateJson(result[0].CreateTimeExport)}<br />   
                                             
                                         </td> 
                                         <td colspan="">  
                                             <b style="display: inline-block;width:100px;padding-bottom: 5px;"><b>Recceiver's name </b></b> : ${result[0].RecipientName === undefined ? '' : result[0].RecipientName} <br />           
                                             <b style="display: inline-block;width:100px;padding-bottom: 5px;"><b>Company</b></b> : ${result[0].RecipientCompany === undefined ? '' : result[0].RecipientCompany} <br />               
                                             <b style="display: inline-block;width:100px ;padding-bottom: 5px;"><b>Phone</b></b> : ${result[0].RecipientPhone === undefined ? '' : result[0].RecipientPhone} <br />  
                                             <b style="display: inline-block;width:100px ;padding-bottom: 5px;"><b>Address</b></b> : ${result[0].RecipientAddress === undefined ? '' : result[0].RecipientAddress} <br />    
                                         </td>
                                     </tr>        
                                     </table>
                                                                                               
                                     <table style="margin-top: 20px;font-size:12px; width:100%; border-collapse: collapse;" border="1" cellpadding="4">
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
 
                                         <tbody>${PrintHTML(result)}</tbody>
                                         <tfoot>
                                             <tr style="height:35px">
                                             <td colspan="5"><b>Total</b></td>
                                             <td style='text-align:center'> <b>${FormatNumber(result.reduce((a, v) => a = a + v.PackageNumber, 0))}</b></td>
                                             <td style='text-align:center'>
                                            <b> ${FormatNumber((result.reduce((a, v) => a = a + v.TotalWeight, 0), 0))}</b>
                                             </td>
                                             </tr>
                                         </tfoot>
                                     </table>
                                     <table style=" width: 100%;height: 90px; padding-Left:5px; font-Size: 12px; border-Right: 1px solid black, border-Left: 1px solid black; border-Bottom: 1px solid black;padding-Bottom: 8px">
                                     <tr>
                                         <td >
                                             <div style="margin-Top: 5px; padding-Left: 5px; fontSize:11px;font-Style: italic"> 1.Received goods in full quantity and in good condition.</div>
                                             <div style="margin-Top: 5px; padding-Left: 5px; fontSize:11px;font-Style: italic"> 2.This delivery note is the proof of receipt of goods between the Warehouse and the customer, please sign, specify the name of the consignee & the date of receipt as the basis for consideration of future complaints.</div>
                                         </td>
                 
                                     </tr>
                                 </table>
                                 <table style="width:100%;font-size:12px" style="margintop:100px; padding-top:20px" cellspacing="0" cellpadding="5">    
                                     <tr>
                                         <td style="text-align:center;width:50%;">
                                            <div style='margin-top:15px'> Date: ....../........./............... </div>
                                            <div style='margin-top:5px'><b> Prepare by <b> </div>
                                            <div style='font-Style: italic;margin-top:80px'><b>(Sign and write full name)</b> </div>
                                         </td>
                                         <td style="text-align:center;width:50%;">
                                            <div style='margin-top:15px'> Date: ....../........./............... </div>
                                            <div  style='margin-top:5px'><b>Received by</b> </div>
                                            <div style='font-Style: italic;margin-top:80px'><b>(Sign and write full name)</b> </div>
                                         </td>
                                        
                                     </tr>
                                 </table>
                             </div>`
        );
       
        let myWindow = window.open("", "_blank");
        myWindow.document.write('<html><link href="https://fonts.googleapis.com/css?family=Libre Barcode 128 Text" rel="stylesheet"><body style="margin:0">' + _htmlprint + '</body><script type="text/javascript">window.focus();setTimeout(function() { window.print();window.close(); }, 1000);</script></html>');/*  */




    }
    const PrintHTML = (result) => {
        let rt = '';
        result.map((item, index) => {
            rt +=
                `<tr>
                <td>${index + 1}</td>
                <td>${item.ProductGroupName}</td>
                <td>${item.ProductCode}</td>
                <td>${item.ProductName}</td>
                <td>${item.Lotnumber}</td>
                <td style='text-align:center'>${item.PackageNumber}</td>
                <td style='text-align:center'>${FormatNumber(item.TotalWeight,0)}</td>
            </tr>`
        });
        return rt
      
    };

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
            debugger
            const list = await mainAction.API_spCallServer(params, dispatch);
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
                    Alertwarning('Please search chiến lược để xóa!')
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
            Alerterror("Error,contact IT Netco!");
            console.log(error, "WH_spWareHouse_StrategyActual_DetailList")
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
                        onClick={e => setdataarray({ Number: dataarray.Number + 1, _row: row, keys: 'view' })}
                    >
                        <i className="fa-solid fa-eye"></i>
                    </button>
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
                            <button key={row.index + 3}
                                data-tooltip="Xoá"
                                className="btn btn-sm btn-danger mr-2 show__tip__right"
                                onClick={(a) => setdataarray({ Number: dataarray.Number + 1, _row: row, keys: 'delete' })}
                            >
                                <i className="fa fa-trash"></i>
                            </button> : ""
                    }
                    {
                        row.original.StatusCode === 5 ?
                            <button key={row.index + 5}
                                data-tooltip="Sửa"
                                data-toggle="modal" data-target="#modal3"
                                className="btn btn-sm btn-warning mr-2 show__tip__right"
                                onClick={(a) => {setdataarray({ Number: dataarray.Number + 1, _row: row, keys: 'edit' });setOutboundCode(row.original.Code);setOutboundId(row.original.Id)}}
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
            Cell: (obj) => obj.value === 'Mới tạo' ? <label className="btn labelradius10px new">{obj.value}</label> :
                <label className="btn labelradius10px older">{obj.value}</label>
        },
        {
            Header: "Outbound Code",
            accessor: 'Code',
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
            Header: "Strategy Time",
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
            Header: 'Options',
            accessor: 'ProductId',
            show: true,
            filterable: false,
            sortable: false,
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
                    ExportId:OutboundId,
                    CreaterId:GetDataFromLogin("AccountId")
                }),
                func: "WH_spWareHouse_StrategyActual_UpdateWaybill",
                API_key: APIKey
            }
            debugger
            const result = await mainAction.API_spCallServer(params, dispatch);
            debugger
            if (result.Status===0){
                let list = [...DataList]
                list.find(p=>p.Id===OutboundId).StatusCode=6;
                list.find(p=>p.Id===OutboundId).Status="Hoàn tất";
                setDataList(list);
                Alertsuccess("Success !")
            }
            else{
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
                                        <div className="row" >
                                            <div className="col-sm-12 col-md-6">
                                                <div className="dropdown">
                                                    <h3 className="dropbtn"><i class="fa-solid fa-bars"></i> List {Function.Name} ({DataList.length})</h3>
                                                    {/* <div className="dropdown-content">
                                                        {dropdown}
                                                    </div> */}
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <button className="btn btn-warning btn-xs float-right height35 margin-left-5"
                                                    onClick={e => Exportexcel(e)}
                                                >
                                                    <i className="fa fa-download mr-2" />
                                                    {I18n.t("System.Excel")}
                                                </button>
                                                <button type="button" className="btn btn-danger btn-xs float-right height35 margin-left-5"
                                                    onClick={a => WH_spWareHouse_StrategyActual_Delete(-1)}
                                                >
                                                    <i className="fa fa-trash mr-2 " />
                                                    {I18n.t('System.Delete')}
                                                </button><button type="button" className="btn btn-primary btn-xs float-right height35"
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
                                                    <label className="form__title" >Warehouse</label>
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
                                                    <label className="form__title" >Creater</label>
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