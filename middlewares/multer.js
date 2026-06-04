import multer from "multer"         //This middleware used to handle file uploads

const storage = multer.memoryStorage()      // file stored in memory(RAM) i.e temporary ; not in disc 
export const singleUpload = multer({storage}).single("file")    //Only take one file