let words = [];

const searchInput = document.getElementById("searchInput");
const wordList = document.getElementById("wordList");

fetch("words.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("words.json を読み込めませんでした。");
    }
    return response.json();
  })
  .then(data => {
    words = data;

    // 最初はすべての単語を表示する
    displayWords(words);
  })
  .catch(error => {
    console.error("単語データの読み込みに失敗しました：", error);
    wordList.textContent = "単語データを読み込めませんでした。words.json を確認してください。";
  });

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.trim().toLowerCase();

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
    const message = document.createElement("p");
    message.textContent = "一致する単語が見つかりませんでした。";
    wordList.appendChild(message);
    return;
  }

  list.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    const word = document.createElement("div");
    word.className = "word";
    word.textContent = item.word;

    const language = document.createElement("div");
    language.className = "language";
    language.textContent = "言語：" + item.language;

    const meaning = document.createElement("div");
    meaning.className = "meaning";
    meaning.textContent = "意味：" + item.meaning;

    card.appendChild(word);
    card.appendChild(language);
    card.appendChild(meaning);

    wordList.appendChild(card);
  });
}