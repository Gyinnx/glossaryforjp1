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
    words = data.sort((a, b) =>
      a.word.localeCompare(b.word, "en", { sensitivity: "base" })
    );

    displayWords(words, "");
  })
  .catch(error => {
    console.error("単語データの読み込みに失敗しました：", error);
    wordList.textContent = "単語データを読み込めませんでした。words.json を確認してください。";
  });

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.trim().toLowerCase();

  let filteredWords;

  if (keyword === "") {
    filteredWords = [...words].sort((a, b) =>
      a.word.localeCompare(b.word, "en", { sensitivity: "base" })
    );
  } else {
    filteredWords = words
      .filter(item => item.word.toLowerCase().includes(keyword))
      .sort((a, b) => {
        const indexA = a.word.toLowerCase().indexOf(keyword);
        const indexB = b.word.toLowerCase().indexOf(keyword);

        if (indexA !== indexB) {
          return indexA - indexB;
        }

        return a.word.localeCompare(b.word, "en", { sensitivity: "base" });
      });
  }

  displayWords(filteredWords, keyword);
});

function displayWords(list, keyword) {
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

    addHighlightedWord(word, item.word, keyword);

    const meaning = document.createElement("div");
    meaning.className = "meaning";
    meaning.textContent = "意味：" + item.meaning;

    card.appendChild(word);
    card.appendChild(meaning);

    wordList.appendChild(card);
  });
}

function addHighlightedWord(element, wordText, keyword) {
  if (keyword === "") {
    element.textContent = wordText;
    return;
  }

  const lowerWord = wordText.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();

  let currentIndex = 0;
  let matchIndex = lowerWord.indexOf(lowerKeyword);

  while (matchIndex !== -1) {
    const beforeText = wordText.slice(currentIndex, matchIndex);
    if (beforeText) {
      element.appendChild(document.createTextNode(beforeText));
    }

    const highlightSpan = document.createElement("span");
    highlightSpan.className = "highlight";
    highlightSpan.textContent = wordText.slice(matchIndex, matchIndex + keyword.length);
    element.appendChild(highlightSpan);

    currentIndex = matchIndex + keyword.length;
    matchIndex = lowerWord.indexOf(lowerKeyword, currentIndex);
  }

  const afterText = wordText.slice(currentIndex);
  if (afterText) {
    element.appendChild(document.createTextNode(afterText));
  }
}