import React, { useState, useEffect, useRef } from "react";
import I18n from "../../../Language";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../Redux/Actions";
import { DataTable } from "../../../Common/DataTable";
import { Alerterror, Alertsuccess, Alertwarning, FormatDate, FormatDateJson, FirstOrLastDayinMonth, GetDataFromLogin, ExportExcel } from "../../../Utils";
import { SelectArea, SelectLocationAddress, SelectWarehouse, SelectAccount, SelectShelves, SelectWarehouseArea, SettingColumn, SelectFloor } from '../../../Common';
import DateTimePicker from "react-datetime-picker";
import { ConfirmAlert } from "../../../Utils";
export const WareHouseFloor = () => {

 
    //#end regon
    //tab hiện thị sửa trên table
    const [tittle, setTitle] = useState(I18n.t("validate.ADDNEWFLOOR"))
    //khai báo biến để nhận dữ liệu
    ////transmission CreateName,EditName

    const AccountId = GetDataFromLogin("AccountId");
    const AccountName = GetDataFromLogin("AccountName");
    let datapermisstion = localStorage.getItem("Permissioninfor");//check quyền

    //load Area
    const [AreaId, setAreaId] = useState(-1);
    const onSelectArea = (areaId) => {
        setAreaId(areaId);
    }
    //load WareHouseCode
    const [WarehouseId, setWarehouseId] = useState(-1);
    const onSelectWarehouse = (WarehouseId) => {
        setWarehouseId(WarehouseId);
    }
    //load WareHouseAreaCode
    const [WarehouseAreaId, setWarehouseAreaId] = useState(-1);
    const onSelectWarehouseArea = (WarehouseAreaId) => {
        setWarehouseAreaId(WarehouseAreaId);
    }
    //load Shelves
    const [ShelvesId, setShelvesId] = useState(-1);
    const onSelectShelves = (ShelvesId) => {
        setShelvesId(ShelvesId);
    }
    ///
    //declare variable to receive data
    const [FloorId, setFloorId] = useState(0);
    const [FloorCode, setFloorCode] = useState('');
    const [FloorName, setFloorName] = useState('');
    const [Description, setDescription] = useState('');
    const [Images, setImages] = useState('');
    const [Length, setLength] = useState('');
    const [Height, setHeight] = useState('');
    const [Width, setWidth] = useState('');
    const [SquareMeters, setSquareMeters] = useState('');
    const dispatch = useDispatch();
    const [disable, setDisable] = useState(true);
    const [FileUpload, setFileUpload] = useState({});
    const [Users, setUsers] = useState();
    const [Password, setPassword] = useState();
    const [Domain, setDomain] = useState();
    const [Channels, setChannels] = useState();
    // const [disbtn,setdisbtn] = useState();
    // const [State, setState] = useState();
    const [CreateName, setCreateName] = useState();
    const Accountinfor = JSON.parse(localStorage.getItem("Accountinfor") === "" ? "{}" : localStorage.getItem("Accountinfor"));

    // save
    const WH_spWareHouse_Floor_Save = async () => {
        {//kiem tra quyen luu
            if (datapermisstion !== "") {
                let a = JSON.parse(datapermisstion);
                let b = a.find(p => p.WH_tblMenuModuleId === 66 && p.Adds === 'C')
                if (b === undefined) {
                    Alertwarning(I18n.t("validate.Youdonothavepermissiontocreatefloors!"));
                    return;
                }
            }
            if (AreaId === -1) {
                Alertwarning(I18n.t("validate.PleaseSelectRegion!"));
                return;
            }
            if (WarehouseId === -1) {
                Alertwarning(I18n.t("validate.PleaseEnterWarehouseName!"));
                return;
            }
            if (WarehouseAreaId === -1) {
                Alertwarning(I18n.t("validate.PleaseSelectWarehouseArea!"));
                return;
            }
            if (ShelvesId === -1 || ShelvesId == 0) {
                Alertwarning(I18n.t("validate.PleaseChooseShelves!"));
                return;
            }
            if (FloorCode === "") {
                Alertwarning(I18n.t("validate.Enterthefloorcode!"));
                return;
            }
            if (FloorName === "") {
                Alertwarning(I18n.t("validate.Enterthefloorname!"));
                return;
            }
            if (Length === "") {//||Length == 0 
                Alertwarning(I18n.t("validate.PleaseEnterLength!"));
                return;
            }
            if (Length == 0) {
                Alertwarning(I18n.t("validate.PleaseEnterlengthgreaterthan0!"));
                return;
            }
            if (Width === "") {
                Alertwarning(I18n.t("validate.PleaseEnterWidth!"));
                return;
            }
            if (Width == 0) {
                Alertwarning(I18n.t("validate.PleaseEnterwidthgreaterthan0!"));
                return;
            }
            if (Height === "") {
                Alertwarning((I18n.t("validate.PleaseEnterHeight!")));
                return;
            }
            if (Height == 0) {
                Alertwarning(I18n.t("validate.PleaseEnterheightgreaterthan0!"));
                return;
            }
            if (Images === "") {
                Alertwarning(I18n.t("validate.PleaseChooseImage!"));
                return;
            }
            if (FileUpload.name !== undefined) {
                const formData = new FormData();
                formData.append("AppAPIKey", "netcoApikey2025");
                formData.append("myFile", FileUpload, FileUpload.name);
                const data = await mainAction.API_spCallPostImage(formData, dispatch);
                let _img = data.Message.replace('"', "").replace('"', "");
                var img = _img.replace("[", "").replace("]", "");
            }

            if (FileUpload.name === undefined) {
                var img = Images.slice(27)
            }
            const pr = {
                FloorId: FloorId,
                AreaId: AreaId,
                ShelvesId: ShelvesId,
                WarehouseId: WarehouseId,
                WarehouseAreaId: WarehouseAreaId,
                FloorCode: FloorCode,
                FloorName: FloorName.trim(),
                Images: img,
                Length: Length,
                Width: Width,
                Height: Height,
                SquareMeters: Length * Width,
                Description: Description.toString().replaceAll('"', "'"),
                CreateId: Accountinfor.AccountId,
                CreateName: Accountinfor.AccountName,
                Users: Users,
                Password: Password,
                Domain: Domain,
                Channels: Channels

            };
            const params = {
                Json: JSON.stringify(pr),
                func: "WH_spWareHouse_Floor_Save",
            };
            //khóa nút
            setDisable(true);

            try {
                const result = await mainAction.API_spCallServer(params, dispatch);
                setDisable(false);
                if (result.Status === "OK") {
                    Alertsuccess(result.ReturnMess);
                    Cancel();
                    setShelvesId(0);
                    setTitle(I18n.t("validate.ADDNEWFLOOR"));

                }
                else {

                    Alerterror(result.ReturnMess);
                }
            } catch (error) {
                setDisable(false);
                Alerterror(I18n.t("validate.Dataerror,pleasecontactITNETCO!"));
            }
        }
    }

    // list
    //load Area ds
    const [AreaIdd, setAreaIdd] = useState(-1);
    const onSelectAreaa = (areaIdd) => {
        setAreaIdd(areaIdd);
        console.log(areaIdd, "areaIdddddddddddddddd")

    }

    //load WareHouseCode ds
    const [WarehouseIdd, setWarehouseIdd] = useState(-1);
    const onSelectWarehousee = (WarehouseIdd) => {
        setWarehouseIdd(WarehouseIdd);
        console.log(WarehouseIdd, "wareHouseIdddddddđ")

    }

    //load WareHouseAreaCode dss
    const [WarehouseAreaIdd, setWarehouseAreaIdd] = useState(-1);
    const onSelectWarehouseAreaa = (WarehouseAreaIdd) => {
        setWarehouseAreaIdd(WarehouseAreaIdd);
        console.log(WarehouseAreaIdd, "wareHouseIdddddddđ")

    }



    //load Shelves dss
    const [ShelvesIdd, setShelvesIdd] = useState(-1);
    const onSelectShelvess = (ShelvesIdd) => {
        setShelvesIdd(ShelvesIdd);
        console.log(setShelvesIdd, "setShelvesId")

    }

    //load Shelves dss
    const [FloorIdd, setFloorIdd] = useState(-1);
    const onSelectFloorIdd = (FloorIdd) => {
        setFloorIdd(FloorIdd);
        console.log(setFloorIdd, "setsetFloorId")

    }

    const [DataWareHouseFloor, setDataWareHouseFloor] = useState([]);
    const [CreateId, setCreateId] = useState(0);
    const WH_spWareHouse_Floor_List = async () => {

        //kiem tra quyen xem
        if (datapermisstion !== "") {
            let a = JSON.parse(datapermisstion);
            let b = a.find(p => p.WH_tblMenuModuleId === 66 && p.Views === 'C')
            if (b === undefined) {
                Alertwarning(I18n.t("validate.Youdonothavepermissiontoviewthefloor!"));
                return;
            }
        }
        if (AreaIdd === -1) {
            Alertwarning(I18n.t("validate.PleaseSelectRegion!"));
            return;
        }
        const pr = {
            Json: JSON.stringify({
                FloorId: FloorId,
                ShelvesId: ShelvesIdd,
                AreaId: AreaIdd,
                WarehouseAreaId: WarehouseAreaIdd,
                WarehouseId: WarehouseIdd,
                CreateId: CreateId
            }),

            func: "WH_spWareHouse_Floor_List"
        };
        //  //khóa nút
        setDisable(true);
        try {
            const result = await mainAction.API_spCallServer(pr, dispatch);
            if (result.length > 0) {
                setDisable(false);
                console.log(result)
                setDataWareHouseFloor(result);
            }
            else {
                Alertwarning(("Report.NoData"))
                setDataWareHouseFloor([]);//nếu k có dữ liệu thì clear dòng cũ đi
                return;
            }

        } catch (error) {
            setDisable(false);
            console.log(error);
            Alerterror(I18n.t("validate.apierror!"));
        }
    }

    //delete xóa từng dòng.ITEM
    const [IsDelete, setIsDelete] = useState();
    useEffect(() => {
        if (IsDelete === undefined) return;
        const row = IsDelete.Item;
        const dataold = [...DataWareHouseFloor];
        clickDelete(row, dataold);
    }, [IsDelete]);

    //xóa khi cancel
    const clickDeleteSmall = (item) => {
        const numberrandom = Math.random();
        setIsDelete({ IsActive: numberrandom, Item: item });
    }

    //delete
    const clickDelete = async (data, dataold) => {
        if (data === undefined) return;
        const editobj = data.row.original;

        ConfirmAlert("Delete Floor", "Are you sure you want to delete this Floor?", async () => {
            const pr = {
                FloorId: editobj.FloorId,
                CreateId: AccountId,
                CreateName: AccountName,

            }
            //hàm delete
            const params = {
                JSON: JSON.stringify(pr),
                func: "WH_spWareHouse_Floor_Delete"

            }
            try {
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result.Status === "OK")//Status,OK SQL save,để xóa đc hàm 
                {
                    Alertsuccess(result.ReturnMess);
                    //xóa đối tựng trong mảng
                    const DataWareHouseFloo = dataold;
                    const datadelete = DataWareHouseFloo.filter(p => p.FloorId !== editobj.FloorId);
                    setDataWareHouseFloor(datadelete);
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

    //check all
    const [IsCheckedAll, setIsCheckedAll] = useState();
    const [keyC, setkeyC] = useState(false);
    useEffect(() => {
        if (IsCheckedAll === undefined) return;
        const datanew = [...DataWareHouseFloor];
        datanew.forEach((item) => {
            if (keyC === false) {
                item.IsCheck = true
                setkeyC(true);
            }
            else {
                item.IsCheck = false
                setkeyC(false);
            }
            // if(item.IsCheck === undefined)
            //     item.IsCheck = true
            // else
            //     item.IsCheck === false ?  item.IsCheck = true : item.IsCheck = false;
        });
        setDataWareHouseFloor(datanew);
    }, [IsCheckedAll]);

    //check all
    const IsCheckedAllSmall = () => {

        const numberrandom = Math.random();
        setIsCheckedAll({ Id: numberrandom });

        //e.target.checked === true ? $("#checkboxAll").prop('checked', false) : $("#checkboxAll").prop('checked', true);

    }


    ///check chọn nhiều ô để xóa ID hoa và thường
    const [IsCheckOne, setIsCheckOne] = useState({ Id: 0, Check: false });
    useEffect(() => {
        if (IsCheckOne.Id !== 0 && IsCheckOne.Id !== undefined) {
            let Id = IsCheckOne.Id;
            let Check = IsCheckOne.Check;

            if (Check === undefined || Check === null)
                Check = false;

            const datanew = [...DataWareHouseFloor]
            datanew.find(p => p.FloorId == Id).IsCheck = !Check;
            setDataWareHouseFloor(datanew);

        }
    }, [IsCheckOne]);

    ///delete multiple lines
    const DeleteAllWareHouseFloor = async () => {
        //kttra quyền xóa
        if (datapermisstion !== "") {
            let a = JSON.parse(datapermisstion);
            let b = a.find(p => p.WH_tblMenuModuleId === 66 && p.Deletes === 'C')
            if (b === undefined) {
                Alertwarning(I18n.t("validate.Youdonothavetherighttodeletefloors!"));
                return;
            }

        }
        let check = DataWareHouseFloor.filter(a => a.IsCheck === true)
        if (check.length === 0) {
            Alertwarning(I18n.t("validate.PleaseselectFloortodelete!"))
            return
        }
        ConfirmAlert(((I18n.t("validate.DeleteFloor", "AreyousureyouwanttodeletethisFloor?"))), async () => {
            {
                const DataDelete = DataWareHouseFloor.filter(p => p.IsCheck === true);
                if (DataDelete.length > 0) {


                    //hàm delete
                    const pr = {
                        AccountId: AccountId,
                        AccountName: AccountName,
                        ListWareHouseFloorId: DataDelete.map(item => { return { "FloorId": item.FloorId } })//xóa nhiều dòng thì thêm biến vào sql

                    }
                    const params = {
                        JSON: JSON.stringify(pr),
                        func: "WH_spWareHouse_Floor_DeleteMany"

                    }
                    try {
                        const result = await mainAction.API_spCallServer(params, dispatch);

                        if (result.Status === "OK")//Status,OK SQL save,để xóa đc hàm 
                        {

                            Alertsuccess(result.ReturnMess);

                            //xóa đối tựng trong mảng
                            const DataWareHouseFloorNew = DataWareHouseFloor.filter(p => p.IsCheck !== true);
                            setDataWareHouseFloor(DataWareHouseFloorNew);
                        }
                        else {
                            Alerterror(result.ReturnMess);
                        }
                    } catch (error) {
                        console.log(error);
                        Alerterror(I18n.t("validate.apierror!"));

                    }


                }


            }
        })
    }

    // Begin cancel
    const Cancel = () => {
        setFloorId(0)
        setWarehouseAreaId(-1)
        setWarehouseId(-1)
        setFloorCode('')
        setFloorName('')
        setImages('')
        setLength('')
        setWidth('')
        setHeight('')
        setAreaId(-1)
        setShelvesId(-1)
        setDescription('')
        setSquareMeters('')
        setUsers('')
        setPassword('')
        setDomain('')
        setChannels('')
        setTitle('THÊM MỚI TẦNG');


    }

    // ///edit
    const clickEdit = (data) => {
        setTitle('SỬA TẦNG')
        const editobj = data.row.original;//ĐỐI tượng
        setFloorId(editobj.FloorId);
        setShelvesId(editobj.ShelvesId);
        setWarehouseId(editobj.WareHouseId);
        setWarehouseAreaId(editobj.WarehouseAreaId);
        setAreaId(editobj.AreaId);
        setFloorCode(editobj.FloorCode);
        setFloorName(editobj.FloorName);
        setDescription(editobj.Description);
        setImages(editobj.Images);
        setLength(editobj.Length);
        setWidth(editobj.Width);
        setHeight(editobj.Height);
        setSquareMeters(editobj.SquareMeters);
        setUsers(editobj.Users);
        setPassword(editobj.Password);
        setDomain(editobj.Domain);
        setChannels(editobj.Channels);
        document.querySelector("#tab_1").click();

    }

    //execel
    const Exportexcell = () => {
        //kiem tra quyen excel
        if (datapermisstion !== "") {
            let a = JSON.parse(datapermisstion);
            let b = a.find(p => p.WH_tblMenuModuleId === 66 && p.Excel === 'C')
            if (b === undefined) {
                Alertwarning(I18n.t("validate.YoudonothavepermissiontoexportExcel!"));
                return;
            }
        }
        const newData = DataWareHouseFloor.map(element => {
            return {
                'Khu Vực': element.Name,
                'Kho': element.WareHouseName,
                'KV Kho': element.WareHouseAreaName,
                'Kệ': element.ShelvesCode,
                'Mã Tầng': element.FloorCode,
                'Tên Tầng': element.FloorName,
                'Chiều Dài (mét)': element.Length,
                'Chiều Rộng (mét)': element.Width,
                'Chiều Cao (mét)': element.Height,
                'Diện Tích(m2)': element.SquareMeters,
                'Ghi Chú': element.Description,
                'SL Location': element.TotalFloor,
                'Users': element.Users,
                'Password': element.Password,
                'Domain': element.Domain,
                'Channels': element.Channels,
                'Người Sửa': element.EditName,
                'Ngày Sửa': FormatDateJson(element.EditTime),
                'Người Tạo': element.CreateName,
                'Ngày Tạo': FormatDateJson(element.CreateTime)
            }
        })
        newData.forEach(function (x) {
            if (columns.find(a => a.accessor === 'Name') === undefined) { delete x["Khu Vực"] }
            else if (columns.find(a => a.accessor === 'Name').show === false) { delete x["Khu Vực"] }

            if (columns.find(a => a.accessor === 'WareHouseName') === undefined) { delete x["Kho"] }
            else if (columns.find(a => a.accessor === 'WareHouseName').show === false) { delete x["Kho"] }

            if (columns.find(a => a.accessor === 'WareHouseAreaName') === undefined) { delete x["KV Kho"] }
            else if (columns.find(a => a.accessor === 'WareHouseAreaName').show === false) { delete x["KV Kho"] }

            if (columns.find(a => a.accessor === 'ShelvesCode') === undefined) { delete x["Kệ"] }
            else if (columns.find(a => a.accessor === 'ShelvesCode').show === false) { delete x["Kệ"] }

            if (columns.find(a => a.accessor === 'FloorCode') === undefined) { delete x["Mã Tầng"] }
            else if (columns.find(a => a.accessor === 'FloorCode').show === false) { delete x["Mã Tầng"] }

            if (columns.find(a => a.accessor === 'FloorName') === undefined) { delete x["Tên Tầng"] }
            else if (columns.find(a => a.accessor === 'FloorName').show === false) { delete x["Tên Tầng"] }

            if (columns.find(a => a.accessor === 'Length') === undefined) { delete x["Chiều Dài (mét)"] }
            else if (columns.find(a => a.accessor === 'Length').show === false) { delete x["Chiều Dài"] }

            if (columns.find(a => a.accessor === 'Width') === undefined) { delete x["Chiều Rộng (mét)"] }
            else if (columns.find(a => a.accessor == 'Width').show === false) { delete x["Chiều Rộng (mét)"] }

            if (columns.find(a => a.accessor === 'Height') === undefined) { delete x["Chiều Cao (mét)"] }
            else if (columns.find(a => a.accessor == 'Height').show === false) { delete x["Chiều Cao (mét)"] }

            if (columns.find(a => a.accessor === 'SquareMeters') === undefined) { delete x["Diện Tích(m2)"] }
            else if (columns.find(a => a.accessor == 'SquareMeters').show === false) { delete x["Diện Tích (m2)"] }


            if (columns.find(a => a.accessor === 'Description') === undefined) { delete x["Ghi Chú"] }
            else if (columns.find(a => a.accessor === 'Description').show === false) { delete x["Ghi Chú"] }

            if (columns.find(a => a.accessor === 'TotalFloor') === undefined) { delete x["SL Location"] }
            else if (columns.find(a => a.accessor === 'TotalFloor').show === false) { delete x["SL Locationg"] }
            if (columns.find(a => a.accessor === 'Users') === undefined) { delete x["Users"] }
            else if (columns.find(a => a.accessor === 'Users').show === false) { delete x["Users"] }
            if (columns.find(a => a.accessor === 'Password') === undefined) { delete x["Password"] }
            else if (columns.find(a => a.accessor === 'Password').show === false) { delete x["Password"] }
            if (columns.find(a => a.accessor === 'Domain') === undefined) { delete x["Domain"] }
            else if (columns.find(a => a.accessor === 'Domain').show === false) { delete x["Domain"] }
            if (columns.find(a => a.accessor === 'Channels') === undefined) { delete x["Channels"] }
            else if (columns.find(a => a.accessor === 'Channels').show === false) { delete x["Channels"] }

            if (columns.find(a => a.accessor === 'EditName') === undefined) { delete x["Người Sửa"] }
            else if (columns.find(a => a.accessor === 'EditName').show === false) { delete x["Người Sửa"] }

            if (columns.find(a => a.accessor === 'EditTime') === undefined) { delete x["Ngày Sửa"] }
            else if (columns.find(a => a.accessor === 'EditTime').show === false) { delete x["Ngày Sửa"] }

            if (columns.find(a => a.accessor === 'CreateName') === undefined) { delete x["Người Tạo"] }
            else if (columns.find(a => a.accessor === 'CreateName').show === false) { delete x["Người tạo"] }

            if (columns.find(a => a.accessor === 'CreateTime') === undefined) { delete x["Ngày Tạo"] }
            else if (columns.find(a => a.accessor === 'CreateTime').show === false) { delete x["Ngày Tạo"] }


        });
        ExportExcel(newData, "Danh sách tầng");
    }


    //#region upload file
    const onFileChange = (event) => {
        setFileUpload(event.target.files[0]);
        if (FileUpload === undefined) {
            return
        }
        setImages(URL.createObjectURL(event.target.files[0]));
    };
    //#end region


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
    //#end region

    ///coloums
    const [columns, setcolumns] = useState([
        // {
        //     accessor: 'Id',
        //     filterable: false,
        //     sortable: false,
        //     width: 50,
        //     maxWidth: 50,
        //     special: true,
        //     show: true,
        //     textAlign: "center",
        //     Cell: (row) => (
        //         <div className="col-sm-12">
        //             <div className="icheck-success d-inline">
        //                 <input type="checkbox"
        //                     id={row.original.FloorId} value={row.original.FloorId}
        //                     checked={row.original.IsCheck}
        //                     onChange={e => setIsCheckOne({Id:row.original.c, Check:row.original.IsCheck})}
        //                 />
        //                 <label className="label checkbox" htmlFor={row.original.FloorId}></label>
        //             </div>
        //         </div>
        //     )
        // },
        {
            Header: (
                <div className="col-sm-12 col-md-2">
                    <div className="icheck-success d-inline">
                        {/* <input type="checkbox" id="checkboxAll" value="checkAll"
                         checked={IsChecked}
                        onChange={IsCheckedAllSmall} 
                        />
                        <label className="label checkbox" htmlFor="checkboxAll"></label> */}
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
                            id={row.original.FloorId} value={row.original.FloorId}
                            checked={row.original.IsCheck}
                            onChange={e => setIsCheckOne({ Id: row.original.FloorId, Check: row.original.IsCheck })}
                        />
                        <label className="label checkbox" htmlFor={row.original.FloorId}></label>
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
            width: 100,
            // filterable: false,
            // sortable: false,
            special: true,///loại bỏ checkbox ra khi chọn nút cài đăt
            show: true,//
            accessor: 'FloorId',
            Cell: (row) => (
                <span>
                    <button
                        data-tooltip="Sửa"
                        className="btn btn-sm btn-success mr-2 show__tip__left"
                        onClick={(e) => clickEdit({ row })}
                    >
                        <i className="fas fa-wrench"></i>
                    </button>
                    <button
                        data-tooltip="Xoá"
                        className="btn btn-sm btn-danger show__tip__right"
                        onClick={(e) => clickDeleteSmall({ row })}
                    >
                        <i className="fa fa-trash"></i>
                    </button>
                </span>
            ),
        },
        {
            Header: I18n.t("Report.STT"),
            Cell: (row) => <span>{row.index + 1}</span>,
            width: 100,
            //filterable: false,
            special: true,///loại bỏ checkbox ra khi chọn nút cài đăt
            show: true,//
        },
        {
            Header: I18n.t("WareHouse.Picture"),
            accessor: "Images",
            //filterable: false,
            //sortable: false,
            Cell: (row) => (
                <div>
                    <a
                        className="cursor"
                        data-toggle="modal"
                        data-target="#modalImg"
                        onClick={(e) => {
                            viewImageInTable(row.original.Images);
                        }}
                        title="Click để xem hình lớn"
                    >
                        <img src={row.original.Images} height="30" width="50" />
                    </a>
                </div>
            ),
        },
        {
            Header: I18n.t("WareHouseFloor.Area"),
            accessor: "Name",
            //filterable: false,
            //sortable: false,
        },
        {
            Header: I18n.t("WareHouseFloor.Warehouse"),
            accessor: "WareHouseName",
            //filterable: false,
            //sortable: false,
        },
        {
            Header: I18n.t("WareHouseFloor.WarehouseArea"),
            accessor: "WareHouseAreaName",
            //filterable: false,
            //sortable: false,
        },
        {
            Header: I18n.t("WareHouseFloor.Shelf"),
            accessor: "ShelvesCode",
            //filterable: false,
            //sortable: false,
        },
        {
            Header: I18n.t("WareHouseFloor.FloorCode"),
            accessor: "FloorCode",
            //filterable: false,
            //sortable: false,
        },
        {
            Header: I18n.t("WareHouseFloor.FloorName"),
            accessor: "FloorName",
            //filterable: false,
            //sortable: false,
        },
        {
            Header: I18n.t("WareHouse.Length(meters)"),
            accessor: "Length",
            //filterable: false,
            //sortable: false,
        },
        {
            Header: I18n.t("WareHouse.Width(meters)"),
            accessor: "Width",
            //filterable: false,
            //sortable: false,
        },
        {
            Header: I18n.t("WareHouse.Height(meters)"),
            accessor: "Height",
            //filterable: false,
            //sortable: false,
        },
        {
            Header: I18n.t("WareHouse.SquareMeters(meters)"),
            accessor: "SquareMeters",
            //filterable: false,
            //sortable: false,
        },
        {
            Header: I18n.t("WareHouse.Description"),
            accessor: "Description",
            width: 150,
            //filterable: false,
            //sortable: false,
        },
        {
            Header: I18n.t("WareHouseFloor.LocatonQuantity"),
            accessor: "TotalFloor",
            width: 150,
            //filterable: false,
            //sortable: false,
        },
        {
            Header: 'Users',
            accessor: "Users",
            width: 150,
            //filterable: false,
            //sortable: false,
        },
        {
            Header: 'Password',
            accessor: "Password",
            width: 150,
            //filterable: false,
            //sortable: false,
        },
        {
            Header: 'Domain',
            accessor: "Domain",
            width: 150,
            //filterable: false,
            //sortable: false,
        },
        {
            Header: 'Channels',
            accessor: "Channels",
            width: 150,
            //filterable: false,
            //sortable: false,
        },
        {
            Header: I18n.t("System.EditBy"),
            accessor: "EditName",
            //filterable: false,
            //sortable: false,
        },
        {
            Header: I18n.t("System.EditDate"),
            accessor: "EditTime",
            Cell: (obj) => FormatDateJson(obj.value),
            //filterable: false,
            //sortable: false,

        },
        {
            Header: I18n.t("System.Creater"),
            accessor: "CreateName",
            //filterable: false,
            // sortable: false,
        },
        {
            Header: I18n.t("System.DateCreated"),
            accessor: "CreateTime",
            Cell: (obj) => FormatDateJson(obj.value),
            width: 180,
            // filterable: false,
            //sortable: false,
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
                                                    onClick={Cancel}
                                                >
                                                    <i className="fa fa-trash mr-2 " />
                                                    {I18n.t("System.Cancel")}
                                                </a>
                                                <a
                                                    className="btn btn-success btn-sm float-right btn-header"
                                                    onClick={WH_spWareHouse_Floor_Save}
                                                    disable={!disable}
                                                >
                                                    <i className="fa fa-folder mr-2 " />
                                                    {I18n.t("System.Save")}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body-form">
                                        <div className="row pb-12">

                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t("WareHouseFloor.Area")}<span className="form__title__note">(*)</span></label>
                                                    <SelectArea
                                                        //onSelected={e => onSelectArea(e.value)}
                                                        onSelected={e => {
                                                            onSelectArea(e.value)
                                                            setWarehouseId(-1)//cho nó về = 0 hoặc trừ 1 nếu báo lỗi
                                                            setWarehouseAreaId(-1)
                                                            setShelvesId(-1)
                                                        }}
                                                        onAreaId={AreaId}
                                                        items={AreaId}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t("WareHouseFloor.NameoftheWarehouse")}<span className="form__title__note">(*)</span></label>
                                                    <SelectWarehouse
                                                        onSelected={e => onSelectWarehouse(e.value)}
                                                        items={WarehouseId}
                                                        AreaId={AreaId}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t("WareHouseFloor.WarehouseArea")}<span className="form__title__note">(*)</span></label>
                                                    <SelectWarehouseArea
                                                        onSelected={e => onSelectWarehouseArea(e.value)}
                                                        items={WarehouseAreaId}
                                                        WareHouseId={WarehouseId}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title" > {I18n.t("WareHouseFloor.Shelf")}<span className="form__title__note">(*)</span></label>
                                                    <SelectShelves
                                                        onSelected={e => onSelectShelves(e.value)}
                                                        items={ShelvesId}
                                                        WareHouseAreaId={WarehouseAreaId}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                        {I18n.t("WareHouseFloor.FloorCode")}
                                                        <span className="form__title__note"> (*)</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder=""
                                                        onChange={e => setFloorCode(e.target.value.trim())}
                                                        value={FloorCode}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                        {I18n.t("WareHouseFloor.FloorName")}
                                                        <span className="form__title__note"> (*)</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder=""
                                                        onChange={e => setFloorName(e.target.value)}
                                                        value={FloorName}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                        {I18n.t("WareHouse.Length(meters)")}
                                                        <span className="form__title__note"> (*)</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder=""
                                                        onChange={e => setLength(e.target.value)}
                                                        value={Length}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                        {I18n.t("WareHouse.Width(meters)")}
                                                        <span className="form__title__note"> (*)</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder=""
                                                        onChange={e => setWidth(e.target.value)}
                                                        value={Width}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                        {I18n.t("WareHouse.Height(meters)")}
                                                        <span className="form__title__note"> (*)</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder=""
                                                        onChange={e => setHeight(e.target.value)}
                                                        value={Height}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                        {I18n.t("WareHouse.SquareMeters(meters)")}
                                                        <span className="form__title__note"> (*) </span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        disabled
                                                        className="form-control"
                                                        placeholder=""
                                                        onChange={e => setSquareMeters(e.target.value)}
                                                        value={Length * Width}//nhận kq ở ô này
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                        {I18n.t("WareHouse.Description")}
                                                        <span className="form__title__note"></span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder=""
                                                        onChange={e => setDescription(e.target.value)}
                                                        value={Description}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="ml-4 mb-2">
                                                    Hình ảnh minh hoạ
                                                    <span className="form__title__note"> (*)</span>
                                                </div>
                                                {Images ?
                                                    <label class="image-label">
                                                        <input
                                                            type="file"
                                                            className="image-collapse-file"
                                                            onChange={onFileChange}
                                                            accept="image/*"
                                                        />
                                                        <img
                                                            src={Images === "" ? "" : Images}
                                                            className="image-collapse-image"
                                                            onChange={onFileChange}
                                                        />
                                                    </label>
                                                    :
                                                    <label class="image-label">
                                                        <input
                                                            type="file"
                                                            className="image-collapse-file"
                                                            onChange={onFileChange}
                                                            accept="image/*"
                                                        />
                                                        <i className="fa fa-camera upload-file-btn"></i>
                                                        <span className="image-collapse-span">Tải hình ảnh lên</span>
                                                    </label>
                                                }
                                            </div>
                                        </div>

                                        <div className="">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <h3 className="card-title">
                                                        <i class="fa-thin fa-camera-movie"></i>
                                                        <span className="font-weight-bold">
                                                            <h3 style={{ fontSize: '20px', color: 'darkgreen' }}> * CAMERA SETTINGS * </h3>

                                                        </span>
                                                    </h3>
                                                </div>
                                                <div className="col-md-6 card-header-btn">
                                                    <a
                                                        className=" btn-sm float-right btn-header"
                                                    >
                                                    </a>
                                                </div>
                                                <div className="col-md-3 col-sm-4 text-center">
                                                    <div className="form-group ">
                                                        <label className="form__title">
                                                            <h3 style={{ fontSize: '15px', color: 'black' }}> Users</h3>                                                   <span className="form__title__note"></span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder=""
                                                            onChange={e => setUsers(e.target.value)}
                                                            value={Users}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-4 margin-bottom:20px text-center">
                                                    <div className="form-group">
                                                        <label className="form__title">
                                                            <h3 style={{ fontSize: '15px', color: 'black' }}> Password</h3>

                                                            <span className="form__title__note"></span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder=""
                                                            onChange={e => setPassword(e.target.value)}
                                                            value={Password}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-4 margin-bottom:20px text-center">
                                                    <div className="form-group">
                                                        <label className="form__title">
                                                            <h3 style={{ fontSize: '15px', color: 'black' }}> Domain  <span className="form__title__note">{"eg:abc.cvvbbv.tv => get abc"}</span></h3>

                                                        </label>
                                                        <input
                                                            type="text"
                                                            onChange={e => setDomain(e.target.value)}
                                                            value={Domain}
                                                            className="form-control"
                                                            placeholder="abc"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-4 margin-bottom:20px text-center">
                                                    <div className="form-group">
                                                        <label className="form__title">
                                                            <h3 style={{ fontSize: '15px', color: 'black' }}> Channels  <span className="form__title__note">(if more than 1 channels, separated by ",")</span></h3>

                                                            <span className="form__title__note"></span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            onChange={e => setChannels(e.target.value)}
                                                            value={Channels}
                                                            className="form-control"
                                                            placeholder="1,2,3"
                                                        />
                                                    </div>
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
                                                        {I18n.t("WareHouseFloor.FloorList")} ({DataWareHouseFloor.length})
                                                    </span>
                                                </h3>
                                            </div>
                                            <div className="col-md-6 card-header-btn">
                                                <a className="btn btn-warning btn-sm float-right btn-header" onClick={a => Exportexcell(a)}>
                                                    <i className="fa fa-download mr-2" />
                                                    {I18n.t("System.Excel")}
                                                </a>
                                                <a className="btn btn-danger btn-sm float-right btn-header" onClick={a => DeleteAllWareHouseFloor(a)}>
                                                    <i className="fa fa-trash mr-2" />
                                                    {I18n.t("System.Delete")}
                                                </a>
                                                <a
                                                    className="btn btn-primary btn-sm float-right btn-header"
                                                    onClick={a => WH_spWareHouse_Floor_List(a)}
                                                >
                                                    <i className="fa fa-eye mr-2" />
                                                    {I18n.t("System.View")}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body-form">
                                        <div className="row pb-3">
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t("WareHouseFloor.Area")}<span className="form__title__note">(*)</span></label>
                                                    <SelectArea
                                                        //onSelected={e => onSelectAreaa(e.value)}
                                                        onSelected={e => {
                                                            onSelectAreaa(e.value)
                                                            setWarehouseIdd(-1)//cho nó về = 0 hoặc trừ 1 nếu báo lỗi
                                                            setWarehouseAreaIdd(-1)
                                                            setShelvesIdd(-1)
                                                            setFloorIdd(-1)
                                                        }}
                                                        onAreaId={AreaIdd}
                                                        AreaIdd={AreaIdd}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t("WareHouseFloor.NameoftheWarehouse")}<span className="form__title__note"></span></label>
                                                    <SelectWarehouse
                                                        //onSelected={e => onSelectWarehousee(e.value)}
                                                        onSelected={e => {
                                                            onSelectWarehousee(e.value)
                                                            // setWarehouseAreaIdd(-1)//cho nó về = 0 hoặc trừ 1 nếu báo lỗi
                                                        }}
                                                        items={WarehouseIdd}
                                                        AreaId={AreaIdd}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t("WareHouseFloor.WarehouseAreaName")}<span className="form__title__note"></span></label>
                                                    <SelectWarehouseArea
                                                        //onSelected={e => onSelectWarehouseAreaa(e.value)}
                                                        onSelected={e => {
                                                            onSelectWarehouseAreaa(e.value)
                                                            //setShelvesIdd(-1)//cho nó về = 0 hoặc trừ 1 nếu báo lỗi
                                                        }}
                                                        items={WarehouseAreaIdd}
                                                        WareHouseId={WarehouseIdd}

                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t("WareHouseFloor.ShelfCode/ShelfName")}<span className="form__title__note"></span></label>
                                                    <SelectShelves
                                                        //onSelected={e => onSelectShelvess(e.value)}
                                                        onSelected={e => {
                                                            onSelectShelvess(e.value)
                                                            //setFloorIdd(-1)//cho nó về = 0 hoặc trừ 1 nếu báo lỗi
                                                        }}
                                                        items={ShelvesIdd}
                                                        WareHouseAreaId={WarehouseAreaIdd}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t("WareHouseFloor.Code/FloorName")}<span className="form__title__note"></span></label>
                                                    <SelectFloor
                                                        //onSelected={e => onSelectFloorIdd(e.value)}
                                                        onSelected={e => {
                                                            onSelectFloorIdd(e.value)
                                                            //setFloorIdd(-1)//cho nó về = 0 hoặc trừ 1 nếu báo lỗi
                                                        }}
                                                        items={FloorIdd}
                                                        ShelvesId={ShelvesIdd}
                                                    />
                                                </div>
                                            </div>


                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t("System.Creater")}<span className="form__title__note"></span></label>
                                                    <SelectAccount
                                                        onSelected={(e) => setCreateId(e.value)}
                                                        items={CreateId}
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    {/* { <div className={DataWareHouseFloor.length > 0 ? "" : "display-none"}>
                                        <DataTable data={DataWareHouseFloor} columns={columns} />
                                    </div> } */}
                                    {ViewImg}
                                    <div className={DataWareHouseFloor.length > 0 ? "" : "display-none"} >
                                        <SettingColumn
                                            columns={columns}
                                            Returndata={a => setcolumns(a)}
                                        />
                                        <DataTable
                                            data={DataWareHouseFloor}
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
};
