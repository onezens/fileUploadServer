/**
 * Created by wz on 2017/12/1.
 */
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');
const url=require("url");

const app = express();
const port = 3004;
const fileDir = path.join(__dirname, 'files');



// default options
app.use(fileUpload());

app.use(function (req, res,next) {

    console.log('request----');
    next();

});


app.get('/upload', function (req, res) {

    let data = fs.readFileSync(path.join(__dirname, 'html', 'upload.html'));
    res.end(data.toString());
});

app.get('/upload/stream', function (req, res) {

    let data = fs.readFileSync(path.join(__dirname, 'html', 'upload1.html'));
    res.end(data.toString());
});

app.post('/upload', function(req, res) {
    if (!req.files)
        return res.status(400).send({status:1, msg:'No files were uploaded.'});

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;

    let fileName = sampleFile.name;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(path.join(fileDir, fileName), function(err) {
        if (err)
            return res.status(500).send(err);

        res.status(200).send({status:0, msg:'success'});
    });
});

app.post('/upload/stream', function (req, res) {
    console.log('accept upload stream');
    startParse(req,res);
});

app.get('/file/stream', function (req, res) {
    let obj=url.parse(req.url,true);
    console.log(obj);
    let path="."+obj.path;
    // 创建文件的读取流
    let readStram=fs.createReadStream(path);
    readStram.pipe(res);
});




function createDir() {

    if(!fs.existsSync(fileDir)){
        fs.mkdirSync(fileDir);
    }
}


// 创建函数，完成form表单数据解析
function startParse(req,res) {
    // 创建formidable对象解析文件数据
    let form=new formidable.IncomingForm();
    form.encoding = "utf-8";//设置form表单中文本数据的编码格式
    form.uploadDir="./files";//设置文件存储路径
    form.keepExtensions = false;//设置文件上传时保持文件的路径
    // 开始解析form表单数据
    form.parse(req,function (err,fields,files) {
        if(files.file){
            // 获取上传图片的路径
            let path="http://localhost:"+ port + "/" + files.file.path;
            // 将路径返回给前端页面
            res.write(JSON.stringify({status:0, path:path}));
            res.end();
        }else{
            return res.status(500).send(err);
        }
    });
}



//start server
app.listen(port, (err)=>{
    if(!err){
        console.log('file upload server start success. http://localhost:' + port);
        createDir();
    }
});