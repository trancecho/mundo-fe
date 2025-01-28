export interface Message {
    sender: "me" | "other";
    text: string;
}
  
export interface Contact {
    id: number;
    name: string;
    messages: Message[];
}