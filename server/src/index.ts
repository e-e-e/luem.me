require("dotenv").config()

import Express from 'express';

import http from 'http';
import {Server, Socket} from "socket.io";
import * as socketIO from 'socket.io'
import cors from 'cors'
import fetch from 'node-fetch'
import {randomAnimal} from "./animals";

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
app.use("/:room", Express.static("../site/dist", { extensions: ['html']}))

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

//TODO: move to a common src directory
type UserInfo = {
  room: string;
  name: string;
  id: string;
}

const sessions = new WeakMap<Socket, UserInfo>()

function createNewSession(socket: Socket, room: string) {
  const user = {
    name: randomAnimal(),
    room,
    id: socket.id,
  }
  sessions.set(socket, user);
  return user;
}
function getReadersInRoom(io: Server, room: string): UserInfo[] {
  const readers = io.sockets.adapter.rooms.get(room);
  if (!readers) return []
  return Array.from(readers).map(id => {
    const socket = io.sockets.sockets.get(id)
    if (!socket) return
    return sessions.get(socket)
  }).filter((a): a is UserInfo => a != null)
}

function leaveAllRooms(socket: Socket) {
  for (const room of socket.rooms) {
    if (room !== socket.id) {
      socket.to(room).emit("user.left", socket.id);
    }
  }
}

io.on("connection", socket => {
  socket.on('user.join', (room: string) => {
    leaveAllRooms(socket)
    socket.leaveAll()
    const session = createNewSession(socket, room)
    const readers = getReadersInRoom(io, room)
    socket.join(room)
    socket.emit('user.join.success', session, readers)
    socket.to(room).emit('user.joined', session)
  })

  socket.on("disconnecting", () => {
    leaveAllRooms(socket)
  })

  socket.on('position', (y: number) => {
    const user = sessions.get(socket)
    if (user) socket.to(user.room).emit('position', y);
  })

  socket.on('cursor', (x: number, y: number) => {
    const user = sessions.get(socket)
    if (user) socket.to(user.room).emit('cursor', user.name, x, y);
  })
});

httpServer.listen(port, () => {
  console.log('listening on port', port)
});
