let words = [];

const searchInput = document.getElementById("searchInput");
const wordList = document.getElementById("wordList");

fetch("words.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("words.json could not be loaded.");
    }
    return response.json();
  })
  .then(data => {
    // 读取后自动按字母顺序排列
    words = sortWords(data);

    // 页面刚打开时，显示排序后的全部单词
    displayWords(words, "");
  })
  .catch(error => {
    console.error("Failed to load word data:", error);
    wordList.textContent = "Word data could not be loaded. Please check words.json.";
  });

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.trim().toLowerCase();

  if (keyword === "") {
    displayWords(sortWords(words), "");
    return;
  }

  const filteredWords = words
    // 只匹配单词本身，不匹配 meaning
    .filter(item => item.word.toLowerCase().includes(keyword))
    .sort((a, b) => {
      const wordA = a.word.toLowerCase();
      const wordB = b.word.toLowerCase();

      const indexA = wordA.indexOf(keyword);
      const indexB = wordB.indexOf(keyword);

      // 匹配位置越靠前，显示越靠上
      if (indexA !== indexB) {
        return indexA - indexB;
      }

      // 匹配位置相同时，再按字母顺序排列
      return a.word.localeCompare(b.word, "en", {
        sensitivity: "base",
        numeric: true
      });
    });

  displayWords(filteredWords, keyword);
});

function sortWords(list) {
  return [...list].sort((a, b) =>
    a.word.localeCompare(b.word, "en", {
      sensitivity: "base",
      numeric: true
    })
  );
}

function displayWords(list, keyword) {
  wordList.innerHTML = "";

  if (list.length === 0) {
    const message = document.createElement("p");
    message.textContent = "No matching words were found.";
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
    meaning.textContent = "Meaning: " + item.meaning;

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
    highlightSpan.textContent = wordText.slice(
      matchIndex,
      matchIndex + keyword.length
    );

    element.appendChild(highlightSpan);

    currentIndex = matchIndex + keyword.length;
    matchIndex = lowerWord.indexOf(lowerKeyword, currentIndex);
  }

  const afterText = wordText.slice(currentIndex);

  if (afterText) {
    element.appendChild(document.createTextNode(afterText));
  }
}
