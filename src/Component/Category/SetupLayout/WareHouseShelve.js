import React, { useState, useEffect, useRef } from "react";
import I18n from "../../../Language";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../Redux/Actions";
import { DataTable } from "../../../Common/DataTable";
import { Alerterror, Alertsuccess, Alertwarning, FormatDate, FormatDateJson, FirstOrLastDayinMonth, GetDataFromLogin, ExportExcel } from "../../../Utils";
import { SelectArea, SelectWarehouse, SelectWarehouseArea, SelectShelves, SelectAccount, SettingColumn } from '../../../Common';
import DateTimePicker from "react-datetime-picker";
import { ConfirmAlert } from "../../../Utils";
export const WareHouseShelve = () => {

    //tab hiện thị sửa trên table
    const [tittle, setTitle] = useState(I18n.t("validate.ADDNEWShelves"))
    //khai báo biến để nhận dữ liệu

    const dispatch = useDispatch();
    // const [State, setState] = useState();
    const [disbtn, setdisbtn] = useState();
    const [FileUpload, setFileUpload] = useState({});

    const [WarehouseId, setWarehouseId] = useState(-1);//lưu xuống


    //transmission CreateName,EditName

    const AccountId = GetDataFromLogin("AccountId");
    const AccountName = GetDataFromLogin("AccountName");
    let datapermisstion = localStorage.getItem("Permissioninfor");//check quyền


    //load Area  thêm mới
    const [AreaId, setAreaId] = useState(-1);
    const onSelectArea = (areaId) => {
        setAreaId(areaId);
        setWarehouseId(-1)
    }
    //load WareHouseCode thêm m
    const onSelectWarehouse = (WarehouseId) => {
        setWarehouseId(WarehouseId);
        //setWarehouseId(0)
    }
    //load WareHouseCode
    const [WarehouseAreaId, setWarehouseAreaId] = useState(-1);
    const onSelectWarehouseArea = (WarehouseAreaId) => {
        setWarehouseAreaId(WarehouseAreaId);

    }

    //load Shelve save
    const [ShelvesId, setShelvesId] = useState(0);
    const onWareHouseShelves = (ShelvesId) => {
        setShelvesId(ShelvesId);
    }

    //khai báo biến
    const [ShelvesCode, setShelvesCode] = useState("");
    const [ShelvesName, setShelvesName] = useState("");
    const [Description, setDescription] = useState("");
    const [Length, setLength] = useState("");
    const [Width, setWidth] = useState("");
    const [Height, setHeight] = useState("");
    const [SquareMeters, setSquareMeters] = useState("");
    const [Images, setImages] = useState("");
    const [CreateName, setCreateName] = useState("");
    const [disable, setdisable] = useState(false);
    const [Users, setUsers] = useState();
    const [Password, setPassword] = useState();
    const [Domain, setDomain] = useState();
    const [Channels, setChannels] = useState();
    const Accountinfor = JSON.parse(localStorage.getItem("Accountinfor") === "" ? "{}" : localStorage.getItem("Accountinfor"));

    ///save
    const WH_spWareHouse_Shelves_Save = async () => {
        //kiem tra quyen luu
        if (datapermisstion !== "") {
            let a = JSON.parse(datapermisstion);
            let b = a.find(p => p.WH_tblMenuModuleId === 65 && p.Adds === 'C')
            if (b === undefined) {
                Alertwarning(I18n.t("validate.Youdonothavepermissiontocreateshelves!"));
                return;
            }
        }
        //ràng buộc dữ liệu
        if (AreaId === -1) {
            Alertwarning(I18n.t("validate.PleaseSelectRegion!"));
            return;
        }
        if (WarehouseId === -1) {
            Alertwarning(I18n.t("validate.PleaseChooseWarehouseName!"));
            return;
        }
        if (WarehouseAreaId === -1) {
            Alertwarning(I18n.t("validate.PleaseSelectWarehouseArea!"));
            return;
        }
        if (ShelvesCode === "") {
            Alertwarning(I18n.t("validate.Pleaseentertheshelfcode!"));
            return;

        }
        if (ShelvesName === "") {
            Alertwarning(I18n.t("validate.Pleaseentershelfname!"));
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
            Alertwarning(I18n.t("validate.PleaseEnterHeight!"));
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
        debugger
        const pr = {
            ShelvesId: ShelvesId,
            WarehouseAreaId: WarehouseAreaId,
            AreaId: AreaId,
            WarehouseId: WarehouseId,
            ShelvesCode: ShelvesCode.trim(),
            ShelvesName: ShelvesName,
            SquareMeters: Length * Width,
            Images: img,
            Description: Description.toString().replaceAll('"', "'"),
            Length: Length,
            Width: Width,
            Height: Height,
            CreateId: Accountinfor.AccountId,
            CreateName: Accountinfor.AccountName,
            Users: Users,
            Password: Password,
            Domain: Domain,
            Channels: Channels

        }
        //hàm
        //khóa nút
        setdisbtn(true);
        const params = {
            JSON: JSON.stringify(pr),
            func: "WH_spWareHouse_Shelves_Save"

        }

        try {
            const result = await mainAction.API_spCallServer(params, dispatch);
            setdisable(false)
            if (result.Status === "OK") {

                Alertsuccess(result.ReturnMess);
                Cancel();
                setTitle(I18n.t("validate.ADDNEWShelves"));

            }
            else {

                Alerterror(result.ReturnMess);
            }
        } catch (error) {
            setdisable(false)
            console.log(error);
            Alerterror(I18n.t("validate.apierror!"));
        }


    }
    //list
    // //load Area  ds
    const [AreaIdd, setAreaIdd] = useState(-1);
    const onSelectAreaa = (areaIdd) => {
        setAreaIdd(areaIdd);
        //setWarehouseIdd(-1)
        console.log(areaIdd, "areaIdddddddddddddddd")

    }


    //load WareHouseCode ds
    const [WarehouseIdd, setWarehouseIdd] = useState(-1);
    const onSelectWarehousee = (WarehouseIdd) => {
        setWarehouseIdd(WarehouseIdd);
        //setWarehouseIdd(0)
        console.log(WarehouseIdd, "wareHouseIdddddddđ")

    }

    //load WareHouseCode dss
    const [WarehouseAreaIdd, setWarehouseAreaIdd] = useState(-1);
    const onSelectWarehouseAreaa = (WarehouseAreaIdd) => {
        setWarehouseAreaIdd(WarehouseAreaIdd);
        console.log(WarehouseAreaIdd, "wareHouseIdddddddđ")

    }
    //load Shelve ds
    const [ShelvesIdd, setShelvesIdd] = useState(-1);
    const onWareHouseShelvess = (ShelvesIdd) => {
        setShelvesIdd(ShelvesIdd);
        console.log(ShelvesIdd, "setShelvesIdddd")
    }
    ///const
    const [dataWareHouseShelves, setWareHouseShelves] = useState([]);
    const [CreateId, setCreateId] = useState(0);
    const WH_spWareHouse_Shelves_List = async () => {
        //kiem tra quyen xem
        if (datapermisstion !== "") {
            let a = JSON.parse(datapermisstion);
            let b = a.find(p => p.WH_tblMenuModuleId === 65 && p.Views === 'C')
            if (b === undefined) {
                Alertwarning(I18n.t("validate.Youdonothavepermissiontoviewtheshelf!"));
                return;
            }
        }
        if (AreaIdd === -1) {
            Alertwarning(I18n.t("validate.PleaseSelectRegion!"));
            return;
        }
        const pr = {
            ShelvesId: ShelvesId,
            AreaId: AreaIdd,
            WarehouseAreaId: WarehouseAreaIdd,
            WarehouseId: WarehouseIdd,
            CreateId: CreateId
        }

        const params = {
            JSON: JSON.stringify(pr),
            func: "WH_spWareHouse_Shelves_List"

        }
        setdisable(true)
        try {
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.length > 0) {
                setdisable(false)
                setWareHouseShelves(result);
                console.log(result);
            }
            else {
                Alertwarning(("Report.NoData"))
                setWareHouseShelves([]);
                return;
            }


        } catch (error) {

            console.log(error);
            setdisable(false)
            Alerterror(I18n.t("validate.apierror!"));

        }



    }

    //#region upload file
    const onFileChange = (event) => {
        setFileUpload(event.target.files[0]);
        if (FileUpload === undefined) {
            return
        }
        setImages(URL.createObjectURL(event.target.files[0]));
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


    // ///edit
    const clickEdit = (data) => {
        setTitle(I18n.t("WareHouseShelve.EditShelves"))
        const editobj = data.row.original;//ĐỐI tượng
        setWarehouseAreaId(editobj.WarehouseAreaId);
        setWarehouseId(editobj.WarehouseId);
        setShelvesId(editobj.ShelvesId);
        setAreaId(editobj.AreaId);
        setShelvesCode(editobj.ShelvesCode);
        setShelvesName(editobj.ShelvesName);
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

    //check all
    const [IsCheckedAll, setIsCheckedAll] = useState();
    const [keyC, setkeyC] = useState(false);
    useEffect(() => {
        if (IsCheckedAll === undefined) return;
        const datanew = [...dataWareHouseShelves];
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
        setWareHouseShelves(datanew);
    }, [IsCheckedAll]);

    //check all(ĐỐI TƯỢNG {})IsCheckedAllSmall
    const IsCheckedAllSmall = () => {

        const numberrandom = Math.random();
        setIsCheckedAll({ Id: numberrandom });

        //e.target.checked === true ? $("#checkboxAll").prop('checked', false) : $("#checkboxAll").prop('checked', true);

    }
    //delete bấm cancel bị khóa nút
    const clickDeleteSmall = (item) => {
        const numberrandom = Math.random();
        setIsDelete({ IsActive: numberrandom, Item: item });
    }

    //delete ITEM
    const [IsDelete, setIsDelete] = useState();
    useEffect(() => {
        if (IsDelete === undefined) return;///check để xóa

        const row = IsDelete.Item;
        const dataold = [...dataWareHouseShelves];
        clickDelete(row, dataold);
    }, [IsDelete]);

    //delete .ROW
    const clickDelete = (data, dataold) => {
        const editobj = data.row.original;
        ConfirmAlert("Delete shelf", "Are you sure you want to delete this shelf?", async () => {
            {
                const pr = {
                    ShelvesId: editobj.ShelvesId,
                    CreateId: AccountId,
                    CreateName: AccountName,
                }
                //hàm delete
                const params = {
                    JSON: JSON.stringify(pr),
                    func: "WH_spWareHouse_Shelves_Delete"

                }
                try {
                    const result = await mainAction.API_spCallServer(params, dispatch);
                    if (result.Status === "OK")//Status,OK SQL save,để xóa đc hàm 
                    {
                        Alertsuccess(result.ReturnMess);
                        //xóa đối tựng trong mảng
                        const DataWareHouseShelves = dataold;
                        const datadelete = DataWareHouseShelves.filter(p => p.ShelvesId !== editobj.ShelvesId);
                        setWareHouseShelves(datadelete);
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

    ///check chọn nhiều ô để xóa ID hoa và thường(const datanew)
    const [IsCheckOne, setIsCheckOne] = useState({ Id: 0, Check: false });
    useEffect(() => {
        if (IsCheckOne.Id !== 0 && IsCheckOne.Id !== undefined) {
            let Id = IsCheckOne.Id;
            let Check = IsCheckOne.Check;

            if (Check === undefined || Check === null)
                Check = false;

            const datanew = [...dataWareHouseShelves]
            datanew.find(p => p.ShelvesId == Id).IsCheck = !Check;//check all
            setWareHouseShelves(datanew);
        }
    }, [IsCheckOne]);


    ///delete multiple lines
    const DeleteAllWareHouseShelves = async () => {

        //kttra quyền xóa
        if (datapermisstion !== "") {
            let a = JSON.parse(datapermisstion);
            let b = a.find(p => p.WH_tblMenuModuleId === 65 && p.Deletes === 'C')
            if (b === undefined) {
                Alertwarning(I18n.t("validate.Youdonothavetherighttodeleteshelves!"));
                return;
            }

        }
        let check = dataWareHouseShelves.filter(a => a.IsCheck === true)
        if (check.length === 0) {
            Alertwarning(I18n.t("validate.Pleaseselecttheshelftodelete!"))
            return
        }
        ConfirmAlert((I18n.t("validate.Deleteshelf,Areyousureyouwanttodeletethisshelf?")), async () => {
            {
                const DataDelete = dataWareHouseShelves.filter(p => p.IsCheck === true);
                if (DataDelete.length > 0) {


                    //hàm delete
                    const pr = {
                        AccountId: AccountId,
                        AccountName: AccountName,
                        ListWareHouseShelvesId: DataDelete.map(item => { return { "ShelvesId": item.ShelvesId } })//xóa nhiều dòng thì thêm biến vào sql

                    }
                    const params = {
                        JSON: JSON.stringify(pr),
                        func: "WH_spWareHouse_Shelves_DeleteMany"

                    }
                    try {
                        const result = await mainAction.API_spCallServer(params, dispatch);

                        if (result.Status === "OK")//Status,OK SQL save,để xóa đc hàm 
                        {

                            Alertsuccess(result.ReturnMess);

                            //xóa đối tựng trong mảng
                            const DataWareHouseShelvesNew = dataWareHouseShelves.filter(p => p.IsCheck !== true);
                            setWareHouseShelves(DataWareHouseShelvesNew);
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


    //execel
    const Exportexcell = () => {
        //kiem tra quyen excel
        if (datapermisstion !== "") {
            let a = JSON.parse(datapermisstion);
            let b = a.find(p => p.WH_tblMenuModuleId === 65 && p.Excel === 'C')
            if (b === undefined) {
                Alertwarning(I18n.t("validate.YoudonothavepermissiontoexportExcel!"));
                return;
            }
        }
        const newData = dataWareHouseShelves.map(element => {
            return {
                'Khu Vực': element.Name,
                'Tên Kho': element.WareHouseName,
                'khu Vực Kho': element.WareHouseAreaName,
                'Mã Kệ': element.ShelvesCode,
                'Tên Kệ': element.ShelvesName,
                'Chiều Dài (mét)': element.Length,
                'Chiều Rộng (mét)': element.Width,
                'Chiều Cao (mét)': element.Height,
                'Diện Tích (m2)': element.SquareMeters,
                'Ghi Chú': element.Description,
                'SL Tầng': element.TotalFloor,
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

            if (columns.find(a => a.accessor === 'WareHouseName') === undefined) { delete x["Tên Kho"] }
            else if (columns.find(a => a.accessor === 'WareHouseName').show === false) { delete x["Tên Kho"] }

            if (columns.find(a => a.accessor === 'WareHouseAreaName') === undefined) { delete x["khu Vực Kho"] }
            else if (columns.find(a => a.accessor === 'WareHouseAreaName').show === false) { delete x["khu Vực Kho"] }

            if (columns.find(a => a.accessor === 'ShelvesCode') === undefined) { delete x["Mã Kệ"] }
            else if (columns.find(a => a.accessor === 'ShelvesCode').show === false) { delete x["Mã Kệ"] }

            if (columns.find(a => a.accessor === 'Description') === undefined) { delete x["Ghi Chú"] }
            else if (columns.find(a => a.accessor === 'Description').show === false) { delete x["Ghi Chú"] }

            if (columns.find(a => a.accessor === 'ShelvesName') === undefined) { delete x["Tên Kệ"] }
            else if (columns.find(a => a.accessor === 'ShelvesName').show === false) { delete x["Tên Kệ"] }

            if (columns.find(a => a.accessor === 'Length') === undefined) { delete x["Chiều Dài (mét)"] }
            else if (columns.find(a => a.accessor === 'Length').show === false) { delete x["Chiều Dài (mét)"] }

            if (columns.find(a => a.accessor === 'Width') === undefined) { delete x["Chiều Rộng (mét)"] }
            else if (columns.find(a => a.accessor == 'Width').show === false) { delete x["Chiều Rộng (mét)"] }

            if (columns.find(a => a.accessor === 'Height') === undefined) { delete x["Chiều Cao (mét)"] }
            else if (columns.find(a => a.accessor == 'Height').show === false) { delete x["Chiều Cao (mét)"] }

            if (columns.find(a => a.accessor === 'SquareMeters') === undefined) { delete x["Diện Tích (m2)"] }
            else if (columns.find(a => a.accessor == 'SquareMeters').show === false) { delete x["Diện Tích (m2)"] }

            if (columns.find(a => a.accessor === 'TotalFloor') === undefined) { delete x["SL Tầng"] }
            else if (columns.find(a => a.accessor == 'TotalFloor').show === false) { delete x["SL Tầng"] }
            if (columns.find(a => a.accessor === 'Users') === undefined) { delete x["Users"] }
            else if (columns.find(a => a.accessor === 'Users').show === false) { delete x["Users"] }
            if (columns.find(a => a.accessor === 'Password') === undefined) { delete x["Password"] }
            else if (columns.find(a => a.accessor === 'Password').show === false) { delete x["Password"] }
            if (columns.find(a => a.accessor === 'Domain') === undefined) { delete x["Domain"] }
            else if (columns.find(a => a.accessor === 'Domain').show === false) { delete x["Domain"] }
            if (columns.find(a => a.accessor === 'Channels') === undefined) { delete x["Channels"] }
            else if (columns.find(a => a.accessor === 'Channels').show === false) { delete x["Channels"] }

            if (columns.find(a => a.accessor === 'EditName') === undefined) { delete x["Người Sửa"] }
            else if (columns.find(a => a.accessor === 'EditName').show === false) { delete x["Người sửa"] }

            if (columns.find(a => a.accessor === 'EditTime') === undefined) { delete x["Ngày Sửa"] }
            else if (columns.find(a => a.accessor === 'EditTime').show === false) { delete x["Ngày Sửa"] }

            if (columns.find(a => a.accessor === 'CreateName') === undefined) { delete x["Người Tạo"] }
            else if (columns.find(a => a.accessor === 'CreateName').show === false) { delete x["Người Tạo"] }

            if (columns.find(a => a.accessor === 'CreateTime') === undefined) { delete x["Ngày Tạo"] }
            else if (columns.find(a => a.accessor === 'CreateTime').show === false) { delete x["Ngày Tạo"] }


        });
        ExportExcel(newData, "Danh sách kệ");
    }

    //cancel
    const Cancel = (e) => {
        setShelvesId(0)
        setWarehouseAreaId(-1)
        setWarehouseId(-1)
        setAreaId(-1)
        setShelvesCode('')
        setShelvesName('')
        setSquareMeters('')
        setDescription('')
        setLength('')
        setWidth('')
        setHeight('')
        setImages('')
        setUsers('')
        setPassword('')
        setDomain('')
        setChannels('')
        setTitle('THÊM MỚI KỆ');

    }

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
        //                     id={row.original.ShelvesId} value={row.original.ShelvesId}
        //                     checked={row.original.IsCheck}
        //                     onChange={e => setIsCheckOne({Id:row.original.ShelvesId, Check:row.original.IsCheck})}
        //                 />
        //                 <label className="label checkbox" htmlFor={row.original.ShelvesId}></label>
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
                            id={row.original.ShelvesId} value={row.original.LocationId}
                            checked={row.original.IsCheck}
                            onChange={e => setIsCheckOne({ Id: row.original.ShelvesId, Check: row.original.IsCheck })}
                        />
                        <label className="label checkbox" htmlFor={row.original.ShelvesId}></label>
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
            special: true,///loại bỏ checkbox ra khi chọn nút cài đăt
            show: true,//
            accessor: 'ShelvesId',
            Cell: (row) => (
                <span>
                    <button
                        data-tooltip={I18n.t("AccountGroup.Edit")}
                        className="btn btn-sm btn-success mr-2 show__tip__left"
                        onClick={(e) => clickEdit({ row })}
                    >
                        <i className="fas fa-wrench"></i>
                    </button>
                    <button
                        data-tooltip={I18n.t("AccountGroup.Delete")}
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
            special: true,///loại bỏ checkbox ra khi chọn nút cài đăt
            show: true,//
        },
        {
            Header: "Hình Ảnh",
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
            Header: I18n.t("WareHouse.Area"),
            accessor: "Name",
            //filterable: false,
            //sortable: false,
        },
        {
            Header: I18n.t("WareHouseShelve.NameoftheWarehouse"),
            accessor: "WareHouseName",
            //filterable: false,
            //sortable: false,
        },
        {
            Header: I18n.t("WareHouseShelve.WarehouseArea"),
            accessor: "WareHouseAreaName",
            //filterable: false,
            //sortable: false,
        },
        {
            Header: I18n.t("WareHouseShelve.ShelvesCode"),
            accessor: "ShelvesCode", //ShelvesCode
            //filterable: false,
            //sortable: false,
        },
        {
            Header: I18n.t("WareHouseShelve.ShelvesName"),
            accessor: "ShelvesName",//ShelvesName
            //filterable: false,
            //sortable: false,
        },
        {
            Header: I18n.t("WareHouseShelve.Length(meters)"),
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
            Header: I18n.t("WareHouse.Length(meters)"),
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
            Header: I18n.t("WareHouseShelve.Description"),
            accessor: "Description",
            width: 150,
            //filterable: false,
            //sortable: false,
        },
        {
            Header: I18n.t("WareHouseShelve.NumberofFloors"),
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
                                // onClick={WH_spAccount_Cancel}
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
                                                    onClick={WH_spWareHouse_Shelves_Save}
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
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title" > {I18n.t("WareHouse.Area")}<span className="form__title__note">(*)</span></label>
                                                    <SelectArea
                                                        onSelected={e => onSelectArea(e.value)}
                                                        onAreaId={AreaId}
                                                        items={AreaId}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title" > {I18n.t("WareHouseShelve.NameoftheWarehouse")}<span className="form__title__note">(*)</span></label>
                                                    <SelectWarehouse
                                                        // onSelected={e => onSelectWarehouse(e.value)}

                                                        onSelected={e => {
                                                            onSelectWarehouse(e.value)
                                                            setWarehouseAreaId(-1)//cho nó về = 0 hoặc trừ 1 nếu báo lỗi
                                                        }}
                                                        items={WarehouseId}
                                                        AreaId={AreaId}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title" >  {I18n.t("WareHouseArea.WareHouseAreaCode")}<span className="form__title__note">(*)</span></label>
                                                    <SelectWarehouseArea
                                                        //    onSelected={e => onSelectWarehouseArea(e.value)}
                                                        onSelected={e => {
                                                            onSelectWarehouseArea(e.value)
                                                            //setWarehouseAreaId(-1)//cho nó về = 0 hoặc trừ 1 nếu báo lỗi
                                                        }}
                                                        items={WarehouseAreaId}
                                                        WareHouseId={WarehouseId}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                        {I18n.t("WareHouseShelve.ShelvesCode")}
                                                        <span className="form__title__note">(*)</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder=""
                                                        onChange={e => setShelvesCode(e.target.value.trim())}
                                                        value={ShelvesCode}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                        {I18n.t("WareHouseShelve.ShelvesName")}
                                                        <span className="form__title__note"> (*)</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder=""
                                                        onChange={e => setShelvesName(e.target.value)}
                                                        value={ShelvesName}
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
                                                            <h3 style={{ fontSize: '20px', color: 'darkgreen' }}> * Camera Settings *</h3>

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
                                                            <h3 style={{ fontSize: '15px', color: 'black' }}> Domain  <span className="form__title__note">({`eg:abc.cvvbbv.tv => get abc`})</span></h3>

                                                            <span className="form__title__note"></span>
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
                                                            <h3 style={{ fontSize: '15px', color: 'black' }}> Channels  <span className="form__title__note">({`if more than 1 channel, separated by ","`})</span></h3>

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
                                                        {I18n.t("WareHouseShelve.ShelvesList")} ({dataWareHouseShelves.length})
                                                    </span>
                                                </h3>
                                            </div>
                                            <div className="col-md-6 card-header-btn">
                                                <a className="btn btn-warning btn-sm float-right btn-header" onClick={a => Exportexcell(a)}>
                                                    <i className="fa fa-download mr-2" />
                                                    {I18n.t("System.Excel")}
                                                </a>
                                                <a className="btn btn-danger btn-sm float-right btn-header" onClick={a => DeleteAllWareHouseShelves(a)}>
                                                    <i className="fa fa-trash mr-2" />
                                                    {I18n.t("System.Delete")}
                                                </a>
                                                <a
                                                    className="btn btn-primary btn-sm float-right btn-header"
                                                    onClick={a => WH_spWareHouse_Shelves_List(a)}
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
                                                    <label className="form__title" >{I18n.t("WareHouseShelve.Area")}<span className="form__title__note">(*)</span></label>
                                                    <SelectArea
                                                        /// onSelected={e => onSelectAreaa(e.value)}
                                                        onSelected={e => {
                                                            onSelectAreaa(e.value)
                                                            setWarehouseIdd(-1)//cho nó về = 0 hoặc trừ 1 nếu báo lỗi
                                                            setWarehouseAreaIdd(-1)
                                                            setShelvesIdd(-1)
                                                        }}
                                                        onAreaId={AreaIdd}
                                                        items={AreaIdd}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t("WareHouseShelve.WarehouseAreaName")}<span className="form__title__note"></span></label>
                                                    <SelectWarehouse
                                                        //onSelected={e => onSelectWarehousee(e.value)}
                                                        onSelected={e => {
                                                            onSelectWarehousee(e.value)
                                                            setWarehouseAreaIdd(-1)//cho nó về = 0 hoặc trừ 1 nếu báo lỗi
                                                        }}
                                                        items={WarehouseIdd}
                                                        AreaId={AreaIdd}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t("WareHouseShelve.WarehouseAreaName")}<span className="form__title__note"></span></label>
                                                    <SelectWarehouseArea
                                                        //onSelected={e => onSelectWarehouseAreaa(e.value)}
                                                        onSelected={e => {
                                                            onSelectWarehouseAreaa(e.value)
                                                            setShelvesId(-1)//cho nó về = 0 hoặc trừ 1 nếu báo lỗi
                                                        }}
                                                        items={WarehouseAreaIdd}
                                                        WareHouseId={WarehouseIdd}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t("WareHouseShelve.ShelfCode/ShelfName")}<span className="form__title__note"></span></label>
                                                    <SelectShelves
                                                        //onSelected={e => onWareHouseShelves(e.value)}
                                                        onSelected={e => {
                                                            onWareHouseShelvess(e.value)
                                                            setShelvesId(-1)//cho nó về = 0 hoặc trừ 1 nếu báo lỗi
                                                        }}
                                                        items={ShelvesId}
                                                        WareHouseAreaId={WarehouseAreaIdd}
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
                                    {/* Begin Color List */}
                                    {/* { <div className={dataWareHouseShelves.length > 0 ? "" : "display-none"}>
                                        <DataTable data={dataWareHouseShelves} columns={columns} />
                                    </div> } */}
                                    {ViewImg}
                                    <div className={dataWareHouseShelves.length > 0 ? "" : "display-none"} >
                                        <SettingColumn
                                            columns={columns}
                                            Returndata={a => setcolumns(a)}
                                        />
                                        <DataTable
                                            data={dataWareHouseShelves}
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
