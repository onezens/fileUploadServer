/**
 * Created by wz on 2017/12/1.
 */
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;
const fileDir = path.join(__dirname, 'files');

// default options
app.use(fileUpload());




app.get('/upload', function (req, res) {

    let data = fs.readFileSync(path.join(__dirname, 'html', 'upload.html'));
    res.end(data.toString());
});


app.post('/upload', function(req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;

    let fileName = sampleFile.name;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(path.join(fileDir, fileName), function(err) {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });
});

function createDir() {

    if(!fs.existsSync(fileDir)){
        fs.mkdirSync(fileDir);
    }
}



//start server
app.listen(port, (err)=>{
    if(!err){
        console.log('file upload server start success. http://localhost:' + port);
        createDir();
    }
});