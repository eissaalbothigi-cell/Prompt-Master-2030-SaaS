// ============================================================
// 📚 Prompt Master 2030 - Library of Prompt Frameworks
// ============================================================
// يحتوي على 9 أطر هندسية احترافية (CO-STAR, RISEN, RTF, ...)
// بالإضافة إلى 10 قوالب سريعة للاستخدام الفوري.
// ============================================================

// ============================================================
// 1️⃣ الأطر الهندسية (Engineering Frameworks)
// ============================================================

export interface PromptFramework {
  id: string;
  name: string;
  description: string;
  fields: { key: string; label: string; placeholder: string }[];
}

export const PROMPT_FRAMEWORKS: PromptFramework[] = [
  {
    id: 'rtf',
    name: 'RTF',
    description: 'الهيكل الأساسي: الدور، المهمة، التنسيق',
    fields: [
      { key: 'role', label: '🎭 الدور (Role)', placeholder: 'أنت خبير تسويق...' },
      { key: 'task', label: '📝 المهمة (Task)', placeholder: 'اكتب تغريدة عن...' },
      { key: 'format', label: '📐 التنسيق (Format)', placeholder: 'استخدم قائمة نقطية...' },
    ],
  },
  {
    id: 'costar',
    name: 'CO-STAR',
    description: 'الهيكل الاحترافي: السياق، الهدف، الأسلوب، الجمهور، الاستجابة',
    fields: [
      { key: 'context', label: '🌍 السياق (Context)', placeholder: 'نحن شركة ناشئة في مجال الذكاء الاصطناعي...' },
      { key: 'objective', label: '🎯 الهدف (Objective)', placeholder: 'زيادة الوعي بالعلامة التجارية...' },
      { key: 'style', label: '✍️ الأسلوب (Style)', placeholder: 'نبرة حماسية وإلهامية...' },
      { key: 'audience', label: '👥 الجمهور (Audience)', placeholder: 'رواد أعمال ومطورون...' },
      { key: 'response', label: '📊 شكل الإجابة (Response)', placeholder: 'تغريدة لا تتجاوز 280 حرفاً...' },
    ],
  },
  {
    id: 'risen',
    name: 'RISEN',
    description: 'الهيكل التوجيهي: الدور، التعليمات، الخطوات، الهدف النهائي',
    fields: [
      { key: 'role', label: '🎭 الدور (Role)', placeholder: 'أنت مدرب تنفيذي...' },
      { key: 'instructions', label: '📋 التعليمات (Instructions)', placeholder: 'قدم نصائح عملية...' },
      { key: 'steps', label: '🔢 الخطوات (Steps)', placeholder: '1. تحليل الوضع...' },
      { key: 'endGoal', label: '🏁 الهدف النهائي (End Goal)', placeholder: 'تحقيق زيادة 20% في المبيعات...' },
    ],
  },
  {
    id: 'crispe',
    name: 'CRISPE',
    description: 'الهيكل المتقدم: الخبرة، الدور، الرؤية، المهمة، الأسلوب، التجربة',
    fields: [
      { key: 'capacity', label: '🧠 الخبرة (Capacity)', placeholder: 'خبير في التسويق الرقمي...' },
      { key: 'role', label: '🎭 الدور (Role)', placeholder: 'أعمل كمستشار استراتيجي...' },
      { key: 'insight', label: '💡 الرؤية (Insight)', placeholder: 'أرى أن التحدي الأكبر هو...' },
      { key: 'statement', label: '📌 المهمة (Statement)', placeholder: 'المطلوب هو تطوير خطة...' },
      { key: 'personality', label: '🎨 الأسلوب (Personality)', placeholder: 'أسلوب مباشر وواضح...' },
      { key: 'experiment', label: '🧪 البدائل (Experiment)', placeholder: 'جرب أيضاً خياراً آخر مثل...' },
    ],
  },
  {
    id: 'chain-of-thought',
    name: 'Chain of Thought',
    description: 'التفكير خطوة بخطوة لحل المشكلات المعقدة',
    fields: [
      { key: 'problem', label: '❓ المشكلة (Problem)', placeholder: 'كيف نحسن تجربة المستخدم؟' },
      { key: 'reasoning', label: '🧩 التفكير (Reasoning)', placeholder: 'فكر خطوة بخطوة: أولاً... ثانياً...' },
      { key: 'finalAnswer', label: '✅ النتيجة النهائية', placeholder: 'الإجابة النهائية هي...' },
    ],
  },
  {
    id: 'few-shot',
    name: 'Few Shot Prompting',
    description: 'التعلم من الأمثلة (نمط الإدخال → الإخراج)',
    fields: [
      { key: 'example1', label: '📘 مثال 1', placeholder: 'المدخل: "تفاحة" → المخرج: "فاكهة حمراء"' },
      { key: 'example2', label: '📗 مثال 2', placeholder: 'المدخل: "موز" → المخرج: "فاكهة صفراء"' },
      { key: 'newTask', label: '🎯 التطبيق الجديد', placeholder: 'المدخل: "برتقالة" → المخرج: ...' },
    ],
  },
  {
    id: 'file-scope',
    name: 'File Scope Prompt',
    description: 'تعديل ملفات برمجية بدقة (للبرمجة)',
    fields: [
      { key: 'file', label: '📂 اسم الملف', placeholder: 'src/app/page.tsx' },
      { key: 'currentBehavior', label: '🐛 السلوك الحالي', placeholder: 'الصفحة لا تعرض البيانات...' },
      { key: 'requiredChange', label: '🔧 التعديل المطلوب', placeholder: 'أضف استدعاء API...' },
      { key: 'restrictions', label: '🚫 القيود', placeholder: 'لا تغير ملفات المكتبات...' },
    ],
  },
  {
    id: 'visual',
    name: 'Visual Prompt',
    description: 'لإنشاء صور ومقاطع فيديو (Midjourney, DALL-E)',
    fields: [
      { key: 'subject', label: '🖼️ العنصر الرئيسي', placeholder: 'قلعة في الفضاء...' },
      { key: 'lighting', label: '💡 الإضاءة', placeholder: 'إضاءة ذهبية دافئة...' },
      { key: 'style', label: '🎨 الأسلوب الفني', placeholder: 'أسلوب سينمائي، واقعي...' },
      { key: 'camera', label: '📷 الكاميرا', placeholder: 'زاوية عريضة، لقطة بعيدة...' },
    ],
  },
  {
    id: 'decompiler',
    name: 'Prompt Decompiler',
    description: 'تحليل وتحسين برومبت موجود',
    fields: [
      { key: 'analyze', label: '🔍 التحليل', placeholder: 'حلل هذا البرومبت: "اكتب مقالاً عن الذكاء الاصطناعي"' },
      { key: 'extract', label: '🧩 استخراج المكونات', placeholder: 'استخرج الدور، المهمة، التنسيق...' },
      { key: 'improve', label: '🚀 التحسين', placeholder: 'اقترح تحسينات...' },
      { key: 'rebuild', label: '🏗️ إعادة البناء', placeholder: 'أعد كتابة البرومبت المحسن...' },
    ],
  },
];

