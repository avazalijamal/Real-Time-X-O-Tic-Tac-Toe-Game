

$(document).ready(function(){

    localStorage.clear();
    
//game conf
var interval;
var status=true;
var statusAtac=false;
var scoreX=0;
var scoreO=0;
const _x_="X";
const _o_="O";
const empt="";
var pointer=_x_;
const timer=10;

const winsSchema=[
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

const loadID="#load";
const userXID="#userX";
const scoreXID="#scoreX";
const userOID="#userO";
const scoreOID="#scoreO";
const timerID="#timer";
const gameID="#game div";
const msjID="#msj";

const atacCls="atac";
const imCls="im";

const _MSG_={
    "err":{"msj":"Bos xana ya click edin","cls":"error"},
    "ques":{"msj":"Oyun bitib. Yeniden oynamaq isdeyirsinizmi?","cls":"warning"},
    "win":{"msj":"Oyun bitdi uduzan: ","cls":"success"},
    "tie":{"msj":"Oyun Bitd: Dostluq qazandi :)","cls":"warning"}
};


//socket connection start


const baseUrl="http://localhost:3333/online";
const url="http://localhost:3333";
const socket=io.connect(url);

socket.on("conn",function(data){
    //connection socket
    localStorage.setItem("user1",data.id);
    localStorage.setItem("pointer",pointer);
   
})
.on("addUser",function(data){
    
    localStorage.setItem("user2",data.id);
    
    if(localStorage.user2){
        statusAtac=data.status;
        
        changeUser();
        pointer=(statusAtac)?_x_:_o_;
        localStorage.setItem("pointer",pointer);

        if(statusAtac){ 
            
            startTimer();
        }

        Run();
    }

})
.on("disconn",function(data){
    //connection socket
    let id=data.id;
    
    if(localStorage.user2==id){
        localStorage.removeItem("user2");
        window.open(baseUrl,"_parent");
    }

})
.on("atac",function(data){
    //connection socket
    
    writeBox(`#${data.data.dom}`,data.data.pointer);
    statusAtac=data.data.status; 

})
.on("gameover",function(data){
    //connection socket

    if(localStorage.pointer==_x_){
        clearInterval(interval);
    }

    status=false;
    pointer=data.data.pointer;
    winner(true);
    
})
.on("noWinner",function(data){
    //connection socket
    
    if(localStorage.pointer==_x_){
        clearInterval(interval);
    }

    status=false;
    mesajGame(data.data.msj);
    
})
.on("reload",function(data){
    //connection socket
    
   clearGame();

   if(localStorage.pointer==_x_){
    startTimer();
    }

})
.on("changeUser",function(data){
    //connection socket
    
   changeUser();

})
.on("setTimer",function(data){
    //connection socket
    
//    changeUser();
    $(timerID).text(data.data.timer);

    if(data.data.timer==0){
        statusAtac=!statusAtac; 

        pointer=(statusAtac)?_o_:_x_;

        if(!statusAtac){
            $(userOID).removeClass(atacCls);
            $(userXID).addClass(atacCls);
        }else{
            $(userXID).removeClass(atacCls);
            $(userOID).addClass(atacCls);
        }


    }

}).on("stopTimer",function(data){
    //connection socket
    
    // clearInterval(interval);
    
    if(status){
        if(localStorage.pointer==_x_){
            startTimer();
        }
    }

});

//socket atac
function socketEmmit(event,data){
    socket.emit(event,data);
}


//socket connection end




function Run(){
    //start game
    $(scoreXID).text(scoreX);
    $(scoreOID).text(scoreO);
    $(msjID).hide();


    //run game
    clearGame(false);
    setUser();
    // changeUser();
  

    //running game
    setTimeout(function(){

        $(loadID).hide();

    },1000);

}



//click box event
    $(gameID).click(function(){

        if(statusAtac){
            
            if(status){
                if($(this).text()==empt){
                    
                    socketEmmit("atac",{
                        "userId":localStorage.user2,
                        "dom":$(this).attr("id"),
                        "status":statusAtac,
                        "pointer":pointer
                    });

                    statusAtac=false;
                    
                    writeBox(this);
                    gameControl();
                    boxControl();
                    changeUser();

                    socketEmmit("changeUser",{
                        "userId":localStorage.user2
                    });



                    if(status){
                        if(localStorage.pointer==_x_){
                            startTimer();
                        }else{
                            socketEmmit("stopTimer",{
                                "userId":localStorage.user2
                            });
                        }
                    }
                   
                    
                }else{
                    mesajGame(_MSG_.err);
                }
            }else{
                let s=confirm(_MSG_.ques.msj);
                
                if(s){
                    clearGame();
                    socketEmmit("reload",{
                        "userId":localStorage.user2
                    });

                    if(localStorage.pointer==_x_){
                        startTimer();
                    }

                }
            }

        }
    });


//write box
    function writeBox(dom,point){
        
        pointer=point || pointer;

        $(dom).text(pointer);
        changePointer();

    }

//change pointer
    function changePointer(){
        pointer=(pointer==_x_)?_o_:_x_;
    }

//clear game
    function clearGame(reload=true){
        
        if(reload){
            statusAtac=(localStorage.pointer==pointer)?true:false;
        }

        status=true;
        $(gameID).text(empt);

        _MSG_.win.msj="Oyun bitdi uduzan: ";
        
    }

//mesaj game
    function mesajGame(M,t=1){

        $(msjID).text(M.msj);
        $(msjID).addClass(M.cls);
        $(msjID).show();
        
        setTimeout(function(){
            $(msjID).hide();
            $(msjID).removeClass(M.cls);
        },t*1000);


    }
    

//game control
    function gameControl(){

        for(let i of winsSchema){

            let a=$($(gameID)[i[0]]).text();
            let b=$($(gameID)[i[1]]).text();
            let c=$($(gameID)[i[2]]).text();

            if(a!=empt && b!=empt && c!=empt){
                if(a==b && b==c && c==b) {
                    status=false;
                    winner();
                }
            }

        }

    }

//winner game
    function winner(statusMe){

        if(pointer==_x_){
            $(scoreOID).text(++scoreO);
        }else{
            $(scoreXID).text(++scoreX);
        }
        
        _MSG_.win.msj+=pointer;

        mesajGame(_MSG_.win,2);

        if(!statusMe){
            statusAtac=true;

            if(localStorage.pointer==_x_){
                clearInterval(interval);
            }

            socketEmmit("gameover",{
                "userId":localStorage.user2,
                "pointer":pointer
            });
        }


    }

//boxs control
    function boxControl(){

        if(status){
            const DOM=$(gameID);

            let count=DOM.length;
    
            for(let d of DOM){
                
                if($(d).text()!=empt){
                    count--;
                }
    
            }
    
           if(count<=0){
                status=false;
                statusAtac=true;
                mesajGame(_MSG_.tie);

                if(localStorage.pointer==_x_){
                    clearInterval(interval);
                }

                socketEmmit("noWinner",{
                    "userId":localStorage.user2,
                    "msj":_MSG_.tie
                });

           }
        }

    }

//set user 
    function setUser(){
        
        
        if(localStorage.pointer==_x_){
            $(userXID).addClass(imCls);
        }else{
           
            $(userOID).addClass(imCls);
        }
    
    }

//change user
    function changeUser(){
        
        
        if(pointer==_x_){
            $(userOID).removeClass(atacCls);
            $(userXID).addClass(atacCls);
        }else{
            $(userXID).removeClass(atacCls);
            $(userOID).addClass(atacCls);
        }
    
    }

//start timer
    function startTimer(){

        clearInterval(interval);
        
        let t=timer;
        $(timerID).text(t);

        interval=setInterval(function(){
    
            $(timerID).text(--t);
            socketEmmit("setTimer",{
                "userId":localStorage.user2,
                "timer":t
            });

            if(t<=0){

                startTimer();

                statusAtac=!statusAtac;
                changePointer();
                changeUser();
                
            }

        },1000);
        
    }



});