import React, { useState } from "react";
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
} from "../../../Utils";

export const InventoryByDateReport = () => {
  //#region Khai báo biến
  const dispatch = useDispatch();
  const [Type, setType] = useState(2)

  const [TypeRun, setTypeRun] = useState(1);

  const [CustomerId, setCustomerId] = useState();
  const [WareHouseId, setWareHouseId] = useState();
  const [TypeByDate, setTypeByDate] = useState();
  const [LabelDate, setLabelDate] = useState();
  const [WareHouseName, setWareHouseName] = useState();
  const [isStyle, setIsStyle] = useState("display-none");
  const [isRefresh, setisRefresh] = useState(false);

  const [DataReport, setDataReport] = useState([]);
  const [DataReportDetail, setDataReportDetail] = useState([]);
  const [DataDetailWarehouse, setDataDetailWarehouse] = useState([]);
  const [DataRatioDate, setDataRatioDate] = useState([]);

  const [Today, setToday] = useState(1);
  const [Fromday, setFromday] = useState(-100);
  const [Fromdate, setFromdate] = useState(FirstOrLastDayinMonth(new Date(), 1));
  const [Todate, setTodate] = useState(FirstOrLastDayinMonth(new Date()));

  const handleTypeView = (item) => {
    debugger
    if (item === undefined) {
      Alertwarning("Please choise report type !")
      return;
    }
    if (item === 1) {
      WH_spWareHouse_InventoryRatioByDate()
    }
    if (item === 2) {
      WH_spWareHouse_InventoryDateReport()
    }
  }

  const handleClickDetail = (item) => {
    debugger
    if (TypeByDate.value === 1) {
      if (item === 1) {
        WH_spWareHouse_InventoryRatioByDate_Detail()
      } else {
        WH_spWareHouse_InventoryRatioByDate_Detail(DataReport[0].WareHouseId)
      }
    }
    if (TypeByDate.value === 2) {
      if (item === 1) {
        WH_spWareHouse_InventoryDateReport_Detail(item)
      } else {
        WH_spWareHouse_InventoryDateReport_Detail(item)
      }
    }
  }
  const arrService = ["#9B8354", "#1aadce", "#f28f43", "#43f2da", "#9B5454", "#54849B", "#2f7ed8", "#492970", "#9B8354", "#1aadce", "#f28f43", "#43f2da", "#9B5454", "#54849B", "#2f7ed8", "#492970"]

  //#region list
  const WH_spWareHouse_InventoryDateReport = async () => {
    try {
      debugger
      if (CustomerId === undefined || CustomerId.value <= 0) {
        Alertwarning(I18n.t("validate.Pleasechoosecustomer!"));
      }
      if (TypeByDate === undefined || CustomerId.value === 0) {
        Alertwarning(I18n.t("InventoryByDateReport.PleaseselectthedateoftheConsignment!"));
        return;
      }
      const params = {
        Json: JSON.stringify({
          CustomerId: CustomerId.value,
          WarehouseId: WareHouseId.value,
          Fromdate: Fromday,
          Todate: Today
        }),
        func: "WH_spWareHouse_InventoryDateReport",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length > 0) {
        setDataReport(result);
        setLabelDate(TypeByDate.label)
        console.log(result)
        setIsStyle("row rp_card_container mt-4")
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
  const WH_spWareHouse_InventoryDateReport_Detail = async (item) => {
    try {
      const ar = []
      let pr = {}
      if (item === 1) {
        pr = {
          CustomerId: CustomerId.value,
          WarehouseId: WareHouseId.value,
          Fromdate: Fromday,
          Todate: Today
        }
      } else {
        pr = {
          CustomerId: item.CustomerId,
          WarehouseId: item.WareHouseId,
          Fromdate: Fromday,
          Todate: Today
        }
      }
      const params = {
        Json: JSON.stringify(pr),
        func: "WH_spWareHouse_InventoryDateReport_Detail",
      }
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length > 0) {
        if (item == 1) {
          setDataReportDetail(result);
          setWareHouseName(I18n.t("ImportRatioCustomerReport.Allwarehouses"))
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

  const WH_spWareHouse_InventoryRatioByDate = async () => {
    try {
      if (CustomerId === undefined || CustomerId.value <= 0) {
        Alertwarning(I18n.t("InventoryByDateReport.Pleasechoosecustomer!"));
        return;
      }
      if (TypeByDate === undefined || CustomerId.value === 0) {
        Alertwarning(I18n.t("InventoryByDateReport.PleaseselectthedateoftheConsignment"));
        return;
      }
      const params = {
        Json: JSON.stringify({
          CustomerId: CustomerId.value,
          WarehouseId: WareHouseId.value,
          Fromdate: Fromdate,
          Todate: Todate
        }),
        func: "WH_spWareHouse_InventoryRatioByDate",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length > 0) {
        setDataReport(result)
        WH_spWareHouse_InventoryRatioByDate_Detail()
      }
    } catch (error) {

    }
  }


  //#region list
  const WH_spWareHouse_InventoryRatioByDate_Detail = async () => {
    setDataRatioDate([])
    try {
      const params = {
        Json: JSON.stringify({
          CustomerId: CustomerId.value,
          WarehouseId: WareHouseId.value,
          Fromdate: Fromdate,
          Todate: Todate
        }),
        func: "WH_spWareHouse_InventoryRatioByDate_Detail",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length > 0) {
        //#region 
        const lessThenDate = [];
        const date_0_15 = [];
        const date_15_30 = [];
        const date_30_60 = [];
        const date_60_240 = [];
        const moreThenDate = [];
        result.map(e => {
          if (0 >= e.NumberDates)
            lessThenDate.push({
              CreateTime: e.CreateTime,
              CustomerCode: e.CustomerCode,
              CustomerId: e.CustomerId,
              CustomerName: e.CustomerName,
              DateExpiry: e.DateExpiry,
              DateofManufacture: e.DateofManufacture,
              Lotnumber: e.Lotnumber,
              NumberDates: e.NumberDates,
              PackageNumber: e.PackageNumber,
              ProductCode: e.ProductCode,
              ProductGroupName: e.ProductGroupName,
              ProductName: e.ProductName,
              ProductPackagingName: e.ProductPackagingName,
              WareHouseId: e.WareHouseId,
              WareHouseName: e.WareHouseName,
            })
          else if (0 < e.NumberDates && 15 >= e.NumberDates) {
            date_0_15.push({
              CreateTime: e.CreateTime,
              CustomerCode: e.CustomerCode,
              CustomerId: e.CustomerId,
              CustomerName: e.CustomerName,
              DateExpiry: e.DateExpiry,
              DateofManufacture: e.DateofManufacture,
              Lotnumber: e.Lotnumber,
              NumberDates: e.NumberDates,
              PackageNumber: e.PackageNumber,
              ProductCode: e.ProductCode,
              ProductGroupName: e.ProductGroupName,
              ProductName: e.ProductName,
              ProductPackagingName: e.ProductPackagingName,
              WareHouseId: e.WareHouseId,
              WareHouseName: e.WareHouseName,
            })
          }
          else if (15 < e.NumberDates && 30 >= e.NumberDates) {
            date_15_30.push({
              CreateTime: e.CreateTime,
              CustomerCode: e.CustomerCode,
              CustomerId: e.CustomerId,
              CustomerName: e.CustomerName,
              DateExpiry: e.DateExpiry,
              DateofManufacture: e.DateofManufacture,
              Lotnumber: e.Lotnumber,
              NumberDates: e.NumberDates,
              PackageNumber: e.PackageNumber,
              ProductCode: e.ProductCode,
              ProductGroupName: e.ProductGroupName,
              ProductName: e.ProductName,
              ProductPackagingName: e.ProductPackagingName,
              WareHouseId: e.WareHouseId,
              WareHouseName: e.WareHouseName,
            })
          }
          else if (30 < e.NumberDates && 60 >= e.NumberDate) {
            date_30_60.push({
              CreateTime: e.CreateTime,
              CustomerCode: e.CustomerCode,
              CustomerId: e.CustomerId,
              CustomerName: e.CustomerName,
              DateExpiry: e.DateExpiry,
              DateofManufacture: e.DateofManufacture,
              Lotnumber: e.Lotnumber,
              NumberDates: e.NumberDates,
              PackageNumber: e.PackageNumber,
              ProductCode: e.ProductCode,
              ProductGroupName: e.ProductGroupName,
              ProductName: e.ProductName,
              ProductPackagingName: e.ProductPackagingName,
              WareHouseId: e.WareHouseId,
              WareHouseName: e.WareHouseName,
            })
          }
          else if (60 < e.NumberDates && 240 >= e.NumberDates) {
            date_60_240.push({
              CreateTime: e.CreateTime,
              CustomerCode: e.CustomerCode,
              CustomerId: e.CustomerId,
              CustomerName: e.CustomerName,
              DateExpiry: e.DateExpiry,
              DateofManufacture: e.DateofManufacture,
              Lotnumber: e.Lotnumber,
              NumberDates: e.NumberDates,
              PackageNumber: e.PackageNumber,
              ProductCode: e.ProductCode,
              ProductGroupName: e.ProductGroupName,
              ProductName: e.ProductName,
              ProductPackagingName: e.ProductPackagingName,
              WareHouseId: e.WareHouseId,
              WareHouseName: e.WareHouseName,
            })
          }
          else if (240 >= e.NumberDates) {
            moreThenDate.push({
              CreateTime: e.CreateTime,
              CustomerCode: e.CustomerCode,
              CustomerId: e.CustomerId,
              CustomerName: e.CustomerName,
              DateExpiry: e.DateExpiry,
              DateofManufacture: e.DateofManufacture,
              Lotnumber: e.Lotnumber,
              NumberDates: e.NumberDates,
              PackageNumber: e.PackageNumber,
              ProductCode: e.ProductCode,
              ProductGroupName: e.ProductGroupName,
              ProductName: e.ProductName,
              ProductPackagingName: e.ProductPackagingName,
              WareHouseId: e.WareHouseId,
              WareHouseName: e.WareHouseName,
            })
          }
        })

        let _DataDate = []
        _DataDate.push({
          ratio: lessThenDate.length,
          label: "Sản phẩm hết hạn"
        })
        _DataDate.push({
          ratio: date_0_15.length,
          label: "Còn 15 ngày"
        })
        _DataDate.push({
          ratio: date_15_30.length,
          label: "Từ 15 tới 30 ngày"
        })
        _DataDate.push({
          ratio: date_30_60.length,
          label: "Từ 1 tới 2 tháng"
        })
        _DataDate.push({
          ratio: date_60_240.length,
          label: "từ 2 tới 6 tháng"
        })
        _DataDate.push({
          ratio: moreThenDate.length,
          label: "Lớn hơn 6 tháng"
        })

        let _DataRatioDate = []
        let total = result.length
        _DataDate.forEach((element, k) => {
          let percent = (element.ratio / total) * 100;
          _DataRatioDate.push({
            y: Math.round(parseFloat(percent.toFixed(1))),
            label: element.label + ' - ' + parseFloat(percent.toFixed(1)) + '%',
            color: arrService[k],
          })
        });
        //#endregion
        setIsStyle("row rp_card_container mt-4")

        console.log("ratio", result)
        console.log("_DataRatioDate", _DataRatioDate)
        setDataRatioDate(_DataRatioDate)
        setLabelDate(TypeByDate.label)
        setDataReportDetail(result)
        setTypeRun(TypeRun + 1);
        setisRefresh(true)


      } else {
        Alertwarning(I18n.t("Report.NoData"));
        setDataReport([]);
      }
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#endregion

  //#region detail
  const columnsDetail = [
    {
      Header: (I18n.t("InventoryByDateReport.ProductCode")),
      accessor: "ProductCode",
      sortable: true,
      filterable: true,
    },
    {
      Header: (I18n.t("InventoryByDateReport.ProductName")),
      accessor: "ProductName",
      sortable: true,
      filterable: true,
    },
    {
      Header: (I18n.t("InventoryByDateReport.Lotnumber")),
      accessor: "Lotnumber",
      sortable: true,
      filterable: true,
    },
    {
      Header: (I18n.t("InventoryByDateReport.Dateofmanufacture")),
      accessor: "DateofManufacture",
      Cell: (obj) => FormatDateJson(obj.value),
      sortable: true,
      filterable: true,
    },
    {
      Header: (I18n.t("InventoryByDateReport.Expirationdate")),
      accessor: "DateExpiry",
      Cell: (obj) => FormatDateJson(obj.value),
      sortable: true,
      filterable: true,
    },
    {
      Header: (I18n.t("InventoryByDateReport.Numberofdaysleft")),
      accessor: "NumberDates",
      sortable: true,
      filterable: true,
    },
    {
      Header: (I18n.t("InventoryByDateReport.Unit")),
      accessor: "PackageNumber",
      sortable: true,
      filterable: true,
    },
    {
      Header: (I18n.t("InventoryByDateReport.ProductGroups")),
      accessor: "ProductPackagingName",
      sortable: true,
      filterable: true,
    },
    {
      Header: (I18n.t("InventoryByDateReport.ProductGroups")),
      accessor: "ProductGroupName",
      sortable: true,
      filterable: true,
    },
  ];
  //#endregion

  const Exportexcel = () => {
    if (DataReport.length === 0) {
      Alertwarning(I18n.t("InventoryByDateReport.Noexceldatayet"));
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
    let title = (I18n.t("InventoryByDateReport.CustomerCode")) + DataReportDetail[0]?.CustomerCode + (I18n.t("InventoryByDateReport.WareHouse")) + WareHouseName
    ExportExcel(newData, (I18n.t("InventoryByDateReport.Inventoryreportdate")) + title);

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
                  {I18n.t("InventoryByDateReport.DATE/ConsignmentSTOCKREPORT")}
                </div>
                <div className="report_detail_header_content col-md-12">
                  {I18n.t("InventoryByDateReport.DATE/ConsignmentSTOCKREPORT")}: {DataReport[0]?.CustomerCode} - {I18n.t("InventoryByDateReport.WareHouse")}: {WareHouseName} - {I18n.t("InventoryByDateReport.DayConsignment")}: {LabelDate}
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
            <div className="card-header">
              <div className="row">
                <div className="col-md-6">
                  <h3 className="card-title">
                    <i class="fa-solid fa-chart-column" />
                    {I18n.t("InventoryByDateReport.DATE/ConsignmentSTOCKREPORT")}
                  </h3>
                </div>
                <div className="col-md-6 card-header-btn">
                  <a className="btn btn-primary btn-sm float-right btn-header" onClick={(e) => handleTypeView(TypeByDate?.value)} >
                    <i class="fa-solid fa-eye pr-1" />
                    {I18n.t("System.View")}
                  </a>
                </div>
              </div>
            </div>
            <div className="card-body-form">
              <FormReport
                onCustomer={(e) => setCustomerId(e)}
                onWareHouse={(e) => setWareHouseId(e)}
                onType={e => Type}
                onTypeByDate={e => setTypeByDate(e)}
                onFromday={e => setFromday(e)}
                onToday={e => setToday(e)}
                onFromDate={(e) => setFromdate(e)}
                onToDate={(e) => setTodate(e)}
              />
              {DataRatioDate.length > 0 && <div className="chart-ratio center-ratio">
                <div className="row col-xl-6 col-lg-12 card fixGird">
                  <div className="chart-ratio-title">{I18n.t("InventoryRatioCustomerReport.Inventoryratio")}</div>
                  <ChartTemp data={DataRatioDate} id="Chart1" name="Chart1" type='pie' height='450' witdthres='400' Typerun={TypeRun} />
                </div>
              </div>}
              {/* <div className="row rp_card_container mt-4"> */}
              <div className={isStyle}>
                <div className={DataReport.length > 0 ? "col-xl-4 col-md-6 col-sm-12 pd-0" : "display-none"}>
                  <div className="col-md-12">
                    <div className="rp_card_item active">
                      <div className="rp_card_item_header">
                        <div className="rp_card_item_header_left">
                          <div className="rp_title_active">{DataReportDetail.length}</div>
                          <div className="rp_content_active">{I18n.t("InventoryByDateReport.Product")}</div>
                        </div>
                        <div className="rp_card_item_header_right">
                          <a
                            data-toggle="modal"
                            data-target="#myModal2"
                            className="btn_rp_detail"
                            onClick={e => handleClickDetail(1)}
                          >
                            <i className="fa-solid fa-eye rp_eye i_active" />
                          </a>
                        </div>
                      </div>
                      <hr className="line_active" />
                      <div className="active rp_card_item_body">
                        <div className="i_body_content">
                          <i className="fa-solid fa-circle rp_circle active" />
                          <span className="c_text_active">{I18n.t("InventoryByDateReport.NameoftheWarehouse")}:</span>{" "}
                          <span className="c_text_bg_active">{I18n.t("InventoryByDateReport.Allwarehouses")}</span>
                        </div>
                        {/* <div className="i_body_content">
                        <i className="fa-solid fa-circle rp_circle active" />
                        <span className="c_text_active">{I18n.t("InventoryByDateReport.Numberofproductcodes")}: {DataReport.reduce((a, v) => a = a + v.NumberProducts, 0)}</span>
                      </div>
                      <div className="i_body_content">
                        <i className="fa-solid fa-circle rp_circle active" />
                        <span className="c_text_active">{I18n.t("InventoryByDateReport.Totallot")}: {DataReport.reduce((a, v) => a = a + v.NumberLots, 0)}</span>
                      </div> */}
                        <div className="i_body_content">
                          <i className="fa-solid fa-circle rp_circle active" />
                          <span className="c_text_active">{I18n.t("InventoryByDateReport.DayConsignment")}: {LabelDate}</span>
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
                                <div className="rp_title">{rp.NumberProducts}</div>
                                <div className="rp_content">{I18n.t("InventoryByDateReport.Product")}</div>
                              </div>
                              <div className="rp_card_item_header_right">
                                <a
                                  data-toggle="modal"
                                  data-target="#myModal2"
                                  className="btn_rp_detail"
                                  onClick={e => handleClickDetail(rp)}
                                >
                                  <i className="fa-solid fa-eye rp_eye" />
                                </a>
                              </div>
                            </div>
                            <hr className="line_item" />
                            <div className="rp_card_item_body">
                              <div className="i_body_content">
                                <i className="fa-solid fa-circle rp_circle" />
                                <span className="c_text">{I18n.t("InventoryByDateReport.NameoftheWarehouse")}:</span>{" "}
                                <span className="c_text_bg">{rp.WareHouseName}</span>
                              </div>
                              {/* <div className="i_body_content">
                              <i className="fa-solid fa-circle rp_circle" />
                              <span className="c_text">{I18n.t("InventoryByDateReport.Numberofproductcodes")}: {rp.NumberProducts}</span>
                            </div>
                            <div className="i_body_content">
                              <i className="fa-solid fa-circle rp_circle" />
                              <span className="c_text">{I18n.t("InventoryByDateReport.Totallot")}: {rp.NumberLots}</span>
                            </div> */}
                              <div className="i_body_content">
                                <i className="fa-solid fa-circle rp_circle" />
                                <span className="c_text">{I18n.t("InventoryByDateReport.DayConsignment")}: {LabelDate}</span>
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
