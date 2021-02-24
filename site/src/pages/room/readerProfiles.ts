import {LuemmeSocket} from "./luemmeSocket";

type UserStore = {
  whoami?: string,
  users: Map<string, string>
}

export function installReaderProfiles(socket: LuemmeSocket, room: string) {
  socket.join(room);
  socket.onJoined((user, readers) => {
    console.log('I am', user);
    console.log('There are', readers)
  })
  socket.onUserJoined((user) => {
    console.log('user joined:', user)
  })
  socket.onUserLeft((user) => {
    console.log('user left:', user)
  })

}
