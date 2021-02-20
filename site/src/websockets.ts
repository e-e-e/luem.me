import {io} from "socket.io-client";

export interface LuemmeSocket {
  loading: (percent: number) => void
  loaded: (url: string) => void
  position: (y: number) => void
  onPosition: (handler: (y: number) => void) => void
  zoom: (scale: number) => void
  onZoom: (handler: (scale: number) => void) => void
  cursor: (x: number, y: number) => void
  onCursor: (handler: (user: string, x: number, y: number) => void) => void
}

export function createWsClient(room: string): LuemmeSocket {
  console.log(process.env.SOCKET_PORT)
  const socket = io( { path: '/io', port: process.env.SOCKET_PORT })
  socket.on('connect', () => {
    // register with server - requesting to join a room with a name
    // server replies - with secret to be used on reconnect, to keep the name the same
    socket.emit('join', room)
  })

  // socket.connected

  // Listening:
  // loaded: user, boolean
  // loading: user, percentage
  // joined: user
  // position: user, x, y, zoom

  // Actions:
  // loading - percentage
  // loaded - boolean
  // position - x, y, zoom
  // requestControl
  // relinquishControl
  socket.on('position', () => console.log('ok'))
  return {
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
