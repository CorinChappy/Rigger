Rigger
==============

A Game in the StageSoc Games series. Used to promote University of Southampton Stage Technicians' Society (http://stagesoc.org.uk)

[Play development demo](http://games.corinchaplin.co.uk/stagesoc/rigger/)

-------------------

*Version v1.0.0*

Releases
------------
*See the [releases](https://github.com/CorinChappy/Rigger/releases) page for downloads.*


For a plug in and play version of the game download rigger.x.y.z.zip extract it and open index.html. Please note audio will not work if using the file:// scheme.


For a single file release of just the source code (without the image and audio assets) download rigger.x.y.z.js. This file has not been minified



Build from source
------------------
You can play the game by simply downloading or cloning the repository. To minify and/or package you can use [build/build.js](../master/build/build.js), the build file is written in [nodejs](http://nodejs.org).

*Please note the module [jszip](https://www.npmjs.org/package/jszip) is required for compression*


To run the build file enter `node build [options]`. -c enables compression, -m skips minification and just outputs the merged file. Using both -c and -m will output a compressed zip where rigger.js has not been minified. Type `node build -h` for more information on options.


Embedding the game
-------------------
To embed the game into your site all you need to do is include rigger.js in your webpage and execute rigger.init() passing in the DOM element you want the game to be placed in. The assest folder must be placed in the same directory as the page the game is to be embedded in. See [example.html](../master/build/example.html) for an example.
The game's dimensions are 1000x500px.
