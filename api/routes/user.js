import express from "express";
import { register,login,upload,getUserbyId,logout,uploadByLink} from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";
import multer from "multer";

const photoMiddleware = multer({ dest: "uploads/" });

const router=express.Router();

router.post("/new",register);

router.post("/login",login);

router.get("/logout",logout);

router.get("/getuser",isAuthenticated,getUserbyId);

router.post("/upload-by-link",isAuthenticated,uploadByLink);

router.post("/upload",isAuthenticated,photoMiddleware.array('photos',100),upload);

export default router;