import React, { useState, useEffect } from "react";
import I18n from "../../Language";
import { useDispatch } from "react-redux";
import { mainAction } from "../../Redux/Actions";
import DateTimePicker from "react-datetime-picker";
import { DataTable } from "../../Common/DataTable";
import { SelectArea, SelectWarehouse, SelectStatus, SelectAccountGroup, SelectPosition, SelectAccount, SettingColumn, SelectAreaMulti, } from "../../Common";
import { Alertsuccess, Alertwarning, FormatDateJson, FirstOrLastDayinMonth, ExportExcel, ConfirmAlert } from "../../Utils";

export const AccountManagement = () => {

    //#region 
    useEffect(() => {
    }, []);
    //#endregion
    let datapermisstion = localStorage.getItem("Permissioninfor");//check quyền
    //#region 
    const [Title, setTitle] = useState(I18n.t("System.AddNewAccount"));
    const dispatch = useDispatch();
    const [disable, setDisable] = useState(true);
    const [OldPassword, setOldPassword] = useState("");
    const [NewPassword, setNewPassword] = useState("");
    const [ConfirmNewPassword, setConfirmNewPassword] = useState("");
    const [AccountCode, setAccountCode] = useState("");
    const [PassWord, setPassWord] = useState("");
    const [ConfirmPassWord, setConfirmPassWord] = useState("");
    const [AccountName, setAccountName] = useState("");
    const [IdentityCard, setIdentityCard] = useState("");
    const [Birthday, setBirthday] = useState("");
    const [Email, setEmail] = useState("");
    const [Phone, setPhone] = useState("");
    const [Address, setAddress] = useState("");
    const [Description, setDescription] = useState("");
    const [Status, setStatus] = useState({ value: 0 });
    const [AccountGroupId, setAccountGroupId] = useState({ value: 0 });
    const [AreaId, setAreaId] = useState({ value: -1 });
    const [WarehouseId, setWarehouseId] = useState({ value: -1 });
    const [ManagerId, setManagerId] = useState({ value: -1 });
    const [PositionId, setPositionId] = useState({ value: -1 });
    const [FileUpload, setFileUpload] = useState({});
    const [Images, setImages] = useState("");
    const [DataAccountList, setDataAccountList] = useState([]);
    const [State, setState] = useState()
    const [AccountId, setAccountId] = useState(0)
    const Accountinfor = JSON.parse(localStorage.getItem("Accountinfor") === "" ? "{}" : localStorage.getItem("Accountinfor"));
    const [Fromdate, setFromdate] = useState(FirstOrLastDayinMonth(new Date(), 1))
    const [Todate, setTodate] = useState(new Date())

    const [Phone2, setPhone2] = useState("");
    const [AccountCode2, setAccountCode2] = useState("");
    const [Status2, setStatus2] = useState({ value: 0 });
    const [PositionId2, setPositionId2] = useState({ value: -1 });
    const [AreaId2, setAreaId2] = useState({ value: -1 });
    const [WarehouseId2, setWarehouseId2] = useState({ value: -1 });
    const [AccountGroupId2, setAccountGroupId2] = useState({ value: 0 });
    const [dataarray, setdataarray] = useState('')
    const [ShowPass, setShowPass] = useState()
    const [dPass, setdPass] = useState(false)
    const [showpass1, setshowpass1] = useState(false)
    const [showpass2, setshowpass2] = useState(false)
    const [showpass3, setshowpass3] = useState(false)
    const [showpass4, setshowpass4] = useState(false)
    const [showpass5, setshowpass5] = useState(false)
    const [showpass6, setshowpass6] = useState(false)
    const [Checkall, setCheckall] = useState(false);

    //#endregion

    //#region test

    // const EncryptString = async () => {
    //     const pr1 = {
    //         Json: "123456",
    //         func: "EncryptString",
    //     };
    //     const result = await mainAction.EncryptString(pr1, dispatch);
    //     console.log("EncryptString", result)
    // }
    // EncryptString()
    // const DecryptString = async () => {
    //     const pr2 = {
    //         Json: "MN4J4MDO/7s=",
    //         func: "DecryptString",
    //     };
    //     const result = await mainAction.DecryptString(pr2, dispatch);
    //     console.log("DecryptString", result)
    // }
    // DecryptString()

    //#endregion

    //#region regular expression
    const validEmail = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    const validPhone = new RegExp(/^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/);
    const validPass = new RegExp("^(?=.*?[a-z]).{6,24}$");
    const validWhiteSpace = new RegExp(/^\S*$/);
    const validIdentityCard = new RegExp("[0-9]");
    //#endregion

    useEffect(() => {
        if (dataarray.keys === 'check') {
            CheckOne(dataarray._row.original.AccountId, dataarray._row.original.IsCheck)
        } else if (dataarray.keys === 'delete') {
            WH_spAccount_Delete(dataarray._row.value, 1);
        } else if (dataarray.keys === 'checkall') {
            CheckOne(0, Checkall)
        }
    }, [dataarray]);

    const [ModalImg, setModalImg] = useState("");

    //#region cancel
    const WH_spAccount_Cancel = () => {
        setTitle(I18n.t("System.AddNewAccount"));
        setAccountId(0)
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setAccountCode("");
        setPassWord("");
        setConfirmPassWord("");
        setAccountName("");
        setIdentityCard("");
        setBirthday("");
        setEmail("");
        setPhone(0);
        setAddress("");
        setDescription("");
        setStatus({ value: -1 });
        setAccountGroupId({ value: -1 });
        setAreaId({ value: -1 });
        setWarehouseId({ value: -1 });
        setPositionId({ value: -1 });
        setManagerId({ value: -1 });
        setFileUpload({});
        setImages("");
        setdPass(false)
    };
    //#region 

    const WH_spAccount_Edit = (item) => {
        setTitle(I18n.t("AccountManagement.Changetheaccountinformation"));
        const data = item.row._original;
        console.log(data)
        try {
            setAccountId(data.AccountId);
            setAccountCode(data.AccountCode);
            setAccountName(data.AccountName);
            setEmail(data.Email);
            setPhone(data.Phone);
            setIdentityCard(data.IdentityCard);
            setBirthday(new Date(data.Birthday));
            setAddress(data.Address);
            setStatus({ value: data.Status });
            setPositionId({ value: data.PositionId });
            setAccountGroupId({ value: data.AccountGroupId });
            setManagerId({ value: data.ManagerId });
            setAreaId({ value: data.AreaId });
            setWarehouseId({ value: data.WarehouseId });
            setDescription(data.Description);
            document.getElementById("tab_1").click()
            setdPass(!dPass)
        } catch (error) {
            Alertwarning(I18n.t("Report.NoData"));
        }
    };

    //#region create account
    const WH_spAccount_Save = async () => {
        //kiem tra quyen luu
        if (datapermisstion !== "") {
            let a = JSON.parse(datapermisstion);
            let b = a.find(p => p.WH_tblMenuModuleId === 54 && p.Adds === 'C')
            if (b === undefined) {
                Alertwarning(I18n.t("validate.Youdonothavepermissiontocreateanaccount!"));
                return;
            }
        }

        try {
            if (AccountCode === "") {
                Alertwarning(I18n.t("validate.Pleaseenteryouraccountcode"));
                return;
            }
            if (!validWhiteSpace.test(AccountCode)) {
                Alertwarning(I18n.t("AccountManagement.Password"));
                return;
            }
            if (AccountCode.length < 6 || AccountCode.length > 24) {
                Alertwarning(I18n.t("validate.Accountcodemustbefrom6-24characters"));
                return;
            }
            if (AccountName === "") {
                Alertwarning(I18n.t("validate.Pleaseenteryourfirstandlastname"));
                return;
            }
            if (AccountId === 0 && PassWord === "") {
                Alertwarning(I18n.t("validate.Pleaseenterapassword"));
                return;
            }
            if (!validWhiteSpace.test(PassWord)) {
                Alertwarning(I18n.t("validate.Passwordmustnotcontainspaces"));
                return;
            }
            if (AccountId === 0 && PassWord !== ConfirmPassWord) {
                Alertwarning(I18n.t("validate.passwordincorrect"));
                return;
            }
            if (AccountId === 0 && !validPass.test(PassWord)) {
                Alertwarning(I18n.t("validate.Passwordmustbebetween6-24characters,includinglettersandnumbers"));
                return;
            }
            if (Email === "") {
                Alertwarning(I18n.t("validate.Pleaseenteryouremail"));
                return;
            }
            if (!validWhiteSpace.test(Email)) {
                Alertwarning(I18n.t("validate.Emailscannotcontainspaces"));
                return;
            }
            if (!validEmail.test(Email)) {
                Alertwarning(I18n.t("validate.Emailinvalidate"));
                return;
            }
            if (Phone === "") {
                Alertwarning(I18n.t("validate.Pleaseenterthephonenumber"));
                return;
            }
            if (!validPhone.test(Phone)) {
                Alertwarning(I18n.t("validate.Phonenumberisnotinthecorrectformat"));
                return;
            }
            if (IdentityCard === "") {
                Alertwarning(I18n.t("validate.PleaseenterIDcard"));
                return;
            }
            if (!validWhiteSpace.test(IdentityCard)) {
                Alertwarning(I18n.t("validate.IDcardmustnotcontainspaces"));
                return;
            }
            if (
                !validIdentityCard.test(IdentityCard) ||
                IdentityCard.length < 9 ||
                IdentityCard.length > 12
            ) {
                Alertwarning(I18n.t("validate.IDcardnumberisnotinthecorrectformat"));
                return;
            }
            if (Birthday === "") {
                Alertwarning(I18n.t("validate.Pleaseenteryourdateofbirth"));
                return;
            }
            if (Address === "") {
                Alertwarning(I18n.t("validate.Pleaseenteryouraddress"));
                return;
            }
            if (Status.value <= 0) {
                Alertwarning(I18n.t("validate.Pleaseselectworkingstatus"));
                return;
            }
            if (PositionId.value <= 0) {
                Alertwarning(I18n.t("validate.Pleasechooseservice"));
                return;
            }
            if (AccountGroupId.value <= 0) {
                Alertwarning(I18n.t("validate.Pleaseselectaccountgroup"));
                return;
            }
            if (AreaId.value <= 0) {
                Alertwarning(I18n.t("WareHouseArea.Area"));
                return;
            }
            if (WarehouseId.value <= 0) {
                Alertwarning(I18n.t("validate.PleaseselectWorkingWarehouse"));
                return;
            }
            if (ManagerId.value !== undefined && ManagerId.value <= 0) {
                Alertwarning(I18n.t("validate.Pleasechooseamanager"));
                return;
            }

            const pr1 = {
                Json: PassWord,
                func: "EncryptString",
            };
            const EncryptPassword = await mainAction.EncryptString(pr1, dispatch);
            const pr2 = {
                AccountId: AccountId,
                AccountCode: AccountCode.trim(),
                IdentityCard: IdentityCard.trim(),
                PassWord: EncryptPassword,
                AccountName: AccountName.trim(),
                Birthday: FormatDateJson(Birthday),
                Email: Email.trim(),
                Phone: Phone.trim(),
                Address: Address.trim(),
                Status: Status.value,
                AccountGroupId: AccountGroupId.value,
                AreaId: AreaId.value,
                WareHouseId: WarehouseId.value,
                ManagerId: ManagerId.value,
                PositionId: PositionId.value,
                CreateId: Accountinfor.AccountId,
                CreateName: Accountinfor.AccountName,
                Description: Description?.toString().replaceAll('"', "'").trim(),
            };
            const pr3 = {
                Json: JSON.stringify(pr2),
                func: "WH_spAccount_Save",
            };
            setDisable(false);
            const result = await mainAction.API_spCallServer(pr3, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                WH_spAccount_Cancel();
                setDisable(true);
                return;
            }
            if (result.Status === "NO") {
                Alertwarning(result.ReturnMess);
                setDisable(true);
                return;
            }
        } catch (error) {
            Alertwarning(I18n.t("Report.NoData"));
        }
    };
    //#endregion

    //#region change password
    const WH_spAccount_ChangePassword = async () => {
        try {
            let img, EncryptOldPassword, EncryptNewPassword = '';
            if (OldPassword !== "" || NewPassword !== "" || ConfirmNewPassword !== "") {
                if (
                    !validWhiteSpace.test(OldPassword) ||
                    !validWhiteSpace.test(NewPassword) ||
                    !validWhiteSpace.test(ConfirmNewPassword)
                ) {
                    Alertwarning(I18n.t("AccountManagement.Passwordmustnotcontainspaces"));
                    return;
                }
                if (NewPassword !== ConfirmNewPassword) {
                    Alertwarning(I18n.t("AccountManagement.passwordincorrect"));
                    return;
                }
                if (NewPassword !== "" && !validPass.test(NewPassword)) {
                    Alertwarning(I18n.target("AccountManagement.Passwordfrom6-24characters,includinglettersandnumbers"));
                    return;
                }
                const pr1 = {
                    Json: OldPassword.trim(),
                    func: "EncryptString",
                };
                EncryptOldPassword = await mainAction.EncryptString(pr1, dispatch);
                const pr2 = {
                    Json: NewPassword.trim(),
                    func: "EncryptString",
                };
                EncryptNewPassword = await mainAction.EncryptString(pr2, dispatch);
            }

            if (FileUpload.name !== undefined) {
                const formData = new FormData();
                formData.append("AppAPIKey", "netcoApikey2025");
                formData.append("myFile", FileUpload, FileUpload.name);
                const data = await mainAction.API_spCallPostImage(formData, dispatch);
                let _img = data.Message.replace('"', "").replace('"', "");
                img = _img.replace("[", "").replace("]", "");
            }
            if (FileUpload.name === undefined) {
                img = Images.slice(27)
            }


            const pr3 = {
                OldPassword: EncryptOldPassword ? EncryptOldPassword : "",
                NewPassword: EncryptNewPassword,
                Avatar: img,
                AccountId: Accountinfor.AccountId,
            }
            const pr4 = {
                Json: JSON.stringify(pr3),
                func: "WH_spAccount_ChangePassword",
            };
            setDisable(false);
            debugger
            const result = await mainAction.API_spCallServer(pr4, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess + ". Sign in again to update your profile picture");
                WH_spAccount_Cancel();
                setDisable(true);
                return;
            }
            if (result.Status === "NO") {
                Alertwarning(result.ReturnMess);
                setDisable(true);
                return;
            }
        } catch (error) {
            Alertwarning(I18n.t("Report.NoData"));
        }
    };
    //#endregion

    //#region show pass
    const handleClickShowPass = async () => {
        setshowpass3(!showpass3)
        if (ShowPass === undefined) {
            const getpass = {
                Json: JSON.stringify({
                    AccountId: Accountinfor.AccountId,
                    UserId: Accountinfor.AccountId,
                }),
                func: "WH_spAccount_GetPassword"
            }
            const PassWordEncryp = await mainAction.API_spCallServer(getpass, dispatch)
            if (PassWordEncryp.length > 0) {
                let _PassWordEncryp = PassWordEncryp[0].PassWord
                const paramShowPass = {
                    Json: _PassWordEncryp,
                    func: "DecryptString"
                };
                const PassWordDecrypt = await mainAction.DecryptString(paramShowPass, dispatch);
                setShowPass(PassWordDecrypt)
            } else {
                Alertwarning(I18n.t("validate.Cantgetpassword"))
            }
        }
    }
    //#endregion


    //#region render list product group
    const WH_spAccount_List = async () => {
        //kiem tra quyen xem
        if (datapermisstion !== "") {
            let a = JSON.parse(datapermisstion);
            let b = a.find(p => p.WH_tblMenuModuleId === 54 && p.Views === 'C')
            if (b === undefined) {
                Alertwarning(I18n.t("validate.Youdonothavepermissiontoviewtheaccount!"));
                return;
            }
        }
        try {
            if (Fromdate === null || Fromdate === "") {
                Alertwarning("Nhập từ ngày");
                return;
            }
            if (Todate === null || Todate === "") {
                Alertwarning("Nhập đến ngày");
                return;
            }
            const params = {
                Json: JSON.stringify({
                    AccountId: 0,
                    // Fromdate: FormatDateJson(Fromdate),
                    // Todate: FormatDateJson(Todate),
                    PhoneNumber: Phone2,
                    AccountCode: AccountCode2.trim(),
                    Status: Status2.value,
                    PositionId: PositionId2.value,
                    ManagerId: ManagerId.value,
                    WarehouseId: WarehouseId2.value,
                    AccountGroupId: AccountGroupId2.value,
                    CreateId: Accountinfor.AccountId,
                    CreateName: Accountinfor.AccountName,
                }),
                func: "WH_spAccount_List",
            };
            const list = await mainAction.API_spCallServer(params, dispatch);
            if (list.length > 0) {
                setDataAccountList(list);
            } else {
                Alertwarning(I18n.t("Report.NoData"))
                setDataAccountList([]);
            }
        } catch (error) {
            Alertwarning(I18n.t("Report.NoData"));
        }
    };
    //#endregion

    // checkbox in react table
    const CheckOne = (Id, Check) => {
        let _DataList = [...DataAccountList]
        if (Id == 0) {
            _DataList.forEach(i => { i.IsCheck = !Checkall })
            setCheckall(!Checkall)
        } else {
            if (Check === undefined)
                Check = false;
            _DataList.find((p) => p.AccountId == Id).IsCheck = !Check;
        }
        setDataAccountList(_DataList);
    };
    //#endregion


    //#region delete account group
    const WH_spAccount_Delete = (id, key) => {

        //kttra quyền xóa
        if (datapermisstion !== "") {
            let a = JSON.parse(datapermisstion);
            let b = a.find(p => p.WH_tblMenuModuleId === 54 && p.Deletes === 'C')
            if (b === undefined) {
                Alertwarning(I18n.t("validate.Youdonothavetherighttodeleteyouraccount!"));
                return;
            }

        }
        let check = DataAccountList.filter(a => a.IsCheck === true)
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
                            Id: id,
                            AccountId: Accountinfor.AccountId,
                            AccountName: Accountinfor.AccountName
                        }
                    )
                }
                if (key === 2) {
                    let data = DataAccountList.filter(a => a.IsCheck === true)
                    data.forEach(element => {
                        ar.push(
                            {
                                Id: element.AccountId,
                                AccountId: Accountinfor.AccountId,
                                AccountName: Accountinfor.AccountName
                            }
                        )
                    });
                }

                const params = {
                    Json: JSON.stringify(
                        { ListId: ar }
                    ),
                    func: "WH_spAccount_Delete"
                }
                const result = await mainAction.API_spCallServer(params, dispatch)
                if (result.Status === "OK") {
                    if (key === 1) {
                        setDataAccountList(DataAccountList.filter(a => a.AccountId !== id))
                    }
                    if (key === 2) {
                        setDataAccountList(DataAccountList.filter(a => a.IsCheck !== true))
                    }
                }
                Alertsuccess(result.ReturnMess);
            })
        } catch (error) {
            Alertwarning(I18n.t("Report.NoData"));
        }
    }
    //#endregion


    //#region show change password form
    const showChangePasswordForm = () => {
        WH_spAccount_Cancel();
        var growDiv = document.getElementById("form-collapse-hide");
        if (growDiv.clientHeight) {
            growDiv.style.height = 0;
        } else {
            growDiv.style.height = growDiv.scrollHeight + 30 + "px";
        }
    };
    //#endregion

    //#region upload file
    const onFileChange = (event) => {
        setFileUpload(event.target.files[0]);
        setImages(URL.createObjectURL(event.target.files[0]));
    };
    //#endregion

    //#region view image
    const viewImageInTable = async (img) => {
        setModalImg(img);
    };
    //#endregion

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
            accessor: "AccountId",
            special: true,
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
                            id={row.original.AccountId}
                            key={row.original.AccountId}
                            value={row.original.AccountId}
                            checked={row.original.IsCheck}
                            onChange={(e) => setdataarray({ _row: row, keys: "check" })}
                        />
                        <label
                            className="label checkbox"
                            htmlFor={row.original.AccountId}
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
            accessor: "AccountId",
            special: true,
            show: true,
            Cell: (row) => (
                <span>
                    <button
                        data-tooltip={I18n.t("AccountGroup.Detail")}
                        className="btn btn-sm btn-info mr-2 show__tip__left"
                        data-toggle="modal"
                        data-target="#myModal2"
                    >
                        <i className="fa-solid fa-eye"></i>
                        {/* Chi tiết */}
                    </button>
                    <button
                        data-tooltip={I18n.t("AccountGroup.Edit")}
                        className="btn btn-sm btn-success mr-2 show__tip__left"
                        data-toggle="modal"
                        data-target="#myModal1"
                        onClick={(e) => WH_spAccount_Edit(row)}
                    >
                        <i className="fas fa-wrench"></i>
                        {/* Sửa */}
                    </button>
                    <button
                        data-tooltip={I18n.t("AccountGroup.Delete")}
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
                        onClick={(e) => {
                            viewImageInTable(row.original.Avatar);
                        }}
                        title="Click để xem hình lớn"
                    >
                        {row.original.Avatar !== undefined ? <img src={row.original.Avatar} height="30" width="50" /> : <></>}
                    </a>
                </div>
            ),
        },
        {
            Header: I18n.t("AccountManagement.AccountCode"),
            accessor: "AccountCode",
            width: 150
        },
        {
            Header: I18n.t("AccountManagement.AccountName"),
            accessor: "AccountName",
            width: 150
        },
        {
            Header: I18n.t("AccountGroup.IdentityCard/CitizenIdentity"),
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
            Header: I18n.t("AccountGroup.Address"),
            accessor: "Address",
            width: 150
        },
        {
            Header: I18n.t("AccountGroup.Status"),
            accessor: "StatusName",
            width: 150
        },
        {
            Header: I18n.t("AccountGroup.AccountGroup"),
            accessor: "GroupName",
            width: 150
        },
        {
            Header: I18n.t("AccountManagement.Area"),
            accessor: "Name",
            width: 150
        },
        {
            Header: I18n.t("AccountGroup.Warehouse"),
            accessor: "WareHouseName",
            width: 150
        },
        {
            Header: I18n.t("AccountGroup.Position"),
            accessor: "PositionName",
            width: 150
        },
        {
            Header: I18n.t("AccountManagement.Manager"),
            accessor: "ManagerName",
            width: 150
        },
        {
            Header: I18n.t("AccountManagement.Create"),
            accessor: "CreateName",
            width: 150
        },
        {
            Header: I18n.t("AccountManagement.CreateTime"),
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
    //#endregion

    // const columns2 = [
    //     {
    //         Header: (
    //             <div className="col-sm-12">
    //                 <div class="icheck-success d-inline">
    //                     <input type="checkbox" id="checkbox"
    //                         onChange={e => {
    //                             setdataarray({ keys: 'checkall' })
    //                         }} />
    //                     <label htmlFor="checkbox" className="label checkbox"></label>
    //                 </div>
    //             </div>
    //         ),
    //         accessor: "AccountId",
    //         special: true,
    //         filterable: false,
    //         sortable: false,
    //         width: 60,
    //         maxWidth: 50,
    //         textAlign: "center",
    //         special: true,
    //         show: true,
    //         Cell: (row) => (
    //             <div className="col-sm-12">
    //                 <div className="icheck-success d-inline">
    //                     <input
    //                         type="checkbox"
    //                         id={row.original.AccountId}
    //                         key={row.original.AccountId}
    //                         value={row.original.AccountId}
    //                         checked={row.original.IsCheck}
    //                         onChange={(e) => setdataarray({ _row: row, keys: "check" })}
    //                     />
    //                     <label
    //                         className="label checkbox"
    //                         htmlFor={row.original.AccountId}
    //                     ></label>
    //                 </div>
    //             </div>
    //         ),
    //     },
    //     {
    //         Header: I18n.t("System.Option"),
    //         width: 180,
    //         filterable: false,
    //         sortable: false,
    //         accessor: "AccountId",
    //         special: true,
    //         show: true,
    //         Cell: (row) => (
    //             <span>
    //                 <button
    //                     data-tooltip={I18n.t("AccountGroup.Detail")}
    //                     className="btn btn-sm btn-info mr-2 show__tip__left"
    //                     data-toggle="modal"
    //                     data-target="#myModal2"
    //                 >
    //                     <i className="fa-solid fa-eye"></i>
    //                     {/* Chi tiết */}
    //                 </button>
    //                 <button
    //                     data-tooltip={I18n.t("AccountGroup.Edit")}
    //                     className="btn btn-sm btn-success mr-2 show__tip__left"
    //                     data-toggle="modal"
    //                     data-target="#myModal1"
    //                     onClick={(e) => WH_spAccount_Edit(row)}
    //                 >
    //                     <i className="fas fa-wrench"></i>
    //                     {/* Sửa */}
    //                 </button>
    //                 <button
    //                     data-tooltip={I18n.t("AccountGroup.Delete")}
    //                     className="btn btn-sm btn-danger show__tip__right"
    //                     onClick={(e) => setdataarray({ _row: row, keys: "delete" })}
    //                 >
    //                     <i className="fa fa-trash"></i>
    //                     {/* Xóa */}
    //                 </button>
    //             </span>
    //         ),
    //     },
    //     {
    //         Header: I18n.t("Report.STT"),
    //         Cell: (row) => <span>{row.index + 1}</span>,
    //         width: 50,
    //         filterable: false,
    //         special: true,
    //         show: true,
    //     },
    //     {
    //         Header: I18n.t("AccountGroup.Picture"),
    //         accessor: "Avatar",
    //         filterable: false,
    //         sortable: false,
    //         Cell: (row) => (
    //             <div>
    //                 <a
    //                     className="cursor"
    //                     data-toggle="modal"
    //                     data-target="#modalImg"
    //                     onClick={(e) => {
    //                         viewImageInTable(row.original.Avatar);
    //                     }}
    //                     title="Click để xem hình lớn"
    //                 >
    //                     {row.original.Avatar !== undefined ? <img src={row.original.Avatar} height="30" width="50" /> : <></>}
    //                 </a>
    //             </div>
    //         ),
    //     },
    //     {
    //         Header: I18n.t("AccountManagement.AccountCode"),
    //         accessor: "AccountCode",
    //         width: 150
    //     },
    //     {
    //         Header: I18n.t("AccountManagement.AccountName"),
    //         accessor: "AccountName",
    //         width: 150
    //     },
    //     {
    //         Header: I18n.t("AccountGroup.IdentityCard/CitizenIdentity"),
    //         accessor: "IdentityCard",
    //         width: 150
    //     },
    //     {
    //         Header: I18n.t("AccountGroup.Birthday"),
    //         accessor: "Birthday",
    //         Cell: (obj) => FormatDateJson(obj.value, 5),
    //         width: 150
    //     },
    //     {
    //         Header: I18n.t("AccountGroup.Email"),
    //         accessor: "Email",
    //         width: 200
    //     },
    //     {
    //         Header: I18n.t("AccountGroup.Phone"),
    //         accessor: "Phone",
    //         width: 150
    //     },
    //     {
    //         Header: I18n.t("AccountGroup.Address"),
    //         accessor: "Address",
    //         width: 150
    //     },
    //     {
    //         Header: I18n.t("AccountGroup.Status"),
    //         accessor: "StatusName",
    //         width: 150
    //     },
    //     {
    //         Header: I18n.t("AccountGroup.AccountGroup"),
    //         accessor: "GroupName",
    //         width: 150
    //     },
    //     {
    //         Header: I18n.t("AccountManagement.Area"),
    //         accessor: "Name",
    //         width: 150
    //     },
    //     {
    //         Header: I18n.t("AccountGroup.Warehouse"),
    //         accessor: "WareHouseName",
    //         width: 150
    //     },
    //     {
    //         Header: I18n.t("AccountGroup.Position"),
    //         accessor: "PositionName",
    //         width: 150
    //     },
    //     {
    //         Header: I18n.t("AccountManagement.Manager"),
    //         accessor: "ManagerName",
    //         width: 150
    //     },
    //     {
    //         Header: I18n.t("AccountManagement.Create"),
    //         accessor: "CreateName",
    //         width: 150
    //     },
    //     {
    //         Header: I18n.t("AccountManagement.CreateTime"),
    //         accessor: "CreateTime",
    //         Cell: (obj) => FormatDateJson(obj.value),
    //         width: 180
    //     },
    //     {
    //         Header: I18n.t("System.EditBy"),
    //         accessor: "EditName",
    //         width: 150,
    //     },
    //     {
    //         Header: I18n.t("System.EditDate"),
    //         accessor: "EditTime",
    //         Cell: (obj) => FormatDateJson(obj.value),
    //         width: 180,
    //     },
    //     {
    //         Header: I18n.t("System.Note"),
    //         accessor: "Description",
    //         width: 150
    //     },
    // ]

    const Exportexcel = () => {
        // kiem tra quyen Excel
        if (datapermisstion !== "") {
            let a = JSON.parse(datapermisstion);

            let b = a.find(p => p.WH_tblMenuModuleId === 54 && p.Excel === 'C')
            if (b === undefined) {
                Alertwarning(I18n.t("validate.YoudonothavepermissiontoexportExcel!"));
                return;
            }
        }
        if (DataAccountList.length === 0) {
            Alertwarning(I18n.t("ImportRatioCustomerReport.Noexceldatayet"))
            return
        }
        const newData = DataAccountList.map(element => {
            return {
                "Hình ảnh": element.Avatar,
                "Mã tài khoản": element.AccountCode,
                "Tên tài khoản": element.AccountName,
                "CMND/CCCD": element.IdentityCard,
                "Ngày sinh": FormatDateJson(element.Birthday, 'd/k/y'),
                "Email": element.Email,
                "Số điện thoại": element.Phone,
                "Địa chỉ": element.Address,
                "Trạng thái": element.StatusName,
                "Nhóm tài khoản": element.GroupName,
                "Kho": element.WareHouseName,
                "Chức vụ": element.PositionName,
                "Người tạo": element.CreateName,
                "Ngày tạo": FormatDateJson(element.CreateTime),
                "Người sửa": element.EditName,
                "Ngày sửa": FormatDateJson(element.EditTime),
                "Ghi chú": element.Description,
            }
        })
        newData.forEach(function (x) {
            if (columns.find(a => a.accessor == 'Avatar') === undefined) { delete x["Hình ảnh"] }
            else if (columns.find(a => a.accessor === 'Avatar').show === false) { delete x["Hình ảnh"] }
            if (columns.find(a => a.accessor == 'AccountCode') === undefined) { delete x["Mã tài khoản"] }
            else if (columns.find(a => a.accessor === 'AccountCode').show === false) { delete x["Mã tài khoản"] }
            if (columns.find(a => a.accessor == 'AccountName') === undefined) { delete x["Tên tài khoản"] }
            else if (columns.find(a => a.accessor === 'AccountName').show === false) { delete x["Tên tài khoản"] }
            if (columns.find(a => a.accessor == 'IdentityCard') === undefined) { delete x["CMND/CCCD"] }
            else if (columns.find(a => a.accessor === 'IdentityCard').show === false) { delete x["CMND/CCCD"] }
            if (columns.find(a => a.accessor == 'Birthday') === undefined) { delete x["Ngày sinh"] }
            else if (columns.find(a => a.accessor === 'Birthday').show === false) { delete x["Ngày sinh"] }
            if (columns.find(a => a.accessor == 'Email') === undefined) { delete x["Email"] }
            else if (columns.find(a => a.accessor === 'Email').show === false) { delete x["Email"] }
            if (columns.find(a => a.accessor == 'Phone') === undefined) { delete x["Số điện thoại"] }
            else if (columns.find(a => a.accessor === 'Phone').show === false) { delete x["Số điện thoại"] }
            if (columns.find(a => a.accessor == 'Address') === undefined) { delete x["Địa chỉ"] }
            else if (columns.find(a => a.accessor === 'Address').show === false) { delete x["Địa chỉ"] }
            if (columns.find(a => a.accessor == 'StatusName') === undefined) { delete x["Trạng thái"] }
            else if (columns.find(a => a.accessor === 'StatusName').show === false) { delete x["Trạng thái"] }
            if (columns.find(a => a.accessor == 'GroupName') === undefined) { delete x["Nhóm tài khoản"] }
            else if (columns.find(a => a.accessor === 'GroupName').show === false) { delete x["Nhóm tài khoản"] }
            if (columns.find(a => a.accessor == 'WareHouseName') === undefined) { delete x["Kho"] }
            else if (columns.find(a => a.accessor === 'WareHouseName').show === false) { delete x["Kho"] }
            if (columns.find(a => a.accessor == 'PositionName') === undefined) { delete x["Chức vụ"] }
            else if (columns.find(a => a.accessor === 'PositionName').show === false) { delete x["Chức vụ"] }

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
        ExportExcel(newData, "Danh sach tai khoan");
    }

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
                                Hình ảnh
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
    //#endregion

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
                                <a className="nav-link " id="tab_2" href="#tab_2_list" data-toggle="tab">
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
                                                        {Title}
                                                    </span>
                                                </h3>
                                            </div>
                                            <div className="col-md-6 card-header-btn">
                                                <a
                                                    className="btn btn-danger btn-sm float-right btn-header"
                                                    onClick={e => WH_spAccount_Cancel()}
                                                >
                                                    <i className="fa fa-trash mr-2 " />
                                                    {I18n.t("System.Cancel")}
                                                </a>
                                                <a
                                                    className="btn btn-success btn-sm float-right btn-header"
                                                    onClick={e => WH_spAccount_Save()}
                                                    disabled={!disable}
                                                >
                                                    <i className="fa fa-folder mr-2 " />
                                                    {I18n.t("System.Save")}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Begin Account card */}
                                    <div className="card-body-form view__user mt-5">
                                        <div className="row view__user__header ml-3 mr-2">
                                            <h4 className="font-weight-bold">
                                                {I18n.t("System.PersonalInformation")}
                                            </h4>
                                            <a
                                                className="btn btn-success"
                                                onClick={e => showChangePasswordForm()}
                                            >
                                                <i className="fas fa-user-edit" />
                                            </a>
                                        </div>
                                        <div className="row ml-0 mr-0 pb-4">
                                            <div className="col-md-2 avatar-card">
                                                {/* <img src="../../assets/img/faces/avatar.jpg" className="user__avatar" /> */}
                                                <img
                                                    src={
                                                        Accountinfor?.Avatar === "" || Accountinfor?.Avatar === undefined
                                                            ? "../../assets/img/user.png"
                                                            : Accountinfor?.Avatar
                                                    }
                                                    className="user__avatar"
                                                />
                                            </div>
                                            <div className="col-md-10">
                                                <div className="row">
                                                    {/* <div className="btn-arrow-up-down">
                                                        <a className="btn">
                                                            <i className="fas fa-chevron-up" />
                                                        </a>
                                                    </div>
                                                    <div className="col-md-1 btn-arrow-left-right">
                                                        <a className="btn">
                                                            <i className="fas fa-chevron-left" />
                                                        </a>
                                                    </div> */}
                                                    <div className="col-md col-sm-6 col-xs  user__info__card BG__9DFAF7">
                                                        <p className="user__info__text">
                                                            {I18n.t("AccountManagement.AccountCode")}:
                                                            <span> {Accountinfor?.AccountCode}</span>
                                                        </p>
                                                        <p className="user__info__text">
                                                            {I18n.t("AccountManagement.FullName")}:
                                                            <span> {Accountinfor?.AccountName}</span>
                                                        </p>
                                                        <p className="user__info__text">
                                                            {I18n.t("AccountManagement.Phone")}:
                                                            <span> {Accountinfor?.Phone}</span>
                                                        </p>
                                                    </div>
                                                    <div className="col-md col-sm-6 col-xs  user__info__card BG__F2EEE2">
                                                        <p className="user__info__text">
                                                            {I18n.t("AccountGroup.IdentityCard/CitizenIdentity")}:
                                                            <span> {Accountinfor?.IdentityCard}</span>
                                                        </p>
                                                        <p className="user__info__text">
                                                            {I18n.t("AccountManagement.Dateofbirth")}:
                                                            <span>
                                                                {" "}
                                                                {FormatDateJson(Accountinfor?.Birthday, 1)}
                                                            </span>
                                                        </p>
                                                        <p className="user__info__text">
                                                            {I18n.t("AccountManagement.Address")}:
                                                            <span> {Accountinfor?.Address}</span>
                                                        </p>
                                                    </div>
                                                    <div className="col-md col-sm-6 col-xs  user__info__card BG__F2E2F0">
                                                        <p className="user__info__text">
                                                            {I18n.t("AccountManagement.WorkingBranch")}:
                                                            <span> {Accountinfor?.WareHouseName}</span>
                                                        </p>
                                                        <p className="user__info__text">
                                                            {I18n.t("AccountManagement.AccountGroup")}:
                                                            <span> {Accountinfor?.GroupName}</span>
                                                        </p>
                                                        <p className="user__info__text">
                                                            {I18n.t("AccountManagement.Position")}:
                                                            <span> {Accountinfor?.PositionName}</span>
                                                        </p>
                                                    </div>
                                                    <div className="col-md col-sm-6 col-xs  user__info__card BG__E2E3F2">
                                                        <p className="user__info__text">
                                                            {I18n.t("AccountManagement.Status")}:
                                                            <span> {Accountinfor?.StatusName}</span>
                                                        </p>
                                                        <p className="user__info__text">
                                                            {I18n.t("AccountManagement.Email")}:
                                                            <span> {Accountinfor?.Email}</span>
                                                        </p>
                                                        <p className="user__info__text">
                                                            {I18n.t("AccountManagement.Password")}:
                                                            {!showpass3 ?
                                                                <>
                                                                    <span> **** </span>
                                                                    <i className="fa-solid fa-eye-slash showpass_icon float-right" onClick={e => handleClickShowPass()} />
                                                                </> :
                                                                <>
                                                                    <span> {ShowPass}</span>
                                                                    <i style={{ paddingRight: '1px' }} className="fa-solid fa-eye showpass_icon float-right" onClick={e => handleClickShowPass()} />
                                                                </>
                                                            }
                                                        </p>
                                                    </div>
                                                    {/* <div className="col-md-1 btn-arrow-left-right">
                                                        <a className="btn">
                                                            <i className="fas fa-chevron-right" />
                                                        </a>
                                                    </div>
                                                    <div className="btn-arrow-up-down">
                                                        <a className="btn">
                                                            <i className="fas fa-chevron-down" />
                                                        </a>
                                                    </div> */}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Begin Change Password Form */}
                                        <div id="form-collapse-hide">
                                            <div className="row edit__user">
                                                <div className="col">
                                                    <div className="row header__changepass">
                                                        <h4 className="font-weight-bold">
                                                            <i className="fas fa-user-edit mr-1" />
                                                            {I18n.t("AccountManagement.Changethepassword")}
                                                        </h4>
                                                        <a
                                                            className="btn btn__default"
                                                            onClick={e => showChangePasswordForm()}
                                                        >
                                                            <i className="fa fa-times-circle edit__close__icon" />
                                                        </a>
                                                    </div>
                                                    <div className="row edit__user__form">
                                                        <div className="col-md-2 avatar-card">
                                                            {Accountinfor?.Avatar === undefined ?
                                                                <img src={Images ? Images : "../../assets/img/user.png"} className="user__avatar" /> :
                                                                <img src={!Images ? Accountinfor.Avatar : Images} className="user__avatar" />
                                                            }
                                                            <div className="upload__contaiter">
                                                                <input
                                                                    type="file"
                                                                    className="upload__avatar"
                                                                    onChange={e => onFileChange(e)}
                                                                    accept="image/*"
                                                                />
                                                                <button type="button" className="btn">
                                                                    <i className="fa fa-camera edit__user__btn__avatar"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-10">
                                                            <div className="row">
                                                                <div className="col-md-6 col-sm-6">
                                                                    <div className="form-group">
                                                                        <label className="form__title">
                                                                            {I18n.t("AccountManagement.Current password")}{" "}
                                                                            <span className="form__title__note">
                                                                                (*)
                                                                            </span>
                                                                        </label>
                                                                        <div className="center-icon">
                                                                            <input
                                                                                type={!showpass4 ? "password" : "text"}
                                                                                className="form-control"
                                                                                placeholder=""
                                                                                value={OldPassword}
                                                                                onChange={(e) => setOldPassword(e.target.value)}
                                                                            />
                                                                            {!showpass4 ? <i className="fa-solid fa-eye-slash showpass_icon2" onClick={a => setshowpass4(!showpass4)} /> : <i style={{ paddingRight: '1px' }} className="fa-solid fa-eye showpass_icon2" onClick={a => setshowpass4(!showpass4)} />}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6 col-sm-6">
                                                                    <div className="form-group">
                                                                        <label className="form__title">
                                                                            {I18n.t("AccountManagement.Anewpassword")} {" "}
                                                                            <span className="form__title__note">
                                                                                (*)
                                                                            </span>
                                                                        </label>
                                                                        <div className="center-icon">
                                                                            <input
                                                                                type={!showpass5 ? "password" : "text"}
                                                                                className="form-control"
                                                                                placeholder=""
                                                                                value={NewPassword}
                                                                                onChange={(e) => setNewPassword(e.target.value)}
                                                                            />
                                                                            {!showpass5 ? <i className="fa-solid fa-eye-slash showpass_icon2" onClick={a => setshowpass5(!showpass5)} /> : <i style={{ paddingRight: '1px' }} className="fa-solid fa-eye showpass_icon2" onClick={a => setshowpass5(!showpass5)} />}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6 col-sm-6">
                                                                    <div className="form-group">
                                                                        <label className="form__title">
                                                                            {I18n.t("AccountManagement.Confirmpassword")}{" "}
                                                                            <span className="form__title__note">
                                                                                (*)
                                                                            </span>
                                                                        </label>
                                                                        <div className="center-icon">
                                                                            <input
                                                                                type={!showpass6 ? "password" : "text"}
                                                                                className="form-control"
                                                                                placeholder=""
                                                                                value={ConfirmNewPassword}
                                                                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                                                            />
                                                                            {!showpass6 ? <i className="fa-solid fa-eye-slash showpass_icon2" onClick={a => setshowpass6(!showpass6)} /> : <i style={{ paddingRight: '1px' }} className="fa-solid fa-eye showpass_icon2" onClick={a => setshowpass6(!showpass6)} />}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6 col-sm-6">
                                                                    <div className="form-group">
                                                                        <label className="form__title">
                                                                            {I18n.t("AccountManagement.EnterOTPCode")}{" "}
                                                                            <span className="form__title__note">
                                                                                (*)
                                                                            </span>
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder=""
                                                                            disabled={true}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                {/* <a href="#" className="edit__user__btn__link">
                                                                    Gửi lại ?
                                                                </a> */}
                                                                <button
                                                                    type="button"
                                                                    className="btn btn__save__w95h40 margin-auto  mt-4"
                                                                    onClick={e => WH_spAccount_ChangePassword()}
                                                                    disabled={!disable}
                                                                >
                                                                    {I18n.t("AccountManagement.Confirm")}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* End Change Password Form */}
                                    </div>
                                    {/* End Account card */}
                                    {/* Begin Account form */}
                                    <div className="card-body form__user mt-4 mb-4">
                                        <div className="row mt-3">
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                        {I18n.t("AccountManagement.AccountCode")}
                                                        <span className="form__title__note"> (*)</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder=""
                                                        value={AccountCode}
                                                        onChange={(e) => setAccountCode(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                        {I18n.t("AccountManagement.Firstandlastname")}
                                                        <span className="form__title__note"> (*)</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder=""
                                                        value={AccountName}
                                                        onChange={(e) => setAccountName(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                        {I18n.t("AccountManagement.Password")}
                                                        <span className="form__title__note"> (*)</span>
                                                    </label>
                                                    <div className="center-icon">
                                                        <input
                                                            type={!showpass1 ? "password" : "text"}
                                                            className="form-control"
                                                            placeholder=""
                                                            value={PassWord}
                                                            disabled={dPass ? true : false}
                                                            onChange={(e) => setPassWord(e.target.value.trim())}
                                                        />
                                                        {!showpass1 ? <i className="fa-solid fa-eye-slash showpass_icon" onClick={a => setshowpass1(!showpass1)} /> : <i style={{ paddingRight: '1px' }} className="fa-solid fa-eye showpass_icon" onClick={a => setshowpass1(!showpass1)} />}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                        {I18n.t("AccountManagement.Enterthepassword")}
                                                        <span className="form__title__note"> (*)</span>
                                                    </label>
                                                    <div className="center-icon">
                                                        <input
                                                            type={!showpass2 ? "password" : "text"}
                                                            className="form-control"
                                                            placeholder=""
                                                            value={ConfirmPassWord}
                                                            disabled={dPass ? true : false}
                                                            onChange={(e) => setConfirmPassWord(e.target.value)}
                                                        />
                                                        {!showpass2 ? <i className="fa-solid fa-eye-slash showpass_icon" onClick={a => setshowpass2(!showpass2)} /> : <i style={{ paddingRight: '1px' }} className="fa-solid fa-eye showpass_icon" onClick={a => setshowpass2(!showpass2)} />}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                        {I18n.t("AccountManagement.Email")}
                                                        <span className="form__title__note"> (*)</span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        placeholder=""
                                                        value={Email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                        {I18n.t("AccountManagement.Phone")}
                                                        <span className="form__title__note"> (*)</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder=""
                                                        value={Phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                        {I18n.t("AccountGroup.IdentityCard/CitizenIdentity")}
                                                        <span className="form__title__note"> (*)</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder=""
                                                        value={IdentityCard}
                                                        onChange={(e) => setIdentityCard(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                        {I18n.t("AccountManagement.Dateofbirth")}
                                                        <span className="form__title__note"> (*)</span>
                                                    </label>
                                                    <DateTimePicker
                                                        className="form-control"
                                                        onChange={(date) => setBirthday(date)}
                                                        value={Birthday}
                                                        format="MM/dd/yyyy"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                        {I18n.t("AccountManagement.Address")}
                                                        <span className="form__title__note"> (*)</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder=""
                                                        value={Address}
                                                        onChange={(e) => setAddress(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                        {I18n.t("AccountManagement.WorkingStatus")}
                                                        <span className="form__title__note"> (*)</span>
                                                    </label>
                                                    <SelectStatus
                                                        onSelected={(e) => setStatus(e)}
                                                        items={Status.value}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                        {I18n.t("AccountManagement.Position")}
                                                        <span className="form__title__note"> (*)</span>
                                                    </label>
                                                    <SelectPosition
                                                        onSelected={(e) => {
                                                            setPositionId(e)
                                                        }}
                                                        items={PositionId.value}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                        {I18n.t("AccountManagement.AccountGroup")}
                                                        <span className="form__title__note"> (*)</span>
                                                    </label>
                                                    <SelectAccountGroup
                                                        onSelected={(e) => setAccountGroupId(e)}
                                                        items={AccountGroupId.value}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                        {I18n.t("AccountManagement.Area")}
                                                        <span className="form__title__note"> (*)</span>
                                                    </label>
                                                    <SelectArea
                                                        onSelected={e => {
                                                            setAreaId(e)
                                                            setWarehouseId({ value: -1 })
                                                        }}
                                                        onAreaId={AreaId.value}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                        {I18n.t("AccountManagement.Warehouse")}
                                                        <span className="form__title__note"> (*)</span>
                                                    </label>
                                                    <SelectWarehouse
                                                        onSelected={e => {
                                                            setWarehouseId(e)
                                                            setManagerId({ value: -1 })
                                                        }}
                                                        AreaId={AreaId.value}
                                                        items={WarehouseId.value}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                        {I18n.t("AccountManagement.Manager")}
                                                        <span className="form__title__note"> (*)</span>
                                                    </label>
                                                    <SelectAccount
                                                        onSelected={(e) => setManagerId(e)}
                                                        // WarehouseId={WarehouseId.value === -1 ? 0 : WarehouseId.value}
                                                        items={ManagerId.value}
                                                        onAccountId={ManagerId.value}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title"> {I18n.t("AccountManagement.Note")}</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder=""
                                                        value={Description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {/* Begin Account form */}
                                    </div>
                                    {/* End Account form */}
                                </div>
                                <div
                                    className="tab-pane fade"
                                    id="tab_2_list"
                                    role="tabpanel"
                                    aria-labelledby="custom-tabs-two-profile-tab"
                                >
                                    {/* Header */}
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <h3 className="card-title">
                                                    <i className="fa fa-bars" />
                                                    <span className="font-weight-bold">
                                                        {I18n.t("System.AccountList")} ({DataAccountList.length})
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
                                                    onClick={e => WH_spAccount_Delete(0, 2)}
                                                >
                                                    <i className="fa fa-trash mr-2" />
                                                    {I18n.t("System.Delete")}
                                                </a>
                                                <a
                                                    className="btn btn-primary btn-sm float-right btn-header"
                                                    onClick={e => WH_spAccount_List()}
                                                >
                                                    <i className="fa fa-eye mr-2" />
                                                    {I18n.t("System.View")}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Begin Account form */}
                                    <div className="card-body">
                                        <div className="form__user">
                                            <div className="row mt-3">
                                                <div className="col-md-3 col-sm-6">
                                                    <div className="form-group">
                                                        <label className="form__title">
                                                            {I18n.t("AccountManagement.AccountCode")}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder=""
                                                            value={AccountCode2}
                                                            onChange={(e) => setAccountCode2(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <div className="form-group">
                                                        <label className="form__title">
                                                            {I18n.t("AccountManagement.Phone")}
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder=""
                                                            value={Phone2}
                                                            onChange={(e) => setPhone2(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <div className="form-group">
                                                        <label className="form__title">
                                                            {I18n.t("AccountManagement.WorkingStatus")}
                                                        </label>
                                                        <SelectStatus
                                                            onSelected={(e) => setStatus2(e)}
                                                            items={Status2.value}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <div className="form-group">
                                                        <label className="form__title">
                                                            {I18n.t("AccountManagement.Position")}
                                                        </label>
                                                        <SelectPosition
                                                            onSelected={(e) => setPositionId2(e)}
                                                            items={PositionId2.value}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <div className="form-group">
                                                        <label className="form__title">
                                                            {I18n.t("AccountManagement.AccountGroup")}
                                                        </label>
                                                        <SelectAccountGroup
                                                            onSelected={(e) => setAccountGroupId2(e)}
                                                            items={AccountGroupId2.value}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <div className="form-group">
                                                        <label className="form__title">
                                                            {I18n.t("AccountManagement.Area")}
                                                        </label>
                                                        <SelectArea
                                                            onSelected={(e) => {
                                                                setAreaId2(e)
                                                                setWarehouseId2({ value: -1 })
                                                            }}
                                                            onAreaId={AreaId2.value}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <div className="form-group">
                                                        <label className="form__title">
                                                            {I18n.t("AccountManagement.Warehouse")}
                                                        </label>
                                                        <SelectWarehouse
                                                            onSelected={e => setWarehouseId2(e)}
                                                            AreaId={AreaId2.value}
                                                            items={WarehouseId2.value}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Account form */}
                                    {/* Begin Account List */}
                                    <div className={DataAccountList.length > 0 ? "" : "display-none"}>
                                        {/* <DataTable
                                            data={DataAccountList}
                                            columns={columns2}
                                        /> */}
                                        <SettingColumn
                                            columns={columns}
                                            Returndata={a => setcolumns(a)}
                                        />
                                        <DataTable
                                            data={DataAccountList}
                                            columns={columns}
                                        />
                                        {ViewImg}
                                    </div>
                                    {/* End Account List */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        </div >
    );
};
