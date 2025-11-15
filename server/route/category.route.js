//#3 00:53:00

import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  AddCategoryController,
  deleteCategoryController,
  getCategoryController,
  updateCategoryController,
} from "../controllers/category.controller.js";

const categoryRouter = Router();

//added auth to able login user to use this api or not
categoryRouter.post("/add-category", auth, AddCategoryController);
categoryRouter.get("/get", getCategoryController); //#3 01:32:27    //(get) is the method and conrollername
categoryRouter.put("/update", auth, updateCategoryController);//auth to allow any user to update any fld
categoryRouter.delete("/delete",auth,deleteCategoryController)  //# 2:35:00

export default categoryRouter;
