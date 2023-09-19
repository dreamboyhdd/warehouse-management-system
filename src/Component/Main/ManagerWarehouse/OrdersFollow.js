
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import I18n from "../../../Language";
import { mainAction } from "../../../Redux/Actions";
import {
  Alertwarning,
} from "../../../Utils";

export const OrdersFollow = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [OrderStatuses, setOrderStatuses] = useState({});
  const [StockAging, setStockAging] = useState({});
  const [Inshelf1, setInshelf1] = useState(0);
  const [Inshelf2, setInshelf2] = useState(0);
  const [Inshelf3, setInshelf3] = useState(0);
  const [Quarantined1, setQuarantined1] = useState(0);
  const [Quarantined2, setQuarantined2] = useState(0);
  const [Quarantined3, setQuarantined3] = useState(0);
  useEffect(() => {
    GetData();
    setInterval(() => {
      GetData();
    }, 30000);
  }, []);

  const GetData = async () => {
    const params = {
      Json: "{}",
      func: "WH_spWareHouse_FollowOrder_Report",

    };
    try {
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length > 0) {
        setStockAging(result[0].StockAging);
        setOrderStatuses(result[0].OrderStatuses[0]);
        if (result[0].StockAging.length > 0) {
          if (result[0].StockAging.find(p => p.TypeExport === "In Shelf") !== undefined) {
            setInshelf1(result[0].StockAging.find(p => p.TypeExport === "In Shelf").Expiried)
            setInshelf2(result[0].StockAging.find(p => p.TypeExport === "In Shelf").Expiries6Month)
            setInshelf3(result[0].StockAging.find(p => p.TypeExport === "In Shelf").Expiries9Month)
          }
          else {
            setInshelf1(0)
            setInshelf2(0)
            setInshelf3(0)
          }
          if (result[0].StockAging.find(p => p.TypeExport === "Quarantined") !== undefined) {
            setQuarantined1(result[0].StockAging.find(p => p.TypeExport === "Quarantined").Expiried)
            setQuarantined2(result[0].StockAging.find(p => p.TypeExport === "Quarantined").Expiries6Month)
            setQuarantined3(result[0].StockAging.find(p => p.TypeExport === "Quarantined").Expiries9Month)
          }
          else {
            setQuarantined1(0);
            setQuarantined2(0);
            setQuarantined3(0);
          }
        }
        else {
          setInshelf1(0);
          setInshelf2(0);
          setInshelf3(0);
          setQuarantined1(0);
          setQuarantined2(0);
          setQuarantined3(0);
        }
      }
    } catch (e) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  }

  return (
    <div className="content-wrapper pt-2 small">
      <section className="content">
        <div className="container-fluid">
          <div className="card card-primary">
            <div className="body-padding">
              <div className="card-header">
                <h3 className="card-title"><i class="fa-solid fa-bars"></i> Stock Aging</h3>
              </div>
              <div className="card-body">
                <div class="col-md-12 pt-2">
                  <table className="text-center table table-hover -striped -highlight">
                    <thead className="">
                      <tr>
                        <td>Expiry</td>
                        <td>Expiried</td>
                        <td>Expires 6 months</td>
                        <td>Expires 9 months</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>In Shelf</td>
                        <td>{Inshelf1}</td>
                        <td>{Inshelf3}</td>
                        <td>{Inshelf3}</td>
                      </tr>
                      <tr>
                        <td>Quarantined</td>
                        <td>{Quarantined1}</td>
                        <td>{Quarantined2}</td>
                        <td>{Quarantined3}</td>
                      </tr>
                      <tr>
                        <td>Total</td>
                        <td>{Inshelf1 + Quarantined1}</td>
                        <td>{Inshelf2 + Quarantined2}</td>
                        <td>{Inshelf3 + Quarantined3}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="card card-primary">
            <div className="body-padding">
              <div className="card-header">
                <h3 className="card-title"><i class="fa-solid fa-bars"></i> Order Statuses</h3>
              </div>
              <div className="card-body">
                <div class="col-md-12 pt-2">
                  <div class="alert alert-dark" style={{ marginBottom: "25px" }} role="alert">
                    <div className="row">
                      <div className="col-md-4 text-center"><div class="order-number" style={{ fontSize: "35px", fontWeight: "bolder" }}>{OrderStatuses.TotalNewOrder}</div><div style={{ position: "absolute", top: "96%", zIndex: 1, textAlign: "center", width: "95%" }}><label class="card text-white bg-secondary" style={{ padding: "3px 10px", display: "initial" }}>New Order</label></div></div>
                      <div className="col-md-4 text-center" style={{ borderLeft: "2px solid #666", borderRight: "2px solid #666" }}><div class="order-number" style={{ fontSize: "35px", fontWeight: "bolder" }}>{OrderStatuses.TotalPickingSingle}</div><div style={{ position: "absolute", top: "96%", zIndex: 1, textAlign: "center", width: "95%" }}><label class="card text-white bg-primary" style={{ padding: "3px 10px", display: "initial" }}>Waiting for pick</label></div></div>
                      <div className="col-md-4 text-center"><div class="order-number" style={{ fontSize: "35px", fontWeight: "bolder" }}>{OrderStatuses.TotalPickingWave}</div><div style={{ position: "absolute", top: "96%", zIndex: 1, textAlign: "center", width: "95%" }}><label class="card text-white bg-info" style={{ padding: "3px 10px", display: "initial" }}>Picking</label></div></div>
                    </div>
                  </div>
                  <div class="alert alert-dark" style={{ marginBottom: "25px" }} role="alert">
                    <div className="row">
                      <div className="col-md-4 text-center"><div class="order-number" style={{ fontSize: "35px", fontWeight: "bolder" }}>{OrderStatuses.TotalPacking}</div><div style={{ position: "absolute", top: "96%", zIndex: 1, textAlign: "center", width: "95%" }}><label class="card text-white bg-info" style={{ padding: "3px 10px", display: "initial" }}>Packing</label></div></div>
                      <div className="col-md-4 text-center" style={{ borderLeft: "2px solid #666", borderRight: "2px solid #666" }}><div class="order-number" style={{ fontSize: "35px", fontWeight: "bolder" }}>{OrderStatuses.TotalAwaitingDispatch}</div><div style={{ position: "absolute", top: "96%", zIndex: 1, textAlign: "center", width: "95%" }}><label class="card text-white bg-danger" style={{ padding: "3px 10px", display: "initial" }}>Awaiting Dispatch</label></div></div>
                      <div className="col-md-4 text-center"><div class="order-number" style={{ fontSize: "35px", fontWeight: "bolder" }}>{OrderStatuses.TotalOutWareHouse}</div><div style={{ position: "absolute", top: "96%", zIndex: 1, textAlign: "center", width: "95%" }}><label class="card text-white bg-success" style={{ padding: "3px 10px", display: "initial" }}>Out from Warehouse</label></div></div>
                    </div>
                  </div>
                  <div class="alert alert-dark" role="alert">
                    <div className="row">
                      <div className="col-md-4 text-center"><div class="order-number" style={{ fontSize: "35px", fontWeight: "bolder" }}>{OrderStatuses.TotalCompleted}</div><div style={{ position: "absolute", top: "96%", zIndex: 1, textAlign: "center", width: "95%" }}><label class="card text-white bg-warning" style={{ padding: "3px 10px", display: "initial" }}>Completed</label></div></div>
                      <div className="col-md-4 text-center" style={{ borderLeft: "2px solid #666", borderRight: "1px solid #666" }}><div class="order-number" style={{ fontSize: "35px", fontWeight: "bolder" }}>{OrderStatuses.TotalPendingCancellation}</div><div style={{ position: "absolute", top: "96%", zIndex: 1, textAlign: "center", width: "95%" }}> <label class="card text-white bg-secondary" style={{ padding: "3px 10px", display: "initial" }}>Cancellation</label></div></div>
                      {/* <div className="col-md-3 text-center" style={{ borderLeft: "1px solid #666", borderRight: "2px solid #666" }}><div class="order-number" style={{ fontSize: "35px", fontWeight: "bolder" }}>{OrderStatuses.TotalPendingCreation}</div><label style={{ padding: "3px 10px", position: "absolute", top: "95%", marginLeft: "12%", zIndex: 1 }} class="card text-white bg-danger">Pending Manifest Creation</label></div> */}
                      <div className="col-md-4 text-center"><div class="order-number" style={{ fontSize: "35px", fontWeight: "bolder" }}>{OrderStatuses.TotalDraffOrder}</div><div style={{ position: "absolute", top: "96%", zIndex: 1, textAlign: "center", width: "95%" }}><label style={{ padding: "3px 10px", display: "initial" }} class="card text-white bg-warning">Draff Order</label></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

