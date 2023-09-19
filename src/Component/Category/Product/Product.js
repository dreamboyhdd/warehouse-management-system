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
  SelectProductUnit,
  SelectProductSize,
  SelectProductColor,
  SelectProductGroup,
  SettingColumn,
  SelectAccount,
  SelectProvider,
  SelectCurator,
} from "../../../Common";

export const Product = () => {



  let datapermisstion = localStorage.getItem("Permissioninfor");//check quyền
  //#region set variable
  const [Title, setTitle] = useState(I18n.t("Product.Addnewproducts"));
  // const [DataUnit, setDataUnit] = useState([{ Id: 1, datasl1: "" }, { Id: 2, datasl1: "" }, { Id: 3, datasl1: "" },]);
  const [DataUnit, setDataUnit] = useState([{ Id: 1, datasl1: "" }, { Id: 2, datasl1: "" }]);
  // const [DataUnit, setDataUnit] = useState([
  //   { Id: 1, datasl1: "", numberchange: 0, datasl2: "", value1: { value: -1, label: "Select" }, value2: { value: -1, label: "Select" } },
  //   { Id: 2, datasl1: "", numberchange: 0, datasl2: "", value1: { value: -1, label: "Select" }, value2: { value: -1, label: "Select" } },
  //   { Id: 3, datasl1: "", numberchange: 0, datasl2: "", value1: { value: -1, label: "Select" }, value2: { value: -1, label: "Select" } },
  // ]);
  const [ProductId, setProductId] = useState(0);
  const [State, setState] = useState();
  const [ProductsGroup, setProductsGroup] = useState({ value: 0 });
  const [ProductCode, setProductCode] = useState("");
  const [ProductName, setProductName] = useState("");
  const [Barcode, setBarcode] = useState("");
  const [Size, setSize] = useState({ value: 0 });
  const [Color, setColor] = useState({ value: 0 });
  const [Unit, setUnit] = useState({ value: 0 });
  const [Length, setLength] = useState("");
  const [Width, setWidth] = useState("");
  const [Height, setHeight] = useState("");
  const [Weight, setWeight] = useState("");
  const [Mass, setMass] = useState("");
  const [CreateName, setCreateName] = useState({});
  const [Description, setDescription] = useState("");
  const [DataProduct, setDataProduct] = useState([]);

  const [IsAcctive1, setIsAcctive1] = useState(false);
  const [IsAcctive2, setIsAcctive2] = useState(false);
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(true);
  const [Images, setImages] = useState("");
  const [FileUpload, setFileUpload] = useState({});
  const [dataarray, setdataarray] = useState("");
  const [Checkall, setCheckall] = useState(false);
  const Accountinfor = JSON.parse(localStorage.getItem("Accountinfor") === "" ? "{}" : localStorage.getItem("Accountinfor"));

  const [Barcode2, setBarcode2] = useState("");
  const [Size2, setSize2] = useState({ value: 0 });
  const [ProductsGroup2, setProductsGroup2] = useState({ value: 0 });
  const [ProductCode2, setProductCode2] = useState("");
  const [ProductName2, setProductName2] = useState("");

  const [TypeProduct, setTypeProduct] = useState('');


  const [disable1, setdisable1] = useState(1);
  const [disable2, setdisable2] = useState(1);
  const [Provider, setProvider] = useState({ value: 0 });
  const ProviderRef = useRef();
  const [Curator, setCurator] = useState({ value: 0 });
  const CuratorRef = useRef();



  //#region upload file
  const onFileChange = (event) => {
    setFileUpload(event.target.files[0]);
    setImages(URL.createObjectURL(event.target.files[0]));
  };
  //#end region

  //#regon begin using the effect hook
  // useEffect(() => {
  //   WH_spProduct_Attribute_Unit_List();
  // }, []);
  //#end regon

  useEffect(() => {
    if (dataarray.keys === "check") {
      CheckOne(dataarray._row.original.ProductId, dataarray._row.original.IsCheck);
    } else if (dataarray.keys === 'delete') {
      WH_spProduct_Delete(dataarray._row.value, 1);
    } else if (dataarray.keys === 'checkall') {
      CheckOne(0, Checkall)
    }
  }, [dataarray]);

  useEffect(() => {
    WH_spProduct_Attribute_Unit_List_v2()
  }, []);



  //#region render list
  const WH_spProduct_Attribute_Unit_List_v2 = async () => {
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
        const FirstData = { value: -1, label: 'Select' };
        let dataSelect = [];
        dataSelect.push(FirstData);
        list.forEach((element, index) => {
          dataSelect.push({ value: element.UnitId, label: element.UnitName, NumberConversion: element.NumberConversion });
        });
        DataUnit.forEach((element) => {
          element.datasl1 = dataSelect;
        });
        setState({ data: DataUnit });
        // if (TypeProduct === 0) {
        //   const FirstData = { value: -1, label: 'Select' };
        //   let dataSelect = [];
        //   dataSelect.push(FirstData);
        //   list.forEach((element, index) => {
        //     dataSelect.push({ value: element.UnitId, label: element.UnitName });
        //   });
        //   DataUnit.forEach((element) => {
        //     element.datasl1 = dataSelect;
        //   });
        //   setState({ data: DataUnit });
        // }
        // if (TypeProduct === 1) {
        //   const FirstData = { value: -1, label: 'Select' };
        //   let dataSelect = [];
        //   dataSelect.push(FirstData);
        //   list.forEach((element, index) => {
        //     if (element.NumberConversion === 1) {
        //       dataSelect.push({ value: element.UnitId, label: element.UnitName });
        //     }
        //   });
        //   DataUnit.forEach((element) => {
        //     element.datasl1 = dataSelect;
        //   });
        //   setState({ data: DataUnit });
        // }

      } else {
        Alertwarning("Không có dữ liệu!");
      }
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#end region

  //#region
  const WH_spProduct_Cancel = () => {
    setTitle(I18n.t("validate.Addnewproducts"));
    setProductId("");
    setProductsGroup({ value: -1 });
    setProductCode("");
    setProductName("");
    setBarcode("");
    setProvider({ value: -1 });
    setCurator({ value: -1 });
    setSize({ value: -1 });
    setColor({ value: -1 });
    setUnit({ value: -1 });
    setLength("");
    setWidth("");
    setHeight("");
    setWeight("");
    setMass("");
    setDescription("");
    setImages("");
    setFileUpload({});
    handleSelectData(1, { value: -1, label: "select" }, 10);
  };
  //#endregion

  //#region
  const WH_spProduct_Edit = (item) => {
    setTitle(I18n.t("validate.Changeproductinformation"));
    const data = item.row._original;
    console.log(data)
    try {
      setProductId(data.ProductId);
      setProductsGroup({ value: data.ProductsGroupId });
      setProductCode(data.ProductCode);
      setProductName(data.ProductName);
      setBarcode(data.Barcode);
      setSize({ value: data.SizeId });
      setColor({ value: data.ColorId });
      setUnit({ value: data.UnitId });
      setProvider({ value: data.ProviderId })
      setCurator({ value: data.CuratorId })
      setLength(data.Length);
      setWidth(data.Width);
      setHeight(data.Height);
      setWeight(data.Weight);
      setMass(data.Mass);
      setDescription(data.Description);
      setImages(data.Image);
      setTypeProduct(data?.Iseri);
      handleSelectData(1, { value: -1, label: "select" }, 11, item);
      document.getElementById("tab_1").click();
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#endregion

  // Begin save and edit
  const WH_spProduct_Save = async () => {
    //kiem tra quyen luu
    if (datapermisstion !== "") {
      let a = JSON.parse(datapermisstion);
      let b = a.find(p => p.WH_tblMenuModuleId === 60 && p.Adds === 'C')
      if (b === undefined) {
        Alertwarning(I18n.t("validate.Youdonothavetherighttocreateproducts!"));
        return;
      }
    }
    try {
      if (Weight === '') {
        Alertwarning('Vui lòng chọn loại sản phẩm');
        return;
      }

      if (ProductsGroup.value <= 0) {
        Alertwarning(I18n.t("validate.Pleaseselectproductgroup"));
        return;
      }
      if (ProductName === "") {
        Alertwarning(I18n.t("validate.PleaseEnterProductName"));
        return;
      }
      if (Length === "") {
        Alertwarning(I18n.t("validate.Pleaseenterlength"));
        return;
      }
      if (Length <= 0) {
        Alertwarning(I18n.t("validate.Lengthmustbegreaterthan0,pleasecheckagain"));
        return;
      }
      if (Width === "") {
        Alertwarning(I18n.t("validate.Pleaseenterwidth"));
        return;
      }
      if (Width <= 0) {
        Alertwarning(I18n.t("validate.Widthmustbegreaterthan0,pleasecheckagain"));
        return;
      }
      if (Height === "") {
        Alertwarning(I18n.t("validate.Pleaseenteryourheight"));
        return;
      }
      if (Height <= 0) {
        Alertwarning(I18n.t("validate.Heightmustbegreaterthan0,pleasecheckagain"));
        return;
      }
      if (Weight === "") {
        Alertwarning(I18n.t("validate.Pleaseenterweight"));
        return;
      }
      if (Weight <= 0) {
        Alertwarning(I18n.t("validate.Weightmustbegreaterthan0,pleasedoublecheck"));
        return;
      }
      if (Color.value <= 0) {
        Alertwarning(I18n.t("validate.Pleaseentercolor"));
        return;
      }
      if (Size.value <= 0) {
        Alertwarning(I18n.t("validate.Pleaseentersize"));
        return;
      }
      if (Unit.value <= 0) {
        Alertwarning(I18n.t("validate.Pleaseentertheunitofmeasure"));
        return;
      }

      if (FileUpload.name !== undefined) {
        const formData = new FormData();
        formData.append("AppAPIKey", "netcoApikey2025");
        formData.append("myFile", FileUpload, FileUpload.name);
        const data = await mainAction.API_spCallPostImage(formData, dispatch);
        let _img = data.Message.replace('"', "").replace('"', "");
        var img = _img.replace("[", "").replace("]", "");
      }
      if (FileUpload.name === undefined) {
        var img = Images.slice(27);
      }

      let ar = [];
      DataUnit.forEach((e) => {
        if (e.value1 !== undefined) {
          ar.push({
            UnitId: e.value1.value,
            UnitName: e.value1.label,
            NumberConversion: e.value1.NumberConversion, // Số lượng quy đổi
            // UnitConversionId: e.value2.value,
            // UnitConversionName: e.value2.label, //tên đơn vị quy đổi
            CreateId: GetDataFromLogin("AccountId"),
            CreateName: GetDataFromLogin("AccountName"),
          });
        }
      });
      if (ar.length === 0) {
        Alertwarning(I18n.t("validate.Enterpackingsettings"));
        return;
      }
      debugger
      let a = DataUnit.find((a) => a.Id === 1);
      let b = DataUnit.find((a) => a.Id === 2);
      if (a.NumberConversion <= 0) {
        Alertwarning(I18n.t("validate.Theamountofconversionmustbegreaterthan0"));
        return;
      }
      if (b === undefined) {
        b = 0
      } else {
        if (b.value1 === undefined) {
          b = 0
        }
      }
      debugger
      setDisable(false);
      const pr = {
        ProductId: ProductId,
        ProductsGroupId: ProductsGroup.value,
        ProductGroupCode: ProductsGroup.ProductGroupCode,
        ProductCode: ProductCode.trim(),
        ProductName: ProductName.trim(),
        ProviderId: Provider.value,
        CuratorId: Curator.value,
        SizeId: Size.value,
        SizeName: Size.label, // Kích thước
        SizeCode: Size.SizeCode,
        ColorId: Color.value,
        ColorName: Color.label,
        ColorCode: Color.ColorCode,
        Barcode: Barcode.trim(),
        Length: Length, // (centimet)
        Width: Width, // (centimet)
        Height: Height, // (centimet)
        Weight: Weight, // Trọng lượng (gram)
        Mass: 0,//((Length / 100) * (Width / 100) * (Height / 100)).toFixed(3), // Khối lượng (cbm) Số khối (cbm) = Dài (mét) * Rộng (Mét) * Cao (Mét)
        Image: img,
        UnitId: a.value1.value,
        UnitName: a.value1.label, // Đơn vị cố định
        QuanlityExchange: a.value1.NumberConversion, // Số lượng quy đổi

        ConversionUnitId: b !== 0 ? b.value1.value : 0, // Đơn vị tính cố định
        ConversionUnitName: b !== 0 ? b.value1.label : '', // Đơn vị quy đổi
        ConversionUnitNumber: b !== 0 ? b.value1.NumberConversion : '',
        CreateId: Accountinfor.AccountId,
        CreateName: Accountinfor.AccountName,
        WeightExchange: Weight / a.value1.NumberConversion,
        Description: Description.toString().replaceAll('"', "'").trim(),
        Iseri: TypeProduct,
        ProductPackging: ar
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "WH_spProduct_Save_V2",
      };
      debugger
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        WH_spProduct_Cancel();
        Alertsuccess(result.ReturnMess);
        setDisable(true);
        return;
      }
      if (result.Status === "NO") {
        Alertwarning(result.ReturnMess);
        setDisable(true);
        return;
      }
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#endregion
  const WH_spProduct_Attribute_Unit_List = async () => {
    try {
      const params = {
        Json: JSON.stringify({
          UnitId: 0,
          AccountId: GetDataFromLogin("AccountId"),
        }),
        func: "WH_spProduct_Attribute_Unit_List",
        API_key: APIKey,
      };

      const list = await mainAction.API_spCallServer(params, dispatch);
      if (list.length > 0) {
        const FirstData = { value: -1, label: 'Select' };
        let dataSelect = [];
        dataSelect.push(FirstData);
        list.forEach((element, index) => {
          dataSelect.push({ value: element.UnitId, label: element.UnitName });
        });
        DataUnit.forEach((element) => {
          element.datasl1 = dataSelect;
          element.datasl2 = dataSelect;
        });
        setState({ data: DataUnit });
      } else {
        Alertwarning(I18n.t("validate.Nounitdata!"));
      }
    } catch (error) {
      Alerterror(I18n.t("validate.Dataerror,pleasecontactITNETCO!"));
      console.log(error, "WH_spProduct_Attribute_Unit_List");
    }
  };

  const handleSelectData = (id, e, key, rowItem) => {
    debugger

    if (key == 1) {
      const Codearr = [];
      const uniqueSet = new Set(DataUnit[0].datasl1.filter(e => e.value !== -1));
      const backToArray = [...uniqueSet];
      let ids = (backToArray).map(object => {
        return object.NumberConversion;
      });
      let max = Math.max(...ids);
      let min = Math.min(...ids);

      /* Khi chọn quy đổi nhỏ nhất thì disable đơn vị quy đổi ở dưới*/
      if (e.NumberConversion === min && id === 1) {
        setdisable2(2);

      }
      else {
        setdisable2(1);
      }

      /* Khi chọn quy đổi lớn nhất thì  đơn vị quy đổi ở dưới chỉ đc chọn đơn vị nhỏ hơn*/
      let val1 = DataUnit.find((a) => a.Id === 1);
      let val2 = DataUnit.find((a) => a.Id === 2);
      if (id === 2) {
        if (e.NumberConversion >= val1.value1.NumberConversion) {
          Alertwarning('Please choose a smaller conversion!');
          handleSelectData(2, { value: -1, label: "select" }, 1);
          return;
        }
      }
      else {
        DataUnit.find((a) => a.Id === id).value1 = e;
      }

      if (id === 1) {
        if (val2 !== undefined) {
          if (val2.value1 !== undefined) {
            if (e.NumberConversion <= val2.value1.NumberConversion) {
              Alertwarning('Please choose a larger conversion!');
              handleSelectData(2, { value: -1, label: "select" }, 1);
              return;
            }
          }
        }
      }
      else {
        DataUnit.find((a) => a.Id === id).value1 = e;
      }

    }
    if (key == 2) {
      DataUnit.find((a) => a.Id === id).value2 = e;
    }
    if (key == 3) {
      DataUnit.find((a) => a.Id === id).numberchange = e;
    }
    if (key == 4) {
      DataUnit.find((a) => a.Id === 1).value1 = e;
    }
    if (key == 10) {
      let newArr = DataUnit.map((item) => {
        return {
          ...item,
          value1: { value: -1, label: "Select" },
          value2: { value: -1, label: "Select" },
          numberchange: 0,
        };
      });
      /*   if (newArr.length < 3) {
          newArr = [newArr[0], { ...newArr[0], Id: 2, }, { ...newArr[0], Id: 3 }];
        } */
      setDataUnit(newArr);
      return;
    }
    if (key == 11) {
      let newArr = DataUnit.map((item) => {
        return {
          ...item,
          value1: { value: -1, label: "Select" },
          value2: { value: -1, label: "Select" },
          numberchange: 0,
        };
      });
      let arr = rowItem.original.ProductPackaging.map((item, index) => {
        return {
          ...DataUnit[index],
          ...item,
          value1: { value: item.UnitId2, label: item.UnitName2, NumberConversion: item.NumberConversion },
          value2: {
            value: item.UnitConversionId,
            label: item.UnitConversionName,
          },
          numberchange: item.NumberConversion,
        };
      });
      /*   if (arr.length < 3) {
          arr = [arr[0], { Id: 2, ...newArr[1], ...arr[1], }, { Id: 3, ...newArr[2], ...arr[2] }];
        } */
      setDataUnit(arr);
      return;
    }
    setState({ data: DataUnit });
  };

  const WH_spProduct_List = async () => {
    //kiem tra quyen xem
    if (datapermisstion !== "") {
      let a = JSON.parse(datapermisstion);
      let b = a.find(p => p.WH_tblMenuModuleId === 60 && p.Views === 'C')
      if (b === undefined) {
        Alertwarning(I18n.t("validate.Youdonothavepermissiontoviewtheproduct!"));
        return;
      }
    }
    try {
      const params = {
        Json: JSON.stringify({
          ProductId: 0,
          ProductCode: ProductCode2.trim(),
          ProductName: ProductName2.trim(),
          ProductsGroupId: ProductsGroup2.value,
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

  //#region delete
  const WH_spProduct_Delete = (id, key) => {

    //kttra quyền xóa
    if (datapermisstion !== "") {
      let a = JSON.parse(datapermisstion);
      let b = a.find(p => p.WH_tblMenuModuleId === 60 && p.Deletes === 'C')
      if (b === undefined) {
        Alertwarning(I18n.t("validate.Youdonothavetherighttodeletetheproduct!"));
        return;
      }
    }
    let check = DataProduct.filter((a) => a.IsCheck === true);
    if (id === 0 && check.length === 0) {
      Alertwarning(I18n.t("validate.Pleaseselecttheproducttodelete!"));
      return;
    }
    try {
      ConfirmAlert("", "Are you sure you want to delete?", async () => {
        const ar = [];
        if (key === 1) {
          ar.push({
            ProductId: id,
            AccountId: Accountinfor.AccountId,
            AccountName: Accountinfor.AccountName,
          });
        }
        if (key === 2) {
          let data = DataProduct.filter((a) => a.IsCheck === true);
          data.forEach((element) => {
            ar.push({
              ProductId: element.ProductId,
              AccountId: Accountinfor.AccountId,
              AccountName: Accountinfor.AccountName,
            });
          });
        }
        const params = {
          Json: JSON.stringify({ ListId: ar }),
          func: "WH_spProduct_Delete",
        };
        const result = await mainAction.API_spCallServer(params, dispatch);
        if (result.Status === "OK") {
          if (key === 1) {
            setDataProduct(DataProduct.filter(a => a.ProductId !== id))
          }
          if (key === 2) {
            setDataProduct(DataProduct.filter(a => a.IsCheck !== true))
          }
        }
        Alertsuccess(result.ReturnMess);
      })
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };

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

  const [ModalImg, setModalImg] = useState("");
  const viewImageInTable = async (img) => {
    setModalImg(img);
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

      accessor: "ProductId",
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
      Header: I18n.t("System.Option"),
      width: 180,
      filterable: false,
      sortable: false,
      accessor: "ProductId",
      special: true,
      show: true,
      Cell: (row) => (
        <span>
          {/* <button
            data-tooltip={I18n.t("Delivery.Detail")}
            className="btn btn-sm btn-info mr-2 show__tip__left"
            data-toggle="modal"
            data-target="#myModal2"
          >
            <i className="fa-solid fa-eye"></i>
          </button> */}
          <button
            data-tooltip={I18n.t("Delivery.Edit")}
            className="btn btn-sm btn-success mr-2 show__tip__left"
            onClick={(e) => WH_spProduct_Edit(row)}
          >
            <i className="fas fa-wrench"></i>
          </button>
          <button
            data-tooltip={I18n.t("AccountGroup.Delete")}
            className="btn btn-sm btn-danger show__tip__right"
            onClick={(e) => setdataarray({ _row: row, keys: "delete" })}
          >
            <i className="fa fa-trash"></i>
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
      Header: I18n.t("AccountGroup.Picture"),
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
            {row.original.Image === "http://api-warehouse.vps.vn" ? <></> : <img src={row.original.Image} height="30" width="50" />}
          </a>
        </div>
      ),
    },
    {
      Header: "Status",
      accessor: 'Iseri',
      filterable: false,
      sortable: false,
      width: 200,
      Cell: (obj) => {
        if (obj.original.Iseri === 1) {
          return <label className="btn labelradius10px older">Có serial</label>
        } if (obj.original.Iseri === 0) {
          return <label className="btn labelradius10px new">Không có serial</label>
        } else {
          return <label className="btn labelradius10px nothave">Chưa tạo serial</label>
        }
      }
    },
    {
      Header: I18n.t("GroupProducts.ProductCode"),
      accessor: "ProductCode",
      width: 150,
    },
    {
      Header: I18n.t("Product.ProductName"),
      accessor: "ProductName",
      width: 150,
    },
    {
      Header: I18n.t("Product.ProductGroups"),
      accessor: "ProductGroupName",
      width: 150,
    },
    {
      Header: I18n.t("Product.ProviderName"),
      accessor: "ProviderName",
      width: 150,
    },
    {
      Header: I18n.t("Product.CuratorName"),
      accessor: "CuratorName",
      width: 150,
    },
    {
      Header: I18n.t("GroupProducts.Dimension"),
      accessor: "SizeName",
      width: 150,
    },
    {
      Header: I18n.t("ProductAttributeColors.Color"),
      accessor: "ColorName",
      width: 150,
    },
    {
      Header: I18n.t("ProductAttributeColors.Unit"),
      accessor: "UnitName",
      width: 150,
    },
    {
      Header: I18n.t("ProductAttributeColors.Amountofconversion"),
      accessor: "QuanlityExchange",
      width: 150,
    },
    {
      Header: "Barcode",
      accessor: "Barcode",
      width: 150,
    },
    {
      Header: I18n.t("Product.Length(cm)"),
      accessor: "Length",
      width: 150,
    },
    {
      Header: I18n.t("Product.Width(cm)"),
      accessor: "Width",
      width: 150,
    },
    {
      Header: I18n.t("Product.Height(cm)"),
      accessor: "Height",
      width: 150,
    },
    {
      Header: I18n.t("Product.Mass(cbm)"),
      accessor: "Mass",
      width: 150,
    },
    {
      Header: I18n.t("Product.Weight(gram)"),
      accessor: "Weight",
      width: 150,
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
      width: 150,
    },
    {
      Header: I18n.t("Report.Editer"),
      accessor: "EditName",
      width: 150,
    },
    {
      Header: I18n.t("System.EditDate"),
      accessor: "EditTime",
      Cell: (obj) => FormatDateJson(obj.value),
      width: 150,
    },
    {
      Header: I18n.t("Customer.Note"),
      accessor: "Description",
      width: 150,
    },
  ]);

  const Exportexcel = () => {

    // //kiem tra quyen Excel
    // if (datapermisstion !== "") {
    //   let a = JSON.parse(datapermisstion);
    //   let b = a.find(p => p.WH_tblMenuModuleId === 60 && p.Excel === 'C')
    //   if (b === undefined) {
    //     Alertwarning(I18n.t("validate.YoudonothavepermissiontoexportExcel!"));
    //     return;
    //   }
    // }

    //kiem tra quyen Excel
    if (datapermisstion !== "") {
      datapermisstion = JSON.parse(datapermisstion);
      if (datapermisstion.find(p => p.WH_tblMenuModuleId === 60 && p.Excel === 'C') === undefined) {
        Alertwarning(I18n.t("validate.YoudonothavepermissiontoexportExcel!"));
        return;
      }
    }



    if (DataProduct.length === 0) {
      Alertwarning(I18n.t("validate.Noexceldatayet"));
      return;
    }
    const newData = DataProduct.map((element) => {
      return {
        "Hình ảnh": element.ProductGroupImage,
        "Mã sản phẩm": element.ProductCode,
        "Tên sản phẩm": element.ProductName,
        "Nhóm sản phẩm": element.ProductGroupName,
        "Kích thước": element.SizeName,
        "Màu sắc": element.ColorName,
        "Đơn vị tính": element.UnitName,
        "Số lượng quy đổi": element.QuanlityExchange,
        "Đơn quy vị đổi": element.ConversionUnitName,
        "Mã Barcode": element.Barcode,
        "Chiều dài": element.Length,
        "Chiều rộng": element.Width,
        "Chiều cao": element.Height,
        "Trọng lượng (gram)": element.Weight,
        "khối lượng (cbm)": element.Mass,
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

      if (columns.find((a) => a.accessor == "ProductCode") === undefined) {
        delete x["Mã sản phẩm"];
      } else if (
        columns.find((a) => a.accessor === "ProductCode").show === false
      ) {
        delete x["Mã sản phẩm"];
      }
      if (columns.find((a) => a.accessor == "ProductName") === undefined) {
        delete x["Tên sản phẩm"];
      } else if (
        columns.find((a) => a.accessor === "ProductName").show === false
      ) {
        delete x["Tên sản phẩm"];
      }
      if (columns.find((a) => a.accessor == "ProductGroupName") === undefined) {
        delete x["Nhóm sản phẩm"];
      } else if (
        columns.find((a) => a.accessor === "ProductGroupName").show === false
      ) {
        delete x["Nhóm sản phẩm"];
      }
      if (columns.find((a) => a.accessor == "SizeName") === undefined) {
        delete x["Kích thước"];
      } else if (
        columns.find((a) => a.accessor === "SizeName").show === false
      ) {
        delete x["Kích thước"];
      }
      if (columns.find((a) => a.accessor == "ColorName") === undefined) {
        delete x["Màu sắc"];
      } else if (
        columns.find((a) => a.accessor === "ColorName").show === false
      ) {
        delete x["Màu sắc"];
      }
      if (columns.find((a) => a.accessor == "UnitName") === undefined) {
        delete x["Đơn vị tính"];
      } else if (
        columns.find((a) => a.accessor === "UnitName").show === false
      ) {
        delete x["Đơn vị tính"];
      }
      if (columns.find((a) => a.accessor == "QuanlityExchange") === undefined) {
        delete x["Số lượng quy đổi"];
      } else if (
        columns.find((a) => a.accessor === "QuanlityExchange").show === false
      ) {
        delete x["Số lượng quy đổi"];
      }
      if (
        columns.find((a) => a.accessor == "ConversionUnitName") === undefined
      ) {
        delete x["Đơn quy vị đổi"];
      } else if (
        columns.find((a) => a.accessor === "ConversionUnitName").show === false
      ) {
        delete x["Đơn quy vị đổi"];
      }
      if (columns.find((a) => a.accessor == "Barcode") === undefined) {
        delete x["Mã Barcode"];
      } else if (columns.find((a) => a.accessor === "Barcode").show === false) {
        delete x["Mã Barcode"];
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
        delete x["Trọng lượng (gram)"];
      } else if (columns.find((a) => a.accessor === "Weight").show === false) {
        delete x["Trọng lượng (gram)"];
      }
      if (columns.find((a) => a.accessor == "Mass") === undefined) {
        delete x["khối lượng (cbm)"];
      } else if (columns.find((a) => a.accessor === "Mass").show === false) {
        delete x["khối lượng (cbm)"];
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
    await setPrintdataQRCode(DataPrint);

    $("#Printform").css("display", "block");
    $("#formaction").css("display", "none");
    $("footer").css("display", "none");
    window.print();
    $("#Printform").css("display", "none");
    $("#formaction").css("display", "block");
    $("footer").css("display", "block");
  }

  //#end region
  //#end region
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
                Hình ảnh
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

  return (
    <div className="content-wrapper pt-2">
      <section className="content" id="formaction">
        <div className="container-fluid">
          <div className="card card-primary">
            {/* Navbar */}
            <ul className="nav float-left">
              <li className="nav-item">
                <a
                  id="tab_1"
                  className="nav-link active"
                  href="#tab_1add"
                  data-toggle="tab"
                >
                  {I18n.t("System.Add")}
                </a>
              </li>
              <li className="nav-item">
                <a
                  id="tab_2"
                  className="nav-link "
                  href="#tab_2_list"
                  data-toggle="tab"
                >
                  {I18n.t("System.List")}
                </a>
              </li>
            </ul>
            <div className="body-padding">
              <div className="tab-content" id="custom-tabs-two-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="tab_1add"
                  role="tabpanel"
                  aria-labelledby="custom-tabs-two-home-tab"
                >
                  <div className="card-header">
                    <div className="row">
                      <div className="col-md-6">
                        <h3 className="card-title">
                          <i className="fas fa-plus" />
                          <span className="font-weight-bold">{Title}</span>
                        </h3>
                      </div>
                      <div className="col-md-6 card-header-btn">
                        <a
                          className="btn btn-danger btn-sm float-right btn-header"
                          onClick={(e) => WH_spProduct_Cancel()}
                        >
                          <i className="fa fa-trash mr-2 " />
                          {I18n.t("System.Cancel")}
                        </a>
                        <a
                          className="btn btn-success btn-sm float-right btn-header"
                          onClick={(e) => WH_spProduct_Save()}
                          disabled={!disable}
                        >
                          <i className="fa fa-folder mr-2 " />
                          {I18n.t("System.Save")}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="card-body-form">
                    <div className="row pb-3">
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            {I18n.t("Product.ProductGroups")}
                            <span className="form__title__note"> (*)</span>
                          </label>
                          <SelectProductGroup
                            onSelected={(e) => setProductsGroup(e)}
                            items={ProductsGroup.value}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            {I18n.t("Product.ProductName")}
                            <span className="form__title__note"> (*)</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder=""
                            value={ProductName}
                            onChange={(e) => setProductName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            {I18n.t("Product.ProductCode")}
                            {/* <span className="form__title__note"> (*)</span> */}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder=""
                            value={ProductCode}
                            onChange={(e) => setProductCode(e.target.value.trim())}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            Barcode
                            {/* <span className="form__title__note"> (*)</span> */}
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder=""
                            value={Barcode}
                            onChange={(e) => setBarcode(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            {I18n.t("Product.Length(cm)")}
                            <span className="form__title__note"> (*)</span>
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder=""
                            value={Length}
                            onChange={(e) => setLength(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            {I18n.t("Product.Width(cm)")}
                            <span className="form__title__note"> (*)</span>
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder=""
                            value={Width}
                            onChange={(e) => setWidth(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            {I18n.t("Product.Height(cm)")}
                            <span className="form__title__note"> (*)</span>
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder=""
                            value={Height}
                            onChange={(e) => setHeight(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            {I18n.t("Product.Mass(cbm)")}
                            <span className="form__title__note"> (*)</span>
                          </label>
                          <input
                            disabled={true}
                            type="text"
                            className="form-control"
                            placeholder=""
                            value={
                              ((Length / 100) * (Width / 100) * (Height / 100)).toFixed(3)
                            }
                            onChange={(e) => setMass(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            {I18n.t("ProductAttributeColors.Color")}
                            <span className="form__title__note"> (*)</span>
                          </label>
                          <SelectProductColor
                            onSelected={(e) => setColor(e)}
                            items={Color.value}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            {I18n.t("Product.Dimension")}
                            <span className="form__title__note"> (*)</span>
                          </label>
                          <SelectProductSize
                            onSelected={(e) => setSize(e)}
                            items={Size.value}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title" >{I18n.t("Product.Provider")}</label>
                          <SelectProvider
                            onSelected={e => setProvider(e)}
                            items={Provider.value}
                            ref={ProviderRef}
                          />
                        </div>
                      </div>
                      {/* <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title" >{I18n.t("Product.Curator")}</label>
                          <SelectCurator
                            onSelected={e => setCurator(e)}
                            items={Curator.value}
                            ref={CuratorRef}
                          />
                        </div>
                      </div> */}
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            {I18n.t("Product.Weight(gram)")}
                            <span className="form__title__note"> (*)</span>
                          </label>
                          <input
                            placeholder=""
                            type="number"
                            className="form-control"
                            value={Weight}
                            onChange={(e) => setWeight(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">{I18n.t("Report.Noted")}</label>
                          <input
                            placeholder=""
                            type="text"
                            className="form-control"
                            value={Description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row pd-3 mb-3" style={{ margin: '0 ' }}>
                      <div className="col-md-12 linecenter">
                        <div class="form-group Vehicle" id='' style={{ paddingTop: '20px' }}>

                          <div class="input-group" >
                            <p
                              className="form-link text-uppercase"
                              style={{ margin: '0 30px 10px 20px' }}
                            >
                              {I18n.t("Product.TypeProduct")}
                              <span className="form__title__note"> (*)</span>
                            </p>
                            <div class="df-al-c">
                              <input type="radio" id="serial" value='1' checked={TypeProduct === 1 ? true : false} onChange={e => setTypeProduct(parseInt(e.target.value))} name="TypeSearch" />
                              <label for="serial" > Có serial</label>
                            </div>
                            <div class="df-al-c">
                              <input type="radio" id="noneserial" value='0' checked={TypeProduct === 0 ? true : false} onChange={e => setTypeProduct(parseInt(e.target.value))} name="TypeSearch" />
                              <label for="noneserial" >Không có serial</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>


                    <div className="row pb-3">
                      <div className="col-md-6">
                        <div className="form-collapse-default mt-4">
                          <div className="row">
                            <a
                              className="form-collapse-link text-uppercase"
                              onClick={(e) => setIsAcctive1(!IsAcctive1)}
                            >
                              {IsAcctive1 ? (
                                <i
                                  className="fa-solid fa-angles-right"
                                  style={{ margin: "0 5px 0 0" }}
                                />
                              ) : (
                                <i
                                  className="fa-solid fa-angles-down"
                                  style={{ margin: "0 5px 0 2px" }}
                                />
                              )}
                              {I18n.t("Product.Setupproductpackaging")}
                              <span className="form__title__note"> (*)</span>
                            </a>
                          </div>
                          {IsAcctive1 ? (
                            ""
                          ) : (
                            <div className="pb-3">
                              <div className="row pb-3">
                                <span className="form-collapse-default-title">
                                  {I18n.t("Product.Fixedunitofmeasure")}
                                </span>
                                <div className="col-md-4">
                                  <SelectProductUnit
                                    onSelected={(e) => {
                                      handleSelectData(1, e, 1);
                                      setUnit(e);
                                    }}
                                    items={Unit.value}
                                  />
                                </div>
                              </div>
                              <div className="form-collapse-default-select">
                                {DataUnit.map((i, k) => {
                                  return (
                                    <div className="row pb-3">
                                      <div className="col-md-2"></div>
                                      <div className="col-md-8">
                                        <label className="form__title">
                                          {I18n.t("ProductAttributeColors.Unit")}
                                        </label>
                                        <Select
                                          options={i.datasl1}
                                          onChange={(e) =>
                                            handleSelectData(i.Id, e, 1)
                                          }
                                          value={i.value1}
                                          isDisabled={i.Id === disable1 || i.Id === disable2 ? true : false}
                                        />
                                      </div>
                                      <div className="col-md-2"></div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-collapse-default mt-4">
                          <div className="row">
                            <a
                              className="form-collapse-link text-uppercase"
                              onClick={(e) => setIsAcctive2(!IsAcctive2)}
                            >
                              {IsAcctive2 ? (
                                <i
                                  className="fa-solid fa-angles-right"
                                  style={{ margin: "0 5px 0 0" }}
                                />
                              ) : (
                                <i
                                  className="fa-solid fa-angles-down"
                                  style={{ margin: "0 5px 0 2px" }}
                                />
                              )}
                              {I18n.t("Product.Productpictures")}
                              <span className="form__title__note"> (*)</span>
                            </a>
                          </div>
                          {IsAcctive2 ? (
                            ""
                          ) : (
                            <div className="row">
                              <div className="col-md-12 pb-3">
                                {Images ? (
                                  <label class="image-collapse-label">
                                    <input
                                      type="file"
                                      className="image-collapse-file"
                                      onChange={onFileChange}
                                      accept="image/*"
                                    />
                                    <img
                                      src={Images === "" ? "" : Images}
                                      className="image-collapse-image"
                                      onChange={onFileChange}
                                    />
                                  </label>
                                ) : (
                                  <label class="image-collapse-label">
                                    <input
                                      type="file"
                                      className="image-collapse-file"
                                      onChange={onFileChange}
                                      accept="image/*"
                                    />
                                    <i className="fa fa-camera upload-file-btn"></i>
                                    <span className="image-collapse-span">
                                      {I18n.t("Product.Uploadimages")}
                                    </span>
                                  </label>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="tab_2_list"
                  role="tabpanel"
                  aria-labelledby="custom-tabs-two-profile-tab"
                >
                  <div className="card-header">
                    <div className="row">
                      <div className="col-md-6">
                        <h3 className="card-title">
                          <i className="fa fa-bars" />
                          <span className="font-weight-bold">
                            {I18n.t("Product.Listofproducts")}({DataProduct.length})
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
                          className="btn btn-warning btn-sm float-right btn-header"
                          onClick={(e) => Exportexcel()}
                        >
                          <i className="fa fa-download mr-2" />
                          {I18n.t("System.Excel")}
                        </a>
                        <a
                          className="btn btn-danger btn-sm float-right btn-header"
                          onClick={(e) => WH_spProduct_Delete(0, 2)}
                        >
                          <i className="fa fa-trash mr-2" />
                          {I18n.t("System.Delete")}
                        </a>
                        <a
                          className="btn btn-primary btn-sm float-right btn-header"
                          onClick={(e) => WH_spProduct_List()}
                        >
                          <i className="fa fa-eye mr-2" />
                          {I18n.t("System.View")}
                        </a>

                      </div>
                    </div>
                  </div>
                  <div className="card-body-form">
                    <div className="row pb-3">
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">{I18n.t("Product.ProductGroups")}</label>
                          <SelectProductGroup
                            onSelected={(e) => setProductsGroup2(e)}
                            items={ProductsGroup2.value}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">{I18n.t("Product.ProductCode")}</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder=""
                            value={ProductCode2.trimStart()}
                            onChange={(e) => setProductCode2(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">{I18n.t("Product.ProductName")}</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder=""
                            value={ProductName2}
                            onChange={(e) => setProductName2(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">{I18n.t("Product.Dimension")}</label>
                          <SelectProductSize
                            onSelected={(e) => setSize2(e)}
                            items={Size2.value}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">Barcode</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder=""
                            value={Barcode2.trim()}
                            onChange={(e) => setBarcode2(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">{I18n.t("Delivery.Creater")}</label>
                          <SelectAccount
                            onSelected={(e) => setCreateName(e)}
                            items={CreateName.value}
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
                  {ViewImg}
                  {ViewQRCode}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div id="Printform" className="content-wrapper pt-2 text-center" style={{ width: "100%", display: "none" }}>

        {/*   mẫu có logo */}
        {/*   {
          PrintdataQRCode.map((item, index) => {
            return (

              <div className="col-md-12" style={{
              height: '430px',
                marginTop: (((index + 1) + 2) % 3) === 0  || (index + 1) ===1 ? '0px' : '80px',
                padding: (((index + 1) + 2) % 3) === 0  || (index + 1) ===1 ? '10px 65px 65px 65px' : '65px 65px 65px 65px',
                pageBreakAfter: ((index + 1) % 3) === 0 ? 'always' : '',
              }}>
                <div className="row">

                  <div className="col-md-6">
                    <QRCodeSVG
                      id={item.ProductCode + 'view'}
                      value={item.ProductCode}
                      size={300}
                    />
                    <h3 className="col-md-12" style={{ textAlign: "center", marginTop: '2px' }}>{item.ProductCode}</h3>
                  </div>
                  <div className="col-md-6">
                    <div style={{ height: '150px', paddingTop: '20px', borderLeft: '1px solid #d4c5c56b' }} ><img src="../../assets/img/logonetconew.png" style={{ height: "80px" }} /></div>
                    <div style={{ height: '150px', paddingTop: '40px', borderLeft: '1px solid #d4c5c56b', borderTop: '1px solid #d4c5c56b' }}><img src="../../assets/img/gdexlogo.jpg" style={{ height: "80px" }} /></div>
                  </div>
                </div>
              </div>
            )
          })
        } */}

        {/*   mẫu không có logo */}
        {
          PrintdataQRCode.map((item, index) => {
            return (

              <div className="col-md-12" style={{
                height: '430px',
                marginTop: (((index + 1) + 2) % 3) === 0 || (index + 1) === 1 ? '0px' : '80px',
                padding: (((index + 1) + 2) % 3) === 0 || (index + 1) === 1 ? '10px 65px 65px 65px' : '65px 65px 65px 65px',
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
            )
          })
        }
      </div>
    </div>
  );
};
