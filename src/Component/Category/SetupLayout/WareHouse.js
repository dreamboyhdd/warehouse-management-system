import React, { useState, useEffect, useRef } from "react";
import I18n from "../../../Language";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../Redux/Actions";
import { DataTable } from "../../../Common/DataTable";
import { Alerterror, Alertsuccess, Alertwarning, FormatDate, FormatDateJson, FirstOrLastDayinMonth, GetDataFromLogin, ExportExcel } from "../../../Utils";
import { SelectArea, SelectLocationAddress, SelectWarehouse, SelectAccount, SettingColumn, DataTables } from '../../../Common';
import DateTimePicker from "react-datetime-picker";
import $ from 'jquery';
import {ConfirmAlert} from "../../../Utils";
export const WareHouse = () => {

    //#regon begin using the effect hook
    useEffect(() => {

    }, []);

    ///tab hiện thị sửa trên table
    const [tittle, setTitle] = useState(I18n.t("validate.Addwarehouse"))
    //transmission CreateName,EditName

    const AccountId = GetDataFromLogin("AccountId");
    const AccountName = GetDataFromLogin("AccountName");
    let datapermisstion =  localStorage.getItem("Permissioninfor");
    //load Area
    const [AreaId, setAreaId] = useState(-1);
    const onSelectArea = (areaId) => {
        setAreaId(areaId);
        console.log(areaId, "areaIdddddddddddddddd")

    }
   


    //load province
    const [ProvinceId, setProvinceId] = useState(-1);
    const onSelectProvince = (provinceId) => {
        setProvinceId(provinceId);
        console.log(provinceId, "provinceIdddddddddddddd")
    }
    //load setDistrict
    const [DistrictId, setDistrictId] = useState(-1);
    const onSelectDistrict = (districtId) => {
        setDistrictId(districtId);
        console.log(districtId, "DistrictIddddđ")
    }
    //load setWard
    const [WardId, setWardId] = useState(-1);///-1 lỗi k có dữ liệu nv
    const onSelectWard = (wardId) => {
        setWardId(wardId);
        console.log(wardId, "wardIdddddddddddddddd")
    }


    //declare variable to receive data
    const [WareHouseId, setWareHouseId] = useState(0);//để lưu xuốngs
    const [WareHouseCode, setWareHouseCode] = useState('');
    const [WareHouseName, setWareHouseName] = useState('');
    const [Description, setDescription] = useState('');
    const [Images, setImages] = useState('');
    const [Length, setLength] = useState('');
    const [Height, setHeight] = useState('');
    const [Width, setWidth] = useState('');
    const [SquareMeters, setSquareMeters] = useState('');
    const dispatch = useDispatch();
    const [FileUpload, setFileUpload] = useState({});
    const [CreateName, setCreateName] = useState();
    const [FullAddress, setFullAddress] = useState();//bỏ dấu ngoặc đi nó hiểu là cái mảng nên có chữ obj
    const [disbtn, setdisbtn] = useState();
    //const [State, setState] = useState();
    const Accountinfor = JSON.parse(localStorage.getItem("Accountinfor") === "" ? "{}" : localStorage.getItem("Accountinfor"));
    // const [Fromdate, setFromdate] = useState(FirstOrLastDayinMonth(new Date(), 1))
    // const [Todate, setTodate] = useState(new Date())

    // save
    const WH_spWareHouse_Save = async () => {
        debugger
        {

            //kiem tra quyen luu
            if(datapermisstion !== "")
            {
                let a = JSON.parse(datapermisstion);
                let b = a.find(p => p.WH_tblMenuModuleId === 63 && p.Adds === 'C')
                if( b === undefined)
                {
                    Alertwarning(I18n.t("validate.Youdonothavepermissiontocreateawarehouse!"));
                    return;
                }
            }
            if (AreaId === -1) {
                Alertwarning(I18n.t("validate.PleaseSelectRegion!"));
                return;
            }
            if (WareHouseCode === "") {
                Alertwarning(I18n.t("validate.PleaseEnterwarehouseCode!"));
                return;
            }
            if (WareHouseName === "") {
                Alertwarning(I18n.t("validate.PleaseEnterWarehouseName!"));
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
            // if (SquareMeters === "") {
            //     Alertwarning("Vui lòng Nhập Diện Tích!");
            //     return;
            // }
            // if (SquareMeters == 0) {
            //     Alertwarning("Vui lòng Nhập Diện Tích lớn hơn 0!");
            //     return;
            // }
            if (ProvinceId === -1) {
                Alertwarning(I18n.t("validate.PleaseSelectProvince/City!"));
                return;
            }
            if (DistrictId === -1) {
                Alertwarning(I18n.t("validate.PleaseSelectDistrict/District!"));
                return;
            }
            if (WardId === -1) {
                Alertwarning(I18n.t("validate.PleaseSelectWard/Commune!"));
                return;
            }
            if (FullAddress === undefined) {
                Alertwarning(I18n.t("validate.PleaseenterHouseNumber/StreetName!"));
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
                WareHouseId: WareHouseId,////id chính
                AreaId: AreaId,
                WareHouseCode: WareHouseCode,
                WareHouseName: WareHouseName.trim(),
                Images: img,
                Length: Length,
                Width: Width,
                Height: Height,
                SquareMeters: Length * Width,
                Description: Description.toString().replaceAll('"', "'"),
                CreateId: Accountinfor.AccountId,
                CreateName: Accountinfor.AccountName,
                ProvinceId: ProvinceId,
                DistrictId: DistrictId,
                WardId: WardId,
                FullAddress: FullAddress

            };
            const params = {
                Json: JSON.stringify(pr),
                func: "WH_spWareHouse_Save",
            };
            //khóa nút
            setdisbtn(true);

            try {
                const result = await mainAction.API_spCallServer(params, dispatch);
                setdisbtn(false);
                if (result.Status === "OK") {
                    Alertsuccess(result.ReturnMess);
                    WH_spWareHouse_Cancel();
                    setTitle(I18n.t("validate.Addwarehouse"));

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


    // list  WH_spWareHouse_List

     //load Area list
     const [AreaIdd, setAreaIdd] = useState(-1);
     const onSelectAreaa = (areaIdd) => {
         setAreaIdd(areaIdd);
         console.log(areaIdd, "areaIdddddddddddddddd")
 
     }
     //load WareHouseCode list
     const [WareHouseIdd, setWareHouseIdd] = useState(-1);
     const onSelectWareHouse = (wareHouseIdd) => {
         setWareHouseIdd(wareHouseIdd);
         console.log(wareHouseIdd, "wareHouseIdddddddđ")
     }
     
    const [DataWareHouse, setDataWareHouse] = useState([]);
    const [CreateId, setCreateId] = useState(0);
    const WH_spWareHouse_List = async () => {
         //kiem tra quyen xem
         if(datapermisstion !== "")
         {
             let a = JSON.parse(datapermisstion);
             let b = a.find(p => p.WH_tblMenuModuleId === 63 && p.Views === 'C')
             if(b === undefined)
             {
                 Alertwarning(I18n.t("validate.Youdonothavepermissiontoviewwarehouse!"));
                 return;
             }
         }
        if (AreaIdd === -1) {
            Alertwarning(I18n.t("validate.PleaseSelectRegion!"));
            return;
        }
        const pr = {
            Json: JSON.stringify({
                WareHouseId: WareHouseIdd,
                AreaId: AreaIdd,//bên trái dưới store,bên phải biến truyền xuống
                CreateId: CreateId//ng tạo dưới
            }),

            func: "WH_spWareHouse_List"
        };
        //  //khóa nút
        setdisbtn(true);
        try {
            const result = await mainAction.API_spCallServer(pr, dispatch);
            if(result.length > 0){
                setdisbtn(false);
                console.log(result);
                setDataWareHouse(result);


                
            }else{
                Alertwarning(("Report.NoData"))
                setDataWareHouse([]);//bằng rỗng để clear dòng cũ đi
                return;
            }
            
        } catch (error) {
            setdisbtn(false);
            console.log(error);
            Alerterror(I18n.t("validate.apierror!"));

        }
    }

    //delete Item xóa từng dòng
    const [IsDelete, setIsDelete] = useState();
    useEffect(() => {
        if(IsDelete === undefined) return;
        const row = IsDelete.Item;
        const dataold = [...DataWareHouse];
        clickDelete(row, dataold);
    }, [IsDelete]);

    //numberrandom xóa khi cancel
    const clickDeleteSmall = (item) => {
        const numberrandom = Math.random();
        setIsDelete({IsActive:numberrandom,Item:item});
    }

    //delete .row
    const clickDelete =  (data, dataold) => {
        if (data === undefined) return;
        const editobj = data.row.original;

        ConfirmAlert("Delete warehouse","Are you sure you want to delete this warehouse?", async () => {

            const pr = {
                WareHouseId: editobj.WareHouseId,
                CreateId: AccountId,
                CreateName: AccountName,

            }
            //hàm delete
            const params = {
                JSON: JSON.stringify(pr),
                func: "WH_spWareHouse_Delete"

            }
            try {
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result.Status === "OK")//Status,OK SQL save,để xóa đc hàm 
                {
                    Alertsuccess(result.ReturnMess);
                    //xóa đối tựng trong mảng
                    const DataWareHous = dataold;
                    const datadelete = DataWareHous.filter(p => p.WareHouseId !== editobj.WareHouseId);
                    setDataWareHouse(datadelete);
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

    ///check chọn nhiều ô để xóa ID hoa và thường///(const datanew)
    const [IsCheckOne,setIsCheckOne] = useState({Id:0,Check:false});
    useEffect(() => {
        if(IsCheckOne.Id !== 0 && IsCheckOne.Id !== undefined)
        {
            let Id = IsCheckOne.Id;
            let Check = IsCheckOne.Check;
            
            if (Check === undefined || Check === null) 
                Check = false;

                const datanew = [...DataWareHouse]
                datanew.find(p => p.WareHouseId == Id).IsCheck = !Check;
                setDataWareHouse(datanew);

        }
    }, [IsCheckOne]);

    ///delete multiple lines
    const DeleteAllWareHouse = async () => {
        //kttra quyền xóa
        if(datapermisstion !== "")
        {
            let a = JSON.parse(datapermisstion);
            let b = a.find(p => p.WH_tblMenuModuleId ===63 && p.Deletes ==='C')
           if (b === undefined)
            {
                Alertwarning(I18n.t("validate.Youdonothavetherighttodeletetherepository!"));
                return;
            }

        }
        let check = DataWareHouse.filter(a => a.IsCheck === true)
        if (check.length === 0)
         {
            Alertwarning(I18n.t("validate.Pleaseselectthewarehousetodelete!"))
            return
        }


         ConfirmAlert((I18n.t("validate.Deletewarehouse","Areyousureyouwanttodeletethiswarehouse??")), async () => {
            const DataDelete = DataWareHouse.filter(p => p.IsCheck === true);
            if (DataDelete.length === 0) {
                Alertwarning(I18n.t("validate.Pleaseselectthewarehousetodelete!"))
                return
            }
            if (DataDelete.length > 0) {
                //hàm delete
                const pr = {
                    AccountId: AccountId,
                    AccountName: AccountName,
                    ListId: DataDelete.map(item => { return { "WareHouseId": item.WareHouseId } })//xóa nhiều dòng thì thêm biến vào sql

                }

                const params = {
                    JSON: JSON.stringify(pr),
                    func: "WH_spWareHouse_DeleteMany"

                }
                try {
                    const result = await mainAction.API_spCallServer(params, dispatch);

                    if (result.Status === "OK")//Status,OK SQL save,để xóa đc hàm 
                    {


                        //xóa đối tựng trong mảng
                        const DataWareHouseNew = DataWareHouse.filter(p => p.IsCheck !== true);
                        setDataWareHouse(DataWareHouseNew);
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
    //check all
    const [IsCheckedAll,setIsCheckedAll] = useState();
    const [keyC,setkeyC] = useState(false);
    useEffect(() => {
        if(IsCheckedAll === undefined) return;
        const datanew = [...DataWareHouse];
        datanew.forEach((item) => {
            if(keyC === false) {
                item.IsCheck = true
                setkeyC(true);
            }
            else
            {
                item.IsCheck = false
                setkeyC(false);
            }
            // if(item.IsCheck === undefined)
            //     item.IsCheck = true
            // else
            //     item.IsCheck === false ?  item.IsCheck = true : item.IsCheck = false;
        });
        setDataWareHouse(datanew);
    }, [IsCheckedAll]);

    
    const IsCheckedAllSmall = () => {
        
        const numberrandom = Math.random();
        setIsCheckedAll({Id:numberrandom});

        //e.target.checked === true ? $("#checkboxAll").prop('checked', false) : $("#checkboxAll").prop('checked', true);
            
    }
    

    // Begin cancel
    const WH_spWareHouse_Cancel = () => {
        setAreaId(-1)
        //setAreaIdd(-1)
        setWareHouseId(0)
        setWareHouseCode('')
        setWareHouseName('')
        setImages('')
        setLength('')
        setWidth('')
        setHeight('')
        setDescription('')
        setSquareMeters('')
        setWardId(-1)//hủy khi lưu xuống
        setDistrictId(-1)
        setProvinceId(-1)
        setFullAddress('')
        setdisbtn(false);//mở nút
        setTitle('THÊM MỚI KHO');
    }

    // ///edit
    const clickEdit = (data) => {
        setTitle(I18n.t("WareHouse.EditWahouse"))
        const editobj = data.row.original;//ĐỐI tượng
        //setWareHouseIdd(editobj.WareHouseIdd);
        setWareHouseId(editobj.WareHouseId);
        setAreaId(editobj.AreaId);
        setWareHouseCode(editobj.WareHouseCode);
        setWareHouseName(editobj.WareHouseName);
        setDescription(editobj.Description);
        setImages(editobj.Images);
        setLength(editobj.Length);
        setWidth(editobj.Width);
        setHeight(editobj.Height);
        setSquareMeters(editobj.SquareMeters);
        setProvinceId(editobj.ProvinceId);
        setDistrictId(editobj.DistrictId);
        setWardId(editobj.WardId);
        setFullAddress(editobj.FullAddress);
        document.querySelector("#tab_1").click();

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

  
    //execel
    const Exportexcell = () => {
        const newData = DataWareHouse.map(element => {
            //kiem tra quyen Excel
         if(datapermisstion !== "")
         {
             let a = JSON.parse(datapermisstion);
             let b = a.find(p => p.WH_tblMenuModuleId === 63 && p.Excel === 'C') 
             if(b === undefined)
             {
                 Alertwarning("Anh/chị không có quyền xuất Excel!");
                 return;
             }
         }
            return {
                'Khu Vực': element.Name,
                'Mã Kho': element.WareHouseCode,
                'Tên Kho': element.WareHouseName,
                'Ghi Chú': element.Description,
                'Chiều Dài (mét)': element.Length,
                'Chiều Rộng (mét)': element.Width,
                'Chiều Cao (mét)': element.Height,
                'Diện Tích (m2)': element.SquareMeters,
                'Tỉnh Thành': element.ProvinceName,
                'Quận/Huyện': element.DistrictName,
                'Phường/Xã': element.WardName,
                'Số Nhà,Tên Đường': element.FullAddress,
                'Người Sửa': element.EditName,
                'Ngày Sửa': FormatDateJson(element.EditTime),
                'Người Tạo': element.CreateName,
                'Ngày Tạo': FormatDateJson(element.CreateTime)
            }
        })
        newData.forEach(function (x) {
            if (columns.find(a => a.accessor === 'Name') === undefined) { delete x["Khu Vực"] }
            else if (columns.find(a => a.accessor === 'Name').show === false) { delete x["Khu Vực"] }
            
            if (columns.find(a => a.accessor === 'WareHouseCode') === undefined) { delete x["Mã Kho"] }
            else if (columns.find(a => a.accessor === 'WareHouseCode').show === false) { delete x["Mã Kho"] }

            if (columns.find(a => a.accessor === 'WareHouseName') === undefined) { delete x["Tên Kho"] }
            else if (columns.find(a => a.accessor === 'WareHouseName').show === false) { delete x["Tên Kho"] }

            if (columns.find(a => a.accessor === 'Description') === undefined) { delete x["Ghi Chú"] }
            else if (columns.find(a => a.accessor === 'Description').show === false) { delete x["Ghi Chú"] }

            if (columns.find(a => a.accessor === 'Length') === undefined) { delete x["Chiều Dài (mét)"] }
            else if (columns.find(a => a.accessor === 'Length').show === false) { delete x["Chiều Dài (mét)"] }

            if (columns.find(a => a.accessor === 'Width') === undefined) { delete x["Chiều Rộng (mét)"] }
            else if (columns.find(a => a.accessor == 'Width').show === false) { delete x["Chiều Rộng (mét)"] }

            if (columns.find(a => a.accessor === 'Height') === undefined) { delete x["Chiều Cao (mét)"] }
            else if (columns.find(a => a.accessor == 'Height').show === false) { delete x["Chiều Cao (mét)"] }

            if (columns.find(a => a.accessor === 'SquareMeters') === undefined) { delete x["Diện Tích (m2)"] }
            else if (columns.find(a => a.accessor == 'SquareMeters').show === false) { delete x["Diện Tích (m2)"] }

            if (columns.find(a => a.accessor === 'ProvinceName') === undefined) { delete x["Tỉnh Thành"] }
            else if (columns.find(a => a.accessor == 'ProvinceName').show === false) { delete x["Tỉnh Thành"] }

            if (columns.find(a => a.accessor === 'DistrictName') === undefined) { delete x["Quận/Huyện"] }
            else if (columns.find(a => a.accessor === 'DistrictName').show === false) { delete x["Quận/Huyện"] }

            if (columns.find(a => a.accessor === 'WardName') === undefined) { delete x["Phường/Xã"] }
            else if (columns.find(a => a.accessor === 'WardName').show === false) { delete x["Phường/Xã"] }

            if (columns.find(a => a.accessor === 'FullAddress') === undefined) { delete x["Số Nhà,Tên Đường"] }
            else if (columns.find(a => a.accessor === 'FullAddress').show === false) { delete x["Số Nhà,Tên Đường"] }

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
        //                     id={row.original.WareHouseId} value={row.original.WareHouseId}
        //                     checked={row.original.IsCheck}
        //                     onChange={e => setIsCheckOne({ Id: row.original.WareHouseId, Check: row.original.IsCheck })}
        //                 />
        //                 <label className="label checkbox" htmlFor={row.original.WareHouseId}></label>
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
                            <i className="fa fa-check" aria-hidden="true"/>
                            
                        </a>
                    </div>
                </div>
            ),
            Cell: (row) => (
                <div className="col-sm-12 col-md-2">
                    <div className="icheck-success d-inline">
                        <input type="checkbox"
                            id={row.original.WareHouseId} value={row.original.WareHouseId}
                            checked={row.original.IsCheck}
                            onChange={e => setIsCheckOne({ Id: row.original.WareHouseId, Check: row.original.IsCheck })}
                        />
                        <label className="label checkbox" htmlFor={row.original.WareHouseId}></label>
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
            accessor: 'WareHouseId',
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
                        onClick={(e) => clickDeleteSmall({row})}////xóa từng dòng
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
                        title={I18n.t("WareHouse.Clicktoviewlargeimage")}
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
            Header:I18n.t("WareHouse.WareHouseCode"),
            accessor: "WareHouseCode",
            //filterable: false,
            //sortable: false,
        },
        {
            Header:I18n.t("WareHouse.WareHouseName"),
            accessor: "WareHouseName",
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
            Header:I18n.t("WareHouse.Height(meters)"),
            accessor: "Height",
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
            Header: I18n.t("System.Note"),
            accessor: "Description",
            width: 150,
            //filterable: false,
            //sortable: false,
        },
        {
            Header:I18n.t("WareHouse.Province"),
            accessor: "ProvinceName",
            //filterable: false,
            //sortable: false,
        },
        {
            Header:I18n.t("WareHouse.District"),
            accessor: "DistrictName",
            //filterable: false,
            //sortable: false,
        },
        {
            Header:I18n.t("WareHouse.Ward"),
            accessor: "WardName",
            // filterable: false,
            //sortable: false,
        },
        {
            Header:I18n.t("WareHouse.FullAddress"),
            accessor: "FullAddress",
            //filterable: false,
            //sortable: false,
        },
        {
            Header:I18n.t("WareHouse.EditName"),
            accessor: "EditName",
            //filterable: false,
            //sortable: false,
        },
        {
            Header:I18n.t("WareHouse.EditTime"),
            accessor: "EditTime",
            Cell: (obj) => FormatDateJson(obj.value),
            //filterable: false,
            //sortable: false,

        },
        {
            Header:I18n.t("WareHouse.CreateName"),
            accessor: "CreateName",
            //filterable: false,
            // sortable: false,
        },
        {
            Header:I18n.t("WareHouse.CreateTime"),
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
                                                    onClick={a=> WH_spWareHouse_Cancel(a)}///function k lỗi
                                                >
                                                    <i className="fa fa-trash mr-2 " />
                                                    {I18n.t("System.Cancel")}
                                                </a>
                                                <a
                                                    className="btn btn-success btn-sm float-right btn-header"
                                                    onClick={a=> WH_spWareHouse_Save(a)}
                                                    disbtn={!disbtn}
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
                                                    <label className="form__title" > {I18n.t("System.Area")} <span className="form__title__note">(*)</span></label>
                                                    <SelectArea
                                                        onSelected={e => onSelectArea(e.value)}
                                                        onAreaId={AreaId}
                                                        items={AreaId}

                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                        {I18n.t("WareHouse.WareHouseCode")}
                                                        <span className="form__title__note"> (*)</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder=""
                                                        onChange={e => setWareHouseCode(e.target.value.trim())}
                                                        value={WareHouseCode}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                    {I18n.t("WareHouse.WareHouseName")}
                                                        <span className="form__title__note"> (*)</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder=""
                                                        onChange={e => setWareHouseName(e.target.value)}
                                                        value={WareHouseName}
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
                                                    {I18n.t("WareHouse.Height(meters)")}
                                                        <span className="form__title__note"> (*) </span>
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
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t("WareHouse.Province")}<span className="form__title__note">(*)</span></label>
                                                    <SelectLocationAddress
                                                        onSelected={e => onSelectProvince(e.value)}
                                                        items={ProvinceId}
                                                        type={1}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t("WareHouse.District")}<span className="form__title__note">(*)</span></label>
                                                    <SelectLocationAddress
                                                        onSelected={e => onSelectDistrict(e.value)}
                                                        items={DistrictId}
                                                        ParentId={ProvinceId}
                                                        Type={2}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t("WareHouse.Ward")}<span className="form__title__note">(*)</span></label>
                                                    <SelectLocationAddress
                                                        onSelected={e => onSelectWard(e.value)}
                                                        items={WardId}
                                                        ParentId={DistrictId}
                                                        Type={3}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-3 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title">
                                                    {I18n.t("WareHouse.FullAddress")}
                                                        <span className="form__title__note"> (*)</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder=""
                                                        onChange={e => setFullAddress(e.target.value)}
                                                        value={FullAddress}
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
                                                        <span className="image-collapse-span">{I18n.t("WareHouse.Uploadimages")}</span>
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
                                                    {I18n.t("WareHouse.WarehouseList")} ({DataWareHouse.length})
                                                    </span>
                                                </h3>
                                            </div>
                                            <div className="col-md-6 card-header-btn">
                                                <a className="btn btn-warning btn-sm float-right btn-header" onClick={a=> Exportexcell(a)}>
                                                    <i className="fa fa-download mr-2" />
                                                    {I18n.t("System.Excel")}
                                                </a>
                                                <a className="btn btn-danger btn-sm float-right btn-header" onClick={a=> DeleteAllWareHouse(a)}>
                                                    <i className="fa fa-trash mr-2" />
                                                    {I18n.t("System.Delete")}
                                                </a>
                                                <a
                                                    className="btn btn-primary btn-sm float-right btn-header"
                                                    onClick={a=> WH_spWareHouse_List(a)}
                                                >
                                                    <i className="fa fa-eye mr-2" />
                                                    {I18n.t("System.View")}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body-form">
                                        <div className="row pb-12">
                                            <div className="col-md-4 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title" > {I18n.t("WareHouse.Area")}<span className="form__title__note">(*)</span></label>
                                                    <SelectArea
                                                        onSelected={e => onSelectAreaa(e.value)}
                                                        onAreaId={AreaIdd}
                                                        items={AreaIdd}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title" > {I18n.t("WareHouse.WarehouseCode/WarehouseName")} <span className="form__title__note"></span></label>
                                                    <SelectWarehouse
                                                        // onSelected={e => onSelectWareHouse(e.value)}
                                                        onSelected={e => {
                                                            onSelectWareHouse(e.value)
                                                         }}
                                                        items={WareHouseIdd}
                                                        AreaId={AreaIdd}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-sm-6">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t("WareHouse.CreateName")}<span className="form__title__note"></span></label>
                                                    <SelectAccount
                                                        onSelected={(e) => setCreateId(e.value)}
                                                        items={CreateId}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className={DataWareHouse.length > 0 ? "" : "display-none"}>
                                        <DataTable data={DataWareHouse} columns={columns} />
                                    </div>  */}
                                    {ViewImg}
                                    <div className={DataWareHouse.length > 0 ? "" : "display-none"} >
                                        <SettingColumn
                                            columns={columns}
                                            Returndata={a => setcolumns(a)}
                                        />
                                        <DataTable
                                            data={DataWareHouse}
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
