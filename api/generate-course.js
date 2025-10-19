// api/generate-course.js - GROQ AI ИНТЕГРАЦИЯ
console.log('=== 🚀 GROQ AI СИСТЕМА ===');

// Проверка на environment variables
console.log('🔍 Проверка на environment variables:');
console.log('- GROQ_API_KEY:', process.env.GROQ_API_KEY ? '✅ НАЛИЧЕН' : '❌ ЛИПСВА');

// ФУНКЦИЯ ЗА GROQ AI
async function generateWithGroq(topic, style) {
  console.log(`🚀 Извиквам Groq AI за: ${topic} (${style})`);
  
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // Бърз и безплатен
        messages: [
          {
            role: 'system',
            content: `Ти си експерт по образователни технологии. Създаваш висококачествени учебни курсове на БЪЛГАРСКИ език.
            
            ИНСТРУКЦИИ:
            - ВИНАГИ отговаряй на БЪЛГАРСКИ език
            - Бъди полезен, практичен и структуриран
            - Използвай емотикони за по-добра визуализация
            - Създавай engaging и мотивиращо съдържание`
          },
          {
            role: 'user',
            content: `Създай подробен учебен курс на БЪЛГАРСКИ език по тема: "${topic}".

Стил на обучение: ${style}

СТРУКТУРА НА КУРСА:
🎯 Заглавие и вдъхновяващо описание
📂 3-4 модула със заглавия
📝 По 2-3 урока във всеки модул
🎯 Практически упражнения и задачи
💡 Ключови изводи и следващи стъпки

Бъди креативен, полезен и мотивиращ! Създай курс, който хората наистина ще намерят за полезен.`
          }
        ],
        max_tokens: 1500,
        temperature: 0.7,
        stream: false
      })
    });

    console.log('📡 Groq response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Groq error response:', errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Groq response received successfully!');
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const aiContent = data.choices[0].message.content;
      return aiContent;
    } else {
      throw new Error('Неочакван формат на отговор от Groq');
    }
    
  } catch (error) {
    console.log('❌ Groq AI грешка:', error.message);
    throw error;
  }
}

// АЛТЕРНАТИВНИ GROQ МОДЕЛИ
const GROQ_MODELS = [
  'llama-3.1-8b-instant',     // Най-бърз
  'llama-3.1-70b-versatile', // По-качествен
  'mixtral-8x7b-32768',      // Много добър
  'gemma2-9b-it'             // Алтернатива
];

async function tryAllGroqModels(topic, style) {
  for (const model of GROQ_MODELS) {
    try {
      console.log(`🧪 Опитвам Groq модел: ${model}`);
      
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: `Напиши кратък учебен курс по ${topic} в стил ${style} на български език.`
            }
          ],
          max_tokens: 800,
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.choices && data.choices[0] && data.choices[0].message) {
          console.log(`✅ УСПЕХ с Groq модел ${model}!`);
          return data.choices[0].message.content;
        }
      }
    } catch (error) {
      console.log(`❌ Groq модел ${model} не работи:`, error.message);
      continue;
    }
  }
  throw new Error('Всички Groq модели се провалиха');
}

// ДЕМО ФАЛБАК ФУНКЦИЯ
function generateDemoCourse(topic, style) {
  return `🎯 КУРС: ${topic}
📚 СТИЛ: ${style}

Groq AI се активира...

МОДУЛ 1: ОСНОВИ
✓ Урок 1: Въведение в ${topic}
✓ Урок 2: Ключови принципи
✓ Урок 3: Практическо упражнение

МОДУЛ 2: РАЗШИРЕНИ ЗНАНИЯ  
✓ Урок 1: Напреднали техники
✓ Урок 2: Реални приложения
✓ Урок 3: Финален проект

🚀 Groq AI функционалността идва...`;
}

module.exports = async function handler(req, res) {
  console.log('=== 🌐 GROQ AI - НОВА ЗАЯВКА ===');
  
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

    // ОПИТВАНЕ С GROQ AI
    if (process.env.GROQ_API_KEY) {
      console.log('🔄 Опитвам се да извикам Groq AI...');
      
      try {
        // Първо опитваме всички модели
        const aiContent = await tryAllGroqModels(topic, style);
        
        console.log('✅ GROQ AI УСПЕШЕН ОТГОВОР!');
        
        return res.status(200).json({
          success: true,
          course: aiContent,
          note: "✅ Генерирано с Groq AI!"
        });

      } catch (groqError) {
        console.log('❌ Groq AI грешка:', groqError.message);
        // Продължаваме към демо версия
      }
    } else {
      console.log('❌ GROQ_API_KEY не е намерен');
    }

    // ВРЪЩАМЕ ДЕМО ВЕРСИЯ
    console.log('📝 Връщам демо версия');
    const demoCourse = generateDemoCourse(topic, style);
    
    return res.status(200).json({
      success: true,
      course: demoCourse,
      note: process.env.GROQ_API_KEY ? "⚠️ Временна демо версия (Groq грешка)" : "🔧 Groq не е конфигуриран"
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
