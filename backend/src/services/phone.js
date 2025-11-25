// src/services/phone.js

// Заглушка для отправки кода по SMS
export const sendVerifyCode = async (phone) => {
  // Здесь обычно интеграция с SMS-провайдером, например Twilio
  console.log(`Отправка кода на номер: ${phone}`)
  // Можно сохранять код в памяти для теста (в проде — в базе или кеш)
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  global.phoneCodes = global.phoneCodes || {}
  global.phoneCodes[phone] = code
  console.log(`Код для теста: ${code}`)
  return true
}

// Заглушка для проверки кода
export const checkVerifyCode = async (phone, code) => {
  global.phoneCodes = global.phoneCodes || {}
  const correct = global.phoneCodes[phone]
  return correct === code
}
