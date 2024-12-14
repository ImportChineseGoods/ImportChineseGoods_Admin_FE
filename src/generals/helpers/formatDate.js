const formatDate = (dateString) => {
    const date = new Date(dateString); // Tạo đối tượng Date từ chuỗi
    const offset = date.getTimezoneOffset(); // Lấy offset múi giờ hiện tại (phút)
    const localDate = new Date(date.getTime() - offset * 60 * 1000); // Điều chỉnh về múi giờ hiện tại

    const pad = (num) => String(num).padStart(2, "0"); // Hàm để thêm số 0 nếu cần

    const day = pad(localDate.getDate());
    const month = pad(localDate.getMonth() + 1); // Tháng trong JS bắt đầu từ 0
    const year = String(localDate.getFullYear()).slice(2); // Lấy 2 chữ số cuối của năm
    const hours = pad(localDate.getHours());
    const minutes = pad(localDate.getMinutes());
    const seconds = pad(localDate.getSeconds());

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

export default formatDate;