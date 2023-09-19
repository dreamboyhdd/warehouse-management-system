import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import I18n from '../Language';

const SelectBusinessFieldComp = ({
    onSelected = () => { },
    IsLoad = -1,
    items = 0,
    isMulti = false,
}) => {

    const [data, setData] = useState([])
    const [valueS, setValueS] = useState({ value: "-1", label: 'Select Please' })
    const onSelecteItem = (item) => {
        onSelected(item)
        setValueS(item);
    }

    const WH_spSelect_BusinessField = () => {
        setData(
            [
                { value: -1, label: 'Select Please' },
                { value: 1, label: 'Khách hàng Nông nghiệp' },
                { value: 2, label: 'Khách hàng Bao bì' },
                { value: 3, label: 'Khách hàng Thép & Inox' },
                { value: 4, label: 'Khách hàng Điện Lạnh' },
                { value: 5, label: 'Khách hàng Giấy - Ngành Giấy' },
                { value: 6, label: 'Khách hàng Xây Dựng' },
                { value: 7, label: 'Khách Hàng Cơ khí - Niên Giám Cơ Khí' },
                { value: 8, label: 'Khách Hàng Văn Phòng Phẩm & Thiết Bị' },
                { value: 9, label: 'Khách Hàng Gỗ & Đồ Gỗ' },
                { value: 10, label: 'Khách Hàng In ấn' },
                { value: 11, label: 'Khách Hàng Thủ công mỹ nghệ' },
                { value: 12, label: 'Khách Hàng Quảng cáo & truyền thông' },
                { value: 13, label: 'Khách Hàng Đồ gia dụng' },
                { value: 14, label: 'Khách Hàng Viễn thông' },
                { value: 15, label: 'Khách Hàng Nhựa' },
                { value: 16, label: 'Khách Hàng Hóa Chất' },
                { value: 17, label: 'Khách Hàng Giao nhận & Vận chuyển' },
                { value: 18, label: 'Khách Hàng Sức khỏe & Thiết bị y tế' },
                { value: 19, label: 'Khách Hàng An ninh, An toàn & Bảo vệ' },
                { value: 20, label: 'Khách Hàng Doanh nghiệp Cần Dùng' },
                { value: 21, label: 'Khách Hàng May mặc & phụ liệu' },
                { value: 22, label: 'Khách Hàng Du lịch & Khách sạn' },
                { value: 23, label: 'Khách Hàng Thực phẩm & Đồ uống' },
                { value: 24, label: 'Khách Hàng Ô tô & Xe máy' },
                { value: 25, label: 'Khách Hàng Môi Trường' },
                { value: 26, label: 'Mỹ Phẩm' },
                { value: 27, label: 'Khách Hàng Tài chính, chứng khoán, kế toán, kiểm toán' },
                { value: 28, label: 'Khách Hàng Cho thuê kho' },
                { value: 29, label: 'Khách Hàng Giáo dục' },
                { value: 30, label: 'Khách Hàng Thương Mại' },
                { value: 31, label: 'Khách Hàng Dịch Vụ - Tư vấn' },
                { value: 32, label: 'Khách Hàng Hàng tiêu dùng' },
                { value: 33, label: 'Khách Hàng Bất động sản' },
                { value: 34, label: 'Khách Hàng Sản xuất' }
            ]
        )
    }

    useEffect(() => {
        WH_spSelect_BusinessField()
    }, [IsLoad]);

    useEffect(() => {
        if (items != 0 && items != -1) {
            let ar = data.find(a => a.value == items)
            ar ? setValueS(ar) : setValueS({ value: 0, label: 'Select Please' })
        }
        else {
            if (isMulti === false) {
                setValueS({ value: -1, label: 'Select Please' })
            } else {
                setValueS([])
            }
        }
    }, [items]);

    return (
        <Select className="SelectMeno"
            value={valueS}
            onChange={onSelecteItem}
            options={data}
            isMulti={isMulti}
        />
    )
}


export const SelectBusinessField = React.memo(SelectBusinessFieldComp)