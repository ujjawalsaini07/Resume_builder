import multer from "multer";

const storage = multer.diskStorage({

  // we are using imagekit for image storage so we dont need to specify destination for multer
  // it also provides us with the file buffer which we can directly upload to imagekit without saving it to disk

});

const upload = multer({ storage });

export default upload;
