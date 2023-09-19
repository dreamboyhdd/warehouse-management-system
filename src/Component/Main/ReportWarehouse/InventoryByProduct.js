import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import I18n from "../../../Language";
import Select from "react-select";
import DateTimePicker from "react-datetime-picker";
import { DataTable, FormInventory } from "../../../Common";
import { mainAction } from "../../../Redux/Actions";
import {
  Alertwarning,
  FormatDateJson,
  FormatMoney,
  ExportExcel,
  FirstOrLastDayinMonth,
  FormatNumber,
} from "../../../Utils";

export const InventoryByProduct = () => {

  //#region Khai báo biến
  const dispatch = useDispatch();
  const [TypeRun4, setTypeRun4] = useState(1);
  const [isRes, setisRes] = useState(false);
  const [State, setState] = useState();

  const [InventoryType, setInventoryType] = useState(0);
  const [CustomerId, setCustomerId] = useState(0);
  const [WareHouseId, setWareHouseId] = useState(0);
  const [WareHouseAreaId, setWareHouseAreaId] = useState(0);
  const [WareHouseName, setWareHouseName] = useState();
  const [ProductCode, setProductCode] = useState("");
  const [ProductSeries, setProductSeries] = useState("");

  const [DataReport, setDataReport] = useState([]);
  const [DataHistory, setDataHistory] = useState([]);
  const [DetailProductName, setDetailProductName] = useState("");
  const [DetailCodeSeriIme, setDetailCodeSeriIme] = useState("");
  const [DetailWareHouseName, setDetailWareHouseName] = useState("");
  const [DetailCustomerName, setDetailCustomerName] = useState("");

  //#region list

  const WH_spWareHouse_Product_Inventory = async () => {
    debugger
    try {
      let obj = {};
      if (ProductCode === '' && ProductSeries === '' && CustomerId === 0 && WareHouseId === 0) {
        Alertwarning("Please select 1 of 4 fields: Product Code, Product Line, Customer, Warehouse to search !");
        return;
      }
      obj.CustomerId = CustomerId.value;
      obj.WareHouseId = WareHouseId.value;
      obj.ProductCode = ProductCode;
      obj.ProductSeries = ProductSeries;
      obj.InventoryType = InventoryType.value;
      obj.WareHouseAreaId = WareHouseAreaId.value;

      const params = {
        Json: JSON.stringify(obj),
        func: "WH_spWareHouse_Product_Inventory",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length > 0) {
        setisRes(true)
        setTypeRun4(TypeRun4 + 1);
        setDataReport(result);
      } else {
        Alertwarning(I18n.t("Report.NoData"));
        setDataReport([]);
      }
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };

  const columns = [
    {
      Header: "OPTION",
      accessor: 'ProductId',
      filterable: false,
      sortable: false,
      width: 100,
      maxWidth: 100,
      special: true,
      show: true,
      textAlign: "center",
      fixed: 'left',
      Cell: (row) => (
        <div className="col-sm-12">
          <button className="btn btn-sm btn-info" data-toggle="modal" data-target="#myModal3" type="button" onClick={(e) => { WH_spWareHouse_Product_Inventory_History(row.original) }}><i className="fas fa-eye"></i></button>
        </div>
      )
    },
    {
      Header: "InBound COde",
      accessor: "ImportCode",
      sortable: true,
      filterable: true,
      fixed: 'left',
      width: 160
    },
    {
      Header: "InBound Time",
      accessor: "CreateTime",
      sortable: true,
      filterable: true,
      fixed: 'left',
      width: 160,
      Cell: (row) => (
        <span>{FormatDateJson(row.original.CreateTime)}</span>
      )
    },
    {
      Header: "PRODUCT CODE",
      accessor: "ProductCode",
      sortable: true,
      filterable: true,
      fixed: 'left',
      width: 160
    },
    {
      Header: "PRODUCT NAME",
      accessor: "ProductName",
      sortable: true,
      filterable: true,
      fixed: 'left',
      minWidth: 200
    },
    {
      Header: "PRODUCT SERIES",
      accessor: "CodeSeriIme",
      sortable: true,
      filterable: true,
      fixed: 'left',
      width: 160
    },
    {
      Header: "LOCATION",
      accessor: "WareHouseLocationName",
      sortable: true,
      filterable: true,
    },
    {
      Header: "PALLET",
      accessor: "PalletCode",
      sortable: true,
      filterable: true,
      Footer: (
        <span className="bold">Tổng</span>
      )
    },
    {
      Header: "INBOUND (ITEM)",
      accessor: "InBound",
      sortable: true,
      filterable: true,
      Footer: (
        <span className="red">{
          FormatNumber(DataReport.reduce((a, v) => a = a + v.InBound, 0))
        }</span>
      )
    },
    {
      Header: "OutBound (ITEM)",
      accessor: "OutBound",
      sortable: true,
      filterable: true,
      Footer: (
        <span className="red">{
          FormatNumber(DataReport.reduce((a, v) => a = a + v.OutBound, 0))
        }</span>
      )
    },
    {
      Header: "Increase (ITEM)",
      accessor: "Increase",
      sortable: true,
      filterable: true,
      Footer: (
        <span className="red">{
          FormatNumber(DataReport.reduce((a, v) => a = a + v.Increase, 0))
        }</span>
      )
    },
    {
      Header: "Reduce (ITEM)",
      accessor: "Reduce",
      sortable: true,
      filterable: true,
      Footer: (
        <span className="red">{
          FormatNumber(DataReport.reduce((a, v) => a = a + v.Reduce, 0))
        }</span>
      )
    },
    {
      Header: "INVENTORY (ITEM)",
      accessor: "Inventory",
      sortable: true,
      filterable: true,
      Cell: (row) => (
        <>
          {row.original.Inventory === 0 && (<span style={{ color: "red", fontWeight: "500" }}>{row.original.Inventory}</span>)}
          {row.original.Inventory < row.original.InBound && row.original.Inventory !== 0 && (<span style={{ color: "orange", fontWeight: "500" }}>{row.original.Inventory}</span>)}
          {row.original.Inventory === row.original.InBound && (<span>{row.original.Inventory}</span>)}
        </>
      ),
      Footer: (
        <span className="red">{
          FormatNumber(DataReport.reduce((a, v) => a = a + v.Inventory, 0))
        }</span>
      )
    },
    {
      Header: "DATE EXPIRY",
      accessor: "DateExpiry",
      sortable: true,
      filterable: true,
      Cell: (row) => (
        <>
          {((new Date(row.original.DateExpiry) - (new Date())) / (1000 * 60 * 60 * 24) <= 0) && (<span style={{ color: "red", fontWeight: "500" }}>{FormatDateJson(row.original.DateExpiry, 5)}</span>)}
          {((new Date(row.original.DateExpiry) - (new Date())) / (1000 * 60 * 60 * 24) <= 30) && ((new Date(row.original.DateExpiry) - (new Date())) / (1000 * 60 * 60 * 24) > 0) && (<span style={{ color: "orange", fontWeight: "500" }}>{FormatDateJson(row.original.DateExpiry, 5)}</span>)}
          {((new Date(row.original.DateExpiry) - (new Date())) / (1000 * 60 * 60 * 24) > 30) && (<span>{FormatDateJson(row.original.DateExpiry, 5)}</span>)}
        </>
      )
    },
    {
      Header: "PRODUCT'S GROUP NAME",
      accessor: "ProductGroupName",
      sortable: true,
      filterable: true,
    },
    {
      Header: "CUSTOMER",
      accessor: "CustomerName",
      sortable: true,
      filterable: true,
    },
    {
      Header: "WAREHOUSE",
      accessor: "WareHouseName",
      sortable: true,
      filterable: true,
    },
    {
      Header: "UNIT",
      accessor: "UnitName",
      sortable: true,
      filterable: true,
    },
    {
      Header: "DATE OF MANUFACTURE",
      accessor: "DateofManufacture",
      sortable: true,
      filterable: true,
      Cell: (row) => (
        <span>{FormatDateJson(row.original.DateofManufacture, 5)}</span>
      )
    },
    {
      Header: "SIZE",
      accessor: "SizeName",
      sortable: true,
      filterable: true,
    },
    {
      Header: "COLOR",
      accessor: "ColorName",
      sortable: true,
      filterable: true,
    },
    {
      Header: "WEIGHT",
      accessor: "Weight",
      sortable: true,
      filterable: true,
    },
    {
      Header: "MASS",
      accessor: "Mass",
      sortable: true,
      filterable: true,
    },
  ]

  const Exportexcel = () => {
    if (DataReport.length === 0) {
      Alertwarning(I18n.t("ImportRatioCustomerReport.Noexceldatayet"));
      return;
    }
    const newData = DataReport.map((element) => {
      return {
        "PRODUCT'S CODE": element.ProductCode,
        "PRODUCT'S NAME": element.ProductName,
        "PRODUCT'S SERIES": element.CodeSeriIme,
        "EXPIRY DATE": FormatDateJson(element.DateExpiry, 5),
        "LOCATION": element.WareHouseLocationName,
        "PALLET": element.PalletCode,
        "INBOUND": element.Inbound,
        "OUTBOUND": element.Outbound,
        "INVENTORY": element.Inventory,
        "PRODUCT'S GROUP NAME": element.ProductGroupName,
        "CUSTOMER": element.CustomerName,
        "WAREHOUSE": element.WareHouseName,
        "UNIT": element.UnitName,
        "DATE OF MANUTACTURE": FormatDateJson(element.DateofManufacture, 5),
        "SIZE": element.SizeName,
        "COLOR": element.ColorName,
        "WEIGHT": element.Weight,
        "MASS": element.Mass,
      };
    });
    ExportExcel(newData, "PRODUCT INVENTORY");
  };

  //#endregion

  //#region detail by series

  const WH_spWareHouse_Product_Inventory_History = async (row) => {
    debugger
    try {
      setDetailCodeSeriIme(row.CodeSeriIme);
      setDetailProductName(row.ProductName);
      setDetailWareHouseName(row.WareHouseName);
      setDetailCustomerName(row.CustomerName);
      const params = {
        Json: JSON.stringify({
          CustomerId: CustomerId.value,
          WareHouseId: WareHouseId.value,
          ProductId: row.ProductId,
          ProductSeries: row.CodeSeriIme
        }),
        func: "WH_spWareHouse_Product_Inventory_History",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      setDataHistory(result);
      if (result.length === 0) {
        Alertwarning(I18n.t("Report.NoData"));
      }
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  }

  const columnsHistory = [
    {
      Header: "PRODUCT NAME",
      accessor: "ProductName",
      sortable: true,
      filterable: true,
    },
    {
      Header: "DATE OF MANUFACTURE",
      accessor: "DateofManufacture",
      sortable: true,
      filterable: true,
      Cell: (row) => (
        <span>{FormatDateJson(row.original.DateofManufacture, 5)}</span>
      )
    },
    {
      Header: "DATE EXPIRY",
      accessor: "DateExpiry",
      sortable: true,
      filterable: true,
      Cell: (row) => (
        <span>{FormatDateJson(row.original.DateExpiry, 5)}</span>
      )
    },
    {
      Header: "Lot number",
      accessor: "Lotnumber",
      sortable: true,
      filterable: true,
    },
    {
      Header: "Number of package",
      accessor: "PackageNumber",
      sortable: true,
      filterable: true,
    },
    {
      Header: "UNIT",
      accessor: "UnitName",
      sortable: true,
      filterable: true,
    },
    {
      Header: "Log's type",
      accessor: "Types",
      sortable: true,
      filterable: true,
    },
    {
      Header: "Import code",
      accessor: "ImportCode",
      sortable: true,
      filterable: true,
    },
    {
      Header: "Staff",
      accessor: "CreateName",
      sortable: true,
      filterable: true,
    },
    {
      Header: "Create time",
      accessor: "CreateTime",
      sortable: true,
      filterable: true,
      Cell: (row) => (
        <span>{FormatDateJson(row.original.CreateTime, 5)}</span>
      )
    },
    {
      Header: "NOTE",
      accessor: "Note",
      sortable: true,
      filterable: true,
    }
  ];

  const ExportexcelBySeries = () => {
    if (DataReport.length === 0) {
      Alertwarning(I18n.t("ImportRatioCustomerReport.Noexceldatayet"));
      return;
    }
    const newData = DataHistory.map((element) => {
      return {
        "INBOUND/OUTBOUND": element.Types,
        "CODE": element.ImportCode,
        "IMPLEMENTATION DATE": FormatDateJson(element.CreateTime, 5),
        "PRODUCT": element.ProductName,
        "DATE OF MANUFACTURE": FormatDateJson(element.DateofManufacture, 5),
        "EXPIRY DATE": FormatDateJson(element.DateExpiry, 5),
        "QUANTITY": element.PackageNumber,
        "PRODUCT'S SERIES": element.CodeSeriIme,
        "UNIT": element.UnitName,
        "LOT NUMBER": element.Lotnumber,
        "IMPLEMENTATION STAFF": element.CreateName,
        "NOTE": element.Note,
      };
    });
    let title = "San pham : " + DetailProductName + " - Series san pham : " + DetailCodeSeriIme + " - Kho: " + DetailWareHouseName + " - KH: " + DetailCustomerName
    ExportExcel(newData, "Bao cao ton kho theo " + title);
  };

  //#region detail Popup
  const HtmlPopup3 = (
    <div className="container">
      <div className="modal fade" id="myModal3" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content width_height100 modal__detail__table report_modal">
            <div className="report_detail">
              <div className="report_detail_header row">
                <div className="report_detail_header_title col-md-12">
                  INVENTORY PRODUCT
                </div>
                <div className="report_detail_header_content col-md-12">
                  Product: {DetailProductName} - Series : {DetailCodeSeriIme}- {I18n.t("InventoryByDateReport.WareHouse")} : {DetailWareHouseName} - Customer:  {DetailCustomerName}
                </div>
                <div className="report_detail_header_export col-md-12">
                  <a
                    className="btn export_excel"
                    onClick={e => ExportexcelBySeries(e)}
                  >
                    <i className="fa fa-download mr-2" />
                    {I18n.t("InventoryByDateReport.Exportexcel")}
                  </a>
                </div>
                <div className="report_detail_header_text col-md-12">TOTAL TIMES INBOUT/OUTBOUND ({DataHistory.length})</div>
              </div>
              <div className="report_detail_body">
                <DataTable data={DataHistory} columns={columnsHistory} fixedColumns="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  //#endregion

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
                    INVENTORY PRODUCT
                  </h3>
                </div>
                <div className="col-md-6 card-header-btn">
                  {DataReport.length > 0 && (<a className="btn export_excel btn-sm btn-success float-right btn-header" onClick={e => Exportexcel()} >
                    <i className="fa fa-download mr-2" />
                    {I18n.t("InventoryByDateReport.Exportexcel")}
                  </a>)}
                  <a className="btn btn-primary btn-sm float-right btn-header" onClick={(e) => { WH_spWareHouse_Product_Inventory() }}>
                    <i class="fa-solid fa-eye pr-1" />
                    {I18n.t("System.View")}
                  </a>
                </div>
              </div>
            </div>
            <div className="card-body-form">
              <FormInventory
                onCustomer={(e) => setCustomerId(e)}
                onWareHouse={(e) => setWareHouseId(e)}
                onWareHouseArea={a => setWareHouseAreaId(a)}
                onProductCode={e => setProductCode(e)}
                onProductSeries={e => setProductSeries(e)}
                onInventoryType={e => setInventoryType(e)}
              />
              {isRes && (<div className="card card-primary mt-2">
                <div className="body-padding">
                  <div className="card-header">
                    <h3 className="card-title"><i class="fa-solid fa-bars"></i> LIST OF Inventory Product ({DataReport.length})</h3>
                  </div>
                  <div className="card-body">
                    <div class="col-md-12 pt-2 mt-2">
                      {DataReport.length > 0 && (<DataTable data={DataReport} columns={columns} fixedColumns={true} />)}
                    </div>
                  </div>
                </div>
              </div>)}
            </div>
            {HtmlPopup3}
          </div>
        </div>
      </section>
    </div>
  );
};
