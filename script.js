const words = [
  {
    word: "ischemia",
    language: "English",
    meaning: "虚血。血液供給が不足している状態。"
  },
  {
    word: "有意差",
    language: "Japanese",
    meaning: "統計的に偶然とは考えにくい差。"
  },
  {
    word: "API",
    language: "English",
    meaning: "アプリやサービス同士が情報をやり取りするための仕組み。"
  }
];

const searchInput = document.getElementById("searchInput");
const wordList = document.getElementById("wordList");

// 页面刚打开时，显示所有单词
displayWords(words);

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();

  const filteredWords = words.filter(item => {
    return (
      item.word.toLowerCase().includes(keyword) ||
      item.language.toLowerCase().includes(keyword) ||
      item.meaning.toLowerCase().includes(keyword)
    );
  });

  displayWords(filteredWords);
});

function displayWords(list) {
  wordList.innerHTML = "";

  if (list.length === 0) {
    wordList.innerHTML = "<p>没有找到匹配的词汇。</p>";
    return;
  }

  list.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="word">${item.word}</div>
      <div class="language">语言：${item.language}</div>
      <div class="meaning">含义：${item.meaning}</div>
    `;

    wordList.appendChild(card);
  });
}