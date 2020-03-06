const GoogleCloudStorage = require('@google-cloud/storage@2.0.0');
const path = require('path')

const GOOGLE_CLOUD_PROJECT_ID = 'gleaming-realm-270117'; // Replace with your project ID
const GOOGLE_CLOUD_KEYFILE = path.join(__dirname, './keys.json'); // Replace with the path to the downloaded private key



const storage = GoogleCloudStorage({
    projectId: GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: GOOGLE_CLOUD_KEYFILE,
});

exports.getPublicUrl = (bucketName, fileName) => `https://storage.googleapis.com/${bucketName}/${fileName}`;

exports.copyFileToGCS = (localFilePath, bucketName, options) => {
    options = options || {};
    const bucket = storage.bucket(bucketName);
    const fileName = path.basename(localFilePath);
    const file = bucket.file(fileName);
    return bucket.upload(localFilePath, options)
        .then(() => file.makePublic())
        .then(() => exports.getPublicUrl(bucketName, gcsName));
};