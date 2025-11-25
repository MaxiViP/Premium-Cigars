<template>
  <div class="cart-page">
    <h1>Корзина</h1>
    <div v-if="auth.user?.cart?.length">
      <div v-for="item in auth.user.cart" :key="getItemId(item)" class="cart-item">
        <div class="item-info">
          <h3>{{ getProductName(item) }}</h3>
          <p>Количество: {{ item.qty }}</p>
          <p>Цена: {{ getProductPrice(item) }} ₽</p>
        </div>
        <button @click="removeFromCart(item)" class="remove-btn">Удалить</button>
      </div>
      <div class="cart-total">
        <p>Итого: {{ auth.cartTotalPrice }} ₽</p>
        <button class="checkout-btn">Оформить заказ</button>
      </div>
    </div>
    <div v-else class="empty-cart">
      <p>Корзина пуста</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const getItemId = (item: any) => {
  return typeof item.product === 'string' ? item.product : item.product._id
}

const getProductName = (item: any) => {
  if (typeof item.product === 'object') {
    return item.product.name || item.product.title || 'Товар'
  }
  return 'Товар'
}

const getProductPrice = (item: any) => {
  if (typeof item.product === 'object' && item.product.price) {
    return item.product.price * item.qty
  }
  return 0
}

const removeFromCart = async (item: any) => {
  const productId = getItemId(item)
  await auth.removeFromCart(productId)
}
</script>

<style scoped>
.cart-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  margin-bottom: 1rem;
}

.item-info h3 {
  margin: 0 0 0.5rem 0;
}

.remove-btn {
  background: #ff4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.cart-total {
  margin-top: 2rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
  text-align: center;
}

.checkout-btn {
  background: #b8860b;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 1rem;
}

.empty-cart {
  text-align: center;
  padding: 3rem;
  color: #666;
}
</style>
