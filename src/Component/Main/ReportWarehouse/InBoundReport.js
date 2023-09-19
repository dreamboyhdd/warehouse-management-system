import React, { useState, useEffect, useRef, useDebugValue } from "react";
import { useDispatch, useSelector } from 'react-redux';
import I18n from '../../../Language'
import { APIKey } from '../../../Services/Api';
import Select from 'react-select';
import DateTimePicker from 'react-datetime-picker';
import $ from "jquery";
import { SelectAccount, SelectCustomer, SelectWarehouseArea, SelectWarehouse, SelectVehicle, DataTable, SelectProvider, SelectCurator } from '../../../Common';
import { mainAction } from '../../../Redux/Actions'
import { Alertwarning, ConfirmAlert, Alertsuccess, Alerterror, GetDataFromLogin, FormatDateJson, FirstOrLastDayinMonth, FormatNumber, ExportExcel, DateDiff, setData } from "../../../Utils";
import { QRCodeSVG } from 'qrcode.react';
import Barcode from "react-barcode";
export const InBoundReport = () => {

    //#region Khai báo biến

    const dispatch = useDispatch();
    const [disable, setdisable] = useState(false); // disable button 
    const [Warehouse, setWarehouse] = useState({ value: -1 });
    const [Checkall, setCheckall] = useState(false);
    const [Status, setStatus] = useState([{ value: -1, label: 'Vui lòng chọn' }, { value: 0, label: 'Mới tạo' }, { value: 1, label: 'Đã xác nhận' }, { value: 2, label: 'Đã tạo thực tế' }]);
    const [StatusId, setStatusId] = useState({ value: -1, label: 'Vui lòng chọn' });
    const [EditSerialImei, setEditSerialImei] = useState('');
    const [InventoryProductId, setInventoryProductId] = useState('');
    const EditSerialImeiRef = useRef();
    const [Function, setFunction] = useState({ Id: 1, _funcsave: 'WH_spWareHouse_Import_Save_V2', Name: 'chiến lược nhập kho' });
    const [IsAcctive, setIsAcctive] = useState(false);
    const [State, setState] = useState()
    const [ModalImg, setModalImg] = useState({})
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
    const [WareHouseId, setWareHouseId] = useState({ value: -1 })
    const [WareHouseAreaId, setWareHouseAreaId] = useState({ value: 0 })
    const [StaffId, setStaffId] = useState({ value: 0 })
    const [CreateTime, setCreateTime] = useState('')
    const [CreateId, setCreateId] = useState({ value: 0 })
    const [DataOK, setDataOK] = useState([])
    const [DataList, setDataList] = useState([])
    const [DataDetailList, setDataDetailList] = useState([])

    //#endregion Khai báo biến

    $('body').on("click", function (event) {
        setIsAcctive(false)
    })
 
    // WH_spWareHouse_Inbound_Report 
    const WH_spWareHouse_Inbound_Report = async () => {

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
                    StaffId: StaffId.value === -1 ? 0 : StaffId.value,
                    CreateTime: FormatDateJson(CreateTime, 1),
                    Status: StatusId.value,
                    CreateId: CreateId.value === -1 ? 0 : CreateId.value,
                    Keys: Function.Id,
                    Type: 1
                }),
                func: "WH_spWareHouse_Inbound_Report",
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
            console.log(error, "WH_spWareHouse_Inbound_Report")
        }

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
    const Exportexcel = () => {
        const newData = DataList.map(element => {
            return {
                'Status': element.Status,
                'Inbound Code': element.Code,
                'Customer Code': element.CustomerCode,
                'Person in charge': element.StaffName,
                'Group': element.GroupCode,
                'Brand': element.ProductGroupName,
                'PO code': element.POcode,
                'Product Code': element.ProductCode,
                'Product Name': element.ProductName,
                'Quality': element.Quality,
                'Suplier': element.NameObj,
                'UnitName': element.UnitName,
                'Staff Name 1': element.StaffName1,
                'Staff Name 2': element.StaffName2,
                'Staff Name 3': element.StaffName3,
                'Name Vehicle': element.NameVehicle,
                'Driver Name': element.DriverName,
                'License plates': element.Licenseplates,
                'Planned time': FormatDateJson(element.StrategyTime),
                'Area': element.Name,
                'Ware HouseName': element.WareHouseName,
                'Note': element.Note,
                'Create Name': element.CreateName,
                'Create Time': FormatDateJson(element.CreateTime),
                'Edit Name': element.EditName,
                'Edit Time': FormatDateJson(element.EditTime),
                'Serial': element.CodeSeriIme,
                'Dateof Manu facture': FormatDateJson(element.DateofManufacture),
                'Date Expiry': FormatDateJson(element.DateExpiry),
                'Status date': element.Statusdate
            }
        })

        ExportExcel(newData, "Report Inbound");
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
            Header: "InBound code",
            accessor: 'Code',
            width: 180

        },
        {
            Header: "Customer Code",
            accessor: "CustomerCode",
            width: 180
        },
        {
            Header: "Person in charge",
            accessor: "StaffName",
            width: 180
        },
        {
            Header: "Group",
            accessor: "GroupCode",
            width: 180
        },
        {
            Header: "Brand",
            accessor: "ProductGroupName",
            width: 180
        }, {
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
            Header: "Unit Name",
            accessor: 'UnitName',

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
            Header: "Planned time",
            accessor: "StrategyTime",
            Cell: (obj) => FormatDateJson(obj.value),
            width: 180
        },
        {
            Header: "Area",//
            accessor: "Name",
            special: true
        },
        {
            Header: "WareHouse Name",//
            accessor: "WareHouseName",
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
        },
        {
            Header: "Serial",
            accessor: 'CodeSeriIme',
            width: 180,
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
        // ,
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
        // }
    ];
    const columnsV2 = [
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
           Header: "InBound code",
           accessor: 'Code',
           width: 180
       },
       {
           Header: "Customer Code",
           accessor: "CustomerCode",
           width: 180
       }, {
           Header: "Brand team",
           accessor: 'ProductGroupName',
           width: 180
       }, 
       {
           Header: "Person in charge",
           accessor: "StaffName",
           width: 180,
       }, {
           Header: "PO code",
           accessor: "POcode",
           width: 180
       }, {
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
           Header: "Quality(Item)",
           accessor: "Quality",
       },
       {
           Header: "Unit Name",
           accessor: 'UnitName',

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
           Header: "Planned time",
           accessor: "StrategyTime",
           Cell: (obj) => FormatDateJson(obj.value),
           width: 180
       },
       {
           Header: "Area",//
           accessor: "Name",
           special: true
       },
       {
           Header: "WareHouse Name",//
           accessor: "WareHouseName",
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
           accessor: 'CodeSeriIme',
           width: 180,
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
                            <div className="row edit__user__header_f">
                                <h4 className="edit__user__title">
                                    <i className="fa fa-users mr-2" />
                                    Detail : {Title}
                                </h4>
                                {/* <a className="btn btn-print"
                                    onClick={e => PrintQRCode()} >
                                    <i className='fas fa-print mr-2'></i>
                                    Print
                                </a> */}
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
                                {/* <div className="row col-md-6">
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

                                </div> */}
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
                                                        Inbound Report ({DataList.length})
                                                    </span>
                                                </h3>
                                            </div>
                                            <div className="col-sm-6 margin-5">
                                                <button type="button" className="btn btn-warning btn-xs float-right height35 margin-left-5"
                                                    onClick={e => Exportexcel(e)}>
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
                                                        WH_spWareHouse_Inbound_Report(e)
                                                    }>
                                                    <i className="fa-solid fa-eye" />
                                                    {I18n.t('System.View')}
                                                </button>
                                            </div>
                                        </div>
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
                                                    <label className="form__title">Warehouse Area ID</label>
                                                    <SelectWarehouseArea
                                                        onSelected={(e) => {
                                                            setWareHouseAreaId(e)
                                                        }}
                                                        WareHouseId={WareHouseId.value}
                                                        items={WareHouseAreaId.value}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t('Actual.Executionstaff')} ID</label>
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

                                    <div className={DataList.length > 0 ? "" : "display-none"}>
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
        </div >
    );

}