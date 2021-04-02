module.exports.genreateTimeMealText = (corner, initialText) => {
  const price = '가격: ' + corner.price + '원\n\n';
  const morningMenu = '🥚 조식 🥚\n' + corner.morning.join('\n') + '\n\n';
  const lunchMenu = '🐣 중식 🐣\n' + corner.lunch.join('\n') + '\n\n';
  const dinnerMenu = '🐥 석식 🐥\n' + corner.dinner.join('\n') + '\n\n';

  return initialText + price + morningMenu + lunchMenu + dinnerMenu;
};

module.exports.generateGeneralMealText = (corner, initialText) => {
  let menuNum = corner.menus.length;

  for (let i = 0; i < menuNum; i++) {
    const menu = corner.menus[i];
    let price = null;
    if (corner.prices.length > i) price = corner.prices[i];
    if (price) initialText += menu + '\t' + price + '원\n';
    else initialText += menu + '\n';
  }

  if (menuNum == 0) return (initialText += '오늘은 운영하지 않아요 :)');
  return initialText;
};
