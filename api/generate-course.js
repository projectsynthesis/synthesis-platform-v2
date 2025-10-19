// api/generate-course.js - HUGGING FACE ФИКСИРАН
console.log('=== 🤗 HUGGING FACE AI СИСТЕМА ===');

// Проверка на environment variables
console.log('🔍 Проверка на environment variables:');
console.log('- HUGGING_FACE_TOKEN:', process.env.HUGGING_FACE_TOKEN ? '✅ НАЛИЧЕН' : '❌ ЛИПСВА');

// ФУНКЦИЯ ЗА HUGGING FACE AI С РАЗЛИЧНИ МОДЕЛИ
async function generateWithHuggingFace(topic, style) {
  console.log(`🤗 Опитвам се с различни AI модели...`);
  
  // СПИСЪК С ПОДХОДЯЩИ МОДЕЛИ ЗА ТЕКСТОВА ГЕНЕРАЦИЯ
  const MODELS = [
    "bigscience/bloom-560m",           // Добър за текстова генерация
    "gpt2",                           // Стандартен GPT-2
    "EleutherAI/gpt-neo-125m",        // GPT-Neo (по-добър)
    "microsoft/DialoGPT-medium"       // Оригиналният (за fallback)
  ];

  for (const model of MODELS) {
    try {
      console.log(`🧪 Опитвам с модел: ${model}`);
      
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${model}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            inputs: `Създай учебен курс по ${topic}. Стил: ${style}.`,
            parameters: {
              max_new_tokens: 500,
              temperature: 0.8,
              do_sample: true,
              return_full_text: false
            }
          }),
        }
      );

      // Проверка дали модела е зареден
      if (response.status === 503) {
        console.log(`⏳ Модел ${model} се зарежда... пропускам`);
        continue;
      }

      if (!response.ok) {
        console.log(`❌ Модел ${model} грешка: ${response.status}`);
        continue;
      }

      const result = await response.json();
      console.log(`✅ Модел ${model} отговор:`, result);
      
      if (result[0] && result[0].generated_text) {
        console.log(`🎯 УСПЕХ с модел ${model}!`);
        return formatAIContent(result[0].generated_text, topic, style);
      }
      
    } catch (error) {
      console.log(`❌ Модел ${model} грешка:`, error.message);
      continue;
    }
  }
  
  throw new Error('Всички модели се провалиха');
}

// ФУНКЦИЯ ЗА ФОРМАТИРАНЕ НА AI СЪДЪРЖАНИЕТО
function formatAIContent(aiText, topic, style) {
  // Премахваме повторения и форматираме текста
  let formatted = aiText
    .replace(/Създай учебен курс по \w+\. Стил: \w+\./g, '')
    .replace(/(\n\s*){2,}/g, '\n\n') // Премахваме излишни празни редове
    .trim();
  
  // Добавяме заглавие ако липсва
  if (!formatted.includes('🎯') && !formatted.includes('КУРС:')) {
    formatted = `🎯 КУРС: ${topic}\n📚 СТИЛ: ${style}\n\n${formatted}`;
  }
  
  return formatted;
}

// ДЕМО ФАЛБАК ФУНКЦИЯ
function generateDemoCourse(topic, style) {
  return `🎯 КУРС: ${topic}
📚 СТИЛ: ${style}

ЗАГЛАВИЕ: "Професионален курс по ${topic}"
ОПИСАНИЕ: Hugging Face AI се настройва...

МОДУЛ 1: ОСНОВИ
✓ Урок 1: Въведение в ${topic}
✓ Урок 2: Ключови принципи
✓ Урок 3: Практическо упражнение

МОДУЛ 2: РАЗШИРЕНИ ЗНАНИЯ  
✓ Урок 1: Напреднали техники
✓ Урок 2: Реални приложения
✓ Урок 3: Финален проект

🚀 AI функционалността се активира...`;
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
      console.log('🔄 Опитвам се с Hugging Face AI...');
      
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
      note: "⚠️ Временна демо версия (AI модели се зареждат)"
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
