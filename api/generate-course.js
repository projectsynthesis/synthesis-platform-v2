// api/generate-course.js - ПЪЛНА ДИАГНОСТИКА
console.log('🎯 API функцията се зарежда...');
console.log('🔍 Проверка на environment variables:');
console.log('- GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ НАЛИЧЕН' : '❌ ЛИПСВА');
console.log('- GEMINI_API_KEY първи знаци:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + '...' : 'НЯМА');

let genAI = null;
let geminiAvailable = false;

// Опитваме да импортираме Gemini
try {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    geminiAvailable = true;
    console.log('✅ Gemini AI инициализиран УСПЕШНО!');
  } else {
    console.log('❌ GEMINI_API_KEY не е намерен в environment variables');
  }
} catch (importError) {
  console.log('❌ Грешка при импорт на Gemini:', importError.message);
}

export default async function handler(req, res) {
  console.log('=== НОВА ЗАЯВКА ===', req.method, req.body);
  
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

    // ДЕМО КУРС
    const demoCourse = `🎯 КУРС: ${topic}
📚 СТИЛ: ${style}

Демо версия - Gemini AI се конфигурира...`;

    // ОПИТ ЗА GEMINI AI
    if (geminiAvailable && genAI) {
      console.log('🔄 Извиквам Gemini AI...');
      
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `Напиши кратък учебен курс на БЪЛГАРСКИ език по тема: "${topic}". Стил: ${style}. Бъди полезен и практичен.`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiContent = response.text();
        
        console.log('✅ GEMINI УСПЕХ! Дължина на отговора:', aiContent.length);
        
        return res.status(200).json({
          success: true,
          course: aiContent,
          note: "✅ Генерирано с Google Gemini AI!"
        });

      } catch (geminiError) {
        console.log('❌ Gemini грешка:', geminiError.message);
        // Продължаваме към демо версия
      }
    } else {
      console.log('❌ Gemini не е наличен. Причина:', {
        geminiAvailable,
        hasGenAI: !!genAI,
        hasAPIKey: !!process.env.GEMINI_API_KEY
      });
    }

    // ВРЪЩАМЕ ДЕМО ВЕРСИЯ
    console.log('📝 Връщам демо версия');
    
    return res.status(200).json({
      success: true,
      course: demoCourse,
      note: `🔧 Gemini статус: ${geminiAvailable ? 'Грешка при извикване' : 'Не е конфигуриран'}`
    });

  } catch (error) {
    console.error('💥 КРИТИЧНА ГРЕШКА:', error);
    
    return res.status(200).json({
      success: true,
      course: `Курс по ${req.body?.topic || 'неизвестна тема'}. Грешка в системата.`,
      note: "⚠️ Временна техническа грешка"
    });
  }
}
