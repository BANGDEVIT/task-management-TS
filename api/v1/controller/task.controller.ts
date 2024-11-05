import {Request,Response} from 'express';
import Task from '../models/task.model';
import paginationHelper from '../../../helpers/pagination.helper';
import searchHelper from '../../../helpers/search.helper';


//[GET] /api/v1/tasks
export const tasks = async (req: Request, res: Response) => {
//Find 
  interface Find {
    deleted : boolean,
    status? : string,
    title?: RegExp,
  }

  const find : Find ={
    deleted : false,
  }

  // tìm kiếm theo trạng thái
  if (req.query.status){
    find.status = req.query.status.toString();// or find.["status"] = req.query.status;
  }
  // tìm kiếm theo trạng thái

//End Find

//Sort 

  const sort ={};
  if (req.query.sortKey && req.query.sortValue){
    const sortKey : string  = req.query.sortKey.toString();
    sort[sortKey] = req.query.sortValue;
  }

//End Sort 

// Pagination

  let initPagination  = {
    currentPage : 1 ,
    limitItems : 2 ,
  }

  const countTasks = await Task.countDocuments(find);
  const objectsPagination =paginationHelper(
    initPagination,
    req.query,
    countTasks,  
  )

// End Pagination

//Search
  let objectSearch = searchHelper(req.query);

  if (req.query.keyword){
    find.title = objectSearch.regex;
  }
//End Search

  const tasks = await Task.find(find) 
  .sort(sort)
  .limit(objectsPagination.limitItems)
  .skip(objectsPagination.skip);
  res.json(tasks)
}

//[GET] /api/v1/tasks/detail/:id
export const detail = async (req: Request, res: Response) => {
  const id : string = req.params.id;
  const tasks = await Task.find({
    _id : id,
    deleted : false
  });
  res.json(tasks)
}

//[PATCH] /api/v1/tasks/change-status/:id
export const changeStatus =  async (req: Request, res: Response) => {
  try {
    const id : string = req.params.id;
    const status : string  = req.body.status;
    await Task.updateOne({
      _id : id,
      deleted : false
    },{
      status : status,
    })
    res.json( {
      code : 200,
      message:"cập nhật thành công"
    });
  } catch (error) {
    res.json( {
      code : 400,
      message:"Không tồn tại"
    });
  }
};

//[PATCH] /api/v1/tasks/changeMulti
export const changeMulti =  async (req: Request, res : Response) => {
  try {
    const ids : string[]= req.body.ids;
    const key :string = req.body.key;
    const value : string = req.body.value;
    // console.log(ids)
    // console.log(key)
    // console.log(value)

    enum Key {
      STATUS = 'status',
      DELETE = 'delete'
    }

    switch (key) {
      case Key.STATUS:
        await Task.updateMany({
          _id : {$in : ids},
          deleted : false
        },{
          status : value
        })
        res.json( {
          code : 200,
          message:"cập nhật thành công"
        });
        break;
    
      case Key.DELETE:
        await Task.updateMany({
          _id : {$in : ids},
          deleted : false
        },{
          deleted : true,
          deletedAt : new Date()
        })
        res.json( {
          code : 200,
          message:"cập nhật thành công"
        });
        break;

      default:
        res.json( {
          code : 400,
          message:"Không tồn tại"
        });
        break;
    }

  } catch (error) {
    res.json( {
      code : 400,
      message:"Không tồn tại"
    });
  }
};

//[POST] /api/v1/tasks/create
export const create =  async (req : Request, res : Response) => {
  try {
    // req.body.createdBy = req.user.id;
    const task = new Task(req.body);
    await task.save();
    res.json( {
      code : 200,
      message:"Cập nhật thành công",
      data : task
    });

  } catch (error) {
    res.json( {
      code : 400,
      message:"Không tồn tại"
    });
  }
};

//[PATCH] /api/v1/tasks/edit/:id
export const edit =  async (req : Request, res : Response) => {
  try {
    const id : string = req.params.id;
    await Task.updateOne({
      _id : id,
      deleted : false
    },
      req.body)
    res.json( {
      code : 200,
      message:"Cập nhật thành công",
    });

  } catch (error) {
    res.json( {
      code : 400,
      message:"Không tồn tại"
    });
  }
};

//[PATCH] /api/v1/tasks/delete/:id
export const deleteTask = async (req : Request, res:Response) => {
  try {
    const id : string = req.params.id;
    await Task.updateOne({
      _id : id,
    },{
      deleted : true,
      deletedAt : new Date(),
    }),
    res.json( {
      code : 200,
      message:"xóa thành công",
    });

  } catch (error) {
    res.json( {
      code : 400,
      message:"Không tồn tại"
    });
  }
};