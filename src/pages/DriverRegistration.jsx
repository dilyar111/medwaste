import React, { useState } from "react";

function DriverRegistration() {
  const [form, setForm] = useState({
    licenseNumber: "",
    licenseExpiry: "",
    company: "",
    plateNumber: "",
    vehicleModel: "",
    vehicleYear: "",
    capacity: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Driver Registration:", form);
    alert("Заявка отправлена (mock)");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8">

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-2">
          Регистрация Водителя
        </h1>
        <p className="text-gray-500 mb-8">
          Зарегистрируйтесь как водитель для сбора медицинских отходов
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* LICENSE INFO */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Информация о Водительских Правах
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">
                  Номер Водительских Прав *
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  required
                  value={form.licenseNumber}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Срок Действия Прав *
                </label>
                <input
                  type="date"
                  name="licenseExpiry"
                  required
                  value={form.licenseExpiry}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm text-gray-600">
                  Медицинская Компания *
                </label>
                <select
                  name="company"
                  required
                  value={form.company}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                >
                  <option value="">Выберите Медицинскую Компанию</option>
                  <option value="clinic1">Городская Клиника №1</option>
                  <option value="hospital2">Центральная Больница</option>
                  <option value="lab3">Медицинская Лаборатория</option>
                </select>
              </div>
            </div>
          </div>

          {/* VEHICLE INFO */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Информация о Транспортном Средстве
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">
                  Номерной Знак *
                </label>
                <input
                  type="text"
                  name="plateNumber"
                  required
                  value={form.plateNumber}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Модель Автомобиля
                </label>
                <input
                  type="text"
                  name="vehicleModel"
                  value={form.vehicleModel}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Год Выпуска
                </label>
                <input
                  type="number"
                  name="vehicleYear"
                  value={form.vehicleYear}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Грузоподъемность (кг)
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>
            </div>
          </div>

          {/* EMERGENCY CONTACT */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Экстренный Контакт
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-600">
                  Имя
                </label>
                <input
                  type="text"
                  name="emergencyName"
                  value={form.emergencyName}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Телефон
                </label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={form.emergencyPhone}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Отношение
                </label>
                <input
                  type="text"
                  name="emergencyRelation"
                  value={form.emergencyRelation}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>
            </div>
          </div>

          {/* SUBMIT */}
          <div>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              Подать Заявку
            </button>

            <p className="text-sm text-gray-500 mt-4">
              После подачи заявки администратор проверит предоставленную
              информацию. Вы получите уведомление о статусе вашей заявки
              по электронной почте.
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}

export default DriverRegistration;