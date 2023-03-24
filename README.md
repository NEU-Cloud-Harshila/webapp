# Assignment 6 demo

Harshila Jagtap

NEU ID : 002743674

# Web Application Development

Created REST APIs for the web application by fulfilling technology stack that meets Cloud-Native Web Application Requirements. 


# Pre-requisite : 

Node : v18
Visual Studio Code
Packer by hashiCorp : latest version as per OS

# Clone Instructions :

1. Make a directory : 
mkdir cloud

2. cd cloud

3. git clone git@github.com:NEU-Cloud-Harshila/webapp.git

# Build Instructions :

1. npm install

2. npm run start

3. If you want to run unit tests,

   npm run test

# External packages used with their version details:

        "basic-auth": "^2.0.1",
        "bcryptjs": "^2.4.3",
        "body-parser": "^1.19.0",
        "cors": "^2.8.5",
        "email-validator": "^2.0.4",
        "express": "^4.17.1",
        "joi": "^17.2.0",
        "mocha": "^10.2.0",
        "mysql2": "^2.1.0",
        "rootpath": "^0.1.2",
        "sequelize": "^6.3.4",
        "supertest": "^6.3.3"


# Below are the Web APIs implemented : 

1. /healthz

GET endpoint

this endpoint is to check if the service is up and running as a health check.

Sample Request : 
http://localhost:1700/healthz

Sample Response : 
{
    "httpResponseCode": 200,
    "message": "OK"
}


--------------------------------------------------
## User Endpoints

2. /v1/user

POST endpoint

this endpoint is to create a user.

Sample Request : 
http://localhost:1700/v1/user

Sample Request Body : 
{
    "first_name": "harshila",
    "last_name": "jagtap",
    "username": "harshila.jagtap@gmail.com",
    "password": "hello@123"
}


Sample Response : 

{
    "id": 2,
    "first_name": "harshila",
    "last_name": "jagtap123",
    "username": "harshila.jagtap@gmail.com",
    "account_created": "2023-02-01T21:04:46.000Z",
    "account_updated": "2023-02-01T21:07:00.713Z"
}



--------------------------------------------------


3. /v1/user

PUT endpoint

this endpoint is to Update a user. Also pass the Basic authentication to it.

Sample Request : 
http://localhost:1700/v1/user

Sample Request Body : 
{
    "first_name": "harshila",
    "last_name": "jagtap123",
    "username": "harshila.jagtap@yahoo.com",
    "password": "hello@123"
}


Sample Response : 

{
    "id": 2,
    "first_name": "harshila",
    "last_name": "jagtap123",
    "username": "harshila.jagtap@gmail.com",
    "account_created": "2023-02-01T21:04:46.000Z",
    "account_updated": "2023-02-01T21:07:00.713Z"
}



--------------------------------------------------


4. /v1/user/2

GET endpoint

this endpoint is to fetch user information by providing UserID.

Also pass the Basic authentication to it.


Sample Request : 
http://localhost:1700/v1/user/2



Sample Response : 

{
    "id": 2,
    "first_name": "harshila",
    "last_name": "jagtap123",
    "username": "harshila.jagtap@gmail.com",
    "account_created": "2023-02-01T21:04:46.000Z",
    "account_updated": "2023-02-01T21:07:00.000Z"
}



--------------------------------------------------

## Product Endpoints

Important Points : 

--> SKU will be an unique value.
--> Acceptable Quantity value is from 0 to 100 only

1. /v1/Product

POST endpoint

this endpoint is to create a product by authenticated user only.
Pass the Basic Auth credentials.

Sample Request : 
http://localhost:1700/v1/Product

Sample Request Body : 
{
    "name": "Car",
    "description": "toyota Car",
    "sku": "vehicle",
    "manufacturer": "toyota",
    "quantity": 10
}


Sample Response : 

HTTP Response Code : 201 Created

{
    "id": 3,
    "name": "Car",
    "description": "toyota Car",
    "sku": "vehicle",
    "manufacturer": "toyota",
    "quantity": 10,
    "date_added": "2023-02-09T15:02:35.000Z",
    "date_last_updated": "2023-02-09T15:02:35.000Z",
    "owner_user_id": 2
}



--------------------------------------------------

2. /v1/Product/{productID}

PUT endpoint

this endpoint is to update a product by authorized user and one who created it  only.
Pass the Basic Auth credentials.

Sample Request : 
http://localhost:1700/v1/Product/3

Sample Request Body : 
{
    "name": "Car",
    "description": "Skoda Car",
    "sku": "vehicle1",
    "manufacturer": "toyota",
    "quantity": 10
}


