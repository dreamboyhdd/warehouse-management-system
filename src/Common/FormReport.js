import React, { useEffect, useState } from "react";
import Select from "react-select";
import I18n from "../Language";
import DateTimePicker from "react-datetime-picker";
import { SelectCustomer, SelectWarehouse, SelectWarehouseArea } from "../Common";
import { FirstOrLastDayinMonth } from "../Utils";

const FormReportComp = React.forwardRef(
  (
    {
      onFromDate = () => { },
      onToDate = () => { },
      onCustomer = () => { },
      onWareHouse = () => { },
      onWareHouseArea = () => { },
      onTypeReport = () => { },
      onMonth = () => { },
      onQuarter = () => { },
      onYear = () => { },
      onType = () => { },
      onTypeByDate = () => { },
      onToday = () => { },
      onFromday = () => { },
    },
    ref
  ) => {
    const [Fromdate, setFromdate] = useState(new Date());
    const [Todate, setTodate] = useState(new Date());
    const [CustomerId, setCustomerId] = useState({ value: 0 });
    const [WareHouseId, setWareHouseId] = useState({ value: -1 });
    const [WareHouseAreaId, setWareHouseAreaId] = useState({ value: 0 });
    const [Fromday, setFromday] = useState(-100);
    const [Today, setToday] = useState(1);
    const [Month, setMonth] = useState();
    const [Type, setType] = useState(0)

    useEffect(() => {
      setType(e => onType(Type))
    }, [Type]);

    const [Typereport, setTypereport] = useState({
      value: 0,
      label: 'Select Please',
    });
    const [TypeByDate, setTypeByDate] = useState({
      value: 0,
      label: 'Select Please',
    });

    const [Quarter, setQuarter] = useState({
      value: 0,
      label: 'Select Please',
    });

    const [SelectYear, setSelectYear] = useState({
      value: 0,
      label: 'Select Please',
    });

    const dataTypeDate = [
      { value: 0, label: 'Select Please' },
      { value: 1, label: "Tỉ lệ của date" },
      { value: 2, label: "Date còn lại" },
    ];

    const dataType = [
      { value: 0, label: 'Select Please' },
      { value: 1, label: "Theo tháng" },
      { value: 2, label: "Theo quý" },
      { value: 3, label: "Theo thời gian tùy chỉnh" },
    ];

    const dataQuarter = [
      { value: 0, label: 'Select Please' },
      { value: 1, label: "Quý 1" },
      { value: 2, label: "Quý 2" },
      { value: 3, label: "Quý 3" },
      { value: 4, label: "Quý 4" },
    ];

    const dataYear = [
      { value: 0, label: 'Select Please' },
      { value: 1, label: "2020" },
      { value: 2, label: "2021" },
      { value: 3, label: "2022" },
      { value: 4, label: "2023" },
      { value: 5, label: "2024" },
      { value: 6, label: "2025" },
      { value: 7, label: "2026" },
      { value: 8, label: "2027" },
      { value: 9, label: "2028" },
      { value: 10, label: "2029" },
    ];

    const handleSelectYear = (item) => {
      onYear(item);
      setSelectYear(item);
    };

    const handleSelectCustomer = (item) => {
      onCustomer(item);
      setCustomerId(item);
    };

    const handleSelectWareHouse = (item) => {
      onWareHouse(item);
      setWareHouseId(item);
    };

    const handleSelectFromDate = (item) => {
      onFromDate(item);
      setFromdate(item);
    };

    const handleSelectToDate = (item) => {
      onToDate(item);
      setTodate(item);
    };

    const handleSelectToday = (item) => {
      onToday(item);
      setToday(item);
    };

    const handleSelectFromday = (item) => {
      onFromday(item);
      setFromday(item);
    };

    const handleSelectTypeReport = (item) => {
      debugger
      onTypeReport(item);
      setTypereport(item);
      if (item.value == 1) {
        setMonth(new Date())
        setTodate();
        setFromdate();
      }
      if (item.value == 2) {
        setQuarter({ value: 0, label: 'Select Please' });
        setSelectYear({ value: 0, label: 'Select Please' });
        setTodate();
        setFromdate();
      }
      if (item.value == 3) {
        setFromdate(FirstOrLastDayinMonth(new Date(), 1));
        setTodate((new Date()));
        onFromDate(FirstOrLastDayinMonth(new Date(), 1));
        onToDate((new Date()));
      }

    };
    const handleSelectTypeByDateReport = (item) => {
      onTypeByDate(item);
      setTypeByDate(item);
      if (item.value === 1) {
        setFromdate(FirstOrLastDayinMonth(new Date(), 1));
        setTodate((new Date()));
      }
    };

    const handleSelectMonth = (item) => {
      if (item === null || item === "") {
        setMonth()
        return
      }
      setMonth(item);
      onMonth(item);
      setFromdate(FirstOrLastDayinMonth(new Date(item), 1));
      setTodate(FirstOrLastDayinMonth(new Date(item)));
      onFromDate(FirstOrLastDayinMonth(new Date(item), 1));
      onToDate(FirstOrLastDayinMonth(new Date(item)));
    };

    const handleSelectQuarter = (item) => {
      setQuarter(item);
      onQuarter(item);
      if (item.value === 0) {
        setQuarter({ value: 0, label: 'Select Please', });
        return;
      }
      if (item.value === 1) {
        let Month1 = SelectYear.label + "-01";
        let Month3 = SelectYear.label + "-03";
        setFromdate(FirstOrLastDayinMonth(new Date(Month1), 1));
        setTodate(FirstOrLastDayinMonth(new Date(Month3)));
        onFromDate(FirstOrLastDayinMonth(new Date(Month1), 1));
        onToDate(FirstOrLastDayinMonth(new Date(Month3)));
        return;
      }
      if (item.value === 2) {
        let Month4 = SelectYear.label + "-04";
        let Month6 = SelectYear.label + "-06";
        setFromdate(FirstOrLastDayinMonth(new Date(Month4), 1));
        setTodate(FirstOrLastDayinMonth(new Date(Month6)));
        onFromDate(FirstOrLastDayinMonth(new Date(Month4), 1));
        onToDate(FirstOrLastDayinMonth(new Date(Month6)));
        return;
      }
      if (item.value === 3) {
        let Month7 = SelectYear.label + "-07";
        let Month9 = SelectYear.label + "-09";
        setFromdate(FirstOrLastDayinMonth(new Date(Month7), 1));
        setTodate(FirstOrLastDayinMonth(new Date(Month9)));
        onFromDate(FirstOrLastDayinMonth(new Date(Month7), 1));
        onToDate(FirstOrLastDayinMonth(new Date(Month9)));
        return;
      }
      if (item.value === 4) {
        let Month10 = SelectYear.label + "-10";
        let Month12 = SelectYear.label + "-12";
        setFromdate(FirstOrLastDayinMonth(new Date(Month10), 1));
        setTodate(FirstOrLastDayinMonth(new Date(Month12)));
        onFromDate(FirstOrLastDayinMonth(new Date(Month10), 1));
        onToDate(FirstOrLastDayinMonth(new Date(Month12)));
        return;
      }

    };

    useEffect(() => {
      handleSelectQuarter({ value: 0 });
    }, [SelectYear]);


    return (
      <>
        <div className="row col-md-12">
          <div className="col-md-3">
            <div className="form-group">
              <label className="form__title">
                {I18n.t("Leftmenu.Customer")} ID <span className="form__title__note">(*)</span>
              </label>
              <SelectCustomer
                onSelected={(e) => {
                  handleSelectCustomer(e);
                  handleSelectWareHouse({ value: -1 });
                }}
                items={CustomerId.value}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label className="form__title">{I18n.t("AccountGroup.Warehouse")} ID</label>
              <SelectWarehouse
                onSelected={(e) => handleSelectWareHouse(e)}
                items={WareHouseId.value}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label className="form__title">{I18n.t("AccountGroup.Warehouse")} Area ID</label>
              <SelectWarehouseArea
                onSelected={(e) => {
                  onWareHouseArea(e)
                  setWareHouseAreaId(e)
                }}
                WareHouseId={WareHouseId.value}
                items={WareHouseAreaId.value}
              />
            </div>
          </div>
          {/* form select theo thời gian */}
          {Type === 1 ?
            <>
              <div className="col-md-3">
                <div className="form-group">
                  <label className="form__title">
                    {I18n.t("System.ReportType")}<span className="form__title__note">(*)</span>
                  </label>
                  <Select
                    options={dataType}
                    value={Typereport}
                    onChange={(e) => handleSelectTypeReport(e)}
                  />
                </div>
              </div>
              <div className={Typereport.value === 2 ? "col-md-3" : "display-none"}>
                <div className="form-group">
                  <label className="form__title">
                    {I18n.t("System.Year")}<span className="form__title__note">(*)</span>
                  </label>
                  <Select
                    options={dataYear}
                    value={SelectYear}
                    onChange={(e) => handleSelectYear(e)}
                  />
                </div>
              </div>
              <div className={Typereport.value === 1 ? "col-md-3" : "display-none"}>
                <div class="form-group">
                  <label className="form__title">
                    {I18n.t("System.Month")}<span className="form__title__note">(*)</span>
                  </label>
                  <div class="form-group">
                    <input
                      type="month"
                      class="form-control"
                      id="start"
                      name="start"
                      value={Month}
                      onChange={(e) => handleSelectMonth(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className={Typereport.value === 2 ? "col-md-3" : "display-none"}>
                <div className="form-group">
                  <label
                    className="form__title"
                    style={Typereport.value === 2 ? { marginBottom: "5px" } : {}}
                  >
                    {I18n.t("System.Quarterlyreport")}<span className="form__title__note">(*)</span>
                  </label>
                  <Select
                    options={dataQuarter}
                    value={Quarter}
                    onChange={(e) => handleSelectQuarter(e)}
                  />
                </div>
              </div>
              {Typereport.value <= 0 ? (<></>) : (
                <>
                  <div
                    className={Typereport.value === 3 ? "col-md-3" : "display-none"}
                  ></div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="form__title">
                        {I18n.t("System.Fromthedate")}<span className="form__title__note">(*)</span>
                      </label>
                      <DateTimePicker
                        className="form-control"
                        onChange={(date) => handleSelectFromDate(date)}
                        value={Fromdate}
                        format="MM/dd/yyyy"
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="form__title">
                        {I18n.t("System.Todate")}<span className="form__title__note">(*)</span>
                      </label>
                      <DateTimePicker
                        className="form-control"
                        onChange={(date) => handleSelectToDate(date)}
                        value={Todate}
                        format="MM/dd/yyyy"
                        showQuarterYearPicker
                      />
                    </div>
                  </div>
                </>
              )}
            </>
            : <></>}

          {/* form select theo date */}
          {Type === 2 ?
            <>
              <div className="col-md-3">
                <div className="form-group">
                  <label className="form__title">
                    {I18n.t("System.ReportType")}<span className="form__title__note">(*)</span>
                  </label>
                  <Select
                    options={dataTypeDate}
                    value={TypeByDate}
                    onChange={(e) => handleSelectTypeByDateReport(e)}
                  />
                </div>
              </div>
              {TypeByDate.value === 1 ? (<>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form__title">{I18n.t("System.Fromthedate")}</label>
                    <DateTimePicker
                      className="form-control"
                      onChange={(date) => handleSelectFromDate(date)}
                      value={Fromdate}
                      format="MM/dd/yyyy"
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form__title">{I18n.t("System.Todate")}</label>
                    <DateTimePicker
                      className="form-control"
                      onChange={(date) => handleSelectToDate(date)}
                      value={Todate}
                      format="MM/dd/yyyy"
                      showQuarterYearPicker
                    />
                  </div>
                </div>
              </>) : (<></>)}

              {TypeByDate.value === 2 ? (<>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form__title">{I18n.t("System.Fromtherestoftheday")}</label>
                    <input
                      onChange={(e) => handleSelectFromday(e.target.value)} value={Fromday} type="number" className="form-control" placeholder=""
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form__title">{I18n.t("System.Untiltherestoftheday")}</label>
                    <input
                      onChange={(e) => handleSelectToday(e.target.value)} value={Today} type="number" className="form-control" placeholder=""
                    />
                  </div>
                </div>
              </>) : (<></>)}
            </>
            : <></>}
        </div>
      </>
    );
  }
);
export const FormReport = React.memo(FormReportComp);
