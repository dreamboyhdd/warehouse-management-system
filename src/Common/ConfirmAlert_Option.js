
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export const ConfirmAlert_Option = ({
    OnDelete = () => { },
    OnNotDelete = () => { },
    onTitle = 'XÁC NHẬN XÓA',
    onMss = 'Bạn muốn xóa nó?'
}) => {
    return (
        {
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-ui'>
                        <h1>{onTitle}</h1>
                        <p>{onMss}</p>
                        <button onClick={OnDelete}>Yes</button>
                        <button onClick={OnNotDelete}>No</button>
                    </div>
                );
            }
        }
    )
}



