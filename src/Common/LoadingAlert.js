import React,{useEffect,useState} from 'react'
import { useSelector,useDispatch } from 'react-redux'
import {Img} from 'react-image'
import {mainAction} from '../Redux/Actions'
const LoadingAlertTemp = ({
    isVisible = false
}) => {
    const IsLoading = useSelector((state) => state.MainAction.IsLoading);
    const [ShowTimer,setShowTimer] = useState('0');

    let h = 0;
    let m = 0;
    useEffect(() => {
        if(IsLoading)
        {
            const interval = setInterval(() => {
                m = m + 1;
                if(m % 60 === 0)
                {
                    h = h + 1;
                    m = 0
                }
                h > 0 ? setShowTimer((h <= 10 ? '0' + h : h) + ':' + m) : setShowTimer(m);
            }, 1000);
            localStorage.setItem("interval",interval);
        }
        else
        {
            let itv = localStorage.getItem("interval");
            if (itv !== null) 
            {
                clearInterval(itv);
                setShowTimer("0");
            }
        }
    },[IsLoading])

    if(IsLoading)
    {
        return (
            <div class="notification-container">
                <div>
                    <div class="notification notification-warning">
                        <div class="notification-message" role="alert">
                            <div class="message">
                            <Img src="../../assets/img/loading.gif" width="30" height="30" />
                                Đang xử lý...({ShowTimer})
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return (<div></div>)
}

export const LoadingAlert = React.memo(LoadingAlertTemp)