import { Conversation, Mode, Profile } from "./types";
export function mayGenerate(conversation: Conversation, mode: Mode) {
  return (
    conversation.aiAllowed &&
    conversation.controller === "ai" &&
    mode !== "self"
  );
}
export function mayPublish(
  conversation: Conversation,
  epoch: number,
  mode: Mode,
) {
  return mayGenerate(conversation, mode) && conversation.epoch === epoch;
}
export function requiresApproval(profile: Profile, mode: Mode) {
  return mode !== "delegate" || profile.autonomy === "approval";
}
export function isCommitment(prompt: string) {
  return /обеща|подтверди.*(срок|пятниц|бюджет|дат)|гарантир|согласуй.*(бюджет|срок)/i.test(
    prompt,
  );
}
