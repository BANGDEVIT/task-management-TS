import User from "../models/user.model"
import {Request,Response,NextFunction} from 'express';

export const requireAuth =  async (req : Request ,res : Response,next:NextFunction) : Promise<void>  => {
  if (req.headers.authorization){
    const token : string = req.headers.authorization.split(' ')[1];
    
    const user = await User.findOne({
      token: token,
      delete : false,
    }).select("-password")

    if (!user){
      res.json({
        code: 401,
        message: 'Token không hợp lệ'
      })
      return;
    }

    req["user"] = user;

    next();
  }else{
    res.json({
      code: 400,
      message: 'Vui lòng kèm token'
    })
  }
  
}