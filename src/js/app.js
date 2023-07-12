function game() {

    var canvas = document.getElementById('canvas');
    if (!canvas)
        return;

    var ctx = canvas.getContext("2d");
    if (!ctx)
        return;

    var life = document.getElementById('life');
    var scroll = document.getElementById('scroll');
    var options = document.getElementById('options');

    var points = 0;
    var lives = 4;
    var start = false;
    var kills = 0;

    var fps = 0;
    var now = new Date;
    var lastUpdate = (new Date) * 1;
    var fpsFilter = 30;

    var explosion = new Image();
    explosion.src = "./assets/explosion.png";
    var cx = 0;
    var cy = 0;
    var sx = 0;
    var sy = 0;
    var sw = 50;
    var sh = 50;
    var count = 0;

    var lastUpdateTime = 0;
    var acDelta = 0;
    var msPerFrame = 50;
    var x = 0;

    var enemySprite = new Image();
    enemySprite.src = "./assets/enemySprite.png";
    var Ecx = 0;
    var Ecy = 0;
    var Esx = 0;
    var Esy = 65;
    var Esw = 65;
    var Esh = 65;
    var Ecount = 0;

    var fireSprite = new Image();
    fireSprite.src = "./assets/fireSprite.png";
    var Fcx = 0;
    var Fcy = 0;
    var Fsx = 0;
    var Fsy = 0;
    var Fsw = 64;
    var Fsh = 64;
    var Fcount = 0;
    var FmsPerFrame = 90;

    lastCoordX = 0;
    lastCoordY = 0;

    var enemyDelay = 10;
    var direction = 1;


    //var enemy = new Enemy({context:ctx});
    var enemies = [];
    var level = 1;
    var hit = false;

    var enemyCount = level * 5;
    var endlessMode = false;
    var executed = false;

    for (var i = 0; i < enemyCount; i++) {
        enemies[i] = new Enemy({ context: ctx });
    }

    window.addEventListener('load', update);
    canvas.addEventListener('click', shoot);

    function update(e) {
        if (start) {
            if (lives > 0) {
                canvas.removeEventListener('click', startGame);
                canvas.removeEventListener('click', reStart);

                var delta = Date.now() - lastUpdateTime;

                if (acDelta > msPerFrame) {
                    acDelta = 0;
                    clearCanvas();
                    sx = count * 50;
                    Esx = Ecount * 65;
                    x--;

                    for (var i = 0; i < enemies.length; i++) {
                        enemies[i].draw();
                    }

                    if (x >= 0) {
                        if (count > 5) {
                            count = 0;
                        } else {
                            count++;
                            ctx.drawImage(explosion, sx, sy, sw, sh, (lastCoordX - sw), (lastCoordY - sh), 100, 100);
                        }
                    } else {
                        if (Ecount >= 8) {
                            Ecount = 0;
                        } else {
                            Ecount++;
                        }
                    }
                } else {
                    acDelta += delta;
                }

                lastUpdateTime = Date.now();

                if (enemies.length <= 0) {
                    showNextWaveScreen();
                }

                showFPS();
                showScore();
                showLives();
            } else {
                showGameOverScreen();
            }
        } else {
            clearCanvas();
            showStartScreen();

            var modeSelect = document.getElementById('modeSelect');

            if (modeSelect.value == 0) {
                endlessMode = true;
            } else {
                endlessMode = false;
            }

        }

        window.requestAnimationFrame(update);
    }

    function Enemy(params) {
        this.context = (typeof params.context !== 'undefined') ? params.context : null;

        var destinationX = Math.floor((Math.random() * canvas.width));
        var destinationY = Math.floor((Math.random() * canvas.width));

        this.x = (typeof params.x !== 'undefined') ? params.x : destinationX;
        this.y = (typeof params.y !== 'undefined') ? params.y : destinationY;
        this.width = (typeof params.width !== 'undefined') ? params.width : 100;
        this.height = (typeof params.height !== 'undefined') ? params.height : 100;
        this.velX = (typeof params.velX !== 'undefined') ? params.velX : 0;
        this.velY = (typeof params.velY !== 'undefined') ? params.velY : 0;
        this.hasLife = (typeof params.hasLife !== 'undefined') ? params.hasLife : false;

        this.draw = function () {
            if (this.context) {
                var friction = 0.9;

                direction = Math.floor(Math.random() * 4);

                if (direction === 3) {
                    this.velX += 8;
                } else if (direction === 1) {
                    this.velX -= 8;
                } else if (direction === 2) {
                    this.velY += 8;
                } else if (direction === 0) {
                    this.velY -= 8;
                }

                if ((this.x + this.width) > canvas.width) {
                    this.x = canvas.width - this.width;
                }
                if (this.x < 0) {
                    this.x = 0;
                }

                if ((this.y + this.height) >= (canvas.height - 100)) {
                    this.y = canvas.height - this.height - 100;
                }
                if (this.y < 0) {
                    this.y = 0;
                }

                this.velX *= friction;
                this.velY *= friction;

                this.x += this.velX;
                this.y += this.velY;

                Esy = direction * 65;
                ctx.drawImage(enemySprite, Esx, Esy, Esw, Esh, this.x, this.y, this.width, this.width);

                if (this.hasLife) {
                    ctx.drawImage(life, this.x, this.y);
                }
            }
        };
    }

    function shoot(e) {

        options.setAttribute('class', 'hidden');

        for (var i = 0; i < enemies.length; i++) {
            if ((e.offsetX >= enemies[i].x) && (e.offsetX <= (enemies[i].x + enemies[i].width)) && (e.offsetY >= enemies[i].y) && (e.offsetY <= (enemies[i].y + enemies[i].height))) {
                points += 10;

                lastCoordX = e.offsetX;
                lastCoordY = e.offsetY;

                if (enemies[i].hasLife && lives < 3) {
                    lives++;
                }

                if (endlessMode) {
                    var destinationX = Math.floor((Math.random() * canvas.width));
                    var destinationY = Math.floor((Math.random() * (canvas.height - 100)));

                    enemies[i].x = destinationX;
                    enemies[i].y = destinationY;
                } else {
                    enemies.splice(i, 1);
                }

                x = 6;
                count = 0;
                hit = true;
                kills++;
            }
        }

        if (!hit) {
            lives--;
        }

        hit = false;
    }

    function showScore() {
        ctx.fillStyle = '#fff';
        ctx.font = '14px Tahoma';
        ctx.fillText('Score: ' + points, 150, canvas.height - 60);
    }

    function showLives() {
        ctx.fillStyle = '#fff';
        ctx.font = '14px Tahoma';

        for (var i = 1; i <= (lives * 30); i += 30) {
            ctx.drawImage(life, (canvas.width - 240) + i, canvas.height - 90);
        }
    }

    function showFPS() {
        var thisFrameFPS = 1000 / ((now = new Date) - lastUpdate);

        if (now != lastUpdate) {
            fps += (thisFrameFPS - fps) / fpsFilter;
            lastUpdate = now;
        }
        ctx.textAlign = 'left';
        ctx.fillStyle = '#fff';
        ctx.font = '14px Tahoma';
        ctx.fillText("FPS: " + Math.round(fps), 150, canvas.height - 80);
    }

    function showStartScreen() {
        ctx.drawImage(scroll, 0, 0);
        ctx.fillStyle = '#000';
        ctx.font = '30px Consolas';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000';
        ctx.font = '14px Tahoma';
        ctx.fillText("Objective: Kill the enemies.", (canvas.width) / 2, (canvas.height / 3));
        ctx.fillText("Click to begin!", (canvas.width) / 2, ((canvas.height / 3) + 30));
        canvas.addEventListener('click', startGame);
    }

    function showNextWaveScreen() {
        if (!executed) {
            level++;
            enemyCount = level * 5;
        }

        ctx.drawImage(scroll, 0, 0);
        ctx.fillStyle = '#000';
        ctx.font = '30px Consolas';
        ctx.textAlign = 'center';
        ctx.fillText("Wave:" + level, (canvas.width / 2), canvas.height / 3);
        ctx.fillText("Enemies:" + enemyCount, (canvas.width / 2), ((canvas.height / 3) + 40));
        ctx.font = '14px Tahoma';
        ctx.fillText("Click to begin!", (canvas.width) / 2, ((canvas.height / 3) + 70));
        executed = true;
        canvas.addEventListener('click', continueGame);

    }

    function continueGame() {
        var lifeRegen = Math.floor((Math.random() * enemyCount));

        for (var i = 0; i < enemyCount; i++) {
            enemies[i] = new Enemy({ context: ctx });

            if (lifeRegen == i) {
                enemies[i].hasLife = true;
            }
        }
        executed = false;
        lives++;

        canvas.removeEventListener('click', continueGame);
    }

    function showGameOverScreen() {
        var delta = Date.now() - lastUpdateTime;

        if (acDelta > FmsPerFrame) {
            acDelta = 0;
            clearCanvas();
            Fsx = Fcount * 64;

            ctx.drawImage(scroll, 0, 0);
            ctx.fillStyle = '#000';
            ctx.font = '30px Consolas';
            ctx.textAlign = 'center';
            ctx.fillText("Game Over", (canvas.width / 2), canvas.height / 3 - 30);
            ctx.fillText("Score:" + points, (canvas.width / 2), ((canvas.height / 3)));
            ctx.font = '14px Tahoma';
            ctx.fillText("Kills:" + kills, (canvas.width / 2), ((canvas.height / 3) + 30));
            if (!endlessMode) {
                ctx.fillText("Waves Survived:" + (level - 1), (canvas.width / 2), ((canvas.height / 3) + 45));
            }

            ctx.fillStyle = '#000';
            ctx.font = '14px Tahoma';
            ctx.fillText("Click to try again!", (canvas.width) / 2, ((canvas.height / 3) + 70));
            canvas.addEventListener('click', reStart);

            ctx.drawImage(fireSprite, Fsx, Fsy, Fsw, Fsh, ((canvas.width) / 2) - 58, ((canvas.height / 3) + 90), 100, 100);


            if (Fcount >= 4) {
                Fcount = 0;
            } else {
                Fcount++;
            }

        } else {
            acDelta += delta;
        }

        lastUpdateTime = Date.now();

    }

    function startGame() {
        start = true;
    }

    function reStart() {
        lives = 3;
        points = 0;
        level = 1;
        kills = 0;

        enemyCount = level * 5;

        if (!endlessMode) {
            enemies.splice(0, enemies.length);

            for (var i = 0; i < enemyCount; i++) {
                enemies[i] = new Enemy({ context: ctx });
            }
        }
    }

    function rect(x, y, w, h, c) {
        ctx.beginPath();
        ctx.fillStyle = c;
        ctx.fillRect(x, y, w, h);
        ctx.closePath();
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
};

game();