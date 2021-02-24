import {installHomePage} from "./pages/home/install";
import {installRoom} from "./pages/room/install";

export function main() {
  // non-dynamic routing for now
  if (window.location.pathname === '/') {
    return installHomePage();
  }
  const room = window.location.pathname.match(/^\/(\w+)\/?$/)
  if (room && room[1]) {
    return installRoom(room[1]);
  }
  window.location.href = '/'
}
