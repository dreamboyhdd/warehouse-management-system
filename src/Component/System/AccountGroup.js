import React, { useState, useEffect, } from "react";
import I18n from '../../Language';
import { useDispatch } from 'react-redux';
import { mainAction } from '../../Redux/Actions';
import { DataTable } from "../../Common/DataTable";
import { SelectArea, SelectWarehouse, SettingColumn } from '../../Common';
import { Alertsuccess, Alertwarning, FormatDateJson, ExportExcel, ConfirmAlert } from "../../Utils";

export const AccountGroup = () => {
    //#regon begin using the effect hook
    useEffect(() => {

    }, []);
    //#end regon
    let datapermisstion =  localStorage.getItem("Permissioninfor");//check quyền

    //#region set variable
    const dispatch = useDispatch();
    const [Title, setTitle] = useState(I18n.t("validate.Addnewaccountgroup"));
    const [GroupId, setGroupId] = useState(0);
    const [GroupCode, setGroupCode] = useState('');
    const [GroupName, setGroupName] = useState('');
    const [Description, setDescription] = useState('');
    const [Area, setArea] = useState({ value: -1 });
    const [Warehouse, setWarehouse] = useState({ value: -1 });
    const [DataAccountGroup, setDataAccountGroup] = useState([]);
    const [DataAccountDetail, setDataAccountDetail] = useState([]);
    const [TotalAccount, setTotalAccount] = useState('')
    const [TotalAccountGroup, setTotalAccountGroup] = useState('')
    const [disable, setDisable] = useState(true);
    const [SelectProduct, setSelectProduct] = useState("");
    const [IsAcctive, setIsAcctive] = useState(false);
    const [DataSearch, setDataSearch] = useState([]);
    const [dataarray, setdataarray] = useState('')
    const [Checkall, setCheckall] = useState(false);
    const Accountinfor = JSON.parse(localStorage.getItem("Accountinfor") === "" ? "{}" : localStorage.getItem("Accountinfor"));
    //#end regon

    useEffect(() => {
        if (dataarray.keys === 'check') {
            CheckOne(dataarray._row.original.GroupId, dataarray._row.original.IsCheck)
        } else if (dataarray.keys === 'delete') {
            WH_spAccountGroup_Delete(dataarray._row.value, 1);
        } else if (dataarray.keys === 'checkall') {
            CheckOne(0, Checkall)
        }
    }, [dataarray]);

    // Begin save and edit account group
    const WH_spAccountGroup_Save = async () => {
        //kiem tra quyen luu
        if(datapermisstion !== "")
        {
            let a = JSON.parse(datapermisstion);
          let b = a.find(p => p.WH_tblMenuModuleId === 52 && p.Adds === 'C')
          if(b === undefined)
            {
                Alertwarning(I18n.t("validate.Youdonothavepermissiontocreateaccountgroups!"));
                return;
            }
        }

        try {
            if (GroupCode === "") {
                Alertwarning(I18n.t("validate.Pleaseentertheaccountgroupcode!"));
                return;
            }
            if (GroupName === "") {
                Alertwarning(I18n.t("validate.Pleaseentertheaccountgroupname!"));
                return;
            }
            if (Area.value === 0) {
                Alertwarning(I18n.t("validate.Pleaseselectaworkarea!"));
                return;
            }
            if (Warehouse.value === 0) {
                Alertwarning(I18n.t("validate.Pleaseselectworkingbranch!"));
                return;
            }
            setDisable(false)
            const pr = {
                GroupId: GroupId,
                GroupCode: GroupCode.trim(),
                GroupName: GroupName.trim(),
                AreaId: Area.value,
                WareHouseId: Warehouse.value,
                Description: Description.toString().replaceAll('"', "'").trim(),
                CreateId: Accountinfor.AccountId,
                CreateName: Accountinfor.AccountName,
            }
            const params = {
                Json: JSON.stringify(pr),
                func: "WH_spAccountGroup_Save"
            }
            const result = await mainAction.API_spCallServer(params, dispatch)
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess)
                WH_spAccountGroup_Cancel()
                clickLoadList();
                setDisable(true);
                document.getElementById("close_modal").click()
                return;
            }
            if (result.Status === "NO") {
                Alertwarning(result.ReturnMess)
                setDisable(true)
                return;
            }
        } catch (error) {
            Alertwarning(I18n.t("Report.NoData"));
        }
    }
    //#end region

    //#region render list account group
    const WH_spAccountGroup_List = async () => {
        //kiem tra quyen xem
        if(datapermisstion !== "")
        {
            let a = JSON.parse(datapermisstion);
            let b = a.find(p => p.WH_tblMenuModuleId === 52 && p.Views === 'C')
            if( b === undefined)
            {
                Alertwarning(I18n.t("validate.Youdonothavepermissiontoviewtheaccountgroup!"));
                return;
            }
        }
        try {
            const params = {
                Json: JSON.stringify({
                    GroupId: 0,
                    CreateId: Accountinfor.AccountId,
                    CreateName: Accountinfor.AccountName,
                }),
                func: "WH_spAccountGroup_List"
            }
            const list = await mainAction.API_spCallServer(params, dispatch)
            if (list.length > 0) {
                setDataAccountGroup(list)
            } else {
                Alertwarning(I18n.t("Report.NoData"));
                setDataAccountGroup([])
            }
        } catch (error) {
            Alertwarning(I18n.t("Report.NoData"));
        }
    }
    //#end region

    //#region render list product detail
    const WH_spAccountGroup_Detail = async (item) => {
        setTitle(I18n.t("AccountGroup.Accountgroupdetails"));
        try {
            let GroupId = item.row._original.GroupId
            const params = {
                Json: JSON.stringify({
                    GroupId: GroupId,
                    CreateId: Accountinfor.AccountId,
                    CreateName: Accountinfor.AccountName,
                }),
                func: "WH_spAccountGroup_Detail",
            };
            const list = await mainAction.API_spCallServer(params, dispatch);
            setDataAccountDetail(list);
        } catch (error) {
            Alertwarning(I18n.t("Report.NoData"));
        }
    };
    //#end region

    const CheckOne = (Id, Check) => {
        let _DataList = [...DataAccountGroup]
        if (Id == 0) {
            _DataList.forEach(i => { i.IsCheck = !Checkall })
            setCheckall(!Checkall)
        } else {
            if (Check === undefined)
                Check = false;
            _DataList.find((p) => p.GroupId == Id).IsCheck = !Check;
        }
        setDataAccountGroup(_DataList);
    }

    //#region delete account group
    const WH_spAccountGroup_Delete = (id, key) => {
        
			 //kttra quyền xóa
             if(datapermisstion !== "")
             {
                 let a = JSON.parse(datapermisstion);
                 let b = a.find(p => p.WH_tblMenuModuleId === 52 && p.Deletes ==='C')
                 if (b === undefined)
                 {
                     Alertwarning(I18n.t("validate.Youdonothavepermissiontodeleteaccountgroups!"));
                     return;
                 }
     
             }
        let check = DataAccountGroup.filter(a => a.IsCheck === true)
        if (id === 0 && check.length === 0) {
            Alertwarning(I18n.t("validate.Pleasechoosetodelete!"))
            return
        }
        try {
            ConfirmAlert("", "Are you sure you want to delete?", async () => {
                const ar = [];
                if (key === 1) {
                    ar.push(
                        {
                            GroupId: id,
                            AccountId: Accountinfor.AccountId,
                            AccountName: Accountinfor.AccountName
                        }
                    )
                }
                if (key === 2) {
                    let data = DataAccountGroup.filter(a => a.IsCheck === true)
                    data.forEach(element => {
                        ar.push(
                            {
                                GroupId: element.GroupId,
                                AccountId: Accountinfor.AccountId,
                                AccountName: Accountinfor.AccountName
                            }
                        )
                    });
                }
                const params = {
                    Json: JSON.stringify({
                        ListId: ar
                    }),
                    func: "WH_spAccountGroup_Delete"
                }
                const result = await mainAction.API_spCallServer(params, dispatch)
                if (result.Status === "OK") {
                    if (key === 1) {
                        setDataAccountGroup(DataAccountGroup.filter(a => a.GroupId !== id))
                    }
                    if (key === 2) {
                        setDataAccountGroup(DataAccountGroup.filter(a => a.IsCheck !== true))
                    }
                }
                if (result.Status === "NO") {
                }
                Alertwarning(result.ReturnMess);
            })
        } catch (error) {
            Alertwarning(I18n.t("Report.NoData"));
        }
    }
    //#end region

    //#region total account group
    const WH_spAccountGroup_Total = async () => {
        try {
            const params = {
                Json: JSON.stringify({
                    GroupId: 0,
                    CreateId: Accountinfor.AccountId,
                    CreateName: Accountinfor.AccountName,
                }),
                func: "WH_spAccountGroup_Total"
            }
            const result = await mainAction.API_spCallServer(params, dispatch)
            setTotalAccount(result[0].Total)
            setTotalAccountGroup(result[1].Total)
        } catch (error) {
            Alertwarning(I18n.t("Report.NoData"));
        }
    }
    //#end region

    //#region search product group
    const WH_spAccountGroup_Search = async (Code) => {
        setSelectProduct(Code.target.value)
        setIsAcctive(false)
        if (Code.target.value.length < 4) {
            setDataSearch([]);
            return
        }
        else {
            const params = {
                Json: JSON.stringify({
                    SearchCode: Code.target.value
                }),
                func: "WH_spAccountGroup_Search"
            }
            try {
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result.length > 0) {
                    setDataSearch(result);
                    setIsAcctive(true)
                }

            } catch (e) {
                Alertwarning(I18n.t("Report.NoData"));
            }
        }
    }
    //#end region

    //#region Select
    const onSelecteAccountGroup = (item) => {
        if (DataAccountGroup.find(e => e.GroupId === item.GroupId)) {
            Alertwarning('Nhóm này đã được hiện')
            return
        }
        let ar = DataSearch.filter(a => a.GroupId === item.GroupId);
        let _arr = [...DataAccountGroup, ...ar]; //use filter to push ar like this
        setDataAccountGroup(_arr)
    }
    //#end region


    //#region edit product group
    const WH_spAccountGroup_Edit = (item) => {
        setTitle(I18n.t("AccountGroup.Editaccountgroup"));
        const data = item.row._original;
        try {
            setGroupId(data.GroupId);
            setGroupCode(data.GroupCode);
            setGroupName(data.GroupName);
            setArea({ value: data.AreaId });
            setWarehouse({ value: data.WareHouseId });
            setDescription(data.Description);
        } catch (error) {
            Alertwarning(I18n.t("Report.NoData"));
        }
    };
    //#end region


    //#region begin clear, cancel from
    const WH_spAccountGroup_Cancel = () => {
        setGroupCode('')
        setGroupName('')
        setArea({ value: -1 })
        setWarehouse({ value: -1 })
        setDescription('')
    }
    //#end region

    //#region click add new
    const clickAddNew = () => {
        setTitle(I18n.t("validate.Addnewaccountgroup"));
        
        WH_spAccountGroup_Cancel()
    };
    //#end region

    //#region load list
    const clickLoadList = () => {
        try {
            WH_spAccountGroup_List();
            WH_spAccountGroup_Total();
        } catch (error) {
            Alertwarning(I18n.t("Report.NoData"));
        }
    }
    //#end region

    //#region view image
    const [ModalImg, setModalImg] = useState("");
    const viewImageInTable = async (img) => {
        setModalImg(img);
    }
    //#end region

    //#region table product group
    const [columns, setcolumns] = useState([
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
            accessor: "GroupId",
            filterable: false,
            sortable: false,
            width: 60,
            maxWidth: 50,
            special: true,
            show: true,
            textAlign: "center",
            Cell: (row) => (
                <div className="col-sm-12">
                    <div className="icheck-success d-inline">
                        <input
                            type="checkbox"
                            id={row.original.GroupId}
                            key={row.original.GroupId}
                            value={row.original.GroupId}
                            checked={row.original.IsCheck}
                            onChange={(e) => setdataarray({ _row: row, keys: "check" })}
                        />
                        <label
                            className="label checkbox"
                            htmlFor={row.original.GroupId}
                        ></label>
                    </div>
                </div>
            ),
        },
        {
            Header: I18n.t("System.Option"),
            width: 180,
            filterable: false,
            sortable: false,
            accessor: "GroupId",
            special: true,
            show: true,
            Cell: (row) => (
                <span>
                    <button
                        data-tooltip={I18n.t("AccountGroup.Detail")}
                        className="btn btn-sm btn-info mr-2 show__tip__left"
                        data-toggle="modal" data-target="#myModal2"
                        onClick={e => WH_spAccountGroup_Detail(row)}
                    >
                        <i className="fa-solid fa-eye"></i>
                        {/* Chi tiết */}
                    </button>
                    <button
                        data-tooltip={I18n.t("AccountGroup.Edit")}
                        className="btn btn-sm btn-success mr-2 show__tip__left"
                        data-toggle="modal"
                        data-target="#myModal1"
                        onClick={(e) => WH_spAccountGroup_Edit(row)}
                    >
                        <i className="fas fa-wrench"></i>
                        {/* Sửa */}
                    </button>
                    <button
                        data-tooltip=  {I18n.t("AccountGroup.Delete")}
                        className="btn btn-sm btn-danger show__tip__right"
                        onClick={(e) => setdataarray({ _row: row, keys: "delete" })}
                    >
                        <i className="fa fa-trash"></i>
                        {/* Xóa */}
                    </button>
                </span>
            ),
        },
        {
            Header: I18n.t("Report.STT"),
            Cell: (row) => <span>{row.index + 1}</span>,
            width: 50,
            filterable: false,
            special: true,
            show: true,
        },
        {
            Header: I18n.t ("AccountGroup.AccountGroupCode"), 
            accessor: "GroupCode",
        },
        {
            Header: I18n.t ("AccountGroup.AccountGroupName"),
            accessor: "GroupName",
        },
        {
            Header: I18n.t("AccountGroup.NumberofAccounts"),
            accessor: "TotalGroupAccount",
        },
        {
            Header: I18n.t("System.Creater"),
            accessor: "CreateName",
            width: 150
        },
        {
            Header: I18n.t("System.DateCreated"),
            accessor: "CreateTime",
            Cell: (obj) => FormatDateJson(obj.value),
            width: 180
        },
        {
            Header: I18n.t("System.EditBy"),
            accessor: "EditName",
            width: 150,
        },
        {
            Header: I18n.t("System.EditDate"),
            accessor: "EditTime",
            Cell: (obj) => FormatDateJson(obj.value),
            width: 180,
        },
        {
            Header: I18n.t("System.Note"),
            accessor: "Description",
            width: 150
        },
    ]);
    //#end region

    //#region table detail product group
    const [columnsDetail, setcolumnsDetail] = useState([
        {
            Header: I18n.t("Report.STT"),
            Cell: (row) => <span>{row.index + 1}</span>,
            width: 50,
            filterable: false,
            special: true,
            show: true,
        },
        {
            Header: I18n.t("AccountGroup.Picture"),
            accessor: "Avatar",
            filterable: false,
            sortable: false,
            Cell: (row) => (
                <div>

                    <a
                        className="cursor"
                        data-toggle="modal"
                        data-target="#modalImg"
                        onClick={(e) => { viewImageInTable(row.original.Avatar) }}
                        title="Click để xem hình lớn"
                    >
                        {/* <img src={row.original.Avatar} height="31" width="50" /> */}
                        {row.original.Avatar !== undefined ? <img src={row.original.Avatar} height="30" width="50" /> : <></>}
                    </a>

                </div>
            ),
        },

        {
            Header: I18n.t("AccountGroup.AccountGroup"),
            accessor: "GroupName",
            width: 150
        },
        {
            Header: I18n.t("AccountGroup.Accountcode"),
            accessor: "AccountCode",
            width: 150
        },
        {
            Header: I18n.t("AccountGroup.Accountname"),  
            accessor: "AccountName",
            width: 150
        },
        {
            Header:I18n.t("AccountGroup.IdentityCard/CitizenIdentity"),
            accessor: "IdentityCard",
            width: 150
        },
        {
            Header: I18n.t("AccountGroup.Birthday"),
            accessor: "Birthday",
            Cell: (obj) => FormatDateJson(obj.value, 5),
            width: 150
        },
        {
            Header: I18n.t("AccountGroup.Email"),
            accessor: "Email",
            width: 200
        },
        {
            Header: I18n.t("AccountGroup.Phone"),
            accessor: "Phone",
            width: 150
        },
        {
            Header:I18n.t("AccountGroup.Address"),
            accessor: "Address",
            width: 150
        },
        {
            Header: I18n.t("AccountGroup.Status"),
            accessor: "StatusName",
            width: 150
        },
        {
            Header: I18n.t("AccountGroup.Warehouse"),
            accessor: "WareHouseName",
            width: 150
        },
        {
            Header:I18n.t("AccountGroup.Position"),
            accessor: "PositionName",
            width: 150
        },
    ]);
    //#end region

    const Exportexcel = () => {
        
		    //kiem tra quyen Excel
            if(datapermisstion !== "")
            {
                let a = JSON.parse(datapermisstion);
               let b = a.find(p => p.WH_tblMenuModuleId === 52 && p.Excel === 'C') 
              if (b=== undefined)
                {
                    Alertwarning(I18n.t("validate.YoudonothavepermissiontoexportExcel!"));
                    return;
                }
           }
        if (DataAccountGroup.length === 0) {
            Alertwarning(I18n.t("ImportRatioCustomerReport.Noexceldatayet"))
            return
        }
        const newData = DataAccountGroup.map(element => {
            return {
                "Mã nhóm tài khoản": element.GroupCode,
                "Tên nhóm tài khoản": element.GroupName,
                "Số lượng tài khoản": element.TotalGroupAccount,
                "Người tạo": element.CreateName,
                "Ngày tạo": FormatDateJson(element.CreateTime),
                "Người sửa": element.EditName,
                "Ngày sửa": FormatDateJson(element.EditTime),
                "Ghi chú": element.Description,
            }
        })
        newData.forEach(function (x) {
            if (columns.find(a => a.accessor == 'GroupCode') === undefined) { delete x["Mã nhóm tài khoản"] }
            else if (columns.find(a => a.accessor === 'GroupCode').show === false) { delete x["Mã nhóm tài khoản"] }
            if (columns.find(a => a.accessor == 'GroupName') === undefined) { delete x["Tên nhóm tài khoản"] }
            else if (columns.find(a => a.accessor === 'GroupName').show === false) { delete x["Tên nhóm tài khoản"] }
            if (columns.find(a => a.accessor == 'TotalGroupAccount') === undefined) { delete x["Số lượng tài khoản"] }
            else if (columns.find(a => a.accessor === 'TotalGroupAccount').show === false) { delete x["Số lượng tài khoản"] }

            if (columns.find(a => a.accessor == 'CreateName') === undefined) { delete x["Người tạo"] }
            else if (columns.find(a => a.accessor === 'CreateName').show === false) { delete x["Người tạo"] }
            if (columns.find(a => a.accessor == 'CreateTime') === undefined) { delete x["Ngày tạo"] }
            else if (columns.find(a => a.accessor === 'CreateTime').show === false) { delete x["Ngày tạo"] }
            if (columns.find(a => a.accessor == 'EditName') === undefined) { delete x["Người sửa"] }
            else if (columns.find(a => a.accessor === 'EditName').show === false) { delete x["Người sửa"] }
            if (columns.find(a => a.accessor == 'EditTime') === undefined) { delete x["Ngày sửa"] }
            else if (columns.find(a => a.accessor === 'EditTime').show === false) { delete x["Ngày sửa"] }
            if (columns.find(a => a.accessor == 'Description') === undefined) { delete x["Ghi chú"] }
            else if (columns.find(a => a.accessor === 'Description').show === false) { delete x["Ghi chú"] }
        });
        ExportExcel(newData, "Danh sach nhom tai khoan");
    }

    //#region modal form
    const HtmlPopup1 = (
        <div className="container">
            <div className="modal fade" id="myModal1" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content width_height100">
                        <div class="modal-header">
                            <div className="row edit__user__header">
                                <h4 className="">
                                    <i className="fa fa-users mr-2" />
                                    {Title}
                                </h4>
                                <a className="btn btn__default" data-dismiss="modal" id="close_modal">
                                    <i className="fa fa-times-circle edit__close__icon" />
                                </a>
                            </div>
                        </div>
                        <div class="modal-body">
                            <div className="row">
                                <div className='col-md-6 col-sm-12'>
                                    <div className="form-group">
                                        <label className="form__title" >{I18n.t("AccountGroup.AccountGroupCode")} <span className="form__title__note">(*)</span></label>
                                        <input onChange={e => setGroupCode(e.target.value)} value={GroupCode} type="text" className="form-control" placeholder="" />
                                    </div>
                                </div>
                                <div className='col-md-6 col-sm-12'>
                                    <div className="form-group">
                                        <label className="form__title" >{I18n.t("AccountGroup.AccountGroupName")}<span className="form__title__note">(*)</span></label>
                                        <input onChange={e => setGroupName(e.target.value)} value={GroupName} type="text" className="form-control" placeholder="" />
                                    </div>
                                </div>
                                <div className='col-md-6 col-sm-12'>
                                    <div className="form-group">
                                        <label className="form__title" >{I18n.t("System.Area")}<span className="form__title__note">(*)</span></label>
                                        <SelectArea
                                            onSelected={(e) => setArea(e)}
                                            onAreaId={Area.value}
                                        />
                                    </div>
                                </div>
                                <div className='col-md-6 col-sm-12'>
                                    <div className="form-group">
                                        <label className="form__title" >{I18n.t("AccountGroup.Warehouse")} <span className="form__title__note">(*)</span></label>
                                        <SelectWarehouse
                                            onSelected={e => setWarehouse(e)}
                                            AreaId={Area.value}
                                            items={Warehouse.value}
                                        />
                                    </div>
                                </div>
                                <div className='col-md-12 col-sm-12'>
                                    <div className="form-group">
                                        <label className="form__title" >{I18n.t("AccountGroup.Describe")}</label>
                                        <input onChange={e => setDescription(e.target.value)} value={Description} type="text" className="form-control" placeholder="" />
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <div className="row">
                                <button
                                    disabled={!disable}
                                    onClick={WH_spAccountGroup_Save}
                                    type="button" className=" btn btn__save__w95h40 pull-right"
                                >
                                    Lưu
                                </button>
                                <button
                                    onClick={WH_spAccountGroup_Cancel}
                                    type="button"
                                    className=" btn btn__cancel__w95h40 pull-right margin-left-5"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
    //#end region

    //#region modal detail product group
    const HtmlPopup2 = (
        <div className="container">
            <div className="modal fade" id="myModal2" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content width_height100 modal__detail__table">
                        <div class="modal-header">
                            <div className="row edit__user__header">
                                <h4 className="">
                                    <i className="fa fa-users mr-2" />
                                    {Title}
                                </h4>
                                <a className="btn btn__default" data-dismiss="modal">
                                    <i className="fa fa-times-circle edit__close__icon" />
                                </a>
                            </div>
                        </div>
                        <div class="modal-body">
                            <SettingColumn
                                columns={columnsDetail}
                                Returndata={a => setcolumnsDetail(a)}
                            />
                            <DataTable
                                data={DataAccountDetail}
                                columns={columnsDetail}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
    //#end region

    //#region modal view image
    const ViewImg = (
        <div class="modal fade" id="modalImg" tabindex="-1" role="dialog" aria-labelledby="modalImg" aria-hidden="true" >
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <div className="row edit__user__header">
                            <h4 className="">
                                <i className="fa-solid fa-image mr-2"></i>
                                {I18n.t("AccountGroup.Picture")}
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

    return (
        <div className="content-wrapper pt-2" >
            <section className="content" >
                <div className="container-fluid">
                    <div className="card card-primary">
                        {/* Header */}
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-6">
                                    <h3 className="card-title">
                                        <i className="fa fa-users" />
                                        <span className="font-weight-bold">
                                            {I18n.t("System.AccountGroup")} ({DataAccountGroup.length})
                                        </span>
                                    </h3>
                                </div>
                                <div className="col-md-6 card-header-btn">
                                    <a
                                        className="btn btn-warning btn-sm float-right btn-header"
                                        onClick={e => Exportexcel()}
                                    >
                                        <i className="fa fa-download mr-2" />
                                        {I18n.t("System.Excel")}
                                    </a>
                                    <a
                                        className="btn btn-danger btn-sm float-right btn-header"
                                        onClick={e => WH_spAccountGroup_Delete(0, 2)}
                                    >
                                        <i className="fa fa-trash mr-2" />
                                        {I18n.t("System.Delete")}
                                    </a>
                                    <a
                                        className="btn btn-success btn-sm float-right btn-header"
                                        data-toggle="modal"
                                        data-target="#myModal1"
                                        onClick={clickAddNew}
                                    >
                                        <i className="fa fa-plus mr-2" />
                                        {I18n.t("System.Add")}
                                    </a>
                                    <a
                                        className="btn btn-primary btn-sm float-right btn-header"
                                        onClick={clickLoadList}
                                    >
                                        <i class="fa-solid fa-eye pr-1" />
                                        {I18n.t("System.View")}
                                    </a>
                                </div>
                            </div>
                        </div>
                        {/* Begin Account Group Card */}

                        <div className="card-body">
                            <div className="row padding-2rem">
                                <div className="col-md-5 card__info">
                                    <div className="card__h150w210 BG-9DDFD3">
                                        <p className="">{I18n.t("System.AccountGroup")}</p>
                                        <p>{TotalAccount}</p>
                                    </div>
                                    <div className="card__h150w210 BG-DBF6E9">
                                        <p className="">{I18n.t("AccountGroup.TotalAccount")}</p>
                                        <p>{TotalAccountGroup}</p>
                                    </div>
                                </div>
                                <div className="col-md-7 search__account__group">
                                    <div className="form-group">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="icon icon-tabler icon-tabler-search"
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
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search account group"
                                            value={SelectProduct}
                                            onChange={e => WH_spAccountGroup_Search(e)}
                                        />
                                        <div className={IsAcctive === false ? "display-none" : ""}>
                                            <div className="col-md-12 col-sm-12 col-xs-12 div-sender">
                                                {
                                                    DataSearch.map((item, index) => {
                                                        return (
                                                            <div
                                                                className="select-option-like"
                                                                key={index}
                                                                value={SelectProduct}
                                                                onClick={e => onSelecteAccountGroup(item)}
                                                            >
                                                                {item.GroupName}
                                                            </div>
                                                        )
                                                    })
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Begin Account Group List */}
                            <div className={DataAccountGroup.length > 0 ? "" : "display-none"}>
                                <SettingColumn
                                    columns={columns}
                                    Returndata={a => setcolumns(a)}
                                />
                                <DataTable
                                    data={DataAccountGroup}
                                    columns={columns}
                                />
                            </div>
                            {/* End Account Group List */}
                        </div>
                        {/* End Account Group Card */}

                        {/* Begin Modal Form */}
                        {HtmlPopup1}
                        {HtmlPopup2}
                        {ViewImg}
                        {/* End Modal Form */}
                    </div>
                </div>
            </section>
        </div>
    );
};
