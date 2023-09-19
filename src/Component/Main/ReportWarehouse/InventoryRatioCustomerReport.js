import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import I18n from "../../../Language";
import Select from "react-select";
import DateTimePicker from "react-datetime-picker";
import { DataTable, FormReport, ChartTemp } from "../../../Common";
import { mainAction } from "../../../Redux/Actions";
import {
  Alertwarning,
  FormatDateJson,
  ExportExcel,
  FirstOrLastDayinMonth,
  FormatNumber, Loading, Alerterror
} from "../../../Utils";

export const InventoryRatioCustomerReport = () => {

  //#region Khai báo biến
  const dispatch = useDispatch();
  const [Type, setType] = useState(1)
  const [TypeRun2, setTypeRun2] = useState(1);
  const [TypeRun3, setTypeRun3] = useState(1);
  const [TypeRun4, setTypeRun4] = useState(1);
  const [RatioByWarehouse, setRatioByWarehouse] = useState([]);
  const [RatioByPack, setRatioByPack] = useState([]);
  const [RatioByProduct, setRatioByProduct] = useState([]);
  const [isRes, setisRes] = useState(false);
  const [useEffectkey, setuseEffectkey] = useState(1);
  const [State, setState] = useState();
  const [IsLoad, setIsLoad] = useState(1);
  const [Fromdate, setFromdate] = useState(FirstOrLastDayinMonth(new Date(), 1));
  const [Todate, setTodate] = useState();
  const [CustomerId, setCustomerId] = useState();
  const [WareHouseId, setWareHouseId] = useState();
  const [TypeReport, setTypeReport] = useState();
  const [Month, setMonth] = useState();
  const [Quarter, setQuarter] = useState();
  const [Year, setYear] = useState();
  const [Tdate, setTdate] = useState();
  const [Fdate, setFdate] = useState();
  const [WareHouseName, setWareHouseName] = useState();

  const [DataReport, setDataReport] = useState([]);
  const [DataReportDetail, setDataReportDetail] = useState([]);
  const [DataTotalDetail, setDataTotalDetail] = useState([]);

  const dynamicColors = function () {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
  };

  const groupBy = (arr, key) => {
    const initialValue = {};
    return arr.reduce((acc, cval) => {
      const myAttribute = cval[key];
      acc[myAttribute] = [...(acc[myAttribute] || []), cval]
      return acc;
    }, initialValue);
  };

  //#region list
  const WH_spWareHouse_Inventory_Report = async () => {
    setRatioByWarehouse([])
    setRatioByProduct([])
    setRatioByPack([])
    try {
      if (CustomerId === undefined || CustomerId.value <= 0) {
        Alertwarning(I18n.t("validate.Pleasechoosecustomer!"));
        return;
      }
      if (TypeReport === undefined || TypeReport.value <= 0) {
        Alertwarning(I18n.t("validate.Pleaseselectreporttype"));
        return;
      }
      if (TypeReport.value === 1 && Month === undefined) {
        Alertwarning(I18n.t("validate.Pleaseselectthemonth"));
        return;
      }
      if (TypeReport.value === 2) {
        if (Year === undefined || Year.value <= 0) {
          Alertwarning(I18n.t("validate.Pleaseselectyear"));
          return;
        }
      }
      if (TypeReport.value === 2) {
        if (Quarter === undefined || Quarter.value <= 0) {
          Alertwarning(I18n.t("validate.Pleaseselectquarter"));
          return;
        }
      }
      if (Fromdate === undefined || Fromdate === "") {
        Alertwarning(I18n.t("validate.Pleaseenterfromdate"));
        return;
      }
      if (Todate === undefined || Todate === "") {
        Alertwarning(I18n.t("validate.Pleaseenterdate"));
        return;
      }
      const params = {
        Json: JSON.stringify({
          CustomerId: CustomerId.value,
          WarehouseId: WareHouseId.value,
          Fromdate: FormatDateJson(Fromdate),
          Todate: FormatDateJson(Todate, 1) + ' 23:59:59'
        }),
        func: "WH_spWareHouse_Inventory_Report",
      };
      debugger
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length > 0) {
        //#region tinh tong dau ky, cuoi ky
        let element = {};
        let _result = result.reduce((r, o) => {
          //let key = o.shape + '-' + o.color; // group 2 columns
          let key = o.CustomerCode; // group 1 columns
          if (!element[key]) {
            element[key] = Object.assign({}, o); // create a copy of o
            r.push(element[key]);
          } else {
            element[key].TotalNumberBeGin += o.TotalNumberBeGin;
            element[key].TotalNumberEnd += o.TotalNumberEnd;
          }
          return r;
        }, []);
        // #endregion

        let totalClosingStock = result.reduce((a, v) => a = a + v.TotalNumberEnd, 0)

        //#region total By warehouse
        let element2 = {};
        let totalByWarehouse = result.reduce((r, o) => {
          let key = o.WareHouseName;
          if (!element2[key]) {
            element2[key] = Object.assign({}, o);
            r.push(element2[key]);
          } else {
            element2[key].TotalNumberBeGin += o.TotalNumberBeGin;
            element2[key].TotalNumberEnd += o.TotalNumberEnd;
          }
          return r;
        }, []);
        let _totalByWarehouse = (totalByWarehouse.sort(function (a, b) { return b.TotalNumberEnd - a.TotalNumberEnd })).slice(0, 10);
        //#region 

        //#region total By pack
        let element3 = {};
        let totalByPack = result.reduce((r, o) => {
          let key = o.ProductPackagingName;
          if (!element3[key]) {
            element3[key] = Object.assign({}, o);
            r.push(element3[key]);
          } else {
            element3[key].TotalNumberBeGin += o.TotalNumberBeGin;
            element3[key].TotalNumberEnd += o.TotalNumberEnd;
          }
          return r;
        }, []);
        let _totalByPack = (totalByPack.sort(function (a, b) { return b.TotalNumberEnd - a.TotalNumberEnd })).slice(0, 10);
        //#region 

        //#region total By Product 
        let element4 = {};
        let totalProduct = result.reduce((r, o) => {
          let key = o.ProductName;
          if (!element4[key]) {
            element4[key] = Object.assign({}, o);
            r.push(element4[key]);
          } else {
            element4[key].TotalNumberBeGin += o.TotalNumberBeGin;
            element4[key].TotalNumberEnd += o.TotalNumberEnd;
          }
          return r;
        }, []);
        let _totalProduct = (totalProduct.sort(function (a, b) { return b.TotalNumberEnd - a.TotalNumberEnd })).slice(0, 10);

        //#region 

        //#region ratio By warehouse

        let ratioByWarehouse = []
        let totalAnother = totalClosingStock;
        _totalByWarehouse.forEach(element => {
          let percent = (element.TotalNumberEnd / totalClosingStock) * 100;
          totalAnother = totalAnother - element.TotalNumberEnd;
          ratioByWarehouse.push({
            y: parseFloat(percent.toFixed(1)),
            label: element.WareHouseName + ' - ' + parseFloat(percent.toFixed(1)) + '%',
            color: dynamicColors(),
          })
        });
        ratioByWarehouse.push({
          y: parseFloat(((totalAnother / totalClosingStock) * 100).toFixed(1)),
          label: 'Khác - ' + (parseFloat((totalAnother / totalClosingStock) * 100).toFixed(1)) + '%',
          color: dynamicColors(),
        })
        // #endregion

        //#region ratio By pack
        let ratioByPack = []
        let totalAnother2 = totalClosingStock;

        _totalByPack.forEach(element => {
          let percent = (element.TotalNumberEnd / totalClosingStock) * 100;
          totalAnother2 = totalAnother2 - element.TotalNumberEnd;
          ratioByPack.push({
            y: parseFloat(percent.toFixed(1)),
            label: element.ProductPackagingName + ' - ' + parseFloat(percent.toFixed(1)) + '%',
            color: dynamicColors(),
          })
        });
        ratioByPack.push({
          y: parseFloat(((totalAnother2 / totalClosingStock) * 100).toFixed(1)),
          label: 'Khác - ' + (parseFloat((totalAnother2 / totalClosingStock) * 100).toFixed(1)) + '%',
          color: dynamicColors(),
        })
        //#endregion

        //#region ratio By product
        let ratioByProduct = []
        let totalAnother3 = totalClosingStock;

        _totalProduct.forEach(element => {
          let percent = (element.TotalNumberEnd / totalClosingStock) * 100;
          totalAnother3 = totalAnother3 - element.TotalNumberEnd;
          element !== undefined && ratioByProduct.push({
            y: parseFloat(percent.toFixed(1)),
            label: element.ProductName + ' - ' + parseFloat(percent.toFixed(1)) + '%',
            color: dynamicColors(),
          })
        });
        ratioByProduct.push({
          y: parseFloat(((totalAnother3 / totalClosingStock) * 100).toFixed(1)),
          label: 'Khác - ' + (parseFloat((totalAnother3 / totalClosingStock) * 100).toFixed(1)) + '%',
          color: dynamicColors(),
        })
        //#endregion

        //#region total By warehouse
        let ele = {};
        let totalWarehouse = result.reduce((r, o) => {
          let key = o.WareHouseName;
          if (!ele[key]) {
            ele[key] = Object.assign({}, o);
            r.push(ele[key]);
          } else {
            ele[key].TotalNumberBeGin += o.TotalNumberBeGin;
            ele[key].TotalNumberEnd += o.TotalNumberEnd;
          }
          return r;
        }, []);
        //#region 

        setRatioByWarehouse(ratioByWarehouse);
        setRatioByPack(ratioByPack);
        setRatioByProduct(ratioByProduct);
        setisRes(true)
        setTypeRun2(TypeRun2 + 1);
        setTypeRun3(TypeRun3 + 1);
        setTypeRun4(TypeRun4 + 1);

        // setDataReport(_result); //  đầu kỳ cuối kỳ
        setDataReport(totalWarehouse); //  đầu kỳ cuối kỳ
        setDataTotalDetail(result); // detail đầu kỳ cuối kỳ
        setTdate(Todate) // render time begin
        setFdate(Fromdate) // render time end
      } else {
        Alertwarning(I18n.t("Report.NoData"));
        setDataReport([]);
      }
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#endregion

  const WH_spWareHouse_Inventory_ReportDetail = (item) => {
    if (item === 1) {
      setDataReportDetail(DataTotalDetail)
      setWareHouseName("Tất cả kho")
      setState({ data: DataReportDetail });
    }
    else {
      let _DataTotalDetail = DataTotalDetail.filter(e => e.WareHouseId === item.WareHouseId)
      setDataReportDetail(_DataTotalDetail)
      setState({ data: DataReportDetail });
      setWareHouseName(_DataTotalDetail[0].WareHouseName)
      return
    }
  }

  //#region detail
  const columnsDetail = [
    {
      Header: I18n.t("InventoryRatioCustomerReport.ProductCode"),
      accessor: "ProductCode",
      sortable: true,
      filterable: true,
    },
    {
      Header: I18n.t("InventoryRatioCustomerReport.ProductName"),
      accessor: "ProductName",
      sortable: true,
      filterable: true,
    },
    {
      Header: I18n.t("InventoryRatioCustomerReport.Unit"),
      accessor: "ProductPackagingName",
      sortable: true,
      filterable: true,
    },
    {
      Header: I18n.t("InventoryRatioCustomerReport.Inventoryatthebeginningoftheperiod"),
      accessor: "TotalNumberBeGin",
      sortable: true,
      filterable: true,
      Footer: (
        <span className="red">{
          FormatNumber(DataReportDetail.reduce((a, v) => a = a + v.TotalNumberBeGin, 0))
        }</span>
      )
    },
    {
      Header: I18n.t("InventoryRatioCustomerReport.Import"),
      accessor: "TotalNumberImport",
      sortable: true,
      filterable: true,
      Footer: (
        <span className="red">{
          FormatNumber(DataReportDetail.reduce((a, v) => a = a + v.TotalNumberImport, 0))
        }</span>
      )
    },
    {
      Header: I18n.t("InventoryRatioCustomerReport.Export"),
      accessor: "TotalNumberExport",
      sortable: true,
      filterable: true,
      Footer: (
        <span className="red">{
          FormatNumber(DataReportDetail.reduce((a, v) => a = a + v.TotalNumberExport, 0))
        }</span>
      )
    },
    {
      Header: I18n.t("InventoryRatioCustomerReport.Endingstocks"),
      accessor: "TotalNumberEnd",
      sortable: true,
      filterable: true,
      Footer: (
        <span className="red">{
          FormatNumber(DataReportDetail.reduce((a, v) => a = a + v.TotalNumberEnd, 0))
        }</span>
      )
    },
  ];
  //#endregion

  const Exportexcel = () => {
    if (DataReport.length === 0) {
      Alertwarning("Chưa có dữ liệu xuất excel");
      return;
    }
    const newData = DataReportDetail.map((element) => {
      return {
        "Mã sản phẩm": element.ProductCode,
        "Tên sản phẩm": element.ProductName,
        "Đơn vị tính": element.ProductPackagingName,
        "Tồn đầu kỳ": element.TotalNumberBeGin,
        "Nhập": element.TotalNumberImport,
        "Xuất": element.TotalNumberExport,
        "Tồn cuối kỳ": element.TotalNumberEnd,
      };
    });
    let title = "ma khach hang : " + DataReportDetail[0]?.CustomerCode + "Kho: " + WareHouseName + " - Thoi gian : " + FormatDateJson(Fdate, 5) + " den " + FormatDateJson(Tdate, 5)
    ExportExcel(newData, "Bao cao ton kho - " + title);
  };
  const Exportexcel2 = async () => {
    try {
      if (CustomerId === undefined || CustomerId.value <= 0) {
        Alertwarning(I18n.t("validate.Pleasechoosecustomer!"));
        return;
      }
      if (TypeReport === undefined || TypeReport.value <= 0) {
        Alertwarning(I18n.t("validate.Pleaseselectreporttype"));
        return;
      }
      if (TypeReport.value === 1 && Month === undefined) {
        Alertwarning(I18n.t("validate.Pleaseselectthemonth"));
        return;
      }
      if (TypeReport.value === 2) {
        if (Year === undefined || Year.value <= 0) {
          Alertwarning(I18n.t("validate.Pleaseselectyear"));
          return;
        }
      }
      if (TypeReport.value === 2) {
        if (Quarter === undefined || Quarter.value <= 0) {
          Alertwarning(I18n.t("validate.Pleaseselectquarter"));
          return;
        }
      }
      if (Fromdate === undefined || Fromdate === "") {
        Alertwarning(I18n.t("validate.Pleaseenterfromdate"));
        return;
      }
      if (Todate === undefined || Todate === "") {
        Alertwarning(I18n.t("validate.Pleaseenterdate"));
        return;
      }
      setIsLoad(0)
      const params = {
        Json: JSON.stringify({
          CustomerId: CustomerId.value,
          WarehouseId: WareHouseId.value,
          Fromdate: FormatDateJson(Fromdate),
          Todate: FormatDateJson(Todate, 1) + ' 23:59:59'
        }),
        func: "WH_spWareHouse_Inventory_ExcelAbbotReport",
      };
      debugger
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length > 0) {
        const newData = result.map((element) => {
          return {
            "Kho": element.CustomerName,
            "Người phụ trách": element.StaffName,
            "Brand": element.ProductGroupName,
            "Group": element.GroupCode,
            "Mã sản phẩm": element.ProductCode,
            "Tên sản phẩm": element.ProductName,
            "Số PO": element.POcode,
            "Đơn vị tính": element.ProductPackagingName,
            "Tồn đầu kỳ": element.TotalNumberBeGin,
            "Nhập": element.TotalNumberImport,
            "Xuất": element.TotalNumberExport,
            "Tồn cuối kỳ": element.TotalNumberEnd,
            "Nhà cung cấp": element.NameObj,
            "Màu": element.ColorName,
            "Quy cách đóng gói": element.ProductPackagingName,
            "Số lượng thùng": element.UnitNumberConversion,
            "Dài(Thùng)": element.Length,
            "Rộng(Thùng)": element.Width,
            "Cao(Thùng)": element.Height,
            "Kích thước thùng": element.Mass,
            "Số pallet": element.PalletId,
            "Diện tích pallet": element.Palletm2,
            "Loại hàng hóa": element.SizeName,
            "Trọng lượng": element.TotalWeight
          };
        });
        let title = "ma khach hang : " + result[0]?.CustomerCode + "Kho: " + WareHouseName + " - Thoi gian : " + FormatDateJson(Fdate, 5) + " den " + FormatDateJson(Tdate, 5)
        ExportExcel(newData, "Bao cao ton kho KH- " + title);
        setIsLoad(1)
      } else {
        Alertwarning(I18n.t("Report.NoData"));
        setIsLoad(1)
      }
    } catch (error) {
      Alerterror("Error,contact IT Netco!");
      setIsLoad(1)
    }

  };
  //#region detail Popup
  const HtmlPopup2 = (
    <div className="container">
      <div className="modal fade" id="myModal2" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content width_height100 modal__detail__table report_modal">
            <div className="report_detail">
              {IsLoad === 0 && <Loading />}
              <div className="report_detail_header row">
                <div className="report_detail_header_title col-md-12">
                  {I18n.t("InventoryRatioCustomerReport.Inventoryreportbycustomer")}
                </div>
                <div className="report_detail_header_content col-md-12">
                  {I18n.t("InventoryRatioCustomerReport.CustomerCode")}  : {DataReport[0]?.CustomerCode} - {I18n.t("ExportRatioCustomerReport.Warehouse")}: {WareHouseName}: {WareHouseName} - {I18n.t("ExportRatioCustomerReport.Time")} : {FormatDateJson(Fdate, 5)} - {FormatDateJson(Tdate, 5)}
                </div>
                <div className="report_detail_header_export col-md-12">
                  <a
                    className="btn export_excel"
                    onClick={e => Exportexcel(e)}
                  >
                    <i className="fa fa-download mr-2" />
                    {I18n.t("ExportRatioCustomerReport.Exportexcel")}
                  </a>
                </div>
                <div className="report_detail_header_text col-md-12">TỔNG SỐ LƯỢNG SẢN PHẨM ({DataReportDetail.length})</div>
              </div>
              <div className="report_detail_body">
                <DataTable data={DataReportDetail} columns={columnsDetail} />
              </div>
            </div>
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
            {/* Header */}
            <div className="card-header">
              <div className="row">
                <div className="col-md-6">
                  <h3 className="card-title">
                    <i class="fa-solid fa-chart-column" />
                    {I18n.t("InventoryRatioCustomerReport.Inventoryreport")}
                  </h3>
                </div>
                <div className="col-md-6">
                  <div className="card-header-btn">
                    <a
                      className="btn btn-primary btn-sm float-right btn-header"
                      onClick={(e) => WH_spWareHouse_Inventory_Report()}
                    >
                      <i class="fa-solid fa-eye pr-1" />
                      {I18n.t("System.View")}
                    </a>
                  </div>
                  <div className="card-header-btn">
                    <a
                      className="btn btn-warning btn-sm float-right btn-header"
                      onClick={(e) => Exportexcel2()}
                    >
                      <i class="fa fa-download mr-2" />
                      Export Excel
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body-form">
              <FormReport
                onFromDate={(e) => setFromdate(e)}
                onToDate={(e) => setTodate(e)}
                onCustomer={(e) => setCustomerId(e)}
                onWareHouse={(e) => setWareHouseId(e)}
                onTypeReport={(e) => setTypeReport(e)}
                onMonth={(e) => setMonth(e)}
                onQuarter={(e) => setQuarter(e)}
                onYear={e => setYear(e)}
                onType={e => Type}
              />
              {DataReport.length > 0 && <div className="chart-ratio">
                <div className="row df-jc-c">
                  <div className="col-lg-4 col-md-6">
                    <div className="col-md-12 card fixGird">
                      <div className="chart-ratio-title">{I18n.t("InventoryRatioCustomerReport.Inventoryratio")}</div>
                      {isRes && RatioByWarehouse.length > 0 && <ChartTemp data={RatioByWarehouse} id="warehouse" type='pie' height='400' witdthres='350' Typerun={TypeRun2} />}
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="col-md-12 card fixGird">
                      <div className="chart-ratio-title">{I18n.t("InventoryRatioCustomerReport.Percentageofinventoryinunits")}</div>
                      {isRes && RatioByPack.length > 0 && <ChartTemp data={RatioByPack} id="pack" type='pie' height='400' witdthres='350' Typerun={TypeRun3} />}
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="col-md-12 card fixGird">
                      <div className="chart-ratio-title">{I18n.t("InventoryRatioCustomerReport.Inventoryratebyproduct")}</div>
                      {isRes && RatioByProduct.length > 0 && <ChartTemp data={RatioByProduct} id="product" type='pie' height='400' witdthres='350' Typerun={TypeRun4} />}
                    </div>
                  </div>
                </div>
              </div>}
              <div className="row rp_card_container">
                <div className={DataReport.length >= 1 ? "col-xl-4 col-md-6 col-sm-12 pd-0" : "display-none"}>
                  <div className="col-md-12">
                    <div className="rp_card_item active">
                      <div className="rp_card_item_header">
                        <div className="rp_card_item_header_left">
                          <div className="rp_title_active">{DataReport.reduce((a, v) => a = a + v.TotalNumberBeGin, 0)} | {DataReport.reduce((a, v) => a = a + v.TotalNumberEnd, 0)}</div>
                          <div className="rp_content_active">{I18n.t("InventoryRatioCustomerReport.Product(Start-Endofperiod)")}</div>
                        </div>
                        <div className="rp_card_item_header_right">
                          <a
                            data-toggle="modal"
                            data-target="#myModal2"
                            className="btn_rp_detail"
                            onClick={e => WH_spWareHouse_Inventory_ReportDetail(1)}
                          >
                            <i className="fa-solid fa-eye rp_eye i_active" />
                          </a>
                        </div>
                      </div>
                      <hr className="line_active" />
                      <div className="active rp_card_item_body">
                        <div className="i_body_content">
                          <i className="fa-solid fa-circle rp_circle active" />
                          <span className="c_text_active">{I18n.t("InventoryRatioCustomerReport.Nameofthewarehouse")}:</span>{" "}
                          <span className="c_text_bg_active">{I18n.t("InventoryRatioCustomerReport.Allwarehouses")}</span>
                        </div>
                        <div className="i_body_content">
                          <i className="fa-solid fa-circle rp_circle active" />
                          <span className="c_text_active">{I18n.t("InventoryRatioCustomerReport.Time")}: {FormatDateJson(Fdate, 5)} - {FormatDateJson(Tdate, 5)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {DataReport.map((rp, key) => {
                  if (DataReport.length > 0) {
                    return (
                      <div className="col-xl-4 col-md-6 col-sm-12 pd-0">
                        <div className="col-md-12">
                          <div className="rp_card_item">
                            <div className="rp_card_item_header">
                              <div className="rp_card_item_header_left">
                                <div className="rp_title"> {rp.TotalNumberBeGin} | {rp.TotalNumberEnd} </div>
                                <div className="rp_content">{I18n.t("InventoryRatioCustomerReport.Product(Start-Endofperiod)")}</div>
                              </div>
                              <div className="rp_card_item_header_right">
                                <a
                                  data-toggle="modal"
                                  data-target="#myModal2"
                                  className="btn_rp_detail"
                                  onClick={e => WH_spWareHouse_Inventory_ReportDetail(rp)}
                                >
                                  <i className="fa-solid fa-eye rp_eye" />
                                </a>
                              </div>
                            </div>
                            <hr className="line_item" />
                            <div className="rp_card_item_body">
                              <div className="i_body_content">
                                <i className="fa-solid fa-circle rp_circle" />
                                <span className="c_text">{I18n.t("InventoryRatioCustomerReport.Nameofthewarehouse")}:</span>{" "}
                                <span className="c_text_bg">{rp.WareHouseName}</span>
                              </div>
                              <div className="i_body_content">
                                <i className="fa-solid fa-circle rp_circle" />
                                <span className="c_text">{I18n.t("InventoryRatioCustomerReport.Time")}: {FormatDateJson(Fdate, 5)} - {FormatDateJson(Tdate, 5)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}

              </div>
              {HtmlPopup2}

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
