
import React, { useState, useEffect, useRef } from "react";
import { Img } from 'react-image';
import I18n from '../../Language';
import { FormatMoney, FormatNumber, DayInWeek, Alertsuccess, Alertwarning, FirstOrLastDayinMonth, GetDataFromLogin, FormatDateJson } from "../../Utils";
import { useLocation, Link } from 'react-router-dom';
import { mainAction } from '../../Redux/Actions';
import { useSelector, useDispatch } from 'react-redux';
export const HomeForOfficer = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    debugger
    //#region  kiểm tra xác nhận triển khai khách hàng mới
    document.querySelector(".ConfirmNewCustomer").classList.add("display-none");
    CPN_spCustomerDeployment_Check(GetDataFromLogin("OfficerID"));
    //#endregion 
    DayInWeeks();
  }, [])

  //#region biến
  const [Day, setDay] = useState();
  const [Month, setMonth] = useState();
  const [Thu, setThu] = useState();
  const [Timeshow, setTimeshow] = useState();
  const [OfficerName, setOfficerName] = useState();
  const [Avatarh, setAvatarh] = useState("");
  //#endregion

  //#region get thông tin ngày h hiện tại
  const DayInWeeks = () => {
    setThu(DayInWeek(1));
    setMonth(DayInWeek(2));
    setDay(DayInWeek(3));
    setOfficerName(GetDataFromLogin("OfficerName"));
    setAvatarh(GetDataFromLogin("Avatar"));
    var today = new Date();
    var time = today.getHours();
    if (time <= 12) {
      setTimeshow("Hello, Good morning!");
    }
    else {
      setTimeshow("Hello, Good afternoon!");
    }
  }

  //#endregion


  //#region  Kiểm tra  và load danh sách triển khai khác hàng mới
  const [ListDataConfirm, setListDataConfirm] = useState([]);
  const CPN_spCustomerDeployment_Check = async () => {
    const Infor = localStorage.getItem("UserInfor");
    const prcf = {
      Id: 0,
      Creater: JSON.parse(Infor).OfficerID,

    }
    const paramcf = {
      Json: JSON.stringify(prcf),
      func: "CPN_spCustomerDeployment_Check",
      API_key: "netco Apikey2025"
    }
    const Listlcf = await mainAction.API_spCallServer(paramcf, dispatch);
    debugger
    if (Listlcf.Status === 'NOTOK') {
      document.querySelector(".ConfirmNewCustomer").classList.add("display-block");
      const prlist = {
        FromDate: FormatDateJson(FirstOrLastDayinMonth(new Date(), 1)),
        ToDate: FormatDateJson(new Date()),
        AreaId: 0,
        PostId: 0,
        Creater: JSON.parse(Infor).OfficerID,
        Id: -1,
        ConfirmId: JSON.parse(Infor).OfficerID
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
    else {
      document.querySelector(".ConfirmNewCustomer").classList.add("display-none");
      document.querySelector(".ConfirmNewCustomer").classList.remove("display-block");
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

  return (
    <div>
      <div>
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


      </div>
      <div class="content-wrapper contenthome">
        <section class="content margin-top-5">
          <div class="container-fluid ">
            <div className="text-center row">
              {/*        Calendar */}
              <div class="timelineoc  col-md-5 w3-animate-left">
                <div class="container">
                  <div class="calendar-container ">
                    <div class="header">
                      <div class="day">{Day}</div>
                      <div class="month">{Month}</div>
                    </div>
                    <div class="body ">
                      <div class="Thu">
                        <h4>{Thu}</h4>
                        <h4> {Thu}</h4>
                      </div>
                      <div class='text-center'>
                        <img src={Avatarh} className="bor-ra50 " width="80" height="80" />
                      </div>
                      <div>
                        {Timeshow}
                      </div>
                      <div>
                        {OfficerName}
                      </div>
                      <div>
                        Have a great day for you!
                      </div>
                    </div>
                    <div class="ring-left"></div>
                    <div class="ring-right"></div>
                    <div class="ring-left1">
                      <div className='fontst'>
                        Không
                      </div>
                      <div className='fontst'>Nêu</div>
                      <div className='fontst'>Lý</div>
                      <div className='fontst'>Do</div>
                      <div className='fontst'>Chỉ</div>
                      <div className='fontst'>Show</div>
                      <div className='fontst'>Kết</div>
                      <div className='fontst'>Quả</div>
                    </div>
                    <div class="ring-right1">
                      <div className='fontst'>Không</div>
                      <div className='fontst'>Nêu</div>
                      <div className='fontst'>Vấn</div>
                      <div className='fontst'>Đề</div>
                      <div className='fontst'>Chỉ</div>
                      <div className='fontst'>Show</div>
                      <div className='fontst'>Giải</div>
                      <div className='fontst'>Pháp</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* end Calendar */}
              {/*  timeline>*/}
              <div class="timelineoc col-md-7 timeline-badge success">
                <div class="timeline__event  animated fadeInUp delay-3s timeline__event--type1 w3-animate-top">
                  <div class="timeline__event__icon ">
                    <Img
                      src="../../assets/img/timkepping.gif"
                      className="imgtimekeeping"
                    />
                  </div>
                  <div class="timeline__event__date">
                    08 : 00 AM
                  </div>
                  <div class="timeline__event__content ">
                    <div class="timeline__event__title">
                      Chấm công
                    </div>
                    {/*   <div class="timeline__event__description">
                    <p>
                    </p>
                  </div> */}
                  </div>
                </div>


                <div class="timeline__event animated fadeInUp delay-2s timeline__event--type2 w3-animate-left">
                  <div class="timeline__event__icon">
                    <Img
                      src="../../assets/img/infor.gif"
                      className="imgtimekeeping2"
                    />

                  </div>
                  <div class="timeline__event__date">
                    08 : 00 - 12 : 00 AM
                  </div>
                  <div class="timeline__event__content">
                    <div class="timeline__event__title">
                      Ca Sáng
                    </div>
                  </div>
                </div>


                <div class="timeline__event animated fadeInUp delay-1s timeline__event--type3 w3-animate-right">
                  <div class="timeline__event__icon">
                    <i class="fa fa-battery-charging" aria-hidden="true"></i>

                  </div>
                  <div class="timeline__event__date">
                    12 : 00 - 13 : 30 PM
                  </div>
                  <div class="timeline__event__content">
                    <div class="timeline__event__title">
                      Nghỉ trưa
                    </div>
                    {/*  <div class="timeline__event__description">
                    <p>nghỉ trưa</p>
                  </div> */}
                  </div>
                </div>


                <div class="timeline__event animated fadeInUp timeline__event--type1 w3-animate-left">
                  <div class="timeline__event__icon">
                    <Img
                      src="../../assets/img/infor.gif"
                      className="imgtimekeeping2"
                    />

                  </div>
                  <div class="timeline__event__date2">
                    13 : 30 - 17 : 30 PM
                  </div>
                  <div class="timeline__event__content">
                    <div class="timeline__event__title2">
                      Ca Chiều
                    </div>
                    {/*  <div class="timeline__event__description">
                    <p>ddddđ</p>
                  </div> */}
                  </div>
                </div>

                <div class="timeline__event  animated fadeInUp delay-3s timeline__event--type1 w3-animate-bottom">
                  <div class="timeline__event__icon ">
                    <Img
                      src="../../assets/img/iconac.png"
                      className="imgtimekeeping2"
                    />
                  </div>
                  <div class="timeline__event__date">
                    17 : 30 PM
                  </div>
                  <div class="timeline__event__content ">
                    <div class="timeline__event__title">
                      Báo cáo và Chấm công!
                    </div>
                    {/*  <div class="timeline__event__description">
                    <p>Báo cáo
                    </p>
                  </div> */}
                  </div>
                </div>

              </div>
              {/*  end timeline */}
            </div>
          </div>
        </section>
      </div>
    </div>


  )
}

