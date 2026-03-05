const axios = require('axios');

const binIds = ["MED-001", "MED-002", "MED-003", "MED-004", "MED-005"];

// Храним текущий уровень для каждого бака
let levels = {
    "MED-001": 95,
    "MED-002": 25,
    "MED-003": 40,
    "MED-004": 5,
    "MED-005": 60
};

console.log("🚀 Датчики запущены для 5 контейнеров...");

setInterval(async () => {
    // ВАЖНО: Используем for...of, чтобы id был определен для каждой итерации
    for (const id of binIds) {
        
        // 1. Имитируем рост
        levels[id] += Math.random() * 3;
        
        // 2. Если бак полон, сбрасываем (имитация очистки)
        if (levels[id] > 100) {
            levels[id] = Math.random() * 10;
            console.log(`♻️ Контейнер ${id} был очищен`);
        }

        try {
            // 3. Отправляем данные
            await axios.post('http://127.0.0.1:5000/api/telemetry', {
                binId: id,
                fullness: Number(levels[id].toFixed(2)),
                timestamp: new Date().toISOString()
            });
            
            console.log(`📡 [${id}] -> ${levels[id].toFixed(2)}%`);
        } catch (err) {
            console.error(`❌ Ошибка отправки для ${id}:`, err.message);
        }
    }
    console.log("--- Пауза 5 секунд ---");
}, 5000);