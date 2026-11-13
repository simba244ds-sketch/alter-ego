import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import {
  initialCatchUp,
  initialConversations,
  initialProfile,
} from "../data/seed";
import { AIDraft, Mode, Profile, WorkspaceSnapshot } from "../domain/types";
import { mayGenerate, mayPublish, requiresApproval } from "../domain/policies";
import { mockAIService } from "../services/mockAI";

const time = () =>
  new Intl.DateTimeFormat("ru", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Moscow",
  }).format(new Date());
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const storage: StateStorage = {
  getItem: (key) => AsyncStorage.getItem(key),
  removeItem: (key) => AsyncStorage.removeItem(key),
  setItem: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      const message =
        "Не удалось сохранить изменения. До перезапуска они доступны в текущей сессии.";
      if (useWorkspace.getState().storageError !== message)
        useWorkspace.setState({ storageError: message });
    }
  },
};
interface State extends WorkspaceSnapshot {
  hydrated: boolean;
  storageError: string | null;
  notice: string | null;
  drafts: Record<string, AIDraft | undefined>;
  pending: Record<string, boolean>;
  errors: Record<string, string | undefined>;
  updateProfile(patch: Partial<Profile>): void;
  setMode(mode: Mode): void;
  takeOver(id: string): void;
  chooseAuthor(id: string, author: "human" | "ai"): void;
  sendHuman(id: string, text: string): void;
  generate(id: string, prompt: string): Promise<void>;
  publishDraft(id: string): void;
  discardDraft(id: string): void;
  markRead(id: string): void;
  toggleTask(id: string): void;
  readCatchUp(): void;
  clearNotice(): void;
}
export const useWorkspace = create<State>()(
  persist(
    (set, get) => ({
      profile: initialProfile,
      mode: "copilot",
      conversations: initialConversations,
      catchUp: initialCatchUp,
      read: false,
      hydrated: false,
      storageError: null,
      notice: null,
      drafts: {},
      pending: {},
      errors: {},
      clearNotice: () => set({ notice: null }),
      updateProfile: (patch) =>
        set((s) => ({
          profile: { ...s.profile, ...patch },
          drafts: {},
          pending: {},
          errors: {},
          conversations: s.conversations.map((c) => ({
            ...c,
            epoch: c.epoch + 1,
          })),
          notice: "Контекст Alter обновлён. Разрешения не изменились.",
        })),
      setMode: (mode) =>
        set((s) => ({
          mode,
          drafts: {},
          pending: {},
          errors: {},
          conversations: s.conversations.map((c) => ({
            ...c,
            epoch: c.epoch + 1,
            controller: mode === "self" || !c.aiAllowed ? "human" : "ai",
          })),
          notice:
            mode === "self"
              ? "Ты на связи. Все диалоги под твоим управлением."
              : mode === "copilot"
                ? "Alter готовит ответы. Ты подтверждаешь публикацию."
                : "Alter подключён к разрешённым диалогам.",
        })),
      takeOver: (id) =>
        set((s) => ({
          mode: "self",
          drafts: {},
          pending: {},
          errors: {},
          conversations: s.conversations.map((c) => ({
            ...c,
            controller: "human",
            epoch: c.epoch + 1,
            messages:
              c.id === id
                ? [
                    ...c.messages,
                    {
                      id: uid(),
                      author: "system",
                      authorName: "",
                      body: "Александра перехватила диалог. Alter на паузе.",
                      time: time(),
                    },
                  ]
                : c.messages,
          })),
          notice: "Диалог у тебя. Следующее сообщение — от твоего имени.",
        })),
      chooseAuthor: (id, author) =>
        set((s) => {
          const c = s.conversations.find((c) => c.id === id);
          if (!c || (author === "ai" && !c.aiAllowed))
            return { notice: "Alter не получил разрешение для этого диалога." };
          return {
            mode: author === "ai" && s.mode === "self" ? "copilot" : s.mode,
            drafts: { ...s.drafts, [id]: undefined },
            pending: { ...s.pending, [id]: false },
            errors: { ...s.errors, [id]: undefined },
            conversations: s.conversations.map((c) =>
              c.id === id
                ? { ...c, controller: author, epoch: c.epoch + 1 }
                : c,
            ),
          };
        }),
      markRead: (id) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === id ? { ...c, unread: 0 } : c,
          ),
        })),
      sendHuman: (id, text) => {
        if (!text.trim()) return;
        set((s) => ({
          drafts: { ...s.drafts, [id]: undefined },
          pending: { ...s.pending, [id]: false },
          conversations: s.conversations.map((c) =>
            c.id === id
              ? {
                  ...c,
                  controller: "human",
                  epoch: c.epoch + 1,
                  messages: [
                    ...c.messages,
                    {
                      id: uid(),
                      author: "human",
                      authorName: "Александра",
                      body: text.trim(),
                      time: time(),
                    },
                  ],
                }
              : c,
          ),
        }));
      },
      generate: async (id, prompt) => {
        const snapshot = get();
        const c = snapshot.conversations.find((c) => c.id === id);
        if (!c || !mayGenerate(c, snapshot.mode) || snapshot.pending[id])
          return;
        const epoch = c.epoch;
        set((s) => ({
          pending: { ...s.pending, [id]: true },
          errors: { ...s.errors, [id]: undefined },
          drafts: { ...s.drafts, [id]: undefined },
        }));
        try {
          const body = await mockAIService.generate({
            profile: { ...snapshot.profile },
            conversation: c,
            prompt,
            mode: snapshot.mode,
          });
          const current = get();
          const latest = current.conversations.find((c) => c.id === id);
          if (!latest || !mayPublish(latest, epoch, current.mode)) return;
          if (requiresApproval(current.profile, current.mode)) {
            set((s) => ({
              drafts: { ...s.drafts, [id]: { body, epoch } },
              pending: { ...s.pending, [id]: false },
            }));
          } else {
            set((s) => ({
              pending: { ...s.pending, [id]: false },
              conversations: s.conversations.map((c) =>
                c.id === id
                  ? {
                      ...c,
                      messages: [
                        ...c.messages,
                        {
                          id: uid(),
                          author: "ai",
                          authorName: "Alter Александры",
                          body,
                          time: time(),
                        },
                      ],
                    }
                  : c,
              ),
            }));
          }
        } catch (error) {
          if (get().conversations.find((c) => c.id === id)?.epoch !== epoch)
            return;
          set((s) => ({
            pending: { ...s.pending, [id]: false },
            errors: {
              ...s.errors,
              [id]:
                error instanceof Error
                  ? error.message
                  : "Не удалось подготовить ответ. Попробуй ещё раз.",
            },
          }));
        }
      },
      publishDraft: (id) => {
        const s = get();
        const c = s.conversations.find((c) => c.id === id);
        const draft = s.drafts[id];
        if (!c || !draft || !mayPublish(c, draft.epoch, s.mode)) return;
        set((s) => ({
          drafts: { ...s.drafts, [id]: undefined },
          conversations: s.conversations.map((c) =>
            c.id === id
              ? {
                  ...c,
                  messages: [
                    ...c.messages,
                    {
                      id: uid(),
                      author: "ai",
                      authorName: "Alter Александры",
                      body: draft.body,
                      time: time(),
                    },
                  ],
                }
              : c,
          ),
        }));
      },
      discardDraft: (id) =>
        set((s) => ({ drafts: { ...s.drafts, [id]: undefined } })),
      toggleTask: (id) =>
        set((s) => ({
          catchUp: s.catchUp.map((item) =>
            item.id === id && item.type === "task"
              ? { ...item, done: !item.done }
              : item,
          ),
        })),
      readCatchUp: () =>
        set({ read: true, notice: "Сводка отмечена прочитанной." }),
    }),
    {
      name: "alter-ego-workspace",
      version: 1,
      storage: createJSONStorage(() => storage),
      skipHydration: true,
      partialize: (s) => ({
        profile: s.profile,
        mode: s.mode,
        conversations: s.conversations,
        catchUp: s.catchUp,
        read: s.read,
      }),
      onRehydrateStorage: () => (state, error) => {
        useWorkspace.setState({
          hydrated: true,
          storageError: error
            ? "Не удалось восстановить настройки. Продолжаем с демонстрационными данными."
            : null,
        });
      },
    },
  ),
);
