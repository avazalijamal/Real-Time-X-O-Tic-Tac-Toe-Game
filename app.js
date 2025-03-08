const PORT=3333;
const express=require('express');
const http=require("http");

const USERS=[];

//create app
const app=express();
const Server=http.Server(app);

//listener server
Server.listen(PORT,()=>{   
    console.log(`${PORT} portundan server acildi`); 
});

//socket start
const io=require('socket.io')(Server, {
    cors: {
      origin: "*",
      methods: ["*"]
    }
  });

//connect socket
io.on('connection',(socket)=>{


    if(USERS.length>0){

        let addStatus=true;

        for(let i in USERS){
            if(USERS[i].length<=1){
                USERS[i].push(socket.id);
                addStatus=false;

                if(USERS[i].length>1){
                    //reqibleri siteme tanidir
                    io.to(USERS[i][0]).emit("addUser",{"id":socket.id,"status":true});
                    io.to(socket.id).emit("addUser",{"id":USERS[i][0],"status":false});
                }

                break;
            }
        }

        //otaq sahibi
        if(addStatus){
            USERS.push([socket.id]);
        }


    }else{
        //otaq sahibi
        USERS.push([socket.id]);
    }

    //ozumu emmit edirem
    io.to(socket.id).emit("conn",{"id":socket.id,"msj":"new user"});

//disconnect socket
    socket.on('disconnect',()=>{
        
        for(let i in USERS){
            for(let j in USERS[i]){
                if(USERS[i][j]==socket.id){
                    USERS[i].splice(j,1);
                    break;
                }
            }
        }

        //sitemden kimse cixdiqda
        io.emit("disconn",{"id":socket.id,"msj":"remove user"});

    });

//atac event
    socket.on('atac',(data)=>{
        //emit atac
        io.to(data.userId).emit("atac",{"id":socket.id,"data":data});
    });

//game over event
    socket.on('gameover',(data)=>{
        //emit atac
        io.to(data.userId).emit("gameover",{"id":socket.id,"data":data});
    });

//no winner event
    socket.on('noWinner',(data)=>{
        //emit atac
        io.to(data.userId).emit("noWinner",{"id":socket.id,"data":data});
    });
//reload game
    socket.on('reload',(data)=>{
        //emit atac
        io.to(data.userId).emit("reload",{"id":socket.id,"data":data});
    });
//change user
    socket.on('changeUser',(data)=>{
        //emit atac
        io.to(data.userId).emit("changeUser",{"id":socket.id,"data":data});
    });
//set timer
    socket.on('setTimer',(data)=>{
        //emit atac
        io.to(data.userId).emit("setTimer",{"id":socket.id,"data":data});
    });
//stop timer
    socket.on('stopTimer',(data)=>{
        //emit atac
        io.to(data.userId).emit("stopTimer",{"id":socket.id,"data":data});
    });


});

//socket end

//static folder
app.use(express.static('public'))

//redirect static folder
    .use((req,res)=>{
        res.sendFile(`${__dirname}/public/index.html`);
    });