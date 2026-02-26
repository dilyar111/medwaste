import React from "react";

const departments = [
  {
    name: "Auto Registered",
    bins: 5,
    avgFullness: 51,
    totalWeight: 0.0,
    needsAttention: 1,
  },
];

function Reports() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            Отчеты и Аналитика
          </h1>
          <p className="text-gray-500">
            Анализ данных и статистика системы управления отходами
          </p>
        </div>

        <div className="flex gap-3">
          <button className="bg-white px-4 py-2 rounded-lg shadow">
            Печать
          </button>
          <button className="bg-white px-4 py-2 rounded-lg shadow">
            Экспорт
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
            Создать Отчет
          </button>
        </div>
      </div>

      {/* REPORT PARAMETERS */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-bold mb-4">
          Параметры отчета
        </h2>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-gray-500">
              Период
            </label>
            <input
              type="text"
              placeholder="—"
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Тип отчета
            </label>
            <select className="w-full border rounded-lg px-3 py-2 mt-1">
              <option>Общий</option>
              <option>По отделениям</option>
              <option>По типам отходов</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Временная агрегация
            </label>
            <select className="w-full border rounded-lg px-3 py-2 mt-1">
              <option>День</option>
              <option>Неделя</option>
              <option>Месяц</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">
              Обновить данные
            </button>
          </div>
        </div>
      </div>

      {/* KPI BLOCK */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-gray-500 text-sm">
            Всего Контейнеров
          </p>
          <p className="text-3xl font-bold">5</p>
          <p className="text-xs text-gray-400">
            Всего активных контейнеров в системе
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-gray-500 text-sm">
            Средняя Заполненность
          </p>
          <p className="text-3xl font-bold">51%</p>
          <p className="text-xs text-gray-400">
            Среднее значение заполненности
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-gray-500 text-sm">
            Требуют Внимания
          </p>
          <p className="text-3xl font-bold">0</p>
          <p className="text-xs text-gray-400">
            Контейнеры, требующие внимания
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-gray-500 text-sm">
            Общий Вес
          </p>
          <p className="text-3xl font-bold">0.0 кг</p>
          <p className="text-xs text-gray-400">
            Общий вес отходов
          </p>
        </div>
      </div>

      {/* FULLNESS BY DEPARTMENT */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-bold mb-4">
          Заполненность по Отделениям
        </h2>

        <div className="h-40 flex items-center justify-center text-gray-400">
          График будет отображаться здесь
        </div>
      </div>

      {/* WASTE TYPE DISTRIBUTION */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-bold mb-4">
          Распределение по Типам Отходов
        </h2>

        <div className="flex items-center">
          <div className="w-40 h-40 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
            100%
          </div>
          <div className="ml-6">
            <p className="font-medium">
              Острые Медицинские Отходы
            </p>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-4">
          Статистика по Отделениям
        </h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="pb-2">ОТДЕЛЕНИЕ</th>
              <th>КОЛ-ВО КОНТЕЙНЕРОВ</th>
              <th>СРЕДНЯЯ ЗАПОЛНЕННОСТЬ</th>
              <th>ОБЩИЙ ВЕС (КГ)</th>
              <th>ТРЕБУЮТ ВНИМАНИЯ</th>
            </tr>
          </thead>

          <tbody>
            {departments.map((dep) => (
              <tr key={dep.name} className="border-b">
                <td className="py-3">{dep.name}</td>
                <td>{dep.bins}</td>
                <td>{dep.avgFullness}%</td>
                <td>{dep.totalWeight}</td>
                <td>{dep.needsAttention}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Reports;