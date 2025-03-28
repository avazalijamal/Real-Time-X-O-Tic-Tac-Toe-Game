$(document).ready(function(){

    /*

    scoreX
    timer
    scoreO
    game
    mjs

    */

    //game conf

    const loadID="#load";
    const userXID="#userX";
    const scoreXID="#scoreX";
    const userOID="#userO";
    const scoreOID="#scoreO";
    const timerID="#timer";
    const gameID="#game div";
    const msjID="#msj";

    const atacCls="atac";
    
    const _MSG_={
        "err":{"msj":"Bos xana ya click edin","cls":"error"},
        "ques":{"msj":"Oyun bitib. Yeniden oynamaq isdeyirsinizmi?","cls":"warning"},
        "win":{"msj":"Oyun bitdi uduzan: ","cls":"success"},
        "tie":{"msj":"Oyun Bitd: Dostluq qazandi :)","cls":"warning"}
    };

    var status=true;
    var scoreX=0;
    var scoreO=0;
    const _x_="X";
    const _o_="O";
    const empt="";
    var pointer=_x_;
    const timer=10;
    var interval;

    const winsSchema=[
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    //start game

    $(scoreXID).text(scoreX);
    $(scoreOID).text(scoreO);
    $(msjID).hide();


//run game
    clearGame();
    changeUser();
    startTimer();


//running game
    setTimeout(function(){

        $(loadID).hide();

    },1000);

//click box event
    $(gameID).click(function(){

        if(status){
            if($(this).text()==empt){

                writeBox(this);
                gameControl();
                boxControl();
                changeUser();
                stopTimer();
                startTimer();

            }else{
                mesajGame(_MSG_.err);
            }
        }else{
                let s=confirm(_MSG_.ques.msj);
                
                if(s){
                    clearGame();
                }
        }

    });


    //write box
    function writeBox(dom){

        $(dom).text(pointer);
        changePointer();

    }

    //change pointer
    function changePointer(){
        pointer=(pointer==_x_)?_o_:_x_;
    }

    //clear game

    function clearGame(){
        status=true;
        $(gameID).text(empt);

    }

    //mesaj game
    function mesajGame(M,t=1){

        $(msjID).text(M.msj);
        $(msjID).addClass(M.cls);
        $(msjID).show();
        
        setTimeout(function(){
            $(msjID).hide();
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

    function winner(){
        if(pointer==_x_){
            $(scoreOID).text(++scoreO);
        }else{
            $(scoreXID).text(++scoreX);
        }

        _MSG_.win.msj+=pointer;
        mesajGame(_MSG_.win,2);
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
                mesajGame(_MSG_.tie);
           }
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

    let t=timer;
    $(timerID).text(t);

    interval=setInterval(function(){
        if(t>0){
            $(timerID).text(--t);
        }else{
            stopTimer();
            changePointer();
            changeUser();
            startTimer();
        }

    },1000);

}

//stop timer
function stopTimer(){
    clearInterval(interval);
}

});