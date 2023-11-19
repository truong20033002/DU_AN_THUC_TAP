import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IProduct } from "@/interface/products";
import {
  removeFromCart,
  decreaseProductQuantity,
  increaseProductQuantity,
} from "@/app/actions";

const Cart: React.FC = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const handleRemoveFromCart = (productId: any) => {
    dispatch(removeFromCart(productId));
  };

  const increaseQuantity = (productId: any) => {
    dispatch(increaseProductQuantity(productId));
  };

  const decreaseQuantity = (productId: any) => {
    dispatch(decreaseProductQuantity(productId));
  };

  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  return (
    <div className="h-[800px] mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Giỏ hàng</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Hình ảnh</th>
            <th className="py-2 px-4 border-b">Tên sản phẩm</th>
            <th className="py-2 px-4 border-b">Giá</th>
            <th className="py-2 px-4 border-b">Số lượng</th>
            <th className="py-2 px-4 border-b">Thành tiền</th>
            <th className="py-2 px-4 border-b">Hành động</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <tr key={index}>
                <td>
                  <img
                    src={item.img}
                    alt={`Hình ảnh của ${item.name}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                </td>
                <td className="py-2 px-4">{item.name}</td>
                <td className="py-2 px-4"> {parseFloat(item.price).toLocaleString("vi-VN")}(VNĐ)</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="bg-gray-200 px-2 py-1 rounded"
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="bg-gray-200 px-2 py-1 rounded"
                  >
                    +
                  </button>
                </td>
                <td className="py-2 px-4">
                {parseFloat(item.price * item.quantity).toLocaleString("vi-VN")} (VNĐ)
                </td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-red-700 focus:outline-none"
                  >
                    Xóa
                  </button>

                  <button
                    // onClick={() => handlePurchase(item.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
                  >
                    Thanh toán
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="py-4 px-4">
                Giỏ hàng trống
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="total-price bg-gray-100 p-4 mt-4">
  <p className="text-xl font-semibold">
    Tổng cộng: {parseFloat(totalPrice).toLocaleString("vi-VN")}(VNĐ)
  </p>
  <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md">
    Thanh toán tất cả
  </button>
</div>
    </div>
  );
};

export default Cart;
