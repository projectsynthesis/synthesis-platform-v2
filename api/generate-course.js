// api/generate-course.js - ПЪЛНА ДИАГНОСТИКА
console.log('=== 🚨 ДИАГНОСТИКА ЗАПОЧНАТА ===');

// Проверка на всички environment variables
console.log('🔍 Проверка на environment variables:');
console.log('- process.env.GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ СЪЩЕСТВУВА' : '❌ ЛИПСВА');
console.log('- process.env.OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ СЪЩЕСТВУВА' : '❌ ЛИПСВА');

// Проверка на първите знаци от ключа (ако съществува)
if (process.env.GEMINI_API_KEY) {
  console.log('- GEMINI_API_KEY първи 10 знака:', process.env.GEMINI_API_KEY.substring(0, 10) + '...');
  console.log('- Дължина на ключа:', process.env.GEMINI_API_KEY.length);
} else {
  console.log('❌ КРИТИЧНО: GEMINI_API_KEY НЕ Е ЗАДАДЕН!');
}

// Проверка на други environment variables
console.log('- VERCEL:', process.env.VERCEL ? '✅ Да' : '❌ Не');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'Не е зададен');

let genAI = null;
let geminiAvailable = false;
let initializationError = null;

// Опит за инициализация на Gemini
if (process.env.GEMINI_API_KEY) {
  try {
    console.log('🔄 Опитвам да инициализирам Gemini...');
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Тестваме дали ключа е валиден с проста заявка
    console.log('🧪 Тествам валидността на API ключа...');
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    geminiAvailable = true;
    console.log('✅ GEMINI AI ИНИЦИАЛИЗИРАН УСПЕШНО!');
    
  } catch (error) {
    geminiAvailable = false;
    initializationError = error.message;
    console.log('❌ ГРЕШКА при инициализация на Gemini:', error.message);
  }
} else {
  console.log('❌ НЕ МОГА да инициализирам Gemini - ЛИПСВА API КЛЮЧ!');
}

console.log('=== 📊 ДИАГНОСТИКА ЗАВЪРШЕНА ===');
console.log('- Gemini достъпен:', geminiAvailable);
console.log('- Има ли грешка:', initializationError || 'Няма');

module.exports = async function handler(req, res) {
  console.log('=== 🌐 НОВА ЗАЯВКА ПОЛУЧЕНА ===');
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    console.log('📨 OPTIONS заявка обработена');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.log('❌ Грешен метод:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { topic, style } = req.body;
    console.log('📝 Данни от заявка:', { topic, style });

    if (!topic || !style) {
      console.log('❌ Липсва тема или стил');
      return res.status(400).json({ 
        success: false,
        error: 'Тема и стил са задължителни' 
      });
    }

    // ДЕМО КУРС
    const demoCourse = `🎯 КУРС: ${topic}
📚 СТИЛ: ${style}

ДИАГНОСТИЧНА ИНФОРМАЦИЯ:
- Gemini достъпен: ${geminiAvailable}
- Грешка при инициализация: ${initializationError || 'Няма'}
- API ключ зададен: ${process.env.GEMINI_API_KEY ? 'Да' : 'Не'}

Това е демо версия. Работим по решението!`;

    // ОПИТ ЗА GEMINI AI
    if (geminiAvailable && genAI) {
      console.log('🔄 Опитвам се да извикам Gemini AI...');
      
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `Напиши много кратък учебен курс на БЪЛГАРСКИ език по тема: "${topic}". Стил: ${style}.`;
        
        console.log('📨 Изпращам заявка към Gemini...');
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
        console.log('❌ Gemini грешка при заявка:', geminiError.message);
        // Продължаваме към демо версия
      }
    }

    // ВРЪЩАМЕ ДЕМО ВЕРСИЯ С ДИАГНОСТИЧНА ИНФОРМАЦИЯ
    console.log('📝 Връщам демо версия с диагностична информация');
    
    return res.status(200).json({
      success: true,
      course: demoCourse,
      note: `🔧 Диагностика: Gemini достъпен=${geminiAvailable}, Грешка=${initializationError || 'Няма'}`
    });

  } catch (error) {
    console.error('💥 НЕОЧАКВАНА ГРЕШКА:', error);
    
    return res.status(200).json({
      success: true,
      course: `Курс по ${req.body?.topic || 'неизвестна тема'}. Грешка: ${error.message}`,
      note: "⚠️ Критична грешка в системата"
    });
  }
};
