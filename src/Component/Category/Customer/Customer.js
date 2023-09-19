import React, { useState, useEffect, useRef } from "react";
import I18n from "../../../Language";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../Redux/Actions";
import { DataTable } from "../../../Common/DataTable";
import DateTimePicker from "react-datetime-picker";
import {
  SelectArea,
  SelectWarehouse,
  SelectAreaMulti,
  SelectBusinessField,
  SelectCustomerType,
  SelectWarehouseMulti,
  SelectWarehouseAreaMulti,
  SettingColumn,
  SelectCustomer
} from "../../../Common";
import {
  Alertsuccess,
  Alertwarning,
  FormatDateJson,
  ExportExcel,
  ConfirmAlert,
  GetDataFromLogin,
  FirstOrLastDayinMonth
} from "../../../Utils";

export const Customer = () => {
  //#region
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(true);
  const [IsAcctive1, setIsAcctive1] = useState(false);
  const [Title, setTitle] = useState(I18n.t("Customer.Addnewcustomer"));
  const [IsAcctive2, setIsAcctive2] = useState(true);
  const [IsAcctive3, setIsAcctive3] = useState(true);
  const [IsAcctive4, setIsAcctive4] = useState(false);
  const [IsAcctive5, setIsAcctive5] = useState(false);
  const [CustomerId, setCustomerId] = useState(0);
  const [CustomerCode, setCustomerCode] = useState("");
  const [CustomerName, setCustomerName] = useState("");
  const [CustomerEmail, setCustomerEmail] = useState("");
  const [CompanyName, setCompanyName] = useState("");
  const [CompanyPhone, setCompanyPhone] = useState("");
  const [CompanyEmail, setCompanyEmail] = useState("");
  const [CompanyAddress, setCompanyAddress] = useState("");
  const [CustomerType, setCustomerType] = useState({ value: 0, label: "" });
  const [BusinessField, setBusinessField] = useState({ value: 0, label: "" });
  const [BankName, setBankName] = useState("");
  const [BankAccountName, setBankAccountName] = useState("");
  const [BankAccountNumber, setBankAccountNumber] = useState("");
  const [ContactPersonPosition, setContactPersonPosition] = useState("");
  const [ContactPersonPhone, setContactPersonPhone] = useState("");
  const [PayerName, setPayerName] = useState("");
  const [PayerEmail, setPayerEmail] = useState("");
  const [PayerPhone, setPayerPhone] = useState("");
  const [ContractNumber, setContractNumber] = useState("");
  const [ContractExpirationDate, setContractExpirationDate] = useState("");
  const [TaxNumber, setTaxNumber] = useState("");
  const [BillingAddress, setBillingAddress] = useState("");
  const [EstimatedSales, setEstimatedSales] = useState("");
  const [PaymentCycle, setPaymentCycle] = useState("");
  const [CustomerCommission, setCustomerCommission] = useState("");
  const [RevenueDay, setRevenueDay] = useState("");
  const [ManageArea, setManageArea] = useState("");
  const [AreaMulti, setAreaMulti] = useState([]);
  const [WareHouseMulti, setWareHouseMulti] = useState([]);
  const [WareHouseAreaMulti, setWareHouseAreaMulti] = useState([]);
  const [DataWareHouseArea, setDataWareHouseArea] = useState([]);
  const [DataShelves, setDataShelves] = useState([]);
  const [DataLocation, setDataLocation] = useState([]);
  const [Data, setData] = useState([]);
  const [DataCustomer, setDataCustomer] = useState([]);
  const [State, setState] = useState();
  const [Description, setDescription] = useState("");
  const [file, setFile] = useState([]);
  // const [DataDetail, setDataDetail] = useState([]);
  const [IsRun, setIsRun] = useState();
  const Accountinfor = JSON.parse(localStorage.getItem("Accountinfor") === "" ? "{}" : localStorage.getItem("Accountinfor"));
  const [datalocationedit, setdatalocationedit] = useState([]);
  const [SearchArea, setSearchArea] = useState({ value: -1 });
  const [SearchWareHouse, setSearchWareHouse] = useState({ value: -1 });
  const [AreaMulti2, setAreaMulti2] = useState([]);
  const [WareHouseMulti2, setWareHouseMulti2] = useState([]);
  const [WareHouseAreaMulti2, setWareHouseAreaMulti2] = useState([]);
  const [DataWareHouseArea2, setDataWareHouseArea2] = useState([]);
  const [DataShelves2, setDataShelves2] = useState([]);
  const [DataLocation2, setDataLocation2] = useState([]);
  const [CustomerCode2, setCustomerCode2] = useState("");
  const [CustomerTypeId2, setCustomerTypeId2] = useState({ value: 0 });
  const [Checkall, setCheckall] = useState(false);
  const [dataarray, setdataarray] = useState("");
  const fileInput = useRef(null);
  const [CustomerIdStaff, setCustomerIdStaff] = useState({ value: -1 });
  const CustomerIdStaffdRef = useRef();
  const [Warehouse, setWarehouse] = useState({ value: -1 });
  const [CustomerIdStaffSearch, setCustomerIdStaffSearch] = useState({ value: -1 });
  const CustomerIdStaffSearchRef = useRef();
  const WarehouseRef = useRef();
  const [WarehouseTo, setWarehouseTo] = useState({ value: -1 });
  const WarehouseToRef = useRef();
  const [StaffId, setStaffId] = useState(0);
  const [StaffCode, setStaffCode] = useState('');
  const [StaffName, setStaffName] = useState('');
  const [Phone, setPhone] = useState('');
  const [Address, setAddress] = useState('');
  const [Fromdate, setFromdate] = useState(FirstOrLastDayinMonth(new Date(), 1));
  const [Todate, setTodate] = useState(FirstOrLastDayinMonth(new Date()));
  const [DataWareHouseStaff, setDataWareHouseStaff] = useState([]);
  //#region regular expression
  const validEmail = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
  const validPhone = new RegExp(/^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/);
  const validWhiteSpace = new RegExp(/^\S*$/);
  //#endregion
  let datapermisstion = localStorage.getItem("Permissioninfor");//check quyền

  //#region begin using the effect hook
  useEffect(() => {
    WH_spCustomer_Rent(2);
  }, [IsRun]);

  useEffect(() => {
    if (dataarray.keys === "check") {
      CheckOne(dataarray._row.original.CustomerId, dataarray._row.original.IsCheck);
    } else if (dataarray.keys === 'delete') {
      WH_spCustomer_Delete(dataarray._row.value, 1);
    } else if (dataarray.keys === 'checkall') {
      handleCheckAll()
    }
  }, [dataarray]);
  //#endregion


  const ActiverAreaMulti = (e) => {
    if (e === null) {
      setAreaMulti(e);
      setWareHouseMulti([])
      return;
    }
    setAreaMulti([...e]);
  };
  const ActiverWareHouseMulti = (e) => {
    if (e === null) {
      return;
    }
    setWareHouseMulti([...e]);
  };
  const ActiverWareHouseAreaMulti = (e) => {
    if (e === null) {
      return;
    }
    setWareHouseAreaMulti([...e]);
  };

  const ActiverAreaMulti2 = (e) => {
    if (e === null) {
      return;
    }
    setAreaMulti2([...e]);
  };
  const ActiverWareHouseMulti2 = (e) => {
    if (e === null) {
      return;
    }
    setWareHouseMulti2([...e]);
  };
  const ActiverWareHouseAreaMulti2 = (e) => {
    if (e === null) {
      return;
    }
    setWareHouseAreaMulti2([...e]);
  };

  //#region cancel
  const WH_spCustomer_Cancel = () => {
    setTitle("Thêm mới khách hàng");
    setCustomerId(0);
    setCustomerCode("");
    setCustomerName("");
    setCustomerEmail("");
    setCompanyName("");
    setCompanyPhone("");
    setCompanyEmail("");
    setCompanyAddress("");
    setCustomerType({ value: 0 }, { label: "" });
    setBusinessField({ value: 0 }, { label: "" });
    setBankName("");
    setBankAccountName("");
    setBankAccountNumber("");
    setContactPersonPosition("");
    setContactPersonPhone("");
    setPayerName("");
    setPayerEmail("");
    setPayerPhone("");
    setContractNumber("");
    setContractExpirationDate("");
    setTaxNumber("");
    setBillingAddress("");
    setEstimatedSales("");
    setPaymentCycle("");
    setCustomerCommission("");
    setRevenueDay("");
    setManageArea("");
    setDataWareHouseArea([]);
    setDataShelves([]);
    setDataLocation([]);
    setData([]);
    setDataCustomer([]);
    setDescription("");
    setFile([]);
    setAreaMulti([{}]);
    setWareHouseMulti([{}]);
    setWareHouseAreaMulti([{}]);
    setShowUpload(true)
  };
  //#endregion

  //#region edit
  const WH_spCustomer_Edit = (item) => {
    setTitle("Thay đổi thông tin khách hàng");
    const data = item.row._original;
    try {
      setCustomerId(data.CustomerId);
      setCustomerCode(data.CustomerCode);
      setCustomerName(data.CustomerName);
      setCustomerEmail(data.CustomerEmail);
      setCompanyName(data.CompanyName);
      setCompanyAddress(data.CompanyAddress);
      setCompanyPhone(data.CompanyPhone);
      setCompanyEmail(data.CompanyEmail);
      setCustomerType({ value: data.CustomerTypeId, label: data.CustomerTypeName, });
      setBusinessField({ value: data.BusinessFieldId, label: data.BusinessFieldName, });
      setBankName(data.BankName);
      setBankAccountName(data.BankAccountName);
      setBankAccountNumber(data.BankAccountNumber);
      setContactPersonPosition(data.ContactPersonPosition);
      setContactPersonPhone(data.ContactPersonPhone);
      setPayerName(data.PayerName);
      setPayerEmail(data.PayerEmail);
      setPayerPhone(data.PayerPhone);
      setContractNumber(data.ContractNumber);
      setContractExpirationDate(data.ContractExpirationDate ? new Date(data.ContractExpirationDate) : "");
      setTaxNumber(data.TaxNumber);
      setBillingAddress(data.BillingAddress);
      setEstimatedSales(data.EstimatedSales);
      setPaymentCycle(data.PaymentCycle);
      setCustomerCommission(data.CustomerCommission);
      setRevenueDay(data.RevenueDay ? new Date(data.RevenueDay) : "");
      setDescription(data.Description);
      WH_spCustomer_ListRent(data.CustomerId);
      setFile(data.LinkFile ? data?.LinkFile?.split(';') : "");
      { data.LinkFile ? setShowUpload(false) : setShowUpload(true) }
      document.getElementById("tab_1").click();
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#endregion
  const handleClick = () => {
    fileInput.current.click();
  };

  const [showUpload, setShowUpload] = useState(true);
  const handleUpload = async (event) => {
    let _file = [...event.target.files]
    const formData = new FormData();
    formData.append("AppAPIKey", "netcoApikey2025");
    for (let i = 0; i < _file.length; i++) {
      formData.append("file" + i, _file[i]);
    }
    formData.append("Key", "CTM");
    const data = await mainAction.API_spCallPostImage(formData, dispatch);
    setFile([...file, data.Message.replaceAll('"', '').replaceAll('\\\\', '/').replaceAll('[', '').replaceAll(']', '').replaceAll(',', ';')])
    setShowUpload(false)
  };

  const cleanInput = (item) => {
    let _fileNew = [];
    if (typeof item.item === 'string') {
      _fileNew = file.filter(e => e !== item.item)
    }
    setFile(_fileNew);
    if (_fileNew.length === 0) {
      setShowUpload(true)
    }
  }

  //#region save
  const WH_spCustomer_Save = async () => {
    //kiem tra quyen luu
    if (datapermisstion !== "") {
      let a = JSON.parse(datapermisstion);
      let b = a.find(p => p.WH_tblMenuModuleId === 61 && p.Adds === 'C')
      if (b === undefined) {
        Alertwarning(I18n.t("validate.Youdonothavepermissiontocreatecustomers!"));
        return;
      }
    }

    try {
      if (CustomerCode === "") {
        Alertwarning(I18n.t("validate.Pleaseentercustomercode"));
        return;
      }
      if (CustomerName === "") {
        Alertwarning(I18n.t("validate.Pleaseentercustomername"));
        return;
      }
      if (!validWhiteSpace.test(CustomerEmail)) {
        Alertwarning(I18n.t("validate.Pleaseentercustomeremail"));
        return;
      }
      if (CustomerEmail !== "" && !validEmail.test(CustomerEmail)) {
        Alertwarning(I18n.t("validate.Customeremailisnotinthecorrectformat"));
        return;
      }
      if (CompanyPhone !== "" && !validPhone.test(CompanyPhone)) {
        Alertwarning(I18n.t("validate.Companyphonenumberisnotinthecorrectformat"));
        return;
      }
      if (!validWhiteSpace.test(CompanyEmail)) {
        Alertwarning(I18n.t("validate.Companyemailmustnotcontainspaces"));
        return;
      }

      if (CompanyEmail !== "" && !validEmail.test(CompanyEmail)) {
        Alertwarning(I18n.t("validate.Companyemailisnotinthecorrectformat"));
        return;
      }
      if (ContactPersonPhone !== "" && !validPhone.test(ContactPersonPhone)) {
        Alertwarning(I18n.t("validate.Contactnumberisnotinthecorrectformat"));
        return;
      }
      if (!validWhiteSpace.test(PayerEmail)) {
        Alertwarning(I18n.t("validate.Payeremailmustnotcontainspaces"));
        return;
      }

      if (PayerEmail !== "" && !validEmail.test(PayerEmail)) {
        Alertwarning(I18n.t("validate.Thepayeremailisnotinthecorrectformat"));
        return;
      }
      if (PayerPhone !== "" && !validPhone.test(PayerPhone)) {
        Alertwarning(I18n.t("validate.Thepayerphonenumberisnotinthecorrectformat"));
        return;
      }
      if (AreaMulti.length <= 0 || AreaMulti[0].value === undefined) {
        // Alertwarning(I18n.t("validate.Pleaseselectregion"));
        return;
      }
      if (WareHouseMulti.length <= 0 || WareHouseMulti[0].value === undefined) {
        Alertwarning(I18n.t("validate.Pleaseselectawarehouse"));
        return;
      }
      if (WareHouseAreaMulti?.length <= 0 || WareHouseAreaMulti[0]?.value === undefined) {
        Alertwarning(I18n.t("validate.Pleaseselectawarehousearea"));
        return;
      }
      if (Data?.length <= 0) {
        Alertwarning(I18n.t("validate.Pleaseconfirmthearea"));
        return;
      }

      let ar = [];
      let DataFillter = Data.filter((e) => e.IsCheck === true);
      if (DataFillter === undefined) {
        Alertwarning(I18n.t("validate.Pleaseselectthelocationyourent"));
        return;
      }
      if (DataFillter !== undefined && DataFillter?.length <= 0) {
        Alertwarning(I18n.t("validate.Pleaseselectthelocationyourent"));
        return;
      }
      DataFillter.forEach((item, key) => {
        ar.push({
          WareHouseLocationId: item.LocationId,
          WareHouseFloorId: item.FloorId,
          WareHouseShelvesId: item.ShelvesId,
          WareHouseAreId: item.WareHouseAreaId,
          WareHouseId: item.WareHouseId,
          AreaId: item.AreaId,
        });
      });

      let linkFiles = "";
      file !== undefined && file !== "" && file.forEach(e => {
        linkFiles += e + ";"
      })

      setDisable(false);
      const pr = {
        CustomerId: CustomerId,
        CustomerCode: CustomerCode.trim(),
        CustomerName: CustomerName.trim(),
        CustomerEmail: CustomerEmail.trim(),
        CompanyName: CompanyName.trim(),
        CompanyAddress: CompanyAddress.trim(),
        CompanyPhone: CompanyPhone.trim(),
        CompanyEmail: CompanyEmail.trim(),
        CustomerTypeId: CustomerType?.value,
        CustomerTypeName: CustomerType?.label,
        BusinessFieldId: BusinessField?.value,
        BusinessFieldName: BusinessField?.label,
        BankName: BankName.trim(),
        BankAccountName: BankAccountName.trim(),
        BankAccountNumber: BankAccountNumber.trim(),
        ContactPersonPosition: ContactPersonPosition.trim(),
        ContactPersonPhone: ContactPersonPhone.trim(),
        PayerName: PayerName.trim(),
        PayerEmail: PayerEmail.trim(),
        PayerPhone: PayerPhone.trim(),
        ContractNumber: ContractNumber.trim(),
        ContractExpirationDate: FormatDateJson(ContractExpirationDate),
        TaxNumber: TaxNumber.trim(),
        BillingAddress: BillingAddress.trim(),
        EstimatedSales: EstimatedSales.trim(),
        PaymentCycle: PaymentCycle.trim(),
        CustomerCommission: CustomerCommission.trim(),
        RevenueDay: FormatDateJson(RevenueDay),
        ManageAreaId: ManageArea?.value,
        ManageAreaName: ManageArea?.label,
        Description: Description.toString().replaceAll('"', "'").trim(),
        CreateId: Accountinfor?.AccountId,
        CreateName: Accountinfor?.AccountName,
        LinkFile: linkFiles.slice(0, -1),
        Location: ar,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "WH_spCustomer_Save",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        WH_spCustomer_Cancel();
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

  //#region list
  const WH_spCustomer_List = async () => {
    //kiem tra quyen xem
    if (datapermisstion !== "") {
      let a = JSON.parse(datapermisstion);
      let b = a.find(p => p.WH_tblMenuModuleId === 61 && p.Views === 'C')
      if (b === undefined) {
        Alertwarning(I18n.t("validate.Youdonothavepermissiontoviewtheclient!"));
        return;
      }
    }
    try {
      const params = {
        Json: JSON.stringify({
          CustomerId: 0,
          AreaId: SearchArea.value,
          WareHouseId: SearchWareHouse.value,
          CustomerCode: CustomerCode2.trim(),
          CustomerTypeId: CustomerTypeId2.value,
          AccountId: Accountinfor.AccountId,
          AccountName: Accountinfor.AccountName,
        }),
        func: "WH_spCustomer_List",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length > 0) {
        const temp = result.map((item, index) => {
          const arrLink = item?.LinkFile?.split(";");
          const arrDone = [];
          if (arrLink?.length > 0) {
            arrLink.map((i, index2) => {
              if (i.length > 0) {
                arrDone.push(i);
              }
            });
          }
          if (arrDone.length > 0) {
            return { ...item, LinkFile: arrDone };
          } else {
            return { ...item };
          }
        });
        setDataCustomer(result);
        setData(result);
      } else {
        Alertwarning(I18n.t("Report.NoData"));
        setDataCustomer([]);
        setData([]);
      }
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#endregion

  //#region delete
  const WH_spCustomer_Delete = (id, key) => {

    //kttra quyền xóa
    if (datapermisstion !== "") {
      let a = JSON.parse(datapermisstion);
      let b = a.find(p => p.WH_tblMenuModuleId === 61 && p.Deletes === 'C')
      if (b === undefined) {
        Alertwarning(I18n.t("validate.Youdonothavetherighttodeletecustomers!"));
        return;
      }

    }
    let check = DataCustomer.filter((a) => a.IsCheck === true);
    if (id === 0 && check.length === 0) {
      Alertwarning(I18n.t("validate.Pleasechoosetodelete!"));
      return;
    }
    try {
      ConfirmAlert("", "Are you sure you want to delete?", async () => {
        const ar = [];
        if (key === 1) {
          ar.push({
            CustomerId: id,
            AccountId: Accountinfor.AccountId,
            AccountName: Accountinfor.AccountName,
          });
        }
        if (key === 2) {
          let data = DataCustomer.filter((a) => a.IsCheck === true);
          data.forEach((element) => {
            ar.push({
              CustomerId: element.CustomerId,
              AccountId: Accountinfor.AccountId,
              AccountName: Accountinfor.AccountName,
            });
          });
        }
        const params = {
          Json: JSON.stringify({ ListId: ar }),
          func: "WH_spCustomer_Delete",
        };
        const result = await mainAction.API_spCallServer(params, dispatch);
        if (result.Status === "OK") {
          if (key === 1) {
            setDataCustomer(DataCustomer.filter(a => a.CustomerId !== id))
          }
          if (key === 2) {
            setDataCustomer(DataCustomer.filter(a => a.IsCheck !== true))
          }
          Alertsuccess(result.ReturnMess);
        }
      })
    } catch (error) { }
  };
  //#endregion

  //#region xác nhận khu vực khách hàng thuê
  const WH_spCustomer_Rent = async (type) => {
    try {
      let _ar = WareHouseAreaMulti.filter((e) => e.value);
      let ar = [];

      _ar.forEach((item, key) => {
        ar.push({
          WareHouseAreaId: item.value,
        });
      });

      const params = {
        Json: JSON.stringify({
          CustomerRent: ar,
        }),
        func: "WH_spCustomer_Rent",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);

      const _WareHouseArea = Object.values(
        result.reduce(
          (
            a,
            {
              WareHouseAreaId,
              WareHouseAreaName,
              WareHouseName,
              Name,
              ShelvesId,
              FloorId,
            }
          ) => {
            a[WareHouseAreaId] = a[WareHouseAreaId] || {
              WareHouseAreaId: WareHouseAreaId,
              WareHouseAreaName: WareHouseAreaName,
              WareHouseName: WareHouseName,
              Name: Name,
              ShelvesId: ShelvesId,
              FloorId: FloorId,
            };
            return a;
          },
          {}
        )
      );

      const _Shelves = Object.values(
        result.reduce(
          (
            a,
            {
              ShelvesId,
              ShelvesName,
              WareHouseAreaId,
              FloorId,
              FloorName,
              LocationId,
            }
          ) => {
            a[FloorId] = a[FloorId] || {
              ShelvesId: ShelvesId,
              ShelvesName: ShelvesName,
              WareHouseAreaId: WareHouseAreaId,
              FloorId: FloorId,
              FloorName: FloorName,
              LocationId: LocationId,
            };
            return a;
          },
          {}
        )
      );

      const _Location = Object.values(
        result.reduce(
          (
            a,
            { LocationId, LocationName, FloorId, ShelvesId, WareHouseAreaId }
          ) => {
            a[LocationId] = a[LocationId] || {
              LocationId: LocationId,
              LocationName: LocationName,
              FloorId: FloorId,
              ShelvesId: ShelvesId,
              WareHouseAreaId: WareHouseAreaId,
            };
            return a;
          }, {}
        )
      );

      if (type == 2) {
        datalocationedit.map((a) => {
          result.find((e) => e.LocationId === a.LocationId).IsCheck = true;
          _Location.find((e) => e.LocationId === a.LocationId).IsCheck = true;
        });
      }
      setDataWareHouseArea(_WareHouseArea);
      setDataShelves(_Shelves);
      setDataLocation(_Location);
      setData(result);
      setState({ data: Data }, { data2: DataLocation });
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#endregion

  //#region sửa khu vực khách hàng thuê
  const WH_spCustomer_ListRent = async (CustomerId) => {
    try {
      const params = {
        Json: JSON.stringify({
          CustomerId: CustomerId,
          UserId: Accountinfor.AccountId,
        }),
        func: "WH_spCustomer_ListRent",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      const dataUpdate = {
        AreaIds: [],
        WareHouseIds: [],
        WareHouseAreaIds: [],
        ShelvesIds: [],
        FloorIds: [],
      };

      for (let i = 0; i < result.length; i++) {
        const element = result[i];
        const check = dataUpdate.AreaIds.find(
          (x) => x.value === element.AreaId
        );
        const checkWareHouseId = dataUpdate.WareHouseIds.find(
          (x) => x.value === element.WareHouseId
        );
        const checkWareHouseAreaId = dataUpdate.WareHouseAreaIds.find(
          (x) => x.value === element.WareHouseAreaId
        );
        const checkShelvesId = dataUpdate.ShelvesIds.find(
          (x) => x.value === element.ShelvesId
        );
        const checkFloorId = dataUpdate.FloorIds.find(
          (x) => x.value === element.FloorId
        );
        if (!check) {
          dataUpdate.AreaIds.push({ value: element.AreaId });
        }
        if (!checkWareHouseId) {
          dataUpdate.WareHouseIds.push({ value: element.WareHouseId });
        }
        if (!checkWareHouseAreaId) {
          dataUpdate.WareHouseAreaIds.push({ value: element.WareHouseAreaId });
        }
        if (!checkShelvesId) {
          dataUpdate.ShelvesIds.push({ value: element.ShelvesId });
        }
        if (!checkFloorId) {
          dataUpdate.FloorIds.push({ value: element.FloorId });
        }
      }

      setWareHouseAreaMulti(dataUpdate.WareHouseAreaIds);
      setWareHouseMulti(dataUpdate.WareHouseIds);
      setAreaMulti(dataUpdate.AreaIds);
      setdatalocationedit(result);
      setIsRun(result);

      const _WareHouseArea = Object.values(
        result.reduce(
          (
            a,
            {
              WareHouseAreaId,
              WareHouseAreaName,
              WareHouseName,
              Name,
              ShelvesId,
              FloorId,
            }
          ) => {
            a[WareHouseAreaId] = a[WareHouseAreaId] || {
              WareHouseAreaId: WareHouseAreaId,
              WareHouseAreaName: WareHouseAreaName,
              WareHouseName: WareHouseName,
              Name: Name,
              ShelvesId: ShelvesId,
              FloorId: FloorId,
            };
            return a;
          },
          {}
        )
      );
      const _Shelves = Object.values(
        result.reduce(
          (
            a,
            {
              ShelvesId,
              ShelvesName,
              WareHouseAreaId,
              FloorId,
              FloorName,
              LocationId,
            }
          ) => {
            a[FloorId] = a[FloorId] || {
              ShelvesId: ShelvesId,
              ShelvesName: ShelvesName,
              WareHouseAreaId: WareHouseAreaId,
              FloorId: FloorId,
              FloorName: FloorName,
              LocationId: LocationId,
            };
            return a;
          },
          {}
        )
      );

      const _Location = Object.values(
        result.reduce(
          (
            a,
            { LocationId, LocationName, FloorId, ShelvesId, WareHouseAreaId }
          ) => {
            a[LocationId] = a[LocationId] || {
              LocationId: LocationId,
              LocationName: LocationName,
              FloorId: FloorId,
              ShelvesId: ShelvesId,
              WareHouseAreaId: WareHouseAreaId,
            };
            return a;
          },
          {}
        )
      );
      setDataWareHouseArea(_WareHouseArea);
      setDataShelves(_Shelves);
      setDataLocation(_Location);
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#endregion

  const WH_spCustomer_Detail = async (CustomerId) => {
    try {
      const params = {
        Json: JSON.stringify({
          CustomerId: CustomerId,
          UserId: Accountinfor.AccountId,
        }),
        func: "WH_spCustomer_Detail",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      const dataUpdate = {
        AreaIds: [],
        WareHouseIds: [],
        WareHouseAreaIds: [],
        ShelvesIds: [],
        FloorIds: [],
      };

      for (let i = 0; i < result.length; i++) {
        const element = result[i];
        const check = dataUpdate.AreaIds.find(
          (x) => x.value === element.AreaId
        );
        const checkWareHouseId = dataUpdate.WareHouseIds.find(
          (x) => x.value === element.WareHouseId
        );
        const checkWareHouseAreaId = dataUpdate.WareHouseAreaIds.find(
          (x) => x.value === element.WareHouseAreaId
        );
        const checkShelvesId = dataUpdate.ShelvesIds.find(
          (x) => x.value === element.ShelvesId
        );
        const checkFloorId = dataUpdate.FloorIds.find(
          (x) => x.value === element.FloorId
        );
        if (!check) {
          dataUpdate.AreaIds.push({ value: element.AreaId });
        }
        if (!checkWareHouseId) {
          dataUpdate.WareHouseIds.push({ value: element.WareHouseId });
        }
        if (!checkWareHouseAreaId) {
          dataUpdate.WareHouseAreaIds.push({ value: element.WareHouseAreaId });
        }
        if (!checkShelvesId) {
          dataUpdate.ShelvesIds.push({ value: element.ShelvesId });
        }
        if (!checkFloorId) {
          dataUpdate.FloorIds.push({ value: element.FloorId });
        }
      }

      const _WareHouseArea = Object.values(
        result.reduce(
          (
            a,
            {
              WareHouseAreaId,
              WareHouseAreaName,
              WareHouseName,
              Name,
              ShelvesId,
              FloorId,
            }
          ) => {
            a[WareHouseAreaId] = a[WareHouseAreaId] || {
              WareHouseAreaId: WareHouseAreaId,
              WareHouseAreaName: WareHouseAreaName,
              WareHouseName: WareHouseName,
              Name: Name,
              ShelvesId: ShelvesId,
              FloorId: FloorId,
            };
            return a;
          },
          {}
        )
      );
      const _Shelves = Object.values(
        result.reduce(
          (
            a,
            {
              ShelvesId,
              ShelvesName,
              WareHouseAreaId,
              FloorId,
              FloorName,
              LocationId,
            }
          ) => {
            a[FloorId] = a[FloorId] || {
              ShelvesId: ShelvesId,
              ShelvesName: ShelvesName,
              WareHouseAreaId: WareHouseAreaId,
              FloorId: FloorId,
              FloorName: FloorName,
              LocationId: LocationId,
            };
            return a;
          },
          {}
        )
      );

      const _Location = Object.values(
        result.reduce(
          (
            a,
            { LocationId, LocationName, FloorId, ShelvesId, WareHouseAreaId }
          ) => {
            a[LocationId] = a[LocationId] || {
              LocationId: LocationId,
              LocationName: LocationName,
              FloorId: FloorId,
              ShelvesId: ShelvesId,
              WareHouseAreaId: WareHouseAreaId,
            };
            return a;
          },
          {}
        )
      );

      // setDataDetail(result);
      setWareHouseAreaMulti2(dataUpdate.WareHouseAreaIds);
      setWareHouseMulti2(dataUpdate.WareHouseIds);
      setAreaMulti2(dataUpdate.AreaIds);
      setDataWareHouseArea2(_WareHouseArea);
      setDataShelves2(_Shelves);
      setDataLocation2(_Location);
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };

  //#region chọn location
  const handleSelectLocationName = (item) => {
    if (item.IsCheck === undefined) {
      item.IsCheck = false;
    }
    Data.find((e) => e.LocationId === item.LocationId).IsCheck = !item.IsCheck;
    DataLocation.find((e) => e.LocationId === item.LocationId).IsCheck =
      !item.IsCheck;
    setState({ data: Data }, { data2: DataLocation });
  };
  //#endregion

  //#region checkbox
  const CheckOne = (Id, Check, key) => {
    if (Check === undefined) Check = false;
    if (key === 2) {
      Data.find((p) => p.FloorId == Id).IsCheck = !Check;
      DataShelves.find((p) => p.FloorId == Id).IsCheck = !Check;

      let ar1 = Data.filter((e) => e.FloorId === Id);
      let ar2 = DataLocation.filter((e) => e.FloorId === Id);
      ar1.forEach((e) => {
        e.IsCheck = !Check;
      });
      ar2.forEach((e) => {
        e.IsCheck = !Check;
      });
      setState({ data: Data, data2: DataShelves, dt3: DataLocation });
      return;
    }
    else {
      let _DataList = [...DataCustomer]
      _DataList.find((p) => p.CustomerId == Id).IsCheck = !Check
      setDataCustomer(_DataList)
    }
  };

  const handleCheckAll = () => {
    let _DataList = [...DataCustomer]
    _DataList.forEach(i => { i.IsCheck = !Checkall })
    setCheckall(!Checkall)
    setDataCustomer(_DataList);
  }

  //#endregion

  //#region data table
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
      accessor: "CustomerId",
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
              id={row.original.CustomerId}
              key={row.original.CustomerId}
              value={row.original.CustomerId}
              checked={row.original.IsCheck}
              onChange={(e) => setdataarray({ _row: row, keys: "check" })}
            />
            <label
              className="label checkbox"
              htmlFor={row.original.CustomerId}
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
      accessor: "CustomerId",
      special: true,
      show: true,
      Cell: (row) => (
        <span>
          <button
            data-tooltip={I18n.t("AccountGroup.Detail")}
            className="btn btn-sm btn-info mr-2 show__tip__left"
            data-toggle="modal"
            data-target="#myModal2"
            onClick={(e) => WH_spCustomer_Detail(row.value)}
          >
            <i className="fa-solid fa-eye"></i>
            {/* Chi tiết */}
          </button>
          <button
            data-tooltip={I18n.t("AccountGroup.Edit")}
            className="btn btn-sm btn-success mr-2 show__tip__left"
            onClick={(e) => WH_spCustomer_Edit(row)}
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
      Header: I18n.t("Customer.CustomerCode"),
      accessor: "CustomerCode",
      width: 150,
    },
    {
      Header: I18n.t("Customer.CustomerName"),
      accessor: "CustomerName",
      width: 150,
    },
    {
      Header: I18n.t("Leftmenu.CustomerEmail"),
      accessor: "CustomerEmail",
      width: 150,
    },
    {
      Header: I18n.t("Customer.CompanyName"),
      accessor: "CompanyName",
      width: 150,
    },
    {
      Header: I18n.t("Customer.CompanyAddress"),
      accessor: "CompanyAddress",
      width: 150,
    },
    {
      Header: I18n.t("Customer.CompanyPhone"),
      accessor: "CompanyPhone",
      width: 150,
    },
    {
      Header: I18n.t("Customer.CompanyEmail"),
      accessor: "CompanyEmail",
      width: 150,
    },
    {
      Header: I18n.t("Customer.CustomerTypeName"),
      accessor: "CustomerTypeName",
      width: 150,
    },
    {
      Header: I18n.t("Customer.Businessareas"),
      accessor: "BusinessFieldName",
      width: 150,
    },
    {
      Header: I18n.t("Customer.BankName"),
      accessor: "BankName",
      width: 150,
    },
    {
      Header: I18n.t("Customer.BankAccountName"),
      accessor: "BankAccountName",
      width: 150,
    },
    {
      Header: I18n.t("Customer.BankAccountNumber"),
      accessor: "BankAccountNumber",
      width: 150,
    },
    {
      Header: I18n.t("Customer.ContactPersonPosition"),
      accessor: "ContactPersonPosition",
      width: 180,
    },
    {
      Header: I18n.t("ProductAttributeColors.ContactPersonPhone"),
      accessor: "ContactPersonPhone",
      width: 150,
    },
    {
      Header: I18n.t("Customer.PayerName"),
      accessor: "PayerName",
      width: 180,
    },
    {
      Header: I18n.t("Customer.PayerEmail"),
      accessor: "PayerEmail",
      width: 180,
    },
    {
      Header: I18n.t("ProductAttributeColors.ContactPersonPhone"),
      accessor: "PayerPhone",
      width: 180,
    },
    {
      Header: I18n.t("Customer.ContractNumber"),
      accessor: "ContractNumber",
      width: 150,
    },
    {
      Header: I18n.t("Customer.Expirydate"),
      accessor: "ContractExpirationDate",
      Cell: (obj) => FormatDateJson(obj.value),
      width: 150,
    },
    {
      Header: I18n.t("Customer.Taxcode"),
      accessor: "TaxNumber",
      width: 150,
    },
    {
      Header: I18n.t("Customer.Invoiceaddress"),
      accessor: "BillingAddress",
      width: 150,
    },
    {
      Header: I18n.t("Customer.EstimatedSales"),
      accessor: "EstimatedSales",
      width: 160,
    },
    {
      Header: I18n.t("Customer.PaymentCycle"),
      accessor: "PaymentCycle",
      width: 160,
    },
    {
      Header: I18n.t("Customer.Customercommission(%)"),
      accessor: "CustomerCommission",
      width: 180,
    },
    {
      Header: I18n.t("Customer.Revenueday"),
      accessor: "RevenueDay",
      Cell: (obj) => FormatDateJson(obj.value),
      width: 150,
    },
    {
      Header: I18n.t("Customer.LinkFile"),
      accessor: "LinkFile",
      width: 200,
      Cell: (row) => {
        const data = row.original.LinkFile?.split(";")
        if (row.original.LinkFile === "") {
          return (
            <></>
          )
        } else {
          return (
            <>
              {data?.map((item, index) => {
                if (data.length > 0 && data !== undefined) {
                  return (
                    <div style={{ display: 'inline-block' }}>
                      <a className="pr-2" target="_blank" href={"http://api-warehouse.vps.vn" + item}>File-{index + 1}</a>
                    </div>
                  );
                }
              })}
            </>
          )
        }
      }
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
  ]);
  //#endregion

  const Exportexcel = () => {

    //kiem tra quyen Excel
    if (datapermisstion !== "") {
      let a = JSON.parse(datapermisstion);
      let b = a.find(p => p.WH_tblMenuModuleId === 612 && p.Excel === 'C')
      if (b === undefined) {
        Alertwarning(I18n.t("validate.YoudonothavepermissiontoexportExcel!"));
        return;
      }
    }
    if (DataCustomer.length === 0) {
      Alertwarning(I18n.t("ImportRatioCustomerReport.Noexceldatayet"));
      return;
    }
    const newData = DataCustomer.map((element) => {
      return {
        "Mã khách hàng": element.CustomerCode,
        "Tên khách hàng": element.CustomerName,
        "Email khách hàng": element.CustomerEmail,
        "Tên công ty": element.CompanyName,
        "Địa chỉ công ty": element.CompanyAddress,
        "SĐT công ty": element.CompanyPhone,
        "Email công ty": element.CompanyEmail,
        "Loại khách hàng": element.CustomerTypeName,
        "Lĩnh vực kinh doanh": element.BusinessFieldName,
        "Tên ngân hàng": element.BankName,
        "Tên tài khoản": element.BankAccountName,
        "Số tài khoản": element.BankAccountNumber,
        "Chức vụ người liên hệ": element.ContactPersonPosition,
        "SĐT người liên hệ": element.ContactPersonPhone,
        "Tên người thanh toán": element.PayerName,
        "Email người thanh toán": element.PayerEmail,
        "SĐT người thanh toán": element.PayerPhone,
        "Số hợp đồng": element.ContractNumber,
        "Ngày hết hạn HĐ": FormatDateJson(element.ContractExpirationDate),
        "Mã số thuế": element.TaxNumber,
        "Địa chỉ hoá đơn": element.BillingAddress,
        "Doanh số ước tính": element.EstimatedSales,
        "Chu kỳ thanh toán": element.PaymentCycle,
        "Hoa hồng khách hàng (%)": element.CustomerCommission,
        "Ngày doanh thu": FormatDateJson(element.RevenueDay),
        "Link File": element.LinkFile,
        "Người tạo": element.CreateName,
        "Ngày tạo": FormatDateJson(element.CreateTime),
        "Người sửa": element.EditName,
        "Ngày sửa": FormatDateJson(element.EditTime),
        "Ghi chú": element.Description,
      };
    });
    newData.forEach(function (x) {
      if (columns.find((a) => a.accessor == "CustomerCode") === undefined) {
        delete x["Mã khách hàng"];
      } else if (
        columns.find((a) => a.accessor === "CustomerCode").show === false
      ) {
        delete x["Mã khách hàng"];
      }
      if (columns.find((a) => a.accessor == "CustomerName") === undefined) {
        delete x["Tên khách hàng"];
      } else if (
        columns.find((a) => a.accessor === "CustomerName").show === false
      ) {
        delete x["Tên khách hàng"];
      }
      if (columns.find((a) => a.accessor == "CustomerEmail") === undefined) {
        delete x["Email khách hàng"];
      } else if (
        columns.find((a) => a.accessor === "CustomerEmail").show === false
      ) {
        delete x["Email khách hàng"];
      }
      if (columns.find((a) => a.accessor == "CompanyName") === undefined) {
        delete x["Tên công ty"];
      } else if (
        columns.find((a) => a.accessor === "CompanyName").show === false
      ) {
        delete x["Tên công ty"];
      }
      if (columns.find((a) => a.accessor == "CompanyAddress") === undefined) {
        delete x["Địa chỉ công ty"];
      } else if (
        columns.find((a) => a.accessor === "CompanyAddress").show === false
      ) {
        delete x["Địa chỉ công ty"];
      }
      if (columns.find((a) => a.accessor == "CompanyPhone") === undefined) {
        delete x["SĐT công ty"];
      } else if (
        columns.find((a) => a.accessor === "CompanyPhone").show === false
      ) {
        delete x["SĐT công ty"];
      }
      if (columns.find((a) => a.accessor == "CompanyEmail") === undefined) {
        delete x["Email công ty"];
      } else if (
        columns.find((a) => a.accessor === "CompanyEmail").show === false
      ) {
        delete x["Email công ty"];
      }
      if (columns.find((a) => a.accessor == "CustomerTypeName") === undefined) {
        delete x["Loại khách hàng"];
      } else if (
        columns.find((a) => a.accessor === "CustomerTypeName").show === false
      ) {
        delete x["Loại khách hàng"];
      }
      if (
        columns.find((a) => a.accessor == "BusinessFieldName") === undefined
      ) {
        delete x["Lĩnh vực kinh doanh"];
      } else if (
        columns.find((a) => a.accessor === "BusinessFieldName").show === false
      ) {
        delete x["Lĩnh vực kinh doanh"];
      }
      if (columns.find((a) => a.accessor == "BankName") === undefined) {
        delete x["Tên ngân hàng"];
      } else if (
        columns.find((a) => a.accessor === "BankName").show === false
      ) {
        delete x["Tên ngân hàng"];
      }
      if (columns.find((a) => a.accessor == "BankAccountName") === undefined) {
        delete x["Tên tài khoản"];
      } else if (
        columns.find((a) => a.accessor === "BankAccountName").show === false
      ) {
        delete x["Tên tài khoản"];
      }
      if (
        columns.find((a) => a.accessor == "BankAccountNumber") === undefined
      ) {
        delete x["Số tài khoản"];
      } else if (
        columns.find((a) => a.accessor === "BankAccountNumber").show === false
      ) {
        delete x["Số tài khoản"];
      }
      if (
        columns.find((a) => a.accessor == "ContactPersonPosition") === undefined
      ) {
        delete x["Chức vụ người liên hệ"];
      } else if (
        columns.find((a) => a.accessor === "ContactPersonPosition").show ===
        false
      ) {
        delete x["Chức vụ người liên hệ"];
      }
      if (
        columns.find((a) => a.accessor == "ContactPersonPhone") === undefined
      ) {
        delete x["SĐT người liên hệ"];
      } else if (
        columns.find((a) => a.accessor === "ContactPersonPhone").show === false
      ) {
        delete x["SĐT người liên hệ"];
      }
      if (columns.find((a) => a.accessor == "PayerName") === undefined) {
        delete x["Tên người thanh toán"];
      } else if (
        columns.find((a) => a.accessor === "PayerName").show === false
      ) {
        delete x["Tên người thanh toán"];
      }
      if (columns.find((a) => a.accessor == "PayerEmail") === undefined) {
        delete x["Email người thanh toán"];
      } else if (
        columns.find((a) => a.accessor === "PayerEmail").show === false
      ) {
        delete x["Email người thanh toán"];
      }
      if (columns.find((a) => a.accessor == "PayerPhone") === undefined) {
        delete x["SĐT người thanh toán"];
      } else if (
        columns.find((a) => a.accessor === "PayerPhone").show === false
      ) {
        delete x["SĐT người thanh toán"];
      }
      if (columns.find((a) => a.accessor == "ContractNumber") === undefined) {
        delete x["Số hợp đồng"];
      } else if (
        columns.find((a) => a.accessor === "ContractNumber").show === false
      ) {
        delete x["Số hợp đồng"];
      }
      if (
        columns.find((a) => a.accessor == "ContractExpirationDate") ===
        undefined
      ) {
        delete x["Ngày hết hạn HĐ"];
      } else if (
        columns.find((a) => a.accessor === "ContractExpirationDate").show ===
        false
      ) {
        delete x["Ngày hết hạn HĐ"];
      }
      if (columns.find((a) => a.accessor == "TaxNumber") === undefined) {
        delete x["Mã số thuế"];
      } else if (
        columns.find((a) => a.accessor === "TaxNumber").show === false
      ) {
        delete x["Mã số thuế"];
      }
      if (columns.find((a) => a.accessor == "BillingAddress") === undefined) {
        delete x["Địa chỉ hoá đơn"];
      } else if (
        columns.find((a) => a.accessor === "BillingAddress").show === false
      ) {
        delete x["Địa chỉ hoá đơn"];
      }
      if (columns.find((a) => a.accessor == "EstimatedSales") === undefined) {
        delete x["Doanh số ước tính"];
      } else if (
        columns.find((a) => a.accessor === "EstimatedSales").show === false
      ) {
        delete x["Doanh số ước tính"];
      }
      if (columns.find((a) => a.accessor == "PaymentCycle") === undefined) {
        delete x["Chu kỳ thanh toán"];
      } else if (
        columns.find((a) => a.accessor === "PaymentCycle").show === false
      ) {
        delete x["Chu kỳ thanh toán"];
      }
      if (
        columns.find((a) => a.accessor == "CustomerCommission") === undefined
      ) {
        delete x["Hoa hồng khách hàng (%)"];
      } else if (
        columns.find((a) => a.accessor === "CustomerCommission").show === false
      ) {
        delete x["Hoa hồng khách hàng (%)"];
      }
      if (columns.find((a) => a.accessor == "RevenueDay") === undefined) {
        delete x["Ngày doanh thu"];
      } else if (
        columns.find((a) => a.accessor === "RevenueDay").show === false
      ) {
        delete x["Ngày doanh thu"];
      }
      if (columns.find((a) => a.accessor == "LinkFile") === undefined) {
        delete x["Link File"];
      } else if (
        columns.find((a) => a.accessor === "LinkFile").show === false
      ) {
        delete x["Link File"];
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
    ExportExcel(newData, "Danh sach khach hang");
  };

  //#region Render File
  const RenderFile = () => {
    return (
      file.length > 0 && file.map((item, index) => {
        return (
          <div class=" col-md-4 col-12" key={index} style={{ marginTop: "-60px" }} >
            <div class="card ml-2 mr-2" style={{ border: "1px solid #00c851", fontSize: "1rem" }} >
              <div class="d-flex align-items-center">
                <p class="pl-2 text-download m-0">{item}</p>
                <span class="btn ml-auto" onClick={(e) => cleanInput({ item })}>
                  <i class="fa fa-trash text-danger" style={{ fontSize: "1rem" }} />
                </span>
              </div>
            </div>
          </div>
        );
      })
    );
  };
  //#endregion

  //#region modal detail product group
  const HtmlPopup2 = (
    <div className="container">
      <div className="modal fade" id="myModal2" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content width_height100 modal__detail__table">
            <div class="modal-header">
              <div className="row edit__user__header">
                <h4 className="">
                  <i class="fa-solid fa-warehouse mr-2"></i>
                  {I18n.t("System.Note")}
                </h4>
                <a className="btn btn__default" data-dismiss="modal">
                  <i className="fa fa-times-circle edit__close__icon" />
                </a>
              </div>
            </div>
            <div class="modal-body">
              {DataLocation2 ? (
                <>
                  <div className="row pb-3">
                    <div className="col-md-4 col-sm-6">
                      <div className="form-group">
                        <label className="form__title">{I18n.t("Customer.Area")}</label>
                        <SelectAreaMulti
                          onSelected={(e) => ActiverAreaMulti2(e)}
                          activer={AreaMulti2}
                          isMulti={true}
                          isDisabled={true}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-sm-6">
                      <div className="form-group">
                        <label className="form__title">{I18n.t("Customer.Warehouse")}</label>
                        <SelectWarehouseMulti
                          onSelected={(e) => ActiverWareHouseMulti2(e)}
                          Area={AreaMulti2}
                          activer={WareHouseMulti2}
                          isMulti={true}
                          isDisabled={true}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-sm-6">
                      <div className="form-group">
                        <label className="form__title">{I18n.t("Customer.Warehousearea")}</label>
                        <SelectWarehouseAreaMulti
                          onSelected={(e) => ActiverWareHouseAreaMulti2(e)}
                          WareHouse={WareHouseMulti2}
                          activer={WareHouseAreaMulti2}
                          isMulti={true}
                          isDisabled={true}
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      {DataWareHouseArea2.map((itemWareHouseArea, key) => {
                        if (DataWareHouseArea2.length > 0) {
                          return (
                            <div className="customer-rent mt-3">
                              <div className="col-md-12">
                                <div className="table-customer-table">
                                  <div className="table-customer-table-left">
                                    <span className="mr-3">
                                      {itemWareHouseArea.Name}
                                    </span>
                                    |
                                    <span className="mr-3 ml-3">
                                      {itemWareHouseArea.WareHouseName}
                                    </span>
                                    |
                                    <span className="ml-3">
                                      {itemWareHouseArea.WareHouseAreaName}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {DataShelves2.map((itemShelves, key) => {
                                if (
                                  itemShelves.WareHouseAreaId ===
                                  itemWareHouseArea?.WareHouseAreaId
                                ) {
                                  return (
                                    <div className="col-md-12 row-center">
                                      <div className="shelves-detail">
                                        <span className="sd-title1">
                                          {itemShelves.ShelvesName}
                                        </span>
                                        {" "}
                                        <span className="sd-title2">
                                          {itemShelves.FloorName}
                                        </span>
                                      </div>
                                      {DataLocation2.map(
                                        (itemLocation, key) => {
                                          if (
                                            itemLocation.LocationId !==
                                            undefined &&
                                            itemLocation.FloorId ===
                                            itemShelves?.FloorId
                                          ) {
                                            return (
                                              <div className="form-collapse-table-detail tbody-active">
                                                {itemLocation.LocationName}
                                              </div>
                                            );
                                          }
                                        }
                                      )}
                                    </div>
                                  );
                                }
                              })}
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  //#end region



  //#region save
  const WH_spCustomerStaff_Save = async () => {
    try {
      if (CustomerIdStaff.value === -1) {
        Alertwarning("Please enter customer ");
        return;
      }
      if (StaffCode === "") {
        Alertwarning("Please enter customer staff code");
        return;
      }
      if (StaffCode === "") {
        Alertwarning("Please enter customer staff code");
        return;
      }
      if (StaffName === "") {
        Alertwarning("Please enter customer staff Name");
        return;
      }
      if (Phone === "") {
        Alertwarning("Please enter customer staff Phone");
        return;
      }
      if (Address === "") {
        Alertwarning("Please enter customer staff address");
        return;
      }


      setDisable(false);
      const pr = {
        CustomerId: CustomerIdStaff.value,
        StaffId: StaffId,
        StaffCode: StaffCode.trim(),
        StaffName: StaffName.trim(),
        Phone: Phone.trim(),
        Address: Address.trim(),
        AccountId: GetDataFromLogin("AccountId")
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "WH_spCustomerStaff_Save",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      debugger
      if (result.Status === "OK") {
        if(StaffId > 0){
          WH_spCustomerStaff_List();
        }
        WH_spCustomerStaff_Cancel();
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
  //#region cancel
  const WH_spCustomerStaff_Cancel = () => {

    setCustomerIdStaff({ value: -1 });
    setStaffCode("");
    setStaffName("");
    setPhone("");
    setAddress("");

  };
  //#endregion
  const WH_spCustomerStaff_List = async () => {

    try {
      debugger
      const params = {
        Json: JSON.stringify({
          FromDate: FormatDateJson(Fromdate),
          ToDate: FormatDateJson(Todate),
          CustomerId: CustomerIdStaffSearch.value,
          AccountId: GetDataFromLogin("AccountId")
        }),
        func: "WH_spCustomerStaff_List",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length > 0) {
        setDataWareHouseStaff(result);
      } else {
        Alertwarning(I18n.t("Report.NoData"));
        setDataWareHouseStaff([]);
      }
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };

  //#region data table
  const [columnsStaff] = useState([



    {
      Header: I18n.t("System.Option"),
      width: 180,
      filterable: false,
      sortable: false,
      accessor: "CustomerId",
      special: true,
      show: true,
      Cell: (row) => (
        <span>

          <button
            data-tooltip={I18n.t("AccountGroup.Edit")}
            className="btn btn-sm btn-success mr-2 show__tip__left"
            onClick={(e) => clickEditStaff({ row })}
          >
            <i className="fas fa-wrench"></i>
          </button>
          <button
            data-tooltip={I18n.t("AccountGroup.Delete")}
            className="btn btn-sm btn-danger show__tip__right"
            onClick={(e) => WH_spCustomerStaff_Delete({ row })}


          >
            <i className="fa fa-trash"></i>
          </button>
        </span>
      ),
    },
    {
      Header: 'No.',
      Cell: (row) => <span>{row.index + 1}</span>,
      width: 50,
      filterable: false,
      special: true,
      show: true,
    },
    {
      Header: I18n.t("Customer.CustomerCode"),
      accessor: "CustomerCode",
      width: 150,
    },
    {
      Header: I18n.t("Customer.CustomerName"),
      accessor: "CustomerName",
      width: 150,
    },
    {
      Header: 'Staff Code',
      accessor: "StaffCode",
      width: 150,
    },
    {
      Header: 'Staff Name',
      accessor: "StaffName",
      width: 150,
    },
    {
      Header: 'Phone',
      accessor: "Phone",
      width: 150,
    },
    {
      Header: 'Address',
      accessor: "Address",
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
      accessor: "Editer",
      width: 150,
    },
    {
      Header: I18n.t("System.EditDate"),
      accessor: "EditTime",
      Cell: (obj) => FormatDateJson(obj.value),
      width: 180,
    },
  ]);
  //#endregion
  const ExportexcelStaff = () => {

    const newData = DataWareHouseStaff.map(element => {
      return {

        'Customer Code': element.CustomerCode,
        'CUstomer Name': element.CustomerName,
        'Staff Code': element.StaffCode,
        'Staff Name': element.StaffName,
        'Phone': element.Phone,
        'Address': element.Address,
        'Người Sửa': element.Editer,
        'Ngày Sửa': FormatDateJson(element.EditTime),
        'Người Tạo': element.CreateName,
        'Ngày Tạo': FormatDateJson(element.CreateTime)
      }
    })
    ExportExcel(newData, 'Customer Staff List');
  }
  const clickEditStaff = (data) => {
    const editobj = data.row.original;//ĐỐI tượng
    debugger
    setStaffId(editobj.StaffId);
    setStaffCode(editobj.StaffCode);
    setStaffName(editobj.StaffName);
    setPhone(editobj.Phone);
    setAddress(editobj.Address);
    setCustomerIdStaff({ value: editobj.CustomerId });
    document.querySelector("#tab_3").click();

  }
  const WH_spCustomerStaff_Delete = async (data) => {
    const editobj = data.row.original;//ĐỐI tượng
    const prd = {

      StaffId: editobj.StaffId,
      AccountId: GetDataFromLogin("AccountId")
    };
    const paramsd = {
      Json: JSON.stringify(prd),
      func: "WH_spCustomerStaff_Delete",
    };
    try {
      const resultd = await mainAction.API_spCallServer(paramsd, dispatch);
      if (resultd.Status === "OK") {
        Alertsuccess(resultd.ReturnMess);
        // WH_spCustomerStaff_List();
        setDataWareHouseStaff(DataWareHouseStaff.filter(a=> a.StaffId !== editobj.StaffId))
        setDisable(true);
        return;
      }
      if (resultd.Status === "NO") {
        Alertwarning(resultd.ReturnMess);
        setDisable(true);
        return;
      }
   
} catch (error) {
    Alertwarning(I18n.t("Report.NoData"));
  }
}

return (
  <div className="content-wrapper pt-2">
    <section className="content">
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
            <li className="nav-item">
              <a
                id="tab_3"
                className="nav-link "
                href="#tab_3_list"
                data-toggle="tab"
              >
                Staff
              </a>
            </li>
            <li className="nav-item">
              <a
                id="tab_4"
                className="nav-link "
                href="#tab_4_list"
                data-toggle="tab"
              >
                Staff List
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
                {/* Header */}
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
                        onClick={(e) => WH_spCustomerStaff_Cancel()}
                      >
                        <i className="fa fa-trash mr-2 " />
                        {I18n.t("System.Cancel")}
                      </a>
                      <a
                        className="btn btn-success btn-sm float-right btn-header"
                        onClick={(e) => WH_spCustomer_Save()}
                        disabled={!disable}
                      >
                        <i className="fa fa-folder mr-2 " />
                        {I18n.t("System.Save")}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="card-body-form">
                  <div className="form-collapse-bg">
                    <div className="row">
                      <a
                        className="form-collapse-link"
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
                        {I18n.t("Customer.Customer")}
                      </a>
                    </div>
                    <div
                      className={
                        IsAcctive1 == true ? "display-none" : "row pb-3"
                      }
                    >
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            {I18n.t("Customer.CustomerCode")}
                            <span className="form__title__note"> (*)</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder=""
                            value={CustomerCode}
                            onChange={(e) => setCustomerCode(e.target.value.trim())}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            {I18n.t("Customer.CustomerName")}
                            <span className="form__title__note"> (*)</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder=""
                            value={CustomerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            {I18n.t("Leftmenu.CustomerEmail")}
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder=""
                            value={CustomerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">{I18n.t("Customer.CompanyName")}</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder=""
                            value={CompanyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            {I18n.t("Customer.CompanyAddress")}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder=""
                            value={CompanyAddress}
                            onChange={(e) =>
                              setCompanyAddress(e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title"> {I18n.t("Customer.CompanyPhone")}</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder=""
                            value={CompanyPhone}
                            onChange={(e) => setCompanyPhone(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title"> {I18n.t("Customer.CompanyEmail")}</label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder=""
                            value={CompanyEmail}
                            onChange={(e) => setCompanyEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title"> {I18n.t("Customer.BankAccountNumber")}</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder=""
                            value={BankAccountNumber}
                            onChange={(e) =>
                              setBankAccountNumber(e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title"> {I18n.t("Customer.BankAccountName")}</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder=""
                            value={BankAccountName}
                            onChange={(e) =>
                              setBankAccountName(e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title"> {I18n.t("Customer.BankName")}</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder=""
                            value={BankName}
                            onChange={(e) => setBankName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            {I18n.t("Customer.CustomerType")}
                          </label>
                          <SelectCustomerType
                            onSelected={(e) => setCustomerType(e)}
                            items={CustomerType.value}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            {I18n.t("Customer.BusinessField")}
                          </label>
                          <SelectBusinessField
                            onSelected={(e) => setBusinessField(e)}
                            items={BusinessField.value}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-collapse-bg mt-4">
                    <div className="row">
                      <a
                        className="form-collapse-link"
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
                        {I18n.t("Customer.Contactcustomers")}
                      </a>
                    </div>
                    <div
                      className={
                        IsAcctive2 == true ? "display-none" : "row pb-3"
                      }
                    >
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            {I18n.t("Customer.PositionContactPerson")}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder=""
                            value={ContactPersonPosition}
                            onChange={(e) =>
                              setContactPersonPosition(e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            {I18n.t("Customer.ContactPerson")}
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder=""
                            value={ContactPersonPhone}
                            onChange={(e) =>
                              setContactPersonPhone(e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            {I18n.t("Customer.PayerName")}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder=""
                            value={PayerName}
                            onChange={(e) => setPayerName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            {I18n.t("Customer.PayerEmail")}
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder=""
                            value={PayerEmail}
                            onChange={(e) => setPayerEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            {I18n.t("Customer.Payerphonenumber")}
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder=""
                            value={PayerPhone}
                            onChange={(e) => setPayerPhone(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-collapse-bg mt-4">
                    <div className="row">
                      <a
                        className="form-collapse-link"
                        onClick={(e) => setIsAcctive3(!IsAcctive3)}
                      >
                        {IsAcctive3 ? (
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
                        {I18n.t("Customer.Turnover")}
                      </a>
                    </div>
                    <div
                      className={
                        IsAcctive3 == true ? "display-none" : "row pb-3"
                      }
                    >
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">{I18n.t("Customer.ContractNumber")}</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder=""
                            value={ContractNumber}
                            onChange={(e) =>
                              setContractNumber(e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            {I18n.t("Customer.Expirydate")}
                          </label>
                          <DateTimePicker
                            className="form-control"
                            onChange={(date) =>
                              setContractExpirationDate(date)
                            }
                            value={ContractExpirationDate}
                            format="MM/dd/yyyy"
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">{I18n.t("Customer.Taxcode")}</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder=""
                            value={TaxNumber}
                            onChange={(e) => setTaxNumber(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            {I18n.t("Customer.BillingAddress")}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder=""
                            value={BillingAddress}
                            onChange={(e) =>
                              setBillingAddress(e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            {I18n.t("Customer.Estimatedsales")}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder=""
                            value={EstimatedSales}
                            onChange={(e) =>
                              setEstimatedSales(e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            {I18n.t("Customer.PaymentCycle")}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder=""
                            value={PaymentCycle}
                            onChange={(e) => setPaymentCycle(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            {I18n.t("Customer.Customercommission(%)")}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder=""
                            value={CustomerCommission}
                            onChange={(e) =>
                              setCustomerCommission(e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            {I18n.t("Customer.RevenueDay")}
                          </label>
                          <DateTimePicker
                            className="form-control"
                            onChange={(date) => setRevenueDay(date)}
                            value={RevenueDay}
                            format="MM/dd/yyyy"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-collapse-bg mt-4">
                    <div className="row">
                      <a
                        className="form-collapse-link"
                        onClick={(e) => setIsAcctive4(!IsAcctive4)}
                      >
                        {IsAcctive4 ? (
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
                        Upload file
                      </a>
                    </div>
                    <div
                      className={
                        IsAcctive4 == true
                          ? "display-none"
                          : "col-sm-12 col-md-12 pb-2"
                      }
                    >
                      <form className="form-horizontal">
                        <div class="form-group upload-mutiple">
                          <div
                            className="uploadFileContainer text-center"
                            onClick={handleClick}
                            style={{
                              cursor: "pointer",
                              zIndex: "0",
                              border: "none",
                            }}
                          >
                            {showUpload ? (
                              <>
                                <span>
                                  <i className="fa fa-cloud-upload-alt "> </i>
                                </span>
                                <span>Upload a File</span>
                              </>
                            ) : (
                              ""
                            )}
                          </div>
                          <div class="row ">
                            {/* {FileRender.length > 0 ? <RenderFile /> : <></>} */}
                            <RenderFile
                            />
                          </div>
                          <input
                            multiple
                            class="form-control display-none"
                            type="file"
                            name="myfile"
                            ref={fileInput}
                            onChange={handleUpload}
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="form-collapse-bg mt-4">
                    <div className="row">
                      <a
                        className="form-collapse-link"
                        onClick={(e) => setIsAcctive5(!IsAcctive5)}
                      >
                        {IsAcctive5 ? (
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
                        {I18n.t("Customer.Rentawarehouse")}
                      </a>
                    </div>
                    <div
                      className={
                        IsAcctive5 == true ? "display-none" : "row pb-3"
                      }
                    >
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">{I18n.t("Customer.Area")}</label>
                          <SelectAreaMulti
                            onSelected={(e) => {
                              ActiverAreaMulti(e)
                              setWareHouseMulti([{}])
                              setWareHouseAreaMulti([{}])
                            }}
                            activer={AreaMulti}
                            isMulti={true}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">{I18n.t("Customer.Warehouse")}</label>
                          <SelectWarehouseMulti
                            onSelected={(e) => {
                              ActiverWareHouseMulti(e)
                              setWareHouseAreaMulti([{}])
                            }}
                            Area={AreaMulti}
                            activer={WareHouseMulti}
                            isMulti={true}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">{I18n.t("Customer.WarehouseArea")}</label>
                          <SelectWarehouseAreaMulti
                            onSelected={(e) => ActiverWareHouseAreaMulti(e)}
                            WareHouse={WareHouseMulti}
                            activer={WareHouseAreaMulti}
                            isMulti={true}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6 center-item">
                        <button
                          className="btn btn-success btn-header btn-success-modify"
                          style={{ marginTop: "25px" }}
                          onClick={(a) => WH_spCustomer_Rent(1)}
                        >
                          {I18n.t("Customer.Confirmthearea")}
                          <div class="tooltip">
                            Top!
                            <span class="tooltiptext tooltip-top">
                              Tooltip Top!
                            </span>
                          </div>
                        </button>
                      </div>
                      {/* ================================================================= */}
                      <div className="col-md-12">
                        {DataWareHouseArea.map((itemWareHouseArea, key) => {
                          if (DataWareHouseArea.length > 0) {
                            return (
                              <div className="customer-rent mt-3">
                                <div className="col-md-12">
                                  <div className="table-customer-table">
                                    <div className="table-customer-table-left">
                                      <span className="mr-3">
                                        {" "}
                                        {itemWareHouseArea.Name}
                                      </span>
                                      |
                                      <span className="mr-3 ml-3">
                                        {itemWareHouseArea.WareHouseName}
                                      </span>
                                      |
                                      <span className="ml-3">
                                        {itemWareHouseArea.WareHouseAreaName}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                {DataShelves?.map((itemShelves, key) => {
                                  if (
                                    itemShelves.WareHouseAreaId ===
                                    itemWareHouseArea?.WareHouseAreaId
                                  ) {
                                    return (
                                      <div className="col-md-12 row-center">
                                        <div className="icheck-success d-inline float-left mr-4">
                                          <input
                                            type="checkbox"
                                            id={itemShelves.FloorId}
                                            value={itemShelves.FloorId}
                                            checked={itemShelves.IsCheck}
                                            onChange={(e) =>
                                              CheckOne(
                                                itemShelves.FloorId,
                                                itemShelves.IsCheck,
                                                2
                                              )
                                            }
                                          />
                                          <label
                                            className="label checkbox"
                                            htmlFor={itemShelves.FloorId}
                                          >
                                            <span className="sd-title1">
                                              {itemShelves.ShelvesName}
                                            </span>
                                            {" "}
                                            <span className="sd-title2">
                                              {itemShelves.FloorName}
                                            </span>
                                          </label>
                                        </div>
                                        {DataLocation?.map(
                                          (itemLocation, key) => {
                                            if (
                                              itemLocation.LocationId !==
                                              undefined &&
                                              itemLocation.FloorId ===
                                              itemShelves?.FloorId
                                            ) {
                                              return (
                                                <div
                                                  className={
                                                    itemLocation.IsCheck
                                                      ? "form-collapse-table-tbody tbody-active"
                                                      : "form-collapse-table-tbody"
                                                  }
                                                  onClick={(a) =>
                                                    handleSelectLocationName(
                                                      itemLocation
                                                    )
                                                  }
                                                >
                                                  {itemLocation.LocationName}
                                                </div>
                                              );
                                            }
                                          }
                                        )}
                                      </div>
                                    );
                                  }
                                })}
                              </div>
                            );
                          }
                        })}
                      </div>
                      {/* ================================================================= */}
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
                          {I18n.t("Customer.Listofcustomers")} ({DataCustomer.length})
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
                        onClick={(e) => WH_spCustomer_Delete(0, 2)}
                      >
                        <i className="fa fa-trash mr-2" />
                        {I18n.t("System.Delete")}
                      </a>
                      <a
                        className="btn btn-primary btn-sm float-right btn-header"
                        onClick={(e) => WH_spCustomer_List()}
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
                        <label className="form__title">{I18n.t("Customer.Selectregion")}</label>
                        <SelectArea
                          onSelected={(e) => {
                            setSearchArea(e)
                            setSearchWareHouse({ value: -1 })
                          }}
                          onAreaId={SearchArea.value}
                          items={SearchArea.value}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6">
                      <div className="form-group">
                        <label className="form__title">{I18n.t("Customer.Selectawarehouse")}</label>
                        <SelectWarehouse
                          onSelected={(e) => {
                            setSearchWareHouse(e)
                          }}
                          AreaId={SearchArea.value}
                          items={SearchWareHouse.value}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6">
                      <div className="form-group">
                        <label className="form__title">{I18n.t("Customer.Customercode")}</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder=""
                          value={CustomerCode2}
                          onChange={(e) => setCustomerCode2(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6">
                      <div className="form-group">
                        <label className="form__title">{I18n.t("Customer.CustomerType")}</label>
                        <SelectCustomerType
                          onSelected={(e) => setCustomerTypeId2(e)}
                          items={CustomerTypeId2.value}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={DataCustomer.length > 0 ? "" : "display-none"}
                >
                  <SettingColumn
                    columns={columns}
                    Returndata={(a) => setcolumns(a)}
                  />
                  <DataTable data={DataCustomer} columns={columns} />
                </div>
                {HtmlPopup2}
              </div>
              <div
                className="tab-pane fade show"
                id="tab_3_list"
                role="tabpanel"
                aria-labelledby="custom-tabs-two-home-tab"
              >
                {/* Header */}
                <div className="card-header">
                  <div className="row">
                    <div className="col-md-6">
                      <h3 className="card-title">
                        <i className="fas fa-plus" />
                        <span className="font-weight-bold">Add New Customer Staff</span>
                      </h3>
                    </div>
                    <div className="col-md-6 card-header-btn">
                      <a
                        className="btn btn-danger btn-sm float-right btn-header"
                        onClick={(e) => WH_spCustomerStaff_Cancel()}
                      >
                        <i className="fa fa-trash mr-2 " />
                        {I18n.t("System.Cancel")}
                      </a>
                      <a
                        className="btn btn-success btn-sm float-right btn-header"
                        onClick={(e) => WH_spCustomerStaff_Save()}
                        disabled={!disable}
                      >
                        <i className="fa fa-folder mr-2 " />
                        {I18n.t("System.Save")}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="">
                  <div className="form-collapse-bg pt-3">

                    <div
                      className="row pb-3"

                    >
                      <div className="col-md-3">
                        <div className="form-group">
                          <label className="form__title" >Customer ID <span className="form__title__note">(*)</span></label>
                          <SelectCustomer
                            onSelected={e => {
                              setCustomerIdStaff(e)
                              setWarehouse({ value: -1 })
                              setWarehouseTo({ value: -1 })
                            }}
                            items={CustomerIdStaff.value}
                            ref={CustomerIdStaffdRef}

                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            Staff Code
                            <span className="form__title__note"> (*)</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder=""
                            value={StaffCode}
                            onChange={(e) => setStaffCode(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            Staff Name
                            <span className="form__title__note"> (*)</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder=""
                            value={StaffName}
                            onChange={(e) => setStaffName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                          <label className="form__title">
                            Phone
                          </label>
                          <span className="form__title__note"> (*)</span>
                          <input
                            type="email"
                            className="form-control"
                            placeholder=""
                            value={Phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-12 col-sm-12">
                        <div className="form-group">
                          <label className="form__title">Address</label>
                          <span className="form__title__note"> (*)</span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder=""
                            value={Address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
              <div
                className="tab-pane fade"
                id="tab_4_list"
                role="tabpanel"
                aria-labelledby="custom-tabs-two-profile-tab"
              >
                <div className="card-header">
                  <div className="row">
                    <div className="col-md-6">
                      <h3 className="card-title">
                        <i className="fa fa-bars" />
                        <span className="font-weight-bold">
                          Staff List ({DataWareHouseStaff.length})
                        </span>
                      </h3>
                    </div>
                    <div className="col-md-6 card-header-btn">
                      <a
                        className="btn btn-warning btn-sm float-right btn-header"
                        onClick={(e) => ExportexcelStaff()}
                      >
                        <i className="fa fa-download mr-2" />
                        {I18n.t("System.Excel")}
                      </a>

                      <a
                        className="btn btn-primary btn-sm float-right btn-header"
                        onClick={(e) => WH_spCustomerStaff_List()}
                      >
                        <i className="fa fa-eye mr-2" />
                        {I18n.t("System.View")}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="card-body-form">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="form__title">From the day </label>
                        <DateTimePicker
                          className="form-control"
                          onChange={(date) => setFromdate(date)}
                          value={Fromdate}
                          format="MM/dd/yyyy"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="form__title">To The day</label>
                        <DateTimePicker
                          className="form-control"
                          onChange={(date) => setTodate(date)}
                          value={Todate}
                          format="MM/dd/yyyy"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="form__title" >Customer ID </label>
                        <SelectCustomer
                          onSelected={e => {
                            setCustomerIdStaffSearch(e)
                            setWarehouse({ value: -1 })
                            setWarehouseTo({ value: -1 })
                          }}
                          items={CustomerIdStaffSearch.value}
                          ref={CustomerIdStaffSearchRef}
                        />
                      </div>
                    </div>
                  </div>

                </div>
                <div
                  className={DataWareHouseStaff.length > 0 ? "" : "display-none"}
                >

                  <DataTable data={DataWareHouseStaff} columns={columnsStaff} />
                </div>
                {HtmlPopup2}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);
};
