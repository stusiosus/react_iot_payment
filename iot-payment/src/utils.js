

const blueColors = [
  "#9999FF","#6666FF","#3333FF","#0000FF","#0000CC","#0080FF","#7F00FF","#3399FF","#0066CC"
  ];
const redColors=[
    "#FFA07A","#FA8072","#E9967A","#F08080","##CD5C5C","#DC143C","#B22222","#FF0000","#8B0000","#800000",
    "#FF6347","#FF4500","#DB7093"
]
const purpleColors=[
    "#DDA0DD","#EE82EE","#DA70D6","#FF00FF","#FF00FF","#BA55D3","#9370DB","#8A2BE2","#9400D3","#9932CC",
    "#8B008B","#800080","#4B0082"
]
  
export function getRandomColors(colors){
    var Colors=""
    if (colors=="blue"){
        Colors=blueColors;
    }
    if (colors=="red"){
        Colors=redColors;
    }
    if (colors=="purple"){
        Colors=purpleColors;
    }
    
    
    // Zufällige Auswahl von drei Blautönen aus dem Array
    const randomIndexes = [];
    while (randomIndexes.length < 3) {
      const index = Math.floor(Math.random() * Colors.length);
      if (!randomIndexes.includes(index)) {
        randomIndexes.push(index);
      }
    }
  
    // Erstellen eines neuen Arrays mit den ausgewählten Blautönen
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

