import bcryptjs from "bcryptjs";
import { UserModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";

// register

//obtencion de datos del body
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;//validacion de datos faltantes
        if (!username || !email || !password) {
            return res.status(400).json({
                ok: false,
                msg: "Faltan uno de los siguientes campos: email, password, username"
            });
        }

        const user = await UserModel.findOneByEmail(email);//verificacion si existe el email
        if (user) {
            return res.status(409).json({
                ok: false,
                msg: "El email ya existe"
            });
        }

        const salt = await bcryptjs.genSalt(10);// se genera el salto agregando hash aleatorio
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = await UserModel.create({//nuevo usuario
            email,
            password: hashedPassword,
            username
        });

        const token = jwt.sign(//ACA SE GENERA EL TOKEN LE PUSE EXPIRACION EN 1 HORA
            { email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({//ACA SE DEVUELVE EL TOKEN  SI ESTA TODO CORRECTO
            ok: true,
            msg: token
        });

    } catch (error) {//manejo de error
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: "error de servidor"
        });
    }
};

// "/api/v1/users/login"


//SE MANEJA LA MISMA LOGICA DE REGISTER :
//validacion de contraseña,obtencion de datos del body,verificacion si existe usuario ,manejo de error ,etc..
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                ok: false,
                msg: "faltan los siguientes campos: email, password"
            });
        }

        const user = await UserModel.findOneByEmail(email);
        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: "usuario no encontrado"
            });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                ok: false,
                msg: "credenciales invalidas"
            });
        }

        const token = jwt.sign(//generacion de token
            { email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            ok: true,
            msg: token
        });

    } catch (error) {//manejo de error
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: "error de servidor"
        });
    }
};

const profile = async (req, res) => {//SE OBTIENE EL PERFIL  A TRAVEZ DE EMAIL

    try {
        const user = await UserModel.findOneByEmail(req.email)
        return res.json({ ok: true, msg: user })//respuesta

    } catch (error) {
        console.error(error);//manejo de error
        return res.status(500).json({
            ok: false,
            msg: "error de servidor"
        });
    }
}

export const UserController = {//ACA SE EXPORTAN LAS FUNCIONES PARA UTILIZARSE EN LAS RUTAS API
    register,
    login,
    profile
};