Sample Response : 

HTTP Response Code : 204 No Content




--------------------------------------------------

3. /v1/Product/{productID}

PATCH endpoint

this endpoint is to update a product for specific fields by authorized user and one who created it  only.
Pass the Basic Auth credentials.

Sample Request : 
http://localhost:1700/v1/Product/3

Sample Request Body : 
{
    "name": "CarNew",
    "sku": "vehicle2"
}


Sample Response : 

HTTP Response Code : 204 No Content



--------------------------------------------------

4. /v1/Product/{productID}

GET endpoint

this endpoint is to fetch product details by providing the product ID.

Sample Request : 
http://localhost:1700/v1/Product/3

Sample Request Body : 
{}


Sample Response : 

HTTP Response Code : 200 OK

{
    "id": 3,
    "name": "CarNew",
    "description": "Skoda Car",
    "sku": "vehicle2",
    "manufacturer": "toyota",
    "quantity": 10,
    "date_added": "2023-02-09T15:02:35.000Z",
    "date_last_updated": "2023-02-09T15:13:09.000Z",
    "owner_user_id": 2
}

-----------------------------------------


5. /v1/Product/{productID}

Delete endpoint

this endpoint is to delete product details by providing the product ID.

Sample Request : 
http://localhost:1700/v1/Product/3

Sample Request Body : 
{}


Sample Response : 

HTTP Response Code : 204 No Content

-----------------------------------------
6. /v1/product/{productID}/image

Upload an image to AWS S3 by authorized user

Post endpoint


Sample Request : 
http://localhost:1700/v1/product/3/image

Sample Request Body : 
{
    file : string (binary)
    fileType : object
}


Sample Response : 

HTTP Response Code : 201 File Uploaded

{
  "image_id": 1,
  "product_id": 1,
  "file_name": "string",
  "date_created": "2016-08-29T09:12:33.001Z",
  "s3_bucket_path": "string"
}

-----------------------------------------

7. /v1/product/{productID}/image

GET endpoint

get list of all images uploaded to AWS S3

Sample Request : 
http://localhost:1700/v1/product/1/image

Sample Request Body : 
{}


Sample Response : 
[
  {
    "image_id": 1,
    "product_id": 1,
    "file_name": "string",
    "date_created": "2016-08-29T09:12:33.001Z",
    "s3_bucket_path": "string"
  }
]

HTTP Response Code : 200 OK

-----------------------------------------

8. /v1/Product/{productID}/image/{imageID}

GET endpoint

Get Image details

Sample Request : 
http://localhost:1700/v1/Product/1/image/1

Sample Request Body : 
{}


Sample Response : 
[
  {
    "image_id": 1,
    "product_id": 1,
    "file_name": "string",
    "date_created": "2016-08-29T09:12:33.001Z",
    "s3_bucket_path": "string"
  }
]

HTTP Response Code : 200 OK

-----------------------------------------

9. /v1/product/{productID}/image/{image_id}

Delete endpoint

delete the uploaded image from AWS S3

Sample Request : 
http://localhost:1700/v1/product/1/image/2

Sample Request Body : 
{}


Sample Response : 

HTTP Response Code : 204 No Content

-----------------------------------------


# Infrastructure Files in the repository

1. ami.pkr.hcl  -- 
--> Using Amazon Linux 2 as source image to create a custom AMI using Packer. This image is shared across the aws demo account as private image
--> Can deploy EC2 instances from the created AMI.
--> AMI builds should are set up to run in default VPC.

2. ami.pkvars.hcl -- parameters file to override the default values

3. customScript.sh -- setup the basic prerequisite for the base AMI image

4. web.service -- handle systemctl on autorun

----------------------------------------------

# .github Workflows

1. Build, create zip and copy the webapp artifacts to the right location

2. Validate the Packer

  --> packer init ami.pkr.hcl

  --> packer validate -var 'aws_access_key_id=${{ secrets.AWS_ACCESS_KEY_ID }}' -var 'aws_secret_access_key=${{ secrets.AWS_SECRET_ACCESS_KEY }}' --var-file=aws.pkvars.hcl ami.pkr.hcl


on merge Build the Packer Image

follow all previous commands with 

--> packer build -var 'aws_access_key_id=${{ secrets.AWS_ACCESS_KEY_ID }}' -var 'aws_secret_access_key=${{ secrets.AWS_SECRET_ACCESS_KEY }}' --var-file=aws.pkvars.hcl ami.pkr.hcl
