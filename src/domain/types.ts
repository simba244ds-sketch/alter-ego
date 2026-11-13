export type Mode = "self" | "copilot" | "delegate";
export type Grade = "Junior" | "Middle" | "Senior" | "Lead";
export type Branch =
  | "memory"
  | "persona"
  | "skills"
  | "agency"
  | "relationships";
export type Author = "human" | "ai" | "colleague" | "system";
export interface Profile {
  name: string;
  role: string;
  grade: Grade;
  tone: "friendly" | "balanced" | "formal";
  detail: "brief" | "detailed";
  autonomy: "approval" | "scoped";
  memorySources: string[];
  relationshipIds: string[];
}
export interface Message {
  id: string;
  author: Author;
  authorName: string;
  body: string;
  time: string;
}
export interface Conversation {
  id: string;
  title: string;
  subtitle: string;
  topic: string;
  color: string;
  participants: string[];
  aiAllowed: boolean;
  controller: "human" | "ai";
  unread: number;
  messages: Message[];
  epoch: number;
}
export interface CatchUpItem {
  id: string;
  type: "decision" | "question" | "task";
  title: string;
  body: string;
  conversationId: string;
  time: string;
  done: boolean;
}
export interface AgentContext {
  profile: Profile;
  conversation: Conversation;
  prompt: string;
  mode: Mode;
}
export interface AIDraft {
  body: string;
  epoch: number;
}
export interface AIService {
  generate(context: AgentContext): Promise<string>;
}
export interface WorkspaceSnapshot {
  profile: Profile;
  mode: Mode;
  conversations: Conversation[];
  catchUp: CatchUpItem[];
  read: boolean;
}
// A Supabase adapter can implement this contract behind an authenticated backend.
export interface WorkspaceRepository {
  load(): Promise<WorkspaceSnapshot | null>;
  save(snapshot: WorkspaceSnapshot): Promise<void>;
}
