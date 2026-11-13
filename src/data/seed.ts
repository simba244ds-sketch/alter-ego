import { CatchUpItem, Conversation, Profile } from "../domain/types";
import { colors } from "../theme/tokens";

export const initialProfile: Profile = {
  name: "Александра",
  role: "Product Designer",
  grade: "Junior",
  tone: "friendly",
  detail: "brief",
  autonomy: "approval",
  memorySources: ["brand", "project"],
  relationshipIds: ["platform", "design"],
};
export const memorySources = [
  {
    id: "brand",
    title: "Дизайн-система",
    detail: "Компоненты, токены и принципы · 24 документа",
  },
  {
    id: "project",
    title: "Проект Platform",
    detail: "Решения и контекст текущего спринта · 12 документов",
  },
  {
    id: "notes",
    title: "Рабочие заметки",
    detail: "Личные заметки по проектам · 8 документов",
  },
];
export const relationships = [
  {
    id: "platform",
    title: "Команда Platform",
    detail: "Марк, Аня, Никита · продуктовая команда",
  },
  {
    id: "design",
    title: "Design guild",
    detail: "Лена, Дима · дизайн-сообщество",
  },
  {
    id: "research",
    title: "Research team",
    detail: "Оля, Максим · исследования",
  },
];
export const initialConversations: Conversation[] = [
  {
    id: "platform",
    title: "Platform / редизайн",
    subtitle: "Марк, Аня, Никита и ты",
    topic: "design",
    color: colors.lavender,
    participants: ["Марк", "Аня", "Никита"],
    aiAllowed: true,
    controller: "ai",
    unread: 2,
    epoch: 0,
    messages: [
      {
        id: "p1",
        author: "colleague",
        authorName: "Марк",
        body: "Команда, посмотрели новый онбординг. Предлагаю оставить три шага вместо пяти — так быстрее дойдём до первой ценности.",
        time: "10:24",
      },
      {
        id: "p2",
        author: "ai",
        authorName: "Alter Александры",
        body: "В дизайн-ревью мы уже обсуждали сокращение. Три шага согласуются с текущим прототипом. Финальное решение по объёму остаётся за Александрой.",
        time: "10:26",
      },
      {
        id: "p3",
        author: "colleague",
        authorName: "Аня",
        body: "Отлично! А что делаем с пустыми состояниями? Нужен вариант для нового пользователя.",
        time: "10:32",
      },
    ],
  },
  {
    id: "design",
    title: "Design guild",
    subtitle: "Лена, Дима и ты",
    topic: "system",
    color: colors.pink,
    participants: ["Лена", "Дима"],
    aiAllowed: true,
    controller: "ai",
    unread: 1,
    epoch: 0,
    messages: [
      {
        id: "d1",
        author: "colleague",
        authorName: "Лена",
        body: "Обновили токены: минимальная область нажатия теперь 44 px. Можем использовать новые компоненты?",
        time: "09:45",
      },
      {
        id: "d2",
        author: "ai",
        authorName: "Alter Александры",
        body: "В доступной дизайн-системе есть обновлённые компоненты. Предлагаю проверить контраст и состояния на mobile перед передачей в разработку.",
        time: "09:48",
      },
    ],
  },
  {
    id: "launch",
    title: "Запуск / Q4",
    subtitle: "Никита, Оля и ты",
    topic: "launch",
    color: colors.lime,
    participants: ["Никита", "Оля"],
    aiAllowed: false,
    controller: "human",
    unread: 1,
    epoch: 0,
    messages: [
      {
        id: "l1",
        author: "colleague",
        authorName: "Никита",
        body: "Саша, можем подтвердить пятницу как дату передачи финальных макетов? Нужна твоя оценка.",
        time: "11:08",
      },
    ],
  },
  {
    id: "research",
    title: "Исследования",
    subtitle: "Оля, Максим и ты",
    topic: "research",
    color: "#A9C7CF",
    participants: ["Оля", "Максим"],
    aiAllowed: false,
    controller: "human",
    unread: 0,
    epoch: 0,
    messages: [
      {
        id: "r1",
        author: "colleague",
        authorName: "Оля",
        body: "Загрузили результаты пяти интервью. Ключевой инсайт: новым пользователям не хватает примеров на первом шаге.",
        time: "Вчера",
      },
    ],
  },
];
export const initialCatchUp: CatchUpItem[] = [
  {
    id: "c1",
    type: "decision",
    title: "Онбординг стал короче",
    body: "Команда выбрала направление: три шага вместо пяти. Финальный объём ждёт твоего подтверждения.",
    conversationId: "platform",
    time: "10:26",
    done: false,
  },
  {
    id: "c2",
    type: "question",
    title: "Как покажем пустые состояния?",
    body: "Аня ждёт вариант для нового пользователя. Alter сохранил вопрос для тебя.",
    conversationId: "platform",
    time: "10:32",
    done: false,
  },
  {
    id: "c3",
    type: "task",
    title: "Проверить новые компоненты",
    body: "Проверить контраст и области нажатия в обновлённой дизайн-системе. Предложение Alter, без принятого обязательства.",
    conversationId: "design",
    time: "09:48",
    done: false,
  },
  {
    id: "c4",
    type: "question",
    title: "Подтвердить срок передачи",
    body: "Никита предлагает пятницу. Alter не обещал срок от твоего имени — решение за тобой.",
    conversationId: "launch",
    time: "11:08",
    done: false,
  },
];
