// import React, { useEffect, useState } from 'react';
// import { notification, Space, Table } from 'antd';
// import { customerListApi } from '../../../util/api';
// import moment from 'moment';

// const columns = [
//     {
//         title: 'Mã KH',
//         dataIndex: 'id',
//         key: 'customer_code',
//         align: 'center',
//     },
//     {
//         title: 'Sales',
//         dataIndex: 'sales',
//         key: 'sales',
//     },
//     {
//         title: 'Thông tin cá nhân',
//         key: 'personalInfo',
//         render: (_, record) => (
//             <>
//                 <div><strong>Họ và tên:</strong> {record.name}</div>
//                 <div><strong>Tiền tích lũy:</strong> {record.accumulation} đ</div>
//                 <div><strong>Số điện thoại:</strong> {record.phone}</div>
//                 <div><strong>Ngày tạo:</strong> {moment(record.create_at).format('DD-MM-YYYY')}</div>
//             </>
//         ),
//     },
//     {
//         title: 'Số dư',
//         dataIndex: 'balance',
//         align: 'center',
//         key: 'balance',
//         render: (_, record) => (
//             <>{record.balance} đ</>
//         ),
//     },
//     {
//         title: 'Bảng phí',
//         key: 'fee',
//         render: (_, record) => (
//             <>
//                 <div><strong>Đặt cọc:</strong> {record.deposit_rate} %</div>
//                 <div><strong>CK phí mua hàng:</strong> {record.purchase_discount} %</div>
//                 <div><strong>CK phí vận chuyển:</strong> {record.shipping_discount} %</div>
//             </>
//         ),
//     },
//     {
//         title: 'Ghi chú',
//         dataIndex: 'note',
//         key: 'note',
//     },
//     {
//         title: 'Action',
//         key: 'action',
//         align: 'center',
//         render: (_, record) => (
//             <>
//                 <div><a>Cập nhật</a></div>
//                 <div><a>LSGD</a></div>
//             </>
//         ),
//     },
// ];
// const getRandomuserParams = (params) => ({
//     results: params.pagination?.pageSize,
//     page: params.pagination?.current,
//     ...params,
// });
// // const CustomerList = () => {
// //     const [data, setData] = useState();
// //     const [loading, setLoading] = useState(false);
// //     const [tableParams, setTableParams] = useState({
// //         pagination: {
// //             current: 1,
// //             pageSize: 10,
// //         },
// //     });

// //     const fetchCustomerList = async () => {
// //                     const res = await customerListApi();
// //                     if (res) {
// //                         console.log(res);
// //                         setDataSource(res);
// //                     } else {
// //                         notification.error({
// //                             message: 'Đã có lỗi xảy ra, hãy thử lại',
// //                             description: res?.EM ?? "error"
// //                         })
// //                     }
// //                 }
// //     // const fetchData = () => {
// //     //     setLoading(true);
// //     //     fetch(`https://randomuser.me/api?${qs.stringify(getRandomuserParams(tableParams))}`)
// //     //         .then((res) => res.json())
// //     //         .then(({ results }) => {
// //     //             setData(results);
// //     //             setLoading(false);
// //     //             setTableParams({
// //     //                 ...tableParams,
// //     //                 pagination: {
// //     //                     ...tableParams.pagination,
// //     //                     total: 200,
// //     //                     // 200 is mock data, you should read it from server
// //     //                     // total: data.totalCount,
// //     //                 },
// //     //             });
// //     //         });
// //     // };
// //     useEffect(fetchCustomerList, [
// //         tableParams.pagination?.current,
// //         tableParams.pagination?.pageSize,
// //         tableParams?.sortOrder,
// //         tableParams?.sortField,
// //         JSON.stringify(tableParams.filters),
// //     ]);
// //     const handleTableChange = (pagination, filters, sorter) => {
// //         setTableParams({
// //             pagination,
// //             filters,
// //             sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
// //             sortField: Array.isArray(sorter) ? undefined : sorter.field,
// //         });

// //         // `dataSource` is useless since `pageSize` changed
// //         if (pagination.pageSize !== tableParams.pagination?.pageSize) {
// //             setData([]);
// //         }
// //     };
// //     return (
// //         <Table
// //             columns={columns}
// //             rowKey="id"
// //             dataSource={data}
// //             pagination={tableParams.pagination}
// //             loading={loading}
// //             onChange={handleTableChange}
// //         />
// //     );
// // };

// // const CustomerList = () => {
// //     const [dataSource, setDataSource] = useState([]);

