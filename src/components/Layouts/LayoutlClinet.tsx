import { Link, useNavigate, useParams } from "react-router-dom";
import { Outlet } from "react-router-dom";
import "./client.css";
import {
  AiFillHome,
  AiFillPhone,
  AiOutlineMail,
} from "react-icons/ai";

import { useEffect } from "react";
import { useGetProductsQuery } from "@/Api/productApi";
import { IProduct } from "@/interface/products";
import { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { FaRegCircleUser } from 'react-icons/fa6';
import { FaUserAstronaut } from "react-icons/fa";
import { Button, Drawer, Input, List } from "antd";
import {
  BsFacebook,
  BsGithub,
  BsYoutube,
  BsInstagram,
  BsPinAngleFill,
} from "react-icons/bs";
import { Spin } from "antd";
import { GiGhost } from "react-icons/gi";
import { FaCartShopping } from "react-icons/fa6";
import { useGetOneUserQuery, useUpdateUserMutation } from "@/Api/userApi";
type UserType = {
  id: number;
  name: string;
  img: string | number;
  email: string;
  // ... other properties if any
} | null;
const LayoutlClinet = () => {
  const { data: productData, error, isLoading } = useGetProductsQuery();
  const { idUser } = useParams<{ idUser: string }>();
  const { data: DataUser } = useGetOneUserQuery(idUser || "");
  const navigate = useNavigate();
  const [updateUser] = useUpdateUserMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [delayedSearchTerm, setDelayedSearchTerm] = useState("");
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  useEffect(() => {
    if (timer) clearTimeout(timer);

    setShowLoading(true); // Hiển thị biểu tượng loading

    const newTimer = setTimeout(() => {
      setDelayedSearchTerm(searchTerm);
      setShowLoading(false); // Ẩn biểu tượng loading sau 1,5 giây
    }, 1500);

    setTimer(newTimer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [searchTerm]);


  const [userInfo, setUserInfo] = useState<UserType>(null);
  useEffect(() => {
    const savedUser = localStorage.getItem("userInfo");
    if (savedUser) {
      setUserInfo(JSON.parse(savedUser));
    }
  }, []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    // Xóa tất cả dữ liệu từ localStorage
    localStorage.clear();

    // Navigate to the home page
    navigate('/', { replace: true });

    // Tải lại trang
    window.location.reload(); // This might not be necessary if you're navigating away
  };
  return (
    <>
      {/* <!-- HEADER --> */}
      <header className={`bg-[#F05941] mx-auto flex justify-between items-center py-6 px-20 mb-4 mt-0 transition-all w-[100%] z-50 fixed  `}>
        <div className="flex">
         <h2 className="text-[35px] font-extrabold">Book Book</h2>
        <p className="text-[35px] mt-3 ml-3">   <GiGhost /></p>
        </div>
        <nav className="text-lg text-[#000000] font-bold  hidden lg:flex">
          <ul className="flex space-x-12 ml-20">
            <li className="relative group">
              <a href="/" className=" group-hover:text-[#fff]">
                trang chủ
              </a>
            </li>

            <li className="relative group">

              <a href="/khoahoc" className="group-hover:text-[#fff]">
               Tất cả sản phẩm
              </a>
            </li>
            <li className="relative group">
              <a href="/contact" className=" group-hover:text-[#fff]">
              liên hệ
              </a>
            </li>
          </ul>

        </nav>
        <button className="block lg:hidden ml-[70%] rounded focus:outline-none hover:bg-gray-200 group ">
          <div className="w-5 h-1 bg-gray-600 mb-1"></div>
          <div className="w-5 h-1 bg-gray-600 mb-1"></div>
          <div className="w-5 h-1 bg-gray-600 "></div>
          <div className="absolute top-0 right-0  w-[30%] bg-white border opacity-0 group-focus:right-0 group-focus:opacity-100 transition-all duration-1000">
           

          </div>
        </button>
        <div className="items-center space-x-4 flex hidden lg:flex">

          <div className="relative ">
            <Input
              className="text-white h-10 w-[250px] rounded-lg border border-[#000] text-sm"
              placeholder="Tìm kiếm"
              prefix={
                showLoading ? (
                  <Spin />
                ) : (
                  <SearchOutlined className="text-[18px]  mr-2 text-gray-500 " />
                )
              }
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
            />

            <div className="absolute bg-white mt-2 w-full rounded-lg z-10  ">

              {/* Hiển thị kết quả tìm kiếm của sản phẩm */}
              {delayedSearchTerm &&
                productData &&
                productData.data.filter((val) =>
                  val.name
                    .toLowerCase()
                    .includes(delayedSearchTerm.toLowerCase())
                ).length > 0 && (
                  <>
                    <p className="text-xl ml-2">Sản phẩm</p>
                    {productData.data
                      .filter((val) => {
                        if (
                          val.name
                            .toLowerCase()
                            .includes(delayedSearchTerm.toLowerCase())
                        ) {
                          return val;
                        }
                      })
                      .map((product: IProduct) => (
                        <div
                          key={product._id}
                          className="bg-white rounded-lg hover:border hover:shadow-md overflow-hidden  hover:scale-105 transition ease-out duration-500"
                        >
                          <Link to={`/detail/${product._id}`} className=" ">
                            <div className="p-2 flex ">
                              <img
                                className="w-[50px] h-[50px] rounded-full"
                                src={product.img}
                                alt=""
                              />
                              <h2 className="text-base text-center  ml-2">
                                {product.name}
                              </h2>
                            </div>
                          </Link>
                        </div>
                      ))}
                  </>
                )}
              {delayedSearchTerm &&
                productData &&
                productData.data.filter((val) =>
                  val.name
                    .toLowerCase()
                    .includes(delayedSearchTerm.toLowerCase())
                ).length === 0 && (
                  <p className="p-4">
                    Không tìm thấy sản phẩm cho từ khóa bạn tìm.
                  </p>
                )}

            
            
            </div>
          </div>

          {userInfo ? (
            <>
            <div>
            <Link to="/cart">
            <p className="text-[25px]"><FaCartShopping /></p> 
            </Link>
            </div>
              <div
                onMouseEnter={() => setIsMenuOpen(true)}
                onMouseLeave={() => setIsMenuOpen(false)}
              >
                <div className="text-center">
                  <FaUserAstronaut
                    style={{ fontSize: "32px", margin: "5px 15px" }}
                  />
                </div>
                {isMenuOpen && (
                  <div
                    className="border rounded-md"
                    style={{
                      position: "absolute",
                      backgroundColor: "white",
                      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Link to={`/profile/${userInfo && (userInfo.data ? userInfo.data._id : userInfo.userData._id)}`}>
                      {" "}
                      <div
                        className="hover:bg-[#872341] hover:text-white  rounded-md"
                        style={{ padding: "10px 20px" }}
                      >
                       trang cá nhân
                      </div>
                    </Link>


                    <Link to="/changePassword">
                      {" "}
                      <div
                        className="hover:bg-[#872341] hover:text-white  rounded-md"
                        style={{ padding: "10px 20px" }}
                      >
                        Đổi mật khẩu
                      </div>
                    </Link>
                    <button
                      className="hover:bg-[#872341]  hover:text-white w-full rounded-md "
                      style={{ padding: "10px 20px" }}
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>

                  </div>
                )}
                <span>{userInfo ? (userInfo.data ? userInfo.data.name : userInfo?.userData ? userInfo.userData.name : '') : ''}</span>


              </div>
            </>
          ) : (
            <>
              <Link to="signin">
                <button className="bg-white text-[#22092C] px-4 py-2 rounded-[50px] hover:bg-[#22092C] hover:text-white">
                  Đăng nhập
                </button>
              </Link>
              <Link to="signup">
                <button className="bg-[#22092C] text-white px-4 py-2 rounded-[50px] hover:bg-[#872341] hover:text-white">
                  Đăng Ký
                </button>
              </Link>
            </>
          )}
          
        </div>
        
      </header>
      <div className="bg-gray-200 flex pt-[120px] ">
   <div className="flex pl-[30%] gap-10">
  <div className="item flex gap-2 items-center text-center">
    <img src="//theme.hstatic.net/1000237375/1000756917/14/item_image_chinhsach_1.png?v=1145" alt="" className="w-6 h-6 flex-shrink-0" />
    <samp className="text-sm ">Ship COD Trên Toàn Quốc</samp>
  </div>
  <div className="item flex gap-2 items-center text-center">
    <img src="//theme.hstatic.net/1000237375/1000756917/14/item_image_chinhsach_2.png?v=1145" alt="" className="w-6 h-6 flex-shrink-0" />
    <p className="text-sm ">Free Ship Đơn Hàng Trên 300k</p>
  </div>
  <div className="item flex gap-2 items-center text-center">
    <img src="//theme.hstatic.net/1000237375/1000756917/14/item_image_chinhsach_3.png?v=1145" alt="" className="w-6 h-6 flex-shrink-0" />
    <p className="text-sm ">19001004</p>
  </div>
</div>

</div>
      {/* =========================== */}
      <Outlet />
      {/* =========================== */}

      <footer className="relative text-white bg-cover bg-center bg-[#F05941] py-10 sm:py-12 md:py-16 lg:py-20">
        <div className="container mx-auto">
          <div className=" ml-[10%] flex  flex-col sm:flex-row space-y-8 sm:space-y-0 sm:space-x-12 md:space-x-16 lg:space-x-20 text-white ">
            <div className="w-full sm:w-1/4 md:w-1/6 ">
              <p className="text-xl font-bold">Thông tin liên hệ</p>
              <p className="text-sm mt-4 flex items-center">
                <AiFillHome className=" text-[14px] mr-1" />
                Address:Tòa nhà FPT Polytechnic 
              </p>
              <p className="text-sm flex items-center mt-2">
                <AiOutlineMail className=" text-[13px] mr-1" />
                Email: bangtruong131@gmail.com
              </p>
              <p className="text-sm flex items-center mt-2">
                <AiFillPhone className="text-[15px] mr-1" />
                Hotline: 19001004
              </p>
              
            </div>

            <div className="w-full sm:w-1/4 md:w-1/6 ">
              <p className="text-xl font-bold">Liên kết nhanh</p>
              <p className="mt-4 text-sm">
                <a href="/" className="flex items-center">
                  <BsPinAngleFill className="mt-1.5 text-[14px] mr-1" />
                  Trang chủ
                </a>
              </p>
              <p className="text-sm">
                <a href="/khoahoc" className="flex items-centerc mt-2">
                  <BsPinAngleFill className="mt-1.5 text-[14px] mr-1" />
                  Khóa học
                </a>
              </p>
              <p className="text-sm">
                <a href="#" className="flex items-center mt-2">
                  <BsPinAngleFill className="mt-1.5 text-[14px] mr-1 " />
                  Dịch vụ
                </a>
              </p>
              <p className="text-sm">
                <a href="/contact" className="flex items-center mt-2">
                  <BsPinAngleFill className="mt-1.5 text-[14px] mr-1" />
                  Liên hệ
                </a>
              </p>
            </div>

            <div className="w-full sm:w-1/4 md:w-1/6 ">
              <p className="text-xl font-bold">Theo dõi chúng tôi</p>
              <p className="mt-4 text-sm">
                <a href="https://open.spotify.com/playlist/37i9dQZF1EQqedj0y9Uwvu" className="flex items-center ">
                  <BsFacebook className="mt-1.5 text-[14px] mr-1" />
                  Facebook
                </a>
              </p>
              <p className="text-sm">
                <a href="" className="flex items-center mt-2">
                  <BsGithub className="mt-1.5 text-[14px] mr-1" />
                  Github
                </a>
              </p>
              <p className="text-sm">
                <a href="" className="flex items-center mt-2">
                  <BsYoutube className="mt-2 text-[14px] mr-1" />
                  Youtube
                </a>
              </p>
              <p className="text-sm">
                <a href="" className="flex items-center mt-2">
                  <BsInstagram className="mt-1.5 text-[14px] mr-1" />
                  Instagram
                </a>
              </p>
            </div>

            <div className="w-full sm:w-1/4 md:w-1/6 ">
              <p className="text-xl font-bold">Phương thức thanh toán</p>
              <p className="mt-2">Thanh toán trực tiêp</p>
            
            </div>
          </div>
        </div>
        <img src="../../../public/img/anh2.svg" alt="" className="absolute bottom-0 right-0" />
        <div className="text-center text-[#0B7077] mt-8">
          
        </div>
      </footer>

    </>
  );
};

export default LayoutlClinet;
