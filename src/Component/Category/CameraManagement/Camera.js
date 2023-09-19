import React, { useState, useEffect } from "react";
import I18n from "../../../Language";
import { useDispatch } from "react-redux";
import Select from 'react-select';
import { Iframe } from "../../../Common";
import { Alertwarning } from "../../../Utils";
import { useRef } from "react";
export const Camera = () => {
    //#region set variable
    const dispatch = useDispatch();
    const ref = useRef()
    const [Post, setPost] = useState({ value: 0, label: I18n.t('System.Select') });
    const [PostList, setPostList] = useState([
        { value: 0, label: I18n.t('System.Select') },
        { value: 1, label: 'Trung Tâm 1', },
        { value: 2, label: 'Trung tâm 2', link: 'https://camera.vps.vn/admin/netcott2!/trungtam2netco:82/', total: 18 },
        { value: 3, label: 'Hải Âu', link: 'https://camera.vps.vn/admin/netco123/vpnchaiau:5544/', total: 8 }, //https://field-cubic-cream.glitch.me
    ]);
    const [PostView, setPostView] = useState({ value: 0, label: I18n.t('System.Select') });
    const [countShow, setCountShow] = useState(4);


    const handleChangePost = e => {
        setCountShow(4)
        setPostView({ value: 0, label: I18n.t('System.Select') })
        setPost(e);
    }

    const RenderCamera = () => {
        if (PostView.value === 0 || PostView.value === 1) {
            return <></>
        }
        if (PostView.value === 2 || PostView.value === 3) {
            let arrTemp = new Array(PostView.total).fill(0);
            let channel = PostView.value === 2 ? 1 : 8
            return (
                <>
                    {arrTemp.map((item, index) => {
                        if (countShow > 0 && countShow <= 4) {
                            return index < countShow && (
                                <div className="col-md-6 position-relative d-flex justify-content-center" key={index}>
                                    <Iframe
                                        url={`${PostView.link}${index + channel}`}
                                        width="715px"
                                        height="500px"
                                        id="myId"
                                        className="frame1"
                                        display="initial"
                                        position="relative"
                                    />
                                </div>
                            )
                        }
                        if (countShow > 4) {
                            return index >= countShow - 4 && index < countShow && (
                                <div className="col-md-6 position-relative d-flex justify-content-center"  key={index} >
                                    <Iframe
                                        url={`${PostView.link}${index + channel}`}
                                        width="715px"
                                        height="500px"
                                        id="myId"
                                        className="frame1"
                                        display="initial"
                                        position="relative"
                                    />
                                </div>
                            )
                        }

                    })}
                </>
            )
        }

    }

    const handleClickView = () => {
        if (Post.value === 0) {
            Alertwarning(I18n.t("Leftmenu.Pleaseselectpostoffice!"))
        }
        if (Post.value === 1) {
            Alertwarning(I18n.t("Leftmenu.Thepostofficehasnotinstalledacamera!"))
        }
        setPostView(Post);

    }


    return (
        <div className="content-wrapper pt-2">
            <section className="content">
                <div className="container-fluid">
                    <div className="card card-primary">
                        {/* Header */}
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-6">
                                    <h3 className="card-title">
                                        <i class="fa fa-boxes" />
                                        <span className="font-weight-bold">
                                            {I18n.t("Customer.Camera")} ({PostView?.total || 0})
                                        </span>
                                    </h3>
                                </div>
                                <div className="col-md-6 card-header-btn">
                                    <button
                                        className="btn btn-primary btn-sm float-right btn-header"
                                        onClick={handleClickView}
                                    >
                                        <i class="fa-solid fa-eye pr-1" />
                                        {I18n.t("System.View")}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body  ">
                            <div className="row p-3">
                                <div className="col-md-4 col-sm-6 col-12 m-auto">
                                    <div className="form-group">
                                        <label className="form__title">
                                           {I18n.t("System.Postoffices")}
                                            <span className="form__title__note"> (*)</span>
                                        </label>
                                        <Select className="SelectMeno"
                                            value={Post}
                                            onChange={handleChangePost}
                                            options={PostList}
                                            ref={ref}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row p-3">
                                <RenderCamera />
                                {PostView.total &&
                                    <div className="col-12 m-auto d-flex justify-content-between pt-3">
                                        <button
                                            className="btn btn-info"
                                            onClick={() => {
                                                countShow >= 4 && setCountShow(countShow - 4)
                                            }}
                                        >
                                            <i class="fas fa-angle-double-left mr-2"></i>
                                            Prev
                                        </button>
                                        <button
                                            className="btn btn-info"
                                            onClick={() => {
                                                countShow + 4 < PostView.total
                                                    ? setCountShow(countShow + 4)
                                                    : setCountShow(countShow + (PostView.total - countShow))
                                            }}
                                        >
                                            Next
                                            <i class="fas fa-angle-double-right ml-2"></i>
                                        </button>
                                    </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
