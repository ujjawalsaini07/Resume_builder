import multer from "multer";

// diskStorage needs a destination/filename to actually write the file - since we
// just forward the buffer straight to imagekit, memoryStorage is what we actually want
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
