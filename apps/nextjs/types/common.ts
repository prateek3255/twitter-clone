interface TweetBaseInfo {
  id: string;
  content: string;
  createdAt: Date;
  username: string;
  name: string;
  profileImage?: string | null;
}

interface LoggedInUserBaseInfo {
  id: string;
  username: string;
  name?: string;
  profileImage?: string | null;
}

export type { TweetBaseInfo, LoggedInUserBaseInfo };
