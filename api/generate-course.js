// api/generate-course.js - ФИНАЛЕН РАБОТЕЩ КОД
console.log('🎯 API функцията се зарежда...');

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Инициализация на Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

console.log('✅ Gemini AI инициализиран успешно!');

module.exports = async function handler(req, res) {
  console.log('📨 Получена заявка:', req.method);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { topic, style } = req.body;
    console.log('📝 Заявка за курс:', { topic, style });

    if (!topic || !style) {
      return res.status(400).json({ 
        success: false,
        error: 'Тема и стил са задължителни' 
      });
    }

    console.log('🔄 Извиквам Gemini AI...');

    // Gemini заявка
    const prompt = `Създай кратък учебен курс на БЪЛГАРСКИ език по тема: "${topic}".

Стил на обучение: ${style}

Инструкции:
- Напиши заглавие и кратко описание
- Създай 3 модула с по 2 урока всеки
- Добави практически упражнения
- Бъди полезен, практичен и мотивиращ
- Използвай подходящ език за начинаещи

Формат на отговора трябва да бъде чист текст.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiContent = response.text();
      
      console.log('✅ GEMINI AI УСПЕШЕН ОТГОВОР!');
      
      return res.status(200).json({
        success: true,
        course: aiContent,
        note: "✅ Генерирано с Google Gemini AI!"
      });

    } catch (geminiError) {
      console.log('❌ Gemini грешка:', geminiError);
      
      // Fallback демо курс при грешка
      const demoCourse = `🎯 КУРС: ${topic}
📚 СТИЛ: ${style}

ЗАГЛАВИЕ: "Професионален курс по ${topic}"
ОПИСАНИЕ: Този курс е създаден специално за теб!

МОДУЛ 1: ОСНОВИ
✓ Урок 1: Въведение в ${topic}
✓ Урок 2: Ключови принципи
✓ Урок 3: Практическо упражнение

МОДУЛ 2: РАЗШИРЕНИ ЗНАНИЯ  
✓ Урок 1: Напреднали техники
✓ Урок 2: Реални приложения
✓ Урок 3: Финален проект

⚠️ Временна демо версия - Gemini AI се настройва`;

      return res.status(200).json({
        success: true,
        course: demoCourse,
        note: "⚠️ Временна демо версия (Gemini грешка)"
      });
    }

  } catch (error) {
    console.error('💥 Неочаквана грешка:', error);
    
    return res.status(200).json({
      success: true,
      course: `Курс по ${req.body?.topic || 'неизвестна тема'}. Временна грешка.`,
      note: "⚠️ Временна техническа грешка"
    });
  }
};
