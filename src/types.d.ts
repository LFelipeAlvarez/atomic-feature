import { ReactNode } from "react";

export type User = {
  name: string,
  picture: string,
  id: string
}

export type UserState = {
  user: User | null;
}

export type Coordinates = {
  x: number
  y: number
}

export type Comment = {
  id?: string
  text?: string
  imageUrl?: string
  voiceMemo?: string | null
  coordinates: Coordinates
  userId?: string
  userPicture: string
  userName: string
  createdAt: number
}

export type CommentsState = {
  comments: Comment[] | null;
  loading: boolean;
}

export type FloatingFormProps = {
  coordinates: Coordinates
  closeForm: () => void
}


export type AudioPlayerProps = {
  src: string;
}


export type ChildrenAsProps = {
  children: string | ReactNode | JSX.Element | JSX.Element[] | (() => JSX.Element)
}
