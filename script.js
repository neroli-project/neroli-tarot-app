const cardImg = document.getElementById("card-img");
const shuffleVideo = document.getElementById("shuffle-video");
const drawBtn = document.getElementById("draw-btn");
const resultDiv = document.getElementById("result");
const categorySelect = document.getElementById("category");

let cardsData = [];

// JSON読み込み
fetch("cards.json")
  .then(res => res.json())
  .then(data => {
    cardsData = data.cards;
    console.log("JSON読み込み成功", cardsData);
  })
  .catch(err => console.error(err));

function drawCard() {
  if (cardsData.length === 0) {
    alert("カードデータ読み込み中です！");
    return;
  }

  // 前回の表示をリセット
  cardImg.classList.remove("fade-in");
  resultDiv.classList.remove("fade-in");
  cardImg.style.display = "none";
  resultDiv.style.display = "none";


  // 📹 ランダムシャッフル動画
  const videoIndex = Math.floor(Math.random() * 8) + 1;
  shuffleVideo.src = `assets/shuffle${videoIndex}.mp4`;
  shuffleVideo.style.display = "block";
  shuffleVideo.load();
  shuffleVideo.play();

  shuffleVideo.onended = function () {
    shuffleVideo.style.display = "none";




    // 🎴 ランダムでカード選択
    const card = cardsData[Math.floor(Math.random() * cardsData.length)];

    // ⭐ 正位置 / 逆位置
    const isUpright = Math.random() < 0.5;
    const pos = isUpright ? "upright" : "reverse";
    const orientationData = card[pos];

    console.log("選ばれたカード", card);
    console.log("向きデータ", orientationData);

    // 🖼️ 画像表示
    cardImg.src = `assets/cards/${card.id}_${pos}.png`;
    cardImg.style.display = "block";
    cardImg.classList.remove("fade-in");
    setTimeout(() => cardImg.classList.add("fade-in"), 50);

    // カード名
    const cardTitle = `${card.name}（${orientationData.orientation}）`;

    // カテゴリ
    const category = categorySelect.value;
    const text =
      orientationData[category] ||
      orientationData.today ||
      "結果が見つかりません";

    console.log("カテゴリ:", category);
    console.log("文章:", text);

    // 結果表示＋もう一度引くボタン
    resultDiv.innerHTML = `
      <div class="result-box">
        <h2 class="card-title">${cardTitle}</h2>
        <p class="result-text">${text}</p>
        <button id="redo-btn">もう一度引く</button>
      </div>
    `;
    resultDiv.style.display = "block";
    resultDiv.classList.remove("fade-in");
    setTimeout(() => resultDiv.classList.add("fade-in"), 100);

   // もう一度引くボタンのイベントは「非表示リセット」のみ
    document.getElementById("redo-btn").addEventListener("click", () => {
      cardImg.classList.remove("fade-in");
      resultDiv.classList.remove("fade-in");
      cardImg.style.display = "none";
      resultDiv.style.display = "none";
    });
  };
}

// 最初のカードを引くボタン
drawBtn.addEventListener("click", drawCard);
