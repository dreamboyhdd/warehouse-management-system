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
  ExportExcel, FirstOrLastDayinMonth,
} from "../../../Utils";

export const ProductByLocation = () => {

  //#region Khai báo biến
  const dispatch = useDispatch();
  const [Type, setType] = useState(1)

  const [State, setState] = useState();

  const [Fromdate, setFromdate] = useState(FirstOrLastDayinMonth(new Date(), 1));
  const [Todate, setTodate] = useState(FirstOrLastDayinMonth(new Date()));
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
  const [TotalViewProduct, setTotalViewProduct] = useState([]);

  function groupByKey(array, key) {
    return array
      .reduce((hash, obj) => {
        if (obj[key] === undefined) return hash;
        return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) })
      }, {})
  }

  //#region list
  const WH_spWareHouse_Report_LocationByProduct = async () => {
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
          Todate: FormatDateJson(Todate),
        }),
        func: "WH_spWareHouse_Report_LocationByProduct",
      };
      debugger
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length > 0) {

        // #region tinh tong so luong san pham
        let element = {};
        let _result = result.reduce((r, o) => {
          let key = o.CustomerId; // group 1 columns
          if (!element[key]) {
            element[key] = Object.assign({}, o); // create a copy of o
            r.push(element[key]);
          } else {
            element[key].ActualNumber += o.ActualNumber;
          }
          return r;
        }, []);
        console.log("_result", _result)
        // #endregion

        // #region tinh tong san pham trong mang
        var dataTotal = groupByKey(result, 'ProductId');
        console.log("dataTotal", Object.values(dataTotal));
        // #endregion

        // #region lay id theo warehouse
        const totalByWarehouse = Object.values(result.reduce((a,
          { WareHouseId, WareHouseName }) => {
          a[WareHouseId] = a[WareHouseId] ||
          {
            WareHouseId: WareHouseId,
            WareHouseName: WareHouseName,
          };
          return a;
        }, {}));
        console.log('list ID warehouse', totalByWarehouse)
        // #endregion

        // let _totalByWarehouse = []
        // totalByWarehouse.map((e, k) => {
        //   _totalByWarehouse.push({
        //     WareHouseId: e.WareHouseId,
        //     WareHouseName: e.WareHouseName,
        //   })
        // })

        // console.log('list ID warehouse ', _totalByWarehouse)

        setDataReport(totalByWarehouse); setTotalViewProduct(Object.values(dataTotal))
        setDataTotalDetail(result)
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

  const WH_spWareHouse_Report_LocationByProduct_Detail = (item) => {
    debugger
    if (item === 1) {
      setDataReportDetail(DataTotalDetail)
      setWareHouseName(I18n.t("InventoryRatioCustomerReport.Allwarehouses"))
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
      Header: I18n.t("GroupProducts.ProductCode"),
      accessor: "ProductCode",
      sortable: true,
      filterable: true,
    },
    {
      Header: I18n.t("GroupProducts.ProductName"),
      accessor: "ProductName",
      sortable: true,
      filterable: true,
    },
    {
      Header: I18n.t("InventoryByCustomerReport.Amount"),
      accessor: "ActualNumber",
      sortable: true,
      filterable: true,
    },
    {
      Header: I18n.t("ExportRatioCustomerReport.Warehouse"),
      accessor: "WareHouseName",
      sortable: true,
      filterable: true,
    },
    {
      Header: I18n.t("System.Area"),
      accessor: "WareHouseAreaName",
      sortable: true,
      filterable: true,
      // width: 100
    },
    {
      Header: I18n.t("ProductByLocation.Shelf"),
      accessor: "ShelvesName",
      sortable: true,
      filterable: true,
      // width: 100
    },
    {
      Header: I18n.t("ProductByLocation.Floor"),
      accessor: "FloorName",
      sortable: true,
      filterable: true,
      // width: 100
    },
    {
      Header: I18n.t("ProductByLocation.Location"),
      accessor: "LocationName",
      sortable: true,
      filterable: true,
      // width: 100
    },
    {
      Header: I18n.t("WareHouse.Picture"),
      accessor: "ImageLocal",
      sortable: true,
      filterable: true,
      // width: 100
    },
  ];
  //#endregion

  const Exportexcel = () => {
    if (DataReport.length === 0) {
      Alertwarning(I18n.t("ImportRatioCustomerReport.Noexceldatayet"));
      return;
    }
    const newData = DataReportDetail.map((element) => {
      return {
        "Mã sản phẩm": element.ProductCode,
        "Tên sản phẩm": element.ProductName,
        "Tồn đầu kỳ": element.TotalNumberBeGin,
        "Nhập": element.TotalNumberImport,
        "Xuất": element.TotalNumberExport,
        "Tồn cuối kỳ": element.TotalNumberEnd,
      };
    });
    let title = "Ten khach hang : " + DataReportDetail[0]?.CustomerName + "Kho: " + WareHouseName + " - Thoi gian : " + FormatDateJson(Fdate, 5) + " den " + FormatDateJson(Tdate, 5)
    ExportExcel(newData, "Bao cao ton kho - " + title);
  };

  //#region detail Popup
  const HtmlPopup2 = (
    <div className="container">
      <div className="modal fade" id="myModal2" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content width_height100 modal__detail__table report_modal">
            <div className="report_detail">
              <div className="report_detail_header row">
                <div className="report_detail_header_title col-md-12">
                  {I18n.t("ProductByLocation.Productreportbylocation")}
                </div>
                <div className="report_detail_header_content col-md-12">
                  {I18n.t("System.CustomerName")}: {DataReport[0]?.CustomerName} - {I18n.t("ImportRatioCustomerReport.Warehouse")}: {WareHouseName} -{I18n.t("InventoryRatioCustomerReport.Time")}: {FormatDateJson(Fdate, 5)} - {FormatDateJson(Tdate, 5)}
                </div>
                <div className="report_detail_header_export col-md-12">
                  <a
                    className="btn export_excel"
                    onClick={e => Exportexcel(e)}
                  >
                    <i className="fa fa-download mr-2" />
                    {I18n.t("InventoryByDateReport.Exportexcel")}
                  </a>
                </div>
                <div className="report_detail_header_text col-md-12">{I18n.t("ImportRatioCustomerReport.TOTALNUMBEROFPRODUCTS")}({TotalViewProduct.length})</div>
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
            <div className="card-header">
              <div className="row">
                <div className="col-md-6">
                  <h3 className="card-title">
                    <i class="fa-solid fa-chart-column" />
                    {I18n.t("ProductByLocation.Productreportbylocation")}
                  </h3>
                </div>
                <div className="col-md-6 card-header-btn">
                  <a
                    className="btn btn-primary btn-sm float-right btn-header"
                    onClick={(e) => WH_spWareHouse_Report_LocationByProduct()}
                  >
                    <i class="fa-solid fa-eye pr-1" />
                    {I18n.t("System.View")}
                  </a>
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
              <div className="row rp_card_container mt-4">
                <div className={DataReport.length >= 1 ? "col-xl-4 col-md-6 col-sm-12 pd-0" : "display-none"}>
                  <div className="col-md-12">
                    <div className="rp_card_item active">
                      <div className="rp_card_item_header">
                        <div className="rp_card_item_header_left">
                          <div className="rp_title_active">{DataTotalDetail.length}</div>
                          <div className="rp_content_active">{I18n.t("GroupProducts.Productcode")}</div>
                        </div>
                        <div className="rp_card_item_header_right">
                          <a
                            data-toggle="modal"
                            data-target="#myModal2"
                            className="btn_rp_detail"
                            onClick={e => WH_spWareHouse_Report_LocationByProduct_Detail(1)}
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
                      <div key="" className="col-xl-4 col-md-6 col-sm-12 pd-0">
                        <div className="col-md-12">
                          <div className="rp_card_item">
                            <div className="rp_card_item_header">
                              <div className="rp_card_item_header_left">
                                <div className="rp_title"> {DataTotalDetail.length} </div>
                                <div className="rp_content">{I18n.t("InventoryByDateReport.ProductCode")}</div>
                              </div>
                              <div className="rp_card_item_header_right">
                                <a
                                  data-toggle="modal"
                                  data-target="#myModal2"
                                  className="btn_rp_detail"
                                  onClick={e => WH_spWareHouse_Report_LocationByProduct_Detail(rp)}
                                >
                                  <i className="fa-solid fa-eye rp_eye" />
                                </a>
                              </div>
                            </div>
                            <hr className="line_item" />
                            <div className="rp_card_item_body">
                              <div className="i_body_content">
                                <i className="fa-solid fa-circle rp_circle" />
                                <span className="c_text">{I18n.t("ImportRatioCustomerReport.Nameofthewarehouse")}:</span>{" "}
                                <span className="c_text_bg">{rp.WareHouseName}</span>
                              </div>
                              <div className="i_body_content">
                                <i className="fa-solid fa-circle rp_circle" />
                                <span className="c_text">{I18n.t("ExportRatioCustomerReport.Time")}: {FormatDateJson(Fdate, 5)} - {FormatDateJson(Tdate, 5)}</span>
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
