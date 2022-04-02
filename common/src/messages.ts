export type Position = {
  x: number;
  y: number;
};

export type Rect = Position & {
  width: number;
  height: number;
};

export type Color = {
  h: number;
  s: number;
  l: number;
};

export type Identifier = string;

export type Identifiable = {
  id: Identifier;
};

export type UserInfo = Identifiable & {
  room: string;
  name: string;
  color: Color;
};

export type ReadingRoomState = {
  name: string;
  url: string | null;
  scrollPosition: Position;
};

export const UserJoinMessage = 'user.join';

export const UserJoinSuccessMessage = 'user.join.success';
export type UserJoinSuccessPayload = {
  whoami: UserInfo;
  readers: UserInfo[];
};

export const ReadingRoomStateMessage = 'room.state';
export type ReadingRoomStatePayload = ReadingRoomState;

export const SetReadingRoomTextMessage = 'room.text.set';
export type SetReadingRoomTextPayload = string;

export const ReadingRoomTextMessage = 'room.text';
export type ReadingRoomTextPayload = { url: string; reader: Identifier };

export const UserJoinedMessage = 'user.joined';
export type UserJoinedPayload = UserInfo;

export const UserLeftMessage = 'user.left';
export type UserLeftPayload = Identifier;

export const LoadingMessage = 'loading';
export type LoadingPayload = {
  url: string;
  percent: number;
  reader: Identifier;
};

export const SetLoadingMessage = 'loading.set';
export type SetLoadingPayload = { url: string; percent: number };

export const LoadedMessage = 'loaded';
export type LoadedPayload = { url: string; reader: Identifier };

export const SetLoadedMessage = 'loaded.set';
export type SetLoadedPayload = { url: string };

export const ScrollPositionMessage = 'scroll.position';
export type ScrollPositionPayload = Position;

export const CursorPositionMessage = 'cursor.position';
export type CursorPositionPayload = Position &
  Identifiable & { pressed: boolean };

export const SetCursorPositionMessage = 'cursor.position.set';
export type SetCursorPositionPayload = Position & { pressed: boolean };

export const SelectionMessage = 'selection';
export type SelectionPayload = { rects: Rect[] } & Identifiable;

export const SetSelectionMessage = 'selection.set';
export type SetSelectionPayload = { rects: Rect[] };
