import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import I18n from '../../../Language'
import { APIKey } from '../../../Services/Api';
import DateTimePicker from 'react-datetime-picker';
import $ from "jquery";
import { AudioTrue, AudioFalse } from '../../../Common';
import { mainAction } from '../../../Redux/Actions'
import { Alertwarning, Alertsuccess, Alerterror, GetDataFromLogin, FormatDateJson, FirstOrLastDayinMonth } from "../../../Utils";
import { Img } from 'react-image'

export const Packing = () => {

    //#region Khai báo biến
    const dispatch = useDispatch();
    const [ExportData, setExportData] = useState([]);
    const [ExportData_Detail, setExportData_Detail] = useState([]);
    const [DataList, setDataList] = useState([]);
    const [DataListActive, setDataListActive] = useState([]);
    const [Code, setCode] = useState([]);
    const [playAudioTrue, setplayAudioTrue] = useState(false);
    const [playAudioFalse, setplayAudioFalse] = useState(false);
    const [stt, setstt] = useState(1);
    const [CheckActice, setCheckActice] = useState(true);
    const [ActiceExportCode, setActiceExportCode] = useState("");
    const [ModalImg, setModalImg] = useState({})
    const [Checkrow, setCheckrow] = useState(20)
    const [Fromdate, setFromdate] = useState(FirstOrLastDayinMonth(new Date(), 1))
    const [Todate, setTodate] = useState(new Date())

    //#endregion Khai báo biến

    const ScanCode = (e) => {
        debugger
        if (e.charCode == 13) {
            let Code = e.target.value.trim();
            if (Code != "") {
                debugger
                let DataOrder_Tmp = ExportData.find(e => e.IsCheckScan == 1) // Lấy mã order đang đánh dấu đóng gói sản phẩm
                if (DataOrder_Tmp != undefined) {
                    let Detal_tmp = ExportData_Detail.filter(e => e.CodeSeriIme != "") // Lấy order có tính theo seri trước
                    if (Detal_tmp.length > 0) { // Scan in seri
                        let Tmp = ExportData_Detail.find(e => e.CodeSeriIme === Code && e.IsCheckProduct === 0 && e.PackageNumber != e.NumberScan && e.ExportCode == DataOrder_Tmp.ExportCode)
                        if (Tmp != undefined) {
                            CheckScanProduct(Code, DataOrder_Tmp.ExportCode, 0)
                        } else {//scan by product code
                            let Data_tmp = ExportData_Detail.filter(e => e.ProductCode === Code && [0, 1].indexOf(e.IsCheckProduct) != -1 && e.PackageNumber != e.NumberScan && e.ExportCode == DataOrder_Tmp.ExportCode);
                            if (Data_tmp.length > 0) {
                                CheckScanProduct(Code, DataOrder_Tmp.ExportCode, 1)
                            } else {
                                setplayAudioFalse(stt);
                                $(".scrollermyscan").addClass("divscan1");

                                setTimeout(() => {
                                    $(".scrollermyscan").removeClass("divscan1");
                                }, 350);
                            }
                        }
                    } else {
                        let Data_tmp = ExportData_Detail.filter(e => e.ProductCode === Code && [0, 1].indexOf(e.IsCheckProduct) != -1 && e.PackageNumber != e.NumberScan && e.ExportCode == DataOrder_Tmp.ExportCode);
                        if (Data_tmp.length > 0) {
                            CheckScanProduct(Code, DataOrder_Tmp.ExportCode, 1);
                        } else {
                            setplayAudioFalse(stt);
                            $(".scrollermyscan").addClass("divscan1");

                            setTimeout(() => {
                                $(".scrollermyscan").removeClass("divscan1");
                            }, 350);
                        }
                    }
                } else {
                    let Export_Tmp = ExportData.find(e => e.ExportCode == Code)
                    if (Export_Tmp != undefined) {
                        setplayAudioTrue(stt)
                        Export_Tmp.IsCheckScan = 1;
                        $('#' + Export_Tmp.ExportCode).find(".Layoutmyscan").addClass("Layoutmyscanred");
                        $('#' + Export_Tmp.ExportCode).find(".Layoutmyscan").removeClass("Layoutmyscanyellow");
                        $('#' + Export_Tmp.ExportCode).find(".Layoutmyscan").removeClass("Layoutmyscanactive");
                    } else {
                        setplayAudioFalse(stt);
                        $(".scrollermyscan").addClass("divscan1");

                        setTimeout(() => {
                            $(".scrollermyscan").removeClass("divscan1");
                        }, 350);
                    }
                }
                setCode("");
                setstt(stt + 1);
            }
        }
    }

    const CheckScanProduct = (Code, ExportCode, key) => {
        debugger
        setplayAudioTrue(stt)
        if (!CheckActice) {
            setCheckActice(!CheckActice)
            $(".Layout-Order").find(".Layoutmyscan").removeClass("checkactive1");
            setActiceExportCode("");
        }
        let Tmp = []
        if (key === 0) {
            Tmp = ExportData_Detail.find(e => e.CodeSeriIme === Code && e.IsCheckProduct === 0 && e.PackageNumber != e.NumberScan && e.ExportCode == ExportCode)
            Tmp.NumberScan = Tmp.UnitNumberConversion;
            Tmp.NumberItem = Tmp.UnitNumberConversion;
        }
        else { // Scan theo sản phẩm
            Tmp = ExportData_Detail.filter(e => e.ProductCode === Code && [0, 1].indexOf(e.IsCheckProduct) != -1 && e.PackageNumber != e.NumberScan && e.ExportCode == ExportCode)[0]
            Tmp.NumberScan = Tmp.NumberScan + 1;
            Tmp.NumberItem = 1;
            Tmp.IsCheckProduct = 1;
        }
        Tmp.IsScan = 1 // Đã scan

        let ExportData_Tmp = ExportData.find(e => e.ExportCode == Tmp.ExportCode)
        // Nếu scan theo seri thì lấy số quy đổi nhỏ nhất add vào còn nếu scan theo sản phẩm thì tính là 1 sản phẩm
        ExportData_Tmp.NumberScan = ExportData_Tmp.NumberScan + (key === 0 ? Tmp.UnitNumberConversion : 1);

        //IsCheckProduct 0 là chưa scan,1 là đã scan theo sản phẩm,2 là đã scan đủ
        if (ExportData_Tmp.NumberScan == ExportData_Tmp.NumberConversion) {// Nếu số lần scan = số phẩm order thì đánh dấu order thành công
            Tmp.IsCheckProduct = 2 // Order đã đủ sản phẩm
            let data_tmp = ExportData.find(e => e.ExportCode == Tmp.ExportCode);
            data_tmp.IsCheckProduct = 2; // Đánh dấu order đã finish
            data_tmp.IsCheckScan = 2; // Order đã scan xong 
        }

        let Datatmp = []
        Datatmp.push({ ProductGroupName: Tmp.ProductGroupName, CodeOrder: Tmp.ExportCode, ProductCode: Tmp.ProductCode, ProductName: Tmp.ProductName, NumberScan: Tmp.NumberScan, NumberItem: Tmp.NumberItem, UnitName: Tmp.UnitName, Image: Tmp.Image, CodeSeriIme: Tmp.CodeSeriImeShow, DateExpiry: Tmp.DateExpiry })
        let ar4 = [...Datatmp, ...DataList]
        setDataList(ar4)

        $('#' + Tmp.ExportCode).find(".Layoutmyscan").addClass("Layoutmyscanactive1");

        let Percent = (ExportData_Tmp.NumberScan * 1.0 * 100 / ExportData_Tmp.NumberConversion);

        if (Percent < 50) {
            $('#' + Tmp.ExportCode).find(".Layoutmyscan").addClass("Layoutmyscanred");
            $('#' + Tmp.ExportCode).find(".Layoutmyscan").removeClass("Layoutmyscanyellow");
            $('#' + Tmp.ExportCode).find(".Layoutmyscan").removeClass("Layoutmyscanactive");
        }

        else if (Percent >= 50 && Percent < 100) {

            $('#' + Tmp.ExportCode).find(".Layoutmyscan").addClass("Layoutmyscanyellow");
            $('#' + Tmp.ExportCode).find(".Layoutmyscan").removeClass("Layoutmyscanred");
            $('#' + Tmp.ExportCode).find(".Layoutmyscan").removeClass("Layoutmyscanactive");
        }

        else {
            $('#' + Tmp.ExportCode).find(".Layoutmyscan").addClass("Layoutmyscanactive");
            $('#' + Tmp.ExportCode).find(".Layoutmyscan").removeClass("Layoutmyscanred");
            $('#' + Tmp.ExportCode).find(".Layoutmyscan").removeClass("Layoutmyscanyellow");
        }

        setTimeout(() => {
            $('#' + Tmp.ExportCode).find(".Layoutmyscan").removeClass("Layoutmyscanactive1");
        }, 700);
    }

    const ClearFrom = () => {
        setDataList([]);
        ExportData.forEach(item => {
            item.IsCheckScan = 0;
            $('#' + item.ExportCode).find(".Layoutmyscan").removeClass("Layoutmyscanred");
            $('#' + item.ExportCode).find(".Layoutmyscan").removeClass("Layoutmyscanyellow");
            $('#' + item.ExportCode).find(".Layoutmyscan").removeClass("Layoutmyscanactive");
        })
    }

    const ActiveProduct = (ExportCode, CheckActice) => {
        if (ActiceExportCode == "" || ActiceExportCode == ExportCode) {
            if (ExportData.find(e => e.ExportCode == ExportCode && e.NumberScan > 0) != undefined) {
                setCheckActice(!CheckActice)
                if (CheckActice) {
                    $('#' + ExportCode).find(".Layoutmyscan").addClass("checkactive1");
                    setDataListActive(DataList.filter(e => e.CodeOrder == ExportCode))
                    setActiceExportCode(ExportCode);
                } else {
                    $('#' + ExportCode).find(".Layoutmyscan").removeClass("checkactive1");
                    setActiceExportCode("");
                }
            }
        }
    }

    const WH_spWarehouse_Packing_Order = async () => {
        try {
            setExportData([]);
            setExportData_Detail([]);
            setDataList([]);
            const params = {
                Json: JSON.stringify({

                    UserId: GetDataFromLogin("AccountId"),
                    FromDate: FormatDateJson(Fromdate, 0),
                    ToDate: FormatDateJson(Todate, 0),
                    OrderStatus: 1//TyepPicking
                }),
                func: "WH_spWarehouse_Packing_Order_V",
                API_key: APIKey
            }
            const list = await mainAction.API_spCallServer(params, dispatch);
            debugger
            if (list.JsonReturn1.length > 0) {
                setExportData(list.JsonReturn1);
                setExportData_Detail(list.JsonReturn2);
                console.log(list.JsonReturn2,"WH_spWarehouse_Packing_Order")
            } else {
                Alertwarning("Không có dữ liệu!")
                setExportData([])
            }
        } catch (error) {
            Alerterror("Lỗi dữ liệu,vui lòng liên hệ IT NETCO !");
        }
    }

    const WH_spWarehouse_Packing_Order_Save = async () => {
        try {
            let Tmp = ExportData.filter(e => e.IsCheckProduct === 2) // Lấy order đã finish
            if (Tmp.length == 0) {
                Alertwarning("Đơn hàng chưa đủ sản phẩm!")
                return
            }
            const params = {
                Json: JSON.stringify({
                    Packing_OrderList: Tmp,
                    UserId: GetDataFromLogin("AccountId"),
                    Notes: '',
                    Status: 3
                }),
                func: "WH_spWarehouse_Packing_Order_Save"
            }
            const result = await mainAction.API_spCallServer(params, dispatch);
            //#region xóa order đã xác nhận
            let ExportData_Tmp = ExportData;
            let ExportData_Detail_Tmp = ExportData_Detail;
            let DataList_Tmp = DataList;
            Tmp.forEach((item) => {
                ExportData_Tmp = ExportData_Tmp.filter(e => e.ExportCode !== item.ExportCode)
                ExportData_Detail_Tmp = ExportData_Detail_Tmp.filter(e => e.ExportCode !== item.ExportCode)
                DataList_Tmp = DataList_Tmp.filter(e => e.CodeOrder !== item.ExportCode)
                $('#' + item.ExportCode).find(".Layoutmyscan").removeClass("Layoutmyscanactive");
            });
            debugger
            setExportData(ExportData_Tmp);
            setExportData_Detail(ExportData_Detail_Tmp);
            setDataList(DataList_Tmp);
            //#endregion

            Alertsuccess(result.ReturnMess);
        } catch (error) {
            Alerterror("Lỗi dữ liệu,vui lòng liên hệ IT NETCO !");
        }
    }

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

    return (
        <div className="content-wrapper pt-2 small">
            <section className="content">
                <div className="container-fluid">
                    <div className="card card-primary">
                        <div className="body-padding">
                            <div className="tab-content" id="custom-tabs-two-tabContent">
                                <div className="tab-pane fade show active" id="tab_1add" role="tabpanel" aria-labelledby="custom-tabs-two-home-tab">
                                    <div className="card-header" style={{ height: "30px !important;" }}>
                                        <div className='row'>
                                            <div className="col-sm-6">
                                                <div className="dropdown">
                                                    <h3 className="dropbtn margin-5"><i className="fa-solid fa-plus"></i> PACKING PRODUCTS BY ORDERs</h3>
                                                </div>
                                            </div>
                                            <AudioTrue
                                                playaudio={playAudioTrue}
                                            />
                                            <AudioFalse
                                                playaudio={playAudioFalse}
                                            />
                                            <div className="col-sm-6 margin-5">
                                                <button type="button" className="btn btn-danger btn-xs float-right margin-left-5 height35"
                                                    onClick={a => ClearFrom(a)}
                                                >
                                                    <i className="fa fa-trash mr-2 " />
                                                    {I18n.t('System.Cancel')}
                                                </button>
                                                <button type="button" className="btn btn-success btn-xs float-right margin-left-5" style={{ height: "35px;" }}
                                                    onClick={e =>
                                                        WH_spWarehouse_Packing_Order_Save()
                                                    }>
                                                    <i className="fa fa-folder mr-2 " />
                                                    {I18n.t('System.Save')}
                                                </button>
                                                <button type="button" className="btn btn-primary btn-xs float-right" style={{ height: "35px;" }}
                                                    onClick={e =>
                                                        WH_spWarehouse_Packing_Order()
                                                    }>
                                                    <i className="fa fa-eye mr-2 " />
                                                    {I18n.t('System.View')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="">
                                        <div class="row right0">
                                            <div className="col-sm-12 col-md-12">
                                                <div className="card linetop" style={{ height: '300px' }}>
                                                    <div className="table-responsive" >
                                                        <table className="table table-head-fixed table-sticky-thead text-nowrap table__detail__with___btn">
                                                            <thead>
                                                                <tr>
                                                                    <th>STT</th>
                                                                    <th>Order code</th>
                                                                    <th>Brand</th>
                                                                    <th>Product code</th>
                                                                    <th>Product name</th>
                                                                    <th>Serial/Imei</th>
                                                                    <th>Image</th>
                                                                    <th>Quantity </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    (CheckActice == true ? DataList : DataListActive).map((item, k) => {
                                                                        if (k < Checkrow) {
                                                                            return (
                                                                                <tr key={k + 1} style={{ color: k === 0 ? "#007bff" : "#212529" }}>
                                                                                    <td className={item.key = (k + 1)}>{k + 1}</td>
                                                                                    <td>{item.CodeOrder}</td>
                                                                                    <td>{item.ProductGroupName}</td>
                                                                                    <td>{item.ProductCode}</td>
                                                                                    <td>{item.ProductName}</td>
                                                                                    <td>{item.CodeSeriIme}</td>
                                                                                    <td>
                                                                                        <a
                                                                                            className="cursor"
                                                                                            data-toggle="modal"
                                                                                            data-target="#modalImg"
                                                                                            onClick={(e) => setModalImg({ Image: item.Image, ProductName: item.ProductName })}
                                                                                            title="Click để xem hình lớn"
                                                                                        >
                                                                                            <img src={item.Image} width="27" />
                                                                                        </a>
                                                                                    </td>
                                                                                    <td>{item.NumberItem} Item</td>
                                                                                </tr>
                                                                            )
                                                                        }
                                                                    })
                                                                }

                                                            </tbody>
                                                        </table>
                                                        <div className={DataList.length > 20 ? "row" : "display-none"}>
                                                            <div className="col-sm-12 col-md-12 text-center">
                                                                <button type="button" className="btn btn-xs btn-info"
                                                                    onClick={e => setCheckrow(Checkrow + 20)}>
                                                                    <i class="fas fa-plus-circle"></i>
                                                                    Xem thêm
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-sm-12 col-md-3">
                                                <div className="card linetop height-pac">
                                                    <div className="row">
                                                        <div class="col-sm-12 col-md-5 right10s">
                                                            <div className="color-total divscan">
                                                                <div className="divcountscan">
                                                                    Total Product
                                                                </div>
                                                                <div className="divcountscan2">
                                                                    <span className="TotalNumber borlay"> {ExportData.reduce((a, v) => a = a + (v.NumberConversion), 0)}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-sm-12 col-md-5">
                                                            <div className="color-total divscan">
                                                                <div className="divcountscan">
                                                                    Total scan
                                                                </div>
                                                                <div className="divcountscan2">
                                                                    <span className="TotalNumber borlay"> {ExportData.reduce((a, v) => a = a + (v.NumberScan), 0)}</span>
                                                                </div>

                                                            </div>
                                                        </div>
                                                        <div class="col-sm-12 col-md-2">
                                                            <Img
                                                                src="../assets/img/muiten2.png"
                                                                style={{
                                                                    marginLeft: "-12px", marginTop: "19px", width: "57px", marginFight: "7px"
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label className="form__title" >Scan code</label>
                                                                <input type="text" className="form-control" value={Code}
                                                                    onChange={e => setCode(e.Code)}
                                                                    onKeyPress={(e) => {
                                                                        ScanCode(e, 0)
                                                                    }} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label className="form__title">{I18n.t("System.Fromthedate")}</label>
                                                                <DateTimePicker className="form-control"
                                                                    onChange={date => setFromdate(date)}
                                                                    value={Fromdate}
                                                                    format='MM/dd/yyyy HH:mm:ss'
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label className="form__title">{I18n.t("System.Todate")}</label>
                                                                <DateTimePicker className="form-control"
                                                                    onChange={date => setTodate(date)}
                                                                    value={Todate}
                                                                    format='MM/dd/yyyy HH:mm:ss'
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="col-sm-12 col-md-9">
                                                <div className="card linetop scrollermyscan height-pac">
                                                    <div class="row" >
                                                        {
                                                            ExportData.length > 0 && ExportData.map((item, index) => {
                                                                return (
                                                                    <>
                                                                        <div class="col-sm-12 col-md-2 Layout-Order" id={item.ExportCode}>
                                                                            <div className="Layoutmyscan" onClick={e => ActiveProduct(item.ExportCode, CheckActice)}>
                                                                                <div className="Layoutmyscantt">
                                                                                    {item.ExportCode}
                                                                                </div>
                                                                                <div className="Layoutmyscanct">
                                                                                    <span className="borlay">{ExportData_Detail.filter(e => e.ExportCode == item.ExportCode && e.IsScan == 1).reduce((a, v) => a = a + (v.NumberScan), 0)} / {item.NumberConversion}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </>

                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {ViewImg}
                            </div>
                        </div>
                    </div>
                </div >
            </section >
        </div >
    );

}