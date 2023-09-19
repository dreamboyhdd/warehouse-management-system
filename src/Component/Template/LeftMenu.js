import React, { useEffect, useState, } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Img } from 'react-image'
import { EncodeString, GetDataFromLogin, Alertwarning } from "../../Utils";
import I18n from '../../Language';
import { mainAction } from '../../Redux/Actions';
import { Alertsuccess, Alerterror } from "../../Utils";


export const LeftMenu = () => {
  const UserInfor = localStorage.getItem("UserInfor");
  const Avatar = GetDataFromLogin("Avatar");
  const OfficerName = GetDataFromLogin("OfficerName");
  const OfficerID = GetDataFromLogin("OfficerID");
  const [ListMenu, setListMenu] = useState([]);
  let IsEffect = 1;
  const dispatch = useDispatch();
  const location = useLocation();
  const AccountName = GetDataFromLogin("AccountName");

  /* run after render */

  let keyLang = localStorage.getItem("keyLang")
  if (keyLang === "EN") {

    IsEffect++
    I18n.defaultLocale = 'vn';
    I18n.locale = 'en';
    I18n.fallbacks = true;
  } else {
    I18n.defaultLocale = 'en';
    I18n.locale = 'vn';
    I18n.fallbacks = true;
  }

  useEffect(() => {
    const keyLang = localStorage.getItem("keyLang");
    if (keyLang === "" || keyLang === null || keyLang === undefined) {
      WH_spMenuModule_LoadLeftMenu_Language_List("VN");
    }
    else {
      WH_spMenuModule_LoadLeftMenu_Language_List(keyLang);
    }

  }, [IsEffect]);

  //#region load left menu
  const WH_spMenuModule_LoadLeftMenu_Language_List = async (Key) => {
    const pr = {

      OfficerId: GetDataFromLogin("AccountId"),
      KeyLanguage: Key

    }
    const params = {
      Json: JSON.stringify(pr),
      func: "WH_spMenuModule_LoadLeftMenu_Language_List",
      API_key: "netco Apikey2025"
    }
    debugger
    const List = await mainAction.API_spCallServer(params, dispatch);
    try {
      let menulevel1 = List.filter(p => p.sLevel === 1);
      const newDatadt = menulevel1.map(item => {

        return (
          item.ActionName !== ''
            ? (

              <li className="nav-item lmenu">
                <Link to={item.ActionName + "?id=" + item.MenuId} className="nav-link" title={item.Title}>
                  <i className={item.IconLink}></i>
                  <p >
                    {item.MenuName}
                    <i className="right fas fa-angle-right"></i>
                  </p>
                </Link>
               

              </li>
            )
            :
            (<li className="nav-item lmenu">
              <a href="#" className="nav-link" title={item.MenuName}>
                <i className={item.IconLink}></i>
                <p >
                  {item.MenuName}
                  <i className="right fas fa-angle-left"></i>
                </p>
              </a>
              {GeneralMenu(item.MenuId, List, 0)}
            </li>
            )

        )
      })
      setListMenu(newDatadt);
    }
    catch (er) {
      Alertwarning(I18n.t('Report.NoData'));
      console.log(er, "WH_spMenuModule_LoadLeftMenu_Language_List");
    }

  }
  const GeneralMenu = (MenuId, List, Stt) => {
    let child = List.filter(p => p.ParentId === MenuId);

    return (child.length > 0 ?
      (
        <ul className="nav nav-treeview ">
          {

            child.map((itm, Key) => {
              return (
                (
                  itm.ControllerName === "" ? (
                    <li className={(location.search.split("?id=")[1] === itm.ParentId ? "nav-item lmenu activelmenu" : "nav-item lmenu")}>
                      <a href="#" className="nav-link" title={itm.MenuName}>
                        <i> {itm.sLevel === 2 ? ((Key + 1) + '. ') : (Stt + '.' + (Key + 1)) + '. '} </i>
                        <p>
                          {itm.MenuName}
                          <i className={itm.ControllerName === 'K' ? "right fas fa-angle-left" : "right fas fa-angle-left  display-none"}></i>
                        </p>
                      </a>
                      {GeneralMenu(itm.MenuId, List, Key + 1)}
                    </li>
                    /*  */
                  ) :
                    (

                      <li className={(location.pathname === itm.ActionName ? "nav-item lmenu activelmenu" : "nav-item lmenu")}>
                        <Link to={itm.ActionName + "?id=" + itm.MenuId} className="nav-link" title={itm.Title}>
                          <i> {itm.sLevel === 2 ? ((Key + 1) + '. ') : (Stt + '.' + (Key + 1)) + '. '} </i>
                          <p> {itm.MenuName}</p>
                          <i className={itm.ControllerName === 'K' ? "right fas fa-angle-left" : "right fas fa-angle-left  display-none"}></i>
                        </Link>
                        {GeneralMenu(itm.MenuId, List, Key + 1)}
                      </li>
                    ))
              )



            })
          }
        </ul>
      )
      : (<></>)
    );
  }
  //#endregion

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4 color-leftmenu">
      <div className="sidebar">
      <div className="user-panel mb-3 user-panel-container">
          <Link to="/home">
            <div className="image">
              <Img src={Avatar} className="user-panel-avatar img-circle elevation-2 " alt="User Image" />
            </div>
          </Link>
          <div className="info">
            <Link to="/home">
              <a href="/home" className="d-block user-panel-accountname">{AccountName}</a>
            </Link>
          </div>
        </div>
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            {ListMenu}

          </ul>
        </nav>
      </div>
    </aside>


  )
}

