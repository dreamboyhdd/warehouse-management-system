import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import I18n from "../../Language";
import Select from "react-select";
import DateTimePicker from "react-datetime-picker";
import { DataTable, FormReport, ChartTemp, SelectArea } from "../../Common";
import { mainAction } from "../../Redux/Actions";
import { Img } from 'react-image';
import $ from 'jquery';
import {
  Alertwarning,
  FormatDateJson,
  ExportExcel,
  FirstOrLastDayinMonth, FormatMoney
} from "../../Utils";
export const Home = () => {
  /*     const UserId = GetDataFromLogin("OfficerID");
      const location = useLocation(); */
  useEffect(() => {
    document.querySelector(".Month").classList.add("active");
    const Monthchange = FormatDateJson(new Date(), 2);
    WH_spWareHouse_InventoryRatioByDate_DashBoard(2, (Monthchange.split('-')[1]), parseInt(Monthchange.split('-')[0]));
    WH_spWareHouse_Statistics(2, (Monthchange.split('-')[1]), parseInt(Monthchange.split('-')[0]));
    WH_spWareHouse_InventoryByCustomer_Report(2, (Monthchange.split('-')[1]), parseInt(Monthchange.split('-')[0]));
    WH_spWareHouse_InventoryRatioByProductGroup_DashBoard(2, (Monthchange.split('-')[1]), parseInt(Monthchange.split('-')[0]));
    WH_spWareHouse_InventoryRatioByShelves_DashBoard(2, (Monthchange.split('-')[1]), parseInt(Monthchange.split('-')[0]));
  }, [])

  //#region  biến
  const dispatch = useDispatch();
  const [TotalProduct, setTotalProduct] = useState(0);
  const [TotalOrder, setTotalOrder] = useState(0);
  const [TotalOutBound, setTotalOutBound] = useState(0);
  const [TotalRevenue, setTotalRevenue] = useState(0);
  const [TotalRevenueInt, setTotalRevenueInt] = useState(0);

  const [Month, setMonth] = useState(FormatDateJson(new Date(), 2));
  const [HiddenArea, setHiddenArea] = useState(1);
  const [AreaId, setAreaId] = useState(-1);
  const [KeyTime, setKeyTime] = useState(2);
  const [DataChartInventory, setDataChartInventory] = useState([]);
  const [DataChartInventoryDate, setDataChartInventoryDate] = useState([]);
  const [DataChartInventoryDateMap, setDataChartInventoryDateMap] = useState([]);
  const [DataChartInventoryProductGroup, setDataChartInventoryProductGroup] = useState([]);
  const [DataChartInventoryProductGroupMap, setDataChartInventoryProductGroupMap] = useState([]);
  const [HiddenChartInventoryProductGroup, setHiddenChartInventoryProductGroup] = useState(false);
  const [HiddenChart, setHiddenChart] = useState(false);
  const [HiddenChartDate, setHiddenChartDate] = useState(false);
  const [DataChartInventoryShelves, setDataChartInventoryShelves] = useState([]);
  const [DataChartInventoryShelvesMap, setDataChartInventoryShelvesMap] = useState([]);
  const [HiddenChartInventoryShelves, setHiddenChartInventoryShelves] = useState(false);
  const [TypeRun4, setTypeRun4] = useState(1);
  const [TypeRun2, setTypeRun2] = useState(1);
  const [TypeRun3, setTypeRun3] = useState(1);
  const [HiddenMonth, setHiddenMonth] = useState(true);
  const arrService = ['#008B8B', '#F08080', '#FFD700', '#2E8B57', '#00CED1', '#DC143C', '#FF4500', '#9ACD32',];
  /*   ['#265C00', '#A52A2A', '#2E8B57', '#FF8C00', '#FDFFFF', '#CB0000', '#E4EA8C', '#3F6C45', '#ED5752', '#ADFF2F', '#F08080', '#FF7F50', '#20B2AA', '#778899', '#F0E68C', '#DC143C', '#FFE4E1']; */
  const arrService2 = ['#FA4032', '#FFA812F', '#FAAF08', '#F2C057', '#FEF2E4', '#FD974F', '#C60000', '#805A3B'];
  const arrService3 = ['#ED5752', '#A1BE95', '#E2DFA2', '#92AAC7', '#FFDB5C', 'F8A055'];
  const arrService4 = ['#008B8B', '#F08080', '#FFD700', '#008080', '#DC143C', '#FF0000',];


  //#region thay đổi thời gian
  const ChangeKeyTime = (Key) => {
    const Monthchange = FormatDateJson(new Date(), 2);
    if (Key === 0) {
      document.querySelector(".ToDay").classList.add("active");
      document.querySelector(".Week").classList.remove("active");
      document.querySelector(".Month").classList.remove("active");
      document.querySelector(".Area").classList.remove("active");
      setKeyTime(Key);
      setHiddenArea(1);

      setHiddenMonth(false);
      setMonth(FormatDateJson(new Date(), 2));
      WH_spWareHouse_Statistics(Key, parseInt(Monthchange.split('-')[1]), parseInt(Monthchange.split('-')[0]));
      WH_spWareHouse_InventoryRatioByDate_DashBoard(Key, parseInt(Monthchange.split('-')[1]), parseInt(Monthchange.split('-')[0]));
      WH_spWareHouse_InventoryByCustomer_Report(Key, parseInt(Monthchange.split('-')[1]), parseInt(Monthchange.split('-')[0]));
      WH_spWareHouse_InventoryRatioByProductGroup_DashBoard(Key, parseInt(Monthchange.split('-')[1]), parseInt(Monthchange.split('-')[0]));
      WH_spWareHouse_InventoryRatioByShelves_DashBoard(Key, parseInt(Monthchange.split('-')[1]), parseInt(Monthchange.split('-')[0]));
    }
    if (Key === 1) /* theo tuần */ {
      document.querySelector(".Week").classList.add("active");
      document.querySelector(".ToDay").classList.remove("active");
      document.querySelector(".Month").classList.remove("active");
      document.querySelector(".Area").classList.remove("active");
      setKeyTime(Key);
      setHiddenMonth(false);
      setMonth(FormatDateJson(new Date(), 2));
      WH_spWareHouse_Statistics(Key, parseInt(Monthchange.split('-')[1]), parseInt(Monthchange.split('-')[0]));
      WH_spWareHouse_InventoryRatioByDate_DashBoard(Key, parseInt(Monthchange.split('-')[1]), parseInt(Monthchange.split('-')[0]));
      WH_spWareHouse_InventoryByCustomer_Report(Key, parseInt(Monthchange.split('-')[1]), parseInt(Monthchange.split('-')[0]));
      WH_spWareHouse_InventoryRatioByProductGroup_DashBoard(Key, parseInt(Monthchange.split('-')[1]), parseInt(Monthchange.split('-')[0]));
      WH_spWareHouse_InventoryRatioByShelves_DashBoard(Key, parseInt(Monthchange.split('-')[1]), parseInt(Monthchange.split('-')[0]));

      setHiddenArea(1);
    }
    if (Key === 2) /* theo tháng */ {
      document.querySelector(".Month").classList.add("active");
      document.querySelector(".ToDay").classList.remove("active");
      document.querySelector(".Week").classList.remove("active");
      document.querySelector(".Area").classList.remove("active");
      setKeyTime(Key);
      setHiddenArea(1);
      setHiddenMonth(true);
      WH_spWareHouse_Statistics(Key, parseInt(Monthchange.split('-')[1]), parseInt(Monthchange.split('-')[0]));
      WH_spWareHouse_InventoryRatioByDate_DashBoard(Key, parseInt(Monthchange.split('-')[1]), parseInt(Monthchange.split('-')[0]));
      WH_spWareHouse_InventoryByCustomer_Report(Key, parseInt(Monthchange.split('-')[1]), parseInt(Monthchange.split('-')[0]));
      WH_spWareHouse_InventoryRatioByProductGroup_DashBoard(Key, parseInt(Monthchange.split('-')[1]), parseInt(Monthchange.split('-')[0]));
      WH_spWareHouse_InventoryRatioByShelves_DashBoard(Key, parseInt(Monthchange.split('-')[1]), parseInt(Monthchange.split('-')[0]));
    }
    if (Key === 3) {
      document.querySelector(".Area").classList.add("active");
      setHiddenArea(2);
    }

  };

  //#endregion

  //#region  chọn tháng
  const OnMonth = (val) => {
    setMonth(val);
    ChangeKeyTime_Load(KeyTime, parseInt(val.split('-')[1]), parseInt(val.split('-')[0]));
  }
  //#endregion

  //#region  thống kê tổng sản phẩm + tổng order outbound + tổng xuất Kho
  const WH_spWareHouse_Statistics = async (Key, KeyMonths, KeyYears) => {
    debugger

    const params = {
      Json: JSON.stringify({
        KeyTime: Key,
        AreaId: -1,
        KeyMonths: KeyMonths,
        KeyYears: KeyYears,
      }),
      func: "WH_spWareHouse_Statistics",
    };
    const list = await mainAction.API_spCallServer(params, dispatch);
    debugger
    if (list.JsonReturn1.length !== undefined || list.JsonReturn2.length !== undefined) {
      setTotalProduct(list.JsonReturn1[0].TotalInventory);
      setTotalOrder(list.JsonReturn2[0].TotalExport);
      setTotalOutBound(list.JsonReturn3[0].TotalExport);
    }
    else {
      ;
      setTotalProduct(0)
      setTotalOrder(0);
      setTotalOutBound(0);
    }

  }
  //#endregion

  //#region  tồn kho theo date
  const WH_spWareHouse_InventoryRatioByDate_DashBoard = async (Key, KeyMonths, KeyYears) => {
    debugger
    try {
      const paramsInventory = {
        Json: JSON.stringify({
          KeyTime: Key,
          KeyMonths: KeyMonths,
          KeyYears: KeyYears,
        }),
        func: "WH_spWareHouse_InventoryRatioByDate_DashBoard",
      };
      setDataChartInventoryDate([]);
      $("#ChartInventoryDate .apexcharts-canvas").remove();
      setHiddenChartDate(false);
      const listInventory = await mainAction.API_spCallServer(paramsInventory, dispatch);
      debugger
      if (listInventory.length > 0) {
        setDataChartInventoryDateMap(listInventory);
        const empty = arr => arr.length = 0;
        empty(DataChartInventoryDate);
        DataChartInventoryDate.push({
          label: 'Expired - ' + listInventory[0].RatioExpired + "%",
          y: listInventory[0].RatioExpired,
        },
          {
            label: 'Under 15 Days -' + listInventory[0].RatioDaysLeft15 + "%",
            y: listInventory[0].RatioDaysLeft15,
          },
          {
            label: 'From 15 - 30 Days - ' + listInventory[0].RatioFrom15To30Days + "%",
            y: listInventory[0].RatioFrom15To30Days,
          },
          {
            label: 'From 1-2 Month - ' + listInventory[0].RatioFrom1MonthTo2Month + "%",
            y: listInventory[0].RatioFrom1MonthTo2Month,
          },
          {
            label: 'From 2-6 Month - ' + listInventory[0].RatioFrom2MonthTo6Month + "%",
            y: listInventory[0].RatioFrom2MonthTo6Month,
          },
          {
            label: 'Over 6 Month - ' + listInventory[0].RatioOver6Month + "%",
            y: listInventory[0].RatioOver6Month,
          },

        );

        setDataChartInventoryDate(DataChartInventoryDate);
        setTypeRun2(TypeRun2 + 1);
      }
      else {
        setDataChartInventoryDate([]);

      }
      setHiddenChartDate(true);

    }
    catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  }
  //#endregion

  //#region  tồn kho theo nhóm sản phẩm
  const WH_spWareHouse_InventoryRatioByProductGroup_DashBoard = async (Key, KeyMonths, KeyYears) => {
    debugger
    try {
      const paramsInventory = {
        Json: JSON.stringify({
          KeyTime: Key,
          KeyMonths: KeyMonths,
          KeyYears: KeyYears,
        }),
        func: "WH_spWareHouse_InventoryRatioByProductGroup_DashBoard",
      };
      setDataChartInventoryProductGroup([]);
      setDataChartInventoryProductGroupMap([]);
      $("#ChartInventoryProductGroup .apexcharts-canvas").remove();
      setHiddenChartInventoryProductGroup(false);
      const listDataChartInventoryProductGroup = await mainAction.API_spCallServer(paramsInventory, dispatch);
      debugger
      if (listDataChartInventoryProductGroup.length > 0) {
        const empty = arr => arr.length = 0;
        empty(DataChartInventoryProductGroup);
        listDataChartInventoryProductGroup.map((item2, index) => {
          item2.color = arrService[index];
          DataChartInventoryProductGroup.push({
            label: item2.ProductGroupCode + ' - ' + item2.RatioInventory + '%',
            y: item2.RatioInventory,
          });
        })
        setDataChartInventoryProductGroup(DataChartInventoryProductGroup);
        setDataChartInventoryProductGroupMap(listDataChartInventoryProductGroup);
        setTypeRun3(TypeRun3 + 1);

      }
      else {
        setDataChartInventoryProductGroup([]);
        setDataChartInventoryProductGroupMap([]);

      }
      setHiddenChartInventoryProductGroup(true);

    }
    catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  }
  //#endregion

  //#region  tồn kho theo kệ
  const WH_spWareHouse_InventoryRatioByShelves_DashBoard = async (Key, KeyMonths, KeyYears) => {
    debugger
    try {
      const paramsInventory = {
        Json: JSON.stringify({
          KeyTime: Key,
          KeyMonths: KeyMonths,
          KeyYears: KeyYears,
        }),
        func: "WH_spWareHouse_InventoryRatioByShelves_DashBoard",
      };
      setDataChartInventoryShelves([]);
      setDataChartInventoryShelvesMap([]);
      $("#ChartInventoryShelves .apexcharts-canvas").remove();
      setHiddenChartInventoryShelves(false);
      const listDataChartInventoryShelves = await mainAction.API_spCallServer(paramsInventory, dispatch);
      debugger
      if (listDataChartInventoryShelves.length > 0) {
        const empty = arr => arr.length = 0;
        empty(DataChartInventoryShelves);
        listDataChartInventoryShelves.map((item2, index) => {
          item2.color = arrService[index];
          DataChartInventoryShelves.push({
            label: item2.ShelvesName + ' - ' + item2.RatioInventory + '%',
            y: item2.RatioInventory,
          });
        })
        setDataChartInventoryShelves(DataChartInventoryShelves);
        setDataChartInventoryShelvesMap(listDataChartInventoryShelves);
        setTypeRun4(TypeRun4 + 1);

      }
      else {
        setDataChartInventoryShelves([]);
        setDataChartInventoryShelvesMap([]);

      }
      setHiddenChartInventoryShelves(true);

    }
    catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  }
  //#endregion



  const ChangeKeyTime_Load = (Key, KeyMonths, KeyYears) => {
    $("#ChartInventory .apexcharts-canvas").remove();
    $("#ChartInventoryDate .apexcharts-canvas").remove();
    $("#ChartInventoryProductGroup .apexcharts-canvas").remove();

    WH_spWareHouse_Statistics(Key, KeyMonths, KeyYears);
    WH_spWareHouse_InventoryByCustomer_Report(Key, KeyMonths, KeyYears);
    WH_spWareHouse_InventoryRatioByDate_DashBoard(Key, KeyMonths, KeyYears);
    WH_spWareHouse_InventoryRatioByProductGroup_DashBoard(Key, KeyMonths, KeyYears);
  };

  const WH_spWareHouse_InventoryByCustomer_Report = async (Key, KeyMonths, KeyYears) => {

    try {

      const paramsInventory = {
        Json: JSON.stringify({
          KeyTime: Key,
          KeyMonths: KeyMonths,
          KeyYears: KeyYears,
        }),
        func: "WH_spWareHouse_Inventory_Report_DashBoard",
      };

      const result = await mainAction.API_spCallServer(paramsInventory, dispatch);
      debugger
      if (result.length > 0) {
        const resultA = Object.values(result.reduce((c, { WareHouseId, WareHouseName, CustomerCode, CustomerName, TotalNumberBeGin, TotalNumberImport, TotalNumberExport, TotalNumberEnd, IsCheck }) => {
          c[WareHouseId] = c[WareHouseId] || {
            WareHouseId: WareHouseId, WareHouseName: WareHouseName, CustomerCode: CustomerCode, CustomerName: CustomerName,
            TotalNumberBeGin: TotalNumberBeGin,
            TotalNumberImport: TotalNumberImport,
            TotalNumberExport: TotalNumberExport,
            TotalNumberEnd: TotalNumberEnd, Count: 0
          };
          c[WareHouseId].Count++;
          if (c[WareHouseId].Count === 1) {
            c[WareHouseId].TotalNumberBeGin = c[WareHouseId].TotalNumberBeGin;
            c[WareHouseId].TotalNumberImport = c[WareHouseId].TotalNumberImport;
            c[WareHouseId].TotalNumberExport = c[WareHouseId].TotalNumberExport;
            c[WareHouseId].TotalNumberEnd = c[WareHouseId].TotalNumberEnd;
          }
          else {
            c[WareHouseId].TotalNumberBeGin = c[WareHouseId].TotalNumberBeGin + TotalNumberBeGin;
            c[WareHouseId].TotalNumberImport = c[WareHouseId].TotalNumberImport + TotalNumberImport;
            c[WareHouseId].TotalNumberExport = c[WareHouseId].TotalNumberExport + TotalNumberExport;
            c[WareHouseId].TotalNumberEnd = c[WareHouseId].TotalNumberEnd + TotalNumberEnd;
          }
          return c;
        }, {}));
        let a = resultA;
        setDataChartInventory(resultA);



      } else {
        setDataChartInventory([]);
      }
    } catch (error) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  //#endregion
  return (
    <div class="content-wrapper" style={{ height: '552px', overflowY: 'scroll', overflowX: 'scroll', marginTop: '0px' }}>

      <section class="content margin-top-5">
        <div class="container-fluid ind homepage">
          <div className="row">
            {/* thống kê hệ thống */}
            <div className="col-md-12 card">
              <div class="">
                <ul class="nav nav-tabs margin-top-5 homepagett" id="custom-tabs-two-tab" role="tablist">
                  <li class="nav-item margin-left-1s">
                    <a className="nav-link Month" id="data-add" data-toggle="pill" onClick={e => ChangeKeyTime(2)} role="tab" aria-controls="true" aria-selected="true"><span class='bg-ripe-Pink icon-gradient font11'><i class="far fa-calendar-alt"></i> Month</span></a>
                  </li>
                  <span className={HiddenMonth === true ? " display-block form-group ml-2" : " display-none"} >

                    <span className="SelectDatetime">
                      <input type="month" className="form-control" key="start" id="start" name="start" value={Month} onChange={e => OnMonth(e.target.value)} />
                    </span>
                  </span>
                  <li class="nav-item bg-ripe-Pink icon-gradient">
                    <a className="nav-link Week" id="data-list" data-toggle="pill" onClick={e => ChangeKeyTime(1)} role="tab" aria-controls="custom-tabs-two-profile" aria-selected="false"><span class='bg-ripe-Pink icon-gradient font11'>Week</span></a>
                  </li>
                  <li class="nav-item bg-ripe-Pink icon-gradient">
                    <a className="nav-link ToDay" id="data-list" data-toggle="pill" onClick={e => ChangeKeyTime(0)} role="tab" aria-controls="custom-tabs-two-profile" aria-selected="false"><span class='bg-ripe-Pink icon-gradient font11'> Today</span></a>
                  </li>
                  <li class="nav-item bg-ripe-Pink icon-gradient display-none">
                    <a className="nav-link Area" id="data-list" data-toggle="pill" onClick={e => ChangeKeyTime(3)} role="tab" aria-controls="custom-tabs-two-profile" aria-selected="false">
                      <span class='bg-ripe-Pink icon-gradient font11 '><i class="fas fa-map-marker"></i> Area
                      </span>
                    </a>
                  </li>

                </ul>
              </div>
              <div class="mar-top-10 w3-animate-left">
                <div class="margin-top-25">
                  <div className="row">
                    <div class="col-xl-4 col-md-12">
                      <div class="card mat-stat-card">
                        <div class="card-block">
                          <div class="row align-items-center b-b-default">
                            <div class="col-sm-12 b-r-default p-b-20 p-t-20 b-r-default">
                              <div class="row align-items-center text-center">
                                <div class="col-2 p-r-0 ">
                                  <i class="fa fa-cubes text-c-green f-24 bori"></i>
                                </div>
                                <div class="col-10 p-r-0">
                                  <span class='f-title'>{TotalProduct} </span>
                                  <p class="text-muted m-b-0">Total Product </p>

                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-xl-4 col-md-12">
                      <div class="card mat-stat-card">
                        <div class="card-block">
                          <div class="row align-items-center b-b-default">
                            <div class="col-sm-12 b-r-default p-b-20 p-t-20 b-r-default">
                              <div class="row align-items-center text-center">
                                <div class="col-2 p-r-0">
                                  <i class="far fa-file-alt text-c-red f-24 bori"></i>
                                </div>
                                <div class="col-10 p-r-0">
                                  <span class='f-title'>{TotalOrder}</span>
                                  <p class="text-muted m-b-0">Total Order</p>
                                </div>
                              </div>
                            </div>

                          </div>

                        </div>
                      </div>
                    </div>

                    <div class="col-xl-4 col-md-12">
                      <div class="card mat-stat-card">
                        <div class="card-block">
                          <div class="row align-items-center b-b-default">
                            <div class="col-sm-12 b-r-default p-b-20 p-t-20 b-r-default">
                              <div class="row align-items-center text-center">
                                <div class="col-2 p-r-0">
                                  <i class="fa fa-sign-out text-c-purple f-24 bori"></i>
                                </div>
                                <div class="col-10 p-r-0">
                                  <span class='f-title'>{TotalOutBound}</span>
                                  <p class="text-muted m-b-0"> Order Completed</p>
                                </div>
                              </div>
                            </div>

                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                  <div class='row'>
                    {/* tỷ lệ tồn kho theo date */}

                    <div class="col-xl-12 col-md-12">
                      <div class="card card-success homepagechart" style={{ minHeight: '230px' }}>
                        <div class="three">
                          <h6><i class="fa fa-calendar" aria-hidden="true"></i> Inventory According To Date</h6>
                        </div>
                        <div className="row">
                          <div class="col-md-6" style={{ paddingLeft: '9%', paddingTop: '40px' }}>
                            <div >

                              {HiddenChartDate === false &&
                                <div className="chartloading">
                                  <Img
                                    src="../../assets/img/loading.gif"
                                    width='100px'
                                  />
                                </div>

                              }
                              {
                                HiddenChartDate === true && DataChartInventoryDateMap[0].Totals > 0 &&

                                <ChartTemp
                                  data={DataChartInventoryDate}
                                  height='300'
                                  type='pie'
                                  Typerun={TypeRun2}

                                  id="ChartInventoryDate"
                                  legendShow={false}
                                  Color={arrService}
                                  dataLabelscolor={['#000000']}
                                />
                              }
                              {
                                HiddenChartDate === true && DataChartInventoryDateMap[0].Totals === 0 &&
                                <div className="chartloading mt-5">
                                  No Data!
                                </div>

                              }


                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className='DataChartServiceDetail '>
                              <div className="col-md-12 chartdtinfor margin-top-20">
                                <div className="row margin-top-10">
                                  {
                                    <table class="table table-striped" style={{ fontSize: '12px', fontTotalNumberImport: 'bolder', textAlign: 'center' }}>
                                      <thead>
                                        <tr>
                                          <th>Dates</th>
                                          <th>Number</th>
                                          <th>Ratio (%)</th>
                                          <th style={{ width: '50px' }}>(Color)</th>
                                        </tr>
                                      </thead>
                                      <tbody>

                                        {

                                          DataChartInventoryDate.length > 0 && DataChartInventoryDateMap.map((item, index) => {
                                            debugger
                                            return (
                                              <>
                                                <>
                                                  <tr>
                                                    <th >Expired</th>
                                                    <td>{FormatMoney(item.TotalExpired)}</td>
                                                    <td>{item.RatioExpired}  (%)</td>
                                                    <td style={{ textAlign: 'center' }}>
                                                      <div style={{ background: '#008B8B', color: 'white', width: '18px', height: '18px' }} ></div>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <th >Under 15 Days</th>
                                                    <td>{FormatMoney(item.TotalDaysLeft15)}</td>
                                                    <td>{item.RatioDaysLeft15}  (%)</td>
                                                    <td style={{ textAlign: 'center' }}>
                                                      <div style={{ background: '#F08080', color: 'white', width: '18px', height: '18px' }} ></div>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <th >From 15 - 30Days</th>
                                                    <td>{FormatMoney(item.TotalFrom15To30Days)}</td>
                                                    <td>{item.RatioFrom15To30Days}  (%)</td>
                                                    <td style={{ textAlign: 'center' }}>
                                                      <div style={{ background: '#FFD700', color: 'white', width: '18px', height: '18px' }} ></div>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <th >From 1 - 2 Month</th>
                                                    <td>{FormatMoney(item.TotalFrom1MonthTo2Month)}</td>
                                                    <td>{item.RatioFrom1MonthTo2Month}  (%)</td>
                                                    <td style={{ textAlign: 'center' }}>
                                                      <div style={{ background: '#2E8B57', color: 'white', width: '18px', height: '18px' }} ></div>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <th >From 2- 6 Month</th>
                                                    <td>{FormatMoney(item.From2MonthTo6Month)}</td>
                                                    <td>{item.RatioFrom2MonthTo6Month}  (%)</td>
                                                    <td style={{ textAlign: 'center' }}>
                                                      <div style={{ background: '#00CED1', color: 'white', width: '18px', height: '18px' }} ></div>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <th >Over 6 Month</th>
                                                    <td>{FormatMoney(item.TotalOver6Month)}</td>
                                                    <td>{item.RatioOver6Month}  (%)</td>
                                                    <td style={{ textAlign: 'center' }}>
                                                      <div style={{ background: '#DC143C', color: 'white', width: '18px', height: '18px' }} ></div>
                                                    </td>
                                                  </tr>

                                                </>


                                              </>


                                            )
                                          })

                                        }

                                        {/*  )
                                                                                    })

                                                                                } */}


                                      </tbody>
                                    </table>
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* báo cáo tồn kho theo kho  */}

                  </div>
                  <div class='row'>
                    {/* tỷ lệ tồn kho theo nhóm sản phẩm */}

                    <div class="col-xl-12 col-md-12">
                      <div class="card card-success homepagechart" style={{ minHeight: '230px' }}>
                        <div class="three">
                          <h6><i class="fa fa-calendar" aria-hidden="true"></i> Inventory According To Procduct Group</h6>
                        </div>
                        <div className="row">
                          <div class="col-md-6" style={{ paddingLeft: '9%', paddingTop: '30px' }}>
                            <div >

                              {HiddenChartInventoryProductGroup === false &&
                                <div className="chartloading">
                                  <Img
                                    src="../../assets/img/loading.gif"
                                    width='100px'
                                  />
                                </div>

                              }
                              {
                                HiddenChartInventoryProductGroup === true && DataChartInventoryProductGroup.length > 0 &&

                                <ChartTemp
                                  data={DataChartInventoryProductGroup}
                                  height='300'
                                  type='pie'
                                  Typerun={TypeRun3}

                                  id="ChartInventoryProductGroup"
                                  legendShow={false}
                                  Color={arrService}
                                  dataLabelscolor={['#000000']}
                                />
                              }
                              {
                                HiddenChartInventoryProductGroup === true && DataChartInventoryProductGroup.length === 0 &&
                                <div className="chartloading mt-5">
                                  No Data!
                                </div>

                              }


                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className='DataChartServiceDetail '>
                              <div className="col-md-12 chartdtinfor margin-top-20">
                                <div className="row margin-top-10">
                                  {
                                    <table class="table table-striped" style={{ fontSize: '12px', fontTotalNumberImport: 'bolder', textAlign: 'center' }}>
                                      <thead>
                                        <tr>
                                          <th>Product Group</th>
                                          <th>Number</th>
                                          <th>Ratio (%)</th>
                                          <th style={{ width: '50px' }}>(Color)</th>
                                        </tr>
                                      </thead>
                                      <tbody>

                                        {

                                          DataChartInventoryProductGroup.length > 0 && DataChartInventoryProductGroupMap.map((item, index) => {
                                            debugger
                                            return (
                                              <>
                                                <>
                                                  <tr>
                                                    <th >{item.ProductGroupCode}</th>
                                                    <td>{FormatMoney(item.Inventory)}</td>
                                                    <td>{item.RatioInventory}  (%)</td>
                                                    <td style={{ textAlign: 'center' }}>
                                                      <div style={{ background: item.color, color: 'white', width: '18px', height: '18px' }} ></div>
                                                    </td>
                                                  </tr>


                                                </>


                                              </>


                                            )
                                          })

                                        }

                                        {/*  )
                                                                                    })

                                                                                } */}


                                      </tbody>
                                    </table>
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* báo cáo tồn kho theo kho  */}

                  </div>
                  <div className="row">
                    <div class="col-xl-12 col-md-12">
                      <div class="card card-success homepagechart" style={{ minHeight: '230px' }}>
                        <div class="three">
                          <h6><i class="fa fa-calendar" aria-hidden="true"></i> Inventory According To Shelves</h6>
                        </div>
                        <div className="row">
                          <div class="col-md-6" style={{ paddingLeft: '9%', paddingTop: '30px' }}>
                            <div >

                              {HiddenChartInventoryShelves === false &&
                                <div className="chartloading">
                                  <Img
                                    src="../../assets/img/loading.gif"
                                    width='100px'
                                  />
                                </div>
                              }
                              {
                                HiddenChartInventoryShelves === true && DataChartInventoryShelves.length > 0 &&

                                <ChartTemp
                                  data={DataChartInventoryShelves}
                                  height='300'
                                  type='pie'
                                  Typerun={TypeRun3}
                                  id="ChartInventoryShelves"
                                  legendShow={false}
                                  Color={arrService}
                                  dataLabelscolor={['#000000']}
                                />
                              }
                              {
                                HiddenChartInventoryShelves === true && DataChartInventoryShelves.length === 0 &&
                                <div className="chartloading mt-5">
                                  No Data!
                                </div>

                              }
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className='DataChartServiceDetail '>
                              <div className="col-md-12 chartdtinfor margin-top-20">
                                <div className="row margin-top-10">
                                  {
                                    <table class="table table-striped" style={{ fontSize: '12px', fontTotalNumberImport: 'bolder', textAlign: 'center' }}>
                                      <thead>
                                        <tr>
                                          <th>Shelves</th>
                                          <th>Number</th>
                                          <th>Ratio (%)</th>
                                          <th style={{ width: '50px' }}>(Color)</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {

                                          DataChartInventoryShelves.length > 0 && DataChartInventoryShelvesMap.map((item, index) => {
                                            debugger
                                            return (
                                            
                                                <>
                                                  <tr>
                                                    <th >{item.ShelvesName}</th>
                                                    <td>{FormatMoney(item.Inventory)}</td>
                                                    <td>{item.RatioInventory}  (%)</td>
                                                    <td style={{ textAlign: 'center' }}>
                                                      <div style={{ background: item.color, color: 'white', width: '18px', height: '18px' }} ></div>
                                                    </td>
                                                  </tr>
                                                </>
                                            )
                                          })
                                        }
                                      </tbody>
                                    </table>
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div class="col-xl-4 col-md-12">
                      <div class="card mat-stat-card ">
                        <div class="card-block">
                          <div class="row align-items-center b-b-default">
                            <div class="col-sm-12 b-r-default p-b-20 p-t-20 b-r-default">
                              <div class="row align-items-center text-center">
                                <div class="col-2 p-r-0 ">
                                  <i class="fa fa-sign-in text-c-green f-24 bori"></i>
                                </div>
                                <div class="col-10 p-r-0">
                                  <span class='f-title'>{DataChartInventory.reduce((a, v) => a = a + v.TotalNumberImport, 0)} </span>
                                  <p class="text-muted m-b-0">InBound </p>

                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-xl-4 col-md-12">
                      <div class="card mat-stat-card">
                        <div class="card-block">
                          <div class="row align-items-center b-b-default">
                            <div class="col-sm-12 b-r-default p-b-20 p-t-20 b-r-default">
                              <div class="row align-items-center text-center">
                                <div class="col-2 p-r-0">
                                  <i class="fa fa-sign-out text-c-red f-24 bori"></i>
                                </div>
                                <div class="col-10 p-r-0">
                                  <span class='f-title'>{DataChartInventory.reduce((a, v) => a = a + v.TotalNumberExport, 0)}</span>
                                  <p class="text-muted m-b-0">OutBound</p>
                                </div>
                              </div>
                            </div>

                          </div>

                        </div>
                      </div>
                    </div>

                    <div class="col-xl-4 col-md-12">
                      <div class="card mat-stat-card">
                        <div class="card-block">
                          <div class="row align-items-center b-b-default">
                            <div class="col-sm-12 b-r-default p-b-20 p-t-20 b-r-default">
                              <div class="row align-items-center text-center">
                                <div class="col-2 p-r-0">
                                  <i class="fa fa-sitemap text-c-purple f-24 bori"></i>
                                </div>
                                <div class="col-10 p-r-0">
                                  <span class='f-title'>{DataChartInventory.reduce((a, v) => a = a + v.TotalNumberEnd, 0)}</span>
                                  <p class="text-muted m-b-0"> Inventory</p>
                                </div>
                              </div>
                            </div>

                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* end thống kê hệ thống */}
            {/* Chart */}
          </div>
        </div>
      </section>
    </div>
  )
}