// ============================================================
// 2️⃣ القوالب السريعة (Quick Templates)
// ============================================================

export interface QuickTemplate {
  id: string;
  name: string;
  prompt: string;
  category: 'marketing' | 'education' | 'business' | 'career' | 'content' | 'ecommerce' | 'entrepreneurship';
}

export const QUICK_TEMPLATES: QuickTemplate[] = [
  {
    id: 'q1',
    name: 'تغريدة تسويقية',
    prompt: 'اكتب تغريدة تسويقية عن {product} بنبرة حماسية ومختصرة',
    category: 'marketing',
  },
  {
    id: 'q2',
    name: 'برنامج تعليمي',
    prompt: 'صمم خطة درس لتعليم {topic} للمبتدئين مع أنشطة تفاعلية',
    category: 'education',
  },
  {
    id: 'q3',
    name: 'وصف منتج',
    prompt: 'اكتب وصفاً جذاباً لمنتج {product} مع ذكر الفوائد والمميزات',
    category: 'ecommerce',
  },
  {
    id: 'q4',
    name: 'محتوى إعلاني',
    prompt: 'اكتب إعلاناً لـ {product} مع دعوة واضحة للشراء',
    category: 'marketing',
  },
  {
    id: 'q5',
    name: 'سيرة ذاتية',
    prompt: 'اكتب سيرة ذاتية لـ {job_title} مع إبراز المهارات والخبرات',
    category: 'career',
  },
  {
    id: 'q6',
    name: 'بريد إلكتروني رسمي',
    prompt: 'اكتب بريداً إلكترونياً إلى {recipient} بخصوص {subject} بنبرة مهذبة',
    category: 'business',
  },
  {
    id: 'q7',
    name: 'خطة تسويق',
    prompt: 'ضع خطة تسويق لـ {business} تشمل الاستراتيجيات والقنوات والميزانية',
    category: 'marketing',
  },
  {
    id: 'q8',
    name: 'مقالة قصيرة',
    prompt: 'اكتب مقالة عن {topic} بأسلوب شيق ومعلومات مفيدة',
    category: 'content',
  },
  {
    id: 'q9',
    name: 'فكرة مشروع',
    prompt: 'اقترح فكرة مشروع مبتكر في مجال {field} مع خطة تنفيذ مبسطة',
    category: 'entrepreneurship',
  },
  {
    id: 'q10',
    name: 'أسئلة مقابلة',
    prompt: 'اكتب أسئلة مقابلة لـ {job_title} مع الإجابات النموذجية',
    category: 'career',
  },
];

// ============================================================
// 3️⃣ دوال مساعدة
// ============================================================

export const getFrameworkById = (id: string) =>
  PROMPT_FRAMEWORKS.find((f) => f.id === id);

export const getQuickTemplateById = (id: string) =>
  QUICK_TEMPLATES.find((t) => t.id === id);

export const getAllCategories = () =>
  [...new Set(QUICK_TEMPLATES.map((t) => t.category))];