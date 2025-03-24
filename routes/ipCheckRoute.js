const express = require("express"); 
const router = express.Router();

const { getIpCheck, ipCheck } = require("../controllers/ipCheckController");

router.route("/").get(getIpCheck);
router.route("/").post(ipCheck);

module.exports = router;