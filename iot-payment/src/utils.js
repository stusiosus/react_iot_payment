const blueColors = [
  "#9999FF","#6666FF","#3333FF","#0000FF","#0000CC","#0080FF","#7F00FF","#3399FF","#0066CC"
];

const redColors = [
  "#FFA07A","#FA8072","#E9967A","#F08080","#CD5C5C","#DC143C","#B22222","#FF0000","#8B0000","#800000",
  "#FF6347","#FF4500","#DB7093"
];

const purpleColors = [
  "#DDA0DD","#EE82EE","#DA70D6","#FF00FF","#FF00FF","#BA55D3","#9370DB","#8A2BE2","#9400D3","#9932CC",
  "#8B008B","#800080","#4B0082"
];

const greenColors = [
  "#98FB98","#90EE90","#00FA9A","#00FF7F","#3CB371","#2E8B57","#228B22","#008000","#006400",
  "#7FFF00","#7CFC00","#ADFF2F","#32CD32"
];

export function getRandomColors(colors) {
  let Colors = [];
  if (colors === "blue") {
    Colors = blueColors;
  }
  if (colors === "red") {
    Colors = redColors;
  }
  if (colors === "purple") {
    Colors = purpleColors;
  }
  if (colors === "green") {
    Colors = greenColors;
  }

  // Zufällige Auswahl von drei Farben aus dem Array
  const randomIndexes = [];
  while (randomIndexes.length < 3) {
    const index = Math.floor(Math.random() * Colors.length);
    if (!randomIndexes.includes(index)) {
      randomIndexes.push(index);
    }
  }

  // Erstellen eines neuen Arrays mit den ausgewählten Farben
  const randomColors = randomIndexes.map((index) => Colors[index]);
  return randomColors;
};

export const splititemsIntoGroups = (items) => {
  const groups = [];
  let group = [];
  for (let i = 0; i < items.length; i++) {
    group.push(items[i]);
    if ((i + 1) % 3 === 0 || i === items.length - 1) {
      groups.push(group);
      group = [];
    }
  }
  return groups;
};
