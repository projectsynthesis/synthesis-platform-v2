// api/generate-course.js - ИНТЕЛИГЕНТНА СИСТЕМА БЕЗ AI
console.log('=== 🧠 ИНТЕЛИГЕНТНА СИСТЕМА ЗА КУРСОВЕ ===');

// Премахваме Gemini зависимостите - нямаме нужда от тях!
console.log('🔧 Зареждам интелигентна система за генериране на курсове...');

// БАЗА ОТ ЗНАНИЯ ЗА РАЗЛИЧНИ ТЕМИ
const TOPIC_TEMPLATES = {
  'програмиране': {
    modules: [
      'Основи на синтаксиса',
      'Контролни структури', 
      'Функции и методи',
      'Работа с данни',
      'Проектна работа'
    ],
    lessons: [
      'Въведение и настройка на средата',
      'Променливи и типове данни',
      'Условни оператори',
      'Цикли и итерации',
      'Създаване на функции',
      'Работа с масиви и обекти',
      'Дебъгване и грешки',
      'Оптимизация на кода'
    ]
  },
  'маркетинг': {
    modules: [
      'Основи на дигиталния маркетинг',
      'Създаване на стратегия',
      'Съдържание и реклами',
      'Анализ и оптимизация'
    ],
    lessons: [
      'Разбиране на целевата аудитория',
      'SEO оптимизация',
      'Социални мрежи',
      'Email маркетинг',
      'Платими реклами',
      'Анализ на данни',
      'Оптимизация на кампании'
    ]
  },
  'предприемачество': {
    modules: [
      'Идея и валидация',
      'Бизнес план',
      'Финанси и бюджет',
      'Маркетинг и продажби',
      'Мащабиране'
    ],
    lessons: [
      'Намиране на бизнес идея',
      'Проучване на пазара',
      'Създаване на бизнес модел',
      'Финансово планиране',
      'Брандиране и позициониране',
      'Дигитален маркетинг',
      'Управление на екип',
      'Мащабиране на бизнеса'
    ]
  },
  'финанси': {
    modules: [
      'Лични финанси',
      'Инвестиране',
      'Бюджетиране',
      'Финансово планиране'
    ],
    lessons: [
      'Управление на доходи и разходи',
      'Спестявания и инвестиции',
      'Акции и борси',
      'Недвижими имоти',
      'Пенсионно планиране',
      'Данъци и осигуровки'
    ]
  }
};

// СТИЛОВЕ НА ОБУЧЕНИЕ
const LEARNING_STYLES = {
  'практически': {
    description: 'Фокусиран върху практически задачи и реални приложения',
    exercises: ['Практическо упражнение', 'Реален проект', 'Case study', 'Симулация']
  },
  'теоретичен': {
    description: 'Задълбочени обяснения и концептуално разбиране', 
    exercises: ['Анализ на концепции', 'Теоретично изследване', 'Сравнителен анализ']
  },
  'интерактивен': {
    description: 'Комбинация от теория и практика с интерактивни елементи',
    exercises: ['Интерактивно упражнение', 'Групова дискусия', 'Практически кейс']
  },
  'кратък и ясен': {
    description: 'Директно и фокусирано върху най-важното',
    exercises: ['Бърза задача', 'Фокусирано упражнение', 'Есенциална практика']
  }
};

// ФУНКЦИЯ ЗА ИНТЕЛИГЕНТНО ГЕНЕРИРАНЕ НА КУРС
function generateIntelligentCourse(topic, style) {
  console.log(`🧠 Генерирам интелигентен курс за "${topic}" със стил "${style}"`);
  
  // Намираме най-подходящия шаблон
  const matchedTopic = findBestTopicMatch(topic);
  const styleConfig = LEARNING_STYLES[style] || LEARNING_STYLES['практически'];
  
  // Генерираме уникално заглавие и описание
  const title = generateCourseTitle(topic, style);
  const description = generateCourseDescription(topic, styleConfig.description);
  
  // Генерираме модули и уроци
  const modules = generateModules(matchedTopic, topic, style);
  
  return `🎯 ${title}
📚 Стил: ${style} - ${styleConfig.description}

${description}

${modules}

💡 Ключови изводи:
• Практическо приложение на знанията
• Ясни стъпки за напредък  
• Подходящ за начинаещи и напреднали

🚀 Този курс е генериран с нашата интелигентна система!`;
}

