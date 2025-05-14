import express from "express";
import "dotenv/config"; 
import userRouter from "./routes/user.route.js";
import publicRouter from "./routes/public.route.js";
import jwt from 'jsonwebtoken';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));  


app.use(express.static("public"));


const authenticateToken = (req, res, next) => {//se obtiene el token de header
    const token = req.header('Authorization')?.replace('Bearer ', ''); //limpia el bearer
    if (!token) {
        return res.status(403).json({ ok: false, msg: "falta token" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ ok: false, msg: "token no válido " });//manejo de error
        }

        req.user = user;  //si es valido el token se adjunta la info de usuario a req.user(peticion)
        next(); 
    });
};

app.use("/", publicRouter);  // RUTA PUBLICA  SE PUEDE ACCEDER SIN AUTENTICACION
app.use("/api/v1/users", userRouter); 

const PORT = process.env.PORT || 3000;//configuracion de puerto
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
//INICIAR SERVIDOR ESCUCHANDO LAS SOLICITUDES