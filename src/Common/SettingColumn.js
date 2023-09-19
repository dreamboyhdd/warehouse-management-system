import React, { useEffect, useState } from 'react';
import I18n from '../Language';
import { GetDataFromLogin, Alerterror } from "../Utils";
import $ from "jquery";
const SettingColumnComp = ({
    Returndata = () => { },
    columns = []
}) => {
    const [show, setshow] = useState(true)
    const [Data, setData] = useState(columns)
    const [DataMain, setDataMain] = useState(columns)
    const [Checkall, setCheckall] = useState(false)

    useEffect(() => {
        setData(columns)
    }, [columns]);

    const Checkbox = (key, IsCheck) => {
        if (key === 'no') {
            DataMain.forEach(i => {
                if(i.special !== true){
                    i.show = !IsCheck
                }
            })
            setCheckall(!IsCheck)
        } else {
            if (IsCheck == undefined) { IsCheck = false }
            DataMain.find(a => a.accessor == key).show = !IsCheck
        }
        setData([...DataMain])
    }
    const Confirm = () => { // column special is not change show hide
        setshow(!show)
        let a = Data.filter(a => a.show == true && a.special !== true)// check choise > 0
        if (a.length > 0) { Returndata(Data.filter(a => a.show == true)) }
    }
    // //close choise
    // $('body').on("click", function (event) {
    //     setshow(!show)
    // })
    return (
        <div className="row">
            <div className="col-md-12 card-header-btn">
                <img src="../../assets/img/settings.gif"
                    class="setinggif float-right"
                    title="Tùy Chỉnh cột"
                    onClick={a => setshow(!show)}
                />
                <div className={show ? 'display-none' : ''}>
                    <div className="col-md-4 float-right">
                        <div className="row col-md-12 div-check">
                            {
                                DataMain.map((e, k) => {
                                    if (e.special !== true) {
                                        return (
                                            <div className="col-sm-6">
                                                <div className="icheck-success d-inline">
                                                    <input type="checkbox"
                                                        id={e.accessor} value={e.accessor}
                                                        checked={e.show}
                                                        onChange={a => Checkbox(e.accessor, e.show)}
                                                    />
                                                    <label className="label checkbox" htmlFor={e.accessor}> {e.Header}</label>
                                                </div>
                                            </div>
                                        )
                                    }
                                })
                            }
                            <div className='row col-md-12 margin-top-5'>
                                <div className="col-md-6">
                                </div>
                                <div className="col-md-6">
                                    <button type="button" className="float-right btn btn-success btn-sm btn-header margin-left-5 margin-right-5"
                                        onClick={a => Confirm()}
                                    >
                                        OK
                                    </button> <div className="icheck-success d-inline float-right">
                                        <input type="checkbox"
                                            value={Checkall}
                                            defaultChecked={Checkall === true ? "checked" : ""}
                                            id='Checkall'
                                            name='Checkall'
                                            key='Checkall'
                                            onChange={e => Checkbox('no', Checkall)}
                                        />
                                        <label className="label checkbox mr-2 " htmlFor='Checkall'> Tất cả </label>
                                    </div>

                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </div>

        </div >
    )
}

export const SettingColumn = React.memo(SettingColumnComp)