import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {  useGetOneUserQuery } from "@/Api/userApi";
import "./index.css";
import { FaUserTie } from 'react-icons/fa';
import { FaBookOpen } from 'react-icons/fa';
import { FaRunning } from 'react-icons/fa';
import { FaUserEdit } from 'react-icons/fa';

const ProfileUser = () => {
  type UserType = {
    id: number;
    name: string;
    img: string | number;
    email: string;
    // ... other properties if any
  } | null;
  
  const [userInfo, setUserInfo] = useState<UserType | null>(null);
  const { idUser } = useParams<{ idUser: string }>();
  const { data: DataUser ,isLoading,isError } = useGetOneUserQuery(idUser || "");
  console.log("get on 1", DataUser);
  useEffect(() => {
    // Lấy thông tin người dùng từ Local Storage khi trang tải
    const savedUser = localStorage.getItem("userInfo");
    if (savedUser) {
      setUserInfo(JSON.parse(savedUser));
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading product data.</div>;
  }


  return (
    <div className=" flex justify-center">
      <div className="  w-4/5    ">
        <div className="profile  ">
          <div className="w-full  rounded rounded-tl-lg rounded-tr-lg bg-cover bg-center " style={{ backgroundImage: 'url("../../../public/img/wallpaperflare.com_wallpaper\ \(4\).jpg")' }}>
            <div>
              <div className="avatar avatar-left ">
                <img
                  src={DataUser?.img}
                  alt="Avatar"
                  className="avatar-image"
                />
              </div>
            </div>
            
          </div>
        </div>
        <div className=" ">
          <div className="flex justify-center  gap-14  pt-10   ">
            <div className=" bg-white p-8 w-[850px] mb-20 rounded mt-6">
              <div className="flex gap-2 ml-[115px] mb-4 -mt-20 ">
                <h1 className="text-3xl font-bold  ">{DataUser?.name}</h1>
              </div>
              <div className="w-[826px]  mt-32">
                    <div className="">
                      <Link
                        className="custom-card mt-[-13px] pl-5 gap-4 h-20 w-full bg-white rounded-lg border shadow-md overflow-hidden hover:shadow-lg hover:shadow-gray-300 hover:scale-105 transition ease-out duration-500 flex justify-start items-center"
                        to={`/profile/edit/${DataUser?._id}`}
                      >
                        <div className=" font-semibold text-lg">Edit Profile</div>
                        <div className="text-3xl"> <FaUserEdit /></div>
                       
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
  );
};

export default ProfileUser;