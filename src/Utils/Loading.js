import { Img } from 'react-image'
export const Loading = () => {
    return (
        <div className="notification-container">
            <div>
                <div className="notification notification-warning">
                    <div className="notification-message" role="alert">
                        <div className="message">
                            <Img src="../../assets/img/loading.gif" width="30" height="30" className='pr-2'/> 
                            Đang phân tích ...
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}