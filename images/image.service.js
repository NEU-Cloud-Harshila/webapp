const db = require('_helpers/db');
const AWS = require('aws-sdk');
const BUCKET_NAME = process.env.BUCKETNAME;
require("dotenv").config();
const fs = require("fs");
const s3 = new AWS.S3({
    accessKeyId: "AKIAZLEE6TO4ACPH2FWV",
    secretAccessKey: "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",
});

const checkFileType = (type) => {
    let fileTypes = ['png', 'jpeg', 'jpg', 'gif'];

    if (fileTypes.includes(type)) {
        return true;
    }

    return false;
};

const fileUpload = async (req, res) => {
    try {
        if (req.file == undefined || !checkFileType(req.file.mimetype.split('/')[1])) {
            return res.status(400).send({ message: "Bad Request. Please upload a file." });
        }

        let fileName = req.file.filename;
        const fileContent = fs.readFileSync(req.file.destination + '/' + fileName);
        const timestamp = new Date().getTime();
        const key = `product-uploaded-images/${req.params.product_id}/${timestamp}-${req.file.originalname}`;
        const uploadParams = {
            Bucket: BUCKET_NAME,
            Key: key,
            Body: fileContent
        };

        await s3.upload(uploadParams).promise();

        let product = await db.Product.findOne({ where: { id: req.params.product_id } })

        let imageObj = await product.createImage({
            product_id: req.params.product_id,
            file_name: req.file.originalname,
            date_created: new Date().toISOString(),
            s3_bucket_path: key
        })

        let result = {
            "image_id": imageObj.dataValues.image_id,
            "product_id": imageObj.dataValues.product_id,
            "file_name": imageObj.dataValues.file_name,
            "date_created": imageObj.dataValues.date_created,
            "s3_bucket_path": imageObj.dataValues.s3_bucket_path
        }

        res.status(201).json(result);
    } catch (err) {
        res.status(500).send({
            message: `Cannot upload the file: ${req.file.originalname}. ${err}`,
        });
    }
};

const getAllProductImages = async (req, res) => {
    const productID = req.params.product_id;

    try {
        const data = await db.Image.findAll({
            where:{
                product_id:productID
            }
        });

        let result = [];

        data.forEach(res => {
            delete res.dataValues.date_last_updated
            result.push(res.dataValues);
        });

        return res.status(200).json(result); 
    }catch(err) {
        res.status(400).send("Bad Request.");
    }
};

const delUploadedImage = async (req, res) => {
    console.log(req.params);
    const imageID = req.params.image_id;
    try {
        let data = await db.Image.findOne({
            where:{
                image_id:imageID
            }
        });

        if (!data) {
            return res.status(404).json({
                message: 'Image Data Not found.'
            })
        }

        let bucketPath = data.s3_bucket_path;

        var params = { Bucket: BUCKET_NAME, Key: bucketPath };

        await s3.deleteObject(params).promise();
        
        await db.Image.destroy({
            where:{
                image_id:imageID
            }
        });

        return res.status(204).send(); 
    }catch(err) {
        res.status(400).send("Bad Request. An error occurred.");
    }
};

const getProductImage = async (req, res) => {
    const imageId = req.params.image_id;

    try{
        let data = await db.Image.findOne({
            where:{
                image_id:imageId
            }
        });
        if(!data) {
            return res.status(404).json({
                message: "Image Not Found"
            });
        }
        let result = {
            "image_id": data.dataValues.image_id,
            "product_id": data.dataValues.product_id,
            "file_name": data.dataValues.file_name,
            "date_created": data.dataValues.date_created,
            "s3_bucket_path": data.dataValues.s3_bucket_path
        }
        return res.status(200).json(result); 
    }catch(err) {
        res.status(400).send("Bad Request. An error occurred.");
    }
};

module.exports = {
    fileUpload,
    getAllProductImages,
    delUploadedImage,
    getProductImage
};
