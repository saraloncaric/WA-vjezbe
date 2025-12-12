<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';

const props = defineProps({
    odabranaPizza: {
        type: Object,
        required: true 
    }
});
const narucene_pizze = ref([]);
const odabranaVelicina = ref('mala');
const kolicina = ref(1);

function dodajUNarudzbu() {
    const novaStavka = {
        naziv: props.odabranaPizza.naziv,
        velicina: odabranaVelicina.value,
        kolicina: kolicina.value
    };
    narucene_pizze.value.push(novaStavka); 
    console.log('Naručene pizze:', narucene_pizze.value);
}
const ukupna_cijena_stavke = computed(() => {
    const cijenaPoKomadu = props.odabranaPizza.cijene[odabranaVelicina.value];
    return (cijenaPoKomadu * kolicina.value).toFixed(2);
});
const emit = defineEmits(['close']);

async function posaljiNarudzbu() {
    try {
        if (narucene_pizze.value.length === 0) {
            alert('Košarica je prazna! Molimo dodajte pizze prije narudžbe.');
            return;
        }
        const podaciZaDostavu = {
            prezime: 'Pilić',
            adresa: 'Ilica 305, Zagreb',
            telefon: '091234567'
        };
        const odgovor = await axios.post('http://localhost:3000/narudzbe', {
            narucene_pizze: narucene_pizze.value,
            podaci_dostava: podaciZaDostavu
        });
        console.log('Narudžba uspješno poslana:', odgovor.data);
        alert('Hvala! Vaša narudžba je uspješno poslana.');
        narucene_pizze.value = [];
    } catch (error) {
        console.error('Greška pri slanju narudžbe:', error);
        alert('Došlo je do greške pri slanju narudžbe. Molimo pokušajte ponovno.');
    }
}
</script>
<template>
<div class="w-full mt-6 bg-slate-800 p-6 border-t border-slate-600 shadow-lg text-white">
    <div class="flex flex-wrap items-center gap-4 mb-4">
        <img :src="odabranaPizza.slika_url" :alt="odabranaPizza.naziv"
            class="w-12 h-12 object-cover rounded-md border border-slate-500" />
        <h3 class="text-lg font-bold text-orange-400">{{ odabranaPizza.naziv }}</h3>
        <div class="flex gap-2 flex-wrap ml-6">
            <div
                v-for="(cijena, velicina) in odabranaPizza.cijene"
                :key="velicina"
                @click="odabranaVelicina = velicina"
                :class="[ 
                    'px-2 py-1 rounded-md border border-slate-500 text-sm hover:bg-orange-500 hover:text-white cursor-pointer',
                    odabranaVelicina === velicina
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-600/40 text-white'
                ]">
                {{ velicina }} – {{ cijena }}€
            </div>
        </div>

        <div class="flex items-center gap-2 ml-9">
            <button @click="kolicina ? kolicina-- : kolicina = 1"
                class="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600">
                -
            </button>
            <div class="px-3 py-1 bg-slate-600/40 rounded-md border border-slate-500 text-sm">
                {{ kolicina }}
            </div>
            <button @click="kolicina ? kolicina++ : (kolicina = 1)"
                class="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600">
                +
            </button>
        </div>
        <div class="font-semibold text-lg text-orange-400 tracking-wide">
            Ukupno: {{ ukupna_cijena_stavke || '0.00' }}€
        </div>
        <button @click="dodajUNarudzbu"
            class="bg-orange-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md hover:bg-orange-600 ml-5">
            Dodaj u košaricu
        </button>
        <button @click="posaljiNarudzbu"
            class="bg-orange-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md hover:bg-orange-600 ml-6">
            Naruči
        </button>
        <button class="ml-auto text-slate-300 hover:text-white text-xl font-bold cursor-pointer" 
            @click="emit('close')">
            ×
        </button>
    </div>

    <div v-if="narucene_pizze.length"
        class="mt-4 max-w-2xl mx-auto max-h-40 overflow-y-auto bg-slate-800/50 rounded-lg p-3 border-slate-600">
        <h4 class="font-semibold text-lg text-white mb-2">Stavke u košarici:</h4>
        <ul class="space-y-2">
            <li v-for="(stavka, index) in narucene_pizze"
                :key="index"
                class="flex items-center justify-between bg-slate-700/50 rounded-md p-2">
                <div class="text-white">
                    {{ stavka.naziv }} ({{ stavka.velicina }}) x{{ stavka.kolicina }}
                </div>
                <div class="text-orange-400 font-semibold">
                    {{ (props.odabranaPizza.cijene[stavka.velicina] * stavka.kolicina).toFixed(2)}}€
                </div>
            </li>
        </ul>
    </div>
</div>
</template>