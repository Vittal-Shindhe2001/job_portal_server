const mongoose = require('mongoose')

const configDb = async () => {
    try {
        const db = await mongoose.connect('mongodb://localhost:27017/job_portal')
        if (db) {
            console.log('DataBase connected successfully');
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports=configDb