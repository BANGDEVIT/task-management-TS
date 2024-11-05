import express,{Express,Request,Response} from 'express';
import dotenv from 'dotenv';
import * as database from "./config/database"
import cors  from 'cors'
import mainV1Route from "./api/v1/routers/index.route"

dotenv.config();
database.connect();

const app: Express = express();

const port : number | string = process.env.PORT || 3001;

app.use(express.json())
app.use(express.urlencoded({extended : true}))

// const corsOptions = {
//   origin: 'http://example.com',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

// app.use(cors(corsOptions));

app.use(cors());

mainV1Route(app);

app.listen(port,() =>{
  console.log(`Server is running on port ${port}`);
})

