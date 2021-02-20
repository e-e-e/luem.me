require("dotenv").config()

import Express from 'express';
import http from 'http';
import * as socketIO from 'socket.io'
import cors from 'cors'
import fetch from 'node-fetch'

const port = process.env.PORT || 3000

const app = Express();
const httpServer = http.createServer(app);

const corsOptions = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}

app.use(cors(corsOptions))

app.use("/", Express.static("../site/dist"))

const acceptedHeaders = [
  'content-type',
  // 'content-encoding',
  'content-length'
]

app.get('/content/:url', (req, res) => {
  fetch(req.params.url).then((r) => {
    // TODO: filter by filetype
    for (const [key, value] of r.headers.entries()) {
      if (acceptedHeaders.includes(key)) {
        res.setHeader(key, value)
      }
    }
    r.body.pipe(res)
  })
})


const io = new socketIO.Server(httpServer, {
  path: '/io',
  cors: corsOptions
});

io.on("connection", socket => {
  console.log('connected');
  socket.on('join', (room: string) => {
    socket.leaveAll()
    console.log('join', room);
    socket.join(room)
  })
  socket.on('position', (y: number) => {
    socket.to('hello').emit('position', y);
  })
  socket.on('zoom', (scale: number) => {
    socket.to('hello').emit('zoom', scale);
  })
  socket.on('cursor', (x: number, y: number) => {
    socket.to('hello').emit('cursor', socket.id, x, y);
  })
});

httpServer.listen(port);
