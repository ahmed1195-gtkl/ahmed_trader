export const badWords = {
  ar: ['كلمة1', 'كلمة2', 'كلمة3'], // سأضع أمثلة عامة هنا، ويمكن للمستخدم توسيعها
  en: ['badword1', 'badword2', 'badword3'],
  fr: ['grosmot1', 'grosmot2', 'grosmot3']
};

export const filterContent = (text) => {
  let filteredText = text;
  let hasBadWord = false;
  
  Object.values(badWords).flat().forEach(word => {
    const regex = new RegExp(word, 'gi');
    if (regex.test(filteredText)) {
      filteredText = filteredText.replace(regex, '***');
      hasBadWord = true;
    }
  });
  
  return { filteredText, hasBadWord };
};
