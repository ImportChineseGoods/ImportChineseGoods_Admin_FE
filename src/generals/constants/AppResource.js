import logo from '@assets/logo.svg'; 

export const AppResource = {
  logo: logo,
  invalidMessage: {
    RM: 'Dữ liệu không hợp lệ',
  },
  complaintType: {
    incorrect_deduction: 'Trừ tiền sai',
    delayed_order_processing: 'Xử lý đơn hàng chậm',
    poor_staff_attitude: 'Thái độ nhân viên tệ',
    damaged_item: 'Sản phẩm bị hỏng',
    refund_not_received: 'Chưa nhận được hoàn tiền',
    incorrect_order_amount: 'Số lượng đơn hàng không đúng',
    wrong_item: 'Sản phẩm không đúng',
    missing_item: 'Thiếu sản phẩm  ', 
  }
};

export const complaintArray = Object.keys(AppResource.complaintType).map(key => ({
  value: key,
  label: AppResource.complaintType[key],
}));