
export type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  timestamp: string;
};
