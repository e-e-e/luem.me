import {io, Socket} from "socket.io-client";
import {Subject} from "rxjs";
import {
  CursorPositionMessage,
  CursorPositionPayload,
  ScrollPositionMessage,
  ScrollPositionPayload,
  SetCursorPositionMessage,
  SetCursorPositionPayload,
  SetLoadedMessage, SetLoadedPayload,
  SetLoadingMessage,
  SetLoadingPayload,
  UserJoinedMessage,
  UserJoinedPayload,
  UserJoinMessage,
  UserJoinSuccessMessage,
  UserJoinSuccessPayload,
  UserLeftMessage,
  UserLeftPayload
} from "../../../../common/src/messages";

type Action<T> = (data: T) => void

export interface LuemmeClient {
  sendJoinRequest: Action<string>
  joinSuccess: Subject<UserJoinSuccessPayload>
  userJoined: Subject<UserJoinedPayload>
  userLeft: Subject<UserLeftPayload>
  sendLoadingStatus: Action<SetLoadingPayload>
  sendLoadedStatus: Action<SetLoadedPayload>
  setScrollPosition: Action<ScrollPositionPayload>
  scrollPosition: Subject<ScrollPositionPayload>
  sendCursorPosition: Action<SetCursorPositionPayload>
  cursorPosition: Subject<CursorPositionPayload>
}

function messageAsSubject<T>(socket: Socket, event: string): Subject<T> {
  const subject = new Subject<T>()
  socket.on(event, (v: T) => subject.next(v))
  return subject
}

export function installLuemmeSocket(): LuemmeClient {
  const socket = io({path: '/io', port: process.env.SOCKET_PORT})
  socket.on('connect', () => {
    // register wit
  })
  // server replies - with secret to be used on reconnect, to keep the name the same
  return {
    sendJoinRequest: (room: string) => socket.emit(UserJoinMessage, room),
    joinSuccess: messageAsSubject(socket, UserJoinSuccessMessage),
    userJoined: messageAsSubject(socket, UserJoinedMessage),
    userLeft: messageAsSubject(socket, UserLeftMessage),
    sendLoadingStatus: (data) => socket.volatile.emit(SetLoadingMessage, data),
    sendLoadedStatus: (data) => socket.emit(SetLoadedMessage, data),
    setScrollPosition: (data) => socket.volatile.emit(ScrollPositionMessage, data),
    scrollPosition: messageAsSubject(socket, ScrollPositionMessage),
    sendCursorPosition: (data) => socket.volatile.emit(SetCursorPositionMessage, data),
    cursorPosition: messageAsSubject(socket, CursorPositionMessage)
  }
}
