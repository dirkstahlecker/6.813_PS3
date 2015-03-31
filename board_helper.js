//function retrieved from http://jquery-howto.blogspot.com/2009/09/get-url-parameters-values-with-jquery.html
// Read a page's GET URL variables and return them as an associative array.
function getUrlVars(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function drawBoard() {
    var defaultBoardSize = 8;

    var params = getUrlVars();
    var size = params['size'];

    if (size == undefined) {
        n = defaultBoardSize;
    }
    else {
        var n = parseInt(size);
    }
    
    var sidelen = 400 / n;

    //canvas operations
    var canvas = document.getElementById('mainCanvas');
    var context = canvas.getContext('2d');



    var bool = 1;
    var color = 'gray';
    for (var i = 0; i < n; i++) {
       if (color == 'white') {
                color = 'gray';
            }
            else {
                color = 'white';
            }
        for (var j = 0; j < n; j++) {
            context.beginPath();
            context.rect(i * sidelen, j * sidelen, sidelen, sidelen);
            context.fillStyle = color;
            context.fill();

            if (color == 'white') {
                color = 'gray';
            }
            else {
                color = 'white';
            }
        }
    }
}

$(document).ready(function () {
    drawBoard();

    preloadImages();

    //drag and drop
    document.onmousedown = mouseDown;
    document.onmouseup = mouseUp;
    document.onmousemove = mouseMove;
});

function preloadImages() {
    redImg = new Image();
    redImg.src = 'graphics/red-piece.png';

    blackImg = new Image();
    blackImg.src = 'graphics/black-piece.png';

    redKing = new Image();
    redKing.src = 'graphics/red-king.png';

    blackKing = new Image();
    blackKing.src = 'graphics/black-king.png';
}

var draggingChecker = null; //holds checker being dragged, or null
var checkerPrevPos = null; //holds pos of checker being dragged
var redImg;
var blackImg;
var redKing;
var blackKing;

//uses absolute positioned div and guaranteed 400px board size
//154,10 is origin for board
function insideBoard(x,y) {
    if (x >= 154 && x <= 554) {
        board.size;
        return x / board.size;
    }
    else {
        return -1;
    }
}

//changes absolute coordinates to coordinates within the board
function convertCoords(x,y) {
    var sidelen = 400 / board.size();

    x = x - 154 - sidelen / 2;
    y = y - 10 - sidelen / 2;
    return [x,y];
}

function mouseDown(e) {
    var canvas = document.getElementById('mainCanvas');
    var context = canvas.getContext('2d');
    var sidelen = 400 / board.size();

    if (insideBoard(e.clientX, e.clientY) != -1) {

        var c = Math.floor((e.clientX - 154) / (400 / board.size()));
        var r = Math.floor((e.clientY - 10) / (400 / board.size()));

        console.log(r + ', ' + c);

        var checker = board.getCheckerAt(r,c);
        console.log(checker);
        if (checker != null) {
            draggingChecker = checker;
            checkerPrevPos = [checker.col,checker.row];

            context.beginPath();
            context.rect(checkerPrevPos[0] * sidelen, checkerPrevPos[1] * sidelen, sidelen, sidelen);
            context.fillStyle = 'gray';
            context.fill();
        }
    }
}
function mouseUp(e) {
    console.log('MOUSE UP');

    var canvas = document.getElementById('mainCanvas');
    var context = canvas.getContext('2d');

    var dragCanvas = document.getElementById('dragCanvas');
    var dragContext = dragCanvas.getContext('2d');

    dragContext.clearRect(0,0,400,400);

    var sidelen = 400 / board.size();

    var x = convertCoords(e.clientX, e.clientY)[0];
    var y = convertCoords(e.clientX, e.clientY)[1];

    var c = Math.floor((e.clientX - 154) / (400 / board.size()));
    var r = Math.floor((e.clientY - 10) / (400 / board.size()));

    if (board.getCheckerAt(r,c) != null || x > 400 || y> 400) { //illegal, put back
        var img = new Image();
        if (checker.color == 'red') {
            if (checker.isKing) {
                img.src = 'graphics/red-king.png'
            }
            else {
                img.src = 'graphics/red-piece.png';
            }
        }
        else {
            if (checker.isKing) {
                img.src = 'graphics/black-king.png';
            }
            else {
                img.src = 'graphics/black-piece.png';
            }
        }
        context.drawImage(img, checkerPrevPos[0] * sidelen, checkerPrevPos[1] * sidelen, sidelen, sidelen);

    }
    else { //legal
        board.moveTo(draggingChecker,r,c);
    }
    draggingChecker = null;
}
function mouseMove(e) {
    var x = e.clientX;
    var y = e.clientY;

    if (draggingChecker) {
        moveChecker(draggingChecker,convertCoords(x,y));
    }
}

function moveChecker(checker,coords) {
    var dragCanvas = document.getElementById('dragCanvas');
    var dragContext = dragCanvas.getContext('2d');

    var x = coords[0];
    var y = coords[1];

    var img;
    if (checker.color == 'red') {
        if (checker.isKing) {
            img = redKing;
        }
        else {
            img = redImg;
        }
    }
    else {
        if (checker.isKing) {
            img = blackKing;
        }
        else {
            img = blackImg;
        }
    }

    dragContext.clearRect(0,0,400,400);
    dragContext.drawImage(img, x, y); //TODO: add in width and height
    



/*
        //draw over old piece
        context.beginPath();
        context.rect(e.details.fromCol * sidelen, e.details.fromRow * sidelen, sidelen, sidelen);
        context.fillStyle = 'gray';
        context.fill();

        drawArrow(e.details.fromCol, e.details.fromRow, e.details.toCol, e.details.toRow, sidelen);
*/
    
}


