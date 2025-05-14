import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {//MIDDLEWARE verifyToken
    let token = req.headers.authorization

    if (!token) {
        return res.status(401).json({ error: "no se ingresó token" });
    }
    token = token.split(" ")[1]//con esto se limpia el token de bearer

    try {
        const { email } = jwt.verify(token, process.env.JWT_SECRET)//manejo de errores si falta token
        console.log(email)
        req.email = email
        next()
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: "token inválido" });
    }
}