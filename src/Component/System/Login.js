
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import I18n from '../../Language';
import { mainAction } from '../../Redux/Actions';
import { Alerterror, Alertwarning } from "../../Utils";
import { Img } from 'react-image';
import Captcha from 'captcha-image';
import { useHistory, useLocation } from 'react-router-dom';

export const Login = () => {

    //#region Khai báo biến
    const dispatch = useDispatch();
    const [showicon, setshowicon] = useState(false);
    const [CaptCha, setCaptCha] = useState("");
    const CaptChaRef = useRef();
    const [CaptchaImage, setCaptchaImage] = useState("");
    const [Username, setUsername] = useState('');
    const UsernameRef = useRef();
    const [Password, setPassword] = useState('');
    const PasswordRef = useRef();
    const [disbtn, setdisbtn] = useState(false);
    const [Username_FGP, setUsername_FGP] = useState('');
    const Username_FGPRef = useRef();
    const [Email_FGP, setEmail_FGP] = useState('');
    const Email_FGPRef = useRef();
    const [disbtnsend, setdisbtnsend] = useState(true);
    const [IsShowForm, setIsShowForm] = useState(false);
    const [LoginId, setLoginId] = useState('');
    const [Run, setRun] = useState(1);
    const location = useLocation();
    const history = useHistory();
    //#endregion

    //#region begin on page
    useEffect(() => {
        console.log('111');
        DecryptString(location.search.replace("?KeyId=", "").split("DaY").filter(e => e != ''))
        document.querySelector(".main-header").classList.add("display-none");
        document.querySelector(".main-sidebar").classList.add("display-none");
        document.querySelector(".main-footer").classList.add("display-none");
        LoadCapCha();
    }, [location.search]);
    //#endregion

    const DecryptString = async (e) => {
        const TimeLog = Date.now();
        if (e.length === 2) {
            const pr = {
                Json: e[1],
                func: "DecryptString"
            };
            let Time = await mainAction.DecryptString(pr, dispatch);
            console.log("Time" + Time)
            console.log("Time" + TimeLog)
            if ((TimeLog - Time) > 60000) {
                history.replace({ pathname: '/login' })
                window.location.reload()
                return
            } else {
                const pr1 = {
                    Json: e[0],
                    func: "DecryptString",
                };
                const result1 = await mainAction.DecryptString(pr1, dispatch);
                setLoginId(result1)
                if (result1 !== '') {
                    const pr2 = {
                        Json: JSON.stringify({
                            UserName: result1,
                            Keys: 'autologin',
                        }),
                        func: "WH_spAccount_Login"
                    };
                    console.log(pr2);
                    const result2 = await mainAction.API_spCallServer(pr2, dispatch);
                    localStorage.setItem("Accountinfor", JSON.stringify(result2[0]));
                    if (result2.length > 0) {
                        const params3 = {
                            Json: JSON.stringify({
                                AccountId: result2[0].AccountId
                            }),
                            func: "WH_spMenuModule_Permission_Check"
                        };
                        const result3 = await mainAction.API_spCallServer(params3, dispatch);
                        localStorage.setItem("Permissioninfor", JSON.stringify(result3));
                        window.location = "/home";
                    }
                }
            }
        } else {
            history.replace({ pathname: '/login' })
        }
    }

    //#region Function load capcha
    const LoadCapCha = () => {
        const CaptchaImage = new Captcha(
            '25px Arial',
            'center',
            'middle',
            152,
            40,
            '#17a2b8',
            'white',
            6
        ).createImage();
        setCaptchaImage(CaptchaImage);
    }
    //#endregion

    //#region Function show form forgot password
    const ShowFormForgotPass = () => {
        setIsShowForm(true);
    }
    //#endregion

    //#region Function check email and send mail
    const CPN_spOfficer_ForgotPassword_SendEmail = async () => {
        if (Username_FGP === "") {
            Alertwarning(I18n.t('Report.EnterUser'));
            Username_FGPRef.current.focus();
            return;
        }
        if (Email_FGP === "") {
            Alertwarning(I18n.t('Report.EnterEmail'));
            Email_FGPRef.current.focus();
            return;
        }
        if (Email_FGP.includes('@') === false || Email_FGP.includes('.') === false) {
            Alertwarning(I18n.t('Report.correctEmail'));
            Email_FGPRef.current.focus();
            return;
        }
        const pr1 = {
            Checks: 1,
            Username: Username_FGP,
            Email: Email_FGP,
            Passwords: ""
        }
        const params1 = {
            Json: JSON.stringify(pr1),
            func: "CPN_spOfficer_ForgotPassword_SendEmail"
        };
        setdisbtnsend(false);
        const result = await mainAction.API_spCallServer(params1, dispatch);
        if (result.Status === "NOKU") {
            Alertwarning(result.ReturnMess);
            setdisbtnsend(true);
            Username_FGPRef.current.focus();
            return;
        }
        if (result.Status === "NOKE") {
            Alertwarning(result.ReturnMess);
            setdisbtnsend(true);
            Email_FGP.current.focus();
            return;
        }
        if (result.Status === "OK") {
            const par2 = {
                Json: result.ReturnMess + "",
                func: "DecryptString"
            };
            const pass = await mainAction.DecryptString(par2, dispatch);
            const pr3 = {
                Checks: 0,
                Username: Username_FGP,
                Email: Email_FGP,
                Passwords: pass
            }
            const params3 = {
                Json: JSON.stringify(pr3),
                func: "CPN_spOfficer_ForgotPassword_SendEmail"
            };
            const result3 = await mainAction.API_spCallServer(params3, dispatch);
            Alertwarning(result3.ReturnMess);
            setdisbtnsend(true);
            setUsername_FGP('');
            setEmail_FGP('');
        }

    }
    //#endregion

    //#region login
    const WH_spAccount_Login = async (e) => {
        if (e === 'Enter' || e === "click") {
            if (Username === "") {
                Alertwarning(I18n.t('Report.EnterUser'));
                UsernameRef.current.focus();
                return;
            }
            else if (Password === "") {
                Alertwarning(I18n.t('Report.EnterPass'));
                PasswordRef.current.focus();
                return;
            }
            // else if (CaptCha === "") {
            //     Alertwarning(I18n.t('Report.EnterCaptcha'));
            //     CaptChaRef.current.focus();
            //     return;
            // }
            // else if (CaptCha !== (((CaptchaImage.split('data-key="')))[1]).split('"')[0] && CaptCha !== "") {
            //     Alerterror(I18n.t('Report.correctCaptcha'));
            //     CaptChaRef.current.focus();
            //     return;
            // }
            const params = {
                Json: Password,
                func: "EncryptString"
            };
            try {
                const passnew = await mainAction.EncryptString(params, dispatch);
                const pr1 = {
                    UserName: Username,
                    Password: passnew
                }
                const params1 = {
                    Json: JSON.stringify(pr1),
                    func: "WH_spAccount_Login"
                };
                setdisbtn(true);
                const result = await mainAction.API_spCallServer(params1, dispatch);
                localStorage.setItem("Accountinfor", "");
                if (result.IsLoginNumber == -1) {
                    Alertwarning(result.ReturnMess);
                    setdisbtn(false);
                    return;
                }
                if (result[0].IsLoginNumber !== 0) {
                    // if (result[0].IsLoginNumber >= 5) {
                    //     Alertwarning("User đã bị khóa vì nhập sai quá 5 lần!");
                    //     setdisbtn(true);
                    //     return;
                    // } else {
                       
                    // }
                    Alertwarning(I18n.t('Report.correctLogin') + ' ' + result[0].IsLoginNumber + ' ' + I18n.t('Report.correctLogin5'));
                    setdisbtn(false);
                    return;
                }
                else {
                    setUsername("");
                    setPassword("");
                    localStorage.setItem("Accountinfor", JSON.stringify(result[0]));

                    const pr2 = {
                        AccountId: result[0].AccountId
                    }
                    const params2 = {
                        Json: JSON.stringify(pr2),
                        func: "WH_spMenuModule_Permission_Check"
                    };
                    const result2 = await mainAction.API_spCallServer(params2, dispatch);
                    localStorage.setItem("Permissioninfor", JSON.stringify(result2));
                    window.location = "/home";
                    setdisbtn(false);
                }
                setdisbtn(false);
            } catch (error) {
                Alerterror("Lỗi dữ liệu, Vui lòng liên hệ IT Netco!");
                setdisbtn(false);
            }
        }
    }
    //#endregion

    return (
        <div className="content-login container-fluid pd-0">

            {/* login form */}
            <div className="container-login" style={{ display: IsShowForm ? 'none' : "block" }}>
                <div className="card-body Loginform">

                    <div className="row">
                        <div className="col-md-6 margin-top15">
                            <p className="warehouse col-md-10 text-center">Warehouse</p>
                            <div className="col-md-10 text-center">
                                <button onClick={ShowFormForgotPass} type="button" className="btn btn-forgotpass">
                                    <span> Forgot password?</span>
                                </button>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="row logo-row">
                                <div className="col-md-12 text-center mb10">
                                    <Img
                                        src="../../assets/img/logonetconew.png"
                                        className="logocustom"
                                    />
                                </div>
                            </div>

                            <div className="row text-center center">
                                <div className="col-md-10 text-center">
                                    <p className="login-box-msg titlecolor text-center">WELCOME BACK!</p>
                                </div>
                                <div className="col-md-10 margin-top-20">
                                    <div className="form-group">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user iconlogin" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#00bfd8" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <circle cx="12" cy="7" r="4" />
                                            <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                                        </svg>
                                        <input type="text" className="form-control" placeholder="IdentityCard" ref={UsernameRef} onChange={e => setUsername(e.target.value)} />
                                    </div>
                                </div>
                                <div className="col-md-10 margin-top-20">
                                    <div className="form-group">
                                        {showicon == true ?
                                            <svg onClick={a => setshowicon(!showicon)} xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye iconlogin pointerIcon" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#00bfd8" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <circle cx="12" cy="12" r="2" />
                                                <path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7" />
                                            </svg> :
                                            <svg onClick={a => setshowicon(!showicon)} xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye-off iconlogin pointerIcon" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#00bfd8" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <line x1="3" y1="3" x2="21" y2="21" />
                                                <path d="M10.584 10.587a2 2 0 0 0 2.828 2.83" />
                                                <path d="M9.363 5.365a9.466 9.466 0 0 1 2.637 -.365c4 0 7.333 2.333 10 7c-.778 1.361 -1.612 2.524 -2.503 3.488m-2.14 1.861c-1.631 1.1 -3.415 1.651 -5.357 1.651c-4 0 -7.333 -2.333 -10 -7c1.369 -2.395 2.913 -4.175 4.632 -5.341" />
                                            </svg>
                                        }



                                        <input type={!showicon ? "password" : "text"} className="form-control" placeholder="Password" ref={PasswordRef} onChange={e => setPassword(e.target.value)} />
                                    </div>
                                </div>
                                {/* <div className="input-group col-md-10 mb-3">
                                    <input type="email" className="form-control border0 height" placeholder="Username" ref={UsernameRef} onChange={e => setUsername(e.target.value)} />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-user"></span>
                                        </div>
                                    </div>
                                </div> */}
                                {/* <div className="input-group col-md-10 mb-3">
                                    <input type="password" className="form-control border0 height" placeholder="Password" ref={PasswordRef} onChange={e => setPassword(e.target.value)} />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-eye-slash"></span>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="col-md-10 text-center">
                                    <button disabled={disbtn} onClick={e => WH_spAccount_Login(e.type)} type="button" className="btn btn-login">
                                        <span> Login </span>
                                    </button>
                                </div>
                            </div>


                        </div>


                    </div>
                </div>

            </div>

            {/* forgot pass form */}
            <div className="container-fogotpass" style={{ display: IsShowForm ? "block" : 'none' }}>
                <div className="card-body Loginform">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="row logo-row2">
                                <div className="col-md-12 text-center mb10">
                                    <Img
                                        src="../../assets/img/logonetconew.png"
                                        className="logoforgotpass"
                                    />
                                </div>
                            </div>
                            <div className="row text-center center2">
                                <p className="login-box-msg col-md-8 titlecolor text-center">HELLO!</p>
                                <div className="col-md-8 margin-top-20">
                                    <div className="form-group">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user iconlogin" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#00bfd8" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <circle cx="12" cy="7" r="4" />
                                            <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                                        </svg>
                                        <input type="text" className="form-control" placeholder="Username" ref={UsernameRef} onKeyPress={e => WH_spAccount_Login(e.key)} onChange={e => setUsername(e.target.value)} />
                                    </div>
                                </div>
                                <div className="col-md-8 margin-top-20">
                                    <div className="form-group">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-mail iconlogin" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#00bfd8" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <rect x="3" y="5" width="18" height="14" rx="2" />
                                            <polyline points="3 7 12 13 21 7" />
                                        </svg>
                                        <input type="email" className="form-control" placeholder="Email" ref={Email_FGPRef} onChange={e => setEmail_FGP(e.target.value)} />
                                    </div>
                                </div>
                                {/* <div className="input-group col-md-8 mb-3">
                                    <input type="email" className="form-control border0 height" placeholder="Username" ref={UsernameRef} onKeyPress={e => WH_spAccount_Login(e.key)} onChange={e => setUsername(e.target.value)} />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-user"></span>
                                        </div>
                                    </div>
                                </div> */}
                                {/* <div className="input-group col-md-8 mb-3">
                                    <input type="text" className="form-control border0 height" placeholder="Email" ref={Email_FGPRef} onChange={e => setEmail_FGP(e.target.value)} />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-envelope"></span>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="col-md-8 text-center">
                                    <button type="button" className="btn btn-login">
                                        <span> Send email </span>
                                    </button>
                                </div>
                            </div>


                        </div>
                        <div className="col-md-6 margin-top152">
                            <div className="row left135">
                                <p className="warehouse col-md-10 text-center">Warehouse</p>
                                <div className="col-md-10 text-center">
                                    <button type="button" className="btn btn-forgotpass" onClick={e => setIsShowForm(false)}>
                                        <span> Login</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}


