import {LuemmeClient} from "./luemmeClient";

export function installReaderProfiles(luemme: LuemmeClient, room: string) {
  luemme.sendJoinRequest(room);

  const subscription = luemme.joinSuccess.subscribe((data) => {
    console.log('I am', data.whoami);
    console.log('There are', data.readers)
  })
  luemme.userJoined.subscribe((user) => {
    console.log('user joined:', user)
  })
  luemme.userLeft.subscribe((user) => {
    console.log('user left:', user)
  })

}
