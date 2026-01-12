export const badWords = {
  ar: [
    'كلب', 'حمار', 'غبي', 'حيوان', 'زق', 'تفه', 'لعنة', 'سافل', 'حقير', 'واطي',
    'قذر', 'منحط', 'فاشل', 'كذاب', 'نصاب', 'خنزير', 'قرد', 'يا ابن', 'يا بنت'
  ],
  en: [
    'badword1', 'badword2', 'badword3', 'stupid', 'idiot', 'jerk', 'loser', 'scam', 'fake'
  ],
  fr: [
    'grosmot1', 'grosmot2', 'grosmot3'
  ]
};

export const filterContent = (text) => {
  if (!text) return { filteredText: '', hasBadWord: false };
  
  let filteredText = text;
  let hasBadWord = false;
  
  // دمج كل الكلمات في قائمة واحدة
  const allBadWords = Object.values(badWords).flat();
  
  allBadWords.forEach(word => {
    // استخدام regex مع حدود الكلمات لضمان عدم استبدال أجزاء من كلمات صحيحة
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(filteredText)) {
      filteredText = filteredText.replace(regex, '***');
      hasBadWord = true;
    }
  });
  
  return { filteredText, hasBadWord };
};
