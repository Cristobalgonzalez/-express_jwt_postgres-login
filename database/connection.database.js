import 'dotenv/config'
import pg from 'pg'

const{Pool}= pg //nueva instancia pool
const connectionString = process.env.DATABASE_URL
export const db=new Pool({
    allowExitOnIdle:true,
    connectionString
})

try {
    await db.query('SELECT NOW()')
    console.log('DATABASE CONECTADA')//consulta simple para verificar bd conectada
    } catch (error) {
    console.log(error)   
}