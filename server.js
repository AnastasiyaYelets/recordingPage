const express = require('express')
const app = express();
const cors = require('cors');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs')
const port = process.env.PORT || 80;
const multer  = require('multer') //use multer to upload blob data
const upload = multer();

app.use(express.static(__dirname + '/src/public'));

server.listen(80, function () {
  console.log(`Example app listening on port ${port}!`);
});

app.use(cors());

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.post('/upload', upload.single('audio_data'), function (req, res, next) {
  let uploadLocation = __dirname + '/src/public/uploads/' + req.file.originalname;

  fs.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(req.file.buffer)));
  res.sendStatus(200);

  if (req.file.originalname === 'finish.webm') {
    io.emit('finish', '/uploads/' + req.file.originalname);
  }
  if (req.file.originalname === 'first.webm') {
    io.emit('chunk', '/uploads/' + req.file.originalname);
  }
});

io.on('connection', function(socket){
  socket.on('recording', function(msg){
    io.emit('recording', msg);
  });
  socket.on('openRemotely', function(msg){
    io.emit('openRemotely', msg);
  });
  socket.on('sendSample', function(msg){
    debugger
    io.emit('sendSample', msg);
  });
  socket.on('_ping', function(msg){
    io.emit('_pong', msg);
  });

});
