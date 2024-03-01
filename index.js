const express = require('express')
const cors = require('cors')
const Port = 3096
const app = express()
const configDb=require('./config/db')
const routers=require('./config/routes')
const fs = require('fs');

app.use(express.json())
app.use(cors())
configDb()
app.use(routers)

const uploadFolder = 'uploads/';
// Check if the directory exists, if not, create it
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
    console.log('Uploads folder created successfully');
} else {
    console.log('Uploads folder already exists');
}
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'))

app.listen(Port, () => {
    console.log(`server running on http://localhost:${Port}`);
})