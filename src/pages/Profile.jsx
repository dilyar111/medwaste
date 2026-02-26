import React, { useState } from "react";

function Profile() {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    department: "",
    phone: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [verificationCode, setVerificationCode] = useState("");
  const [telegramId, setTelegramId] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h1 className="text-3xl font-bold mb-2">Мой профиль</h1>
          <p className="text-gray-500 mb-6">
            Обновляйте личные данные и подтверждайте телефон
          </p>

          <div className="grid grid-cols-2 gap-6 text-sm">
            <Info label="Роль" value="user" />
            <Info label="Телефон" value="Не подтвержден" danger />
            <Info label="EMAIL" value={profile.email} />
            <Info label="ТЕЛЕФОН" value={profile.phone} />
            <Info label="ОТДЕЛЕНИЕ" value="—" />
            <Info label="СТАТУС" value="Активен" success />
          </div>
        </div>

        {/* PROFILE INFO */}
        <Section title="Информация профиля" subtitle="Обновите ваши личные данные">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Имя пользователя"
              hint="От 3 до 30 символов, только буквы, цифры, подчеркивания и дефисы"
              value={profile.username}
              onChange={(v) => setProfile({ ...profile, username: v })}
            />

            <Input
              label="Email"
              value={profile.email}
              onChange={(v) => setProfile({ ...profile, email: v })}
            />

            <div className="col-span-2">
              <Input
                label="Отделение"
                value={profile.department}
                onChange={(v) => setProfile({ ...profile, department: v })}
              />
            </div>
          </div>

          <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg">
            Сохранить изменения
          </button>
        </Section>

        {/* PASSWORD */}
        <Section title="Настройки безопасности" subtitle="Обновите ваш пароль">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Текущий пароль"
              type="password"
              value={passwords.current}
              onChange={(v) => setPasswords({ ...passwords, current: v })}
            />

            <Input
              label="Новый пароль"
              type="password"
              hint="Минимум 8 символов, включая буквы и цифры"
              value={passwords.newPass}
              onChange={(v) => setPasswords({ ...passwords, newPass: v })}
            />

            <div className="col-span-2">
              <Input
                label="Подтвердите новый пароль"
                type="password"
                value={passwords.confirm}
                onChange={(v) => setPasswords({ ...passwords, confirm: v })}
              />
            </div>
          </div>

          <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg">
            Изменить пароль
          </button>
        </Section>

        {/* PHONE VERIFICATION */}
        <Section
          title="Телефон и подтверждение"
          subtitle="Номер нужен для SMS/WhatsApp уведомлений"
        >
          <p className="text-red-500 text-sm mb-4">Не подтвержден</p>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Номер телефона"
              hint="Формат E.164, например +77051234567"
              value={profile.phone}
              onChange={(v) => setProfile({ ...profile, phone: v })}
            />

            <div className="flex items-end">
              <button className="bg-gray-200 px-4 py-2 rounded-lg w-full">
                Отправить код
              </button>
            </div>

            <Input
              label="Код подтверждения"
              value={verificationCode}
              onChange={setVerificationCode}
            />

            <div className="flex items-end">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">
                Подтвердить телефон
              </button>
            </div>
          </div>
        </Section>

        

      </div>
    </div>
  );
}

/* --- UI Components --- */

function Section({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-bold mb-1">{title}</h2>
      <p className="text-gray-500 mb-6">{subtitle}</p>
      {children}
    </div>
  );
}

function Info({ label, value, danger, success }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p
        className={`font-medium ${
          danger ? "text-red-500" : success ? "text-green-600" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", hint }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 mt-1"
      />
      {hint && (
        <p className="text-xs text-gray-400 mt-1">{hint}</p>
      )}
    </div>
  );
}

export default Profile;