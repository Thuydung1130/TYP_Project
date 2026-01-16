import multer from "multer";
// import path from "path";

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "sandbox/"); // lưu vào thư mục sandbox
//     },
//     filename: function (req, file, cb) {
//         cb(null, "Main.cpp"); // FE gửi file nào cũng save thành Main.cpp
//     }
// });

// const upload = multer({ storage: storage });

const upload = multer({
  storage: multer.memoryStorage()
});

export default upload;
