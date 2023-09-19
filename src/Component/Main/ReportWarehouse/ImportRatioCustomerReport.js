import React, { useState } from "react";
import { useDispatch } from "react-redux";
import I18n from "../../../Language";
import Select from "react-select";
import DateTimePicker from "react-datetime-picker";
import { DataTable, FormReport } from "../../../Common";
import { mainAction } from "../../../Redux/Actions";
import {
  Alertwarning,
  FormatDateJson,
  ExportExcel,
  FirstOrLastDayinMonth,
} from "../../../Utils";

export const ImportRatioCustomerReport = () => {
  //#region Khai báo biến
  const dispatch = useDispatch();
  const [Type, setType] = useState(1)


  const [Fromdate, setFromdate] = useState(
    FirstOrLastDayinMonth(new Date(), 1)
  );
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

  //#region list
  const WH_spWareHouse_Import_Report = async () => {
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
        func: "WH_spWareHouse_Import_Report",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      debugger
      console.log(result)
      if (result.length > 0) {
        let element = {};
        let _result = result.reduce((r, o) => {
          let key = o.WareHouseName; // group 1 columns
          if (!element[key]) {
            element[key] = Object.assign({}, o); // create a copy of o
            r.push(element[key]);
          } else {
            element[key].TotalNumberProducts += o.TotalNumberProducts;
          }
          return r;
        }, []);

        setDataReport(_result);
        setTdate(Todate)
        setFdate(Fromdate)
        console.log(result);
        console.log(_result);
      } else {
        Alertwarning(I18n.t("Report.NoData"));
        setDataReport([]);
      }
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#endregion

  //#region list detail
  const WH_spWareHouse_ImportDetail_Report = async (item) => {
    try {
      const ar = []
      if (item === 1) {
        ar.push({
          CustomerId: CustomerId.value,
          WarehouseId: 0,
          Fromdate: FormatDateJson(Fromdate),
          Todate: FormatDateJson(Todate),
        })
      } else {
        ar.push({
          CustomerId: item.CustomerId,
          WarehouseId: item.WareHouseId,
          Fromdate: FormatDateJson(Fromdate),
          Todate: FormatDateJson(Todate),
        })
      }
      const params = {
        Json: JSON.stringify(ar),
        func: "WH_spWareHouse_ImportDetail_Report",
      };
      debugger
      const result = await mainAction.API_spCallServer(params, dispatch);
      console.log(result)

      if (result.length > 0) {
        if (item == 1) {
          setDataReportDetail(result);
          setWareHouseName("Tất cả kho")
        } else {
          setDataReportDetail(result);
          setWareHouseName(result[0].WareHouseName)
        }
      } else {
        Alertwarning(I18n.t("Report.NoData"));
        setDataReportDetail([]);
      }
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#endregion

  //#region detail
  const columnsDetail = [
    {
      Header: I18n.t("ImportRatioCustomerReport.ProductCode"),
      accessor: "ProductCode",
      sortable: true,
      filterable: true,
    },
    {
      Header: I18n.t("ImportRatioCustomerReport.ProductName"),
      accessor: "ProductName",
      sortable: true,
      filterable: true,
    },
    {
      Header: I18n.t("ImportRatioCustomerReport.ProductGroups"),
      accessor: "ProductGroupName",
      sortable: true,
      filterable: true,
    },
    {
      Header: I18n.t("ImportRatioCustomerReport.Unit"),
      accessor: "UnitName",
      sortable: true,
      filterable: true,
    },
    {
      Header: I18n.t("ImportRatioCustomerReport.Thenumberofimport"),
      accessor: "PackageNumber",
      sortable: true,
      filterable: true,
    },
  ];
  //#endregion

  const Exportexcel = () => {
    if (DataReportDetail.length === 0) {
      Alertwarning(I18n.t("ImportRatioCustomerReport.Noexceldatayet"));
      return;
    }


    const newData = DataReportDetail.map((element) => {
      return {
        "Mã Sản Phẩm": element.ProductCode,
        "Tên sản phẩm": element.ProductName,
        "Nhóm sản phẩm": element.ProductGroupName,
        "Đơn vị tính": element.UnitName,
        "Số lượng nhập": element.PackageNumber,
      };
    });
    let title = I18n.t("ImportRatioCustomerReport.Customercode") + " : " + DataReportDetail[0]?.CustomerCode + I18n.t("ImportRatioCustomerReport.Warehouse") + ": " + WareHouseName + " - Thoi gian : " + FormatDateJson(Fromdate, 5) + " den " + FormatDateJson(Todate, 5)
    ExportExcel(newData, "Bao cao nhap kho - " + title);
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
                  {I18n.t("ImportRatioCustomerReport.DetailsofImportedProducts")}
                </div>
                <div className="report_detail_header_content col-md-12">
                  {I18n.t("ImportRatioCustomerReport.Customercode")} : {DataReportDetail[0]?.CustomerCode} - {I18n.t("ImportRatioCustomerReport.Warehouse")}: {WareHouseName} - {I18n.t("ImportRatioCustomerReport.Time")} : {FormatDateJson(Fdate, 5)} - {FormatDateJson(Tdate, 5)}
                </div>
                <div className="report_detail_header_export col-md-12">
                  <a
                    className="btn export_excel"
                    onClick={e => Exportexcel()}
                  >
                    <i className="fa fa-download mr-2" />
                    {I18n.t("ImportRatioCustomerReport.Exportexcel")}
                  </a>
                </div>
                <div className="report_detail_header_text col-md-12">{I18n.t("ImportRatioCustomerReport.TOTALNUMBEROFPRODUCTS")} ({DataReportDetail.length})</div>
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
                    {I18n.t("ImportRatioCustomerReport.ImportReport")}
                  </h3>
                </div>
                <div className="col-md-6 card-header-btn">
                  <a
                    className="btn btn-primary btn-sm float-right btn-header"
                    onClick={(e) => {
                      WH_spWareHouse_Import_Report()
                      WH_spWareHouse_ImportDetail_Report(1)
                    }}
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
                          {/* <div className="rp_title_active">{DataReport.reduce((a, v) => a = a + v.TotalNumberProducts, 0)}</div> */}
                          <div className="rp_title_active">{DataReportDetail.length}</div>
                          <div className="rp_content_active">{I18n.t("ImportRatioCustomerReport.Product")}</div>
                        </div>
                        <div className="rp_card_item_header_right">
                          <a
                            data-toggle="modal"
                            data-target="#myModal2"
                            className="btn_rp_detail"
                            onClick={e => WH_spWareHouse_ImportDetail_Report(1)}
                          >
                            <i className="fa-solid fa-eye rp_eye i_active" />
                          </a>
                        </div>
                      </div>
                      <hr className="line_active" />
                      <div className="active rp_card_item_body">
                        <div className="i_body_content">
                          <i className="fa-solid fa-circle rp_circle active" />
                          <span className="c_text_active">{I18n.t("ImportRatioCustomerReport.Nameofthewarehouse")}:</span>{" "}
                          <span className="c_text_bg_active">{I18n.t("ImportRatioCustomerReport.Allwarehouses")}</span>
                        </div>
                        <div className="i_body_content">
                          <i className="fa-solid fa-circle rp_circle active" />
                          <span className="c_text_active">{I18n.t("ImportRatioCustomerReport.Time")}: {FormatDateJson(Fdate, 5)} - {FormatDateJson(Tdate, 5)}</span>
                        </div>
                        {/* <div className="i_body_content">
                        <i className="fa-solid fa-circle rp_circle active" />
                        <span className="c_text_active">{I18n.t("ImportRatioCustomerReport.Numberofproductcodes")}: {DataReport.reduce((a, v) => a = a + v.TotalProducts, 0)}</span>
                      </div> */}
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
                                {/* <div className="rp_title"> {rp.TotalNumberProducts} </div> */}
                                <div className="rp_title"> {DataReportDetail.length} </div>
                                <div className="rp_content">{I18n.t("ImportRatioCustomerReport.Product")}</div>
                              </div>
                              <div className="rp_card_item_header_right">
                                <a
                                  data-toggle="modal"
                                  data-target="#myModal2"
                                  className="btn_rp_detail"
                                  onClick={e => WH_spWareHouse_ImportDetail_Report(rp)}
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
                                <span className="c_text">{I18n.t("ImportRatioCustomerReport.Time")}: {FormatDateJson(Fdate, 5)} - {FormatDateJson(Tdate, 5)}</span>
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
