import test from "node:test";
import assert from "node:assert/strict";
import {
  mayGenerate,
  mayPublish,
  requiresApproval,
  isCommitment,
} from "./policies";
import { initialConversations, initialProfile } from "../data/seed";
import { mockAIService } from "../services/mockAI";

test("grade does not grant access to a restricted channel", () => {
  const c = { ...initialConversations[2], controller: "ai" as const };
  for (const grade of ["Junior", "Lead"] as const) {
    const profile = { ...initialProfile, grade };
    assert.equal(mayGenerate(c, "delegate"), false);
    assert.equal(profile.autonomy, "approval");
    assert.deepEqual(profile.memorySources, ["brand", "project"]);
  }
});
test("takeover and a newer context invalidate an in-flight answer", () => {
  const c = { ...initialConversations[0], epoch: 2 };
  assert.equal(mayPublish(c, 2, "copilot"), true);
  assert.equal(mayPublish(c, 1, "copilot"), false);
  assert.equal(mayPublish({ ...c, controller: "human" }, 2, "copilot"), false);
  assert.equal(mayPublish(c, 2, "self"), false);
});
test("only scoped delegation can bypass a draft", () => {
  assert.equal(requiresApproval(initialProfile, "delegate"), true);
  assert.equal(
    requiresApproval({ ...initialProfile, autonomy: "scoped" }, "copilot"),
    true,
  );
  assert.equal(
    requiresApproval({ ...initialProfile, autonomy: "scoped" }, "delegate"),
    false,
  );
});
test("requests for commitments are escalated, not promised", async () => {
  assert.equal(isCommitment("Подтверди срок на пятницу"), true);
  const response = await mockAIService.generate({
    profile: initialProfile,
    conversation: initialConversations[0],
    mode: "delegate",
    prompt: "Подтверди срок на пятницу",
  });
  assert.match(response, /обязательство/);
  assert.match(response, /обещаний не даю/);
});
test("AI uses grade and excludes disconnected memory", async () => {
  const c = initialConversations[0];
  const lead = await mockAIService.generate({
    profile: { ...initialProfile, grade: "Lead" },
    conversation: c,
    mode: "copilot",
    prompt: "Пустое состояние",
  });
  assert.match(lead, /направление для команды/);
  const empty = await mockAIService.generate({
    profile: { ...initialProfile, memorySources: [] },
    conversation: c,
    mode: "copilot",
    prompt: "Проверь токены",
  });
  assert.match(empty, /нет подключённых источников/);
});
