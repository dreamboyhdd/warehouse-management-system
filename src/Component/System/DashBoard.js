import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { mainAction } from '../../Redux/Actions';
import { Alerterror, Alertwarning, Alertsuccess, GenerateNumber } from "../../Utils";
import { Img } from 'react-image';
import I18n from '../../Language';
export const DashBoard = () => {

  //#region Khai báo biến
  const dispatch = useDispatch();
  const [UserName, setUserName] = useState("");
  const [OfficerName, setOfficerName] = useState("");
  const [Avatarh, setAvatarh] = useState("");
  const [OfficerID, setOfficerID] = useState("");
  const [IsShowDasboard, setIsShowDasboard] = useState(true);
  const [IsShowChangePass, setIsShowChangePass] = useState(false);
  const [IsShowChangeAvatar, setIsShowChangeAvatar] = useState(false);
  const [CheckPassword, setCheckPassword] = useState("");
  const [Color, setColor] = useState({ color: 'red' });
  const [PasswordNew, setPasswordNew] = useState('');
  const PasswordNewRef = useRef();
  const [PasswordNewConfirm, setPasswordNewConfirm] = useState('');
  const PasswordNewConfirmRef = useRef();
  const [SMSOTPConfirm, setSMSOTPConfirm] = useState('');
  const SMSOTPConfirmRef = useRef();
  const [SMSOTP, setSMSOTP] = useState("");
  const [CheckSMSOTP, setCheckSMSOTP] = useState(0);
  const [disbtnsend, setdisbtnsend] = useState(true);
  const [CheckBlockPass, setCheckBlockPass] = useState("");
  const [CheckChangePass, setCheckChangePass] = useState("");
  const [CheckAvartar, setCheckAvartar] = useState("");
  const [CheckPermission, setCheckPermission] = useState("");
  const [Phone, setPhone] = useState("");
  const [ShowChooseAvatar, setShowChooseAvatar] = useState("");
  const [Avatar, setAvatar] = useState("/assets/img/noimage.jpg");
  const [FileUpload, setFileUpload] = useState({});
  const [OldAvatar, setOldAvatar] = useState("/assets/img/noimage.jpg");
  const [ShowSaveAvatar, setShowSaveAvatar] = useState("display-none");
  //#endregion

  //#region run before render 
  useEffect(() => {
    debugger
    document.querySelector(".main-header").classList.add("display-none");
    document.querySelector(".main-sidebar").classList.add("display-none");
    document.querySelector(".main-footer").classList.add("display-none");
    _Init();
  }, []);
  //#endregion

  //#region get information officer from local 
  const _Init = async () => {
    debugger
    const Infor = localStorage.getItem("UserInfor");
    if (Infor === "") {
      window.location = "/login";
    }
    else {
      setOfficerID(JSON.parse(Infor).OfficerID);
      const pr1 = {
        Id: (JSON.parse(Infor).OfficerID) + ""
      }
      const params1 = {
        Json: JSON.stringify(pr1),
        func: "CPN_spOfficer_Login_ByID"
      };
      const result = await mainAction.API_spCallServer(params1, dispatch);
      setAvatarh(result[0].newAvartar);
      setUserName(result[0].UserName);
      setOfficerName(result[0].OfficerName);
      setCheckBlockPass(result[0].BlockPass);
      setCheckChangePass(result[0].IsChangePass);
      setCheckAvartar(result[0].Avatar);
      setCheckPermission(result[0].IsPermission);
      setPhone(result[0].Phone);
      localStorage.setItem("UserInfor", JSON.stringify(result[0]));
    }
  }
  //#endregion
  //#region Check confirm password
  const CPN_spOfficer_ChangePassword = async () => {
    debugger
    if (PasswordNewConfirm === "") {
      Alerterror(I18n.t('Report.Enterpasswordnnew'));
      PasswordNewConfirmRef.current.focus();
      return;
    }
    if (PasswordNewConfirm !== PasswordNew) {
      Alerterror(I18n.t('Report.Incorrectpassword'));
      PasswordNewConfirmRef.current.focus();
      return;
    }
    if (SMSOTPConfirm === "") {
      Alerterror(I18n.t('Report.EntertheSMSOTP'));
      SMSOTPConfirmRef.current.focus();
      return;
    }
    if (SMSOTPConfirm !== SMSOTP) {
      if(CheckSMSOTP < 3)
      {
        setCheckSMSOTP(CheckSMSOTP + 1);
        Alerterror(I18n.t('Report.IncorrectSMSOTP'));
        SMSOTPConfirmRef.current.focus();
        return;
      }
      else
      {
        const prsms = {
          UserId: OfficerID,
          TypeBlock: 'Block'
        }
        const paramssms = {
          Json: JSON.stringify(prsms),
          func: "CPN_spOfficer_BlockOrActiveUser"
        };
  
        await mainAction.API_spCallServer(paramssms, dispatch);
        Alerterror("User is locked!");
      }
    }
    
    setCheckPassword("");
    setCheckSMSOTP(0);
   
    const paramsde = {
      Json: PasswordNew,
      func: "DecryptString"
  };

  const passnewde = await mainAction.DecryptString(paramsde, dispatch);

  const prp = {
    Username: UserName,
    Passwords: passnewde
  }
    const paramp = {
      Json: JSON.stringify(prp),
      func: "CPN_spOfficer_UpdatePassword"
    };

    const resultsms = await mainAction.API_spCallServer(paramp, dispatch);
    Alertsuccess(resultsms.ReturnMess);
    setIsShowDasboard(true);
    setIsShowChangePass(false);
    setPasswordNewConfirm('');
    setPasswordNew('');
    setSMSOTPConfirm('');
    setCheckSMSOTP(0);
    CPN_spOfficer_Login_ByID(OfficerID);
  }
  //#endregion
  //#region Check passwword new 
  const Check_PasswordNew_Strength = () => {
    debugger
    let Strength = 0;
   /*  const SMSOPT = GenerateNumber(6); */
    //if the password length is less than 6, return message.
    if (PasswordNew.length < 6) {
      setCheckPassword("Yếu");
      setColor({ color: 'red' });
      return;
    }
    //length is ok, consts continue.
  
    //if length is 8 characters or more, increase strength value
    if (PasswordNew.length > 7) {
      Strength = 1;
    }
    //if password contains both lower and uppercase characters, increase strength value
    if (PasswordNew.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
      Strength = Strength + 1;
    }
    //if it has numbers and characters, increase strength value
    if (PasswordNew.match(/([a-zA-Z])/) && PasswordNew.match(/([0-9])/)) {
      Strength = Strength + 1;
    }
    //if it has one special character, increase strength value
    if (PasswordNew.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
      Strength = Strength + 1;
    }
    //if it has two special characters, increase strength value
    if (PasswordNew.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) {
      Strength = Strength + 1;
    }

    //now we have calculated strength value, we can return messages
    //if value is less than 2
    if (Strength < 2) {
      setCheckPassword(I18n.t('Report.weak'));
      setColor({ color: 'red' });
      Strength = 0;
      PasswordNewRef.current.focus();
      Alerterror(I18n.t('Report.Checkpasstrength'));
      return;
    }
    else if (Strength === 2) {
      setCheckPassword(I18n.t('Report.medium'));
      setColor({ color: 'green' });
      Strength = 0;
      PasswordNewRef.current.focus();
      Alerterror(I18n.t('Report.Checkpasstrength'));
      return;
    }
    else {
      setCheckPassword(I18n.t('Report.strong'));
      setColor({ color: 'green' });
      Strength = 0;
      setdisbtnsend(true);
      return;
    }
  }
  //#endregion
  //#region Check on change module 

  const CPN_spOfficer_ChangeModule = async (Key) => {
    if (Key == "CHAT") {
      window.open('http://erp-chat.vps.vn/dang-nhap', '_blank');
    }
    if ((CheckBlockPass) === 1) {
      Alertwarning("User has been locked due to incorrect login 5 times. You do not have access!");
      return;
    }
    if ((CheckChangePass) > 14) {
      const params5 = {
        Json: Phone,
        func: "VeryfiSMS"
      };
      const result5 = await mainAction.VeryfiSMS(params5, dispatch);
      setSMSOTP(result5);
      setIsShowDasboard(false);
      setIsShowChangePass(true);
      setdisbtnsend(false);
      return;
    }
    if (CheckAvartar === null || CheckAvartar === '' || CheckAvartar === undefined) {
      setIsShowDasboard(false);
      setIsShowChangeAvatar(true);
      return;
    }
    const keymodule = "fdsfsdfsfwmasjdwuiwqrjoqnfcasomciowqeoiqwroqwdxascwoqioiwuqoi2qwdnasnckaslndqoiwueoiqfgfgfgrtrtrsdfsdfsdfsdfsdfwujrqjdasdqweqwrowuroiewuroiwefncxncxvncxjkvnajhrwirewoiruweorpweofpscmxvnxclkvnsknosriwureruweoirjwefncssdknvjknvj-";
    if (Key === "LGT")
      window.location = "/home";
    else if (Key === "HRM")
      window.open('https://erp-hrm.vps.vn/home/Loginmodule?key= ' + (keymodule + OfficerID) + '', '_blank');
    else if (Key === "ACM")
      window.open('https://erp-ac.vps.vn/home/Loginmodule?key= ' + (keymodule + OfficerID) + '', '_blank');
    else if (Key === "FRM")
      window.open('https://erp-frm.vps.vn//home/Loginmodule?key= ' + (keymodule + OfficerID) + '', '_blank');
    else if (Key === "CRM")
      window.open('https://erp-crm.vps.vn/home/Loginmodule?key= ' + (keymodule + OfficerID) + '', '_blank');
    else if (Key === "WH")
      window.open('https://erp-wh.vps.vn/home/Loginmodule?key= ' + (keymodule + OfficerID) + '', '_blank');
    else if (Key === "EDOC")
      window.open('https://erp.vps.vn/e-document', '_blank');
    else if (Key === "AST")
      window.open('https://erp.vps.vn/QL-thiet-lap/QL-thiet-lap.html', '_blank');
    else if (Key === "EL")
      window.open('https://erp-el.vps.vn/home/Loginmodule?key= ' + (keymodule + OfficerID) + '', '_blank');
    else if (Key === "MAIL") {
      window.open('https://erp-mail.vps.vn', '_blank');
    }
    else if (Key == "SYS") {
      if ((CheckPermission) === 1) {
        window.open('https://erp-system.vps.vn/home/Loginmodule?key= ' + (keymodule + OfficerID) + '', '_blank');
      }
      else {
        Alertwarning("User has has no access!");
        return;
      }
    }


  }
  //#endregion
  //#region  Change avatar
  const onFileUpload = async () => {
    debugger
    try {
      const formData = new FormData();
      formData.append('AppAPIKey', 'netcoApikey2025');
      formData.append('myFile', FileUpload, FileUpload.name);
      const data = await mainAction.API_spCallPostImage(formData, dispatch);
      let newavartar = ((data.Message).replace('"', "")).replace('"', "");
      let ava = ((newavartar).replace('[', "")).replace(']', "");

      Save_avartar(ava);
    }
    catch {
      Alerterror("Er");
    }


  }
  const Save_avartar = async (ava) => {
    const pr1a = {
      Username: UserName,
      Avartar: ava
    }
    const params1a = {
      Json: JSON.stringify(pr1a),
      func: "CPN_spOfficer_UpdateAvartar"
    }
    const resulta = await mainAction.API_spCallServer(params1a, dispatch);
    CPN_spOfficer_Login_ByID(OfficerID);
    Alertsuccess(resulta.ReturnMess);
    setIsShowDasboard(true);
    setIsShowChangeAvatar(false);
  }
  //#endregion
  //#region  Get thông tin
  const CPN_spOfficer_Login_ByID = async (OfficerID) => {
    const prId = {
      Id: OfficerID
    }
    const paramsId = {
      Json: JSON.stringify(prId),
      func: "CPN_spOfficer_Login_ByID"
    };
    const resultId = await mainAction.API_spCallServer(paramsId, dispatch);
    localStorage.setItem("UserInfor", "");
    localStorage.setItem("UserInfor", JSON.stringify(resultId[0]));
    setAvatarh(resultId[0].newAvartar);
    setCheckBlockPass(resultId[0].BlockPass);
    setCheckChangePass(resultId[0].IsChangePass);
    setCheckAvartar(resultId[0].Avatar);
    setCheckPermission(resultId[0].IsPermission);
  }
  //#endregion
  //#region  chọn ảnh đại diện
  const onFileChange = (event) => {
    setFileUpload(event.target.files[0]);
    setShowChooseAvatar("display-none");
    setShowSaveAvatar("");
    setOldAvatar(Avatar);
    setAvatar(URL.createObjectURL(event.target.files[0]));
  };
  const onCancelChangeAvatar = (event) => {
    setShowChooseAvatar("");
    setShowSaveAvatar("display-none");
    setAvatar(OldAvatar);
  };
  //#endregion

  return (
    <div class="DashBoard">
      <div class="body_head">
        <div class="col-md-12 col-sm-12 col-xs-12">
          <div class="row">
            <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
              <Img
                src="../../assets/img/LogoNetco.png"
                class="logoimg"
              />
            </div>
            <div class="col-lg-6 col-md-3 col-sm-12 col-xs-12 text-center">
              <span class="blind">WELCOME TO NETCO ERP SYSTEM</span>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
              <div class='row'>
                <div class='col-lg-3 col-md-3 col-sm-3 col-xs-12'>
                  <img src={Avatarh} className="border-radius" width="50" height="50" />
                </div>
                <div class='col-lg-9 col-md-9 col-sm-9 col-xs-12'>
                  <div className="colorgreen">{UserName}</div>
                  <div className="colorgreen">{OfficerName}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="body_content">
        <div className="body1">
          <div class="row" style={{ display: IsShowDasboard ? "block" : 'none' }}>
            <div className="col-md-12 col-sm-12 col-xs-12 padding-left-25">
              <div class="row">
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12  padding-bottom-10" onClick={e => CPN_spOfficer_ChangeModule("LGT")}>
                  <div class="setwidth">
                    <div class="hovereffect">
                      <img class="img-responsive" src="../../assets/img/LGT.png" height='110px' width='110px' alt="" />
                      <div class="overlay">
                        <h2>LGT</h2>
                        <p><a href="#"> LOGISTIC AND REVENUE</a></p>
                      </div>
                      <div class='rainbow'>LOGISTIC AND REVENUE</div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12  padding-bottom-10" onClick={e => CPN_spOfficer_ChangeModule("ACM")}>
                  <div class="setwidth">
                    <div class="hovereffect">
                      <img class="img-responsive" src="../../assets/img/ACM.png" height='110px' width='110px' alt="" />
                      <div class="overlay">
                        <h2>ACM</h2>
                        <p><a href="#">ACCOUTING MANAGEMENT</a></p>
                      </div>
                      <div class='rainbow'>ACCOUTING MANAGEMENT</div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12  padding-bottom-10" onClick={e => CPN_spOfficer_ChangeModule("HRM")}>
                  <div class="setwidth">
                    <div class="hovereffect">
                      <img class="img-responsive" src="../../assets/img/HRM.png" height='110px' width='110px' alt="" />
                      <div class="overlay">
                        <h2>HRM</h2>
                        <p><a href="#">HUMAN RESOURCES - SALARY</a></p>
                      </div>
                      <div class='rainbow'>HUMAN RESOURCES - SALARY</div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12  padding-bottom-10" onClick={e => CPN_spOfficer_ChangeModule("FRM")}>
                  <div class="setwidth">
                    <div class="hovereffect">
                      <img class="img-responsive" src="../../assets/img/FRM.png" height='110px' width='110px' alt="" />
                      <div class="overlay">
                        <h2>FRM</h2>
                        <p><a href="#">FINANCIAL MANAGEMENTS</a></p>
                      </div>
                      <div class='rainbow'>FINANCIAL MANAGEMENTS</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12  padding-bottom-10" onClick={e => CPN_spOfficer_ChangeModule("CHAT")}>
                  <div class="setwidth">
                    <div class="hovereffect">
                      <img class="img-responsive" src="../../assets/img/CHAT.png" height='110px' width='110px' alt="" />
                      <div class="overlay">
                        <h2>CHAT</h2>
                        <p><a href="#">CHAT & WORKFLOW</a></p>
                      </div>
                      <div class='rainbow'>CHAT & WORKFLOW</div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12  padding-bottom-10" onClick={e => CPN_spOfficer_ChangeModule("MAIL")}>
                  <div class="setwidth">
                    <div class="hovereffect">
                      <img class="img-responsive" src="../../assets/img/MAIL.png" height='110px' width='110px' alt="" />
                      <div class="overlay">
                        <h2>MAIL</h2>
                        <p><a href="#">NETCO E-MAIL</a></p>
                      </div>
                      <div class='rainbow'>NETCO E-MAIL</div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12  padding-bottom-10" onClick={e => CPN_spOfficer_ChangeModule("CRM")}>
                  <div class="setwidth">
                    <div class="hovereffect">
                      <img class="img-responsive" src="../../assets/img/CRM.png" height='110px' width='110px' alt="" />
                      <div class="overlay">
                        <h2>CRM</h2>
                        <p><a href="#">CUSTOMER RELATIONSHIP</a></p>
                      </div>
                      <div class='rainbow'>CUSTOMER RELATIONSHIP</div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12  padding-bottom-10" onClick={e => CPN_spOfficer_ChangeModule("EL")}>
                  <div class="setwidth">
                    <div class="hovereffect">
                      <img class="img-responsive" src="../../assets/img/EL.png" height='110px' width='110px' alt="" />
                      <div class="overlay">
                        <h2>EL</h2>
                        <p><a href="#">ONLINE TRAINING</a></p>
                      </div>
                      <div class='rainbow'>ONLINE TRAINING</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12  padding-bottom-10" onClick={e => CPN_spOfficer_ChangeModule("AST")}>
                  <div class="setwidth">
                    <div class="hovereffect">
                      <img class="img-responsive" src="../../assets/img/AST.png" height='110px' width='110px' alt="" />
                      <div class="overlay">
                        <h2>AST</h2>
                        <p><a href="#">ASSET MANAGEMENTS</a></p>
                      </div>
                      <div class='rainbow'>ASSET MANAGEMENTS</div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12  padding-bottom-10" onClick={e => CPN_spOfficer_ChangeModule("WH")}>
                  <div class="setwidth">
                    <div class="hovereffect">
                      <img class="img-responsive" src="../../assets/img/WH.png" height='110px' width='110px' alt="" />
                      <div class="overlay">
                        <h2>WH</h2>
                        <p><a href="#">WAREHOUSE MANAGEMENTS</a></p>
                      </div>
                      <div class='rainbow'>WAREHOUSE MANAGEMENTS</div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12  padding-bottom-10" onClick={e => CPN_spOfficer_ChangeModule("EDOC")}>
                  <div class="setwidth">
                    <div class="hovereffect">
                      <img class="img-responsive" src="../../assets/img/EDOC.png" height='110px' width='110px' alt="" />
                      <div class="overlay">
                        <h2>EDOC</h2>
                        <p><a href="#">DOCUMENT ONLINE</a></p>
                      </div>
                      <div class='rainbow'>DOCUMENT ONLINE</div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12  padding-bottom-10" onClick={e => CPN_spOfficer_ChangeModule("SYS")}>
                  <div class="setwidth">
                    <div class="hovereffect">
                      <img class="img-responsive" src="../../assets/img/SYS.png" height='110px' width='110px' alt="" />
                      <div class="overlay">
                        <h2>SYS</h2>
                        <p><a href="#">DECENTRALIZED SYSTEMS</a></p>
                      </div>
                      <div class='rainbow'>DECENTRALIZED SYSTEMS</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div className="container container-login" style={{ display: IsShowChangePass ? "block" : 'none' }}>
          <div class="card-body Loginform" >
            <div className="col-md-12 text-center mb10">
              <Img
                src="../../assets/img/LogoNetco.png"
                className="logocustom"
                width="100%"
                className="margin-left-5"
              />
            </div>
            <p class="login-box-msg titlecolor">User has not changed password for more than 15 days! Please change your password !</p>
            <div class="input-group mb-3">
              <input type="password" class="form-control" placeholder="Password New" ref={PasswordNewRef} onBlur={e => Check_PasswordNew_Strength()} onChange={e => setPasswordNew(e.target.value)} />
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-user"></span>
                </div>
              </div>
            </div>
            <div className="colorgreen" style={Color}>{CheckPassword}</div>
            <div class="input-group mb-3">
              <input type="password" class="form-control" placeholder="Confirm Password New" ref={PasswordNewConfirmRef} onChange={e => setPasswordNewConfirm(e.target.value)} />
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-lock"></span>
                </div>
              </div>
            </div>
            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Confirm OTP SMS" ref={SMSOTPConfirmRef} onChange={e => setSMSOTPConfirm(e.target.value)} />
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-sms"></span>
                </div>
              </div>
            </div>
            <div class="input-group mb-3">
              <span>Confirmation code sent via phone number!</span>
            </div>
            <div class="row">
              <div class="col-8">
              </div>
              <div class="col-4">
                <button type="button" disabled={!disbtnsend} onClick={CPN_spOfficer_ChangePassword} class="btn btn-danger btn-block">
                  <i class="fas fa-pen"></i>
                  <span> Update</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container container-login">
          <div class="card-body Loginform" >
            <div className="col-md-12 text-center mb10">
              <Img
                src="../../assets/img/LogoNetco.png"
                className="logocustom"
                width="100%"
                className="margin-left-5"
              />
            </div>
            <p class="login-box-msg titlecolor">{I18n.t('Report.ChangeAvatar')}</p>
            <div className="row">
              <div className="col-md-12 text-center">
                <img src={Avatar} className="avatarCustomer" />
              </div>
              <div
                className={
                  ShowChooseAvatar + " col-md-12 text-center"
                }
              >
              </div>
              <div className="col-md-12 text-center">
                <input
                  type="file"
                  className="fileUpload"
                  onChange={onFileChange}
                  accept="image/*"
                />
                <button
                  type="button"
                  className="btn btn-success"
                  disabled={!disbtnsend}
                >
                  <i class="fas fa-user-plus"></i> {I18n.t('Report.ChooseAvatar')}
                </button>
              </div>
              <div
                className="col-md-12 text-center margin-top-10"
              >
                <button
                  type="button"
                  className="btn btn-sx btn-danger width col-md-6"
                  disabled={!disbtnsend}
                  onClick={onFileUpload}
                >
                  <i class="fas fa-save"></i> {I18n.t('System.Save')}
                </button>
                <button
                  type="button"
                  className="btn btn-sx btn-default width col-md-6 margin-left-5"
                  disabled={!disbtnsend}
                  onClick={onCancelChangeAvatar}
                >
                  <i class="fas fa-save"></i> {I18n.t('System.Cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}