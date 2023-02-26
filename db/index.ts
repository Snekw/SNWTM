/* This is a database connection function*/
import mongoose from 'mongoose'

const connection = {
    isConnected: false
} /* creating connection object*/

async function dbConnect() {
    /* check if we have connection to our databse*/
    if (connection.isConnected) {
        return
    }

    /* connecting to our database */
    const con = process.env.MONGO_STR
    if (!con) {
        throw new Error('Missing connection string for mongo. Use MONGO_STR environment variable to provide it.')
    }
    const db = await mongoose.connect(con, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as mongoose.ConnectOptions)

    connection.isConnected = !!db.connections[0].readyState
}

export default dbConnect
