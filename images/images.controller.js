const express = require('express');
const router = express.Router();
const multer = require("multer");
const imagebasicAuth = require('_middleware/image-basic-auth');
const userbasicAuth = require('_middleware/user-basic-auth');
const upload = multer({ dest: "./imageUploads/" });
const imageService = require('./image.service');
const delUserAuth = require('_middleware/del-user-auth');

router.post("/v1/product/:product_id/image", upload.single("file"), imagebasicAuth(), imageService.fileUpload);
router.get("/v1/product/:product_id/image",userbasicAuth(),imageService.getAllProductImages);
router.delete("/v1/product/:product_id/image/:image_id",delUserAuth(),imageService.delUploadedImage);
router.get("/v1/product/:product_id/image/:image_id",delUserAuth(),imageService.getProductImage);

module.exports = router;