module.exports.genreateTimeMealText = (corner, initialText) => {
  const price = '๊ฐ๊ฒฉ: ' + corner.price + '์\n\n';
  const morningMenu = '๐ฅ ์กฐ์ ๐ฅ\n' + corner.morning.join('\n') + '\n\n';
  const lunchMenu = '๐ฃ ์ค์ ๐ฃ\n' + corner.lunch.join('\n') + '\n\n';
  const dinnerMenu = '๐ฅ ์์ ๐ฅ\n' + corner.dinner.join('\n') + '\n';

  return initialText + price + morningMenu + lunchMenu + dinnerMenu;
};

module.exports.generateGeneralMealText = (corner, initialText) => {
  let menuNum = corner.menus.length;

  for (let i = 0; i < menuNum; i++) {
    const menu = corner.menus[i];
    let price = null;
    if (corner.prices.length > i) price = corner.prices[i];
    if (price) initialText += menu + '\t' + price + '์\n';
    else initialText += menu + '\n';
  }

  if (menuNum == 0) return (initialText += '์ค๋์ ์ด์ํ์ง ์์์ :)');
  return initialText;
};
