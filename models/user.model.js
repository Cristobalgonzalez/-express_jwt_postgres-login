import { db } from '../database/connection.database.js'


//ACA SE DEFINE CONSULTA SQL PARAMETRIZADA PARA EVITAR  INYECCIONESSS

export const create = async ({ email, password, username }) => {
    const query = {
        text: `
        INSERT INTO users (email, password, username)
        VALUES ($1, $2, $3)
        RETURNING email, username, uid
        `,
        values: [email, password, username]
    }

    const { rows } = await db.query(query)//pool de conneciones
    return rows[0]//primer resultado
}

const findOneByEmail = async (email) => {
    const query = {
        text: `
        SELECT * FROM users
        WHERE email = $1
        `,
        values: [email]
    }

    const { rows } = await db.query(query)
    return rows[0]
}
//SE EXPORTA EL OBJETO USERMODEL CON LAS FUNCIONES DE ACCESO A DATOS
export const UserModel = {
    create,
    findOneByEmail
}
