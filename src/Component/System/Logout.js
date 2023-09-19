import React, { useEffect, useState, } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Img } from 'react-image'
import { EncodeString, GetDataFromLogin, Alertwarning } from "../../Utils";
import I18n from '../../Language';
import { mainAction } from '../../Redux/Actions';
import { Alertsuccess } from "../../Utils";
export const Logout = () => {
  const history = useHistory();
  useEffect(() => {
    /*   localStorage.removeItem("Accountinfor");
      window.location = "http://localhost:3000/login"; */
      localStorage.clear()
      Alertsuccess(I18n.t("Leftmenu.Signoutsuccessful"))
      history.push("/login");
  }, []);
  return (
   <div></div>
  )
}