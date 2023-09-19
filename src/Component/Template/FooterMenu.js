import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { Alertwarning } from "../../Utils";

export const FooterMenu = () => {

    /* run after render */
    useEffect(() => {

    }, []);
    return (
        <footer className="main-footer footerfix row">
            <span className="col-9">
                <strong>Copyright &copy; 2016-2022 <a href="https://netco.com.vn">NETCO ERP</a>.</strong> All rights reserved. Develop by NETCO IT Team
            </span>
            <span className="col-3" style={{paddingLeft: "145px"}}>
                <b>Version</b> 1.0.0
            </span>
        </footer>
    )
}