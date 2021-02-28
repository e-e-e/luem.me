import {LuemmeSocket} from "./luemmeSocket";

export function installReaderProfiles(socket: LuemmeSocket, room: string) {
  socket.sendJoinRequest(room);

  const subscription = socket.joinSuccess.subscribe((data) => {
    console.log('I am', data.whoami);
    console.log('There are', data.readers)
  })
  socket.userJoined.subscribe((user) => {
    console.log('user joined:', user)
  })
  socket.userLeft.subscribe((user) => {
    console.log('user left:', user)
  })

}
