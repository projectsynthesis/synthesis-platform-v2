// api/generate-course.js - OPENAI С ПЪЛНА ЗАЩИТА
import OpenAI from 'openai';

console.log('🔧 API функцията се зарежда с OpenAI...');

// Инициализация на OpenAI С ЗАЩИТА
let openai;
try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('✅ OpenAI инициализиран успешно');
  } else {
    console.log('❌ OPENAI_API_KEY липсва в environment variables');
  }
} catch (error) {
  console.log('❌ Грешка при инициализация на OpenAI:', error.message);
}

export default async function handler(req, res) {
  console.log('=== API CALL STARTED ===');
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { topic, style } = req.body;
    console.log('Заявка за курс:', { topic, style });

    if (!topic || !style) {
      return res.status(400).json({ 
        success: false,
        error: 'Topic and style are required' 
      });
    }

    // ДЕМО КУРС (fallback)
    const demoCourse = `
🎯 КУРС: ${topic}
📚 СТИЛ: ${style}

ЗАГЛАВИЕ: "Професионален курс по ${topic}"
ОПИСАНИЕ: Този курс е създаден специално за теб според избрания стил на обучение.

МОДУЛ 1: ОСНОВИ
✓ Урок 1: Въведение в ${topic}
✓ Урок 2: Ключови принципи
✓ Урок 3: Практическо упражнение

МОДУЛ 2: РАЗШИРЕНИ ЗНАНИЯ  
✓ Урок 1: Напреднали техники
✓ Урок 2: Реални приложения
✓ Урок 3: Финален проект

🚀 OpenAI интеграцията се настройва...
`;

    // ОПИТВАНЕ ДА ИЗПОЛЗВАМЕ OPENAI
    if (openai) {
      console.log('🔄 Опитвам се да извикам OpenAI...');
      
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "Ти си учител. Напиши кратък учебен курс на български език."
            },
            {
              role: "user", 
              content: `Напиши кратък курс по ${topic} в стил ${style}. Включи заглавие, описание и няколко урока.`
            }
          ],
          max_tokens: 600,
          temperature: 0.7,
        });

        const aiContent = completion.choices[0].message.content;
        console.log('✅ OPENAI УСПЕШЕН ОТГОВОР!');
        
        return res.status(200).json({
          success: true,
          course: aiContent,
          note: "✅ Генерирано с изкуствен интелект!"
        });

      } catch (openaiError) {
        console.log('❌ OpenAI грешка:', openaiError.message);
        // При грешка в OpenAI, връщаме демо версия
      }
    }

    // АКО OPENAI НЕ РАБОТИ - ВРЪЩАМЕ ДЕМО ВЕРСИЯ
    console.log('📝 Връщам демо версия');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return res.status(200).json({
      success: true,
      course: demoCourse,
      note: openai ? "⚠️ Временна демо версия (OpenAI грешка)" : "🔧 OpenAI не е конфигуриран"
    });

  } catch (error) {
    console.error('❌ Неочаквана грешка:', error);
    
    return res.status(200).json({
      success: true,
      course: `Курс по ${req.body.topic}. Временна грешка в системата.`,
      note: "⚠️ Временна техническа грешка"
    });
  }
}
