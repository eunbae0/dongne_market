export interface PostData {
  postId: string;
  author_id: string;
  title: string;
  content: string;
  usage: string;
  timeStamp: number;
  nickname: string;
  status: string;
  price: string;
  images?: string[];
}

export interface UserData {
  email: string;
  introduction: string;
  neightborhood: string;
  nickname: string;
}
