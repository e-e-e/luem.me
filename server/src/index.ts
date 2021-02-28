require("dotenv").config()

import Express from 'express';

import http from 'http';
import {Server, Socket} from "socket.io";
import * as socketIO from 'socket.io'
import cors from 'cors'
import fetch from 'node-fetch'
import {randomAnimal} from "./animals";
import {
  CursorPositionMessage,
  LoadedMessage,
  LoadingMessage,
  ReadingRoomState,
  ReadingRoomStateMessage, ReadingRoomTextMessage,
  ScrollPositionMessage,
  ScrollPositionPayload,
  SetCursorPositionMessage,
  SetCursorPositionPayload,
  SetLoadedMessage,
  SetLoadedPayload,
  SetLoadingMessage,
  SetLoadingPayload,
  SetReadingRoomTextMessage,
  UserInfo,
  UserJoinedMessage,
  UserJoinMessage,
  UserJoinSuccessMessage,
  UserLeftMessage
} from "../../common/src/messages"

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
app.use("/:room", Express.static("../site/dist", {extensions: ['html']}))

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

const sessions = new WeakMap<Socket, UserInfo>()
const readingRooms = new Map<string, ReadingRoomState>()

function createReadingRoom(room: string) {
  if (readingRooms.get(room)) return;
  readingRooms.set(room, { name: room, scrollPosition: { x: 0, y: 0 }, url: null })
}

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
      socket.to(room).emit(UserLeftMessage, socket.id);
    }
  }
}

// Auto clean up of room states
setInterval(() => {
  const toRemove = []
  for (let room of readingRooms.values()) {
    const readers = io.sockets.adapter.rooms.get(room.name);
    if (!readers || readers.size === 0) {
      toRemove.push(room.name)
    }
  }
  toRemove.forEach(id => readingRooms.delete(id));
}, 5000)

function setReadingRoomData(room: string, transform: (prev: ReadingRoomState) => ReadingRoomState) {
  const readingRoom = readingRooms.get(room)
  if (!readingRoom) return
  console.log('new state:', transform(readingRoom))
  readingRooms.set(room, transform(readingRoom))
}

io.on("connection", socket => {
  socket.on(UserJoinMessage, (room: string) => {
    leaveAllRooms(socket)
    socket.leaveAll()
    const readingRoom = readingRooms.get(room)

    const session = createNewSession(socket, room)
    const readers = getReadersInRoom(io, room)
    socket.join(room)
    console.log('join', socket.id)
    socket.emit(UserJoinSuccessMessage, {
      whoami: session,
      readers,
    })
    if (!readingRoom) {
      createReadingRoom(room)
    } else {
      socket.emit(ReadingRoomStateMessage, readingRoom)
    }
    socket.to(room).emit(UserJoinedMessage, session)
  })

  socket.on("disconnecting", () => {
    leaveAllRooms(socket)
  })

  socket.on(SetReadingRoomTextMessage, (data: string) => {
    const user = sessions.get(socket)
    if (!user) return
    setReadingRoomData(user.room, prev => ({...prev, url: data }))
    if (user) socket.to(user.room).emit(ReadingRoomTextMessage, { url: data, reader: user.id });
  })

  socket.on(ScrollPositionMessage, (data: ScrollPositionPayload) => {
    const user = sessions.get(socket)
    if (!user) return
    console.log('set room scroll', data)
    setReadingRoomData(user.room, prev => ({...prev, scrollPosition: data }))
    socket.to(user.room).emit(ScrollPositionMessage, data);
  })

  socket.on(SetCursorPositionMessage, (data: SetCursorPositionPayload) => {
    const user = sessions.get(socket)
    if (user) socket.to(user.room).emit(CursorPositionMessage, {...data, id: user.id });
  })

  socket.on(SetLoadingMessage, (data: SetLoadingPayload) => {
    // maybe set room
    const user = sessions.get(socket)
    if (user) socket.to(user.room).emit(LoadingMessage, {...data, reader: user.id });
  })

  socket.on(SetLoadedMessage, (data: SetLoadedPayload) => {
    const user = sessions.get(socket)
    if (user) socket.to(user.room).emit(LoadedMessage, {...data, reader: user.id });
  })
});

httpServer.listen(port, () => {
  console.log('listening on port', port)
});
