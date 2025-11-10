export const agencije = [
    { id: 1, ime: "Putuj S Nama", email: "info@putujsnama.hr" },
    { id: 2, ime: "EuroAvantura", email: "kontakt@euroavantura.hr" },
    { id: 3, ime: "Adriatic Dreams", email: "info@adriaticdreams.hr" },
    { id: 4, ime: "TravelGo", email: "info@travelgo.hr" },
    { id: 5, ime: "Explore Croatia", email: "info@explorecroatia.hr" },
    { id: 6, ime: "Vikend Izleti", email: "izleti@vikend.hr" },
];

export const putovanja = [
    { id: 1, destinacija: "Pariz", drzava: "Francuska", budzet: 550, opis: "Romantični vikend u gradu svjetlosti", IdAgencija: 1 },
    { id: 2, destinacija: "Rim", drzava: "Italija", budzet: 480, opis: "Povijest, umjetnost i pizza na svakom koraku", IdAgencija: 2 },
    { id: 3, destinacija: "Barcelona", drzava: "Španjolska", budzet: 520, opis: "Gaudí, more i tapas – savršena kombinacija", IdAgencija: 3 },
    { id: 4, destinacija: "Prag", drzava: "Češka", budzet: 350, opis: "Zlatni grad s tisuću tornjeva i dobrom pivom", IdAgencija: 4 },
    { id: 5, destinacija: "Amsterdam", drzava: "Nizozemska", budzet: 500, opis: "Vožnja biciklom kroz kanale i muzeje", IdAgencija: 5 },
    { id: 6, destinacija: "Budimpešta", drzava: "Mađarska", budzet: 300, opis: "Termalne kupke, mostovi i noćni život", IdAgencija: 6 },
    { id: 7, destinacija: "Beč", drzava: "Austrija", budzet: 400, opis: "Kultura, dvorci i savršeni kolači", IdAgencija: 7 },
];

export const korisnici = [
    { id: 1, ime: "Ana", prezime: "Kovač", email: "ana.kovac@example.com", omiljenaPutovanja: [1, 3, 10] },
    { id: 2, ime: "Marko", prezime: "Horvat", email: "marko.horvat@example.com", omiljenaPutovanja: [2, 4, 6] },
    { id: 3, ime: "Lucija", prezime: "Radić", email: "lucija.radic@example.com", omiljenaPutovanja: [5, 7, 9] },
    { id: 4, ime: "Ivan", prezime: "Marić", email: "ivan.maric@example.com", omiljenaPutovanja: [8, 1] },
    { id: 5, ime: "Petra", prezime: "Novak", email: "petra.novak@example.com", omiljenaPutovanja: [3] },
    { id: 6, ime: "Luka", prezime: "Babić", email: "luka.babic@example.com", omiljenaPutovanja: [4, 6, 8] },
    { id: 7, ime: "Mia", prezime: "Jurić", email: "mia.juric@example.com", omiljenaPutovanja: [2, 3, 9] },
    { id: 8, ime: "Filip", prezime: "Božić", email: "filip.bozic@example.com", omiljenaPutovanja: [1, 7] },
];