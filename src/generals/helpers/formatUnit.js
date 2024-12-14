export const formatUnit = {
    moneyVN: (amount) => {
        return parseFloat(amount).toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0 // Không hiển thị chữ số thập phân
        });
    },
    moneyTQ: (amount) => {
        return parseFloat(amount).toLocaleString('zh-CN', {
            style: 'currency',
            currency: 'CNY',
            minimumFractionDigits: 0, // Ít nhất 0 chữ số thập phân
            maximumFractionDigits: 2  // Tối đa 2 chữ số thập phân
        });
    },
    weight: (weight) => {
        return parseFloat(weight).toLocaleString('en-US', {
            style: 'unit',
            unit: 'kilogram',
            unitDisplay: 'short',
            minimumFractionDigits: 0, // Ít nhất 0 chữ số thập phân
            maximumFractionDigits: 3  // Tối đa 3 chữ số thập phân
        });
    },
    weightFee: (weightFee) => {
        return `${parseFloat(weightFee).toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })}/kg`;
    },
    percent: (percent) => {
        return `${parseFloat(percent).toLocaleString('en-US', {
            minimumFractionDigits: 0, // Ít nhất 0 chữ số thập phân
            maximumFractionDigits: 2  // Tối đa 2 chữ số thập phân
        })}%`; // Thêm ký hiệu % thủ công
    },
    number: (number) => {
        return parseFloat(number).toLocaleString('en-US', {
            minimumFractionDigits: 0, // Ít nhất 0 chữ số thập phân
            maximumFractionDigits: 0  // Tối đa 0 chữ số thập phân
        });
    }
};
