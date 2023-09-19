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

export const ProductAttributeUnits = () => {
  //#regon begin using the effect hook
  useEffect(() => { }, []);
  //#end regon

  //#region set variable
  const dispatch = useDispatch();
  const [Title, setTitle] = useState("Thêm mới đơn vị tính");
  const [UnitId, setUnitId] = useState(0);
  const [UnitName, setUnitName] = useState("");
  const [NumberConversion, setNumberConversion] = useState("");
  const [Description, setDescription] = useState("");
  const [TotalUnit, setTotalUnit] = useState("");
  const [Length, setLength] = useState("");
  const [Width, setWidth] = useState("");
  const [Height, setHeight] = useState("");
  const [Mass, setMass] = useState("");
  const [DataUnit, setDataUnit] = useState([]);
  const [disable, setDisable] = useState(true);
  const [SelectUnit, setSelectUnit] = useState("");
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
      CheckOne(dataarray._row.original.UnitId, dataarray._row.original.IsCheck);
    } else if (dataarray.keys === 'delete') {
      WH_spProduct_Attribute_Unit_Delete(dataarray._row, 1);
    } else if (dataarray.keys === 'checkall') {
      CheckOne(0, Checkall)
    } else if (dataarray.keys === 'edit') {
      WH_spProduct_Attribute_Unit_Edit(dataarray._row);
    }
  }, [dataarray]);

  // Begin save and edit
  const WH_spProduct_Attribute_Unit_Save = async () => {
    try {
      if (UnitName === "") {
        Alertwarning("Vui lòng nhập tên đơn vị tính");
        return;
      }
      debugger
      setDisable(false);
      const pr = {
        UnitId: UnitId,
        UnitName: UnitName.trim(),
        NumberConversion: NumberConversion,
        Description: Description === undefined ?'': Description.toString().replaceAll('"', "'").trim(),
        CreateId: Accountinfor.AccountId,
        CreateName: Accountinfor.AccountName,
        Length: Length,
        Width: Width,
        Height: Height,
        Mass: Mass
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "WH_spProduct_Attribute_Unit_Save",
      };
      debugger
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        WH_spProduct_Attribute_Unit_Cancel();
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
  const WH_spProduct_Attribute_Unit_List = async () => {
    try {
      const params = {
        Json: JSON.stringify({
          UnitId: 0,
          CreateId: Accountinfor.AccountId,
          CreateName: Accountinfor.AccountName,
        }),
        func: "WH_spProduct_Attribute_Unit_List",
      };
      const list = await mainAction.API_spCallServer(params, dispatch);
      if (list.length > 0) {
        setDataUnit(list);
      } else {
        Alertwarning("Không có dữ liệu!");
        setDataUnit([]);
      }
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#end region

  //#region total
  const WH_spProduct_Attribute_Unit_Total = async () => {
    try {
      const params = {
        Json: JSON.stringify({
          UnitId: 0,
          CreateId: Accountinfor.AccountId,
          CreateName: Accountinfor.AccountName,
        }),
        func: "WH_spProduct_Attribute_Unit_Total",
      };
      const list = await mainAction.API_spCallServer(params, dispatch);
      setTotalUnit(list[0].Total);
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#end region

  //#region search
  const WH_spProduct_Attribute_Unit_Search = async (Code) => {
    setSelectUnit(Code.target.value);
    setIsAcctive(false);
    if (Code.target.value.length < 4) {
      setDataSearch([]);
      return;
    } else {
      const params = {
        Json: JSON.stringify({
          SearchCode: Code.target.value,
        }),
        func: "WH_spProduct_Attribute_Unit_Search",
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

  const onSelecteUnit = (item) => {
    if (DataUnit.find((e) => e.UnitId === item.UnitId)) {
      Alertwarning("Đơn vị tính này đã được hiện");
      return;
    }
    let ar = DataSearch.filter((a) => a.UnitId === item.UnitId);
    let _arr = [...DataUnit, ...ar]; //use filter to push ar like this
    setDataUnit(_arr);
  };

  const CheckOne = (Id, Check) => {
    let _DataList = [...DataUnit]
    if (Id == 0) {
      _DataList.forEach(i => { i.IsCheck = !Checkall })
      setCheckall(!Checkall)
    } else {
      if (Check === undefined)
        Check = false;
      _DataList.find((p) => p.UnitId == Id).IsCheck = !Check;
    }
    setDataUnit(_DataList);
  };

  //#region delete
  const WH_spProduct_Attribute_Unit_Delete = (id, key) => {
    let check = DataUnit.filter((a) => a.IsCheck === true);
    if (id === 0 && check.length === 0) {
      Alertwarning("Vui lòng chọn để xóa!");
      return;
    }
    try {
      ConfirmAlert("", "Bạn có chắc muốn xóa?", async () => {
        const ar = [];
        if (key === 1) {
          ar.push({
            UnitId: id.original.UnitId,
            AccountId: Accountinfor.AccountId,
            AccountName: Accountinfor.AccountName,
          });
        }
        if (key === 2) {
          let data = DataUnit.filter((a) => a.IsCheck === true);
          data.forEach((element) => {
            ar.push({
              UnitId: element.UnitId,
              AccountId: Accountinfor.AccountId,
              AccountName: Accountinfor.AccountName,
            });
          });
        }
        const params = {
          Json: JSON.stringify({ ListId: ar }),
          func: "WH_spProduct_Attribute_Unit_Delete",
        };
        const result = await mainAction.API_spCallServer(params, dispatch);
        if (result.Status === "OK") {
          if (key === 1) {
            setDataUnit(DataUnit.filter(a => a.UnitId !== id))
          }
          if (key === 2) {
            setDataUnit(DataUnit.filter(a => a.IsCheck !== true))
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
  const WH_spProduct_Attribute_Unit_Edit = (item) => {
    debugger
    setTitle("Sửa đơn vị tính");
    const data = item.row._original;
    try {
      setUnitId(data.UnitId);
      setUnitName(data.UnitName);
      setNumberConversion(data.NumberConversion);
      setDescription(data.Description);
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#end region

  //#region click add new
  const clickAddNew = () => {
    setTitle("Thêm mới đơn vị tính");
    WH_spProduct_Attribute_Unit_Cancel();
  };
  //#end region

  //#region load list
  const clickLoadList = () => {
    try {
      WH_spProduct_Attribute_Unit_List();
      WH_spProduct_Attribute_Unit_Total();
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#end region

  //#region begin clear, cancel from
  const WH_spProduct_Attribute_Unit_Cancel = () => {
    setUnitId("");
    setUnitName("");
    setNumberConversion("");
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
      accessor: "UnitId",
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
              id={row.original.UnitId}
              key={row.original.UnitId}
              value={row.original.UnitId}
              checked={row.original.IsCheck}
              onChange={(e) => setdataarray({ _row: row, keys: "check" })}
            />
            <label
              className="label checkbox"
              htmlFor={row.original.UnitId}
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
      accessor: "UnitId",
      Cell: (row) => (
        <span>
          <button
            data-tooltip="Sửa"
            className="btn btn-sm btn-success mr-2 show__tip__left"
            data-toggle="modal"
            data-target="#myModal1"
            onClick={(e) => setdataarray({ _row: row, keys: "edit" })}
          >
            <i className="fas fa-wrench"></i>
            {/* Sửa */}
          </button>
          <button
            data-tooltip="Xoá"
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
    },
    {
      Header: "Mã đơn vị",
      accessor: "UnitCode",
    },
    {
      Header: "Tên đơn vị tính",
      accessor: "UnitName",
    },
    {
      Header: "Số lượng quy đổi",
      accessor: "NumberConversion",
    },
    {
      Header: "Dài",
      accessor: "Length",
    },
    {
      Header: "Rộng",
      accessor: "Width",
    },
    {
      Header: "Cao",
      accessor: "Height",
    },
    {
      Header: "Kích thước",
      accessor: "Mass",
    },
    {
      Header: I18n.t("System.Creater"),
      accessor: "CreateName",
      width: 150,
    },
    {
      Header: "Ngày tạo",
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
    if (DataUnit.length === 0) {
      Alertwarning("Chưa có dữ liệu xuất excel");
      return;
    }
    const newData = DataUnit.map((element) => {
      return {
        "Tên kích đơn vị tính": element.UnitName,
        "Người tạo": element.CreateName,
        "Ngày tạo": FormatDateJson(element.CreateTime),
        "Người sửa": element.EditName,
        "Ngày sửa": FormatDateJson(element.EditTime),
        "Ghi chú": element.Description,
      };
    });
    newData.forEach(function (x) {
      if (columns.find((a) => a.accessor == "UnitName") === undefined) {
        delete x["Tên kích đơn vị tính"];
      } else if (
        columns.find((a) => a.accessor === "UnitName").show === false
      ) {
        delete x["Tên kích đơn vị tính"];
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
    ExportExcel(newData, "Danh sach thuoc tinh don vi tinh");
  };

  const HtmlPopup1 = (
    <div className="container">
      <div className="modal fade" id="myModal1" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content width_height100">
            <div class="modal-header">
              <div className="row edit__user__header">
                <h4 className="">
                  <i class="fa-solid fa-layer-group mr-2"></i>
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
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label className="form__title">
                      Tên đơn vị <span className="form__title__note">(*)</span>
                    </label>
                    <input
                      onChange={(e) => setUnitName(e.target.value)}
                      value={UnitName}
                      type="text"
                      className="form-control"
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label className="form__title">
                      Đơn vị quy đổi <span className="form__title__note">(*)</span>
                    </label>
                    <input
                      onChange={(e) => setNumberConversion(e.target.value)}
                      value={NumberConversion}
                      type="text"
                      className="form-control"
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label className="form__title">Mô tả </label>

                    <input
                      onChange={(e) => setDescription(e.target.value)}
                      value={Description}
                      type="text"
                      className="form-control"
                      placeholder=""
                    />
                  </div>
                </div>

                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label className="form__title">Dài </label>

                    <input
                      onChange={(e) => setLength(e.target.value)}
                      value={Length}
                      type="text"
                      className="form-control"
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label className="form__title">Rộng </label>

                    <input
                      onChange={(e) => setWidth(e.target.value)}
                      value={Width}
                      type="text"
                      className="form-control"
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label className="form__title">Cao </label>
                    <input
                      onChange={(e) => {
                        setHeight(e.target.value)
                        setMass(Length * Width * e.target.value)
                      }}
                      value={Height}
                      type="text"
                      className="form-control"
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label className="form__title">Kích thước </label>

                    <input
                      value={Mass}
                      type="text"
                      className="form-control"
                      placeholder=""
                      disabled
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
                  onClick={WH_spProduct_Attribute_Unit_Save}
                >
                  Lưu
                </button>
                <button
                  type="button"
                  className=" btn btn__cancel__w95h40 pull-right margin-left-5"
                  onClick={WH_spProduct_Attribute_Unit_Cancel}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const Tolink = (key) => {
    if (key === 1) {
      window.location = "https://erp-wms.vps.vn/thiet-lap-mau-sac?id=105";
    } if (key === 2) {
      window.location = "https://erp-wms.vps.vn/thiet-lap-kich-thuoc?id=106";
    }
    if (key === 3) {
      window.location = "https://erp-wms.vps.vn/thiet-lap-don-vi-tinh?id=59";
    }
  }
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
                      {I18n.t("Product.ProductAttributes")} ({DataUnit.length})
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
                    onClick={(e) => WH_spProduct_Attribute_Unit_Delete(0, 2)}
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
                    <div className="card__h70w125 BG-FFF5E7">
                      <p>Màu sắc</p>
                      <p></p>
                    </div>
                  </Link>
                  <Link to="/thiet-lap-kich-thuoc">
                    <div className="card__h70w125 BG-FFF5E7">
                      <p>Kích thước</p>
                      <p></p>
                    </div>
                  </Link>
                  <Link to="/thiet-lap-don-vi-tinh">
                    <div className="card__h70w125 BG-CB6829 card__active__shadow">
                      <p className="card__active">Đơn vị tính</p>
                      <p className="card__active">{TotalUnit}</p>
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
                      placeholder="Tìm kiếm tên đơn vị"
                      value={SelectUnit}
                      onChange={(e) => WH_spProduct_Attribute_Unit_Search(e)}
                    />
                    <div className={IsAcctive === false ? "display-none" : ""}>
                      <div className="col-md-12 col-sm-12 col-xs-12 div-sender">
                        {DataSearch.map((item, index) => {
                          return (
                            <div
                              className="select-option-like"
                              key={index}
                              value={SelectUnit}
                              onClick={(e) => onSelecteUnit(item)}
                            >
                              {item.UnitName}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Begin Unit List */}

            <div className={DataUnit.length > 0 ? "" : "display-none"}>
              <SettingColumn
                columns={columns}
                Returndata={(a) => setcolumns(a)}
              />
              <DataTable data={DataUnit} columns={columns} />
            </div>
            {/* Begin Unit List */}
          </div>
          {/* Begin Modal Form */}
          {HtmlPopup1}
          {/* End Modal Form */}
        </div>
      </section>
    </div>
  );
};
