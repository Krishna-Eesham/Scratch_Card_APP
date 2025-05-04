const fs = require('fs');

function assignPrizesToMembers() {
  const data = fs.readFileSync('./public/scratchcards.json');
  const users = JSON.parse(data);

  const pendingMembers = users.filter(u => !u.prize && u.schemeNumber === 1);

  if (pendingMembers.length >= 20) {
    console.log('Assigning prizes randomly...');

    const prizeList = [
      "5 grams Gold",
      "Travel Luggage Bag", "Travel Luggage Bag", "Travel Luggage Bag", "Travel Luggage Bag", "Travel Luggage Bag",
      "Dinner Set", "Dinner Set", "Dinner Set", "Dinner Set", "Dinner Set", "Dinner Set", "Dinner Set",
      "Hot Box", "Hot Box", "Hot Box", "Hot Box", "Hot Box", "Hot Box", "Hot Box"
    ];

    shuffleArray(prizeList);

    pendingMembers.slice(0, 20).forEach((member, index) => {
      member.prize = prizeList[index];
    });

    fs.writeFileSync('./public/scratchcards.json', JSON.stringify(users, null, 2));
    console.log('Prizes assigned randomly to members.');
  } else {
    console.log('Not enough members yet to assign prizes.');
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

assignPrizesToMembers();
