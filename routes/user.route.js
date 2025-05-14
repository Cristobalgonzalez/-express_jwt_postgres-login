import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";

const router=Router()

router.post("/register",UserController.register)
router.post("/login",UserController.login)
router.get("/profile", verifyToken, UserController.profile)////ruta protegida con verify token O PRIVADA?
//la función profile en UserController se ejecuta para mostrar perfil, es lo que proteje



//FALTA IMPLEMENTAR ESTA RUTA POR QUE HICE PRIMERO EL REGISTER EN VEZ DE PUT
//router.put("/update", verifyToken, UserController.updateProfile);





export default router; 