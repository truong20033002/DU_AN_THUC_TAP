import joi from "joi";

export const CheckvalidateSignUp = joi.object({
  name: joi.string().required(),
  email: joi.string().required().messages({
    "string.email": "Email không hợp lệ",
    "string.required": "Trường Email là bắt buộc",
    "string.required": "Vui lòng nhập Email",
    "string.pattern.base": "Email không được chứa dấu cách",
  }),
  password: joi.string().required().min(5).messages({
    "string.empty": "Password không được để trống",
    "any.required": "Trường password là bắt buộc",
    "string.min": "Password phải có ít nhất 5 ký tự",
  }),
  phoneNumber:joi.string().required().min(10).max(14).messages({
    "string.empty": " số điện thoại không được để trống",
    "any.required": "Trường số điện thoại là bắt buộc",
    "string.min": "Password phải có ít nhất 10 ký tự",
    "string.max": "Password phải có nhiều nhất 14 ký tự",
    "string.pattern.base": "số điện thoại không được chứa dấu cách",
  }),
  confirmPassword: joi.string().valid(joi.ref("password")).required().messages({
    "string.empty": 'Trường "xác nhận mật khẩu" không được để trống',
    "any.required": "Trường xác nhận mật khẩu là bắt buộc",
    "any.only": 'Trường "xác nhận mật khẩu" không khớp',
  }),
});
export const CheckvalidateSignIn = joi.object({
  email: joi.string().email().required().messages({
    "string.base": `"email" phải là kiểu "text"`,
    "string.empty": `"email" không được bỏ trống`,
    "string.email": `"email" phải có định dạng là email`,
    "any.required": `"email" là trường bắt buộc`,
  }),
  password: joi.string().required().messages({
    "string.base": `"password" phải là kiểu "text"`,
    "string.empty": `"password" không được bỏ trống`,
    "string.min": `"password" phải chứa ít nhất {#limit} ký tự`,
    "any.required": `"password" là trường bắt buộc`,
  }),
});
