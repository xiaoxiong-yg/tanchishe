var startbtn = document.getElementsByClassName('startbtn')[0];
var pausebtn = document.getElementsByClassName('pausebtn')[0];
var snkwapper = document.getElementsByClassName('snkwapper')[0];
var sw = 20,
    sh = 20,
    tr = 30,
    td = 30;
var snake = null,
    game = null,
    food = null,
    haseat = false,
    flag = true,
    speed = 300;
function Square(x, y, classname) {
    this.x = x;
    this.y = y;
    this.classname = classname;
    this.div = document.createElement('div');
    this.parent = snkwapper;
}
Square.prototype.createdom = function () {
    this.div.style.width = sw + 'px';
    this.div.style.height = sh + 'px';
    this.div.className = this.classname;
    this.div.style.position = 'absolute';
    this.div.style.left = this.x * 20 + 'px';
    this.div.style.top = this.y * 20 + 'px';
    this.parent.appendChild(this.div)
}
Square.prototype.removedom = function () {
    this.parent.removeChild(this.div)
}
function Snake() {
    this.head = null;
    this.tail = null;
    this.pos = [];
    this.directionnum = {
        left: {
            x: -1,
            y: 0
        },
        right: {
            x: 1,
            y: 0
        },
        up: {
            x: 0,
            y: -1
        },
        down: {
            x: 0,
            y: 1
        }
    };
    this.direction = this.directionnum.right;
}
Snake.prototype.init = function () {
    var snkhead = new Square(2, 0, 'snkhead');
    snkhead.createdom()
    this.head = snkhead;
    this.pos.push([2, 0]);
    var snkbody1 = new Square(1, 0, 'snkbody');
    snkbody1.createdom();
    this.pos.push([1, 0]);
    var snkbody2 = new Square(0, 0, 'snkbody');
    snkbody2.createdom();
    this.tail = snkbody2;
    this.pos.push([0, 0]);
    snkhead.last = null;
    snkhead.next = snkbody1;
    snkbody1.last = snkhead;
    snkbody1.next = snkbody2;
    snkbody2.last = snkbody1;
    snkbody2.next = null;
}
Snake.prototype.next = function () {
    var This = this;
    var nextpos = [This.head.x + This.direction.x, This.head.y +    This.direction.y];
    This.pos.forEach(function (item) {
        if (item[0] == nextpos[0] && item[1] == nextpos[1]) {
            This.handle.die.call(This)
            return
        }
    });
    if (nextpos[0] > tr - 1 || nextpos[0] < 0 || nextpos[1] > td - 1 || nextpos[1] < 0) {
        This.handle.die.call(This)
        return
    }
    if (food && nextpos[0] == food.x && nextpos[1] == food.y) {
        This.handle.eat.call(This)
        return
    }
    This.handle.move.call(This, nextpos)
}
Snake.prototype.handle = {
    move: function (nextpos) {
        var newbody = new Square(this.head.x, this.head.y, 'snkbody');
        newbody.next = this.head.next;
        this.head.next.last = newbody;
        newbody.last = null;
        this.head.removedom();
        newbody.createdom();
        var newhead = new Square(nextpos[0], nextpos[1], 'snkhead');
        newhead.createdom();
        newhead.last = null;
        newhead.next = newbody;
        newbody.last = newhead;
        this.pos.splice(0, 0, [nextpos[0], nextpos[1]])
        this.head = newhead;
        if (!haseat) {
            this.tail.removedom();
            this.tail = this.tail.last;
            this.pos.pop()
        }
    },
    eat: function () {
        haseat = true;
        this.handle.move.call(this, [this.head.x + this.direction.x, this.head.y + this.direction.y]);
        haseat = false;
        game.score++;
        createfood()
    },
    die: function () {
        game.over()
    }
}
snake = new Snake();
function createfood() {
    var x = null;
    var y = null;
    var key = true;
    while (key) {
        x = Math.floor(Math.random() * 30);
        y = Math.floor(Math.random() * 30);
        snake.pos.forEach(function (item) {
            if (x !== item[0] && y !== item[1]) {
                key = false
            }
        })
    }
    var fooddom = document.getElementsByClassName('food')[0]
    if (fooddom) {
        food.x = x;
        food.y = y;
        food.div.style.left = x * 20 + 'px';
        food.div.style.top = y * 20 + 'px';
    } else {
        food = new Square(x, y, 'food');
        food.createdom()
    }
}
function Game() {
    this.timer = null;
    this.score = 0
}
Game.prototype.init = function () {
    snake.init();
    createfood();
    this.play()
}
Game.prototype.play = function () {
    document.onkeydown = function (e) {
        if (e.which == 37 && snake.direction !== snake.directionnum.right) {
            snake.direction = snake.directionnum.left
        }
        else if (e.which == 38 && snake.direction !== snake.directionnum.down) {
            snake.direction = snake.directionnum.up
        }
        else if (e.which == 39 && snake.direction !== snake.directionnum.left) {
            snake.direction = snake.directionnum.right
        }
        else if (e.which == 40 && snake.direction !== snake.directionnum.up) {
            snake.direction = snake.directionnum.down
        }else if(e.which == 32){
            if(flag){
                flag = false;
                clearInterval(game.timer);
                pausebtn.style.display = 'block';
            }else{
                flag = true;
                game.play();
                pausebtn.style.display = 'none';
            }
        }
    }
    this.timer = setInterval(function () {
        snake.next()
    }, speed)
}
Game.prototype.over = function () {
    clearInterval(this.timer);
    alert('你的得分为' + this.score);
    this.score = 0;
    flag = true;
    snkwapper.innerHTML = '';
    snake = new Snake();
    game = new Game();
    startbtn.style.display = 'block';
}
Game.prototype.pause = function() {
    clearInterval(this.timer);
}
game = new Game();
// 点击开始按钮开始游戏
var btn = document.getElementsByClassName('button');
btn[0].onclick = function() {
    startbtn.style.display = 'none';
    game.init();
}
//点击屏幕暂停游戏
snkwapper.onclick = function() {
    clearInterval(game.timer);
    pausebtn.style.display = 'block';
}
// 点击屏幕开始游戏
btn[1].onclick = function() {
    game.play();
    pausebtn.style.display = 'none';
}
function choose() {
    var diffcult = document.getElementsByClassName('diffcult');
    var len = diffcult.length;
    
    for(let i = 0;i < len;i++){
        diffcult[i].onclick = function() {
            speed = 300
            var hasactive = document.getElementsByClassName('active')[0];
            hasactive.classList.remove('active');
            diffcult[i].classList.add('active');
            speed -= i * 100
        }
    }
}
choose()




