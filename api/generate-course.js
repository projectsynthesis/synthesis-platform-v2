// api/generate-course.js - GOOGLE GEMINI ВЕРСИЯ
import { GoogleGenerativeAI } from '@google/generative-ai';

console.log('🔧 Зареждам Gemini AI...');

let genAI;
let geminiInitialized = false;

try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    geminiInitialized = true;
    console.log('✅ Gemini AI инициализиран успешно!');
  } else {
    console.log('❌ GEMINI_API_KEY липсва');
  }
} catch (error) {
  console.log('❌ Грешка при инициализация на Gemini:', error.message);
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
        error: 'Тема и стил са задължителни' 
      });
    }

    // ДЕМО КУРС (fallback)
    const demoCourse = `
🎯 КУРС: ${topic}
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

🚀 Генерирано със системата!
`;

    // ОПИТВАНЕ ДА ИЗПОЛЗВАМЕ GEMINI AI
    if (geminiInitialized && genAI) {
      console.log('🔄 Опитвам се да извикам Gemini AI...');
      
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `Напиши кратък учебен курс на БЪЛГАРСКИ език по тема: "${topic}".
        
        Стил на обучение: ${style}
        
        Инструкции:
        - Бъди полезен и практичен
        - Включи заглавие, описание и 3-4 модула
        - Всеки модул да има 2-3 урока
        - Добави практически упражнения
        - Пиши на разбираем български език
        
        Формат на отговора трябва да бъде чист текст, подходящ за показване в уеб приложение.`;
        
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
        console.log('❌ Gemini грешка:', geminiError.message);
        // При грешка, връщаме демо версия
      }
    }

    // АКО GEMINI НЕ РАБОТИ - ВРЪЩАМЕ ДЕМО ВЕРСИЯ
    console.log('📝 Връщам демо версия');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return res.status(200).json({
      success: true,
      course: demoCourse,
      note: geminiInitialized ? "⚠️ Временна демо версия (Gemini грешка)" : "🔧 Gemini AI не е конфигуриран"
    });

  } catch (error) {
    console.error('❌ Неочаквана грешка:', error);
    
    return res.status(200).json({
      success: true,
      course: `Курс по ${req.body?.topic || 'неизвестна тема'}. Временна грешка в системата.`,
      note: "⚠️ Временна техническа грешка"
    });
  }
}
