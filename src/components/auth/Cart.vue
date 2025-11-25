<template>
  <div class="cart-widget">
    <h4>Корзина</h4>
    <div v-if="!items.length">Корзина пуста</div>
    <ul>
      <li v-for="it in items" :key="it.product._id">
        {{ it.product.title || it.product.name }} — {{ it.qty }}
        <button @click="remove(it.product._id)">Удалить</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useCartStore } from '@/stores/cart';

const cart = useCartStore();
const items = computed(() => cart.items);

function remove(id){ cart.remove(id); }
</script>
