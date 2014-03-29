gameloop.js
===========
Mini Javascipt library for gamedev.

#### Description ####
Just one simple function, which provides main game loop for your game.

#### Usage ####
gameloop(callback)

callback is a function, which takes one argument - time between two animation frames.

#### Simple example ####
gameloop(function (dt) {
   
    //update logic, eg. move sprites
    sprite.x += 100 * dt; //move sprite by 100 pixels per second
    
    //draw everything
    draw_game();
});
