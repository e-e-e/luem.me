type ReadingRoom = {
  name: string;
  url?: string;
  offsetY: number;
};

export const readingRooms = new Map<string, ReadingRoom>();
