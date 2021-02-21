import {io} from "socket.io-client";

//TODO: move to a common src directory
export type UserInfo = {
  room: string;
  name: string;
  id: string;
}

export interface LuemmeSocket {
  join: (room: string) => void
  onJoined: (handler: (user: UserInfo, readers: UserInfo[]) => void) => void
  onUserJoined: (handler: (name: string) => void) => void
  onUserLeft: (handler: (name: string) => void) => void
  loading: (percent: number) => void
  loaded: (url: string) => void
  position: (y: number) => void
  onPosition: (handler: (y: number) => void) => void
  zoom: (scale: number) => void
  onZoom: (handler: (scale: number) => void) => void
  cursor: (x: number, y: number) => void
  onCursor: (handler: (user: string, x: number, y: number) => void) => void
}

export function installLuemmeSocket(): LuemmeSocket {
  const socket = io({path: '/io', port: process.env.SOCKET_PORT})
  socket.on('connect', () => {
    // register wit
  })
  // server replies - with secret to be used on reconnect, to keep the name the same


  return {
    join: (room: string) => socket.emit('user.join', room),
    onJoined: (handler: (user: UserInfo, readers: UserInfo[]) => void) => socket.on('user.join.success', handler),
    onUserJoined: (handler: (name: string) => void) => socket.on('user.joined', handler),
    onUserLeft: (handler: (name: string) => void) => socket.on('user.left', handler),
    loading: (percent: number) => socket.volatile.emit('loading', percent),
    loaded: (url: string) => socket.emit('loaded', url),
    position: (y: number) => socket.volatile.emit('position', y),
    onPosition: (handler: (y: number) => void) => socket.on('position', handler),
    zoom: (scale: number) => socket.volatile.emit('zoom', scale),
    onZoom: (handler: (scale: number) => void) => socket.on('zoom', handler),
    cursor: (x: number, y: number) => socket.volatile.emit('cursor', x, y),
    onCursor: (handler: (user: string, x: number, y: number) => void) => socket.on('cursor', handler)
  }
}
