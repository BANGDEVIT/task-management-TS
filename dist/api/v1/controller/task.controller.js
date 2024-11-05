"use strict";
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
exports.deleteTask = exports.edit = exports.create = exports.changeMulti = exports.changeStatus = exports.detail = exports.tasks = void 0;
const task_model_1 = __importDefault(require("../models/task.model"));
const pagination_helper_1 = __importDefault(require("../../../helpers/pagination.helper"));
const search_helper_1 = __importDefault(require("../../../helpers/search.helper"));
const tasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const find = {
        deleted: false,
    };
    if (req.query.status) {
        find.status = req.query.status.toString();
    }
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toString();
        sort[sortKey] = req.query.sortValue;
    }
    let initPagination = {
        currentPage: 1,
        limitItems: 2,
    };
    const countTasks = yield task_model_1.default.countDocuments(find);
    const objectsPagination = (0, pagination_helper_1.default)(initPagination, req.query, countTasks);
    let objectSearch = (0, search_helper_1.default)(req.query);
    if (req.query.keyword) {
        find.title = objectSearch.regex;
    }
    const tasks = yield task_model_1.default.find(find)
        .sort(sort)
        .limit(objectsPagination.limitItems)
        .skip(objectsPagination.skip);
    res.json(tasks);
});
exports.tasks = tasks;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const tasks = yield task_model_1.default.find({
        _id: id,
        deleted: false
    });
    res.json(tasks);
});
exports.detail = detail;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const status = req.body.status;
        yield task_model_1.default.updateOne({
            _id: id,
            deleted: false
        }, {
            status: status,
        });
        res.json({
            code: 200,
            message: "cập nhật thành công"
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại"
        });
    }
});
exports.changeStatus = changeStatus;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ids = req.body.ids;
        const key = req.body.key;
        const value = req.body.value;
        let Key;
        (function (Key) {
            Key["STATUS"] = "status";
            Key["DELETE"] = "delete";
        })(Key || (Key = {}));
        switch (key) {
            case Key.STATUS:
                yield task_model_1.default.updateMany({
                    _id: { $in: ids },
                    deleted: false
                }, {
                    status: value
                });
                res.json({
                    code: 200,
                    message: "cập nhật thành công"
                });
                break;
            case Key.DELETE:
                yield task_model_1.default.updateMany({
                    _id: { $in: ids },
                    deleted: false
                }, {
                    deleted: true,
                    deletedAt: new Date()
                });
                res.json({
                    code: 200,
                    message: "cập nhật thành công"
                });
                break;
            default:
                res.json({
                    code: 400,
                    message: "Không tồn tại"
                });
                break;
        }
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại"
        });
    }
});
exports.changeMulti = changeMulti;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = new task_model_1.default(req.body);
        yield task.save();
        res.json({
            code: 200,
            message: "Cập nhật thành công",
            data: task
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại"
        });
    }
});
exports.create = create;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield task_model_1.default.updateOne({
            _id: id,
            deleted: false
        }, req.body);
        res.json({
            code: 200,
            message: "Cập nhật thành công",
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại"
        });
    }
});
exports.edit = edit;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield task_model_1.default.updateOne({
            _id: id,
        }, {
            deleted: true,
            deletedAt: new Date(),
        }),
            res.json({
                code: 200,
                message: "xóa thành công",
            });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại"
        });
    }
});
exports.deleteTask = deleteTask;
