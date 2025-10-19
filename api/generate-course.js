
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic, style } = req.body;

  if (!topic || !style) {
    return res.status(400).json({ 
      success: false,
      error: 'Липсва тема или стил на обучение' 
    });
  }

  // Fallback демо съдържание (ако OpenAI не работи)
  const demoFallback = `
🎯 КУРС: ${topic}
📚 СТИЛ: ${style}

ЗАГЛАВИЕ: "Резервен курс по ${topic}"
ОПИСАНИЕ: OpenAI услугата временно не е налична. Това е автоматично генериран курс.

МОДУЛ 1: ОСНОВИ
• Урок 1: Въведение в ${topic}
• Урок 2: Основни принципи
• Урок 3: Практическо упражнение

МОДУЛ 2: РАЗШИРЕНИ ЗНАНИЯ
• Урок 1: Напреднали техники
• Урок 2: Реални приложения
• Урок 3: Финален проект

⚠️ OpenAI интеграцията временно не е налична. Работим по решението!
`;

  try {
    console.log('Извикване на OpenAI за тема:', topic);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Ти си експерт по образователни технологии и instructional design.
          Създаваш висококачествени учебни курсове на БЪЛГАРСКИ език.
          Към всеки курс включваш:
          - Заглавие и описание
          - 3-4 модула с ясни учебни цели
          - По 2-3 урока за всеки модул  
          - Практически упражнения
          - Ключови изводи

          Стилът трябва да е мотивиращ, професионален и лесен за разбиране.`
        },
        {
          role: "user",
          content: `Създай подробен учебен курс на БЪЛГАРСКИ език по тема: "${topic}".

          Стил на обучение: ${style}

          Инструкции за стила:
          ${style === 'практически' ? 'Фокусирай се върху упражнения, практически задачи и реални приложения.' : ''}
          ${style === 'теоретичен' ? 'Наблегни на теория, концепции, анализи и фундаментални принципи.' : ''}
          ${style === 'интерактивен' ? 'Комбинирай теория и практика, включвай дискусии и взаимодействия.' : ''}
          ${style === 'кратък и ясен' ? 'Бъди директен, фокусиран върху най-важното, изберивай ненужни подробности.' : ''}

          Структура на курса:
          1. ЗАГЛАВИЕ И ОПИСАНИЕ
          2. 3-4 МОДУЛА със заглавия
          3. По 2-3 УРОКА във всеки модул
          4. ПРАКТИЧЕСКИ УПРАЖНЕНИЯ
          5. КЛЮЧОВИ ИЗВОДИ

          Генерирай съдържание, което е полезно, приложимо и engaging.`
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const aiContent = completion.choices[0].message.content;

    console.log('OpenAI отговор получен успешно!');

    res.status(200).json({
      success: true,
      course: aiContent,
      note: "✅ Този курс е генериран с изкуствен интелект!"
    });

  } catch (error) {
    console.error('ГРЕШКА в OpenAI:', error);

    // Връщаме демо версия при грешка
    res.status(200).json({
      success: true,
      course: demoFallback,
      note: "⚠️ Временна демо версия. AI функционалността се възстановява."
    });
  }
}
