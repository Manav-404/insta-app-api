const AWS = require('aws-sdk')
const uploadImage  = (photo,extension, name)=>{
    return new Promise((resolve, reject)=>{
        let S3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_ACCESS_SECRET
        })
    
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${name}.${extension}`,
            Body: photo
        };
    
        S3.upload(params, function(err, data) {
            if (err) {
                reject(err)
            }
            console.log(`File uploaded successfully. ${data.Location}`);
    
           resolve(data.Location)
        });
    
    })
}

module.exports = uploadImage