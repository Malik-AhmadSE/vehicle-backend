// server.js
const express = require('express');
const cors = require('cors')
const connectDB = require('./config/db');
const { PORT } = require('./config/dotenvConfig');
const brandRoutes = require('./routes/brandRoutes');
const yearRoutes = require('./routes/yearRoutes');
const modelRoute=require('./routes/vehicleRoutes');
const partRoute=require('./routes/partRoutes');
const searchSuggest=require('./controllers/searchSuggest')
const all=require('./controllers/allvehicleController')
const app = express();
app.use(
  cors({
    origin: function (origin, callback) {
      return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(express.json());
connectDB();



// Routes
app.use('/brands', brandRoutes);
app.use('/brands/:brandId/years', yearRoutes);
app.use('/',modelRoute);
app.use('/',partRoute);
app.use('/',searchSuggest)
app.get('/vehicles/tree', all.getVehicleTree);

app.get('/api',(req,res)=>{
  res.send("hello");
})
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
