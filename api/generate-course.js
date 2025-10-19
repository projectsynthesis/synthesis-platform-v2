// api/generate-course.js - DEEPSEEK AI ИНТЕГРАЦИЯ
console.log('=== 🚀 DEEPSEEK AI СИСТЕМА ===');

// Проверка на environment variables
console.log('🔍 Проверка на environment variables:');
console.log('- DEEPSEEK_API_KEY:', process.env.DEEPSEEK_API_KEY ? '✅ НАЛИЧЕН' : '❌ ЛИПСВА');

// ФУНКЦИЯ ЗА DEEPSEEK AI
async function generateWithDeepSeek(topic, style) {
  console.log(`🚀 Извиквам DeepSeek AI за: ${topic} (${style})`);
  
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
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
        max_tokens: 2000,
        temperature: 0.7,
        stream: false
      })
    });

    console.log('📡 DeepSeek response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ DeepSeek error response:', errorText);
      throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ DeepSeek response received successfully!');
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const aiContent = data.choices[0].message.content;
      return aiContent;
    } else {
      throw new Error('Неочакван формат на отговор от DeepSeek');
    }
    
  } catch (error) {
    console.log('❌ DeepSeek AI грешка:', error.message);
    throw error;
  }
}

// ДЕМО ФАЛБАК ФУНКЦИЯ
function generateDemoCourse(topic, style) {
  return `🎯 КУРС: ${topic}
📚 СТИЛ: ${style}

DeepSeek AI се активира... Скоро истински AI курсове!

МОДУЛ 1: ОСНОВИ
✓ Урок 1: Въведение в ${topic}
✓ Урок 2: Ключови принципи
✓ Урок 3: Практическо упражнение

МОДУЛ 2: РАЗШИРЕНИ ЗНАНИЯ  
✓ Урок 1: Напреднали техники
✓ Урок 2: Реални приложения
✓ Урок 3: Финален проект

🚀 DeepSeek AI функционалността идва...`;
}

module.exports = async function handler(req, res) {
  console.log('=== 🌐 DEEPSEEK - НОВА ЗАЯВКА ===');
  
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

    // ОПИТВАНЕ С DEEPSEEK AI
    if (process.env.DEEPSEEK_API_KEY) {
      console.log('🔄 Опитвам се да извикам DeepSeek AI...');
      
      try {
        const aiContent = await generateWithDeepSeek(topic, style);
        
        console.log('✅ DEEPSEEK AI УСПЕШЕН ОТГОВОР!');
        
        return res.status(200).json({
          success: true,
          course: aiContent,
          note: "✅ Генерирано с DeepSeek AI!"
        });

      } catch (deepseekError) {
        console.log('❌ DeepSeek AI грешка:', deepseekError.message);
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
