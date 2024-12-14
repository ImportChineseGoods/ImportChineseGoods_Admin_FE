import React, { useEffect, useState } from 'react';
import ProductShop from './components/productShop';
import { Breadcrumb, Divider, notification } from 'antd';
import { Link } from 'react-router-dom';
import { productApi } from '@api/productApi';

const Cart = () => {
  const [shopList, setShopList] = useState([]);

  useEffect(() => {
    productApi.getProducts()
      .then((res) => {
        if (res.status === 200) {
          setShopList(res.shops);
        } else {
          notification.error({
            message: 'Lấy thông tin thất bại',
            description: res?.RM ?? "error",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        notification.error({
          message: 'Lấy thông tin thất bại',
          description: err?.RM ?? "error",
        });
      });
  }, []);

  // Hàm xóa shop khỏi danh sách
  const handleShopEmpty = (shopId) => {
    setShopList((prevShops) => prevShops.filter((shop) => shop.shop !== shopId));
  };

  return (
    <div>
      <Breadcrumb
        items={[
          {
            title: <Link to="/">Trang chủ</Link>,
          },
          {
            title: 'Giỏ hàng',
          },
        ]}
      />
      <Divider />

      <div className="shopList">
        {shopList.map((shop) => (
          <ProductShop 
            data={shop} 
            key={shop.shop} 
            onShopEmpty={handleShopEmpty} // Truyền hàm vào ProductShop
          />
        ))}
      </div>
    </div>
  );
};

export default Cart;
