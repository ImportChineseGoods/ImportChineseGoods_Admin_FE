import React from 'react';
import { Table } from 'antd';

const columns = [
    {
        title: 'Column 13',
        dataIndex: 'address',
        key: '13',
    },
    {
        title: 'Column 14',
        dataIndex: 'address',
        key: '14',
    },
    {
        title: 'Column 15',
        dataIndex: 'address',
        key: '15',
    },
];
const dataSource = Array.from({
    length: 30,
}).map((_, i) => ({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
}));
const Test = () => {
    return (
        <Table

            columns={columns}
            dataSource={dataSource}

        />
    );
};
export default Test;