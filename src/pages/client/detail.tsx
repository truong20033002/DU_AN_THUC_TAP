import React, { useEffect, useState } from "react";
import { useGetProductByIdQuery, useGetProductsQuery } from "@/Api/productApi";
import { useNavigate, useParams } from "react-router-dom";

import { useGetRatingsQuery } from "@/Api/ratingApi";
import { RaceBy } from "@uiball/loaders";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { Modal, Button, Rate, Input, Form, notification } from "antd";
import { IoCloseOutline } from "react-icons/io5";
import { useGetOneUserQuery } from "@/Api/userApi";
import {
  useAddCommentMutation,
  useGetCoursesForIdproductQuery,
} from "@/Api/CommentApi";
import { useDispatch } from "react-redux";
import { addToCart } from "@/app/actions";
const ProductDetail = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const idUser = userInfo.userData?._id || "";
  const { idProduct } = useParams<{ idProduct: string }>();
  const { data: ratingData } = useGetRatingsQuery();
  console.log("rating", ratingData);
  const {
    data: productData,
    isLoading: productIsLoading,
    isError,
  } = useGetProductByIdQuery(idProduct || "");
  const { data: productDataAll } = useGetProductsQuery();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const [courseStatusData, setCourseStatusData] = useState("");

  const { data: userData } = useGetOneUserQuery(idUser);
  const [addComment] = useAddCommentMutation();
  const [commentadd, setComment] = useState(""); // State để lưu giá trị của input comment
  const { data: commentData } = useGetCoursesForIdproductQuery(idProduct);
  const handleCommentChange = (event) => {
    setComment(event.target.value); // Cập nhật giá trị comment mỗi khi người dùng nhập vào input
  };
  const isUserLoggedIn = Boolean(idUser);
