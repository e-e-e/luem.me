import { LuemmeClient } from '../luemmeClient';
import { BehaviorSubject } from 'rxjs';
import { UserInfo } from 'luem.me.common';

export type Profiles = {
  whoami: BehaviorSubject<UserInfo | null>;
  readers: Map<string, UserInfo>;
};

export function installReaderProfiles(
  luemme: LuemmeClient,
  room: string
): Profiles {
  const whoami = new BehaviorSubject<UserInfo | null>(null);
  const readers = new Map<string, UserInfo>();
  luemme.sendJoinRequest(room);

  const subscription = luemme.joinSuccess.subscribe((data) => {
    console.log('I am', data.whoami);
    whoami.next(data.whoami);
    console.log('There are', data.readers);
    for (const reader of data.readers) {
      readers.set(reader.id, reader);
    }
  });
  luemme.userJoined.subscribe((user) => {
    console.log('user joined:', user);
    readers.set(user.id, user);
  });
  luemme.userLeft.subscribe((user) => {
    console.log('user left:', user);
    readers.delete(user);
  });
  return {
    whoami,
    readers,
  };
}
