import { AIService } from "../domain/types";
import { isCommitment } from "../domain/policies";

export const mockAIService: AIService = {
  async generate({ profile, conversation, prompt }) {
    await new Promise((resolve) => setTimeout(resolve, 950));
    if (!conversation.aiAllowed)
      throw new Error("Этот диалог не разрешён для Alter.");
    if (isCommitment(prompt))
      return "Это новое обязательство. Я сохранил вопрос для Александры: срок и объём должен подтвердить человек. От её имени обещаний не даю.";
    if (!profile.memorySources.length)
      return "У меня нет подключённых источников памяти. Чтобы не придумывать факты, передаю вопрос Александре. Можно подключить рабочий контекст в Identity → Memory.";
    const lead =
      profile.grade === "Lead" ? "Как направление для команды: " : "";
    const hello =
      profile.tone === "friendly"
        ? "Да, давай! "
        : profile.tone === "formal"
          ? "По доступному рабочему контексту: "
          : "";
    let body: string;
    if (/пуст|нов.*пользоват/i.test(prompt))
      body =
        "Для пустого состояния предлагаю короткое объяснение, пример результата и одно основное действие «Создать первый проект». Это предложение, финальный вариант согласует Александра.";
    else if (/сводк|итог|контекст/i.test(prompt))
      body = `В «${conversation.title}» обсуждаем ${conversation.topic === "design" ? "онбординг из трёх шагов и пустые состояния" : conversation.topic === "system" ? "обновлённые компоненты и доступность" : "результаты исследования"}. Открытые решения ждут Александру.`;
    else if (/токен|компонент|контраст/i.test(prompt))
      body = profile.memorySources.includes("brand")
        ? "В подключённой дизайн-системе задана область нажатия от 44 px. Предлагаю использовать актуальные токены и проверить контраст текста и focus-состояния."
        : "Дизайн-система отключена в Memory. Не могу подтвердить значения токенов; передаю проверку Александре.";
    else if (conversation.topic === "design")
      body =
        "Предлагаю проверить трёхшаговый онбординг на прототипе и отдельно разобрать пустые состояния. Объём и сроки оставляю на подтверждение Александры.";
    else
      body =
        "Предлагаю зафиксировать открытые вопросы и проверить решение по доступным рабочим материалам. Александра подтвердит итог, когда вернётся.";
    return (
      hello +
      lead +
      body +
      (profile.detail === "detailed"
        ? "\n\nСледующий шаг: собрать обратную связь команды, сверить её с рабочими материалами и передать человеку вопросы, требующие решения."
        : "")
    );
  },
};
