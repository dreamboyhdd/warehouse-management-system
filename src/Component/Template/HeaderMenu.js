import React, { useState, useEffect, useLayoutEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { Img } from 'react-image'
import { mainAction } from '../../Redux/Actions'
import { getData, setData } from '../../Utils/Storage';
import { EncodeString, GetDataFromLogin, Alertwarning, Alerterror } from "../../Utils";
import { LANE } from "../../Enum";
import { useHistory, useLocation } from 'react-router-dom';
import I18n from 'i18n-js';

export const HeaderMenu = () => {
  const location = useLocation();
  const history = useHistory()
  let OfficerId = GetDataFromLogin("AccountId");
  /* run after render */
  const [isRun, setIsRun] = useState(1)


  useEffect(() => {
    debugger
    let currentUrl = window.location.href;
    let OfficerId = GetDataFromLogin("AccountId");
    if ((currentUrl === 'https://erp-wms.vps.vn/' || currentUrl === 'https://erp-wms.vps.vn' || currentUrl.indexOf("https://erp-wms.vps.vn") !== -1) && (OfficerId == "Login pls" ) && currentUrl !== 'https://erp-wms.vps.vn/login') {
      setTimeout(() => {
        window.location = "https://erp-wms.vps.vn/login";
      }, 2000);
    }
    else if ((currentUrl === 'https://erp-wms.vps.vn/' || currentUrl === 'https://erp-wms.vps.vn') && (OfficerId !== "Login pls" )) {
      setTimeout(() => {
        window.location = "https://erp-wms.vps.vn/home";
      }, 2000);
    }
    else if (currentUrl.indexOf("/login") === -1
      && currentUrl.indexOf("/logout") === -1
      && currentUrl.indexOf("/home") === -1
      && currentUrl.indexOf("/localhost") === -1
      && currentUrl.indexOf("/thiet-lap-mau-sac") === -1
      && currentUrl.indexOf("/thiet-lap-kich-thuoc") === -1
      && currentUrl.indexOf("/ShowPass") === -1 ) {
      if (location.search !== "" && location.search.indexOf("id=") !== -1) {
        debugger
        let _params = location.search
          .replace("?", "")
          .split("&")
          .find((p) => p.indexOf("id=") !== -1);
        WH_spLogModule_Save(_params.split("id=")[1], window.location.pathname);
      }
      else {
        mainAction.LOADING({ IsLoading: false }, dispatch);
        Alerterror("Invalid function link !");
        setTimeout(() => {
          window.location = "/home";
        }, 1000);
        return
      }
    }


  }, [location.search]);

  useEffect(() => {
    //#region Đa ngôn ngữ hệ thống
    initialLanguage();
    //changeLanguage(localStorage.getItem("keyLang"))
    changeLanguage("EN")
    //#endregion
    if (localStorage.getItem("keyLang") === "EN") {
      setActiveStar(false)
    }

  }, [isRun]);


  //#endregion
  const dispatch = useDispatch();
  const keyLang = localStorage.getItem("keyLang")
  let KeyEn = <Img src="dist/img/VN.png" alt="User Avatar" style={{ width: "25px" }} />
  if (keyLang === "EN") {
    KeyEn = <Img src="dist/img/EN.png" alt="User Avatar" style={{ width: "25px" }} />
  }
  const [ActiveStar, setActiveStar] = useState(true)

  //#region đa ngôn ngữ hệ thống
  const changeLanguage = async (keylang) => {
    let params = {
      language: keylang,
      Type: 1
    }
    const language = await mainAction.changeLanguage(params, dispatch);
    await setData(LANE, JSON.stringify(language));
    //#region đa ngôn ngữ leftmenu
    localStorage.setItem("keyLang", keylang);
    if (keylang === "EN") {
      setActiveStar(false)
      I18n.defaultLocale = 'vn';
      I18n.locale = 'en';
      I18n.fallbacks = true;
    } else {
      setActiveStar(true)
      I18n.defaultLocale = 'en';
      I18n.locale = 'vn';
      I18n.fallbacks = true;
    }
    // window.location.reload();
    //#endregion
  }
  const initialLanguage = () => {
    dispatch(mainAction.checkLanguage(null))
  }
  //#endregion

  //#region  lưu log hệ thống
  const WH_spLogModule_Save = async (MenuId, ActionName) => {
    const prl = {
      MenuId: MenuId,
      UserId: GetDataFromLogin("AccountId"),
      ActionName: ActionName
    }
    const paramsl = {
      Json: JSON.stringify(prl),
      func: "WH_spLogModule_Save",
      API_key: "netco Apikey2025"
    }
    debugger
    const Listl = await mainAction.API_spCallServer(paramsl, dispatch);
    if (Listl.Status === 'NOK') {

      mainAction.LOADING({ IsLoading: false }, dispatch);
      setTimeout(() => {
        window.location = "/home";
      }, 1000);
      return

    }

    //#endregion
  };


  return (

    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars"></i></a>
        </li>
        <li className="nav-item d-none d-sm-inline-block" style={{ marginTop: "5px", marginLeft: "30px" }}>
          {/* <Link to="/login?KeyTime=2"> */}
          <a href='/home'> <Img
            src="../../assets/img/LogoNetco.png"
            width='180px' marginTop="5px"
          /></a>
          {/* </Link> */}
        </li>
      </ul>
      <ul className="navbar-nav ml-auto">
        <span className='blindindex nav-item' style={{ cursor: "default" }}>
          <h4 className='font-xs-12'>Warehouse Management System</h4>
        </span>
      </ul>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item mr-3 d-flex" style={{ alignItems: "center" }}>
          <div className="navbar-search-block">
            <div className="input-group input-group-sm">
              <input type="text"
                style={{ marginRight: "1px" }}
                className="form-control"
                placeholder="Enter product code"
              />
              <div className="input-group-append">
                <button className="btn btn-navbar"
                >
                  <i className="fas fa-search"></i>
                </button>
                <button className="btn btn-navbar" type="button" data-widget="navbar-search">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </li>

        <li className="nav-item dropdown">
          <a className="nav-link" data-toggle="dropdown" href="#">
            {KeyEn}
          </a>
          <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
            <a href="#" className="dropdown-item" onClick={e => {
              changeLanguage("VN")
              setIsRun(isRun + 1)
            }
            }>
              <div className="media">
                <Img src="dist/img/VN.png" alt="User Avatar" className="img-size-50 mr-3" />
                <div className="media-body margin-top-15">
                  <h3 className="dropdown-item-title">
                    VIETNAMESE
                    {ActiveStar ? <span className="float-right text-sm text-danger"><i className="fas fa-star"></i></span> : <span className="float-right text-sm text-muted"><i className="fas fa-star"></i></span>}
                  </h3>
                </div>
              </div>
            </a>
            <div className="dropdown-divider"></div>
            <a href="#" className="dropdown-item" onClick={e => {
              changeLanguage("EN")
              setIsRun(isRun + 1)
            }} >
              <div className="media">
                <Img src="dist/img/EN.png" alt="User Avatar" className="img-size-50 mr-3" />
                <div className="media-body margin-top-15">
                  <h3 className="dropdown-item-title">
                    ENGLISH
                    {ActiveStar ? <span className="float-right text-sm text-muted"><i className="fas fa-star"></i></span> : <span className="float-right text-sm text-danger"><i className="fas fa-star"></i></span>}
                  </h3>
                </div>
              </div>
            </a>
            <div className="dropdown-divider"></div>
          </div>
        </li>



        <li className="nav-item dropdown">
          <a className="nav-link" data-toggle="dropdown" href="#">
            <i className="far fa-bell"></i>
            <span className="badge badge-warning navbar-badge">1</span>
          </a>
          <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right module">

            <span className="dropdown-item dropdown-header">THÔNG BÁO MỚI</span>

            <div className="dropdown-divider"></div>
            <a href="#" className="dropdown-item bg-ripe-malin icon-gradient w3-animate-left">
              <i className="fas fa-envelope mr-2"></i> {/* {I18n.t('Home.CRM')} */}
              <span className="float-right text-muted text-sm">Đang cập nhật</span>
            </a>
          </div>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-widget="fullscreen" href="#" role="button">
            <i className="fas fa-expand-arrows-alt"></i>
          </a>
        </li>

      </ul>
    </nav>
  )
}