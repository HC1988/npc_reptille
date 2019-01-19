/**
 * Created by phpStorm
 * author      : linwang5@iflytek.com
 * createTime  : 2018/2/8 15:10
 * description :
 */
const http = require('http');
const https = require('https')
const fs = require('fs');
const cheerio = require('cheerio')
let count = 0
let strHtml = ''


function __uuid (orglen) {
    let len = orglen || 32
    let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678' // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
    let maxPos = $chars.length
    let pwd = ''
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return pwd.toLowerCase()
}





function saveImage(imgUrl) {
    http.get(imgUrl,function (res) {
        res.setEncoding('binary');
        let imageData = '';
        
        res.on('data',function (chunk) {
            imageData += chunk;
        }).on('end',function () {
            if(!fs.existsSync('./images')){
                fs.mkdirSync('./images')
            }
            fs.writeFile('./images/' + __uuid(10) + '.png',imageData,'binary',function (err) {
                if(err) console.error(err);
                else {
                    count++;
                    console.log('SAVE SUCCESS  ',count);
                }
            })
        }).on('error',function (e) {
            console.error(e);
        })
    })
}

function reptille (address){

    strHtml = ''
    count = 0
    let request
    if(address.indexOf('https')==0){
        request = https
    }else if(address.indexOf('http')==0){
        request = http
    }else {
        console.log('bad address')
        return
    }
    request.get(address,function (res) {
        res.on('data',function (chunk) {
            strHtml += chunk
        }).on('end',function () {
            // console.log(strHtml)
            let $ = cheerio.load(strHtml)
            let images = $('img')
            for(let i =0,len = images.length;i<len;i++){
                try {
                    saveImage(images[i].attribs['src'])
                }catch (e){}
    
                try {
                    saveImage('https:'+images[i].attribs['src'])
                }catch (e){}
    
                try {
                    saveImage('http:'+images[i].attribs['src'])
                }catch (e){}
    
            }
            
        })
    })
}

module.exports = reptille