window.onload = () =>{
    "use strict";
    const csInterface = new CSInterface();
    themeManager.init();
    
    const AIURL = "http://localhost:3000/";
    const http = require("http");
    const url = require("url");
    
    const extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) +`/jsx/`;
    csInterface.evalScript(`$.evalFile("${extensionRoot}json2.js")`);//json2読み込み
    
    const toAI = document.getElementById("toAI");
    //送信用オブジェクト
    const obj = {
        "greed":"Hello",
        "owner":"fromPS"
    }
    
    const server = http.createServer((request,response)=>{
        const url_parts = url.parse(request.url);
        switch(url_parts.pathname){ 
            case "/":
            if(request.method == "GET"){
                    response.writeHead(200,{"Content-Type":"text/plain"});
                    response.write("Photoshop server is running");
                    response.end();
            }else if(request.method == "POST"){//ポスト送信を受け取ったら内容を読み込む
                let body = "";
                request.on("data",chunk=>{
                    body += chunk;
                });
                request.on("end",answer=>{
                    answer = JSON.parse(body);
                    callFromJsx(answer);
                    response.end();
                });
            }else{
                alert("error");
            }
        
            default:
                response.writeHead(200,{"Content-Type":"text/plain"});
                response.end("no page...");
                break;
            }
    });
    
    server.listen(8000);//サーバーを立ち上げる
    
    function callFromJsx(obj){
        csInterface.evalScript(`sayHello(${JSON.stringify(obj)})`);
    }
    
    toAI.addEventListener("click",()=>{
        fetch(AIURL,{
            method:"POST",
            body:JSON.stringify(obj),
            headers:{"Content-type":"application/json"}
        })
        .then(res => console.log(res))
        .catch(error => alert(error));
    });
    
}
    
