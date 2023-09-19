import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import I18n from '../../../Language'
import { APIKey } from '../../../Services/Api';
import Select from 'react-select';
import DateTimePicker from 'react-datetime-picker';
import $, { parseJSON } from "jquery";
import { SelectArea, SelectWarehouseArea, SelectAccount, SelectCustomer, SelectWarehouseContract, SelectWarehouse, SelectVehicle, DataTable, SelectCurator, SelectProvider } from '../../../Common';
import { mainAction } from '../../../Redux/Actions'
import { Alertwarning, Alertsuccess, Alerterror, GetDataFromLogin, FormatDateJson, FirstOrLastDayinMonth, FormatNumber, ExportExcel, ConfirmAlert, DateDiff, RegEpxPhoneVN } from "../../../Utils";
import { formatNumber } from "canvasjs-react-charts/canvasjs.min";
import Barcode from "react-barcode";
export const OutboundReport = () => {

    //#region Khai báo biến
    const dispatch = useDispatch();
    const [WareHouseAreaId, setWareHouseAreaId] = useState({ value: 0 })
    const [disable, setdisable] = useState(false); // disable button 
    const [Status, setStatus] = useState([{ value: -1, label: 'Please search' }, { value: 0, label: 'Mới tạo' }, { value: 1, label: 'Đang tiến hành' }, { value: 2, label: 'Hoàn tất' }]);
    const [StatusId, setStatusId] = useState({ value: -1, label: 'Please search' });
    const [Excel, setExcel] = useState([])
    const [DataExcel, setDateExcel] = useState([])
    const [Function, setFunction] = useState({ Id: 2, _funcsave: 'WH_spWareHouse_Export_Save', Name: 'Outbound OPERATION' });
    const [IsAcctive, setIsAcctive] = useState(false);
    const [ModalImg, setModalImg] = useState({})

    //list 
    const [Fromdate, setFromdate] = useState(FirstOrLastDayinMonth(new Date(), 1))
    const [Todate, setTodate] = useState(new Date())
    const [Code, setCode] = useState('')
    const [Title, setTitle] = useState('')
    const [CusId, setCusId] = useState({ value: 0 })
    const [Area_Id, setArea_Id] = useState({ value: -1 })
    const [WareHouseId, setWareHouseId] = useState({ value: -1 })
    const [StaffId, setStaffId] = useState({ value: 0 })
    const [CreateTime, setCreateTime] = useState('')
    const [CreateId, setCreateId] = useState({ value: 0 })
    const [DataList, setDataList] = useState([])
    const [DataDetailList, setDataDetailList] = useState([])
    const [DataDetailArrange, setDataDetailArrange] = useState([])

    const [OutboundCode, setOutboundCode] = useState("");
    const [OutboundId, setOutboundId] = useState(0);
    const [WaybillCode, setWaybillCode] = useState("");
    //#endregion
    //close choise
    $('body').on("click", function (event) {
        setIsAcctive(false)
    })
    // WH_spWareHouse_Outbound_Report 
    const WH_spWareHouse_Outbound_Report = async () => {
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
                    StaffId: StaffId.value === -1 ? 0 : StaffId.value,
                    CreateTime: FormatDateJson(CreateTime, 1),
                    Status: StatusId.value,
                    CreateId: CreateId.value === -1 ? 0 : CreateId.value
                }),
                func: "WH_spWareHouse_Outbound_Report",
                API_key: APIKey
            }
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
            console.log(error, "WH_spWareHouse_Outbound_Report")
        }

    }
    const Exportexcel = () => {
        const newData = DataList.map(element => {
            return {
                'Status': element.Status,
                'Outbound Code': element.Code,
                'Waybill Code': element.WaybillCode,
                'Customer Code': element.CustomerCode,
                'Person in charge': element.StaffName,
                'Group': element.GroupCode,
                'Brand': element.ProductGroupName,
                'Code DA/Code warehouse': element.WareHouseCode,
                'PO code': element.POcode,
                'Product Code': element.ProductCode,
                'Product Name': element.ProductName,
                'Quality': element.PackageNumber,
                'Supplier': element.NameObj,
                'Delivery date': FormatDateJson(element.TimeWaybill),
                'Receive date': FormatDateJson(element.TimeWaybill),
                'Recipient Name': element.RecipientName,
                'Recipient Phone': element.RecipientPhone,
                'Recipient Address': element.RecipientAddress,
                'DA/Bracnh': element.ProvinceName,
                'Staff Name 1': element.StaffName1,
                'Staff Name 2': element.StaffName2,
                'Staff Name 3': element.StaffName3,
                // 'Province Name': element.ProvinceName,
                // 'District Name': element.DistrictName,
                // 'Ward Name': element.WardName,
                // 'Recipient Address': element.RecipientAddress,
                'Planned time': FormatDateJson(element.CreateTimeExport),
                'Area': element.Name,
                'Ware HouseName': element.WareHouseName,
                'Note': element.Note,
                'Create Name': element.CreateName,
                'Create Time': FormatDateJson(element.CreateTime),
                'Edit Name': element.EditName,
                'Edit Time': FormatDateJson(element.EditTime),
                'SeriIme': element.CodeSeriIme,
                'UnitName': element.UnitName,
                'Dateof Manu facture': FormatDateJson(element.DateofManufacture),
                'Date Expiry': FormatDateJson(element.DateExpiry),
                'Status date': element.Statusdate
            }
        })

        ExportExcel(newData, "Report Outbound");
    }
    const viewImageInTable = (e) => {
        setModalImg({ ProductName: e.ProductName, Image: e.Image })
    }
    const columns = [
        {
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
            Header: "OutBound code",
            accessor: 'Code',
            width: 180

        },
        {
            Header: "Waybill Code",
            accessor: 'WaybillCode',
            width: 180

        },
        {
            Header: "Customer Code",
            accessor: "CustomerCode",
            width: 180
        },  {
            Header: "Person in charge",
            accessor: "StaffName",
            width: 180
        },  {
            Header: "Group",
            accessor: "GroupCode",
            width: 180
        },  {
            Header: "Brand",
            accessor: "ProductGroupName",
            width: 180
        },
        {
            Header: "Code DA/Code warehouse",
            accessor: "WareHouseCode",
        },{
            Header: "PO code",
            accessor: "POcode",
            width: 180
        },
        {
            Header: "Product Code",
            accessor: 'ProductCode',
            width: 180,
        },
        {
            Header: "Product Name",
            accessor: 'ProductName',
            width: 180,
        },
        {
            Header: "Quality",
            accessor: "PackageNumber",
        },
        {
            Header: "Supplier",
            accessor: "NameObj",
        },
        {
            Header: "Delivery date",
            accessor: "TimeWaybill",
            Cell: (obj) => FormatDateJson(obj.value),
        },
        {
            Header: "Receive date",
            accessor: "TimeWaybill", 
            Cell: (obj) => FormatDateJson(obj.value),
        },
        {
            Header: "Recipient Name",
            accessor: "RecipientName",
        },
        {
            Header: "Recipient Phone",
            accessor: "RecipientPhone",
        },
        {
            Header: "Recipient Address",
            accessor: "RecipientAddress",
        },
        {
            Header: "DA/Branch",
            accessor: "ProvinceName",
        },
        {
            Header: "Staff 1",
            accessor: "StaffName1",
            width: 180
        },
        {
            Header: "Staff 2",
            accessor: "StaffName2",
            width: 180
        },
        {
            Header: "Staff 3",
            accessor: "StaffName3",
            width: 180
        },
        // {
        //     Header: "Province Name",
        //     accessor: "ProvinceName",
        //     width: 180
        // },
        // {
        //     Header: "District Name",
        //     accessor: "DistrictName",
        //     width: 180
        // },
        // {
        //     Header: "Ward Name",
        //     accessor: "WardName",
        //     width: 180
        // },
        // {
        //     Header: "Recipient Address",
        //     accessor: "RecipientAddress",
        //     width: 180
        // },
        {
            Header: "Planned time",
            accessor: "CreateTimeExport",
            Cell: (obj) => FormatDateJson(obj.value),
            width: 180
        },
        {
            Header: "Area",//
            accessor: "Name",
            special: true
        },
        {
            Header: "Warehouse",
            accessor: "WareHouseName",
        },
        {
            Header: "Note",
            accessor: "Note",
            width: 180
        },{
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
        },
        // {
        //     Header: "Image",
        //     accessor: "Image",
        //     filterable: false,
        //     sortable: false,
        //     Cell: (row) => (
        //         <div>
        //             <a
        //                 className="cursor"
        //                 data-toggle="modal"
        //                 data-target="#modalImg2"
        //                 onClick={(e) => {
        //                     viewImageInTable(row.original);
        //                 }}
        //                 title="Lagger Image"
        //             >
        //                 {row.original.Image !== undefined ? <img src={row.original.Image} height="30" width="50" /> : <></>}
        //             </a>
        //         </div>
        //     )
        // },
        {
            Header: "Serial",
            accessor: 'Lotnumber',
            width: 180,
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
            Header: "Status date",
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
            debugger
            const result = await mainAction.API_spCallServer(params, dispatch);
            debugger
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
                                        <div className="row" >
                                            <div className="col-sm-12 col-md-6">
                                                <div className="dropdown">
                                                    <h3 className="dropbtn"><i class="fa-solid fa-bars"></i> Report OUTBOUND ({DataList.length})</h3>
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
                                                {/* <button type="button" className="btn btn-danger btn-xs float-right height35 margin-left-5"
                                                    onClick={a => WH_spWareHouse_StrategyActual_Delete(-1)}
                                                >
                                                    <i className="fa fa-trash mr-2 " />
                                                    {I18n.t('System.Delete')}
                                                </button> */}
                                                <button type="button" className="btn btn-primary btn-xs float-right height35"
                                                    onClick={e =>
                                                        WH_spWareHouse_Outbound_Report(e)
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
                                                    <label className="form__title" >Putaway staff ID</label>
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
                                    <div className={DataList.length > 0 ? "" : "display-none"}>
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