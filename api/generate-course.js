// api/generate-course.js - HUGGING FACE ВЕРСИЯ
console.log('=== 🤗 HUGGING FACE AI СИСТЕМА ===');

// Проверка на environment variables
console.log('🔍 Проверка на environment variables:');
console.log('- HUGGING_FACE_TOKEN:', process.env.HUGGING_FACE_TOKEN ? '✅ НАЛИЧЕН' : '❌ ЛИПСВА');

// ФУНКЦИЯ ЗА HUGGING FACE AI
async function generateWithHuggingFace(topic, style) {
  console.log(`🤗 Извиквам Hugging Face AI за: ${topic} (${style})`);
  
  try {
    // Използваме по-добър модел за текстова генерация
    const response = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: `Създай кратък учебен курс на български език по тема: ${topic}. 
          Стил на обучение: ${style}.
          Курсът трябва да включва:
          - Заглавие
          - Описание  
          - 3-4 модула с уроци
          - Практически упражнения
          Бъди полезен и практичен.`,
          parameters: {
            max_length: 1000,
            temperature: 0.7,
            do_sample: true
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP грешка! статус: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Hugging Face отговор получен:', result);
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    if (result[0] && result[0].generated_text) {
      return result[0].generated_text;
    } else {
      throw new Error('Неочакван формат на отговор от Hugging Face');
    }
    
  } catch (error) {
    console.log('❌ Hugging Face грешка:', error.message);
    throw error;
  }
}

// ДЕМО ФАЛБАК ФУНКЦИЯ
function generateDemoCourse(topic, style) {
  return `🎯 КУРС: ${topic}
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
}

module.exports = async function handler(req, res) {
  console.log('=== 🌐 HUGGING FACE - НОВА ЗАЯВКА ===');
  
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

    // ОПИТВАНЕ С HUGGING FACE AI
    if (process.env.HUGGING_FACE_TOKEN) {
      console.log('🔄 Опитвам се да извикам Hugging Face AI...');
      
      try {
        const aiContent = await generateWithHuggingFace(topic, style);
        
        console.log('✅ HUGGING FACE AI УСПЕШЕН ОТГОВОР!');
        
        return res.status(200).json({
          success: true,
          course: aiContent,
          note: "✅ Генерирано с Hugging Face AI!"
        });

      } catch (hfError) {
        console.log('❌ Hugging Face AI грешка:', hfError.message);
        // Продължаваме към демо версия
      }
    } else {
      console.log('❌ HUGGING_FACE_TOKEN не е намерен');
    }

    // ВРЪЩАМЕ ДЕМО ВЕРСИЯ
    console.log('📝 Връщам демо версия');
    const demoCourse = generateDemoCourse(topic, style);
    
    return res.status(200).json({
      success: true,
      course: demoCourse,
      note: process.env.HUGGING_FACE_TOKEN ? "⚠️ Временна демо версия (Hugging Face грешка)" : "🔧 Hugging Face не е конфигуриран"
    });

  } catch (error) {
    console.error('💥 Неочаквана грешка:', error);
    
    return res.status(200).json({
      success: true,
      course: generateDemoCourse(req.body?.topic || 'неизвестна тема', req.body?.style || 'практически'),
      note: "⚠️ Критична грешка в системата"
    });
  }
};
