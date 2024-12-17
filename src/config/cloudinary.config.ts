// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: "dbgrq28js",
//   api_key: "173484379744282",
//   api_secret: "eHKsVTxIOLl5oaO_BHxBQWAK3GA",
// });

// export const cloudinaryUpload = cloudinary;

import { v2 as cloudinary } from "cloudinary";
import config from ".";

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

export const cloudinaryUpload = cloudinary;
