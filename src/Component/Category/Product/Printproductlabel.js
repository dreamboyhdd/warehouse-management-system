import React, { useState, useEffect, useRef } from "react";
import I18n from "../../../Language";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../Redux/Actions";
import { DataTable } from "../../../Common/DataTable";
import { APIKey } from "../../../Services/Api";
import Select from "react-select";
import DateTimePicker from "react-datetime-picker";
import { QRCodeSVG } from 'qrcode.react';
import $ from 'jquery';
import {
  Alerterror,
  Alertsuccess,
  Alertwarning,
  FormatDate,
  FormatDateJson,
  FirstOrLastDayinMonth,
  GetDataFromLogin,
  ExportExcel,
  ConfirmAlert
} from "../../../Utils";
import {
  SelectProductGroup,
  SettingColumn,
} from "../../../Common";

export const Printproductlabel = () => {
  //#regon begin using the effect hook
  useEffect(() => {

  }, []);
  //#end regon
  // const [ProductId, setProductId] = useState(0);
  // const [ProductsGroup, setProductsGroup] = useState({ value: 0 });
  const dispatch = useDispatch();
  const [Printnumber, setPrintnumber] = useState(1)
  const [dataarray, setdataarray] = useState("");
  const [Checkall, setCheckall] = useState(false);
  const [ProductCode2, setProductCode2] = useState("");
  const [ProductsGroup2, setProductsGroup2] = useState({ value: 0 });
  const [ProductName2, setProductName2] = useState("");
  const [CreateName, setCreateName] = useState({});
  const [Barcode2, setBarcode2] = useState("");
  const [Size2, setSize2] = useState({ value: 0 });
  const [DataProduct, setDataProduct] = useState([]);
  const [ProductCode, setProductCode] = useState("");
  const [ProductsGroup, setProductsGroup] = useState({ value: 0 });
  const Accountinfor = JSON.parse(localStorage.getItem("Accountinfor") === "" ? "{}" : localStorage.getItem("Accountinfor"));


  const WH_spProduct_List = async () => {
    // //kiem tra quyen xem
    // if (datapermisstion !== "") {
    //   let a = JSON.parse(datapermisstion);
    //   let b = a.find(p => p.WH_tblMenuModuleId === 60 && p.Views === 'C')
    //   if (b === undefined) {
    //     Alertwarning(I18n.t("validate.Youdonothavepermissiontoviewtheproduct!"));
    //     return;
    //   }
    // }
    try {
      const params = {
        Json: JSON.stringify({
          ProductId: 0,
          ProductCode: ProductCode2.trim(),
          ProductName: ProductName2.trim(),
          ProductsGroupId: ProductsGroup.value,
          Size: Size2.value,
          Barcode: Barcode2.trim(),
          CreateId: CreateName?.value,
          AccountId: Accountinfor.AccountId,
          AccountName: Accountinfor.AccountName,
        }),
        func: "WH_spProduct_List",
      };
      debugger
      const result = await mainAction.API_spCallServer(params, dispatch);
      console.log(result)
      setDataProduct(result);
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  useEffect(() => {
    if (dataarray.keys === "check") {
      CheckOne(dataarray._row.original.ProductId, dataarray._row.original.IsCheck);
    } else if (dataarray.keys === 'delete') {

    } else if (dataarray.keys === 'checkall') {
      CheckOne(0, Checkall)
    }
  }, [dataarray]);
  const CheckOne = (Id, Check) => {
    let _DataList = [...DataProduct]
    if (Id == 0) {
      _DataList.forEach(i => { i.IsCheck = !Checkall })
      setCheckall(!Checkall)
    } else {
      if (Check === undefined)
        Check = false;
      _DataList.find((p) => p.ProductId == Id).IsCheck = !Check;
    }
    setDataProduct(_DataList);
  };
  //#region view image
  const [dataQRCode, setdataQRCode] = useState("");
  const viewQRCodeInTable = async (QRCode) => {
    setdataQRCode(QRCode);
  };
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

  //#endregion
  ////Print
  const [PrintdataQRCode, setPrintdataQRCode] = useState([]);
  const PrintQRCode = async (QRCode) => {
    debugger
    const DataPrint = DataProduct.filter(p => p.IsCheck === true);
    if (DataPrint.length === 0) {
      Alertwarning(I18n.t("System.Pleaseselecttheproducttoprint!"))
      return
    }
    let dataPrint = [...DataPrint];
    let dataPrintok = []
    dataPrint.map((item, index) => {
      for (let i = 1; i <= parseInt(Printnumber); i++) {
        dataPrintok.push({
          ProductCode: item.ProductCode
        })
      }
    })

    await setPrintdataQRCode(dataPrintok);

    $("#Printform").css("display", "block");
    $("#formaction").css("display", "none");
    $("footer").css("display", "none");
    window.print();
    $("#Printform").css("display", "none");
    $("#formaction").css("display", "block");
    $("footer").css("display", "block"); 
  }

  //#end region
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

      accessor: "ProductId",
      filterable: false,
      sortable: false,
      width: 50,
      textAlign: "center",
      special: true,
      show: true,
      Cell: (row) => (
        <div className="col-sm-12">
          <div className="icheck-success d-inline">
            <input
              type="checkbox"
              id={row.original.ProductId}
              key={row.original.ProductId}
              value={row.original.ProductId}
              checked={row.original.IsCheck}
              onChange={(e) => setdataarray({ _row: row, keys: "check" })}
            />
            <label
              className="label checkbox"
              htmlFor={row.original.ProductId}
            ></label>
          </div>
        </div>
      ),

    },

    {
      Header: I18n.t("Report.STT"),
      Cell: (row) => <span>{row.index + 1}</span>,
      width: 200,
      filterable: false,
      special: true,
      show: true,
    },


    {
      Header: I18n.t("GroupProducts.ProductCode"),
      accessor: "ProductCode",
    },
    {
      Header: I18n.t("Product.ProductName"),
      accessor: "ProductName",
      width: 450,
    },
    {
      Header: I18n.t("Product.ProductGroups"),
      accessor: "ProductGroupName",
    },
  ]);

  return (
    <div className="content-wrapper pt-2">
      <section className="content" id="formaction">
        <div className="container-fluid">
          <div className="card card-primary">
            <div className="card-header">
              <div className="row">
                <div className="col-md-6">
                  <h3 className="card-title">
                    <i className="fa fa-bars" />
                    <span className="font-weight-bold">
                      {I18n.t("System.PrintProductLabel")}
                    </span>
                  </h3>
                </div>
                <div className="col-md-6 card-header-btn">
                  <a
                    className="btn btn-success btn-sm float-right btn-header"
                    onClick={(e) => PrintQRCode(ProductCode)}
                  >
                    <i className="fa fa-print pr-1" />
                    {I18n.t("System.print")}
                  </a>
                  <a
                    className="btn btn-primary btn-sm float-right btn-header"
                    onClick={(e) => WH_spProduct_List()}
                  >
                    <i className="fa fa-eye mr-2" />
                    {I18n.t("System.View")}
                  </a>
                </div>
                <div>
                </div>
              </div>
            </div>
            <div className="card-body-form">
              <div className="row pb-12">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form__title" >{I18n.t("Product.ProductGroups")}<span className="form__title__note"></span></label>
                    <SelectProductGroup
                      onSelected={e => setProductsGroup(e.value)}
                      items={ProductsGroup.value}

                    />
                  </div>
                </div>
                <div className="col-md-6 col-sm-6">
                  <div className="form-group">
                    <label className="form__title">
                      Print number
                      <span className="form__title__note"> (*) </span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder=""
                      onChange={e => setPrintnumber(e.target.value)}
                      value={Printnumber}
                    />
                  </div>
                </div>

              </div>
            </div>
            <div className={DataProduct.length > 0 ? "" : "display-none"}>
              <SettingColumn
                columns={columns}
                Returndata={(a) => setcolumns(a)}
              />
              <DataTable data={DataProduct} columns={columns} />
            </div>
          </div>
        </div>
      </section>
      <div id="Printform" className=" content-wrapper pt-2 text-center " style={{ width: "100%", display: "none" }}>

        {
          PrintdataQRCode.map((item, index) => {
            return (
              <div className="col-md-12" style={{
                height: '430px',
                marginTop: (((index + 1) + 2) % 3) === 0  || (index + 1) ===1 ? '0px' : '80px',
                padding: (((index + 1) + 2) % 3) === 0  || (index + 1) ===1 ? '10px 65px 65px 65px' : '65px 65px 65px 65px',
                pageBreakAfter: ((index + 1) % 3) === 0 ? 'always' : '',
              }}>
                <div >
                  <QRCodeSVG
                    id={item.ProductCode + 'view'}
                    value={item.ProductCode}
                    size={300}
                  />
                  <h3 className="col-md-12" style={{ textAlign: "center", marginTop: '2px' }}>{item.ProductCode}</h3>

                </div>

              </div>
           /*    <div style={{ marginTop: index !== 0 ? '30px' : '' }}>
                <table style={{ width: "100%", height: "40px" }} cellspacing="0" cellpadding="5">
                  <tr>

                    <td style={{ width: "50%", textAlign: "center" }}>
                      <img src="../../assets/img/LogoNetco.png" style={{ height: "60px" }} />
                    </td>

                  </tr>
                </table>

                <QRCodeSVG
                  id={item.ProductCode + 'view'}
                  value={item.ProductCode}
                  size={600}
                />
                <h1>{item.ProductCode} </h1>
              </div> */
            )
          })
        }
      </div>
    </div>
  )
};