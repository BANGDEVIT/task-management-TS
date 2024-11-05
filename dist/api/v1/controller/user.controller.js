"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = exports.detail = exports.resetPassword = exports.otpPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const md5_1 = __importDefault(require("md5"));
const user_model_1 = __importDefault(require("../models/user.model"));
const forgot_password_model_1 = __importDefault(require("../models/forgot-password.model"));
const generateHelper = __importStar(require("../../../helpers/generate.helper"));
const sendMailHelper = __importStar(require("../../../helpers/sendMail.helper"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.password = (0, md5_1.default)(req.body.password);
    const exitEmail = yield user_model_1.default.findOne({
        email: req.body.email,
        delete: false,
    });
    if (!exitEmail) {
        const newUser = new user_model_1.default({
            email: req.body.email,
            password: req.body.password,
            fullname: req.body.fullname,
            token: generateHelper.generateRandomString(20),
        });
        yield newUser.save();
        const token = newUser.token;
        res.cookie("token", token);
        res.json({
            code: 200,
            message: "Đăng kí thành công",
            token: token
        });
    }
    else {
        res.json({
            code: 400,
            message: "Email đã tồn tại",
        });
        return;
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.password = (0, md5_1.default)(req.body.password);
    const user = yield user_model_1.default.findOne({
        email: req.body.email,
        delete: false,
    });
    if (!user) {
        res.json({
            code: 400,
            message: "Email không tồn tại",
        });
        return;
    }
    if (req.body.password !== user.password) {
        res.json({
            code: 400,
            message: "Sai mật khẩu",
        });
        return;
    }
    const token = user.token;
    res.cookie("token", token);
    res.json({
        code: 200,
        message: "Đăng nhập thành công",
        token: token
    });
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({
        email: req.body.email,
        delete: false,
    });
    if (!user) {
        res.json({
            code: 400,
            message: "Email không tồn tại",
        });
        return;
    }
    const otp = generateHelper.generateRandomNumber(8);
    const timeExprice = 5;
    const objectForgotPassword = {
        email: req.body.email,
        otp: otp,
        expireAt: Date.now() + timeExprice * 60 * 1000,
    };
    const newForgotPassword = new forgot_password_model_1.default(objectForgotPassword);
    yield newForgotPassword.save();
    const subject = "Mã OTP";
    const html = `
  <h1>Mã OTP của bạn là : ${otp}</h1>
  <p>Mã OTP sẽ hết hạn sau 3 phút</p>
  `;
    sendMailHelper.sendMail(req.body.email, subject, html);
    res.json({
        code: 200,
        message: "Email tồn tại",
    });
});
exports.forgotPassword = forgotPassword;
const otpPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = req.body.otp;
    const email = req.body.email;
    const result = yield forgot_password_model_1.default.findOne({
        email: email,
        otp: otp,
    });
    if (!result) {
        res.json({
            code: 400,
            message: "Nhập sai OTP",
        });
        return;
    }
    const user = yield user_model_1.default.findOne({
        email: email,
        delete: false,
    });
    const token = user.token;
    res.cookie("token", token);
    res.json({
        code: 200,
        message: "xác nhận thành công",
        token: token,
    });
});
exports.otpPassword = otpPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const password = (0, md5_1.default)(req.body.password);
    const token = req.body.token;
    const user = yield user_model_1.default.findOne({
        token: token,
    });
    if (password == user.password) {
        res.json({
            code: 400,
            message: "Vui lòng nhập mật khẩu khác mật khẩu cũ",
        });
        return;
    }
    yield user_model_1.default.updateOne({
        token: token,
        delete: false,
    }, {
        password: password,
    });
    res.json({
        code: 200,
        message: "sửa mật khẩu thành công",
    });
});
exports.resetPassword = resetPassword;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user = yield user_model_1.default.findOne({
        _id: id,
        deleted: false,
    }).select("-password -token");
    res.json({
        code: 200,
        message: "Thông tin người dùng",
        info: user,
    });
});
exports.detail = detail;
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find({}).select("id fullName email");
    res.json({
        code: 200,
        message: "Thông tin người dùng",
        users: users,
    });
});
exports.list = list;
