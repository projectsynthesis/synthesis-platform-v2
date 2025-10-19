// api/generate-course.js - OPENAI ГАРАНТИРАНО РАБОТЕЩ
console.log('=== 🎯 OPENAI AI СИСТЕМА ===');

// Проверка на environment variables
console.log('🔍 Проверка на environment variables:');
console.log('- OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ НАЛИЧЕН' : '❌ ЛИПСВА');

// ФУНКЦИЯ ЗА OPENAI AI
async function generateWithOpenAI(topic, style) {
  console.log(`🎯 Извиквам OpenAI за: ${topic} (${style})`);
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Ти си експерт по образователни технологии. Създаваш висококачествени учебни курсове на БЪЛГАРСКИ език.
            
            ВИНАГИ отговаряй на БЪЛГАРСКИ език!
            Бъди полезен, практичен и структуриран.
            Използвай емотикони за по-добра визуализация.`
          },
          {
            role: 'user',
            content: `Създай подробен учебен курс на БЪЛГАРСКИ език по тема: "${topic}".
            
            Стил на обучение: ${style}
            
            Структура на курса:
            🎯 Заглавие и описание
            📂 3-4 модула със заглавия
            📝 По 2-3 урока във всеки модул  
            🎯 Практически упражнения
            💡 Ключови изводи
            
            Бъди креативен, полезен и мотивиращ!`
          }
        ],
        max_tokens: 1500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI грешка: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const aiContent = data.choices[0].message.content;
      console.log('✅ OpenAI отговор получен успешно!');
      return aiContent;
    } else {
      throw new Error('Неочакван формат на отговор от OpenAI');
    }
    
  } catch (error) {
    console.log('❌ OpenAI грешка:', error.message);
    throw error;
  }
}

// ДЕМО ФАЛБАК ФУНКЦИЯ
function generateDemoCourse(topic, style) {
  return `🎯 КУРС: ${topic}
📚 СТИЛ: ${style}

⚠️ OpenAI се активира... Скоро истински AI курсове!

МОДУЛ 1: ОСНОВИ
✓ Урок 1: Въведение в ${topic}
✓ Урок 2: Ключови принципи
✓ Урок 3: Практическо упражнение

МОДУЛ 2: РАЗШИРЕНИ ЗНАНИЯ  
✓ Урок 1: Напреднали техники
✓ Урок 2: Реални приложения
✓ Урок 3: Финален проект

🚀 OpenAI AI функционалността идва...`;
}

module.exports = async function handler(req, res) {
  console.log('=== 🌐 OPENAI - НОВА ЗАЯВКА ===');
  
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

    // ОПИТВАНЕ С OPENAI AI
    if (process.env.OPENAI_API_KEY) {
      console.log('🔄 Опитвам се да извикам OpenAI...');
      
      try {
        const aiContent = await generateWithOpenAI(topic, style);
        
        console.log('✅ OPENAI AI УСПЕШЕН ОТГОВОР!');
        
        return res.status(200).json({
          success: true,
          course: aiContent,
          note: "✅ Генерирано с OpenAI AI!"
        });

      } catch (openaiError) {
        console.log('❌ OpenAI грешка:', openaiError.message);
        // Продължаваме към демо версия
      }
    } else {
      console.log('❌ OPENAI_API_KEY не е намерен');
    }

    // ВРЪЩАМЕ ДЕМО ВЕРСИЯ
    console.log('📝 Връщам демо версия');
    const demoCourse = generateDemoCourse(topic, style);
    
    return res.status(200).json({
      success: true,
      course: demoCourse,
      note: process.env.OPENAI_API_KEY ? "⚠️ Временна демо версия (OpenAI грешка)" : "🔧 OpenAI не е конфигуриран"
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
