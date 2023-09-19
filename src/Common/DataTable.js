import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import DateTimePicker from 'react-datetime-picker';
import ReactTable from "react-table-6";
import 'react-table-6/react-table.css';
import withFixedColumns from 'react-table-hoc-fixed-columns';
import 'react-table-hoc-fixed-columns/lib/styles.css'
/*
David Note: please instal this package: npm install react-table-hoc-fixed-columns --save
*/
const DataTableComp = ({
    data = () => { },
    columns = () => { },
    fixedColumns = false,
    sizePage = 10
}) => {
    const ReactTableFixedColumns = withFixedColumns(ReactTable);

    useEffect(() => {

    }, []);
    
    if (fixedColumns === true) {
        return (
            <ReactTableFixedColumns
                filterable={true}
                sortable={true}
                data={data}
                columns={columns}
                defaultPageSize={sizePage}
                className="-striped -highlight"
                previousText='<'
                nextText='>'
                loadingText='Loading...'
                noDataText='Không tìm thấy dữ liệu'
                pageText='Trang'
                ofText='của'
                rowsText='dòng'
                pageJumpText='chuyển đến trang'
                rowsSelectorText='số dòng trên trang '
            />
        )
    } else {
        return (
            <ReactTable
                filterable={true}
                sortable={true}
                data={data}
                columns={columns}
                defaultPageSize={sizePage}
                className="-striped -highlight"
                previousText='<'
                nextText='>'
                loadingText='Loading...'
                noDataText='Không tìm thấy dữ liệu'
                pageText='Trang'
                ofText='của'
                rowsText='dòng'
                pageJumpText='chuyển đến trang'
                rowsSelectorText='số dòng trên trang '
                globalSearch={true}
            />
        )
    }
}


export const DataTable = React.memo(DataTableComp)