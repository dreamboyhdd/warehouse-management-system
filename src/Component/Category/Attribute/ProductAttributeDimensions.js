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

export const ProductAttributeDimensions = () => {
  //#regon begin using the effect hook
  useEffect(() => { }, []);
  //#end regon

  //#region set variable
  const dispatch = useDispatch();
  const [Title, setTitle] = useState("Thêm mới kích thước");
  const [SizeId, setSizeId] = useState(0);
  const [SizeCode, setSizeCode] = useState("");
  const [SizeName, setSizeName] = useState("");
  const [Length, setLength] = useState("");
  const [Width, setWidth] = useState("");
  const [Height, setHeight] = useState("");
  const [Weight, setWeight] = useState("");
  const [Description, setDescription] = useState("");
  const [TotalSize, setTotalSize] = useState("");
  const [DataSize, setDataSize] = useState([]);
  const [disable, setDisable] = useState(true);
  const [SelectSize, setSelectSize] = useState("");
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
      CheckOne(dataarray._row.original.SizeId, dataarray._row.original.IsCheck);
    } else if (dataarray.keys === 'delete') {
      WH_spProduct_Attribute_Size_Delete(dataarray._row.value, 1);
    } else if (dataarray.keys === 'checkall') {
      CheckOne(0, Checkall)
    }
  }, [dataarray]);

  // Begin save and edit
  const WH_spProduct_Attribute_Size_Save = async () => {
    try {
      if (SizeCode === "") {
        Alertwarning("Vui lòng nhập mã kích thước");
        return;
      }
      if (SizeName === "") {
        Alertwarning("Vui lòng nhập tên kích thước");
        return;
      }
      setDisable(false);
      const pr = {
        SizeId: SizeId,
        SizeCode: SizeCode.trim(),
        SizeName: SizeName.trim(),
        Length: Length,
        Width: Width,
        Height: Height,
        Weight: Weight,
        Description: Description.toString().replaceAll('"', "'").trim(),
        CreateId: Accountinfor.AccountId,
        CreateName: Accountinfor.AccountName,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "WH_spProduct_Attribute_Size_Save",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        WH_spProduct_Attribute_Size_Cancel();
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
  const WH_spProduct_Attribute_Size_List = async () => {
    try {
      const params = {
        Json: JSON.stringify({
          SizeId: 0,
          CreateId: Accountinfor.AccountId,
          CreateName: Accountinfor.AccountName,
        }),
        func: "WH_spProduct_Attribute_Size_List",
      };
      const list = await mainAction.API_spCallServer(params, dispatch);
      if (list.length > 0) {
        setDataSize(list);
      } else {
        Alertwarning("Không có dữ liệu!");
        setDataSize([]);
      }
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#end region

  //#region total
  const WH_spProduct_Attribute_Size_Total = async () => {
    try {
      const params = {
        Json: JSON.stringify({
          SizeId: 0,
          CreateId: Accountinfor.AccountId,
          CreateName: Accountinfor.AccountName,
        }),
        func: "WH_spProduct_Attribute_Size_Total",
      };
      const list = await mainAction.API_spCallServer(params, dispatch);
      setTotalSize(list[0].Total);
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#end region

  //#region search
  const WH_spProduct_Attribute_Size_Search = async (Code) => {
    setSelectSize(Code.target.value);
    setIsAcctive(false);
    if (Code.target.value.length < 4) {
      setDataSearch([]);
      return;
    } else {
      const params = {
        Json: JSON.stringify({
          SearchCode: Code.target.value,
        }),
        func: "WH_spProduct_Attribute_Size_Search",
      };
      try {
        const result = await mainAction.API_spCallServer(params, dispatch);
        if (result.length > 0) {
          setDataSearch(result);
          setIsAcctive(true);
        }
      } catch (error) {
        Alertwarning(I18n.t("Report.NoData"));
      }
    }
  };
  //#end region

  const onSelecteSize = (item) => {
    if (DataSize.find((e) => e.SizeId === item.SizeId)) {
      Alertwarning("Kích thước này đã được hiện");
      return;
    }
    let ar = DataSearch.filter((a) => a.SizeId === item.SizeId);
    let _arr = [...DataSize, ...ar]; //use filter to push ar like this
    setDataSize(_arr);
  };
  const CheckOne = (Id, Check) => {
    let _DataList = [...DataSize]
    if (Id == 0) {
      _DataList.forEach(i => { i.IsCheck = !Checkall })
      setCheckall(!Checkall)
    } else {
      if (Check === undefined)
        Check = false;
      _DataList.find((p) => p.SizeId == Id).IsCheck = !Check;
    }
    setDataSize(_DataList);
  };

  //#region delete
  const WH_spProduct_Attribute_Size_Delete = (id, key) => {
    let check = DataSize.filter((a) => a.IsCheck === true);
    if (id === 0 && check.length === 0) {
      Alertwarning("Vui lòng chọn để xóa!");
      return;
    }
    try {
      ConfirmAlert("", "Bạn có chắc muốn xóa?", async () => {
        const ar = [];
        if (key === 1) {
          ar.push({
            SizeId: id,
            AccountId: Accountinfor.AccountId,
            AccountName: Accountinfor.AccountName,
          });
        }
        if (key === 2) {
          let data = DataSize.filter((a) => a.IsCheck === true);
          data.forEach((element) => {
            ar.push({
              SizeId: element.SizeId,
              AccountId: Accountinfor.AccountId,
              AccountName: Accountinfor.AccountName,
            });
          });
        }
        const params = {
          Json: JSON.stringify({ ListId: ar }),
          func: "WH_spProduct_Attribute_Size_Delete",
        };
        const result = await mainAction.API_spCallServer(params, dispatch);
        if (result.Status === "OK") {
          if (key === 1) {
            setDataSize(DataSize.filter(a => a.SizeId !== id))
          }
          if (key === 2) {
            setDataSize(DataSize.filter(a => a.IsCheck !== true))
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
  const WH_spProduct_Attribute_Size_Edit = (item) => {
    setTitle("Sửa kích thước");
    const data = item.row._original;
    try {
      setSizeId(data.SizeId);
      setSizeCode(data.SizeCode);
      setSizeName(data.SizeName);
      setLength(data.Length);
      setWidth(data.Width);
      setHeight(data.Height);
      setWeight(data.Weight);
      setDescription(data.Description);
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#end region

  //#region click add new
  const clickAddNew = () => {
    setTitle("Thêm mới kích thước");
    WH_spProduct_Attribute_Size_Cancel();
  };
  //#end region

  //#region load list
  const clickLoadList = () => {
    try {
      WH_spProduct_Attribute_Size_List();
      WH_spProduct_Attribute_Size_Total();
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#end region

  //#region begin clear, cancel from
  const WH_spProduct_Attribute_Size_Cancel = () => {
    setSizeId("");
    setSizeCode("");
    setSizeName("");
    setLength("");
    setWidth("");
    setHeight("");
    setWeight("");
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
      accessor: "SizeId",
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
              id={row.original.SizeId}
              key={row.original.SizeId}
              value={row.original.SizeId}
              checked={row.original.IsCheck}
              onChange={(e) => setdataarray({ _row: row, keys: "check" })}
            />
            <label
              className="label checkbox"
              htmlFor={row.original.SizeId}
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
      accessor: "SizeId",
      special: true,
      show: true,
      Cell: (row) => (
        <span>
          <button
            data-tooltip="Sửa"
            className="btn btn-sm btn-success mr-2 show__tip__left"
            data-toggle="modal"
            data-target="#myModal1"
            onClick={(e) => WH_spProduct_Attribute_Size_Edit(row)}
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
      special: true,
      show: true,
    },
    {
      Header: "Mã kích thước",
      accessor: "SizeCode",
    },
    {
      Header: "Tên kích thước",
      accessor: "SizeName",
    },
    {
      Header: "Chiều dài",
      accessor: "Length",
    },
    {
      Header: "Chiều rộng",
      accessor: "Width",
    },
    {
      Header: "Chiều cao",
      accessor: "Height",
    },
    {
      Header: "Khối lượng",
      accessor: "Weight",
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
    if (DataSize.length === 0) {
      Alertwarning("Chưa có dữ liệu xuất excel");
      return;
    }
    const newData = DataSize.map((element) => {
      return {
        "Mã kích thước": element.SizeCode,
        "Tên kích thước": element.SizeName,
        "Chiều dài": element.Length,
        "Chiều rộng": element.Width,
        "Chiều cao": element.Height,
        "Khối lượng": element.Weight,
        "Người tạo": element.CreateName,
        "Ngày tạo": FormatDateJson(element.CreateTime),
        "Người sửa": element.EditName,
        "Ngày sửa": FormatDateJson(element.EditTime),
        "Ghi chú": element.Description,
      };
    });
    newData.forEach(function (x) {
      if (columns.find((a) => a.accessor == "SizeCode") === undefined) {
        delete x["Mã kích thước"];
      } else if (
        columns.find((a) => a.accessor === "SizeCode").show === false
      ) {
        delete x["Mã kích thước"];
      }
      if (columns.find((a) => a.accessor == "SizeName") === undefined) {
        delete x["Tên kích thước"];
      } else if (
        columns.find((a) => a.accessor === "SizeName").show === false
      ) {
        delete x["Tên kích thước"];
      }
      if (columns.find((a) => a.accessor == "Length") === undefined) {
        delete x["Chiều dài"];
      } else if (columns.find((a) => a.accessor === "Length").show === false) {
        delete x["Chiều dài"];
      }
      if (columns.find((a) => a.accessor == "Width") === undefined) {
        delete x["Chiều rộng"];
      } else if (columns.find((a) => a.accessor === "Width").show === false) {
        delete x["Chiều rộng"];
      }
      if (columns.find((a) => a.accessor == "Height") === undefined) {
        delete x["Chiều cao"];
      } else if (columns.find((a) => a.accessor === "Height").show === false) {
        delete x["Chiều cao"];
      }
      if (columns.find((a) => a.accessor == "Weight") === undefined) {
        delete x["Khối lượng"];
      } else if (columns.find((a) => a.accessor === "Weight").show === false) {
        delete x["Khối lượng"];
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
    ExportExcel(newData, "Danh sach thuoc tinh kich thuoc");
  };

  const HtmlPopup1 = (
    <div className="container">
      <div className="modal fade" id="myModal1" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content width_height100">
            <div class="modal-header">
              <div className="row edit__user__header">
                <h4 className="">
                  <i class="fa-solid fa-ruler-combined mr-2"></i>
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
                      Mã kích thước{" "}
                      <span className="form__title__note">(*)</span>
                    </label>
                    <input
                      onChange={(e) => setSizeCode(e.target.value)}
                      value={SizeCode}
                      type="text"
                      className="form-control"
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="col-md-6 col-sm-12">
                  <div className="form-group">
                    <label className="form__title">
                      Tên kích thước{" "}
                      <span className="form__title__note">(*)</span>
                    </label>
                    <input
                      onChange={(e) => setSizeName(e.target.value)}
                      value={SizeName}
                      type="text"
                      className="form-control"
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="col-md-6 col-sm-12">
                  <div className="form-group">
                    <label className="form__title">Chiều dài </label>
                    <input
                      onChange={(e) => setLength(e.target.value)}
                      value={Length}
                      type="number"
                      className="form-control"
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="col-md-6 col-sm-12">
                  <div className="form-group">
                    <label className="form__title">Chiều rộng </label>
                    <input
                      onChange={(e) => setWidth(e.target.value)}
                      value={Width}
                      type="number"
                      className="form-control"
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="col-md-6 col-sm-12">
                  <div className="form-group">
                    <label className="form__title">Chiều cao </label>
                    <input
                      onChange={(e) => setHeight(e.target.value)}
                      value={Height}
                      type="number"
                      className="form-control"
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="col-md-6 col-sm-12">
                  <div className="form-group">
                    <label className="form__title">Khối lượng </label>
                    <input
                      onChange={(e) => setWeight(e.target.value)}
                      value={Weight}
                      type="number"
                      className="form-control"
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="col-md-12">
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
              </div>
            </div>
            <div className="modal-footer">
              <div className="row">
                <button
                  disabled={!disable}
                  type="button"
                  className=" btn btn__save__w95h40 pull-right"
                  onClick={WH_spProduct_Attribute_Size_Save}
                >
                  Lưu
                </button>
                <button
                  type="button"
                  className=" btn btn__cancel__w95h40 pull-right margin-left-5"
                  onClick={WH_spProduct_Attribute_Size_Cancel}
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
                      {I18n.t("Product.ProductAttributes")} ({DataSize.length})
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
                    onClick={(e) => WH_spProduct_Attribute_Size_Delete(0, 2)}
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
                    <div className="card__h70w125 BG-CB6829 card__active__shadow">
                      <p className="card__active">Kích thước</p>
                      <p className="card__active">{TotalSize}</p>
                    </div>
                  </Link>
                  <Link to="/thiet-lap-don-vi-tinh">
                    <div className="card__h70w125 BG-FFF5E7">
                      <p>Đơn vị tính</p>
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
                      placeholder="Tìm kiếm mã kích thước, tên kích thước"
                      value={SelectSize}
                      onChange={(e) => WH_spProduct_Attribute_Size_Search(e)}
                    />
                    <div className={IsAcctive === false ? "display-none" : ""}>
                      <div className="col-md-12 col-sm-12 col-xs-12 div-sender">
                        {DataSearch.map((item, index) => {
                          return (
                            <div
                              className="select-option-like"
                              key={index}
                              value={SelectSize}
                              onClick={(e) => onSelecteSize(item)}
                            >
                              {item.SizeName}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Begin Size List */}

            <div className={DataSize.length > 0 ? "" : "display-none"}>
              <SettingColumn
                columns={columns}
                Returndata={(a) => setcolumns(a)}
              />
              <DataTable data={DataSize} columns={columns} />
            </div>
            {/* Begin Size List */}
          </div>
          {/* Begin Modal Form */}
          {HtmlPopup1}
          {/* End Modal Form */}
        </div>
      </section>
    </div>
  );
};
