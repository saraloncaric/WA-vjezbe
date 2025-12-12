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

const prezime = ref('');
const adresa = ref('');
const telefon = ref(''); 
const statusNarudzbe = ref('');       

function dodajUNarudzbu() {
    const novaStavka = {
        naziv: props.odabranaPizza.naziv,
        velicina: odabranaVelicina.value,
        kolicina: kolicina.value
    };
    narucene_pizze.value.push(novaStavka); 
    console.log('Naručene pizze:', narucene_pizze.value);
}
function obrisiStavku(index) {
    narucene_pizze.value.splice(index, 1);
}
const ukupna_cijena_stavke = computed(() => {
    const cijenaPoKomadu = props.odabranaPizza.cijene[odabranaVelicina.value];
    return (cijenaPoKomadu * kolicina.value).toFixed(2);
});
const emit = defineEmits(['close']);

async function posaljiNarudzbu() {
    try {
        if (narucene_pizze.value.length === 0) {
            statusNarudzbe.value = 'Košarica je prazna! Molimo dodajte pizze prije narudžbe.';
            return;
        }
        if (!prezime.value || !adresa.value || !telefon.value) {
            statusNarudzbe.value = 'Molimo unesite prezime, adresu i broj telefona';
            return;
        }
        const podaciZaDostavu = {
            prezime: prezime.value,
            adresa: adresa.value,
            telefon: telefon.value
        };
        const odgovor = await axios.post('http://localhost:3000/narudzbe', {
            narucene_pizze: narucene_pizze.value,
            podaci_dostava: podaciZaDostavu
        });
        statusNarudzbe.value = odgovor.data.message;

        narucene_pizze.value = [];
        prezime.value = '';
        adresa.value = '';
        telefon.value = '';
    } catch (error) {
        if(error.response && error.response.data) {
            statusNarudzbe.value = error.response.data.message;
        } else {
            statusNarudzbe.value = 'Došlo je do greške pri slanju narudžbe. Molimo pokušajte ponovno.';
        }
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

    <div class="mt-4 space-y-3">
        <h4 class="font-semibold text-lg text-white">Podaci za dostavu:</h4>
        <input v-model="prezime" type="text" placeholder="Prezime" class="w-full px-3 rounded-md border border-slate-700 text-white" />
        <input v-model="adresa" type="text" placeholder="Adresa" class="w-full px-3 rounded-md border border-slate-700 text-white" />
        <input v-model="telefon" type="text" placeholder="Telefon" class="w-full px-3 rounded-md border border-slate-700 text-white" />
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
                <div class="flex items-center gap-3">
                    <div class="text-orange-400 font-semibold">
                        {{ (props.odabranaPizza.cijene[stavka.velicina] * stavka.kolicina).toFixed(2)}}€
                    </div>
                    <button @click="obrisiStavku(index)" class="text-red-400 hover:text-red-600 font-bold cursor-pointer">x</button>
                </div>
            </li>
        </ul>
    </div>
</div>
</template>