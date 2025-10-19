export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic, style } = req.body;

  // ВИНАГИ връщаме успешен отговор с демо съдържание
  const demoCourse = `
🎯 КУРС: ${topic}
📚 СТИЛ: ${style}

✅ УСПЕШНО СЪЗДАДЕН КУРС!

ЗАГЛАВИЕ: "Професионален курс по ${topic}"
ОПИСАНИЕ: Този курс е създаден специално за теб според избрания стил на обучение.

МОДУЛ 1: ОСНОВИ НА ${topic.toUpperCase()}
✓ Урок 1: Въведение и основни понятия
✓ Урок 2: Ключови принципи и техники
✓ Урок 3: Практически упражнения
🎯 Упражнение: Приложи знанията в реална ситуация

МОДУЛ 2: РАЗШИРЕНИ ВЪЗМОЖНОСТИ
✓ Урок 1: Напреднали стратегии
✓ Урок 2: Оптимизация на резултатите
✓ Урок 3: Избягване на често срещани грешки
🎯 Упражнение: Създай свой проект

МОДУЛ 3: МАЙСТОРСТВО
✓ Урок 1: Експертни техники
✓ Урок 2: Приложение в различни контексти
✓ Урок 3: Продължаване на развитието
🎯 Финален проект: Приложи всичко научено

📞 За повече информация: AI функционалността се настройва...
`;

  // Симулираме мрежово забавяне
  await new Promise(resolve => setTimeout(resolve, 1500));

  res.status(200).json({
    success: true,
    course: demoCourse,
    note: "Това е демо версия. AI ще бъде добавена скоро!"
  });
}
