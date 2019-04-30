global.THREE = require("three");

// Create a DOM
var JSDOM = require('jsdom').JSDOM;
const dom = new JSDOM();
global.window = dom.window;
global.navigator = dom.window.navigator;
global.document = global.window.document;

//REST API
const express = require('express');      
const app = express();    
const router = express.Router();

//Create context
var width   = 640
var height  = 640
var gl = require('gl')(width, height, { preserveDrawingBuffer: true })

var pngStream = require('three-png-stream');
var port = process.env.PORT || 8080;

function render() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({ context: gl });

    scene.add(camera);

    renderer.setSize(width, height);
    renderer.setClearColor(0xFFFF00, 1);

    var target = new THREE.WebGLRenderTarget(width, height);
    renderer.setRenderTarget(target);
    renderer.render(scene, camera);
    
    return { renderer, target };
}

router.get('/render', function(req, res){
   const { renderer, target } = render();
   res.setHeader('Content-Type', 'image/png');
   pngStream(renderer, target).pipe(res);
});

app.use('/api', router);

app.listen(port);
console.log('Server active on port: ' + port);