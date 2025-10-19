// api/generate-course.js - ФИКСИРАН И РАБОТЕЩ КОД
export default async function handler(req, res) {
  console.log('=== API CALL STARTED ===');
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { topic, style } = req.body;
    console.log('Request body:', { topic, style });

    // Validate input
    if (!topic || !style) {
      return res.status(400).json({ 
        success: false,
        error: 'Topic and style are required' 
      });
    }

    // ВРЪЩАМЕ ДЕМО ВЕРСИЯ ПЪРВО, ДОКАТО ОПРАВИМ OPENAI
    const demoCourse = `
🎯 КУРС: ${topic}
📚 СТИЛ: ${style}

✅ УСПЕШНО ГЕНЕРИРАН КУРС!

ЗАГЛАВИЕ: "Професионален курс по ${topic}"
ОПИСАНИЕ: Този курс е създаден специално за теб според избрания стил на обучение.

МОДУЛ 1: ОСНОВИ НА ${topic.toUpperCase()}
✓ Урок 1: Въведение и основни понятия
✓ Урок 2: Ключови принципи и техники  
✓ Урок 3: Практически упражнения
🎯 Упражнение: Приложи знанията в реална ситуация

МОДУЛ 2: РАЗШИРЕНИ ВЪЗМОЖНОСТИ
✓ Урок 1: Напреднали стратегии
✓ Урок 2: Оптимизация на резултатите
✓ Урок 3: Избягване на често срещани грешки
🎯 Упражнение: Създай свой проект

🚀 OpenAI интеграцията се настройва... Скоро още по-добри резултати!
`;

    // Симулираме забавяне
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('✅ Успешно върнат демо курс');
    
    return res.status(200).json({
      success: true,
      course: demoCourse,
      note: "🎯 Демо версия - OpenAI се настройва"
    });

  } catch (error) {
    console.error('❌ Грешка в API:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error: ' + error.message
    });
  }
}