const dispatch = useDispatch();
const handleAddToCart = (product) => {
  dispatch(addToCart(product));
  notification.success({
    message: 'Success',
    description: `đã thêm sản phẩm ${product.name} vào giỏ hàng`,
});
};
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const handleShowFeedbackForm = () => {
    setShowFeedbackForm(true);
  };

  const handleCommentSubmit = async () => {
    try {
      // Sử dụng mutation để thêm comment vào API
      const response = await addComment({
        userId: idUser,
        nameuser: userData?.name,
        productId: idProduct,
        content: commentadd,
      });
      notification.success({
        message: 'Success',
        description: 'Thêm đánh bình luận thành công',
    });
      // Sau khi gửi comment, có thể cần cập nhật giao diện hoặc làm những công việc khác
      setComment("");
    } catch (error) {
      console.error("Lỗi khi thêm comment:", error);
    }
  };

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const [modalVisible, setModalVisible] = useState(true);
  const [rating, setRating] = useState(0); // Đánh giá ban đầu là 0
  const [feedback, setFeedback] = useState("");
  const handleFeedbackChange = (event: any) => {
    setFeedback(event.target.value);
  };
  const { TextArea } = Input;
  const handleSendRating = async () => {
    try {
      // Tạo một đối tượng gửi đánh giá
      const ratingData = {
        productId: idProduct,
        rating: rating,
        userId: idUser,
        feedback: feedback,
      };
      console.log("Dữ liệu gửi từ máy khách khi gửi đánh giá:", ratingData);
      const response = await fetch("http://localhost:8088/api/rating/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ratingData),
        
      });
      if (response.ok) {
        // Xử lý khi gửi đánh giá thành công
        console.log("Gửi đánh giá thành công!");
        setModalVisible(false);
        notification.success({
          message: 'Success',
          description: 'Thêm đánh giá thành công',
      });
      } else {
        // Xử lý khi có lỗi
        alert("Vui lòng đánh giá và nhận xét");
        console.error("Lỗi khi gửi đánh giá.");
      }
    } catch (error) {
      // Xử lý khi có lỗi
      console.error("Lỗi khi gửi đánh giá: ", error);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
        <RaceBy size={100} lineWeight={6} speed={1.4} color="#47d1d1" />
        <div
          className="mt-2 text-black font-medium"
          style={{ color: "#70dbdb" }}
        >
          Loading
        </div>
      </div>
    );
  }

  const countRatings = () => {
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    ratingData?.data
      ?.filter((rating) => rating.productId === idProduct)
      .forEach((rating) => {
        ratingCounts[rating.rating] += 1;
      });

    return ratingCounts;
  };

  const ratings = countRatings();
  return (
    <div className="  bg-white relative max-w-6xl mx-auto">
      <div className=" w-full absolute  "></div>
      <div className="max-w-7xl mx-auto">
        <div className="rounded-t-lg pt-10  mb-16">
          <div className="flex gap-20">
            <div className=" md:w-1/3">
              <img
                src={productData?.data.img}
                alt={productData?.data.name}
                className="w-full h-[500px] object-cover rounded-t-lg transform group-hover:opacity-80 transition-opacity rounded-lg"
              />
            </div>
            <div className="md:w-2/3 text-[#1F1717] border rounded-lg border-gray-300 p-8 bg-gray-100">
              <h2 className="text-[40px] mb-[20px]">
                {productData?.data.name}
              </h2>
              <h2 className="text-[18px] text-[#1F1717] max-w-[600px] ">
                <samp className="font-semibold text-[18px]">Mô tả:</samp>{" "}
                {productData?.data.description}
              </h2>
              <h2 className="text-[18px]  ">
                <samp className="font-semibold text-[18px]">Tác giả:</samp>{" "}
                {productData?.data.author}
              </h2>
              <div className="pd_policy bg-gray-200 border border-gray-300 p-4 rounded-md mt-4">
                <h3 className="text-xl font-semibold text-gray-700">
                  Dịch vụ của chúng tôi
                </h3>
                <p className="serv-1 font-bold text-gray-800">
                  Giao tận nhà trong 3 - 7 ngày làm việc.
                </p>
                <p className="serv-2 italic text-gray-600">
                  Miễn phí giao hàng Toàn Quốc cho đơn hàng trên 300k.
                </p>
              </div>

              <p className="text-red-600 text-[30px] mt-10 font-bold">
                Giá:
                {parseFloat(productData?.data.price).toLocaleString("vi-VN")}VNĐ
              </p>
              <button className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-700 transition-all"
              onClick={() => handleAddToCart(productData?.data)}
              >
                Thêm vào giỏ hàng
              </button>

              {/* Dịch vụ & Khuyến mãi */}
              <div className="pd_saler mt-8">
                <h3>Dịch vụ &amp; Khuyến mãi</h3>
                <p>
                  🔖 Đối với sản phẩm giảm 40% - 50% - 70% (sản phẩm xả kho):
                  Mỗi khách hàng được mua tối đa 5 sản phẩm/1 mặt hàng/1 đơn
                  hàng
                </p>
                <p>
                  🎁 Tặng bookmark cho tất cả các đơn hàng (sách kỹ năng, sách
                  kinh doanh)
                </p>
                <p>🎁 Tăng sổ tay + Freeship cho đơn hàng từ 300K trở lên</p>
                <p>🎁 Tăng túi vải + FREE SHIP cho đơn hàng từ 500k trở lên</p>
              </div>
            </div>
          </div>
        </div>
        <h2 className="font-semibold">ĐÁNH GIÁ SẢN PHẨM</h2>
        <div>
          <div>
            <div className="mb-10">
              <p className="flex ">
                {" "}
                {ratings[1]}{" "}
                <span className="flex items-center pl-2">
                  đánh giá 1 <FaStar className="text-yellow-400" />
                </span>{" "}
              </p>
              <p className="flex ">
                {" "}
                {ratings[2]}{" "}
                <span className="flex items-center pl-2">
                  đánh giá 2 <FaStar className="text-yellow-400" />
                  <FaStar className="text-yellow-400" />
                </span>{" "}
              </p>
              <p className="flex ">
                {" "}
                {ratings[3]}{" "}
                <span className="flex items-center pl-2">
                  đánh giá 3 <FaStar className="text-yellow-400" />
                  <FaStar className="text-yellow-400" />
                  <FaStar className="text-yellow-400" />
                </span>{" "}
              </p>
              <p className="flex ">
                {" "}
                {ratings[4]}{" "}
                <span className="flex items-center pl-2">
                  đánh giá 4 <FaStar className="text-yellow-400" />
                  <FaStar className="text-yellow-400" />
                  <FaStar className="text-yellow-400" />
                  <FaStar className="text-yellow-400" />
                </span>{" "}
              </p>
              <p className="flex ">
                {" "}
                {ratings[5]}{" "}
                <span className="flex items-center pl-2">
                  đánh giá 5 <FaStar className="text-yellow-400" />
                  <FaStar className="text-yellow-400" />
                  <FaStar className="text-yellow-400" />
                  <FaStar className="text-yellow-400" />
                  <FaStar className="text-yellow-400" />
                </span>{" "}
              </p>
            </div>
          </div>
          {userInfo.userData ? (
            <>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-2 rounded-md"
                onClick={() => setShowFeedbackForm(!showFeedbackForm)}
              >
                Đánh giá sản phẩm
              </button>

              {showFeedbackForm && (
                <Form
                  title=""
                  open={modalVisible}
                  onOk={() => setModalVisible(false)}
                  onCancel={() => setModalVisible(false)}
                  footer={null}
                  maskClosable={false}
                >
                  <div className="">
                    <div className="w-14 flex justify-center"></div>

                    <h4 className="text-xl flex items-center justify-center">
                      Hãy đánh giá cho quyển sách này
                    </h4>
                    <Rate
                      className="text-3xl flex items-center justify-center"
                      onChange={(value) => setRating(value)}
                      value={rating}
                    />
                    <div className="">
                      <h4 className="my-2 text-sm">Góp ý và nhận xét</h4>
                      <TextArea
                        rows={6}
                        value={feedback}
                        onChange={handleFeedbackChange}
                      />
                    </div>
                    <div className="flex justify-between mt-3">
                      <button
                        onClick={handleSendRating}
                        className="px-5 py-2 text-white rounded-md transition duration-300 
                    bg-gradient-to-r from-[#96deda] to-[#50c9c3] hover:bg-gradient-to-r 
                    hover:from-[#B7F8DB] hover:to-[#50A7C2] hover:rounded-full font-medium"
                        style={{
                          backgroundColor: "transparent",
                          color: "#f6f7f9",
                          borderRadius: "18px",
                          fontSize: "16px",
                        }}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </>
          ) : (
            <div>
              <p>Vui lòng đăng nhập để đánh giá</p>
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold mb-4 text-gray-800 mt-20 ">
          Các sản phẩm tương tự
        </h1>
        <div className="flex flex-wrap -mx-2 ">
        {productDataAll?.data?.slice(0, 4).map((product: any) => (
            <div
              key={product._id}
              className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 px-2 mb-8"
            >
              <div className="border-2 p-2 group bg-white rounded-lg transition-transform transform hover:scale-95 hover:shadow-xl border-gray-200">
                <Link to={`/detail/${product._id}`} className="block relative">
                  <div className="rounded-t-lg overflow-hidden">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-[300px] object-cover rounded-t-lg transform group-hover:opacity-80 transition-opacity rounded-lg"
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 group-hover:opacity-60 transition-opacity rounded-lg"></div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center">
                    <button className="w-40 h-10 bg-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full ">
                      Xem chi tiết
                    </button>
                  </div>
                </Link>
                <div className="p-2">
                  <h2 className="text-[18px] mt-4 text-[#6c6d6d]">
                    {product.name.length <= 25
                      ? product.name
                      : product.name.slice(0, 25) + " ..."}
                  </h2>
                  <div className="mt-2 max-w-[278px]">
                    <div className="text-base font-bold mt-1">
                      <p className="text-red-600 text-[15px]">
                        {product.price}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 mb-20">
          {isUserLoggedIn && (
            <div className="flex items-start space-x-2 mb-6 ">
              <img
                src={`${userData?.img}`}
                alt="Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{userData?.name}</p>
              </div>
            </div>
          )}
          {isUserLoggedIn && (
            <>
              <input
                className="mt-2 w-[65%] h-[45px] rounded-[4px] border-2 border-gray-300 px-4"
                placeholder="Viết bình luận của bạn..."
                value={commentadd}
                onChange={handleCommentChange}
              />
              <div className="mt-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-2 rounded-md"
                  onClick={handleCommentSubmit}
                >
                  Gửi bình luận
                </button>
              </div>
            </>
          )}

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Bình luận</h2>
            {commentData?.map((comment) => (
              <div key={comment._id} className="border p-4 mb-4 w-[65%]">
                <div className="flex items-start space-x-4">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/800px-User-avatar.svg.png"
                    alt="Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{comment?.nameuser}</p>
                    <p>{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
