
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import I18n from "../../Language";
import { mainAction } from "../../Redux/Actions";
import {
  Alertwarning,
} from "../../Utils";

export const OrdersFollow = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [OrderStatuses, setOrderStatuses] = useState({});
  const [StockAging, setStockAging] = useState({});
  useEffect(() => {
    GetData();
    setInterval(() => {
      GetData();
    }, 60000);
  }, []);

  const GetData = async () => {
    const params = {
      Json: "[]",
      func: "WH_spWareHouse_FollowOrder_Report",

    };
    try {
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length > 0) {
        setStockAging(result[0].StockAging);
        setOrderStatuses(result[0].OrderStatuses);
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
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>Quarantined</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>Total</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
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
                      <div className="col-md-4 text-center"><div class="order-number" style={{ fontSize: "35px", fontWeight: "bolder" }}>{OrderStatuses.TotalNewOrder}</div><label style={{ padding: "3px 10px", position: "absolute", top: "95%", marginLeft: "35%", zIndex: 1 }} class="card text-white bg-secondary">New Order</label></div>
                      <div className="col-md-4 text-center" style={{ borderLeft: "2px solid #666", borderRight: "2px solid #666" }}><div class="order-number" style={{ fontSize: "35px", fontWeight: "bolder" }}>{OrderStatuses.TotalPickingSingle}</div><label style={{ padding: "3px 10px", position: "absolute", top: "95%", marginLeft: "22%", zIndex: 1 }} class="card text-white bg-primary">Picking in Progress (Single)</label></div>
                      <div className="col-md-4 text-center"><div class="order-number" style={{ fontSize: "35px", fontWeight: "bolder" }}>{OrderStatuses.TotalPickingWave}</div><label style={{ padding: "3px 10px", position: "absolute", top: "95%", marginLeft: "22%", zIndex: 1 }} class="card text-white bg-info">Picking in Progress (Wave)</label></div>
                    </div>
                  </div>
                  <div class="alert alert-dark" style={{ marginBottom: "25px" }} role="alert">
                    <div className="row">
                      <div className="col-md-4 text-center"><div class="order-number" style={{ fontSize: "35px", fontWeight: "bolder" }}>{OrderStatuses.TotalPacking}</div><label style={{ padding: "3px 10px", position: "absolute", top: "95%", marginLeft: "38%", zIndex: 1 }} class="card text-white bg-info">Packing</label></div>
                      <div className="col-md-4 text-center" style={{ borderLeft: "2px solid #666", borderRight: "2px solid #666" }}><div class="order-number" style={{ fontSize: "35px", fontWeight: "bolder" }}>{OrderStatuses.TotalAwaitingDispatch}</div><label style={{ padding: "3px 10px", position: "absolute", top: "95%", marginLeft: "30%", zIndex: 1 }} class="card text-white bg-info">Awaiting Dispatch</label></div>
                      <div className="col-md-4 text-center"><div class="order-number" style={{ fontSize: "35px", fontWeight: "bolder" }}>{OrderStatuses.TotalOutWareHouse}</div><label style={{ padding: "3px 10px", position: "absolute", top: "95%", marginLeft: "28%", zIndex: 1 }} class="card text-white bg-success">Out from Warehouse</label></div>
                    </div>
                  </div>
                  <div class="alert alert-dark" role="alert">
                    <div className="row">
                      <div className="col-md-3 text-center"><div class="order-number" style={{ fontSize: "35px", fontWeight: "bolder" }}>{OrderStatuses.TotalCompleted}</div><label style={{ padding: "3px 10px", position: "absolute", top: "95%", marginLeft: "30%", zIndex: 1 }} class="card text-white bg-warning">Completed</label></div>
                      <div className="col-md-3 text-center" style={{ borderLeft: "2px solid #666", borderRight: "1px solid #666" }}><div class="order-number" style={{ fontSize: "35px", fontWeight: "bolder" }}>{OrderStatuses.TotalPendingCancellation}</div><label style={{ padding: "3px 10px", position: "absolute", top: "95%", marginLeft: "17%", zIndex: 1 }} class="card text-white bg-secondary">Pending Cancellation</label></div>
                      <div className="col-md-3 text-center" style={{ borderLeft: "1px solid #666", borderRight: "2px solid #666" }}><div class="order-number" style={{ fontSize: "35px", fontWeight: "bolder" }}>{OrderStatuses.TotalPendingCreation}</div><label style={{ padding: "3px 10px", position: "absolute", top: "95%", marginLeft: "12%", zIndex: 1 }} class="card text-white bg-danger">Pending Manifest Creation</label></div>
                      <div className="col-md-3 text-center"><div class="order-number" style={{ fontSize: "35px", fontWeight: "bolder" }}>{OrderStatuses.TotalDraffOrder}</div><label style={{ padding: "3px 10px", position: "absolute", top: "95%", marginLeft: "30%", zIndex: 1 }} class="card text-white bg-warning">Draff Order</label></div>
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

