// api/generate-course.js - УНИВЕРСАЛЕН КОД С ВСИЧКИ МОДЕЛИ
console.log('=== 🚨 УНИВЕРСАЛЕН КОД ЗА GEMINI ===');

// Проверка на environment variables
console.log('🔍 Проверка на environment variables:');
console.log('- GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ НАЛИЧЕН' : '❌ ЛИПСВА');

const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;
let geminiAvailable = false;

// Инициализация на Gemini
if (process.env.GEMINI_API_KEY) {
  try {
    console.log('🔄 Инициализирам Gemini AI...');
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    geminiAvailable = true;
    console.log('✅ Gemini AI инициализиран успешно!');
  } catch (error) {
    console.log('❌ Грешка при инициализация:', error.message);
  }
}

// Списък с всички възможни модели за тестване
const AVAILABLE_MODELS = [
  'gemini-1.5-flash',
  'gemini-1.5-pro', 
  'gemini-1.0-pro',
  'gemini-pro'
];

module.exports = async function handler(req, res) {
  console.log('=== 🌐 НОВА ЗАЯВКА ===');
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { topic, style } = req.body;
    console.log('📝 Заявка:', { topic, style });

    if (!topic || !style) {
      return res.status(400).json({ 
        success: false,
        error: 'Тема и стил са задължителни' 
      });
    }

    // ДЕМО КУРС (fallback)
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

🚀 Генерирано със системата!`;

    // ОПИТ ЗА GEMINI AI С ВСИЧКИ МОДЕЛИ
    if (geminiAvailable && genAI) {
      console.log('🔄 Опитвам се да извикам Gemini AI...');
      
      // Тестваме всички модели един по един
      for (const modelName of AVAILABLE_MODELS) {
        try {
          console.log(`🧪 Тествам модел: ${modelName}`);
          
          const model = genAI.getGenerativeModel({ 
            model: modelName
          });
          
          const prompt = `Напиши кратък учебен курс на БЪЛГАРСКИ език по тема: "${topic}". 
          Стил на обучение: ${style}.
          Бъди полезен, практичен и пише на разбираем български език.`;
          
          console.log(`📨 Изпращам заявка с модел ${modelName}...`);
          const result = await model.generateContent(prompt);
          const response = await result.response;
          const aiContent = response.text();
          
          console.log(`✅ УСПЕХ с модел ${modelName}!`);
          
          return res.status(200).json({
            success: true,
            course: aiContent,
            note: `✅ Генерирано с Google Gemini AI (${modelName})!`
          });
          
        } catch (modelError) {
          console.log(`❌ Модел ${modelName} не работи:`, modelError.message);
          // Продължаваме към следващия модел
          continue;
        }
      }
      
      console.log('❌ Всички модели се провалиха');
    }

    // ВРЪЩАМЕ ДЕМО ВЕРСИЯ
    console.log('📝 Връщам демо версия');
    
    return res.status(200).json({
      success: true,
      course: demoCourse,
      note: "🔧 Всички Gemini модели се провалиха. Работим по решението!"
    });

  } catch (error) {
    console.error('💥 Неочаквана грешка:', error);
    
    return res.status(200).json({
      success: true,
      course: `Курс по ${req.body?.topic || 'неизвестна тема'}. Грешка: ${error.message}`,
      note: "⚠️ Критична грешка в системата"
    });
  }
};
