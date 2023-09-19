import React, { useState, useEffect } from "react";
import I18n from "../../../Language";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../Redux/Actions";
import { DataTable } from "../../../Common/DataTable";
import {
  Alertsuccess,
  Alertwarning,
  FormatDate,
  FormatDateJson,
  ExportExcel,
  ConfirmAlert
} from "../../../Utils";
import { SettingColumn } from "../../../Common";

export const GroupProducts = () => {
  //#regon begin using the effect hook
  useEffect(() => { }, []);
  //#end regon
  let datapermisstion =  localStorage.getItem("Permissioninfor");//check quyền
  //#region set variable
  const dispatch = useDispatch();
  const [Title, setTitle] = useState(I18n.t("validate.Addanewproductgroup"));
  const [ProductsGroupId, setProductsGroupId] = useState(0);
  const [Images, setImages] = useState("");
  const [FileUpload, setFileUpload] = useState({});
  const [ProductGroupCode, setProductGroupCode] = useState("");
  const [ProductGroupName, setProductGroupName] = useState("");
  const [Description, setDescription] = useState("");
  const [DataProductGroup, setDataProductGroup] = useState([]);
  const [DataProductDetail, setDataProductDetail] = useState([]);
  const [TotalProduct, setTotalProduct] = useState("");
  const [TotalProductGroup, setTotalProductGroup] = useState("");
  const [disable, setDisable] = useState(true);
  const [SelectProduct, setSelectProduct] = useState("");
  const [IsAcctive, setIsAcctive] = useState(false);
  const [DataSearch, setDataSearch] = useState([]);
  const [dataarray, setdataarray] = useState("");
  const [Checkall, setCheckall] = useState(false);
  const Accountinfor = JSON.parse(
    localStorage.getItem("Accountinfor") === ""
      ? "{}"
      : localStorage.getItem("Accountinfor")
  );
  //#endregion

  useEffect(() => {
    if (dataarray.keys === "check") {
      CheckOne(dataarray._row.original.ProductsGroupId, dataarray._row.original.IsCheck);
    } else if (dataarray.keys === 'delete') {
      WH_spProductGroup_Delete(dataarray._row.value, 1);
    } else if (dataarray.keys === 'checkall') {
      CheckOne(0, Checkall)
    }
  }, [dataarray]);

  //#region upload file
  const onFileChange = (event) => {
    setFileUpload(event.target.files[0]);
    setImages(URL.createObjectURL(event.target.files[0]));
  };
  //#endregion

  //#region edit product group
  const WH_spProductGroup_Edit = (item) => {
    setTitle("Sửa nhóm sản phẩm");
    const data = item.row._original;
    try {
      setProductsGroupId(data.ProductsGroupId);
      setProductGroupCode(data.ProductGroupCode);
      setProductGroupName(data.ProductGroupName);
      setDescription(data.Description);
      setImages(data.ProductGroupImage);
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#endregion

  //#region begin clear, cancel from
  const WH_spAccountGroup_Cancel = () => {
    setProductGroupCode("");
    setProductGroupName("");
    setDescription("");
    setFileUpload({});
    setImages("");
  };
  //#endregion
  //aaa

  //#region select imgs and save
  const WH_spProductGroup_Save_img = async () => {
    if (FileUpload.name !== undefined) {
      const formData = new FormData();
      formData.append("AppAPIKey", "netcoApikey2025");
      formData.append("myFile", FileUpload, FileUpload.name);
      const data = await mainAction.API_spCallPostImage(formData, dispatch);
      let _img = data.Message.replace('"', "").replace('"', "");
      var img = _img.replace("[", "").replace("]", "");

      WH_spProductGroup_Save(img);
    } else {
      WH_spProductGroup_Save(Images.slice(27));
    }
  };
  //#endregion

  // Begin save and edit product group
  const WH_spProductGroup_Save = async (img) => {
    //kiem tra quyen luu
    if(datapermisstion !== "")
    {
        let a = JSON.parse(datapermisstion);
        let b = a.find(p => p.WH_tblMenuModuleId === 58 && p.Adds === 'C') 
       if( b=== undefined)
        {
            Alertwarning(I18n.t("validate.Youdonothavetherighttocreateproducts!"));
            return;
        }
    }
    try {
      if (ProductGroupCode === "") {
        Alertwarning(I18n.t("validate.Pleaseenterproductgroupcode"));
        return;
      }
      if (ProductGroupName === "") {
        Alertwarning(I18n.t("validate.Pleaseenterproductgroupname"));
        return;
      }
      if (img === "") {
        Alertwarning(I18n.t("validate.Pleaseuploadproductgroupphotos"));
        return;
      }
      setDisable(false);
      const pr = {
        ProductsGroupId: ProductsGroupId,
        ProductGroupCode: ProductGroupCode.trim(),
        ProductGroupName: ProductGroupName.trim(),
        ProductGroupImage: img,
        Description: Description.toString().replaceAll('"', "'").trim(),
        CreateId: Accountinfor.AccountId,
        CreateName: Accountinfor.AccountName,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "WH_spProductGroup_Save",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        WH_spAccountGroup_Cancel();
        setDisable(true);
        clickLoadList();
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
  //#endregion

  //#region render list product group
  const WH_spProductGroup_List = async () => {
    //kiem tra quyen xem
    if(datapermisstion !== "")
    {
        let a = JSON.parse(datapermisstion);
        let b = a.find(p => p.WH_tblMenuModuleId === 58 && p.Views === 'C')
        if(b === undefined)
        {
            Alertwarning(I18n.t("validate.Youdonothavepermissiontoviewtheproduct!"));
            return;
        }
    }
    try {
      const params = {
        Json: JSON.stringify({
          ProductsGroupId: 0,
          CreateId: Accountinfor.AccountId,
          CreateName: Accountinfor.AccountName,
        }),
        func: "WH_spProductGroup_List",
      };
      const list = await mainAction.API_spCallServer(params, dispatch);
      if (list.length > 0) {
        setDataProductGroup(list);
        console.log(list);
      } else {
        Alertwarning(I18n.t("Report.NoData"));
        setDataProductGroup([]);
      }
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#endregion

  //#region render list product detail
  const WH_spProductGroup_Detail = async (item) => {
    setTitle(I18n.t("GroupProducts.Productgroupdetails"));
    try {
      let ProductsGroupId = item.row._original.ProductsGroupId;
      const params = {
        Json: JSON.stringify({
          ProductsGroupId: ProductsGroupId,
          CreateId: Accountinfor.AccountId,
          CreateName: Accountinfor.AccountName,
        }),
        func: "WH_spProductGroup_Detail",
      };
      const list = await mainAction.API_spCallServer(params, dispatch);
      setDataProductDetail(list);
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#endregion

  const CheckOne = (Id, Check) => {
    let _DataList = [...DataProductGroup]
    if (Id == 0) {
      _DataList.forEach(i => { i.IsCheck = !Checkall })
      setCheckall(!Checkall)
    } else {
      if (Check === undefined)
        Check = false;
      _DataList.find((p) => p.ProductsGroupId == Id).IsCheck = !Check;
    }
    setDataProductGroup(_DataList);
  };

  //#region delete product group
  const WH_spProductGroup_Delete = (id, key) => {
    
			 //kttra quyền xóa
       if(datapermisstion !== "")
       {
           let a = JSON.parse(datapermisstion);
          let b = a.find(p => p.WH_tblMenuModuleId === 58 && p.Deletes ==='C')
          if( b === undefined)
           {
               Alertwarning(I18n.t("validate.Youdonothavetherighttodeletetheproduct!"));
               return;
           }

       }
    let check = DataProductGroup.filter((a) => a.IsCheck === true);
    if (id === 0 && check.length === 0) {
      Alertwarning("Vui lòng chọn để xóa!");
      return;
    }
    try {
      ConfirmAlert("", "Are you sure you want to delete?", async () => {
        const ar = [];
        if (key === 1) {
          ar.push({
            ProductsGroupId: id,
            AccountId: Accountinfor.AccountId,
            AccountName: Accountinfor.AccountName,
          });

        }
        if (key === 2) {
          let data = DataProductGroup.filter((a) => a.IsCheck === true);
          data.forEach((element) => {
            ar.push({
              ProductsGroupId: element.ProductsGroupId,
              AccountId: Accountinfor.AccountId,
              AccountName: Accountinfor.AccountName,
            });
          });
        }
        const params = {
          Json: JSON.stringify({
            ListId: ar,
          }),
          func: "WH_spProductGroup_Delete",
        };
        const result = await mainAction.API_spCallServer(params, dispatch);
        if (result.Status === "OK") {
          if (key === 1) {
            setDataProductGroup(DataProductGroup.filter(a => a.ProductsGroupId !== id))
          }
          if (key === 2) {
            setDataProductGroup(DataProductGroup.filter(a => a.IsCheck !== true))
          }
        }
        if (result.Status === "NO") {
          Alertwarning(result.ReturnMess);
          return
        }
        Alertsuccess(result.ReturnMess);
      })
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#endregion

  //#region total product group
  const WH_spProductGroup_Total = async () => {
    try {
      const params = {
        Json: JSON.stringify({
          ProductsGroupId: 0,
          CreateId: Accountinfor.AccountId,
          CreateName: Accountinfor.AccountName,
        }),
        func: "WH_spProductGroup_Total",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      setTotalProduct(result[0].Total);
      setTotalProductGroup(result[1].Total);
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#endregion

  //#region search product group
  const WH_spProductGroup_Search = async (Code) => {
    setSelectProduct(Code.target.value);
    setIsAcctive(false);
    if (Code.target.value.length < 4) {
      setDataSearch([]);
      return;
    } else {
      const params = {
        Json: JSON.stringify({
          SearchCode: Code.target.value,
        }),
        func: "WH_spProductGroup_Search",
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
  //#endregion

  const onSelecteProductGroup = (item) => {
    if (
      DataProductGroup.find((e) => e.ProductsGroupId === item.ProductsGroupId)
    ) {
      Alertwarning(I18n.t("GroupProducts.Thisgrouphasbeenshown"));
      return;
    }
    let ar = DataSearch.filter(
      (a) => a.ProductsGroupId === item.ProductsGroupId
    );
    let _arr = [...DataProductGroup, ...ar]; //use filter to push ar like this
    setDataProductGroup(_arr);
  };



  //#region click add new
  const clickAddNew = () => {
    setTitle(I18n.t("validate.Addanewproductgroup!"));
    WH_spAccountGroup_Cancel();
  };
  //#endregion

  //#region load list
  const clickLoadList = () => {
    try {
      WH_spProductGroup_List();
      WH_spProductGroup_Total();
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#endregion


  //#region view image
  const [ModalImg, setModalImg] = useState("");
  const viewImageInTable = async (img) => {
    setModalImg(img);
  };
  //#endregion

  //#region table product group
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
      accessor: "ProductsGroupId",
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
              id={row.original.ProductsGroupId}
              key={row.original.ProductsGroupId}
              value={row.original.ProductsGroupId}
              checked={row.original.IsCheck}
              onChange={(e) => setdataarray({ _row: row, keys: "check" })}
            />
            <label
              className="label checkbox"
              htmlFor={row.original.ProductsGroupId}
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
      accessor: "ProductsGroupId",
      special: true,
      show: true,
      Cell: (row) => (
        <span>
          <button
            data-tooltip= {I18n.t("AccountGroup.Detail")}
            className="btn btn-sm btn-info mr-2 show__tip__left"
            data-toggle="modal"
            data-target="#myModal2"
            onClick={(e) => WH_spProductGroup_Detail(row)}
          >
            <i className="fa-solid fa-eye"></i>
            {/* Chi tiết */}
          </button>
          <button
            data-tooltip={I18n.t("AccountGroup.Edit")}
            className="btn btn-sm btn-success mr-2 show__tip__left"
            data-toggle="modal"
            data-target="#myModal1"
            onClick={(e) => WH_spProductGroup_Edit(row)}
          >
            <i className="fas fa-wrench"></i>
            {/* Sửa */}
          </button>
          <button
            data-tooltip= {I18n.t("AccountGroup.Delete")}
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
      Header:  I18n.t("AccountGroup.Picture"),
      accessor: "ProductGroupImage",
      filterable: false,
      sortable: false,
      Cell: (row) => (
        <div>
          <a
            className="cursor"
            data-toggle="modal"
            data-target="#modalImg"
            onClick={(e) => {
              viewImageInTable(row.original.ProductGroupImage);
            }}
            title="Click to view large image"
          >
            {row.original.ProductGroupImage !==
              "http://api-warehouse.vps.vn" ? (
              <img
                src={row.original.ProductGroupImage}
                height="31"
                width="50"
              />
            ) : (
              <></>
            )}
          </a>
        </div>
      ),
    },
    {
      Header: I18n.t("GroupProducts.ProductGroupCode"),
      accessor: "ProductGroupCode",
    },
    {
      Header: I18n.t("GroupProducts.ProductGroupName"),
      accessor: "ProductGroupName",
    },
    {
      Header: I18n.t("GroupProducts.Thenumberofproducts"),
      accessor: "TotalProductGroup",
    },
    {
      Header: I18n.t("System.Creater"),
      accessor: "CreateName",
      width: 150,
    },
    {
      Header: I18n.t("System.DateCreated"),
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
  //#endregion

  //#region table detail product group
  const [columnsDetail, setcolumnsDetail] = useState([
    {
      Header: I18n.t("Report.STT"),
      Cell: (row) => <span>{row.index + 1}</span>,
      width: 50,
      filterable: false,
      special: true,
      show: true,
    },
    {
      Header:I18n.t("AccountGroup.Picture"),
      accessor: "Image",
      filterable: false,
      sortable: false,
      Cell: (row) => (
        <div>
          <a
            className="cursor"
            data-toggle="modal"
            data-target="#modalImg"
            onClick={(e) => {
              viewImageInTable(row.original.Image);
            }}
            title="Click to view large image"
          >
            {row.original.Image !== undefined ? (
              <img src={row.original.Image} height="30" width="50" />
            ) : (
              ""
            )}
          </a>
        </div>
      ),
    },
    {
      Header: I18n.t("GroupProducts.Productcode"),
      accessor: "ProductCode",
      width: 150,
    },
    {
      Header: I18n.t("GroupProducts.ProductName"),
      accessor: "ProductName",
      width: 150,
    },
    {
      Header: I18n.t("GroupProducts.ProductGroups"),
      accessor: "ProductGroupName",
      width: 150,
    },
    {
      Header: I18n.t("GroupProducts.Dimension"),
      accessor: "SizeName",
      width: 150,
    },
    {
      Header:I18n.t("GroupProducts.Color"),
      accessor: "ColorName",
      width: 150,
    },
    {
      Header: I18n.t("GroupProducts.Unit"),
      accessor: "UnitName",
      width: 150,
    },
    {
      Header: I18n.t("GroupProducts.Amountofconversion"),
      accessor: "QuanlityExchange",
      width: 150,
    },
    {
      Header:I18n.t("GroupProducts.Conversionform"),
      accessor: "ConversionUnitName",
      width: 150,
    },
    {
      Header:I18n.t("GroupProducts.Barcodes"),
      accessor: "Barcode",
      width: 150,
    },
    {
      Header:  I18n.t("GroupProducts.Longs"),
      accessor: "Length",
      width: 150,
    },
    {
      Header: I18n.t("GroupProducts.Width"),
      accessor: "Width",
      width: 150,
    },
    {
      Header: I18n.t("System.Height"),
      accessor: "Height",
      width: 150,
    },
    {
      Header: I18n.t("GroupProducts.Weight(grams)"),
      accessor: "Weight",
      width: 150,
    },
    {
      Header: I18n.t("GroupProducts.mass(cbm)"),
      accessor: "Mass",
      width: 150,
    },
    {
      Header: I18n.t("System.Creater"),
      accessor: "CreateName",
      width: 150,
    },
    {
      Header: I18n.t("System.DateCreated"),
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
  //#endregion

  const Exportexcel = () => {
       //kiem tra quyen Excel
       if(datapermisstion !== "")
       {
           let a = JSON.parse(datapermisstion);
          let b = a.find(p => p.WH_tblMenuModuleId === 58 && p.Excel === 'C')
           if( b === undefined)
           {
               Alertwarning(I18n.t("validate.YoudonothavepermissiontoexportExcel!"));
               return;
           }
  }
    if (DataProductGroup.length === 0) {
      Alertwarning(I18n.t("ImportRatioCustomerReport.Noexceldatayet"));
      return;
    }
    const newData = DataProductGroup.map((element) => {
      return {
        "Hình ảnh": element.ProductGroupImage,
        "Mã nhóm sản phẩm": element.ProductGroupCode,
        "Tên nhóm sản phẩm": element.ProductGroupName,
        "Số lượng sản phẩm": element.TotalProductGroup,
        "Người tạo": element.CreateName,
        "Ngày tạo": FormatDateJson(element.CreateTime),
        "Người sửa": element.EditName,
        "Ngày sửa": FormatDateJson(element.EditTime),
        "Ghi chú": element.Description,
      };
    });
    newData.forEach(function (x) {
      if (
        columns.find((a) => a.accessor == "ProductGroupImage") === undefined
      ) {
        delete x["Hình ảnh"];
      } else if (
        columns.find((a) => a.accessor === "ProductGroupImage").show === false
      ) {
        delete x["Hình ảnh"];
      }
      if (columns.find((a) => a.accessor == "ProductGroupCode") === undefined) {
        delete x["Mã nhóm sản phẩm"];
      } else if (
        columns.find((a) => a.accessor === "ProductGroupCode").show === false
      ) {
        delete x["Mã nhóm sản phẩm"];
      }
      if (columns.find((a) => a.accessor == "ProductGroupName") === undefined) {
        delete x["Tên nhóm sản phẩm"];
      } else if (
        columns.find((a) => a.accessor === "ProductGroupName").show === false
      ) {
        delete x["Tên nhóm sản phẩm"];
      }
      if (
        columns.find((a) => a.accessor == "TotalProductGroup") === undefined
      ) {
        delete x["Số lượng sản phẩm"];
      } else if (
        columns.find((a) => a.accessor === "TotalProductGroup").show === false
      ) {
        delete x["Số lượng sản phẩm"];
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
    ExportExcel(newData, "Danh sach nhom san pham");
  };

  const HtmlPopup1 = (
    <div className="container">
      <div className="modal fade" id="myModal1" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content width_height100">
            <div class="modal-header">
              <div className="row edit__user__header">
                <h4 className="">
                  <i class="fa fa-archive mr-2"></i>
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
                    {I18n.t("GroupProducts.Groupcode")}<span className="form__title__note">(*)</span>
                    </label>
                    <input
                      onChange={(e) => setProductGroupCode(e.target.value.trim())}
                      value={ProductGroupCode}
                      type="text"
                      className="form-control"
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="col-md-6 col-sm-12">
                  <div className="form-group">
                    <label className="form__title">
                    {I18n.t("GroupProducts.Groupname")}<span className="form__title__note">(*)</span>
                    </label>
                    <input
                      onChange={(e) => setProductGroupName(e.target.value)}
                      value={ProductGroupName}
                      type="text"
                      className="form-control"
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form__title"> {I18n.t("GroupProducts.Description")}</label>
                    <input
                      onChange={(e) => setDescription(e.target.value)}
                      value={Description}
                      type="text"
                      className="form-control"
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="col-md-6 pt-3">
                  {Images ? (
                    <label class="image-label">
                      <input
                        type="file"
                        className="image-collapse-file"
                        onChange={onFileChange}
                        accept="image/*"
                      />
                      <img
                        src={Images === "" ? "" : Images}
                        className="image-collapse-image"
                      />
                    </label>
                  ) : (
                    <label class="image-label">
                      <input
                        type="file"
                        className="image-collapse-file"
                        onChange={onFileChange}
                        accept="image/*"
                      />
                      <i className="fa fa-camera upload-file-btn"></i>
                      <span className="image-collapse-span">
                      {I18n.t("GroupProducts.Uploadimages")}<span className="form__title__note">(*)</span>
                      </span>
                    </label>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="row">
                <button
                  disabled={!disable}
                  type="button"
                  className=" btn btn__save__w95h40 pull-right"
                  onClick={WH_spProductGroup_Save_img}
                >
                  {I18n.t("System.Save")}
                </button>
                <button
                  type="button"
                  className=" btn btn__cancel__w95h40 pull-right margin-left-5"
                  onClick={WH_spAccountGroup_Cancel}
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

  //#region modal detail product group
  const HtmlPopup2 = (
    <div className="container">
      <div className="modal fade" id="myModal2" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content width_height100 modal__detail__table">
            <div class="modal-header">
              <div className="row edit__user__header">
                <h4 className="">
                  <i className="fa fa-users mr-2" />
                  {Title}
                </h4>
                <a className="btn btn__default" data-dismiss="modal">
                  <i className="fa fa-times-circle edit__close__icon" />
                </a>
              </div>
            </div>
            <div class="modal-body">
              <SettingColumn
                columns={columnsDetail}
                Returndata={(a) => setcolumnsDetail(a)}
              />
              <DataTable data={DataProductDetail} columns={columnsDetail} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  //#endregion

  //#region modal view image
  const ViewImg = (
    <div
      class="modal fade"
      id="modalImg"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modalImg"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <div className="row edit__user__header">
              <h4 className="">
                <i className="fa-solid fa-image mr-2"></i>
                {I18n.t("GroupProducts.Picture")}
              </h4>
              <a className="btn btn__default" data-dismiss="modal">
                <i className="fa fa-times-circle edit__close__icon" />
              </a>
            </div>
          </div>
          <div class="modal-body text-center">
            <img src={ModalImg} width="100%" />
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
          {/* Begin Product Group Card */}
          <div className="card card-primary">
            <div className="card-header">
              <div className="row">
                <div className="col-md-6">
                  <h3 className="card-title">
                    <i class="fa fa-archive"></i>
                    <span className="font-weight-bold">
                      {I18n.t("GroupProducts.ProductGroups")} ({DataProductGroup.length})
                    </span>
                  </h3>
                </div>
                <div className="col-md-6 card-header-btn">
                  <a
                    className="btn btn-warning btn-sm float-right btn-header"
                    onClick={(e) => Exportexcel(e)}
                  >
                    <i className="fa fa-download mr-2" />
                    {I18n.t("System.Excel")}
                  </a>
                  <a
                    className="btn btn-danger btn-sm float-right btn-header"
                    onClick={(e) => WH_spProductGroup_Delete(0, 2)}
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
            <div className="card-body">
              <div className="row padding-2rem">
                <div className="col-md-5 card__info">
                  <div className="card__h150w210 BG-9DDFD3">
                    <p className="">{I18n.t("GroupProducts.ProductGroups")}</p>
                    <p>{TotalProduct}</p>
                  </div>
                  <div className="card__h150w210 BG-DBF6E9">
                    <p className="">{I18n.t("GroupProducts.TotalProductGroup")}</p>
                    <p>{TotalProductGroup}</p>
                  </div>
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
                      placeholder="Search product code or product name"
                      value={SelectProduct}
                      onChange={(e) => WH_spProductGroup_Search(e)}
                    />
                    <div className={IsAcctive === false ? "display-none" : ""}>
                      <div className="col-md-12 col-sm-12 col-xs-12 div-sender">
                        {DataSearch.map((item, index) => {
                          return (
                            <div
                              className="select-option-like"
                              key={index}
                              value={SelectProduct}
                              onClick={(e) => onSelecteProductGroup(item)}
                            >
                              {item.ProductGroupName}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Begin Product Group List */}
              <div
                className={DataProductGroup.length > 0 ? "" : "display-none"}
              >
                <SettingColumn
                  columns={columns}
                  Returndata={(a) => setcolumns(a)}
                />
                <DataTable data={DataProductGroup} columns={columns} />
              </div>
              {/* End Product Group List */}
            </div>
          </div>
          {/* End Product Group Card */}

          {/* Begin Modal Form */}
          {HtmlPopup1}
          {HtmlPopup2}
          {ViewImg}
          {/* End Modal Form */}
        </div>
      </section>
    </div>
  );
};