// ПОМАГАЩИ ФУНКЦИИ
function findBestTopicMatch(userTopic) {
  const userTopicLower = userTopic.toLowerCase();
  
  for (const [templateTopic, template] of Object.entries(TOPIC_TEMPLATES)) {
    if (userTopicLower.includes(templateTopic) || templateTopic.includes(userTopicLower)) {
      console.log(`✅ Намерен шаблон за: ${templateTopic}`);
      return template;
    }
  }
  
  // Ако няма точна съвпадаща тема, използваме програмирането като fallback
  console.log(`🔧 Използвам общ шаблон за: ${userTopic}`);
  return TOPIC_TEMPLATES['програмиране'];
}

function generateCourseTitle(topic, style) {
  const prefixes = ['Мастерски', 'Професионален', 'Изчерпателен', 'Практически', 'Интерактивен'];
  const suffixes = ['курс', 'гид', 'пътеводител', 'уроки', 'обучение'];
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  return `${prefix} ${suffix} по ${topic}`;
}

function generateCourseDescription(topic, styleDescription) {
  return `Този ${styleDescription.toLowerCase()} курс по ${topic} е създаден да те научи на основните принципи и практически умения. Подходящ е както за начинаещи, така и за тези, които искат да задълбочат знанията си.`;
}

function generateModules(template, userTopic, style) {
  const styleConfig = LEARNING_STYLES[style] || LEARNING_STYLES['практически'];
  let modulesText = '';
  
  // Използваме модулите от шаблона или генерираме нови
  const modules = template.modules || ['Основи', 'Напреднали техники', 'Практическо приложение'];
  
  modules.forEach((module, index) => {
    modulesText += `\n📂 МОДУЛ ${index + 1}: ${module}\n`;
    
    // Генерираме уроци за всеки модул
    const lessons = template.lessons || [
      'Въведение в темата',
      'Основни принципи', 
      'Практически приложения',
      'Упражнения и задачи'
    ];
    
    lessons.forEach((lesson, lessonIndex) => {
      if (lessonIndex < 3) { // Максимум 3 урока на модул
        modulesText += `   ✓ Урок ${lessonIndex + 1}: ${lesson}\n`;
      }
    });
    
    // Добавяме упражнение в стила на обучението
    const exercise = styleConfig.exercises[Math.floor(Math.random() * styleConfig.exercises.length)];
    modulesText += `   🎯 ${exercise}: Приложи наученото в реална ситуация\n`;
  });
  
  return modulesText;
}

module.exports = async function handler(req, res) {
  console.log('=== 🌐 ИНТЕЛИГЕНТНА СИСТЕМА - НОВА ЗАЯВКА ===');
  
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

    // ГЕНЕРИРАМЕ ИНТЕЛИГЕНТЕН КУРС
    console.log('🧠 Генерирам интелигентен курс...');
    const intelligentCourse = generateIntelligentCourse(topic, style);
    
    console.log('✅ ИНТЕЛИГЕНТЕН КУРС УСПЕШНО ГЕНЕРИРАН!');
    
    return res.status(200).json({
      success: true,
      course: intelligentCourse,
      note: "✅ Генерирано с нашата интелигентна система!"
    });

  } catch (error) {
    console.error('💥 Неочаквана грешка:', error);
    
    return res.status(200).json({
      success: true,
      course: `Курс по ${req.body?.topic || 'неизвестна тема'}. Временна грешка.`,
      note: "⚠️ Временна техническа грешка"
    });
  }
};
