import { Router } from "express";
import auth from "../middleware/auth.js"; //add .js otherwise server will show crash
import {
  AddSubCategoryController,
  deleteSubCategoryController,
  getSubCategoryController,
  updateSubCategoryController,
} from "../controllers/subCategory.controller.js";

const subCategoryRouter = Router();

//endpoints
subCategoryRouter.post("/create", auth, AddSubCategoryController);
subCategoryRouter.post("/get", getSubCategoryController); //#3 4:45:50  ...post coz i want to add pagination also no auth zoz this is anonymouse for users to browse
subCategoryRouter.put("/update", auth, updateSubCategoryController); //#3 5:42:23
subCategoryRouter.delete("/delete", auth, deleteSubCategoryController);

export default subCategoryRouter;
