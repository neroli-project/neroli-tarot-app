const cardImg = document.getElementById("card-img");
const shuffleVideo = document.getElementById("shuffle-video");
const drawBtn = document.getElementById("draw-btn");
// id="result-area" を使うように修正
const resultArea = document.getElementById("result-area"); 
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

  // 1. 占い前のメッセージを隠す
  const instruction = document.getElementById('instruction-area');
  if (instruction) instruction.style.display = "none";
  
  // ----------------------------------------------------
  // 【ここを削除・変更】
  // シャッフル中は結果エリアを完全に隠しておく（枠も出さない）
  resultArea.style.display = "none"; 
  resultArea.innerHTML = ""; 
  // ----------------------------------------------------
  
  // 前回の画像リセット
  cardImg.classList.remove("fade-in");
  cardImg.style.display = "none";

  // 📹 ランダムシャッフル動画
  const videoIndex = Math.floor(Math.random() * 8) + 1;
  shuffleVideo.src = `assets/shuffle${videoIndex}.mp4`;
  shuffleVideo.style.display = "block";
  shuffleVideo.load();
  shuffleVideo.play();

  // ★動画が終わった後の処理
  shuffleVideo.onended = function () {
    shuffleVideo.style.display = "none";

    // ----------------------------------------------------
    // 【ここを追加】
    // 動画が終わったので、結果エリアを表示する（枠を出す）
    resultArea.style.display = "block";
    // ----------------------------------------------------

    // 🎴 ランダムでカード選択
    const card = cardsData[Math.floor(Math.random() * cardsData.length)];

    // ⭐ 正位置 / 逆位置
    const isUpright = Math.random() < 0.5;
    const pos = isUpright ? "upright" : "reverse";
    const orientationData = card[pos];

    // 🖼️ 画像表示
    cardImg.src = `assets/cards/${card.id}_${pos}.png`;
    cardImg.style.display = "block";
    cardImg.classList.add("fade-in");

    // カード名
    const cardTitle = `${card.name}（${orientationData.orientation}）`;

    // カテゴリ
    const category = categorySelect.value;
    const text = orientationData[category] || orientationData.today || "結果が見つかりません";

    // 結果表示＋もう一度引くボタン
    resultArea.innerHTML = `
      <div class="result-box">
        <h2 class="card-title">${cardTitle}</h2>
        <p class="result-text">${text}</p>
        <button id="redo-btn">もう一度引く</button>
      </div>
    `;
    
    // フェードイン処理
    resultArea.classList.add("fade-in");

    // もう一度引くボタンのイベント
    document.getElementById("redo-btn").addEventListener("click", () => {
      // 案内文を再表示し、結果を隠す
      document.getElementById('instruction-area').style.display = "block";
      resultArea.style.display = "none";
      cardImg.style.display = "none";
    });
  };
}
drawBtn.addEventListener("click", drawCard);
