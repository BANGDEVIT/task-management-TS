import md5 from 'md5';
import {Request,Response} from 'express';
import User from "../models/user.model";
import ForgotPassword  from '../models/forgot-password.model';
import * as generateHelper from "../../../helpers/generate.helper"
import * as sendMailHelper from '../../../helpers/sendMail.helper';

//[POST] /api/v1/users/register
export const register = async(req : Request,res : Response) =>{

  req.body.password = md5(req.body.password);

  const exitEmail = await User.findOne({
    email : req.body.email,
    delete  : false,
  })

  if (!exitEmail){
    const newUser = new User({
      email : req.body.email,
      password : req.body.password,
      fullname : req.body.fullname,
      token : generateHelper.generateRandomString(20),
    });
    await newUser.save();
    const token : string = newUser.token;
    res.cookie("token", token);
    res.json( {
      code : 200,
      message:"Đăng kí thành công",
      token : token
    });
  }else{
    res.json( {
      code : 400,
      message:"Email đã tồn tại",
    });
    return;
  }
}

//[POST] /api/v1/users/login
export const login = async(req : Request ,res : Response ) =>{

  req.body.password = md5(req.body.password);

  const user = await User.findOne({
    email : req.body.email,
    // password : req.body.password,
    delete  : false,
  })

  if (!user){
    res.json( {
      code : 400,
      message:"Email không tồn tại",
    });
    return;
  }

  if (req.body.password !== user.password){
    res.json( {
      code : 400,
      message:"Sai mật khẩu",
    });
    return;
  }

  const token : string = user.token;
  res.cookie("token", token);
  res.json( {
    code : 200,
    message:"Đăng nhập thành công",
    token : token
  });
}

//[POST] /api/v1/users/password/forgot
export const forgotPassword = async(req : Request ,res : Response) =>{

  const user = await User.findOne({
    email : req.body.email,
    delete  : false,
  })

  if (!user){
    res.json( {
      code : 400,
      message:"Email không tồn tại",
    });
    return;
  }

  const otp : string = generateHelper.generateRandomNumber(8);

  const timeExprice = 5 ;

  //lưu data vào database (tạo 1 data sau khi nhâp đúng email quên mật khẩu vào database)
  const objectForgotPassword = {
    email : req.body.email,
    otp : otp,
    expireAt : Date.now() + timeExprice*60*1000,  
  }

  const newForgotPassword = new ForgotPassword(objectForgotPassword);
  await newForgotPassword.save();

  //Gửi email xác nhận mã OTP
  const subject ="Mã OTP"
  const html = `
  <h1>Mã OTP của bạn là : ${otp}</h1>
  <p>Mã OTP sẽ hết hạn sau 3 phút</p>
  `;
  sendMailHelper.sendMail(req.body.email,subject,html);

  res.json( {
    code : 200,
    message:"Email tồn tại",
  });
}

//[POST] /api/v1/users/password/otp
export const otpPassword = async(req : Request,res : Response) =>{

  const otp = req.body.otp;

  const email = req.body.email;

  const result = await ForgotPassword.findOne({
    email :email,
    otp : otp,
  })

  if (!result){
    res.json( {
      code : 400,
      message:"Nhập sai OTP",
    });
    return;
  }

  const user = await User.findOne({
    email : email,
    delete  : false,
  })

  const token = user.token;
  res.cookie("token", token);

  res.json( {
    code : 200,
    message:"xác nhận thành công",
    token : token,
  });
}

//[POST] /api/v1/users/password/reset
export const resetPassword = async(req : Request ,res : Response) =>{

  const password = md5(req.body.password);

  const token = req.body.token;


  const user = await User.findOne({
    token :token,
  })

  if (password == user.password) {
    res.json( {
      code : 400,
      message:"Vui lòng nhập mật khẩu khác mật khẩu cũ",
    });
    return;
  }

  await User.updateOne({
    token : token,
    delete  : false,
  },{
    password :  password,
  })

  res.json( {
    code : 200,
    message:"sửa mật khẩu thành công",
  });
}

//[POST] /api/v1/users/detail/:id 
export const detail = async(req : Request ,res : Response) =>{

  const id : string = req.params.id;

  const user = await User.findOne({
    _id : id,
    deleted : false,
  }).select("-password -token");

  res.json( {
    code : 200,
    message:"Thông tin người dùng",
    info : user,//req.["user"]
  });
}

//[POST] /api/v1/users/list
export const list = async(req : Request ,res : Response) =>{
  const users = await User.find({}).select("id fullName email")
  res.json( {
    code : 200,
    message:"Thông tin người dùng",
    users : users,
  });
}