import React, { useState, useEffect } from "react";
import I18n from "../../../Language";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../Redux/Actions";
import { Link } from "react-router-dom";
import { DataTable } from "../../../Common/DataTable";
import {
  Alertsuccess,
  Alertwarning,
  FormatDateJson,
  ExportExcel,
  ConfirmAlert
} from "../../../Utils";
import { SettingColumn } from "../../../Common";

export const ProductAttributeColors = () => {
  //#regon begin using the effect hook
  useEffect(() => { }, []);
  //#end regon
  let datapermisstion = localStorage.getItem("Permissioninfor");//check quyền
  //#region set variable
  const dispatch = useDispatch();
  const [Title, setTitle] = useState("Thêm mới màu");
  const [ColorId, setColorId] = useState(0);
  const [ColorCode, setColorCode] = useState("");
  const [ColorName, setColorName] = useState("");
  const [Description, setDescription] = useState("");
  const [TotalColor, setTotalColor] = useState("");
  const [DataColor, setDataColor] = useState([]);
  const [disable, setDisable] = useState(true);
  const [SelectColor, setSelectColor] = useState("");
  const [IsAcctive, setIsAcctive] = useState(false);
  const [DataSearch, setDataSearch] = useState([]);
  const [dataarray, setdataarray] = useState("");
  const [Checkall, setCheckall] = useState(false);
  const Accountinfor = JSON.parse(
    localStorage.getItem("Accountinfor") === ""
      ? "{}"
      : localStorage.getItem("Accountinfor")
  );

  useEffect(() => {
    if (dataarray.keys === "check") {
      CheckOne(dataarray._row.original.ColorId, dataarray._row.original.IsCheck);
    } else if (dataarray.keys === 'delete') {
      WH_spProduct_Attribute_Color_Delete(dataarray._row.value, 1);
    } else if (dataarray.keys === 'checkall') {
      CheckOne(0, Checkall)
    }
  }, [dataarray]);

  // Begin save and edit
  const WH_spProduct_Attribute_Color_Save = async () => {
    //kiem tra quyen luu
    if (datapermisstion !== "") {
      let a = JSON.parse(datapermisstion);
      let b = a.find(p => p.WH_tblMenuModuleId === 59 && p.Adds === 'C')
      if (b === undefined) {
        Alertwarning(I18n.t("validate.Youdonothavepermissiontocreateproductattributes!"));
        return;
      }
    }

    try {
      if (ColorCode === "") {
        Alertwarning(I18n.t("validate.Pleaseentercolorcode"));
        return;
      }
      if (ColorName === "") {
        Alertwarning(I18n.t("validate.Pleaseentercolorname"));
        return;
      }
      setDisable(false);
      const pr = {
        ColorId: ColorId,
        ColorCode: ColorCode.trim(),
        ColorName: ColorName.trim(),
        Description: Description.toString().replaceAll('"', "'").trim(),
        CreateId: Accountinfor.AccountId,
        CreateName: Accountinfor.AccountName,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "WH_spProduct_Attribute_Color_Save",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        clickLoadList();
        setDisable(true);
        document.getElementById("close_modal").click();
        return;
      }
      if (result.Status === "NO") {
        Alertwarning(result.ReturnMess);
        setDisable(true);
        return;
      }
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
      setDisable(false);
    }
  };
  //#end region

  //#region render list
  const WH_spProduct_Attribute_Color_List = async () => {
    //kiem tra quyen xem
    if (datapermisstion !== "") {
      let a = JSON.parse(datapermisstion);
      let b = a.find(p => p.WH_tblMenuModuleId === 59 && p.Views === 'C')
      if (b === undefined) {
        Alertwarning(I18n.t("validate.Youdonothavepermissiontoviewproductattributes!"));
        return;
      }
    }

    try {
      const params = {
        Json: JSON.stringify({
          ColorId: 0,
          CreateId: Accountinfor.AccountId,
          CreateName: Accountinfor.AccountName,
        }),
        func: "WH_spProduct_Attribute_Color_List",
      };
      const list = await mainAction.API_spCallServer(params, dispatch);
      setDataColor(list);
      if (list.length > 0) {
        setDataColor(list);
      } else {
        Alertwarning(I18n.t("Report.NoData"));
        setDataColor([]);
      }
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#end region

  //#region total
  const WH_spProduct_Attribute_Color_Total = async () => {
    try {
      const params = {
        Json: JSON.stringify({
          ColorId: 0,
          CreateId: Accountinfor.AccountId,
          CreateName: Accountinfor.AccountName,
        }),
        func: "WH_spProduct_Attribute_Color_Total",
      };
      const list = await mainAction.API_spCallServer(params, dispatch);
      setTotalColor(list[0].Total);
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#end region

  //#region search
  const WH_spProduct_Attribute_Color_Search = async (Code) => {
    setSelectColor(Code.target.value);
    setIsAcctive(false);
    if (Code.target.value.length < 4) {
      setDataSearch([]);
      return;
    } else {
      const params = {
        Json: JSON.stringify({
          SearchCode: Code.target.value,
        }),
        func: "WH_spProduct_Attribute_Color_Search",
      };
      try {
        const result = await mainAction.API_spCallServer(params, dispatch);
        if (result.length > 0) {
          setDataSearch(result);
          setIsAcctive(true);
        }
      } catch (e) {
        Alertwarning(I18n.t("Report.NoData"));
      }
    }
  };
  //#end region

  const onSelecteColor = (item) => {
    if (DataColor.find((e) => e.ColorId === item.ColorId)) {
      Alertwarning("Màu này đã được hiện");
      return;
    }
    let ar = DataSearch.filter((a) => a.ColorId === item.ColorId);
    let _arr = [...DataColor, ...ar]; //use filter to push ar like this
    setDataColor(_arr);
  };

  const CheckOne = (Id, Check) => {
    let _DataList = [...DataColor]
    if (Id == 0) {
      _DataList.forEach(i => { i.IsCheck = !Checkall })
      setCheckall(!Checkall)
    } else {
      if (Check === undefined)
        Check = false;
      _DataList.find((p) => p.ColorId == Id).IsCheck = !Check;
    }
    setDataColor(_DataList);
  };

  //#region delete
  const WH_spProduct_Attribute_Color_Delete = (id, key) => {

    //kttra quyền xóa
    if (datapermisstion !== "") {
      let a = JSON.parse(datapermisstion);
      let b = a.find(p => p.WH_tblMenuModuleId === 59 && p.Deletes === 'C')
      if (b === undefined) {
        Alertwarning(I18n.t("validate.Youdonothavepermissiontodeleteproductattributes!"));
        return;
      }

    }
    let check = DataColor.filter((a) => a.IsCheck === true);
    if (id === 0 && check.length === 0) {
      Alertwarning(I18n.t("validate.Pleasechoosetodelete!"));
      return;
    }
    try {
      ConfirmAlert("", "Are you sure you want to delete?", async () => {
        const ar = [];
        if (key === 1) {
          ar.push({
            ColorId: id,
            AccountId: Accountinfor.AccountId,
            AccountName: Accountinfor.AccountName,
          });
        }
        if (key === 2) {
          let data = DataColor.filter((a) => a.IsCheck === true);
          data.forEach((element) => {
            ar.push({
              ColorId: element.ColorId,
              AccountId: Accountinfor.AccountId,
              AccountName: Accountinfor.AccountName,
            });
          });
        }
        const params = {
          Json: JSON.stringify({ ListId: ar }),
          func: "WH_spProduct_Attribute_Color_Delete",
        };
        const result = await mainAction.API_spCallServer(params, dispatch);
        if (result.Status === "OK") {
          if (key === 1) {
            setDataColor(DataColor.filter(a => a.ColorId !== id))
          }
          if (key === 2) {
            setDataColor(DataColor.filter(a => a.IsCheck !== true))
          }
        }
        Alertsuccess(result.ReturnMess);
      })
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#end region

  //#region edit product group
  const WH_spProduct_Attribute_Color_Edit = (item) => {
    setTitle("Sửa màu");
    const data = item.row._original;
    try {
      setColorId(data.ColorId);
      setColorCode(data.ColorCode);
      setColorName(data.ColorName);
      setDescription(data.Description);
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#end region

  //#region click add new
  const clickAddNew = () => {
    setTitle(I18n.t("validate.Addnewcolor"));
    WH_spProduct_Attribute_Color_Cancel();
  };
  //#end region

  //#region load list
  const clickLoadList = () => {
    try {
      WH_spProduct_Attribute_Color_List();
      WH_spProduct_Attribute_Color_Total();
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#end region

  //#region begin clear, cancel from
  const WH_spProduct_Attribute_Color_Cancel = () => {
    setColorId("");
    setColorCode("");
    setColorName("");
    setDescription("");
  };
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
      accessor: "ColorId",
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
              id={row.original.ColorId}
              key={row.original.ColorId}
              value={row.original.ColorId}
              checked={row.original.IsCheck}
              onChange={(e) => setdataarray({ _row: row, keys: "check" })}
            />
            <label
              className="label checkbox"
              htmlFor={row.original.ColorId}
            ></label>
          </div>
        </div>
      ),
    },
    {
      Header: I18n.t("System.Option"),
      width: 180,
      filterable: false,
      sortable: false,
      accessor: "ColorId",
      special: true,
      show: true,
      Cell: (row) => (
        <span>
          <button
            data-tooltip={I18n.t("AccountGroup.Edit")}
            className="btn btn-sm btn-success mr-2 show__tip__left"
            data-toggle="modal"
            data-target="#myModal1"
            onClick={(e) => WH_spProduct_Attribute_Color_Edit(row)}
          >
            <i className="fas fa-wrench"></i>
            {/* Sửa */}
          </button>
          <button
            data-tooltip={I18n.t("AccountGroup.Delete")}
            className="btn btn-sm btn-danger show__tip__right"
            onClick={(e) => setdataarray({ _row: row, keys: "delete" })}
          >
            <i className="fa fa-trash"></i>
            {/* Xóa */}
          </button>
        </span>
      ),
    },
    {
      Header: I18n.t("Report.STT"),
      Cell: (row) => <span>{row.index + 1}</span>,
      width: 50,
      filterable: false,
      special: true,
      show: true,
    },
    {
      Header:  I18n.t("ProductAttributeColors.Colorcode"),
      accessor: "ColorCode",
    },
    {
      Header:  I18n.t("ProductAttributeColors.Colorname"),
      accessor: "ColorName",
    },
    {
      Header: I18n.t("System.Creater"),
      accessor: "CreateName",
      width: 150,
    },
    {
      Header: I18n.t("Delivery.CreateDate"),
      accessor: "CreateTime",
      Cell: (obj) => FormatDateJson(obj.value),
      width: 180,
    },
    {
      Header: I18n.t("System.EditBy"),
      accessor: "EditName",
      width: 150,
    },
    {
      Header: I18n.t("System.EditDate"),
      accessor: "EditTime",
      Cell: (obj) => FormatDateJson(obj.value),
      width: 180,
    },
    {
      Header: I18n.t("System.Note"),
      accessor: "Description",
      width: 150,
    },
  ]);
  //#end region

  const Exportexcel = () => {
    //kiem tra quyen Excel
    if (datapermisstion !== "") {
      let a = JSON.parse(datapermisstion);
      let b = a.find(p => p.WH_tblMenuModuleId === 59 && p.Excel === 'C')
      if (b === undefined) {
        Alertwarning(I18n.t("validate.YoudonothavepermissiontoexportExcel!"));
        return;
      }
    }
    if (DataColor.length === 0) {
      Alertwarning(("validate.Noexceldatayet"));
      return;
    }
    const newData = DataColor.map((element) => {
      return {
        "Mã màu": element.ColorCode,
        "Tên màu": element.ColorName,
        "Người tạo": element.CreateName,
        "Ngày tạo": FormatDateJson(element.CreateTime),
        "Người sửa": element.EditName,
        "Ngày sửa": FormatDateJson(element.EditTime),
        "Ghi chú": element.Description,
      };
    });
    newData.forEach(function (x) {
      if (columns.find((a) => a.accessor == "ColorCode") === undefined) {
        delete x["Mã màu"];
      } else if (
        columns.find((a) => a.accessor === "ColorCode").show === false
      ) {
        delete x["Mã màu"];
      }
      if (columns.find((a) => a.accessor == "ColorName") === undefined) {
        delete x["Tên màu"];
      } else if (
        columns.find((a) => a.accessor === "ColorName").show === false
      ) {
        delete x["Tên màu"];
      }

      if (columns.find((a) => a.accessor == "CreateName") === undefined) {
        delete x["Người tạo"];
      } else if (
        columns.find((a) => a.accessor === "CreateName").show === false
      ) {
        delete x["Người tạo"];
      }
      if (columns.find((a) => a.accessor == "CreateTime") === undefined) {
        delete x["Ngày tạo"];
      } else if (
        columns.find((a) => a.accessor === "CreateTime").show === false
      ) {
        delete x["Ngày tạo"];
      }
      if (columns.find((a) => a.accessor == "EditName") === undefined) {
        delete x["Người sửa"];
      } else if (
        columns.find((a) => a.accessor === "EditName").show === false
      ) {
        delete x["Người sửa"];
      }
      if (columns.find((a) => a.accessor == "EditTime") === undefined) {
        delete x["Ngày sửa"];
      } else if (
        columns.find((a) => a.accessor === "EditTime").show === false
      ) {
        delete x["Ngày sửa"];
      }
      if (columns.find((a) => a.accessor == "Description") === undefined) {
        delete x["Ghi chú"];
      } else if (
        columns.find((a) => a.accessor === "Description").show === false
      ) {
        delete x["Ghi chú"];
      }
    });
    ExportExcel(newData, "Danh sach thuoc tinh mau");
  };

  const HtmlPopup1 = (
    <div className="container">
      <div className="modal fade" id="myModal1" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content width_height100">
            <div class="modal-header">
              <div className="row edit__user__header">
                <h4 className="">
                  <i class="fa-solid fa-palette mr-2"></i>
                  {Title}
                </h4>
                <a
                  className="btn btn__default"
                  data-dismiss="modal"
                  id="close_modal"
                >
                  <i className="fa fa-times-circle edit__close__icon" />
                </a>
              </div>
            </div>
            <div class="modal-body">
              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <div className="form-group">
                    <label className="form__title">
                    {I18n.t("ProductAttributeColors.Colorcode")}<span className="form__title__note">(*)</span>
                    </label>
                    <input
                      onChange={(e) => setColorCode(e.target.value)}
                      value={ColorCode}
                      type="text"
                      className="form-control"
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="col-md-6 col-sm-12">
                  <div className="form-group">
                    <label className="form__title">
                    {I18n.t("ProductAttributeColors.Colorname")}<span className="form__title__note">(*)</span>
                    </label>
                    <input
                      onChange={(e) => setColorName(e.target.value)}
                      value={ColorName}
                      type="text"
                      className="form-control"
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form__title">{I18n.t("AccountGroup.Describe")}</label>
                    <input
                      onChange={(e) => setDescription(e.target.value)}
                      value={Description}
                      type="text"
                      className="form-control"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="row">
                <button
                  disabled={!disable}
                  type="button"
                  className=" btn btn__save__w95h40 pull-right"
                  onClick={WH_spProduct_Attribute_Color_Save}
                >
                  {I18n.t("System.Save")}
                </button>
                <button
                  type="button"
                  className=" btn btn__cancel__w95h40 pull-right margin-left-5"
                  onClick={WH_spProduct_Attribute_Color_Cancel}
                >
                 {I18n.t("System.Cancel")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
                    <i class="fa fa-boxes" />
                    <span className="font-weight-bold">
                      {I18n.t("Product.ProductAttributes")} ({DataColor.length})
                    </span>
                  </h3>
                </div>
                <div className="col-md-6 card-header-btn">
                  <a
                    className="btn btn-warning btn-sm float-right btn-header"
                    onClick={(e) => Exportexcel()}
                  >
                    <i className="fa fa-download mr-2" />
                    {I18n.t("System.Excel")}
                  </a>
                  <a
                    className="btn btn-danger btn-sm float-right btn-header"
                    onClick={(e) => WH_spProduct_Attribute_Color_Delete(0, 2)}
                  >
                    <i className="fa fa-trash mr-2" />
                    {I18n.t("System.Delete")}
                  </a>
                  <a
                    className="btn btn-success btn-sm float-right btn-header"
                    data-toggle="modal"
                    data-target="#myModal1"
                    onClick={clickAddNew}
                  >
                    <i className="fa fa-plus mr-2" />
                    {I18n.t("System.Add")}
                  </a>
                  <a
                    className="btn btn-primary btn-sm float-right btn-header"
                    onClick={clickLoadList}
                  >
                    <i class="fa-solid fa-eye pr-1" />
                    {I18n.t("System.View")}
                  </a>
                </div>
              </div>
            </div>
            {/* Begin Account Group Card */}
            <div className="card-body">
              <div className="row padding-2rem">
                <div className="col-md-5 card__info">
                  <Link to="/thiet-lap-mau-sac">
                    <div className="card__h70w125 BG-CB6829 card__active__shadow">
                      <p className="card__active">{I18n.t("ProductAttributeColors.Color")}</p>
                      <p className="card__active">{TotalColor}</p>
                    </div>
                  </Link>
                  <Link to="/thiet-lap-kich-thuoc">
                    <div className="card__h70w125 BG-FFF5E7">
                      <p>{I18n.t("ProductAttributeColors.Size")}</p>
                      <p></p>
                    </div>
                  </Link>
                  <Link to="/thiet-lap-don-vi-tinh">
                    <div className="card__h70w125 BG-FFF5E7">
                      <p>{I18n.t("ProductAttributeColors.Unit")}</p>
                      <p></p>
                    </div>
                  </Link>
                  {/* <Link to="/product-attribute-vendors">
                                        <div className='card__h70w125 BG-FFF5E7'>
                                            <p>Nhà cung cấp</p>
                                            <p>12</p>
                                        </div>
                                    </Link> */}
                </div>
                <div className="col-md-7 search__account__group">
                  <div className="form-group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon icon-tabler icon-tabler-search"
                      width="44"
                      height="44"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="#2c3e50"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="10" cy="10" r="7" />
                      <line x1="21" y1="21" x2="15" y2="15" />
                    </svg>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={I18n.t("ProductAttributeColors.Searchcolorcode,colorname")}
                      value={SelectColor}
                      onChange={(e) => WH_spProduct_Attribute_Color_Search(e)}
                    />
                    <div className={IsAcctive === false ? "display-none" : ""}>
                      <div className="col-md-12 col-sm-12 col-xs-12 div-sender">
                        {DataSearch.map((item, index) => {
                          return (
                            <div
                              className="select-option-like"
                              key={index}
                              value={SelectColor}
                              onClick={(e) => onSelecteColor(item)}
                            >
                              {item.ColorName}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Begin Color List */}

            <div className={DataColor.length > 0 ? "" : "display-none"}>
              <SettingColumn
                columns={columns}
                Returndata={(a) => setcolumns(a)}
              />
              <DataTable data={DataColor} columns={columns} />
            </div>
            {/* Begin Color List */}
          </div>
          {/* Begin Modal Form */}
          {HtmlPopup1}
          {/* End Modal Form */}
        </div>
      </section>
    </div>
  );
};
