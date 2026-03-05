const axios = require('axios');

const binIds = ["MED-001", "MED-002", "MED-003", "MED-004", "MED-005"];
const binId = binIds[0];
let currentFullness = 10; 


console.log("🚀 Датчик запущен. Имитация наполнения...");

setInterval(async () => {
    // Имитируем рост на 1-3% за шаг
    currentFullness += Math.random() * 3;
    
    if (currentFullness > 100) currentFullness = 10; // Сброс при переполнении

    try {
        // Отправляем данные на наш Node.js сервер (который мы допишем)
        await axios.post('http://127.0.0.1:5000/api/telemetry', {
            binId: binId,
            fullness: Number(currentFullness.toFixed(2)),
            timestamp: new Date().toISOString()
        });
        console.log(`📡 Данные отправлены: ${binIds} -> ${currentFullness.toFixed(2)}%`);
    } catch (err) {
        // Это покажет реальную причину (Timeout, Connection Refused и т.д.)
        console.error("❌ Ошибка:", err.code || err.message);
    }
}, 5000); // Каждые 5 секунд