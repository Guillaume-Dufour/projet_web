const fs = require('fs')
const bucket = gc.bucket('projet_web_charcuterie_dufour_guillaume') // should be your bucket name

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

module.exports = {
    uploadImage : (file) =>  {
        const { originalname, buffer } = file

        const blob = bucket.file(file.name)
        const publicUrl = 'https://storage.googleapis.com/'+bucket.name+'/'+blob.name
        const blobStream = fs.createWriteStream(publicUrl)
        blob.pipe(blobStream);
        /*blobStream.on('finish', () => {
            const publicUrl = 'https://storage.googleapis.com/'+bucket.name+'/'+blob.name
            resolve(publicUrl)
        })
            .on('error', () => {
                reject(`Unable to upload image, something went wrong`)
            })
            .end(buffer)*/
    }
}