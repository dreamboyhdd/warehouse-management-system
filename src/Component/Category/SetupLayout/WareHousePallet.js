import React, { useState, useEffect, useRef } from "react";
import I18n from "../../../Language";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../Redux/Actions";
import { DataTable } from "../../../Common/DataTable";
import { Alerterror, Alertsuccess, Alertwarning, FormatDate, FormatDateJson, FirstOrLastDayinMonth, GetDataFromLogin, ExportExcel } from "../../../Utils";
import { SelectCustomer, SelectWarehouseContract } from '../../../Common';
import DateTimePicker from "react-datetime-picker";
import { QRCodeSVG } from 'qrcode.react';
import { ConfirmAlert, GenQRCode } from "../../../Utils";
import $ from 'jquery';
export const WareHousePallet = () => {

    //#regon begin using the effect hook

    //#end regon
    //tab hiện thị sửa trên table 
    const [WarehouseId, setWarehouseId] = useState({ value: 0, label: "" });
    const [WarehouseId2, setWarehouseId2] = useState({ value: 0, label: "" });
    const WarehouseIdRef = useRef()
    const [PalletCode, setPalletCode] = useState("");
    const [PalletId, setPalletId] = useState(0);
    const [Notes, setNotes] = useState("");
    const [Fromdate, setFromdate] = useState(FirstOrLastDayinMonth(new Date(), 1));
    const [Todate, setTodate] = useState(FirstOrLastDayinMonth(new Date()));
    const dispatch = useDispatch();
    const [disbtn, setdisbtn] = useState();
    const [QRCode, setQRCode] = useState('');
    const [DataWareHousePallet, setDataWareHousePallet] = useState([]);
    const [Checkall, setCheckall] = useState(false);
    const [dataarray, setdataarray] = useState("");
    const [DataPalletPrint, setDataPalletPrint] = useState([]);
    useEffect(() => {
        if (dataarray.keys === "check") {
            CheckOne(dataarray._row.original.PalletId, dataarray._row.original.IsCheck);
        } else if (dataarray.keys === 'checkall') {
            CheckOne(0, Checkall)
        }
    }, [dataarray]);
    // save
    const WH_spWareHouse_Pallet_Save = async () => {
        if (WarehouseId.value === 0 || WarehouseId.value === undefined) {
            Alertwarning("Please choise Warehouse Id!");
            WarehouseIdRef.current.focus()
            return;
        }
        if (PalletCode === "") {
            Alertwarning("Please Enter the Pallet code!");
            return;
        }

        const pr = {
            PalletId: PalletId,
            PalletCode: PalletCode,
            Notes: Notes,
            AccountId: GetDataFromLogin("AccountId"),
            WarehouseId: WarehouseId.value


        };
        const params = {
            Json: JSON.stringify(pr),
            func: "WH_spWareHouse_Pallet_Save",
        };
        //khóa nút
        setdisbtn(true);

        try {
            const result = await mainAction.API_spCallServer(params, dispatch);
            setdisbtn(false);
            if (result.Status === "OK") {

                if (PalletId > 0) {
                    /*  debugger
                     let rows = DataWareHousePallet.find(p=> p.PalletId = PalletId);
                     rows.PalletCode = PalletCode;
                     rows.Notes  = Notes;
                     rows.Editer = GetDataFromLogin("AccountName");
                     rows.EditTime = FormatDateJson(new Date ()); */
                    WH_spWareHouse_Pallet_List();
                }
                Alertsuccess(result.ReturnMess);
                Cancel();
            }
            else {

                Alerterror(result.ReturnMess);
            }
        } catch (error) {
            setdisbtn(false);
            Alerterror(I18n.t("validate.Dataerror,pleasecontactITNETCO!"));
        }

    }



    const WH_spWareHouse_Pallet_List = async () => {
        //kiem tra quyen xem
        debugger
        const pr = {
            Json: JSON.stringify({
                // FromDate: FormatDateJson(Fromdate),
                // ToDate: FormatDateJson(Todate),
                AccountId: GetDataFromLogin("AccountId"),
                WarehouseId: WarehouseId2.value
            }),

            func: "WH_spWareHouse_Pallet_List"
        };
        //khóa nút
        setdisbtn(true);
        try {
            const result = await mainAction.API_spCallServer(pr, dispatch);
            if (result.length > 0) {
                setdisbtn(false);
                setDataWareHousePallet(result);

            }
            else {
                Alertwarning("No Data!")
                setDataWareHousePallet([]);
                return;
            }
        }
        catch (error) {
            setdisbtn(false);
            console.log(error);
            Alerterror(I18n.t("validate.apierror!"));
        }
    };


    //#region view image
    const [ModalImg, setModalImg] = useState("");
    const viewImageInTable = async (img) => {
        setModalImg(img);
    };
    //#end region

    //#region modal view image
    const ViewImg = (
        <div
            class="modal fade"
            id="modalImg"
            tabindex="-1"
            role="dialog"
            aria-labelledby="modalImg"
            aria-hidden="true"
        >
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <div className="row edit__user__header">
                            <h4 className="">
                                <i className="fa-solid fa-image mr-2"></i>
                                {(I18n.t("WareHouse.Picture!"))}
                            </h4>
                            <a className="btn btn__default" data-dismiss="modal">
                                <i className="fa fa-times-circle edit__close__icon" />
                            </a>
                        </div>
                    </div>
                    <div class="modal-body text-center">
                        <img src={ModalImg} width="100%" />
                    </div>
                </div>
            </div>
        </div>
    );

    //#end region
    //execel
    const Exportexcell = () => {

        const newData = DataWareHousePallet.map(element => {
            return {

                'Warehouse Name': element.WareHouseName,
                'Pallet Code': element.PalletCode,
                'Notes': element.Notes,
                'Người Sửa': element.Editer,
                'Ngày Sửa': FormatDateJson(element.EditTime),
                'Người Tạo': element.CreateName,
                'Ngày Tạo': FormatDateJson(element.CreateTime)
            }
        })
        ExportExcel(newData, 'Pallet List');
    }
    const clickEdit = (data) => {
        debugger
        const editobj = data.row.original;//ĐỐI tượng
        setNotes(editobj.Notes);
        setPalletCode(editobj.PalletCode);
        setPalletId(editobj.PalletId);
        setWarehouseId({ value: editobj.WareHouseId, label: editobj.WareHouseName });
        document.querySelector("#tab_1").click();

    }
    // Begin cancel
    const Cancel = () => {
        setNotes("");
        setPalletCode("");
        setPalletId(0);

    }
    const clickDeleteSmall = async (data) => {
        const editobj = data.row.original;//ĐỐI tượng

        const pr = {
            PalletId: editobj.PalletId,
            AccountId: GetDataFromLogin("AccountId")


        };
        const params = {
            Json: JSON.stringify(pr),
            func: "WH_spWareHouse_Pallet_Delete",
        };
        //khóa nút
        setdisbtn(true);

        try {
            const result = await mainAction.API_spCallServer(params, dispatch);
            setdisbtn(false);
            Alertsuccess(result.ReturnMess);
            WH_spWareHouse_Pallet_List();
        } catch (error) {
            setdisbtn(false);
            Alerterror(I18n.t("validate.Dataerror,pleasecontactITNETCO!"));
        }
    }
    //#region view image
    const [dataQRCode, setdataQRCode] = useState("");
    const viewQRCodeInTable = async (QRCode) => {
        setdataQRCode(QRCode);
    };
    //#end region

    //#region modal view image
    const ViewQRCode = (
        <div
            class="modal fade"
            id="dataQRCode"
            tabindex="-1"
            role="dialog"
            aria-labelledby="dataQRCode"
            aria-hidden="true"
        >
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <div className="row edit__user__header">
                            <h4 className="">
                                <i className="fa-solid fa-image mr-2"></i>
                                Qrcode
                            </h4>
                            <a className="btn btn__default" data-dismiss="modal">
                                <i className="fa fa-times-circle edit__close__icon" />
                            </a>
                        </div>
                    </div>
                    <div class="modal-body text-center">

                        <QRCodeSVG
                            id={dataQRCode + 'View'}
                            value={dataQRCode}
                            size={500}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const CheckOne = (Id, Check) => {
        debugger
        let _DataList = [...DataWareHousePallet]
        if (Id == 0) {
            _DataList.forEach(i => { i.IsCheck = !Checkall })
            setCheckall(!Checkall)
        } else {
            if (Check === undefined)
                Check = false;
            _DataList.find((p) => p.PalletId == Id).IsCheck = !Check;
        }
        setDataWareHousePallet(_DataList);
    };
    ///coloums
    const columns = [
        {
            Header: (
                <div className="col-sm-12">
                    <div class="icheck-success d-inline">
                        <input type="checkbox" id="checkbox"
                            onChange={e => {
                                setdataarray({ keys: 'checkall' })
                            }} />
                        <label htmlFor="checkbox" className="label checkbox"></label>
                    </div>
                </div>
            ),

            accessor: "PalletId",
            filterable: false,
            sortable: false,
            width: 60,
            maxWidth: 50,
            textAlign: "center",
            special: true,
            show: true,
            Cell: (row) => (
                <div className="col-sm-12">
                    <div className="icheck-success d-inline">
                        <input
                            type="checkbox"
                            id={row.original.PalletId}
                            key={row.original.PalletId}
                            value={row.original.PalletId}
                            checked={row.original.IsCheck}
                            onChange={(e) => setdataarray({ _row: row, keys: "check" })}
                        />
                        <label
                            className="label checkbox"
                            htmlFor={row.original.PalletId}
                        ></label>
                    </div>
                </div>
            ),

        },
        {
            Header: I18n.t("System.Option"),
            width: 200,
            // filterable: false,
            // sortable: false,
            special: true,///loại bỏ checkbox ra khi chọn nút cài đăt
            show: true,//
            accessor: 'PalletId',
            Cell: (row) => (
                // <div>
                <span>
                    {row.original.IsEdit === 1 ?
                        (<button
                            data-tooltip={I18n.t("AccountGroup.Edit")}
                            className="btn btn-sm btn-success mr-2 show__tip__left"
                            onClick={(e) => clickEdit({ row })}
                        >
                            <i className="fas fa-wrench"></i>
                        </button>)
                        : ("")
                    }
                    {row.original.IsDelete === 1 ?
                        (<button
                            data-tooltip={I18n.t("AccountGroup.Delete")}
                            className="btn btn-sm btn-danger show__tip__right"
                            onClick={(e) => clickDeleteSmall({ row })}
                        >
                            <i className="fa fa-trash"></i>
                        </button>)
                        : ("")
                    }

                    {/*  <button
                        className="btn btn-sm btn btn-warning ml-2"
                        onClick={(e) => {
                            PrintQRCode(row.original.PalletCode, row.index + 1);
                        }}
                    >
                        Print QR
                    </button> */}
                </span>
                // </div>
            ),
        },
        {
            Header: 'No.',
            Cell: (row) => <span>{row.index + 1}</span>,
            width: 80,
            special: true,
            show: true,//
        },

        // {
        //     Header: "Qrcode",
        //     accessor: "QRCode",
        //     width: 130,
        //     Cell: (row) => (
        //         <div className="QRprint" id='QRprint'>

        //             <a
        //                 className="cursor"
        //                 data-toggle="modal"
        //                 data-target="#dataQRCode"
        //                 onClick={(e) => {
        //                     viewQRCodeInTable(row.original.PalletCode);
        //                 }}
        //                 title="Click để xem qrcode"
        //                 style={{ display: 'block' }}
        //             >
        //                 <QRCodeSVG
        //                     id={row.index + 1}
        //                     value={row.original.PalletCode}
        //                     size={30}

        //                 />
        //             </a>

        //         </div>


        //     ),
        // },
        {
            Header: "WareHouse Name",
            accessor: "WareHouseName",
            width: 130,
        },
        {
            Header: "Pallet Code",
            accessor: "PalletCode",
            width: 130,
        },

        {
            Header: "Notes",
            accessor: "Notes",
        },
        {
            Header: 'Create Name',
            accessor: "CreateName",
        },
        {
            Header: I18n.t("System.DateCreated"),
            accessor: "CreateTime",
            Cell: (obj) => FormatDateJson(obj.value),
            width: 180,
        },
        {
            Header: 'Edit Name',
            accessor: "Editer",
        },
        {
            Header: 'Date Edit',
            accessor: "EditTime",
            Cell: (obj) => FormatDateJson(obj.value),
            width: 180,
        },
    ]
    ////Print
    const [PrintdataQRCode, setPrintdataQRCode] = useState([]);
    const [HtmlPrint, setHtmlPrint] = useState([]);

    const PrintQRCode = async (QRCode) => {
        const DataPrint = DataWareHousePallet.filter(p => p.IsCheck === true);
        if (DataPrint.length === 0) {
            Alertwarning(I18n.t("System.Pleaseselecttheproducttoprint!"))
            return
        }
        await setPrintdataQRCode(DataPrint);
        $("#Printform").css("display", "block");
        $("#formaction").css("display", "none");
        window.print();
        $("#Printform").css("display", "none");
        $("#formaction").css("display", "block");
    }

    //#end region
    return (
        <div >
            <div id="formaction" className="content-wrapper pt-2">
                <section className="content">
                    <div className="container-fluid">
                        <div className="card card-primary">
                            {/* Navbar */}
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
                                        className="nav-link "
                                        href="#tab_2"
                                        data-toggle="tab"
                                    //onClick={Cancel}
                                    >
                                        {I18n.t("System.List")}
                                    </a>
                                </li>
                            </ul>
                            <div className="body-padding">
                                <div className="tab-content" id="custom-tabs-two-tabContent">
                                    <div
                                        className="tab-pane fade show active"
                                        id="tab_1add"
                                        role="tabpanel"
                                        aria-labelledby="custom-tabs-two-home-tab"
                                    >
                                        {/* Header */}
                                        <div className="card-header">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <h3 className="card-title">
                                                        <i className="fas fa-plus" />
                                                        <span className="font-weight-bold">
                                                            Pallet
                                                        </span>
                                                    </h3>
                                                </div>
                                                <div className="col-md-6 card-header-btn">

                                                    <a
                                                        className="btn btn-danger btn-sm float-right btn-header"
                                                        onClick={Cancel}
                                                    >
                                                        <i className="fa fa-trash mr-2 " />
                                                        {I18n.t("System.Cancel")}
                                                    </a>
                                                    <a
                                                        className="btn btn-success btn-sm float-right btn-header"
                                                        onClick={WH_spWareHouse_Pallet_Save}
                                                        disbtn={!disbtn}
                                                    >
                                                        <i className="fa fa-folder mr-2 " />
                                                        {I18n.t("System.Save")}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body-form">
                                            <div className="row pb-12">
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label className="form__title" > Warehouse ID<span className="form__title__note">(*)</span></label>
                                                        <SelectWarehouseContract
                                                            onSelected={e => {
                                                                setWarehouseId(e)
                                                            }}
                                                            items={WarehouseId.value}
                                                            ref={WarehouseIdRef}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3">

                                                    <div className="form-group">
                                                        <label className="form__title">
                                                            Pallet Code
                                                        </label>
                                                        <span className="form__title__note"> (*)</span>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder=""
                                                            value={PalletCode}
                                                            onChange={(e) => setPalletCode(e.target.value)}
                                                        />
                                                    </div>


                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label className="form__title">
                                                            Notes
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder=""
                                                            value={Notes}
                                                            onChange={(e) => setNotes(e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>
                                    <div
                                        className="tab-pane fade"
                                        id="tab_2"
                                        role="tabpanel"
                                        aria-labelledby="custom-tabs-two-profile-tab"
                                    >
                                        <div className="card-header">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <h3 className="card-title">
                                                        <i className="fa fa-bars" />
                                                        <span className="font-weight-bold">
                                                            Pallet List ({DataWareHousePallet.length})
                                                        </span>
                                                    </h3>
                                                </div>
                                                <div className="col-md-6 card-header-btn">
                                                    <a
                                                        className="btn btn-success btn-sm float-right btn-header"
                                                        onClick={(e) => PrintQRCode(PalletId)}
                                                    >
                                                        <i className="fa fa-print pr-1" />
                                                        {I18n.t("System.print")}
                                                    </a>
                                                    <a className="btn btn-warning btn-sm float-right btn-header" onClick={Exportexcell}>
                                                        <i className="fa fa-download mr-2" />
                                                        Down Excel
                                                    </a>
                                                    {/*   <a className="btn btn-danger btn-sm float-right btn-header" onClick={DeleteAllWareHousePallet}>
                                                            <i className="fa fa-trash mr-2" />
                                                            {I18n.t("System.Delete")}
                                                        </a> */}
                                                    <a
                                                        className="btn btn-primary btn-sm float-right btn-header"
                                                        onClick={WH_spWareHouse_Pallet_List}
                                                    >
                                                        <i className="fa fa-eye mr-2" />
                                                        {I18n.t("System.View")}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body-form row">
                                            {/* <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="form__title">From the day </label>
                                                    <DateTimePicker
                                                        className="form-control"
                                                        onChange={(date) => setFromdate(date)}
                                                        value={Fromdate}
                                                        format="MM/dd/yyyy"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="form__title">To The day</label>
                                                    <DateTimePicker
                                                        className="form-control"
                                                        onChange={(date) => setTodate(date)}
                                                        value={Todate}
                                                        format="MM/dd/yyyy"
                                                    />
                                                </div>
                                            </div> */}
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="form__title" > Warehouse ID</label>
                                                    <SelectWarehouseContract
                                                        onSelected={e => {
                                                            setWarehouseId2(e)
                                                        }}
                                                        items={WarehouseId2.value}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {ViewImg}
                                        <div className={DataWareHousePallet.length > 0 ? "" : "display-none"} >
                                            <DataTable
                                                data={DataWareHousePallet}
                                                columns={columns}
                                            />
                                        </div>
                                        {ViewQRCode}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div id="Printform" className="content-wrapper pt-2 text-center" style={{ width: "100%", display: "none" }}>

                {/*   mẫu có logo */}
                {/*  { 
                    PrintdataQRCode.map((item, index) => {
                       
                        return (
                            
                            <div className="col-md-12" style={{
                               height: '430px',
                marginTop: (((index + 1) + 2) % 3) === 0  || (index + 1) ===1 ? '0px' : '80px',
                padding: (((index + 1) + 2) % 3) === 0  || (index + 1) ===1 ? '10px 65px 65px 65px' : '65px 65px 65px 65px',
                pageBreakAfter: ((index + 1) % 3) === 0 ? 'always' : '',
                            }}>
                                <div className="row">

                                    <div className="col-md-6">
                                        <QRCodeSVG
                                            id={item.PalletCode + 'view'}
                                            value={item.PalletCode}
                                            size={300}
                                        />
                                        <h3 className="col-md-12" style={{ textAlign: "center", marginTop: '2px' }}>{item.PalletCode}</h3>
                                    </div>
                                    <div className="col-md-6">
                                        <div style={{ height: '150px', paddingTop: '20px', borderLeft: '1px solid #d4c5c56b' }} ><img src="https://admin-netco.vps.vn//Image/ckfinder/files/logoNew.png" style={{ height: "80px" }} /></div>
                                        <div style={{ height: '150px', paddingTop: '40px', borderLeft: '1px solid #d4c5c56b', borderTop: '1px solid #d4c5c56b' }}><img src="../../assets/img/gdexlogo.jpg" style={{ height: "80px" }} /></div>
                                    </div>
                                </div>
                            </div>
                        )
                     
                    })
                } */}

                {/*   mẫu không có logo */}
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
                                        id={item.PalletCode + 'view'}
                                        value={item.PalletCode}
                                        size={300}
                                    />
                                    <h3 className="col-md-12" style={{ textAlign: "center", marginTop: '2px' }}>{item.PalletCode}</h3>

                                </div>

                            </div>
                        )
                    })
                }
            </div>

        </div>


    )
};
