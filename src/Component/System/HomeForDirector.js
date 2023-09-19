import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import I18n from '../../Language';
import { mainAction } from '../../Redux/Actions';
import { Img } from 'react-image';
import { FormatMoney, FormatNumber, GetDataFromLogin, DateDiff, FormatDateJson, FirstOrLastDayinMonth, Alertsuccess, Alertwarning, Alerterror } from "../../Utils";
import ApexCharts from 'apexcharts';
import { useLocation, Link } from 'react-router-dom';
import { DataTable, FromUploadExcel, SelectArea, FormReportMonth, ChartTemp2, } from '../../Common';
export const HomeForDirector = () => {
    const UserId = GetDataFromLogin("OfficerID");
    const location = useLocation();
    
    useEffect(() => {
        /* Kiểm tra nếu link qua từ lgt cũ thì lấy id get infor lưu localStorage */
        document.querySelector(".ind").classList.add("display-none");
        document.querySelector(".ConfirmNewCustomer").classList.add("display-none");


        //#region Gọi chart
        document.querySelector(".ind").classList.add("display-block");
        if (location.search !== "" && location.search.indexOf("KeyTime=") !== -1) {
            let _params = location.search
                .replace("?", "")
                .split("&")
                .find((p) => p.indexOf("KeyTime=") !== -1);
            if (_params.split("KeyTime=")[1] === '0') {
                document.querySelector(".ToDay").classList.add("active");

            }
            if (_params.split("KeyTime=")[1] === '1') {
                document.querySelector(".Week").classList.add("active");

            }
            if (_params.split("KeyTime=")[1] === '2') {
                document.querySelector(".Month").classList.add("active");

            }


            CPN_spLading_System_Statistics_Report(_params.split("KeyTime=")[1], UserId);
            CPN_spCustomer_System_Statistics_Report(_params.split("KeyTime=")[1], UserId);
            CPN_spCustomer_New_System_Statistics_Report(_params.split("KeyTime=")[1], UserId);
            CPN_spLading_System_Statistics_ByPostOffice_Report(_params.split("KeyTime=")[1], UserId);
            CPN_spLading_System_Statistics_Internaltional_Service_Report(_params.split("KeyTime=")[1], UserId);
            CPN_spLading_System_Statistics_Service_Report(_params.split("KeyTime=")[1], UserId);
            CPN_spLading_System_Statistics_AllService_Report(_params.split("KeyTime=")[1], UserId);
            CPN_spLading_System_Statistics_ByArea_Report(_params.split("KeyTime=")[1], UserId);

        }
        else {
            document.querySelector(".Month").classList.add("active");

            CPN_spLading_System_Statistics_Report(2, UserId);
            CPN_spCustomer_System_Statistics_Report(2, UserId);
            CPN_spCustomer_New_System_Statistics_Report(2, UserId);
            CPN_spLading_System_Statistics_ByPostOffice_Report(2, UserId);
            CPN_spLading_System_Statistics_Internaltional_Service_Report(2, UserId);
            CPN_spLading_System_Statistics_Service_Report(2, UserId);
            CPN_spLading_System_Statistics_AllService_Report(2, UserId);
            CPN_spLading_System_Statistics_ByArea_Report(2, UserId);

        }
        //#region  kiểm tra xác nhận triển khai khách hàng mới
        CPN_spCustomerDeployment_Check(UserId);
        //#endregion 
        //#endregion


    }, [])

    //#region  biến
    const dispatch = useDispatch();
    const [TotalBill, setTotalBill] = useState(0);
    const [TotalWeightMass, setTotalWeightMass] = useState(0);
    const [TotalNumber, setTotalNumber] = useState(0);
    const [TotalRevenue, setTotalRevenue] = useState(0);
    const [TotalRevenueAfterDisCount, setTotalRevenueAfterDisCount] = useState(0);
    const [TotalCustomer, setTotalCustomer] = useState(0);
    const [TotalCustomerNew, setTotalCustomerNew] = useState(0);
    const [TotalKhoan, setTotalKhoan] = useState(0);
    const [RatioKhoan, setRatioKhoan] = useState(0);
    const [Active, setActive] = useState(2);
    const [HiddenChartInter, setHiddenChartInter] = useState(false);
    const [HiddenChartsv, setHiddenChartsv] = useState(false);
    const [HiddenChartkv, setHiddenChartkv] = useState(false);
    const [HiddenChartkd, setHiddenChartkd] = useState(false);
    const [DataChartService, setDataChartService] = useState([]);
    const [DataChartint, setDataChartint] = useState([]);
    const [DataLablechartint, setDataLablechartint] = useState([]);

    const [TypeRun2, setTypeRun2] = useState(1);
    const arrService = ["#9B8354", "#1aadce", "#f28f43", "#43f2da", "#9B5454", "#54849B", "#2f7ed8", "#492970", "#9B8354", "#1aadce", "#f28f43", "#43f2da", "#9B5454", "#54849B", "#2f7ed8", "#492970"]
    const [Avatarh, setAvatarh] = useState("");
    //#endregion


    //#region  Kiểm tra  và load danh sách triển khai khác hàng mới
    const [ListDataConfirm, setListDataConfirm] = useState([]);
    const CPN_spCustomerDeployment_Check = async () => {
        const prcf = {
            Id: 0,
            Creater: UserId,

        }
        const paramcf = {
            Json: JSON.stringify(prcf),
            func: "CPN_spCustomerDeployment_Check",
            API_key: "netco Apikey2025"
        }
        const Listlcf = await mainAction.API_spCallServer(paramcf, dispatch);
        if (Listlcf.Status === 'OK') {
            document.querySelector(".ConfirmNewCustomer").classList.add("display-none");
            document.querySelector(".ConfirmNewCustomer").classList.remove("display-block");
        }
        else {
            document.querySelector(".ConfirmNewCustomer").classList.add("display-block");
            const prlist = {
                FromDate: FormatDateJson(FirstOrLastDayinMonth(new Date(), 1)),
                ToDate: FormatDateJson(new Date()),
                AreaId: 0,
                PostId: 0,
                Creater: UserId,
                Id: -1,
                ConfirmId: UserId
            }
            const paramslist = {
                Json: JSON.stringify(prlist),
                func: "CPN_spCustomerDeployment_List",
                API_key: "netcoApikey2025"
            }
            const resultlist = await mainAction.API_spCallServer(paramslist, dispatch);
            setListDataConfirm(resultlist);
            setTotalCf(resultlist.length);
        }
    };
    //#endregion

    //#region  xác nhận triển khai khách hàng mới
    const [TotalCf, setTotalCf] = useState(0);
    const CPN_spCustomerDeployment_ConfirmSave = async (Id) => {
        const prcf = {
            Id: Id,
            Creater: GetDataFromLogin("OfficerID")
        }
        const paramscf = {
            Json: JSON.stringify(prcf),
            func: "CPN_spCustomerDeployment_ConfirmSave",
            API_key: "netcoApikey2025"
        }
        const resultdtcf = await mainAction.API_spCallServer(paramscf, dispatch);
        if (resultdtcf.Status === 'OK') {
            Alertsuccess(resultdtcf.ReturnMess);
            CPN_spCustomerDeployment_Check(GetDataFromLogin("OfficerID"));
        }
        else {
            Alertwarning('Vui lòng kiểm tra lại thông tin');
        }



    }
    //#endregion

    //#region Thống kê vận đơn
    const CPN_spLading_System_Statistics_Report = async (Key, UserId) => {

        const prtk = {
            UserId: UserId,
            KeyTime: Key,
        }
        const paramstk = {
            Json: JSON.stringify(prtk),
            func: "CPN_spLading_System_Statistics_Report",
            API_key: "netcoApikey2025"
        }
        const paramskhoan = {
            Json: JSON.stringify(prtk),
            func: "CPN_spLading_System_Statistics_Contract_Report",
            API_key: "netcoApikey2025"
        }
        const resulttk = await mainAction.API_spCallServer(paramstk, dispatch);
        const resulttkhoan = await mainAction.API_spCallServer(paramskhoan, dispatch);
        let a = (resulttk[0].TotalRevenue / resulttkhoan[0].TotalKhoan) * 100;
        setTotalKhoan(FormatNumber(resulttkhoan[0].TotalKhoan));
        setRatioKhoan(Math.round(a * 100) / 100);
        setTotalBill(FormatNumber(resulttk[0].TotalBill));
        setTotalWeightMass(FormatNumber(resulttk[0].TotalWeightMass));
        setTotalNumber(FormatNumber(resulttk[0].TotalNumber));
        setTotalRevenue(FormatMoney(resulttk[0].TotalRevenue));
        setTotalRevenueAfterDisCount(FormatMoney(resulttk[0].TotalRevenueAfterDisCount));
        CPN_spLading_Revenue_forOffcerBusiness_System_Statistics_Report(Key, resulttk[0].TotalRevenue, UserId);
        let dataCharttk = [], LableCharttk = [];
        dataCharttk.push(resulttk[0].TotalBill, resulttk[0].TotalWeightMass, resulttk[0].TotalNumber, resulttk[0].TotalRevenue, resulttk[0].TotalRevenueAfterDisCount);
        LableCharttk.push("Tổng bill", "Tổng TL", "Tổng Kiện", "Tổng DT", "Tổng DT sau giảm");
        //#region  chart tròn thống kê
        let options1 = {
            chart: {
                height: 180,
                type: "radialBar",
            },
            series: dataCharttk,
            plotOptions: {
                radialBar: {
                    dataLabels: {

                        value: {
                            show: true,
                            fontSize: '14px',
                            formatter: function (val) {
                                return val
                            }
                        },
                        /*  total: {
                           show: true,
                           label: 'THỐNG KÊ',
                           value: 0
                         } */
                    }
                }
            },
            labels: LableCharttk
        };

        const charttk = new ApexCharts(document.querySelector("#charttk"), options1);
        charttk.render();
        //#endregion


    }
    //#endregion

    //#region Thống kê Khách hàng
    const CPN_spCustomer_System_Statistics_Report = async (Key, UserId) => {

        const prc = {
            UserId: UserId,
            KeyTime: Key,
        }
        const paramsc = {
            Json: JSON.stringify(prc),
            func: "CPN_spCustomer_System_Statistics_Report",
            API_key: "netcoApikey2025"
        }
        const resultc = await mainAction.API_spCallServer(paramsc, dispatch);
        setTotalCustomer(FormatNumber(resultc[0].TotalCustomer));

    }
    const CPN_spCustomer_New_System_Statistics_Report = async (Key, UserId) => {

        const pr = {
            UserId: UserId,
            KeyTime: Key,
        }
        const params = {
            Json: JSON.stringify(pr),
            func: "CPN_spCustomer_New_System_Statistics_Report",
            API_key: "netcoApikey2025"
        }
        const result = await mainAction.API_spCallServer(params, dispatch);
        setTotalCustomerNew(FormatNumber(result[0].TotalCustomerNew));

    }

    //#endregion

    //#region Thống kê doanh thu theo chi nhánh
    const CPN_spLading_System_Statistics_ByPostOffice_Report = async (Key, UserId) => {

        const prp = {
            UserId: UserId,
            KeyTime: Key,
        }
        const paramsp = {
            Json: JSON.stringify(prp),
            func: "CPN_spLading_System_Statistics_ByPostOffice_Report",
            API_key: "netcoApikey2025"
        }
        const resultp = await mainAction.API_spCallServer(paramsp, dispatch);

        let dataChartRevenue = [], LableChart = [], dataChartCost = [], dataChartTargetMoneyContract = [], dataChartMoneyContract = [];
        resultp.map(item => {
            dataChartRevenue.push(item.TotalRevenue);
            dataChartCost.push(item.TotalCost);
            LableChart.push(item.POCode);
            dataChartTargetMoneyContract.push(item.MoneyContract);
            dataChartMoneyContract.push(item.TotalRevenue);

        })

        const options = {
            series: [{
                name: "DOANH THU",
                data: dataChartRevenue
            },
            {
                name: "CHI PHÍ",
                data: dataChartCost
            }
                ,
            {
                name: "MỤC TIÊU KHOÁN",
                data: dataChartTargetMoneyContract
            }
                ,
            {
                name: "DT KHOÁN ĐẠT",
                data: dataChartMoneyContract
            }

            ],
            chart: {
                height: 200,
                type: 'line',
                zoom: {
                    enabled: true
                },
            },
            dataLabels: {
                enabled: false
            },
            title: {
                text: "Doanh thu theo chi nhánh",
                align: "left"
            },

            stroke: {
                width: [5, 7, 5],
                curve: 'straight',
                dashArray: [0, 8, 5]
            },
            legend: {
                tooltipHoverFormatter: function (val, opts) {
                    return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
                }
            },
            markers: {
                size: 0,
                hover: {
                    sizeOffset: 6
                }
            },
            xaxis: {
                categories: LableChart,
            },
            yaxis: {
                type: 'numeric'
            },
            tooltip: {
                y: [
                    {
                        title: {
                            formatter: function (val) {
                                return val
                            }
                        }
                    },
                    {
                        title: {
                            formatter: function (val) {
                                return val
                            }
                        }
                    },
                    {
                        title: {
                            formatter: function (val) {
                                return val;
                            }
                        }
                    }
                ]
            },
            grid: {
                borderColor: '#f1f1f1',
            }
        };

        const chartdt = new ApexCharts(document.querySelector("#chartdt"), options);
        chartdt.render();


    }
    //#endregion

    //#region Thống kê doanh thu theo Dịch vụ
    const CPN_spLading_System_Statistics_AllService_Report = async (KeyTime, UserId) => {

        const prallsv = {
            UserId: UserId,
            KeyTime: KeyTime,
        }
        const paramsallsv = {
            Json: JSON.stringify(prallsv),
            func: "CPN_spLading_System_Statistics_AllService_Report",
            API_key: "netcoApikey2025"
        }
        const resultallsv = await mainAction.API_spCallServer(paramsallsv, dispatch);
        let dataChartallsv = [], LableChartallsv = [];
        resultallsv.map(item => {
            dataChartallsv.push(item.Total);
            LableChartallsv.push(item.ServiceCode);
        })
        const optionsallsv = {
            series: [{
                name: "DOANH THU",
                data: dataChartallsv
            },
            ],
            chart: {
                height: 200,
                type: 'line',
                zoom: {
                    enabled: true
                },
            },
            dataLabels: {
                enabled: false
            },

            title: {
                text: "Doanh thu theo dịch vụ",
                align: "left"
            },
            stroke: {
                width: [5, 7, 5],
                curve: 'straight',
                dashArray: [0, 8, 5]
            },
            legend: {
                tooltipHoverFormatter: function (val, opts) {
                    return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
                }
            },
            markers: {
                size: 0,
                hover: {
                    sizeOffset: 6
                }
            },
            xaxis: {
                categories: LableChartallsv,
                title: {
                    text: 'Doanh thu'
                }
            },
            tooltip: {
                y: [
                    {
                        title: {
                            formatter: function (val) {
                                return val
                            }
                        }
                    },
                    {
                        title: {
                            formatter: function (val) {
                                return val
                            }
                        }
                    },
                    {
                        title: {
                            formatter: function (val) {
                                return val;
                            }
                        }
                    }
                ]
            },
            grid: {
                borderColor: '#f1f1f1',
            }
        };
        const chartAllSV = new ApexCharts(document.querySelector("#chartAllSV"), optionsallsv);
        chartAllSV.render();

    }
    //#endregion

    //#region Tỷ lệ doanh thu theo dịch vụ quốc tế
    const CPN_spLading_System_Statistics_Internaltional_Service_Report = async (KeyTime, UserId) => {
        const prsvi = {
            UserId: UserId,
            KeyTime: KeyTime,
        }
        const paramssvi = {
            Json: JSON.stringify(prsvi),
            func: "CPN_spLading_System_Statistics_Internaltional_Service_Report",
            API_key: "netcoApikey2025"
        }
        setActive(KeyTime);
        const resultsvi = await mainAction.API_spCallServer(paramssvi, dispatch);
        if (resultsvi.length > 0) {
            if (resultsvi[0].TotalAmountChart === 0) {
                setHiddenChartInter(true);
            }
            else {
                setHiddenChartInter(false);
            }
            let dataChartsvi = [], LableChartsvi = [];
            resultsvi.map(item => {
                let a = parseInt(Math.round((item.Total / item.TotalAmountChart) * 100));
                dataChartsvi.push(a);
                LableChartsvi.push(item.ServiceCode);

            })
            const optionspie = {
                series: dataChartsvi,
                chart: {
                    width: 300,
                    type: 'donut',
                },
                labels: LableChartsvi,
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 300
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
            };
            const chartsint = new ApexCharts(document.querySelector("#chartint"), optionspie);
            chartsint.render();
        }
        else {
            setHiddenChartInter(true);
        }
    }

    //#endregion

    //#region Tỷ lệ doanh thu theo dịch vụ trong nước
    const CPN_spLading_System_Statistics_Service_Report = async (KeyTime, UserId) => {
        const prsv = {
            UserId: UserId,
            KeyTime: KeyTime,
        }
        const paramssv = {
            Json: JSON.stringify(prsv),
            func: "CPN_spLading_System_Statistics_Service_Report",
            API_key: "netcoApikey2025"
        }
        const resultsv = await mainAction.API_spCallServer(paramssv, dispatch);
        if (resultsv.length > 0) {
            if (resultsv[0].TotalAmountChart === 0) {
                setHiddenChartsv(true);
            }
            else {
                setHiddenChartsv(false);
                const dataok = [];
                resultsv.forEach((item, k) => {
                    let giatri = (item.Total / item.TotalAmountChart) * 100;
                    dataok.push({
                        label: item.ServiceCode,
                        y: Math.round(giatri * 100) / 100,
                        color: arrService[k]
                    });
                });
                await setDataChartService(dataok);
                setTypeRun2(TypeRun2 + 1)
            }

        }
        else {
            setHiddenChartsv(true);
        }

    }
    //#endregion

    //#region Tỷ lệ doanh thu theo khu vực
    const CPN_spLading_System_Statistics_ByArea_Report = async (KeyTime, UserId) => {
        const prkv = {
            UserId: UserId,
            KeyTime: KeyTime,
        }
        const paramsprkv = {
            Json: JSON.stringify(prkv),
            func: "CPN_spLading_System_Statistics_ByArea_Report",
            API_key: "netcoApikey2025"
        }
        const resultkv = await mainAction.API_spCallServer(paramsprkv, dispatch);
        if (resultkv.length > 0) {
            if (resultkv[0].Total === 0) {
                setHiddenChartkv(true);
            }
            else {
                setHiddenChartkv(false);
            }

            let dataChartkv = [], LableChartkv = [];
            resultkv.map(item => {
                let a = parseInt(Math.round((item.TotalRevenue / item.Total) * 100));
                dataChartkv.push(a);
                LableChartkv.push(item.Name);
            })
            const optionspiekv = {
                series: dataChartkv,
                chart: {
                    width: 320,
                    type: "donut",
                    dropShadow: {
                        enabled: true,
                        color: "#111",
                        top: -1,
                        left: 3,
                        blur: 3,
                        opacity: 0.2
                    }
                },
                stroke: {
                    width: 0
                },
                plotOptions: {
                    pie: {
                        donut: {
                            labels: {
                                fontSize: 12,
                                show: false,

                            }
                        }
                    }
                },
                labels: LableChartkv,
                dataLabels: {
                    dropShadow: {
                        blur: 3,
                        opacity: 0.8
                    }
                },
                fill: {
                    type: "pattern",
                    opacity: 1,
                    pattern: {
                        enabled: true,
                        style: [
                            "verticalLines",
                            "squares",
                            "horizontalLines",
                            "circles",
                            "slantedLines"
                        ]
                    }
                },
                states: {
                    hover: {
                        filter: {
                            type: "none"
                        }
                    }
                },
                theme: {
                    palette: "palette2"
                },
                title: {
                    text: ""
                },
                responsive: [
                    {
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 200
                            },
                            legend: {
                                position: "bottom"
                            }
                        }
                    }
                ]
            };
            const chartkv = new ApexCharts(document.querySelector("#chartkv"), optionspiekv);
            chartkv.render();
        }
        else {
            setHiddenChartkv(true);
        }

    }
    //#endregion

    //#region Tỷ lệ doanh thu theo khách hàng mới của nhân viên kinh doanh
    const CPN_spLading_Revenue_forOffcerBusiness_System_Statistics_Report = async (KeyTime, Total, UserId) => {
        const prkvnew = {
            UserId: UserId,
            KeyTime: KeyTime,
        }
        const paramsprkvnew = {
            Json: JSON.stringify(prkvnew),
            func: "CPN_spLading_Revenue_forOffcerBusiness_System_Statistics_Report",
            API_key: "netcoApikey2025"
        }
        const resultkvnew = await mainAction.API_spCallServer(paramsprkvnew, dispatch);
        if (resultkvnew.length > 0) {
            setHiddenChartkd(false);
            let dataChartkvnew = [], LableChartkvnew = [];
            if (resultkvnew.lenght > 0) {
                let a = parseInt(Math.round((resultkvnew[0].Total / Total) * 100));
                dataChartkvnew.push(a, (100 - a));
            }
            else {
                dataChartkvnew.push(0, 100);
            }
            LableChartkvnew.push("KH mới theo NV Kinh doanh", "Doanh thu hệ thống");

            const optionspiekvnew = {
                series: dataChartkvnew,
                chart: {
                    width: 350,
                    type: "donut",
                    dropShadow: {
                        enabled: true,
                        color: "#111",
                        top: -1,
                        left: 3,
                        blur: 3,
                        opacity: 0.2
                    }
                },
                stroke: {
                    width: 0
                },
                plotOptions: {
                    pie: {
                        donut: {
                            labels: {
                                fontSize: 12,
                                show: true,
                                total: {
                                    showAlways: false,
                                    show: false
                                }
                            }
                        }
                    }
                },
                labels: LableChartkvnew,
                dataLabels: {
                    dropShadow: {
                        blur: 3,
                        opacity: 0.8
                    }
                },
                fill: {
                    type: "pattern",
                    opacity: 1,
                    pattern: {
                        enabled: true,
                        style: [
                            "verticalLines",
                            "squares",
                            "horizontalLines",
                            "circles",
                            "slantedLines"
                        ]
                    }
                },
                states: {
                    hover: {
                        filter: {
                            type: "none"
                        }
                    }
                },
                theme: {
                    palette: "palette2"
                },
                title: {
                    text: ""
                },
                responsive: [
                    {
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 250
                            },
                            legend: {
                                position: "bottom"
                            }
                        }
                    }
                ]
            };
            const chartkvnew = new ApexCharts(document.querySelector("#chartkvnew"), optionspiekvnew);
            chartkvnew.render();
        }
        else {
            setHiddenChartkd(true);
        }

    }
    //#endregion

    //#region thay đỏi thời gian
    const ChangeKeyTime = (Key) => {
        localStorage.setItem("KeyTime", Key);
        window.location.href = "/home?KeyTime=" + Key;
    };
    /*   const ChangeKeyTime = (Key) => {
        CPN_spLading_System_Statistics_Report(Key);
        CPN_spCustomer_System_Statistics_Report(Key);
        CPN_spCustomer_New_System_Statistics_Report(Key);
        CPN_spLading_System_Statistics_ByPostOffice_Report(Key);
        CPN_spLading_System_Statistics_Internaltional_Service_Report(Key);
        CPN_spLading_System_Statistics_Service_Report(Key);
        CPN_spLading_System_Statistics_AllService_Report(Key);
        CPN_spLading_System_Statistics_ByArea_Report(Key);
    
      }; */
    //#endregion

    return (
        <div class="content-wrapper">
            <div className='ConfirmNewCustomer'>
                <div className='inforconfirm'>
                    <div className='text-center margin-top-15 margin-bottom-35'>
                        <div class="Thu">
                            <h6>THÔNG TIN TRIỂN KHAI KHÁCH HÀNG MỚI</h6>
                            <h6>THÔNG TIN TRIỂN KHAI KHÁCH HÀNG MỚI</h6>
                        </div>
                        <div>
                            <span class="label label-red">( Vui lòng xác nhận {TotalCf}  thông tin triển khai khách hàng mới để tiếp tục thao tác! )</span>
                        </div>
                    </div>
                    {
                        ListDataConfirm.map((item, index) => {
                            return (
                                <div className='row margin-top-20 borconfirm'>
                                    <div class="col-md-6">
                                        <div class="tag">Mã khách hàng :<span className='bg-ripe-malin icon-gradient'>{item.CustomerCode}</span></div>
                                        <div class="tag">Số điện thoại : {item.Phone}</div>
                                        <div class="tag">Người liên hệ lấy hàng : {item.ContactPerson}</div>
                                        <div class="tag">Hóa đơn chứng từ đi kèm : {item.IsBill}</div>
                                        <div class="tag">Người tạo : {item.CreateName}</div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="tag">Tên khách hàng : {item.CustomerName}</div>
                                        <div class="tag">Địa chỉ lấy hàng : {item.Address}</div>
                                        <div class="tag">Phạm vi phục vụ : {item.ListCity}</div>
                                        <div class="tag">Sản phẩm : {item.ProcustInfor}</div>
                                        <div class="tag">Ngày tạo : {item.CreateTime}</div>
                                    </div>
                                    <div class="col-md-12 text-center">
                                        <button className="btn btn-xs btn-danger margin-left-10" onClick={(e) => window.confirm("bạn chắc chắn xác nhận triển khai?") && CPN_spCustomerDeployment_ConfirmSave(item.Id)}><i class="fas fa-check-circle"></i> {I18n.t('Report.Confirm')}</button> {/*  */}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>


            <section class="content margin-top-5">
                <div class="container-fluid ind">
                    <div className="row">
                        {/* thống kê hệ thống */}
                        <div className="col-md-3 card">
                            <div class="">
                                <ul class="nav nav-tabs margin-top-5 " id="custom-tabs-two-tab" role="tablist">
                                    <li class="nav-item margin-left-1s">
                                        <a className="nav-link Month" id="data-add" data-toggle="pill" onClick={e => ChangeKeyTime(2)} href="/home?KeyTime=2" role="tab" aria-controls="true" aria-selected="true"><span class='bg-ripe-Pink icon-gradient font11'><i class="far fa-calendar-alt"></i> {I18n.t('Home.Month')}</span></a>
                                    </li>
                                    <li class="nav-item bg-ripe-Pink icon-gradient">
                                        <a className="nav-link Week" id="data-list" data-toggle="pill" onClick={e => ChangeKeyTime(1)} href="/home?KeyTime=1" role="tab" aria-controls="custom-tabs-two-profile" aria-selected="false"><span class='bg-ripe-Pink icon-gradient font11'>{I18n.t('Home.Week')}</span></a>
                                    </li>
                                    <li class="nav-item bg-ripe-Pink icon-gradient">
                                        <a className="nav-link ToDay" id="data-list" data-toggle="pill" onClick={e => ChangeKeyTime(0)} href="/home?KeyTime=0" role="tab" aria-controls="custom-tabs-two-profile" aria-selected="false"><span class='bg-ripe-Pink icon-gradient font11'> {I18n.t('Home.Today')}</span></a>
                                    </li>
                                </ul>
                            </div>
                            <div class=" card mar-top-10">
                                <div class="card-title w3-animate-left">
                                    <div className="text-center">
                                        <Img
                                            src="../../assets/img/home.gif"
                                            height="90px"
                                        />
                                    </div>
                                </div>
                                <div class="margin-top-25s">
                                    <div class="">
                                        <div id="DZ_W_TimeLine1" class="widget-timeline dz-scroll style-1 ps ps--active-y" /* style="height:250px;" */>
                                            <ul class="timeline w3-animate-left">
                                                <li>
                                                    <div class="timeline-badge success">
                                                    </div>
                                                    <a class="timeline-panel text-muted" href="#">
                                                        <span>{I18n.t('Home.Totalrevenue')}</span>
                                                        <span className="fonttotal">{TotalRevenue}  (VND)</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <div class="timeline-badge pink">
                                                    </div>
                                                    <a class="timeline-panel text-muted" href="#">
                                                        <span>{I18n.t('Home.Totalrevenueafterdecrease')}</span>
                                                        <span className="fonttotal">{TotalRevenueAfterDisCount} (VND)</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <div class="timeline-badge  oranges">
                                                    </div>
                                                    <a class="timeline-panel text-muted" href="#">
                                                        <span>{I18n.t('Home.TotalContract')}</span>
                                                        <span className="fonttotal">{TotalKhoan} (VND)</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <div class="timeline-badge  blue">
                                                    </div>
                                                    <a class="timeline-panel text-muted" href="#">
                                                        <span>{I18n.t('Home.Ratioofcontractedrevenue')}</span>
                                                        <span className="fonttotal">{RatioKhoan} (%)</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <div class="timeline-badge primary"></div>
                                                    <a class="timeline-panel text-muted" href="#">
                                                        <span>{I18n.t('Report.TotalLading')}</span>
                                                        <span className="fonttotal">{TotalBill}</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <div class="timeline-badge yellow">
                                                    </div>
                                                    <a class="timeline-panel text-muted" href="#">
                                                        <span>{I18n.t('Report.TotalWeight')} </span>
                                                        <span className="fonttotal">{TotalWeightMass}  (KG)</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <div class="timeline-badge danger">
                                                    </div>
                                                    <a class="timeline-panel text-muted" href="#">
                                                        <span>{I18n.t('RePort.TotalNumberLading')}</span>
                                                        <span className="fonttotal">{TotalNumber}</span>
                                                    </a>
                                                </li>

                                                <li>
                                                    <div class="timeline-badge blue">
                                                    </div>
                                                    <a class="timeline-panel text-muted" href="#">
                                                        <span>{I18n.t('Home.TotalCustomer')}</span>
                                                        <span className="fonttotal">{TotalCustomer}</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <div class="timeline-badge oranges">
                                                    </div>
                                                    <a class="timeline-panel text-muted" href="#">
                                                        <span>{I18n.t('Home.TotalcustomerNew')}</span>
                                                        <span className="fonttotal">{TotalCustomerNew}</span>
                                                    </a>
                                                </li>
                                            </ul>
                                            <div class="ps__rail-x"/*  style="left: 0px; bottom: 0px;" */><div class="ps__thumb-x" tabindex="0" /* style="left: 0px; width: 0px;" */></div></div><div class="ps__rail-y" /* style="top: 0px; height: 250px; right: 0px;" */><div class="ps__thumb-y" tabindex="0" /* style="top: 0px; height: 182px;" */></div></div></div>
                                    </div>
                                </div>
                                <div id="charttk">
                                </div>
                            </div>
                        </div>
                        {/* end thống kê hệ thống */}
                        {/* Chart */}
                        <div className="col-md-9">
                            {/*  dịch vụ */}
                            <div id="user-activity" class="card col-md-12 w3-animate-top">
                                <div class="card-header text-center">
                                </div>
                                <div class="">
                                    <div class="tab-content sales_card_bodyservice" id="myTabContent">

                                        {/* trong nước */}
                                        <div class="single_sales card dvtn">
                                            <div className="text-center">
                                                <lable class="font14 bg-ripe-Pink icon-gradient">{I18n.t('Home.domesticservice')}</lable>
                                            </div>
                                            <div className={DataChartService.length > 0 ? "display-block" : "display-none"}>
                                                <ChartTemp2 data={DataChartService} type='pie' height="140" Typerun={TypeRun2} name="B" />
                                            </div>
                                            <div className={HiddenChartsv === false ? "text-center display-none" : "text-center display-block"}>
                                                <div>
                                                    <Img
                                                        src="../../assets/img/tea.gif"
                                                        width='60px'
                                                    />
                                                </div>
                                                <lable class="font12">{I18n.t('Home.Nodatachart')}</lable>
                                            </div>

                                        </div>
                                        {/* End trong nước */}
                                        {/* QUốc tế */}
                                        <div class="single_sales card margin-left-15">
                                            <div className="text-center">
                                                <lable class="font14 bg-ripe-Pink icon-gradient">{I18n.t('Home.internationalservice')}</lable>
                                            </div>
                                            <div id="chartint">
                                            </div>
                                            <div className={HiddenChartInter === false ? "text-center display-none" : "text-center nodatachart display-block"}>
                                                <div>
                                                    <Img
                                                        src="../../assets/img/tea.gif"
                                                        width='60px'
                                                    />
                                                </div>
                                                <lable class="font12">{I18n.t('Home.Nodatachart')}</lable>
                                            </div>

                                        </div>

                                        {/* End quốc tế */}

                                        <div class="single_sales card martop-20 text-center">
                                            <div className="text-center">
                                                <lable class="font14 bg-ripe-Pink icon-gradient">{I18n.t('Home.ByArea')}</lable>
                                            </div>
                                            <div id="chartkv">
                                            </div>
                                            <div className={HiddenChartkv === false ? "text-center display-none" : "text-center nodatachart1 display-block"}>
                                                <div>
                                                    <Img
                                                        src="../../assets/img/tea.gif"
                                                        width='60px'
                                                    />
                                                </div>
                                                <lable class="font12">{I18n.t('Home.Nodatachart')}</lable>
                                            </div>
                                        </div>
                                        <div class="single_sales card martop-20 margin-left-15">
                                            <div className="text-center">
                                                <lable class="font14 bg-ripe-Pink icon-gradient">{I18n.t('Home.ByNewCustomer')}</lable>
                                            </div>
                                            <div id="chartkvnew">
                                            </div>
                                            <div className={HiddenChartkd === false ? "text-center display-none" : "text-center display-block"}>
                                                <div>
                                                    <Img
                                                        src="../../assets/img/tea.gif"
                                                        width='60px'
                                                    />
                                                </div>
                                                <lable class="font12">{I18n.t('Home.Nodatachart')}</lable>
                                            </div>

                                        </div>
                                    </div>
                                    <div class="card card-body martop-20">
                                        <div class="tab-content" id="myTabContent">
                                            <div class="tab-pane fade active show" id="user" role="tabpanel"><div class="chartjs-size-monitor"><div class="chartjs-size-monitor-expand"><div class=""></div></div><div class="chartjs-size-monitor-shrink"><div class=""></div></div></div>
                                                <div id="chartdt">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card card-body">
                                        <div class="tab-content" id="myTabContent">
                                            <div class="tab-pane fade active show" id="user" role="tabpanel"><div class="chartjs-size-monitor"><div class="chartjs-size-monitor-expand"><div class=""></div></div><div class="chartjs-size-monitor-shrink"><div class=""></div></div></div>
                                                <div id="chartAllSV">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*  dịch vụ */}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
