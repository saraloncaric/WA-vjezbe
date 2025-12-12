<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import OrderFooter from './OrderFooter.vue';

const route = useRoute();
const router = useRouter();

const pizza = ref(null);
const error = ref('');
const footer = ref(true);

onMounted(async () => {
    try {
        const naziv = route.params.naziv;
        const res = await axios.get(`http://localhost:3000/pizze/${naziv}`);
        pizza.value = res.data;
    } catch (err) {
        error.value = err.response?.data?.message || 'Greška pri dohvaćanju pizze';
    }
})
function natrag() {
    router.push('/pizze');
}
function zatvoriFooter() {
    prikaziFooter.value = false;
}
</script>
<template>
<div class="p-6 bg-slate-800 text-white rounded-lg shadow-md">
    <button @click="natrag" class="mb-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
        Natrag na popis
    </button>
    <div v-if="error" class="text-red-400 font-semibold">
        {{ error }}
    </div>
    <div v-else-if="pizza">
        <h2 class="text-2xl font-bold text-orange-400 mb-2">
            {{ pizza.naziv }}
        </h2>
        <img :src="pizza.slika_url" :alt="pizza.naziv" class="w-48 h-48 object-cover rounded-md border border-slate-500 mb-4" />
        <h3 class="text-lg font-semibold mb-2">Cijene:</h3>
        <ul class="space-y-1">
            <li v-for="(cijena, velicina) in pizza.cijene" :key="velicina">
                {{ velicina }} – {{ cijena }}€
            </li>
        </ul>
        <p class="mt-4">{{ pizza.opis }}</p>
    </div>
</div>
</template>