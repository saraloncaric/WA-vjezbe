<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import OrderFooter from './OrderFooter.vue';
import { addIcons } from 'oh-vue-icons';
import { GiTomato, GiCheeseWedge, GiSlicedMushroom, IoLeafSharp, CoHotjar, GiMilkCarton,
GiBellPepper, LaPepperHotSolid, GiCannedFish, GiGarlic, FaBacon, GiHamShank } from 'oh-vue-icons/icons';
import { useRouter } from 'vue-router';

addIcons(GiTomato, GiCheeseWedge, GiSlicedMushroom, IoLeafSharp, GiBellPepper, GiHamShank,
LaPepperHotSolid, GiCannedFish, GiGarlic, FaBacon, CoHotjar, GiMilkCarton);

const ikoneSastojaka = {
    rajčica: 'gi-tomato',
    sir: 'gi-cheese-wedge',
    gljive: 'gi-sliced-mushroom',
    bosiljak: 'io-leaf-sharp',
    paprika: 'gi-bell-pepper',
    šunka: 'gi-ham-shank', 'feferoni ljuti': 'la-pepper-hot-solid',
    tunjevina: 'gi-canned-fish', 'crveni luk': 'gi-garlic',
    panceta: 'fa-bacon',
    kulen: 'co-hotjar',
    vrhnje: 'gi-milk-carton'
};

const router = useRouter();
const odabranaPizza = ref(null);
const pizze = ref([]);

const trazilica_naziv = ref('');
const cijena_min = ref('');
const cijena_max = ref('');
const sortirano = ref('');

async function fetchPizze() {
    try {
        const parametri = {};
        if (trazilica_naziv.value) {
            parametri.naziv = trazilica_naziv.value;
        }
        if (cijena_min.value) {
            parametri.cijena_min = cijena_min.value;
        }
        if (cijena_max.value) {
            parametri.cijena_max = cijena_max.value;
        }
        if (sortirano.value) {
            parametri.sort = sortirano.value === 'asc' ? 1 : -1;
        }
        const response = await axios.get('http://localhost:3000/pizze', { params: parametri }); 
        pizze.value = response.data;
    } catch (error) {
        console.error('Greška pri dohvaćanju podataka o pizzama:', error);
    }
}
onMounted(() => {
    fetchPizze(); 
});

function odaberiPizzu(pizza) {
    odabranaPizza.value = pizza;
}
function prikaziDetalje(pizza) {
    router.push(`/pizze/${pizza.naziv}`);
}
</script>
<template>
    <div class="mx-auto bg-linear-to-br min-h-screen p-8 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat">
        <div class="mb-6 flex flex-wrap gap-4 items-end bg-white/80 p-4 rounded-xl">
            <div>
                <label class="block text-sm font-medium mb-1">Naziv</label>
                <input v-model="trazilica_naziv" class="p-2 rounded border border-gray-300" />
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-1">Min cijena</label>
                <input v-model="cijena_min" type="number" step="0.01" class="p-2 rounded border border-gray-300" />
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-1">Max cijena</label>
                <input v-model="cijena_max" type="number" step="0.01" class="p-2 rounded border border-gray-300" />
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-1">Sortiraj po cijeni</label>
                <select v-model="sortirano" class="p-2 rounded border border-gray-300">
                    <option value="">Bez sortiranja</option>
                    <option value="asc">Najjeftinije prvo</option>
                    <option value="desc">Najskuplje prvo</option>
                </select>
            </div>

            <button @click="fetchPizze"
                class="bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded transition-colors">
                Pretraži
            </button>
        </div>

        <div v-if="pizze.length === 0" class="text-center py-12 bg-white/80 rounded-xl">
            <p class="text-xl text-gray-600">Nema pizza koje odgovaraju kriterijima pretrage.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
                v-for="pizza in pizze"
                :key="pizza.id"
                @click="odaberiPizzu(pizza)" 
                class="bg-inherit rounded-xl overflow-hidden cursor-pointer transition-all duration-300">
                <div class="w-full h-48 flex items-center justify-center bg-inherit overflow-hidden rounded-xl">
                    <img :src="pizza.slika_url" :alt="pizza.naziv" class="w-full h-full object-cover" />
                </div>

                <div class="p-6">
                    <div class="flex items-center space-x-3 mb-4">
                        <h2 class="text-lg font-bold text-orange-500 tracking-wide">{{ pizza.naziv }}</h2>

                        <div class="flex space-x-2">
                            <div 
                                v-for="sastojak in pizza.sastojci" 
                                :key="sastojak" 
                                class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs">
                                <v-icon :name="ikoneSastojaka[sastojak]" />
                            </div>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <div class="flex justify-between text-gray-700">
                            <span class="font-medium">Mala</span>
                            <span>€{{ pizza.cijene.mala }}</span>
                        </div>

                        <div class="flex justify-between text-gray-700">
                            <span class="font-medium">Srednja</span>
                            <span>€{{ pizza.cijene.srednja }}</span>
                        </div>

                        <div class="flex justify-between text-gray-700">
                            <span class="font-medium">Jumbo</span>
                            <span>€{{ pizza.cijene.jumbo }}</span>
                        </div>
                    </div>
                    <div class="flex justify-between mt-4">
                        <button @click="prikaziDetalje(pizza)" class="bg-blue-500 text-white py-1 px-3 rounded">
                            Detalji
                        </button>

                        <button @click="odaberiPizzu(pizza)" class="bg-green-500 text-white py-1 px-3 rounded">
                            Dodaj u košaricu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <OrderFooter v-if="odabranaPizza" :odabrana-pizza="odabranaPizza" @close="odabranaPizza = null" />
</template>