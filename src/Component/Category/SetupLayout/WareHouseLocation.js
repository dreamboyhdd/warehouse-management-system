import React, { useState, useEffect, useRef } from "react";
import I18n from "../../../Language";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../Redux/Actions";
import { DataTable } from "../../../Common/DataTable";
import { Alerterror, Alertsuccess, Alertwarning, FormatDate, FormatDateJson, FirstOrLastDayinMonth, GetDataFromLogin, ExportExcel } from "../../../Utils";
import { SelectArea, SelectLocationAddress, SelectWarehouse, SelectAccount, SelectFloor, SelectLocation, SelectShelves, SelectWarehouseArea, SettingColumn } from '../../../Common';
import DateTimePicker from "react-datetime-picker";
import { QRCodeSVG } from 'qrcode.react';
import { ConfirmAlert } from "../../../Utils";
import $ from 'jquery';
export const WareHouseLocation = () => {

    //#regon begin using the effect hook
    useEffect(() => {

    }, []);
    //#end regon
    //tab hiện thị sửa trên table
    const [tittle, setTitle] = useState(I18n.t("WareHouseLocation.AddNewLocation"))
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
    const onSelectWareHouseArea = (WarehouseAreaId) => {
        setWarehouseAreaId(WarehouseAreaId);
    }
    //load Shelves
    const [ShelvesId, setShelvesId] = useState(-1);
    const onSelectShelves = (ShelvesId) => {
        setShelvesId(ShelvesId);
    }
    //load FloorId
    const [FloorId, setFloorId] = useState(-1);
    const onSelectFloor = (FloorId) => {
        setFloorId(FloorId);
    }
    ////////////cú pháp
    const dispatch = useDispatch();
    const [disbtn, setdisbtn] = useState();
    //const [State, setState] = useState()
    const [FileUpload, setFileUpload] = useState({});
    const Accountinfor = JSON.parse(localStorage.getItem("Accountinfor") === "" ? "{}" : localStorage.getItem("Accountinfor"));

    //declare variable to receive data

    const [LocationCode, setLocationCode] = useState('');
    const [LocationName, setLocationName] = useState('');
    const [Description, setDescription] = useState('');
    const [Images, setImages] = useState('');
    const [Length, setLength] = useState('');
    const [Height, setHeight] = useState('');
    const [Width, setWidth] = useState('');
    const [SquareMeters, setSquareMeters] = useState('');
    const [QRCode, setQRCode] = useState('');
    const [CreateName, setCreateName] = useState();
    const [Checkall, setCheckall] = useState(false);
    const [dataarray, setdataarray] = useState("");
    useEffect(() => {
        if (dataarray.keys === "check") {
            CheckOne(dataarray._row.original.LocationId, dataarray._row.original.IsCheck);
        } else if (dataarray.keys === 'checkall') {
            CheckOne(0, Checkall)
        }
    }, [dataarray]);
    // save
    const WH_spWareHouse_Location_Save = async () => {
        //kiem tra quyen luu
        if (datapermisstion !== "") {
            let a = JSON.parse(datapermisstion);
            let b = a.find(p => p.WH_tblMenuModuleId === 67 && p.Adds === 'C')
            if (b === undefined) {
                Alertwarning(I18n.t("validate.Youdonothavepermissiontocreatelocation!"));
                return;
            }
        }
        {
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
            if (ShelvesId === -1) {
                Alertwarning(I18n.t("validate.PleaseChooseShelves!"));
                return;
            }
            //  if (ShelvesId === -1) {
            //     Alertwarning("Vui lòng Chọn kệ!");
            //     return;
            // }
            if (FloorId === -1) {
                Alertwarning(I18n.t("validate.PleaseChooseFloor!"));
                return;
            }
            if (LocationCode === "") {
                Alertwarning(I18n.t("validate.PleaseEnterthelocationcode!"));
                return;
            }
            if (LocationName === "") {
                Alertwarning(I18n.t("validate.Pleaseenterthelocationname!"));
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
                Alertwarning("ADDNEWLOCATION");
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
                LocationId: LocationId,
                FloorId: FloorId,
                ShelvesId: ShelvesId,
                AreaId: AreaId,
                WarehouseAreaId: WarehouseAreaId,
                WareHouseId: WarehouseId,
                LocationCode: LocationCode,
                LocationName: LocationName.trim(),
                Images: img,
                Length: Length,
                Width: Width,
                Height: Height,
                SquareMeters: Length * Width,
                Description: Description.toString().replaceAll('"', "'"),
                QRCode: QRCode,
                CreateId: Accountinfor.AccountId,
                CreateName: Accountinfor.AccountName

            };
            const params = {
                Json: JSON.stringify(pr),
                func: "WH_spWareHouse_Location_Save",
            };
            //khóa nút
            setdisbtn(true);

            try {
                const result = await mainAction.API_spCallServer(params, dispatch);
                setdisbtn(false);
                if (result.Status === "OK") {
                    Alertsuccess(result.ReturnMess);
                    Cancel();
                    setTitle(I18n.t("validate.ADDNEWLOCATION"));


                }
                else {

                    Alerterror(result.ReturnMess);
                }
            } catch (error) {
                setdisbtn(false);
                Alerterror(I18n.t("validate.Dataerror,pleasecontactITNETCO!"));
            }
        }
    }

    // // list
    //load Area dsach
    const [AreaIdd, setAreaIdd] = useState(-1);
    const onSelectAreaa = (areaIdd) => {
        setAreaIdd(areaIdd);
        console.log(areaIdd, "areaIdddddddddddddddd")

    }

    //load WareHouseCode dsach
    const [WarehouseIdd, setWarehouseIdd] = useState(-1);
    const onSelectWarehousee = (WarehouseIdd) => {
        setWarehouseIdd(WarehouseIdd);
        console.log(WarehouseIdd, "wareHouseIdddddddđ")

    }

    //load WareHouseAreaCode dsach
    const [WarehouseAreaIdd, setWarehouseAreaIdd] = useState(-1);
    const onSelectWareHouseAreaa = (WarehouseAreaIdd) => {
        setWarehouseAreaIdd(WarehouseAreaIdd);
        console.log(WarehouseAreaIdd, "wareHouseIdddddddđ")

    }


    //load Shelves dsach
    const [ShelvesIdd, setShelvesIdd] = useState(-1);
    const onSelectShelvess = (ShelvesIdd) => {
        setShelvesIdd(ShelvesIdd);
        console.log(ShelvesIdd, "setShelvesId")

    }

    //load FloorId dsach
    const [FloorIdd, setFloorIdd] = useState(-1);
    const onSelectFloorr = (FloorIdd) => {
        setFloorIdd(FloorIdd);
        console.log(FloorIdd, "FloorId")

    }

    //load location dsach
    const [LocationId, setLocationId] = useState(0);
    const onSelectLocation = (LocationId) => {
        setLocationId(LocationId);
        console.log(LocationId, "LocationId")

    }
    const [DataWareHouseLocation, setDataWareHouseLocation] = useState([]);
    const [CreateId, setCreateId] = useState(0);
    const WH_spWareHouse_Location_List = async () => {
        //kiem tra quyen xem
        if (datapermisstion !== "") {
            let a = JSON.parse(datapermisstion);
            let b = a.find(p => p.WH_tblMenuModuleId === 67 && p.Views === 'C')
            if (b === undefined) {
                Alertwarning(I18n.t("validate.Youdonothavepermissiontoviewlocation!"));
                return;
            }
        }
        if (AreaIdd === -1) {
            Alertwarning(I18n.t("Report.NoData!"));
            return;
        }

        const pr = {
            Json: JSON.stringify({
                LocationId: LocationId,
                FloorId: FloorIdd,
                ShelvesId: ShelvesIdd,
                WarehouseAreaId: WarehouseAreaIdd,
                WarehouseId: WarehouseIdd,
                AreaId: AreaIdd,
                CreateId: CreateId

            }),

            func: "WH_spWareHouse_Location_List"
        };
        //khóa nút
        setdisbtn(true);
        try {
            const result = await mainAction.API_spCallServer(pr, dispatch);
            if (result.length > 0) {
                setdisbtn(false);
                console.log(result)
                setDataWareHouseLocation(result);

            }
            else {
                Alertwarning(I18n.t("Report.NoData!"))
                setDataWareHouseLocation([]);
                return;
            }
        } catch (error) {
            setdisbtn(false);
            console.log(error);
            Alerterror(I18n.t("validate.apierror!"));
        }
    }
    // ///edit
    const clickEdit = (data) => {
        setTitle(I18n.t("WareHouseLocation.EditLocation"))
        const editobj = data.row.original;//ĐỐI tượng
        setLocationId(editobj.LocationId);
        setFloorId(editobj.FloorId);
        setShelvesId(editobj.ShelvesId);
        setWarehouseAreaId(editobj.WarehouseAreaId);
        setWarehouseId(editobj.WarehouseId);
        setAreaId(editobj.AreaId);
        setLocationCode(editobj.LocationCode);
        setLocationName(editobj.LocationName);
        setDescription(editobj.Description);
        setImages(editobj.Images);
        setLength(editobj.Length);
        setWidth(editobj.Width);
        setHeight(editobj.Height);
        setSquareMeters(editobj.SquareMeters);
        document.querySelector("#tab_1").click();


    }
    //check all
    const [IsCheckedAll, setIsCheckedAll] = useState();
    const [keyC, setkeyC] = useState(false);
    useEffect(() => {
        if (IsCheckedAll === undefined) return;
        const datanew = [...DataWareHouseLocation];
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
        setDataWareHouseLocation(datanew);
    }, [IsCheckedAll]);

    //check all
    const IsCheckedAllSmall = () => {

        const numberrandom = Math.random();
        setIsCheckedAll({ Id: numberrandom });

        //e.target.checked === true ? $("#checkboxAll").prop('checked', false) : $("#checkboxAll").prop('checked', true);

    }
    //xóa từng dòng khi bấm nút cancel bị đứng
    const clickDeleteSmall = (item) => {
        const numberrandom = Math.random();
        setIsDelete({ IsActive: numberrandom, Item: item });
    }
    //delete// useEffect bỏ biến vào để xóa dataold
    const [IsDelete, setIsDelete] = useState();
    useEffect(() => {
        if (IsDelete === undefined) return;
        const row = IsDelete.Item;
        const dataold = [...DataWareHouseLocation];
        clickDelete(row, dataold);
    }, [IsDelete]);

    ///check chọn nhiều ô để xóa ID hoa và thường
    const [IsCheckOne, setIsCheckOne] = useState({ Id: 0, Check: false });
    useEffect(() => {
        if (IsCheckOne.Id !== 0 && IsCheckOne.Id !== undefined) {
            let Id = IsCheckOne.Id;
            let Check = IsCheckOne.Check;

            if (Check === undefined || Check === null)
                Check = false;

            const datanew = [...DataWareHouseLocation]
            datanew.find(p => p.LocationId == Id).IsCheck = !Check;
            setDataWareHouseLocation(datanew);
        }
    }, [IsCheckOne]);


    //delete
    const clickDelete = async (data, dataold) => {
        if (data === undefined) return;
        const editobj = data.row.original;

        ConfirmAlert("Delete Location", "Are you sure you want to delete this Location?", async () => {
            const pr = {
                LocationId: editobj.LocationId,
                CreateId: AccountId,
                CreateName: AccountName,

            }
            //hàm delete
            const params = {
                JSON: JSON.stringify(pr),
                func: "WH_spWareHouse_Location_Delete"

            }
            try {
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result.Status === "OK")//Status,OK SQL save,để xóa đc hàm 
                {
                    Alertsuccess(result.ReturnMess);
                    //xóa đối tựng trong mảng
                    const DataWareHouseLocatio = dataold;
                    const datadelete = DataWareHouseLocatio.filter(p => p.LocationId !== editobj.LocationId);
                    setDataWareHouseLocation(datadelete);
                }
                else {
                    Alerterror(result.ReturnMess);
                }
            } catch (error) {
                console.log(error);
                Alerterror(I18n.t("validate.apierror!"));;

            }

        })
    }


    ///delete multiple lines
    const DeleteAllWareHouseLocation = async () => {
        //kttra quyền xóa
        if (datapermisstion !== "") {
            let a = JSON.parse(datapermisstion);
            let b = a.find(p => p.WH_tblMenuModuleId === 67 && p.Deletes === 'C')
            if (b === undefined) {
                Alertwarning(I18n.t("validate.Youdonothavetherighttodeletethelocation!"));
                return;
            }

        }
        let check = DataWareHouseLocation.filter(a => a.IsCheck === true)
        if (check.length === 0) {
            Alertwarning(I18n.t("validate.PleaseselecttheLocationtodelete!"))
            return
        }
        ConfirmAlert("Delete Location", "AreyousureyouwanttodeletethisLocation?", async () => {

            {
                const DataDelete = DataWareHouseLocation.filter(p => p.IsCheck === true);
                // if (DataDelete.length === 0) {
                //     Alertwarning('Vui lòng chọn kho để xóa!')
                //     return
                // }
                if (DataDelete.length > 0) {
                    //hàm delete
                    const pr = {
                        AccountId: AccountId,
                        AccountName: AccountName,
                        ListDeleteWareHouseLocationId: DataDelete.map(item => { return { "LocationId": item.LocationId } })//xóa nhiều dòng thì thêm biến vào sql

                    }

                    const params = {
                        JSON: JSON.stringify(pr),
                        func: "WH_spWareHouse_Location_DeleteMany"

                    }
                    try {
                        const result = await mainAction.API_spCallServer(params, dispatch);

                        if (result.Status === "OK")//Status,OK SQL save,để xóa đc hàm 
                        {
                            //xóa đối tựng trong mảng
                            const DataWareHouseLocationNew = DataWareHouseLocation.filter(p => p.IsCheck !== true);
                            setDataWareHouseLocation(DataWareHouseLocationNew);
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
        //kiem tra quyen Excel
        if (datapermisstion !== "") {
            let a = JSON.parse(datapermisstion);
            let b = a.find(p => p.WH_tblMenuModuleId === 67 && p.Excel === 'C')
            if (b === undefined) {
                Alertwarning(I18n.t("validate.YoudonothavepermissiontoexportExcel!"));
                return;
            }
        }
        const newData = DataWareHouseLocation.map(element => {
            return {
                'Khu Vực': element.Name,
                'Tên Kho': element.WareHouseName,
                'Khu Vực Kho': element.WareHouseAreaName,
                'Kệ': element.ShelvesCode,
                //'Mã Tầng': element.FloorCode,
                'Tên Tầng': element.FloorName,
                'Mã Location': element.LocationCode,
                'Tên Location': element.LocationName,
                'Chiều Dài (mét)': element.Length,
                'Chiều Rộng (mét)': element.Width,
                'Chiều Cao (mét)': element.Height,
                'Diện Tích (m2)': element.SquareMeters,
                'Ghi Chú': element.Description,
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

            if (columns.find(a => a.accessor === 'WareHouseAreaName') === undefined) { delete x["Khu Vực Kho"] }
            else if (columns.find(a => a.accessor === 'WareHouseAreaName').show === false) { delete x["Khu Vực Kho"] }

            if (columns.find(a => a.accessor === 'ShelvesCode') === undefined) { delete x["Kệ"] }
            else if (columns.find(a => a.accessor === 'ShelvesCode').show === false) { delete x["Kệ"] }

            // if (columns.find(a => a.accessor === 'FloorCode') === undefined) { delete x["Mã Tầng"] }
            // else if (columns.find(a => a.accessor === 'FloorCode').show === false) { delete x["Mã Tầng"] }

            if (columns.find(a => a.accessor === 'FloorName') === undefined) { delete x["Tên Tầng"] }
            else if (columns.find(a => a.accessor === 'FloorName').show === false) { delete x["Tên Tầng"] }

            if (columns.find(a => a.accessor === 'LocationCode') === undefined) { delete x["Mã Location"] }
            else if (columns.find(a => a.accessor === 'LocationCode').show === false) { delete x["Mã Location"] }

            if (columns.find(a => a.accessor === 'LocationName') === undefined) { delete x["Tên Location"] }
            else if (columns.find(a => a.accessor === 'LocationName').show === false) { delete x["Tên Location"] }

            if (columns.find(a => a.accessor === 'Length') === undefined) { delete x["Chiều Dài (mét)"] }
            else if (columns.find(a => a.accessor === 'Length').show === false) { delete x["Chiều Dài (mét)"] }

            if (columns.find(a => a.accessor === 'Width') === undefined) { delete x["Chiều Rộng (mét)"] }
            else if (columns.find(a => a.accessor == 'Width').show === false) { delete x["Chiều Rộng(mét)"] }

            if (columns.find(a => a.accessor === 'Height') === undefined) { delete x["Chiều Cao (mét)"] }
            else if (columns.find(a => a.accessor == 'Height').show === false) { delete x["Chiều Cao (mét)"] }

            if (columns.find(a => a.accessor === 'SquareMeters') === undefined) { delete x["Diện Tích (m2)"] }
            else if (columns.find(a => a.accessor == 'SquareMeters').show === false) { delete x["Diện Tích (m2)"] }


            if (columns.find(a => a.accessor === 'Description') === undefined) { delete x["Ghi Chú"] }
            else if (columns.find(a => a.accessor === 'Description').show === false) { delete x["Ghi Chú"] }

            if (columns.find(a => a.accessor === 'EditName') === undefined) { delete x["Người Sửa"] }
            else if (columns.find(a => a.accessor === 'EditName').show === false) { delete x["Người Sửa"] }

            if (columns.find(a => a.accessor === 'EditTime') === undefined) { delete x["Ngày Sửa"] }
            else if (columns.find(a => a.accessor === 'EditTime').show === false) { delete x["Ngày Sửa"] }

            if (columns.find(a => a.accessor === 'CreateName') === undefined) { delete x["Người Tạo"] }
            else if (columns.find(a => a.accessor === 'CreateName').show === false) { delete x["Người Tạo"] }

            if (columns.find(a => a.accessor === 'CreateTime') === undefined) { delete x["Ngày Tạo"] }
            else if (columns.find(a => a.accessor === 'CreateTime').show === false) { delete x["Ngày Tạo"] }


        });
        ExportExcel(newData, (I18n.t("WareHouseLocation.Title")));
    }

    // Begin cancel
    const Cancel = () => {
        setAreaIdd(0)
        setWarehouseId(-1)
        setLocationId(0)
        setFloorId(-1)
        setShelvesId(-1)
        setAreaId(-1)
        setWarehouseAreaId(-1)
        setLocationCode('')
        setLocationName('')
        setImages('')
        setLength('')
        setWidth('')
        setHeight('')
        setDescription('')
        setSquareMeters('')
        //setdisbtn(false);//mở nút
        setTitle(I18n.t("WareHouseLocation.Title"));
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
                                {I18n.t("WareHouseLocation.Qrcode")}
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

    ///coloums
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

            accessor: "LocationId",
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
                            id={row.original.LocationId}
                            key={row.original.LocationId}
                            value={row.original.LocationId}
                            checked={row.original.IsCheck}
                            onChange={(e) => setdataarray({ _row: row, keys: "check" })}
                        />
                        <label
                            className="label checkbox"
                            htmlFor={row.original.LocationId}
                        ></label>
                    </div>
                </div>
            ),

        },
        /*  {
                 Cell: (row) => (
                     <div className="col-sm-12 col-md-2">
                         <div className="icheck-success d-inline">
                             <input type="checkbox"
                                 id={row.original.LocationId} value={row.original.LocationId}
                                 checked={row.original.IsCheck}
                                 onChange={e => setIsCheckOne({ Id: row.original.LocationId, Check: row.original.IsCheck })}
                             />
                             <label className="label checkbox" htmlFor={row.original.LocationId}></label>
                         </div>
                     </div>
                 ),
                 maxWidth: 50,
                 textAlign: "center",
                 filterable: false,
                 sortable: false,
                 special: true,///loại bỏ checkbox ra khi chọn nút cài đăt
                 show: true,//
     
             }, */
        {
            Header: I18n.t("System.Option"),
            width: 200,
            // filterable: false,
            // sortable: false,
            special: true,///loại bỏ checkbox ra khi chọn nút cài đăt
            show: true,//
            accessor: 'LocationId',
            Cell: (row) => (
                // <div>
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
                    {/*  <button
                        className="btn btn-sm btn btn-warning ml-2"
                        onClick={(e) => {
                            PrintQRCode(row.original.LocationCode);
                        }}
                    >
                        {I18n.t("WareHouseLocation.PrintQRCode")}
                    </button> */}
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
            //filterable: false,
        },
        // {
        //     Header: I18n.t("Actual.Qrcode"),
        //     accessor: "QRCode",
        //     //filterable: false,
        //     //sortable: false,
        //     Cell: (row) => (
        //         <div>

        //         <a
        //                 className="cursor"
        //                 data-toggle="modal"
        //                 data-target="#dataQRCode"
        //                 onClick={(e) => {
        //                     viewQRCodeInTable(row.original.LocationCode);
        //                 }}
        //                 title="Click để xem qrcode"
        //                 style={{display:'block'}}
        //             >
        //                  <QRCodeSVG
        //                     id="1"
        //                     value={row.original.LocationCode}///đóng mở thẻ a
        //                     size={30}     
        //                 />
        //             </a>

        //         </div>


        //     ),
        // },
        {
            Header: I18n.t("WareHouseLocation.Picture"),
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
                        title={I18n.t("WareHouseLocation.Clicktoviewlargeimage")}
                    >
                        <img src={row.original.Images} height="30" width="50" />
                    </a>
                </div>

            ),
        },
        {
            Header: I18n.t("WareHouseLocation.Area"),
            accessor: "Name",
            //filterable: false,
            //sortable: false,
        },

        {
            Header: I18n.t("WareHouseLocation.NameoftheWarehouse"),
            accessor: "WareHouseName",
            //filterable: false,
            //sortable: false,
        },
        {
            Header: I18n.t("WareHouseLocation.WarehouseArea"),
            accessor: "WareHouseAreaName",
            //filterable: false,
            //sortable: false,
        },
        {
            Header: I18n.t("WareHouseLocation.Shelf"),
            accessor: "ShelvesName",
            //filterable: false,
            //sortable: false,
        },
        {
            Header: I18n.t("WareHouseLocation.FloorName"),
            accessor: "FloorName",
            //filterable: false,
            //sortable: false,
        },
        {
            Header: I18n.t("WareHouseLocation.LocationCode"),
            accessor: "LocationCode",
            //filterable: false,
            //sortable: false,
        },
        {
            Header: I18n.t("WareHouseLocation.LocationName"),
            accessor: "LocationName",
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
            width: 100,
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
    ////Print
    const CheckOne = (Id, Check) => {
        debugger
        let _DataList = [...DataWareHouseLocation]
        if (Id == 0) {
            _DataList.forEach(i => { i.IsCheck = !Checkall })
            setCheckall(!Checkall)
        } else {
            if (Check === undefined)
                Check = false;
            _DataList.find((p) => p.LocationId == Id).IsCheck = !Check;
        }
        setDataWareHouseLocation(_DataList);
    };
    const [PrintdataQRCode, setPrintdataQRCode] = useState([]);
    const [HtmlPrint, setHtmlPrint] = useState([]);
    const PrintQRCode = async (QRCode) => {
        debugger
        const DataPrint = DataWareHouseLocation.filter(p => p.IsCheck === true);
        if (DataPrint.length === 0) {
            Alertwarning(I18n.t("System.Pleaseselecttheproducttoprint!"))
            return
        }
        await setPrintdataQRCode(DataPrint);

        $("#Printform").css("display", "block");
        $("#formaction").css("display", "none");
        $("footer").css("display", "none");
        window.print();
        $("#Printform").css("display", "none");
        $("#formaction").css("display", "block");
        $("footer").css("display", "block");
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
                                                        onClick={WH_spWareHouse_Location_Save}
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
                                                        <label className="form__title" >{I18n.t("WareHouseLocation.Area")} <span className="form__title__note">(*)</span></label>
                                                        <SelectArea
                                                            // onSelected={e => {
                                                            //     onSelectArea(e.value)
                                                            //     setWarehouseId(-1)
                                                            //  }}
                                                            onSelected={e => {
                                                                onSelectArea(e.value)
                                                                setWarehouseId(-1)//cho nó về = 0 hoặc trừ 1 nếu báo lỗi
                                                                setWarehouseAreaId(-1)
                                                                setShelvesId(-1)
                                                                setFloorId(-1)
                                                            }}
                                                            onAreaId={AreaId}
                                                            items={AreaId}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <div className="form-group">
                                                        <label className="form__title" >{I18n.t("WareHouseLocation.NameoftheWarehouse")}<span className="form__title__note">(*)</span></label>
                                                        <SelectWarehouse
                                                            onSelected={e => onSelectWarehouse(e.value)}
                                                            items={WarehouseId}
                                                            AreaId={AreaId}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <div className="form-group">
                                                        <label className="form__title" >{I18n.t("WareHouseLocation.WarehouseArea")}<span className="form__title__note">(*)</span></label>
                                                        <SelectWarehouseArea
                                                            onSelected={e => onSelectWareHouseArea(e.value)}
                                                            items={WarehouseAreaId}
                                                            WareHouseId={WarehouseId}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <div className="form-group">
                                                        <label className="form__title" >{I18n.t("WareHouseLocation.Shelf")}<span className="form__title__note">(*)</span></label>
                                                        <SelectShelves
                                                            onSelected={e => onSelectShelves(e.value)}
                                                            items={ShelvesId}
                                                            WareHouseAreaId={WarehouseAreaId}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <div className="form-group">
                                                        <label className="form__title" > {I18n.t("WareHouseLocation.FloorName")}<span className="form__title__note">(*)</span></label>
                                                        <SelectFloor
                                                            onSelected={e => onSelectFloor(e.value)}
                                                            items={FloorId}
                                                            ShelvesId={ShelvesId}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <div className="form-group">
                                                        <label className="form__title">
                                                            {I18n.t("WareHouseLocation.LocationCode")}
                                                            <span className="form__title__note"> (*)</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder=""
                                                            onChange={e => setLocationCode(e.target.value.trim())}
                                                            value={LocationCode}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <div className="form-group">
                                                        <label className="form__title">
                                                            {I18n.t("WareHouseLocation.LocationName")}
                                                            <span className="form__title__note"> (*)</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder=""
                                                            onChange={e => setLocationName(e.target.value)}
                                                            value={LocationName}
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
                                                            <span className="form__title__note"> (*)</span>
                                                        </label>
                                                        <input
                                                            disabled
                                                            type="text"
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
                                                    <div className="ml-3 mb-2">
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
                                                            <span className="image-collapse-span">  {I18n.t("WareHouse.Uploadimages")}</span>
                                                        </label>
                                                    }
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
                                                            {I18n.t("WareHouseLocation.LocationList")} ({DataWareHouseLocation.length})
                                                        </span>
                                                    </h3>
                                                </div>
                                                <div className="col-md-6 card-header-btn">
                                                    <a
                                                        className="btn btn-success btn-sm float-right btn-header"
                                                        onClick={(e) => PrintQRCode(LocationId)}
                                                    >
                                                        <i className="fa fa-print pr-1" />
                                                        {I18n.t("System.print")}
                                                    </a>
                                                    <a className="btn btn-warning btn-sm float-right btn-header" onClick={Exportexcell}>
                                                        <i className="fa fa-download mr-2" />
                                                        {I18n.t("System.Excel")}
                                                    </a>
                                                    <a className="btn btn-danger btn-sm float-right btn-header" onClick={DeleteAllWareHouseLocation}>
                                                        <i className="fa fa-trash mr-2" />
                                                        {I18n.t("System.Delete")}
                                                    </a>
                                                    <a
                                                        className="btn btn-primary btn-sm float-right btn-header"
                                                        onClick={WH_spWareHouse_Location_List}
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
                                                        <label className="form__title" >{I18n.t("WareHouseLocation.Area")}<span className="form__title__note">(*)</span></label>
                                                        <SelectArea
                                                            //onSelected={e => onSelectAreaa(e.value)}
                                                            onSelected={e => {
                                                                onSelectAreaa(e.value)
                                                                setWarehouseIdd(-1)//cho nó về = 0 hoặc trừ 1 nếu báo lỗi
                                                                setWarehouseAreaIdd(-1)
                                                                setShelvesIdd(-1)
                                                                setFloorIdd(-1)
                                                            }}
                                                            items={AreaIdd}
                                                            onAreaId={AreaIdd}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <div className="form-group">
                                                        <label className="form__title" >{I18n.t("WareHouseLocation.NameoftheWarehouse")}<span className="form__title__note"></span></label>
                                                        <SelectWarehouse
                                                            onSelected={e => onSelectWarehousee(e.value)}
                                                            items={WarehouseIdd}
                                                            AreaId={AreaIdd}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <div className="form-group">
                                                        <label className="form__title" >{I18n.t("WareHouseLocation.WarehouseArea")}<span className="form__title__note"></span></label>
                                                        <SelectWarehouseArea
                                                            onSelected={e => onSelectWareHouseAreaa(e.value)}
                                                            items={WarehouseAreaIdd}
                                                            WareHouseId={WarehouseIdd}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <div className="form-group">
                                                        <label className="form__title" >{I18n.t("WareHouseLocation.Shelf")}<span className="form__title__note"></span></label>
                                                        <SelectShelves
                                                            onSelected={e => onSelectShelvess(e.value)}
                                                            items={ShelvesIdd}
                                                            WareHouseAreaId={WarehouseAreaIdd}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <div className="form-group">
                                                        <label className="form__title" >{I18n.t("WareHouseLocation.Floor")}<span className="form__title__note"></span></label>
                                                        <SelectFloor
                                                            onSelected={e => onSelectFloorr(e.value)}
                                                            items={FloorIdd}
                                                            ShelvesId={ShelvesIdd}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 sssscol-sm-6">
                                                    <div className="form-group">
                                                        <label className="form__title" >{I18n.t("WareHouseLocation.Code/NameLocation")}<span className="form__title__note"></span></label>
                                                        <SelectLocation
                                                            onSelected={e => onSelectLocation(e.value)}
                                                            items={LocationId}
                                                            FloorId={FloorIdd}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-6 col-sm-6">
                                                    <div className="form-group">
                                                        <label className="form__title" >{I18n.t("WareHouseLocation.CreateName")}<span className="form__title__note"></span></label>
                                                        <SelectAccount
                                                            onSelected={(e) => setCreateId(e.value)}
                                                            items={CreateId}
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        {/* {<div className={DataWareHouseLocation.length > 0 ? "" : "display-none"}>
                                        <DataTable data={DataWareHouseLocation} columns={columns} />
                                    </div>} */}
                                        {ViewImg}
                                        <div className={DataWareHouseLocation.length > 0 ? "" : "display-none"} >
                                            <SettingColumn
                                                columns={columns}
                                                Returndata={a => setcolumns(a)}
                                            />
                                            <DataTable
                                                data={DataWareHouseLocation}
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
                                            id={item.LocationCode + 'view'}
                                            value={item.LocationCode}
                                            size={300}
                                        />
                                        <h3 className="col-md-12" style={{ textAlign: "center", marginTop: '2px' }}>{item.LocationCode}</h3>
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
                                        id={item.LocationCode + 'view'}
                                        value={item.LocationCode}
                                        size={300}
                                    />
                                    <h3 className="col-md-12" style={{ textAlign: "center", marginTop: '2px' }}>{item.LocationCode}</h3>

                                </div>

                            </div>
                        )
                    })
                }
            </div>

        </div>


    )
};
