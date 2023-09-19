import React, { useState, useEffect, } from "react";
import I18n from '../../../Language';
import { useDispatch } from 'react-redux';
import { mainAction } from '../../../Redux/Actions';
import { DataTable } from "../../../Common/DataTable";
import { Alerterror, Alertsuccess, Alertwarning, GetDataFromLogin, ConfirmAlert, FormatDateJson, ExportExcel } from "../../../Utils";
import { SettingColumn, SelectTypeObj } from '../../../Common';
import Select from "react-select";
export const ProviderAndCurator = () => {
    //#regon begin using the effect hook
    useEffect(() => {

    }, []);
    ///tab hiện thị sửa trên table
    const [tittle, setTitle] = useState("ADD NEW SUPPLIER")
    //transmission CreateName,EditName

    const AccountId = GetDataFromLogin("AccountId");
    const AccountName = GetDataFromLogin("AccountName");
    let datapermisstion = localStorage.getItem("Permissioninfor");//check quyền

    //SelectTypeObj
    const [TypeObj, setTypeObj] = useState({ value: 0, label: "" });;
    const onSelectTypeObj = (TypeObj) => {
        
        setTypeObj(TypeObj);
        console.log(TypeObj, "TypeObj")
    }

    //save
    const dispatch = useDispatch();
    const [Id, setId] = useState('');
    const [CodeObj, setCodeObj] = useState('');
    const [NameObj, setNameObj] = useState('');
    const [PhoneObj, setPhoneObj] = useState('');
    const [AddressObj, setAddressObj] = useState('');
    const [CreateName, setCreateName] = useState();
    const [disbtn, setdisbtn] = useState();
    const Accountinfor = JSON.parse(localStorage.getItem("Accountinfor") === "" ? "{}" : localStorage.getItem("Accountinfor"));

    // save
    const WH_spProviderAndCurator_Save = async () => {
        debugger
        {

            //kiem tra quyen luu
            if (datapermisstion !== "") {
                let a = JSON.parse(datapermisstion);
                let b = a.find(p => p.WH_tblMenuModuleId === 77 && p.Adds === 'C')
                if (b === undefined) {
                    Alertwarning(I18n.t("validate.YoudonothavetherighttoaddasupplierandaPersoninCharge"));
                    return;
                }
            }
            if (CodeObj === "") {
                Alertwarning(I18n.t("validate.Pleaseenterthecode!"));
                return;
            }
            if (NameObj === "") {
                Alertwarning(I18n.t("validate.Pleaseenteraname!"));
                return;
            }
            if (PhoneObj === "") {
                Alertwarning(I18n.t("validate.PleaseEnteryourphonenumber!"));
                return;
            }
            if (AddressObj === "") {//||Length == 0 
                Alertwarning(I18n.t("validate.Pleaseenteryouraddress!"));
                return;
            }
            // if (TypeObj === "") {//||Length == 0 
            //     Alertwarning(I18n.t("validate.Pleasechoosetype!"));
            //     return;
            // }
            const pr = {
                Id: Id,
                CodeObj: CodeObj,
                NameObj: NameObj,
                PhoneObj: PhoneObj.trim(),
                AddressObj: AddressObj,
                TypeObj: 'A',
                // CreateId: Accountinfor.AccountId,
                // CreateName: Accountinfor.AccountName,
                CreateId: GetDataFromLogin("AccountId"),
                CreateName: GetDataFromLogin("AccountName"),

            };
            const params = {
                Json: JSON.stringify(pr),
                func: "WH_spProviderAndCurator_Save",
            };
            //khóa nút
            setdisbtn(true);

            try {
                const result = await mainAction.API_spCallServer(params, dispatch);
                //setdisbtn(false);
                if (result.Status === "OK") {
                    Alertsuccess(result.ReturnMess);
                    WH_spProviderAndCurator_Cancel();
                    setTitle("ADD NEW SUPPLIER");

                }
                else {

                    Alerterror(result.ReturnMess);
                }
            } catch (error) {
                //setdisbtn(false);
                Alerterror(I18n.t("validate.Dataerror,pleasecontactITNETCO!"));
            }
        }
    }
    //LIST
    const [DataProviderAndCurator, setDataProviderAndCurator] = useState([]);
    const WH_spProviderAndCurator_List = async () => {
        
        //kiem tra quyen xem
        if (datapermisstion !== "") {
            let a = JSON.parse(datapermisstion);
            let b = a.find(p => p.WH_tblMenuModuleId === 77 && p.Views === 'C')
            if (b === undefined) {
                Alertwarning(I18n.t("validate.Youdonothavetherighttoseenccandthepersonincharge!"));
                return;
            }
        }

        
        const pr = {
            Json: JSON.stringify({
                Id: Id,
                AccountId: GetDataFromLogin("AccountId"),
                CreateId: GetDataFromLogin("AccountId")
            }),

            func: "WH_spProviderAndCurator_List"
        };
        //  //khóa nút
        setdisbtn(true);
        try {
            const result = await mainAction.API_spCallServer(pr, dispatch);
            setdisbtn(false);
            console.log(result);
            setDataProviderAndCurator(result);

        } catch (error) {
            setdisbtn(false);
            console.log(error);
            Alerterror(I18n.t("validate.apierror!"));
        }
    }
    // Begin cancel
    const WH_spProviderAndCurator_Cancel = () => {
        setId(0)
        setCodeObj('')
        setNameObj('')
        setPhoneObj('')
        setAddressObj('')
        setTypeObj('')
        //setTypeAB('')
        setdisbtn(false);//mở nút
        setTitle('THÊM MỚI NCC');
    }
    //delete Item xóa từng dòng
    const [IsDelete, setIsDelete] = useState();
    useEffect(() => {
        if (IsDelete === undefined) return;
        const row = IsDelete.Item;
        const dataold = [...DataProviderAndCurator];
        clickDelete(row, dataold);
    }, [IsDelete]);

    //numberrandom xóa khi cancel
    const clickDeleteSmall = (item) => {
        const numberrandom = Math.random();
        setIsDelete({ IsActive: numberrandom, Item: item });
    }
    // ///edit
    const clickEdit = (data) => {
        setTitle("EDIT SUPPLIER")
        const editobj = data.row.original;//ĐỐI tượng
        setId(editobj.Id);
        setCodeObj(editobj.CodeObj);
        setNameObj(editobj.NameObj);
        setPhoneObj(editobj.PhoneObj);
        setAddressObj(editobj.AddressObj);
        setTypeObj(editobj.TypeObjName);//list
        document.querySelector("#tab_1").click();

    }
    ///check chọn nhiều ô để xóa ID hoa và thường///(const datanew)
    const [IsCheckOne, setIsCheckOne] = useState({ Id: 0, Check: false });
    useEffect(() => {
        if (IsCheckOne.Id !== 0 && IsCheckOne.Id !== undefined) {
            let Id = IsCheckOne.Id;
            let Check = IsCheckOne.Check;

            if (Check === undefined || Check === null)
                Check = false;

            const datanew = [...DataProviderAndCurator]
            datanew.find(p => p.Id == Id).IsCheck = !Check;
            setDataProviderAndCurator(datanew);

        }
    }, [IsCheckOne]);

    //check all
    const [IsCheckedAll, setIsCheckedAll] = useState();
    const [keyC, setkeyC] = useState(false);
    useEffect(() => {
        if (IsCheckedAll === undefined) return;
        const datanew = [...DataProviderAndCurator];
        datanew.forEach((item) => {
            if (keyC === false) {
                item.IsCheck = true
                setkeyC(true);
            }
            else {
                item.IsCheck = false
                setkeyC(false);
            }

        });
        setDataProviderAndCurator(datanew);
    }, [IsCheckedAll]);

    ///delete multiple lines
    const DeleteALLProviderAndCurator = async () => {
        debugger
        //kttra quyền xóa
        if (datapermisstion !== "") {
            let a = JSON.parse(datapermisstion);
            let b = a.find(p => p.WH_tblMenuModuleId === 77 && p.Deletes === 'C')
            if (b === undefined) {
                Alertwarning(I18n.t("validate.Youdonothavetherighttoremovethesupplierandpersonincharge!"));
                return;
            }

        }
        let check = DataProviderAndCurator.filter(a => a.IsCheck === true)
        if (check.length === 0) {
            Alertwarning(I18n.t("validate.Pleaseselecttheevndorandpersoninchargetodelete!"))
            return
        }


        ConfirmAlert("Delete provider and person in charge", "Are you sure you want to delete this provider and person in charge??", async () => {
            const DataDelete = DataProviderAndCurator.filter(p => p.IsCheck === true);
            if (DataDelete.length === 0) {
                Alertwarning(I18n.t("validate.Pleaseselecttheproviderandpersoninchargetodelete!"))
                return
            }
            if (DataDelete.length > 0) {
                //hàm delete
                const pr = {
                    CreateId: AccountId,
                    CreateName: AccountName,
                    ListId: DataDelete.map(item => { return { "Id": item.Id } })//xóa nhiều dòng thì thêm biến vào sql

                }

                const params = {
                    JSON: JSON.stringify(pr),
                    func: "WH_spProviderAndCurator_DeleteMany"

                }
                
                try {
                    const result = await mainAction.API_spCallServer(params, dispatch);

                    if (result.Status === "OK")//Status,OK SQL save,để xóa đc hàm 
                    {

                        Alertsuccess(result.ReturnMess);
                        //xóa đối tựng trong mảng
                        setDataProviderAndCurator(DataProviderAndCurator.filter(p => p.IsCheck !== true));
                    }
                    else {
                        Alerterror(result.ReturnMess);
                    }
                } catch (error) {
                    console.log(error);
                    Alerterror(I18n.t("validate.apierror!"));

                }


            }
        })
    }

    //delete .row
    const clickDelete = (data, dataold) => {
        if (data === undefined) return;
        const editobj = data.row.original;

        ConfirmAlert("Delete provider and person in charge", "Are you sure you want to delete this provider??", async () => {

            const pr = {
                Id: Id,
                CreateId: AccountId,
                CreateName: AccountName,

            }
            //hàm delete
            const params = {
                JSON: JSON.stringify(pr),
                func: "WH_spProviderAndCurator_Delete"

            }
            try {
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result.Status === "OK")//Status,OK SQL save,để xóa đc hàm 
                {
                    Alertsuccess(result.ReturnMess);
                    //xóa đối tựng trong mảng
                    const DataProviderAndCurator = dataold;
                    const datadelete = DataProviderAndCurator.filter(p => p.Id !== editobj.Id);
                    setDataProviderAndCurator(datadelete);
                }

                else {
                    Alerterror(result.ReturnMess);
                }
            } catch (error) {
                console.log(error);
                Alerterror(I18n.t("validate.apierror!"));

            }

        })


    }

    //execel
    const Exportexcell = () => {
        const newData = DataProviderAndCurator.map(element => {
            //kiem tra quyen Excel
            if (datapermisstion !== "") {
                let a = JSON.parse(datapermisstion);
                let b = a.find(p => p.WH_tblMenuModuleId === 77 && p.Excel === 'C')
                if (b === undefined) {
                    Alertwarning("Anh/chị không có quyền xuất Excel!");
                    return;
                }
            }
            return {
                'Mã': element.CodeObj,
                'Tên': element.NameObj,
                'Số Điện Thoại': element.PhoneObj,
                'Địa Chỉ': element.AddressObj,
                'Chọn Loại': element.TypeObj,
                'Người Sửa': element.EditName,
                'Ngày Sửa': FormatDateJson(element.EditTime),
                'Người Tạo': element.CreateName,
                'Ngày Tạo': FormatDateJson(element.CreateTime)
            }
        })
        newData.forEach(function (x) {
            if (columns.find(a => a.accessor === 'CodeObj') === undefined) { delete x["Mã"] }
            else if (columns.find(a => a.accessor === 'CodeObj').show === false) { delete x["Mã"] }

            if (columns.find(a => a.accessor === 'NameObj') === undefined) { delete x["Tên"] }
            else if (columns.find(a => a.accessor === 'NameObj').show === false) { delete x["Tên"] }

            if (columns.find(a => a.accessor === 'PhoneObj') === undefined) { delete x["Số Điện Thoại"] }
            else if (columns.find(a => a.accessor === 'PhoneObj').show === false) { delete x["Số Điện Thoại"] }

            if (columns.find(a => a.accessor === 'AddressObj') === undefined) { delete x["Địa Chỉ"] }
            else if (columns.find(a => a.accessor === 'AddressObj').show === false) { delete x["Địa Chỉ"] }

            if (columns.find(a => a.accessor === 'TypeObj') === undefined) { delete x["Chọn Loại"] }
            else if (columns.find(a => a.accessor === 'TypeObj').show === false) { delete x["Chọn Loại"] }

            if (columns.find(a => a.accessor === 'EditName') === undefined) { delete x["Người Sửa"] }
            else if (columns.find(a => a.accessor === 'EditName').show === false) { delete x["Người Sửa"] }

            if (columns.find(a => a.accessor === 'EditTime') === undefined) { delete x["Ngày Sửa"] }
            else if (columns.find(a => a.accessor === 'EditTime').show === false) { delete x["Ngày Sửa"] }

            if (columns.find(a => a.accessor === 'CreateName') === undefined) { delete x["Người Tạo"] }
            else if (columns.find(a => a.accessor === 'CreateName').show === false) { delete x["Người Tạo"] }

            if (columns.find(a => a.accessor === 'CreateTime') === undefined) { delete x["Ngày Tạo"] }
            else if (columns.find(a => a.accessor === 'CreateTime').show === false) { delete x["Ngày Tạo"] }


        });
        ExportExcel(newData, "Danh sách kho");
    }
    //check 
    const IsCheckedAllSmall = () => {

        const numberrandom = Math.random();
        setIsCheckedAll({ Id: numberrandom });
    }
    ///coloums
    const [columns, setcolumns] = useState([
        {
            Header: (
                <div className="col-sm-12 col-md-2">
                    <div className="icheck-success d-inline">
                        <a
                            className="btn btn-success btn-sm"
                            onClick={IsCheckedAllSmall}///function k lỗi
                        >
                            <i className="fa fa-check" aria-hidden="true" />

                        </a>
                    </div>
                </div>
            ),
            Cell: (row) => (
                <div className="col-sm-12 col-md-2">
                    <div className="icheck-success d-inline">
                        <input type="checkbox"
                            id={row.original.Id} value={row.original.Id}
                            checked={row.original.IsCheck}
                            onChange={e => setIsCheckOne({ Id: row.original.Id, Check: row.original.IsCheck })}
                        />
                        <label className="label checkbox" htmlFor={row.original.Id}></label>
                    </div>
                </div>
            ),
            maxWidth: 50,
            textAlign: "center",
            filterable: false,
            sortable: false,
            special: true,///loại bỏ checkbox ra khi chọn nút cài đăt
            show: true,//

        },

        {
            Header: I18n.t("System.Option"),
            Cell: (row) => <span>{row.index + 1}</span>,
            width: 150,
            filterable: false,
            special: true,
            show: true,
            accessor: 'Id',
            Cell: (row) => (
                // <div>
                <span>

                    <button
                        data-tooltip={I18n.t("Delivery.Edit")}
                        className="btn btn-sm btn-success mr-2 show__tip__left"
                        onClick={(e) => clickEdit({ row })}
                    >
                        <i className="fas fa-wrench"></i>
                    </button>
                    <button
                        data-tooltip={I18n.t("Delivery.Delete")}
                        className={row.original.State === 0 ? 'btn btn-sm btn-warning mr-2 show__tip__right' : 'btn btn-sm btn-danger  show__tip__right'}
                        onClick={(e) => clickDeleteSmall({ row })}////xóa từng dòng
                    >
                        <i className="fa fa-trash"></i>
                    </button>
                </span>

                // </div>
            ),
        },
        {
            Header: I18n.t("Report.STT"),
            Cell: (row) => <span>{row.index + 1}</span>,
            width: 100,

            special: true,///loại bỏ checkbox ra khi chọn nút cài đăt
            show: true,//
        },
        {
            Header:I18n.t("ProviderAndCurator.Code"),
            accessor: "CodeObj",

        },
        {
            Header:I18n.t("ProviderAndCurator.Name"),
            accessor: "NameObj",

        },
        {
            Header:I18n.t("ProviderAndCurator.Phone"),
            accessor: "PhoneObj",

        },
        {
            Header:I18n.t("ProviderAndCurator.Address"), 
            accessor: "AddressObj",

        },
        {
            Header:I18n.t("ProviderAndCurator.Type"),
            accessor: "TypeObj",

        },

        {
            Header: I18n.t("ProviderAndCurator.EditName"),
            accessor: "EditName",

        },
        {
            Header:I18n.t("ProviderAndCurator.EditTime"),
            accessor: "EditTime",
            Cell: (obj) => FormatDateJson(obj.value),


        },
        {
            Header:I18n.t("ProviderAndCurator.CreateName"),
            accessor: "CreateName",

        },
        {
            Header:I18n.t("ProviderAndCurator.CreateTime"),
            accessor: "CreateTime",
            Cell: (obj) => FormatDateJson(obj.value),
            width: 180,

        },

    ]);
    //#end region 


    return (

        <div className="content-wrapper pt-2">
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
                                                        {tittle}
                                                    </span>
                                                </h3>
                                            </div>
                                            <div className="col-md-6 card-header-btn">
                                                <a
                                                    className="btn btn-danger btn-sm float-right btn-header"
                                                    onClick={a => WH_spProviderAndCurator_Cancel(a)}///function k lỗi
                                                >
                                                    <i className="fa fa-trash mr-2 " />
                                                    {I18n.t("System.Cancel")}
                                                </a>
                                                <a
                                                    className="btn btn-success btn-sm float-right btn-header"
                                                    onClick={a => WH_spProviderAndCurator_Save(a)}
                                                //disbtn={!disbtn}
                                                >
                                                    <i className="fa fa-folder mr-2 " />
                                                    {I18n.t("System.Save")}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body-form">
                                        <div className="row pb-3">
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                       {I18n.t("ProviderAndCurator.Code")}
                                                        <span className="form__title__note"> (*)</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder=""
                                                        onChange={e => setCodeObj(e.target.value.trim())}
                                                        value={CodeObj}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                    {I18n.t("ProviderAndCurator.Name")}
                                                        <span className="form__title__note"> (*)</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder=""
                                                        onChange={e => setNameObj(e.target.value)}
                                                        value={NameObj}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                    {I18n.t("ProviderAndCurator.Phone")}
                                                        <span className="form__title__note"> (*) </span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder=""
                                                        onChange={e => setPhoneObj(e.target.value)}
                                                        value={PhoneObj}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                    {I18n.t("ProviderAndCurator.Address")}
                                                        <span className="form__title__note"> (*) </span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder=""
                                                        onChange={e => setAddressObj(e.target.value)}
                                                        value={AddressObj}
                                                    />
                                                </div>
                                            </div>
                                            {/* <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                    {I18n.t("ProviderAndCurator.SelectType")}
                                                        <span className="form__title__note"> (*) </span>
                                                    </label>
                                                    <SelectTypeObj
                                                        onSelected={e => onSelectTypeObj(e.value)}
                                                        items={TypeObj}

                                                    />
                                                </div>
                                            </div> */}
                                        </div>
                                        <div>
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
                                                    {I18n.t("ProviderAndCurator.ListofProvidersandPersonsinCharge")} ({DataProviderAndCurator.length})
                                                    </span>
                                                </h3>
                                            </div>
                                            <div className="col-md-6 card-header-btn">
                                                <a className="btn btn-warning btn-sm float-right btn-header"
                                                    onClick={a => Exportexcell(a)}>
                                                    <i className="fa fa-download mr-2" />
                                                    {I18n.t("System.Excel")}
                                                </a>
                                                <a className="btn btn-danger btn-sm float-right btn-header" onClick={a => DeleteALLProviderAndCurator(a)}>
                                                    <i className="fa fa-trash mr-2" />
                                                    {I18n.t("System.Delete")}
                                                </a>
                                                <a
                                                    className="btn btn-primary btn-sm float-right btn-header"
                                                    onClick={a => WH_spProviderAndCurator_List(a)}
                                                >
                                                    <i className="fa fa-eye mr-2" />
                                                    {I18n.t("System.View")}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={DataProviderAndCurator.length > 0 ? "" : "display-none"} >
                                        <SettingColumn
                                            columns={columns}
                                            Returndata={a => setcolumns(a)}
                                        />
                                        <DataTable
                                            data={DataProviderAndCurator}
                                            columns={columns}
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}