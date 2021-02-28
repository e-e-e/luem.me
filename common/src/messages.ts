type Position = {
  x: number;
  y: number;
}

export type UserInfo = {
  room: string;
  name: string;
  id: string;
}

export type ReadingRoomState = {
  name: string;
  url: string | null;
  scrollPosition: Position;
}

export const UserJoinMessage = 'user.join'

export const UserJoinSuccessMessage = 'user.join.success'
export type UserJoinSuccessPayload = {
  whoami: UserInfo,
  readers: UserInfo[]
}

export const ReadingRoomStateMessage = 'room.state';
export type ReadingRoomStatePayload = ReadingRoomState

export const UserJoinedMessage = 'user.joined'
export type UserJoinedPayload = UserInfo

export const UserLeftMessage = 'user.left'
export type UserLeftPayload = UserInfo['id']

export const LoadingMessage = 'loading'
export type LoadingPayload = { url: string, percent: number, reader: UserInfo['id']}

export const SetLoadingMessage = 'loading.set'
export type SetLoadingPayload = { url: string, percent: number }

export const LoadedMessage = 'loaded'
export type LoadedPayload = { url: string, reader: UserInfo['id']}

export const SetLoadedMessage = 'loaded.set'
export type SetLoadedPayload = { url: string }

export const ScrollPositionMessage = 'scroll.position'
export type ScrollPositionPayload = Position

export const CursorPositionMessage = 'cursor.position'
export type CursorPositionPayload = Position & Pick<UserInfo, 'id'>

export const SetCursorPositionMessage = 'cursor.position.set'
export type SetCursorPositionPayload = Position
