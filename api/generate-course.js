// api/generate-course.js - DEEPSEEK R1 CHIMERA
console.log('=== 🚀 DEEPSEEK R1 CHIMERA AI ===');

// Проверка на environment variables
console.log('🔍 Environment check:');
console.log('- DEEPSEEK_API_KEY:', process.env.DEEPSEEK_API_KEY ? '✅ PRESENT' : '❌ MISSING');

// ФУНКЦИЯ ЗА DEEPSEEK R1 CHIMERA
async function generateWithDeepSeek(topic, style) {
  console.log(`🚀 Calling DeepSeek R1 Chimera for: ${topic} (${style})`);
  
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner', // ИЛИ 'deepseek-chat' за стандартна версия
        messages: [
          {
            role: 'system',
            content: `Ти си експерт по образователни технологии. Създаваш висококачествени учебни курсове на БЪЛГАРСКИ език.
            
            ИНСТРУКЦИИ:
            - ВИНАГИ отговаряй на БЪЛГАРСКИ език
            - Бъди полезен, практичен и структуриран
            - Използвай емотикони за по-добра визуализация
            - Създавай engaging и мотивиращо съдържание
            - Фокусирай се върху практически приложения`
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
        max_tokens: 2000,
        temperature: 0.7,
        stream: false
      })
    });

    console.log('📡 DeepSeek R1 response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ DeepSeek R1 error response:', errorText);
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ DeepSeek R1 response received successfully!');
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const aiContent = data.choices[0].message.content;
      return aiContent;
    } else {
      throw new Error('Неочакван формат на отговор от DeepSeek R1');
    }
    
  } catch (error) {
    console.log('❌ DeepSeek R1 AI грешка:', error.message);
    throw error;
  }
}

// ДЕМО ФАЛБАК ФУНКЦИЯ
function generateDemoCourse(topic, style) {
  return `🎯 КУРС: ${topic}
📚 СТИЛ: ${style}

DeepSeek R1 Chimera AI се активира...

МОДУЛ 1: ОСНОВИ
✓ Урок 1: Въведение в ${topic}
✓ Урок 2: Ключови принципи
✓ Урок 3: Практическо упражнение

МОДУЛ 2: РАЗШИРЕНИ ЗНАНИЯ  
✓ Урок 1: Напреднали техники
✓ Урок 2: Реални приложения
✓ Урок 3: Финален проект

🚀 DeepSeek R1 Chimera AI функционалността идва...`;
}

// АЛТЕРНАТИВНИ МОДЕЛИ ЗА ТЕСТВАНЕ
const DEEPSEEK_MODELS = [
  'deepseek-reasoner', // R1 Chimera
  'deepseek-chat',     // Стандартен
  'deepseek-coder'     // Алтернатива
];

async function tryAllDeepSeekModels(topic, style) {
  for (const model of DEEPSEEK_MODELS) {
    try {
      console.log(`🧪 Trying DeepSeek model: ${model}`);
      
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: 'Създай учебен курс на български език.'
            },
            {
              role: 'user',
              content: `Напиши кратък курс по ${topic} в стил ${style}.`
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.choices && data.choices[0] && data.choices[0].message) {
          console.log(`✅ УСПЕХ с модел ${model}!`);
          return data.choices[0].message.content;
        }
      }
    } catch (error) {
      console.log(`❌ Модел ${model} не работи:`, error.message);
      continue;
    }
  }
  throw new Error('Всички DeepSeek модели се провалиха');
}

module.exports = async function handler(req, res) {
  console.log('=== 🌐 DEEPSEEK R1 CHIMERA - НОВА ЗАЯВКА ===');
  
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

    // ОПИТВАНЕ С DEEPSEEK R1 CHIMERA
    if (process.env.DEEPSEEK_API_KEY) {
      console.log('🔄 Опитвам се да извикам DeepSeek R1 Chimera...');
      
      try {
        // Първо опитваме всички модели
        const aiContent = await tryAllDeepSeekModels(topic, style);
        
        console.log('✅ DEEPSEEK R1 CHIMERA УСПЕШЕН ОТГОВОР!');
        
        return res.status(200).json({
          success: true,
          course: aiContent,
          note: "✅ Генерирано с DeepSeek R1 Chimera AI!"
        });

      } catch (deepseekError) {
        console.log('❌ DeepSeek R1 Chimera грешка:', deepseekError.message);
        // Продължаваме към демо версия
      }
    } else {
      console.log('❌ DEEPSEEK_API_KEY не е намерен');
    }

    // ВРЪЩАМЕ ДЕМО ВЕРСИЯ
    console.log('📝 Връщам демо версия');
    const demoCourse = generateDemoCourse(topic, style);
    
    return res.status(200).json({
      success: true,
      course: demoCourse,
      note: process.env.DEEPSEEK_API_KEY ? "⚠️ Временна демо версия (DeepSeek грешка)" : "🔧 DeepSeek не е конфигуриран"
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
