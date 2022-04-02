import { io, Socket } from 'socket.io-client';
import { Subject } from 'rxjs';
import {
  CursorPositionMessage,
  CursorPositionPayload,
  ReadingRoomStateMessage,
  ReadingRoomStatePayload,
  ReadingRoomTextMessage,
  ReadingRoomTextPayload,
  ScrollPositionMessage,
  ScrollPositionPayload,
  SelectionMessage,
  SelectionPayload,
  SetCursorPositionMessage,
  SetCursorPositionPayload,
  SetLoadedMessage,
  SetLoadedPayload,
  SetLoadingMessage,
  SetLoadingPayload,
  SetReadingRoomTextMessage,
  SetSelectionMessage,
  SetSelectionPayload,
  UserJoinedMessage,
  UserJoinedPayload,
  UserJoinMessage,
  UserJoinSuccessMessage,
  UserJoinSuccessPayload,
  UserLeftMessage,
  UserLeftPayload,
} from 'luem.me.common';

type Action<T> = (data: T) => void;

export interface LuemmeClient {
  sendJoinRequest: Action<string>;
  joinSuccess: Subject<UserJoinSuccessPayload>;
  readingRoomInitialState: Subject<ReadingRoomStatePayload>;
  sendReadingRoomText: Action<string>;
  readingRoomText: Subject<ReadingRoomTextPayload>;
  userJoined: Subject<UserJoinedPayload>;
  userLeft: Subject<UserLeftPayload>;
  sendLoadingStatus: Action<SetLoadingPayload>;
  sendLoadedStatus: Action<SetLoadedPayload>;
  setScrollPosition: Action<ScrollPositionPayload>;
  scrollPosition: Subject<ScrollPositionPayload>;
  sendCursorPosition: Action<SetCursorPositionPayload>;
  cursorPosition: Subject<CursorPositionPayload>;
  sendSelection: Action<SetSelectionPayload>;
  selection: Subject<SelectionPayload>;
}

function messageAsSubject<T>(socket: Socket, event: string): Subject<T> {
  const subject = new Subject<T>();
  socket.on(event, (v: T) => subject.next(v));
  return subject;
}

export function installLuemmeClient(): LuemmeClient {
  const socket = io({ path: '/io', port: process.env.SOCKET_PORT });
  socket.on('connect', () => {
    // register wit
  });
  // server replies - with secret to be used on reconnect, to keep the name the same
  return {
    sendJoinRequest: (room: string) => socket.emit(UserJoinMessage, room),
    joinSuccess: messageAsSubject(socket, UserJoinSuccessMessage),
    readingRoomInitialState: messageAsSubject(socket, ReadingRoomStateMessage),
    readingRoomText: messageAsSubject(socket, ReadingRoomTextMessage),
    sendReadingRoomText: (data) => socket.emit(SetReadingRoomTextMessage, data),
    userJoined: messageAsSubject(socket, UserJoinedMessage),
    userLeft: messageAsSubject(socket, UserLeftMessage),
    sendLoadingStatus: (data) => socket.volatile.emit(SetLoadingMessage, data),
    sendLoadedStatus: (data) => socket.emit(SetLoadedMessage, data),
    setScrollPosition: (data) =>
      socket.volatile.emit(ScrollPositionMessage, data),
    scrollPosition: messageAsSubject(socket, ScrollPositionMessage),
    sendCursorPosition: (data) =>
      socket.volatile.emit(SetCursorPositionMessage, data),
    cursorPosition: messageAsSubject(socket, CursorPositionMessage),
    sendSelection: (data) => socket.emit(SetSelectionMessage, data),
    selection: messageAsSubject(socket, SelectionMessage),
  };
}
