// ==========================
// 1. 時計の処理
// ==========================

function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');

  // HTML側の #clock という箱に文字を書き込む
  document.getElementById('clock').textContent = `${h}:${m}:${s}`;
}

// まず1回すぐ表示してから、1秒ごとに更新する
updateClock();
setInterval(updateClock, 1000);


// ==========================
// 2. 天気の処理
// ==========================

// 浜松市付近の緯度・経度(必要に応じて変更してください)
const LATITUDE = 34.98;
const LONGITUDE = 138.38;

// weathercode(数字)を、日本語とアイコンに変換するための対応表
// 全パターンではなく、代表的なものだけ簡易対応
const WEATHER_CODE_MAP = {
  0: { label: '快晴', icon: '☀️' },
  1: { label: '晴れ', icon: '🌤️' },
  2: { label: '一部曇り', icon: '⛅' },
  3: { label: '曇り', icon: '☁️' },
  45: { label: '霧', icon: '🌫️' },
  48: { label: '霧', icon: '🌫️' },
  51: { label: '小雨', icon: '🌦️' },
  61: { label: '雨', icon: '🌧️' },
  71: { label: '雪', icon: '❄️' },
  80: { label: 'にわか雨', icon: '🌧️' },
  95: { label: '雷雨', icon: '⛈️' },
};

async function updateWeather() {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&current_weather=true`;

    // データを取りに行く(リクエスト)
    const response = await fetch(url);

    // 届いた返事をJSONとして読める形にする
    const data = await response.json();

    // 中身を取り出す
    const temperature = data.current_weather.temperature;
    const code = data.current_weather.weathercode;

    // コード表になければ「不明」扱いにしておく
    const info = WEATHER_CODE_MAP[code] || { label: '不明', icon: '❓' };

    // HTML側の箱に反映する
    document.getElementById('temperature').textContent = `${temperature}℃`;
    document.getElementById('weather-status').textContent = info.label;
    document.getElementById('weather-icon').textContent = info.icon;

  } catch (error) {
    // 通信に失敗した場合など
    console.error('天気の取得に失敗しました:', error);
    document.getElementById('weather-status').textContent = '取得エラー';
  }
}

// ページを開いたらすぐ1回取得
updateWeather();

// その後は30分(30 * 60 * 1000ミリ秒)ごとに取得し直す
setInterval(updateWeather, 30 * 60 * 1000);
