function arrays_are_same(array_1, array_2) {
    if(array_1.length !== array_2.length) return false;
    //inace vrati mi True ako je svaki element iz array1 ujedno unutar array_2
    return array_1.every(element => array_2.includes(element)); 
}