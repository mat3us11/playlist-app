export type RootStackParamList = {
  index: undefined;
  new: undefined;  
};

export interface Song {
  id: string;
  title: string;
  artist: string;
  duration?: string;
  genre?: string;
  createdAt: string;
}
