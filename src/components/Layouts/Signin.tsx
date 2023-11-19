import { Link } from "react-router-dom"
import userApi, { useLoginMutation } from '@/Api/userApi';
import { IUsers } from "@/interface/user";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, notification } from 'antd';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch } from 'react-redux';
import { UserOutlined, LockOutlined } from '@ant-design/icons'; // Import icons
import {BiLogoGmail} from "react-icons/bi";
import {RiLockPasswordFill} from "react-icons/ri";
import "./signin_signup.css"
type FieldType = {
    email?: string;
    password?: string;
  };
const Signin = () => {
  const [signin, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const SET_USER = 'SET_USER';

  function setUser(user: IUsers) {
      return {
          type: SET_USER,
          payload: user
      };
  }

  const onFinish = async (values: IUsers) => {
    try {
        const user = await signin(values).unwrap();
        // Serialize and save user data to local storage
        localStorage.setItem('userInfo', JSON.stringify(user));
        dispatch(setUser(user));
        navigate('/'); // Replace with your success route
        notification.success({
            message: 'Thành công',
            description: 'Đăng nhập thành công.',
        });
    } catch (error) {
        // It's a good practice to clear any potentially stale user data upon login failure
        localStorage.removeItem('user');
        notification.error({
            message: 'Lỗi',
            description: error.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra tài khoản hoặc mật khẩu.',
        });
    }
};
return (
  <div className="flex justify-center items-center bg-cover bg-center h-screen" style={{ backgroundImage: 'url("../../../public/img/wallpaperflare.com_wallpaper\ \(1\).jpg")' }}>
      <div  className="contaiiiner   ">
      <div className="login-content ">
            <div className="login-formmm">
    <Form
    name="basic"
    className="register-formmm" id="register-form"

    initialValues={{ remember: true }}
    onFinish={onFinish}
    autoComplete="off"
  >
     <h2 className="form-title mr-3">Đăng nhập</h2>
    <Form.Item<FieldType>
      className="form-group"
      name="email"
      rules={[{ required: true, message: 'Bắt buộc phải nhập Email!' }]}
    >
      <Input  className="input no-border-radius  input-prefix-spacing input-password w-[300px] mr-[25px]" placeholder="Nhập email của bạn" prefix={<BiLogoGmail />}/>
      
    </Form.Item>

    <Form.Item<FieldType>
      className="form-group"
      name="password"
      rules={[{ required: true, message: 'Hãy nhập mật khẩu' }]}
    >
      <Input.Password className="input no-border-radius input-prefix-spacing  w-[300px] mr-[25px]" placeholder="Nhập mật khẩu của bạn" prefix={<RiLockPasswordFill />}/>
    </Form.Item>
    
    <Form.Item >
    <Button className="ml-20 mt-6 text-[20px] w-[140px] h-[50px] " type="primary" danger htmlType="submit">
                        {isLoading ? (
                            <AiOutlineLoading3Quarters className="animate-spin" />
                        ) : (
                            "Đăng nhập"
                        )}
                    </Button>
                 
    </Form.Item>
    <a href="/signup" className="login-image-link text-[18px] text-center ml-20 ">Tạo tài khoản</a>
    <a href="/forgotPassword" className="  mt-6 text-[18px] text-center ml-20">Quên Mật Khẩu</a>
   
  </Form>
  
      </div>
      </div>
      </div>
  </div>
        )
}

export default Signin