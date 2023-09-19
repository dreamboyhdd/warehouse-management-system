import React, { useState, useEffect, useRef } from "react";
import I18n from "../../../Language";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../Redux/Actions";
import { DataTable } from "../../../Common/DataTable";
import { Alerterror, Alertsuccess, Alertwarning, FormatDate, FormatDateJson, FirstOrLastDayinMonth, GetDataFromLogin, ExportExcel } from "../../../Utils";
import { SelectArea, SelectWarehouse, SelectAccount, SelectWarehouseArea, SettingColumn } from '../../../Common';
import DateTimePicker from "react-datetime-picker";
import { useAsyncDebounce } from "react-table";
import { ConfirmAlert } from "../../../Utils";
export const WareHouseArea = () => {
    //#regon begin using the effect hook
    useEffect(() => {

    }, []);

    ///tab hiện thị sửa trên table
    const [tittle, setTitle] = useState(I18n.t("validate.AddwarehouseArea"))

    //transmission CreateName,EditName

    //#end regon

    /////
    const dispatch = useDispatch();
    //const [State, setState] = useState();
    const [disable, setdisable] = useState(false);

    //transmission CreateName,EditName

    const AccountId = GetDataFromLogin("AccountId");
    const AccountName = GetDataFromLogin("AccountName");
    let datapermisstion = localStorage.getItem("Permissioninfor");

    //load Area save
    const [AreaId, setAreaId] = useState(-1);
    const onSelectArea = (areaId) => {
        setAreaId(areaId);
        console.log(areaId, "areaIdddddddddddddddd")

    }
    //load WareHouseCode SAVE
    const [WareHouseId, setWareHouseId] = useState(0);
    const onSelectWareHouse = (wareHouseId) => {
        setWareHouseId(wareHouseId);
        console.log(wareHouseId, "wareHouseIdddddddđ")

    }


    /////khai báo biến
    const [WareHouseAreaId, setWareHouseAreaId] = useState(0);
    const [WareHouseAreaCode, setWareHouseAreaCode] = useState('');
    const [WareHouseAreaName, setWareHouseAreaName] = useState('');
    const [Description, setDescription] = useState('');
    const [Length, setLength] = useState('');
    // const [Height, setHeight] = useState('');
    const [Width, setWidth] = useState('');
    const [SquareMeters, setSquareMeters] = useState('');
    //const [DataWareHouse, setDataWareHouse] = useState([]) 
    const [FileUpload, setFileUpload] = useState({});
    const [Images, setImages] = useState("");
    const [CreateName, setCreateName] = useState();
    const [Users,setUsers] = useState();
    const [Password,setPassword] = useState();
    const [Domain,setDomain] = useState();
    const [Channels,setChannels] = useState();
    const Accountinfor = JSON.parse(localStorage.getItem("Accountinfor") === "" ? "{}" : localStorage.getItem("Accountinfor"));

    //hàm save
    const WH_spWareHouse_Area_Save = async () => {
        debugger
        {
            //kiem tra quyen xem
            if (datapermisstion !== "") {
                let a = JSON.parse(datapermisstion);
                let b = a.find(p => p.WH_tblMenuModuleId === 64 && p.Views === 'C')
                if (b === undefined) {
                    Alertwarning(I18n.t("validate.YoudonothavepermissiontosaveWareHousearea!"));
                    return;
                }
            }
            //ràng buộc dữ liệu
            if (AreaId === -1) {
                Alertwarning(I18n.t("validate.PleaseSelectRegion!"));
                return;
            }
            if (WareHouseId === 0) {
                Alertwarning(I18n.t("validate.PleaseSelectWarehouseCode/RepositoryName!"));
                return;
            }

            if (WareHouseAreaCode === "") {
                Alertwarning(I18n.t("validate.Pleaseenterwarehouseareacode!"));
                return;
            }

            if (WareHouseAreaName === "") {
                Alertwarning(I18n.t("validate.Pleaseenterwarehouseareaname!"));
                return;

            }
            // if (WareHouseAreaName === "") {
            //     Alertwarning(I18n.t("validate.vui lòng nhâp tên khu vực kho !"));
            //     return;

            // }
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
            // if (Height === "") {
            //     Alertwarning("Vui lòng Nhập chiều cao!");
            //     return;
            // }
            // if (Height == 0) {
            //     Alertwarning("Vui lòng Nhập chiều cao lớn hơn 0!");
            //     return;
            // }
            if (Images === "") {
                Alertwarning(I18n.t("validate.PleaseChooseImage!"));
                return;
            }
            //image
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
                WareHouseAreaId: WareHouseAreaId,
                AreaId: AreaId,
                WareHouseId: WareHouseId,
                WareHouseAreaCode: WareHouseAreaCode.trim(),
                WareHouseAreaName: WareHouseAreaName.trim(),
                Description: Description.toString().replaceAll('"', "'"),
                Length: Length,
                Width: Width,
                SquareMeters: Length * Width,
                Images: img,
                CreateId: Accountinfor.AccountId,
                CreateName: Accountinfor.AccountName,
                Users:Users,
                Password:Password,
                Domain:Domain,
                Channels:Channels

            }
            //hàm
            setdisable(true)
            const params = {
                JSON: JSON.stringify(pr),
                func: "WH_spWareHouse_Area_Save"

            }
            try {
                const result = await mainAction.API_spCallServer(params, dispatch);
                setdisable(false)
                if (result.Status === "OK") {

                    Alertsuccess(result.ReturnMess);
                    //WH_spWareHouse_Area_List();
                    Cancel();
                    setTitle(I18n.t("validate.AddwarehouseArea"));

                }
                else {

                    Alerterror(result.ReturnMess);
                }
            } catch (error) {
                setdisable(false)
                Alerterror(I18n.t("validate.Dataerror,pleasecontactITNETCO!"));
            }
        }

    }
    //hàm list
    //load Area ở danh sách
    const [AreaIdd, setAreaIdd] = useState(-1);
    const onSelectAreaa = (areaIdd) => {
        setAreaIdd(areaIdd);
        console.log(areaIdd, "areaIdddddddddddddddd")

    }

    //load WareHouseCode chon ở danh sách
    const [wareHouseIdd, setWareHouseIdd] = useState(-1);
    const onSelectWareHousee = (wareHouseIdd) => {
        setWareHouseIdd(wareHouseIdd);
        console.log(wareHouseIdd, "wareHouseIdddddddđ")

    }
    //load WareHouseCodeArea chọn ở ds
    const [WareHouseAreaIdd, setWareHouseAreaIdd] = useState(-1);
    const onSelectWareHouseAreaa = (WareHouseAreaIdd) => {
        setWareHouseAreaIdd(WareHouseAreaIdd);
        console.log(WareHouseAreaIdd, "wareHouseIdddddddđ")

    }
    const [dataWareHouseArea, setdataWareHouseArea] = useState([]);
    const [CreateId, setCreateId] = useState(0);
    const WH_spWareHouse_Area_List = async () => {
        //kiem tra quyen xem
        if (datapermisstion !== "") {
            let a = JSON.parse(datapermisstion);
            let b = a.find(p => p.WH_tblMenuModuleId === 64 && p.Views === 'C')
            if (b === undefined) {
                Alertwarning(I18n.t("validate.Youdonothavepermissiontoviewthewarehousearea!"));
                return;
            }
        }

        if (AreaIdd === -1) {
            Alertwarning(I18n.t("validate.PleaseSelectRegion!"));
            return;
        }

        //setdisable(true)
        const pr = {
            WareHouseAreaId: WareHouseAreaIdd,
            WareHouseId: wareHouseIdd,
            AreaId: AreaIdd,
            CreateId: CreateId

        }

        const params = {
            JSON: JSON.stringify(pr),
            func: "WH_spWareHouse_Area_List"

        }
        try {
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.length > 0) {

                setdisable(false)
                setdataWareHouseArea(result);
                console.log(result);
            }
            else {
                Alertwarning(("Report.NoData"))
                setdataWareHouseArea([]);
                return;

            }

        } catch (error) {

            console.log(error);
            setdisable(false)
            Alerterror(I18n.t("validate.apierror!"));
        }


    }
    //cancel
    const Cancel = (e) => {
        setWareHouseAreaId(0)
        setWareHouseId(-1)
        setAreaId(-1)
        setWareHouseAreaCode('')
        setWareHouseAreaName('')
        setSquareMeters('')
        setDescription('')
        setLength('')
        setWidth('')
        setImages('')
        setUsers('')
        setPassword('')
        setDomain('')
        setChannels('')
        setTitle('THÊM MỚI KHU VỰC KHO');

    }

    //#region upload file image
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
        setTitle(I18n.t("WareHouseArea.EditWareHouseArea"))
        const editobj = data.row.original;//ĐỐI tượng
        setWareHouseId(editobj.WareHouseId)
        setWareHouseAreaId(editobj.WareHouseAreaId);
        setAreaId(editobj.AreaId);
        setWareHouseAreaCode(editobj.WareHouseAreaCode);
        setWareHouseAreaName(editobj.WareHouseAreaName);
        setDescription(editobj.Description);
        setImages(editobj.Images);
        setLength(editobj.Length);
        setWidth(editobj.Width);
        setSquareMeters(editobj.SquareMeters);
        setUsers(editobj.Users);
        setPassword(editobj.Password);
        setDomain(editobj.Domain);
        setChannels(editobj.Channels);
        document.querySelector("#tab_1").click();

    }

    //xóa từng dòng khi bấm nút cancel bị đứng 
    const clickDeleteSmall = (item) => {
        const numberrandom = Math.random();
        setIsDelete({ IsActive: numberrandom, Item: item });
    }

    //check all
    const [IsCheckedAll, setIsCheckedAll] = useState();
    const [keyC, setkeyC] = useState(false);
    useEffect(() => {
        if (IsCheckedAll === undefined) return;
        const datanew = [...dataWareHouseArea];
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
        setdataWareHouseArea(datanew);
    }, [IsCheckedAll]);

    //check
    const IsCheckedAllSmall = () => {
        const numberrandom = Math.random();
        setIsCheckedAll({ Id: numberrandom });

        //e.target.checked === true ? $("#checkboxAll").prop('checked', false) : $("#checkboxAll").prop('checked', true);

    }
    //delete// ITEM
    const [IsDelete, setIsDelete] = useState();
    useEffect(() => {
        if (IsDelete === undefined) return;///check để xóa

        const row = IsDelete.Item;///item
        const dataold = [...dataWareHouseArea];
        clickDelete(row, dataold);
    }, [IsDelete]);

    //delete .ROW
    const clickDelete = (data, dataold) => {
        const editobj = data.row.original;
        ConfirmAlert("Delete warehouse area", "Are you sure you want to delete this warehouse area?", async () => {
            {

                const pr = {
                    WareHouseAreaId: editobj.WareHouseAreaId,
                    CreateId: AccountId,
                    CreateName: AccountName,
                }
                //hàm delete

                const params = {
                    JSON: JSON.stringify(pr),
                    func: "WH_spWareHouse_Area_Delete"

                }
                try {
                    const result = await mainAction.API_spCallServer(params, dispatch);
                    if (result.Status === "OK")//Status,OK SQL save,để xóa đc hàm 
                    {

                        Alertsuccess(result.ReturnMess);
                        //xóa đối tựng trong mảng
                        const DataWareHouseArea = dataold;
                        const datadelete = DataWareHouseArea.filter(p => p.WareHouseAreaId !== editobj.WareHouseAreaId);
                        setdataWareHouseArea(datadelete);
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

            const datanew = [...dataWareHouseArea]
            datanew.find(p => p.WareHouseAreaId == Id).IsCheck = !Check;//check all
            setdataWareHouseArea(datanew);
        }
    }, [IsCheckOne]);

    ///delete multiple lines
    const DeleteAllWareHouseArea = async () => {
        //kttra quyền xóa
        if (datapermisstion !== "") {
            let a = JSON.parse(datapermisstion);
            let b = a.find(p => p.WH_tblMenuModuleId === 64 && p.Deletes === 'C')
            if (b === undefined) {
                Alertwarning(I18n.t("validate.Youdonothavetherighttodeletethewarehousearea!"));
                return;
            }

        }

        let check = dataWareHouseArea.filter(a => a.IsCheck === true)
        if (check.length === 0) {
            Alertwarning(I18n.t("validate.Pleaseselectthewarehouseareatodelete!"))
            return
        }
        ConfirmAlert("Delete warehouse area", "Are you sure you want to delete this warehouse area?", async () => {
            debugger
            const DataDelete = dataWareHouseArea.filter(p => p.IsCheck === true);
            if (DataDelete.length > 0) {


                //hàm delete
                const pr = {
                    AccountId: AccountId,
                    AccountName: AccountName,
                    ListWareHouseAreaManyId: DataDelete.map(item => { return { "WareHouseAreaId": item.WareHouseAreaId } })//xóa nhiều dòng thì thêm biến vào sql

                }
                const params = {
                    JSON: JSON.stringify(pr),
                    func: "WH_spWareHouse_Area_DeleteMany"

                }
                try {
                    const result = await mainAction.API_spCallServer(params, dispatch);

                    if (result.Status === "OK")//Status,OK SQL save,để xóa đc hàm 
                    {

                        Alertsuccess(result.ReturnMess);

                        //xóa đối tựng trong mảng
                        const DataWareHouseAreaNew = dataWareHouseArea.filter(p => p.IsCheck !== true);
                        setdataWareHouseArea(DataWareHouseAreaNew);
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


    //execel
    const Exportexcell = () => {
        //kiem tra quyen xem
        if (datapermisstion !== "") {
            let a = JSON.parse(datapermisstion);
            let b = a.find(p => p.WH_tblMenuModuleId === 64 && p.Excel === 'C')
            if (b === undefined) {
                Alertwarning(I18n.t("validate.YoudonothavepermissiontoexportExcel!"));
                return;
            }
        }
        const newData = dataWareHouseArea.map(element => {
            return {
                'Khu Vực': element.Name,
                'Tên Kho': element.WareHouseName,
                'Mã KV Kho': element.WareHouseAreaCode,
                'Tên KV kho': element.WareHouseAreaName,
                'Ghi Chú': element.Description,
                'Chiều Dài (mét)': element.Length,
                'Chiều Rộng (mét)': element.Width,
                'Diện Tích (m2)': element.SquareMeters,
                'SL Kệ': element.TotalArea,
                'Users':element.Users,
                'Password':element.Password,
                'Domain':element.Domain,
                'Channels':element.Channels,
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

            if (columns.find(a => a.accessor === 'WareHouseAreaCode') === undefined) { delete x["Mã KV kho"] }
            else if (columns.find(a => a.accessor === 'WareHouseAreaCode').show === false) { delete x["Mã KV kho"] }

            if (columns.find(a => a.accessor === 'WareHouseAreaName') === undefined) { delete x["Tên KV kho"] }
            else if (columns.find(a => a.accessor === 'WareHouseAreaName').show === false) { delete x["Tên KV kho"] }

            if (columns.find(a => a.accessor === 'Description') === undefined) { delete x["Ghi Chú"] }
            else if (columns.find(a => a.accessor === 'Description').show === false) { delete x["Ghi Chú"] }

            if (columns.find(a => a.accessor === 'Length') === undefined) { delete x["Chiều Dài (mét)"] }
            else if (columns.find(a => a.accessor === 'Length').show === false) { delete x["Chiều Dài (mét)"] }

            if (columns.find(a => a.accessor === 'Width') === undefined) { delete x["Chiều Rộng (mét)"] }
            else if (columns.find(a => a.accessor == 'Width').show === false) { delete x["Chiều Rộng (mét)"] }

            if (columns.find(a => a.accessor === 'SquareMeters') === undefined) { delete x["Diện Tích (m2)"] }
            else if (columns.find(a => a.accessor == 'SquareMeters').show === false) { delete x["Diện Tích (m2)"] }

            if (columns.find(a => a.accessor === 'TotalArea') === undefined) { delete x["SL Kệ"] }
            else if (columns.find(a => a.accessor === 'TotalArea').show === false) { delete x["SL Kệ"] }

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
            else if (columns.find(a => a.accessor === 'CreateName').show === false) { delete x["Người Tạo"] }

            if (columns.find(a => a.accessor === 'CreateTime') === undefined) { delete x["Ngày Tạo"] }
            else if (columns.find(a => a.accessor === 'CreateTime').show === false) { delete x["Ngày Tạo"] }


        });
        ExportExcel(newData, "Danh sách khu vực kho");
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
        //                     id={row.original.WareHouseAreaId} value={row.original.WareHouseAreaId}
        //                     checked={row.original.IsCheck}
        //                     onChange={e => setIsCheckOne({Id:row.original.WareHouseAreaId,Check:row.original.IsCheck})}
        //                 />
        //                 <label className="label checkbox" htmlFor={row.original.WareHouseAreaId}></label>
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
                            id={row.original.WareHouseAreaId} value={row.original.WareHouseAreaId}
                            checked={row.original.IsCheck}
                            onChange={e => setIsCheckOne({ Id: row.original.WareHouseAreaId, Check: row.original.IsCheck })}
                        />
                        <label className="label checkbox" htmlFor={row.original.WareHouseAreaId}></label>
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
            width: 100,
            filterable: false,
            special: true,
            show: true,
            accessor: 'WareHouseAreaId',
            Cell: (row) => (
                <div>
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
                            onClick={(e) => clickDeleteSmall({ row })}////xóa từng dòng
                        >
                            <i className="fa fa-trash"></i>
                        </button>
                    </span>
                </div>
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
            Header:I18n.t("WareHouse.Picture"),
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
            Header:I18n.t("WareHouse.Area"),
            accessor: "Name",
            //filterable: false,
            //sortable: false,
        },
        {
            Header: I18n.t("WareHouse.WareHouseName"),
            accessor: "WareHouseName",
            //filterable: false,
            //sortable: false,
        },
        {
            Header:I18n.t("WareHouse.WareHouseAreaCode"), 
            accessor: "WareHouseAreaCode",
            //filterable: false,
            //sortable: false,
        },
        {
            Header:I18n.t("WareHouse.WareHouseAreaName"),
            accessor: "WareHouseAreaName",
            //filterable: false,
            //sortable: false,
        },
        {
            Header:I18n.t("WareHouse.Length(meters)"),
            accessor: "Length",
            //filterable: false,
            //sortable: false,
        },
        {
            Header:I18n.t("WareHouse.Width(meters)"),
            accessor: "Width",
            //filterable: false,
            //sortable: false,
        },

        {
            Header:I18n.t("WareHouse.SquareMeters(meters)"),
            accessor: "SquareMeters",
            //filterable: false,
            //sortable: false,
        },

        {
            Header:I18n.t("WareHouse.Description"),
            accessor: "Description",
            width: 150,
            //filterable: false,
            //sortable: false,
        },
        {
            Header:I18n.t("WareHouse.NumberofShelves"),
            accessor: "TotalArea",
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
            Header:I18n.t("System.Creater"),
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
                                                    onClick={WH_spWareHouse_Area_Save}
                                                    disabled={!disable}
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
                                                    <label className="form__title" >{I18n.t("WareHouse.Area")} <span className="form__title__note">(*)</span></label>
                                                    <SelectArea
                                                        onSelected={e => {
                                                            onSelectArea(e.value)
                                                            setWareHouseId(0)
                                                        }}
                                                        onAreaId={AreaId}
                                                        items={AreaId}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t("WareHouse.WarehouseCode/WarehouseName")}<span className="form__title__note">(*)</span></label>
                                                    <SelectWarehouse
                                                        onSelected={e => onSelectWareHouse(e.value)}
                                                        items={WareHouseId}
                                                        AreaId={AreaId}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                    {I18n.t("WareHouse.WarehouseAreaCode")}
                                                        <span className="form__title__note"> (*)</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder=""
                                                        onChange={e => setWareHouseAreaCode(e.target.value.trim())}
                                                        value={WareHouseAreaCode}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                    {I18n.t("WareHouse.WarehouseAreaName")}
                                                        <span className="form__title__note"> (*)</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder=""
                                                        onChange={e => setWareHouseAreaName(e.target.value)}
                                                        value={WareHouseAreaName}
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
                                                        <span className="form__title__note"> (*) </span>
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
                                        <div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="ml-4 mb-2">
                                                {I18n.t("WareHouse.Illustrations")}
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
                                                        <span className="image-collapse-span"> {I18n.t("WareHouse.Uploadimages")}</span>
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
                                                <h3 style={{ fontSize: '20px', color: 'darkgreen' }}> *  Camera Settings *</h3>
                                                   
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
                                                <h3 style={{ fontSize: '15px', color: 'black'}}> Password</h3>
                                                
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
                                                <h3 style={{ fontSize: '15px', color: 'black' }}> Domain  <span className="form__title__note">(eg:abc.cvvbbv.tv => get abc)</span></h3>
                                              
                                                    <span className="form__title__note"></span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder=""
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
                                                <h3 style={{ fontSize: '15px', color: 'black' }}> Channels  <span className="form__title__note">(if more than 1 channel, separated by ",")</span></h3>

                                            
                                                    <span className="form__title__note"></span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder=""
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
                                                    {I18n.t("WareHouseArea.Listofwarehouseareas")} ({dataWareHouseArea.length})
                                                    </span>
                                                </h3>
                                            </div>
                                            <div className="col-md-6 card-header-btn">
                                                <a className="btn btn-warning btn-sm float-right btn-header" onClick={a => Exportexcell(a)}>
                                                    <i className="fa fa-download mr-2" />
                                                    {I18n.t("System.Excel")}
                                                </a>
                                                <a className="btn btn-danger btn-sm float-right btn-header" onClick={a => DeleteAllWareHouseArea(a)}>
                                                    <i className="fa fa-trash mr-2" />
                                                    {I18n.t("System.Delete")}
                                                </a>
                                                <a
                                                    className="btn btn-primary btn-sm float-right btn-header"
                                                    onClick={a => WH_spWareHouse_Area_List(a)}
                                                >
                                                    <i className="fa fa-eye mr-2" />
                                                    {I18n.t("System.View")}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body-form">
                                        <div className="row pb-12">
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title"> {I18n.t("WareHouse.Area")} <span className="form__title__note">(*)</span></label>
                                                    <SelectArea
                                                        onSelected={e => {
                                                            onSelectAreaa(e.value)
                                                            //setWareHouseIdd(-1)//cho nó về = 0 hoặc trừ 1 nếu báo lỗi
                                                        }}
                                                        onAreaId={AreaIdd}
                                                        items={AreaIdd}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t("WareHouseArea.WarehouseCode/WarehouseName")}<span className="form__title__note"></span></label>
                                                    <SelectWarehouse
                                                        onSelected={e => onSelectWareHousee(e.value)}
                                                        items={wareHouseIdd}
                                                        AreaId={AreaIdd}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t("WareHouseArea.WarehouseAreaCode/WarehouseAreaName")}<span className="form__title__note"></span></label>
                                                    <SelectWarehouseArea
                                                        onSelected={e => {
                                                            onSelectWareHouseAreaa(e.value)
                                                            //setWareHouseAreaIdd(-1)//cho nó về = 0 hoặc trừ 1 nếu báo lỗi
                                                        }}

                                                        items={WareHouseAreaIdd}
                                                        WareHouseId={wareHouseIdd}
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
                                    {/* Begin Color List
                                     {<div className={dataWareHouseArea.length > 0 ? "" : "display-none"}>
                                        <DataTable data={dataWareHouseArea} columns={columns} />
                                    </div>} */}
                                    {ViewImg}
                                    <div className={dataWareHouseArea.length > 0 ? "" : "display-none"} >
                                        <SettingColumn
                                            columns={columns}
                                            Returndata={a => setcolumns(a)}
                                        />
                                        <DataTable
                                            data={dataWareHouseArea}
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
