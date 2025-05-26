const dotenv=require('dotenv').config()
const DATABASE_URL=process.env.DATABASE_URL;

const HOST=process.env.HOST;
const PORT=process.env.PORT;
module.exports={
    HOST,
    PORT,
    DATABASE_URL
}