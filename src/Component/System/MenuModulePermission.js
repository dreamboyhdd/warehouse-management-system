import React, { useState, useEffect, } from "react";
import I18n from '../../Language';
import { useDispatch } from 'react-redux';
import { mainAction } from '../../Redux/Actions';
import { DataTable } from "../../Common/DataTable";
import { Alerterror, Alertsuccess, Alertwarning, GetDataFromLogin, FormatDateJson } from "../../Utils";
import { SettingColumn, SelectParent, SelectsLevel, SelectAccount, SelectSelectMenuModuleLoadPermission } from '../../Common';
import { ConfirmAlert } from "../../Utils";
import { data } from "jquery";
export const MenuModulePermission = () => {
    //#regon begin using the effect hook
    let IsEffect = 1;
    let keyLang = localStorage.getItem("keyLang")
    if (keyLang === "EN") {
  
      IsEffect ++
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
            WH_spMenuModule_Permission_List(0,"VN");
        }
        else {
            WH_spMenuModule_Permission_List(0,keyLang);
        }
      
    }, [IsEffect]);

    const Creater = GetDataFromLogin("AccountId");
    const CreaterName = GetDataFromLogin("AccountName");
    let datapermisstion = localStorage.getItem("Permissioninfor");//check quyền
   
    //LoadMenu
    const [MenuId, setMenuId] = useState(-1);
    const [KeyLanguage, setKeyLanguage] = useState('VN');
    //load Account
    const onSelectAccount = (AccountId) => {

        setAccountId(AccountId);
        console.log(AccountId, "AccountId");
        WH_spMenuModule_Permission_List(AccountId)
    }

    //load Parent
    const [ParentId, setParentId] = useState('');


    //load Account
    const onSelectAccountt = (AccountIdd) => {
        setAccountIdd(AccountIdd);
        console.log(AccountIdd, "AccountIdd")
        WH_spMenuModule_Permission_List(AccountIdd)
    }

    ///SAVE
    //Save
    const dispatch = useDispatch();
    const [Id, setId] = useState(0);
    const [WH_tblMenuModuleId, setWH_tblMenuModuleId] = useState('');
    const [Edits, setEdits] = useState('');
    const [Adds, setAdds] = useState('');
    const [Deletes, setDeletes] = useState('');
    const [Views, setViews] = useState('');
    const [Excel, setExcel] = useState('');
    const [UpExcel, setUpExcel] = useState('');
    const [Special, setSpecial] = useState('');
    const [AccountId, setAccountId] = useState('');
    const [AccountIdd, setAccountIdd] = useState('');
    const [State, setState] = useState('');
    const [dataarray, setdataarray] = useState('');

    // save
    const WH_spMenuModule_Permission_Save = async () => {

        //kiem tra quyen luu
        if (datapermisstion !== "") {
            let a = JSON.parse(datapermisstion);
            let b = a.find(p => p.WH_tblMenuModuleId === 56 && p.Adds === 'C')
            if (b === undefined) {
                Alertwarning(I18n.t("validate.Youarenotauthorized!"));
                return;
            }
        }

        {
            if (AccountId === "" || AccountId === 0) {
                Alertwarning(I18n.t("validate.Pleasechooseauthorizedaccount!"));
                return;
            }
            const pr = {
                AccountId: AccountId,
                CreateId: GetDataFromLogin("AccountId"),
                CreaterName: GetDataFromLogin("AccountName"),
                ListMenu: DataMenuModule.map((item, index) => {
                    return {
                        MenuId: item.MenuId,
                        Adds: item.Adds,
                        Edits: item.Edits,
                        Deletes: item.Deletes,
                        Views: item.Views,
                        Excel: item.Excel,
                        UpExcel: item.UpExcel,
                        Special: item.Special
                    }
                })

            };

            const params = {
                Json: JSON.stringify(pr),
                func: "WH_spMenuModule_Permission_Save",
            };
            //khóa nút
            //setdisbtn(true);

            try {
                const result = await mainAction.API_spCallServer(params, dispatch);
                //setdisbtn(false);
                if (result.Status === "OK") {
                    Alertsuccess(result.ReturnMess);
                    WH_spMenuModule_Permission_Cancel();
                }
                else {

                    Alerterror(result.ReturnMess);
                }
            } catch (error) {
                //setdisbtn(false);
                Alerterror(I18n.t("validate.Dataerror,pleasecontactITNETCO!"));
            }
        }
    }
    //LIST
    const [DataMenuModule, setDataMenuModule] = useState([]);
    console.log(AccountIdd, "AccountIdd")
    const WH_spMenuModule_Permission_List = async (AccountId,KeyLanguage) => {
        // //kiem tra quyen xem
        // if(datapermisstion !== "")
        // {
        //     datapermisstion = JSON.parse(datapermisstion);
        //     if(datapermisstion.find(p => p.WH_tblMenuModuleId === 56 && p.Views === 'C') === undefined)
        //     {
        //         Alertwarning("Anh/chị không có quyền xem!");
        //         return;
        //     }
        // }

        const pr = {
            Json: JSON.stringify({
                Id: Id,
                MenuId: 0,
                AccountId: AccountId,
                Creater: GetDataFromLogin("AccountId"),
                KeyLanguage: KeyLanguage
               
            }),

            func: "WH_spMenuModule_Permission_List"
        };
        //  //khóa nút
        //setdisbtn(true);
        try {
            const result = await mainAction.API_spCallServer(pr, dispatch);
            //setdisbtn(false);
            setDataMenuModule(result)

        } catch (error) {
            //setdisbtn(false);
            console.log(error);
            Alerterror(I18n.t("validate.apierror!"));
        }
    }
    // Begin cancel
    const WH_spMenuModule_Permission_Cancel = () => {

        setMenuId(0)
        setId(0)
        setAccountIdd(0)
        setAccountId(0)
        setParentId('')


    }

    //adds
    const [mnAdds, setmnAdds] = useState();
    const MenuAdds = (item) => {

        const Add = item.Adds === 'C' ? 'K' : 'C'
        const datanew = [...DataMenuModule];
        datanew.find(p => p.MenuId === item.MenuId).Adds = Add;
        setDataMenuModule(datanew);
    }
    useEffect(() => {
    }, [mnAdds]);

    //edit
    const [mnEdits, setmnEdits] = useState();
    const MenuEdits = (item) => {
        const Edits = item.Edits === 'C' ? 'K' : 'C'
        const datanew = [...DataMenuModule];
        datanew.find(p => p.MenuId === item.MenuId).Edits = Edits;
        setDataMenuModule(datanew);
    }
    useEffect(() => {

    }, [mnEdits]);

    //delete
    const [MnDeletes, setMnDeletes] = useState();
    const MenuDeletes = (item) => {
        const Deletes = item.Deletes === 'C' ? 'K' : 'C'
        const datanew = [...DataMenuModule];
        datanew.find(p => p.MenuId === item.MenuId).Deletes = Deletes;
        setDataMenuModule(datanew)

    }
    useEffect(() => {

    }, [MnDeletes]);
    //Views
    const [MnViews, setMnViews] = useState();
    const MenuViews = (item) => {
        const Views = item.Views === 'C' ? 'K' : 'C'
        const datanew = [...DataMenuModule];
        datanew.find(p => p.MenuId === item.MenuId).Views = Views;
        setDataMenuModule(datanew)

    }
    useEffect(() => {

    }, [MnViews]);
    //Excel
    const [MnExcel, setMnExcel] = useState();
    const MenuExcel = (item) => {
        const Excel = item.Excel === 'C' ? 'K' : 'C'
        const datanew = [...DataMenuModule];
        datanew.find(p => p.MenuId === item.MenuId).Excel = Excel;
        setDataMenuModule(datanew)

    }
    useEffect(() => {

    }, [MnExcel]);

    //UpExcel
    const [MnUpExcel, setMnUpExcel] = useState();
    const MenuUpExcel = (item) => {
        const UpExcel = item.UpExcel === 'C' ? 'K' : 'C'
        const datanew = [...DataMenuModule];
        datanew.find(p => p.MenuId === item.MenuId).UpExcel = UpExcel;
        setDataMenuModule(datanew)

    }
    useEffect(() => {

    }, [MnUpExcel]);

    //Special
    const [MnSpecial, setMnSpecial] = useState();
    const MenuSpecial = (item) => {
        const Special = item.Special === 'C' ? 'K' : 'C'
        const datanew = [...DataMenuModule];
        datanew.find(p => p.MenuId === item.MenuId).Special = Special;
        setDataMenuModule(datanew)

    }
    useEffect(() => {

    }, [MnSpecial]);
    return (

        <div className="content-wrapper pt-2">
            <section className="content">
                <div className="container-fluid">
                    <div className="card card-primary">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-6">
                                    <h3 className="card-title">
                                        <i className="fa fa-bars" />
                                        <span className="font-weight-bold">
                                            {I18n.t("MenuModulePermission.Decentralization")} ({DataMenuModule.length})
                                        </span>
                                    </h3>
                                </div>
                                <div className="col-md-6 card-header-btn">
                                    <a
                                        className="btn btn-danger btn-sm float-right btn-header"

                                        onClick={a => WH_spMenuModule_Permission_Save(a)}
                                    >
                                        <i className="fa fa-key" /> {I18n.t("MenuModulePermission.Decentralization")}
                                    </a>

                                </div>
                            </div>

                        </div>
                        {/* Begin Account Group Card */}
                        <div className="body-padding">
                            <div className="tab-content" id="custom-tabs-two-tabContent">
                                <div

                                    className="tab-pane fade show active"
                                    id="tab_1add"
                                    role="tabpanel"
                                    aria-labelledby="custom-tabs-two-home-tab"

                                >
                                    {/* Header */}
                                    <div className="card-body-form">
                                        <div className="row pb-12">

                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t("MenuModulePermission.SelectAccount")}<span className="form__title__note"></span></label>
                                                    <SelectAccount
                                                        onSelected={e => onSelectAccount(e.value)}
                                                        onAccountId={AccountId}
                                                        items={AccountId}

                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="form__title" >{I18n.t("MenuModulePermission.SelectAccountcopyright")}<span className="form__title__note"></span></label>
                                                    <SelectAccount
                                                        onSelected={e => onSelectAccountt(e.value)}
                                                        onAccountId={AccountIdd}
                                                        items={AccountIdd}

                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                        </div>
                                    </div>
                                    <div >
                                        <div className="row">
                                            <div className="col-md-7">
                                                <h3 style={{ fontSize: '20px', color: 'darkgreen' }}> </h3>
                                            </div>
                                            <div className="col-md-5">
                                                <div className="row" style={{ fontSize: '13px' }}>
                                                    <div className="col-md-2 text-center">
                                                        <div>1</div>
                                                        <div>Thêm</div>
                                                    </div>

                                                    <div className="col-md-1 text-center">
                                                        <div>2</div>
                                                        <div>Sửa</div>

                                                    </div>
                                                    <div className="col-md-1 text-center">
                                                        <div>3</div>
                                                        <div>Xóa</div>

                                                    </div>
                                                    <div className="col-md-2 text-center">
                                                        <div>4</div>
                                                        <div>Xem</div>

                                                    </div>
                                                    <div className="col-md-2 text-center">
                                                        <div>5</div>
                                                        <div>UpExcel</div>

                                                    </div>
                                                    <div className="col-md-2 text-center">
                                                        <div>6</div>
                                                        <div>XuấtExecl</div>

                                                    </div>
                                                    <div className="col-md-2 text-center">
                                                        <div>7</div>
                                                        <div>Đặc biệt</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {//cha
                                            DataMenuModule.filter(p => p.sLevel === 1).map((item, index) => {
                                                return (
                                                    <div>
                                                        <div className="row" key={'Parent' + index}>
                                                            <div className="col-md-7">
                                                                <h3 style={{ color: item.ActionName ===''?'red':'#009688', fontSize: '16px', marginLeft: '15px', textTransform: 'uppercase', }}>{index + 1}. {item.MenuName}</h3>
                                                            </div>
                                                            {item.ActionName !== ''?
                                                                (<div className="col-md-5">
                                                                    <div className="row">

                                                                        <div className="col-md-2 text-center">
                                                                            <div onClick={e => MenuAdds(item)} className="icheck-success d-inline">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={item.Adds === 'C' ? true : false}
                                                                                    class="Permition"
                                                                                    onChange={e => MenuAdds(item)}
                                                                                />
                                                                                <label className="label checkbox icheck-success d-inline"></label>
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-md-1 margin-bottom:20px text-center">
                                                                            <div onClick={e => MenuEdits(item)} className="icheck-success d-inline">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={item.Edits === 'C' ? true : false}
                                                                                    class="Permition"
                                                                                    onChange={e => MenuEdits(item)}
                                                                                />
                                                                                <label className="label checkbox icheck-success d-inline"></label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-1 margin-bottom:20px text-center">
                                                                            <div onClick={e => MenuDeletes(item)} className="icheck-success d-inline">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={item.Deletes === 'C' ? true : false}
                                                                                    class="Permition"
                                                                                    onChange={e => MenuDeletes(item)}
                                                                                />
                                                                                <label className="label checkbox icheck-success d-inline"></label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-2  text-center">
                                                                            <div onClick={e => MenuViews(item)} className="icheck-success d-inline">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={item.Views === 'C' ? true : false}
                                                                                    class="Permition"
                                                                                    onChange={e => MenuViews(item)}
                                                                                />
                                                                                <label className="label checkbox icheck-success d-inline"></label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-2  d-inline text-center">
                                                                            <div onClick={e => MenuExcel(item)} className="icheck-success d-inline">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={item.Excel === 'C' ? true : false}
                                                                                    class="Permition"
                                                                                    onChange={e => MenuExcel(item)}
                                                                                />
                                                                                <label className="label checkbox icheck-success d-inline"></label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-2  text-center">
                                                                            <div onClick={e => MenuUpExcel(item)} className="icheck-success d-inline">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={item.UpExcel === 'C' ? true : false}
                                                                                    class="Permition"
                                                                                    onChange={e => MenuUpExcel(item)}
                                                                                />
                                                                                <label className="label checkbox icheck-success d-inline"></label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-2 i text-center">
                                                                            <div onClick={e => MenuSpecial(item)} className="icheck-success d-inline">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={item.Special === 'C' ? true : false}
                                                                                    class="Permition"
                                                                                    onChange={e => MenuSpecial(item)}
                                                                                />
                                                                                <label className="label checkbox icheck-success d-inline"></label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>)
                                                            :( <div className="col-md-5">
                                                                <div className="row">
                                                                    <div className=" col-md-2 icheck-success d-inline text-center">

                                                                    </div>
                                                                    <div className="col-md-2 icheck-success d-inline text-center">

                                                                    </div>
                                                                    <div className="col-md-1 icheck-success d-inline text-center">

                                                                    </div>
                                                                    <div className="col-md-1 icheck-success d-inline text-center">

                                                                    </div>

                                                                    <div className="col-md-2 icheck-success d-inline text-center">

                                                                    </div>

                                                                    <div className="col-md-2 icheck-success d-inline text-center">

                                                                    </div>

                                                                    <div className="col-md-2 icheck-success d-inline text-center">

                                                                    </div>
                                                                </div>
                                                            </div>)
                                                            }

                                                        </div>
                                                        <div>
                                                            {///con
                                                                DataMenuModule.filter(p => p.ParentId === item.MenuId && p.sLevel !== 1).map((itemmenu, indexmenu) => {
                                                                    return (
                                                                        <div className="row" key={'MenuModule' + indexmenu} style={{ paddingBottom: '8px' }}>
                                                                            <div className="col-md-7">
                                                                                <h3 style={{ marginLeft: '5%', color: 'blue', fontSize: '14px' }}> - {itemmenu.MenuName}</h3>
                                                                            </div>
                                                                            <div className="col-md-5">
                                                                                <div className="row">

                                                                                    <div className="col-md-2 text-center">
                                                                                        <div onClick={e => MenuAdds(itemmenu)} className="icheck-success d-inline">
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                checked={itemmenu.Adds === 'C' ? true : false}
                                                                                                class="Permition"
                                                                                                onChange={e => MenuAdds(itemmenu)}
                                                                                            />
                                                                                            <label className="label checkbox icheck-success d-inline"></label>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-md-1 margin-bottom:20px text-center">
                                                                                        <div onClick={e => MenuEdits(itemmenu)} className="icheck-success d-inline">
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                checked={itemmenu.Edits === 'C' ? true : false}
                                                                                                class="Permition"
                                                                                                onChange={e => MenuEdits(itemmenu)}
                                                                                            />
                                                                                            <label className="label checkbox icheck-success d-inline"></label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-1 margin-bottom:20px text-center">
                                                                                        <div onClick={e => MenuDeletes(itemmenu)} className="icheck-success d-inline">
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                checked={itemmenu.Deletes === 'C' ? true : false}
                                                                                                class="Permition"
                                                                                                onChange={e => MenuDeletes(itemmenu)}
                                                                                            />
                                                                                            <label className="label checkbox icheck-success d-inline"></label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-2  text-center">
                                                                                        <div onClick={e => MenuViews(itemmenu)} className="icheck-success d-inline">
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                checked={itemmenu.Views === 'C' ? true : false}
                                                                                                class="Permition"
                                                                                                onChange={e => MenuViews(itemmenu)}
                                                                                            />
                                                                                            <label className="label checkbox icheck-success d-inline"></label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-2  d-inline text-center">
                                                                                        <div onClick={e => MenuExcel(itemmenu)} className="icheck-success d-inline">
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                checked={itemmenu.Excel === 'C' ? true : false}
                                                                                                class="Permition"
                                                                                                onChange={e => MenuExcel(itemmenu)}
                                                                                            />
                                                                                            <label className="label checkbox icheck-success d-inline"></label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-2  text-center">
                                                                                        <div onClick={e => MenuUpExcel(itemmenu)} className="icheck-success d-inline">
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                checked={itemmenu.UpExcel === 'C' ? true : false}
                                                                                                class="Permition"
                                                                                                onChange={e => MenuUpExcel(itemmenu)}
                                                                                            />
                                                                                            <label className="label checkbox icheck-success d-inline"></label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-2 i text-center">
                                                                                        <div onClick={e => MenuSpecial(itemmenu)} className="icheck-success d-inline">
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                checked={itemmenu.Special === 'C' ? true : false}
                                                                                                class="Permition"
                                                                                                onChange={e => MenuSpecial(itemmenu)}
                                                                                            />
                                                                                            <label className="label checkbox icheck-success d-inline"></label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )

                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
};