// //     useEffect(() => {
// //         const fetchCustomerList = async () => {
// //             const res = await customerListApi();
// //             if (res) {
// //                 console.log(res);
// //                 setDataSource(res);
// //             } else {
// //                 notification.error({
// //                     message: 'Đã có lỗi xảy ra, hãy thử lại',
// //                     description: res?.EM ?? "error"
// //                 })
// //             }
// //         }
// //         fetchCustomerList();
// //     }, []);
// //     return (
// //         <div>
// //             <Table
// //                 bordered
// //                 rowKey="id"
// //                 columns={columns}
// //                 dataSource={dataSource}
// //             />
// //         </div>
// //     );
// // }

// const CustomerList = () => {
//     const [dataSource, setDataSource] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [pagination, setPagination] = useState({
//         current: 1,
//         pageSize: 10,
//         total: 0,
//     });

//     const fetchCustomerList = async (page = 1, pageSize = 10) => {
//         setLoading(true);
//         const res = await customerListApi({ page, pageSize });
//         setLoading(false);
//         if (res) {
//             console.log(res);
//             setDataSource(res.data);
//             setPagination({
//                 current: page,
//                 pageSize,
//                 total: res.pagination.total,
//             });
//         } else {
//             notification.error({
//                 message: 'Đã có lỗi xảy ra, hãy thử lại',
//                 description: res?.EM ?? "error",
//             });
//         }
//     };

//     useEffect(() => {
//         fetchCustomerList(pagination.current, pagination.pageSize);
//     }, []);

//     const handleTableChange = (pagination) => {
//         fetchCustomerList(pagination.current, pagination.pageSize);
//     };

//     return (
//         <div>
//             <Table
//                 bordered
//                 rowKey="id"
//                 columns={columns}
//                 dataSource={dataSource}
//                 pagination={pagination}
//                 loading={loading}
//                 onChange={handleTableChange}
//             />
//         </div>
//     );
// };


// export default CustomerList;

import React, { useEffect, useState } from 'react';
import { notification, Table } from 'antd';
import { customerListApi } from '../../../util/api';
import moment from 'moment';

const columns = [
    {
        title: 'Mã KH',
        dataIndex: 'id',
        key: 'customer_code',
        align: 'center',
    },
    {
        title: 'Sales',
        dataIndex: 'sales',
        key: 'sales',
    },
    {
        title: 'Thông tin cá nhân',
        key: 'personalInfo',
        render: (_, record) => (
            <>
                <div><strong>Họ và tên:</strong> {record.name}</div>
                <div><strong>Tiền tích lũy:</strong> {record.accumulation} đ</div>
                <div><strong>Số điện thoại:</strong> {record.phone}</div>
                <div><strong>Ngày tạo:</strong> {moment(record.create_at).format('DD-MM-YYYY')}</div>
            </>
        ),
    },
    {
        title: 'Số dư',
        dataIndex: 'balance',
        align: 'center',
        key: 'balance',
        render: (_, record) => (
            <>{record.balance} đ</>
        ),
    },
    {
        title: 'Bảng phí',
        key: 'fee',
        render: (_, record) => (
            <>
                <div><strong>Đặt cọc:</strong> {record.deposit_rate} %</div>
                <div><strong>CK phí mua hàng:</strong> {record.purchase_discount} %</div>
                <div><strong>CK phí vận chuyển:</strong> {record.shipping_discount} %</div>
            </>
        ),
    },
    {
        title: 'Ghi chú',
        dataIndex: 'note',
        key: 'note',
    },
    {
        title: 'Action',
        key: 'action',
        align: 'center',
        render: (_, record) => (
            <>
                <div><a>Cập nhật</a></div>
                <div><a>LSGD</a></div>
            </>
        ),
    },
];

const CustomerList = () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const fetchCustomerList = async (page, pageSize) => {
        setLoading(true);
        try {
        const res = await customerListApi({ page, pageSize });
        setLoading(false);
        
        if (!res?.message) {
            setDataSource(res.data);
            setPagination({
                current: page,
                pageSize,
                total: res.pagination.total,
            });
        } else {
            notification.error({
                message: res.message,
                description: res?.EM ?? "Đã có lỗi xảy ra", 
            });
        }
    } catch (error) {
            notification.error({
                message: error.response?.data?.message ?? "Đã có lỗi xảy ra, hãy thử lại",
                description: error.response?.data?.description ?? "Lỗi không xác định.",
            });
        }
    };

    useEffect(() => {
        fetchCustomerList(pagination.current, pagination.pageSize);
    }, []);

    const handleTableChange = (newPagination) => {
        setPagination(newPagination);
        fetchCustomerList(newPagination.current, newPagination.pageSize);
    };

    return (
        <div>
            <Table
                bordered
                rowKey="id"
                columns={columns}
                dataSource={dataSource}
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
            />
        </div>
    );
};

export default CustomerList;
