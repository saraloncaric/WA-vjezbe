export default function razlika_datuma(datum1, datum2) {
    const d1 = new Date(datum1);
    const d2 = new Date(datum2);

    const razlika_u_ms = Math.abs(d2 - d1);
    const razlika_u_danima = razlika_u_ms / 1000 / 60 / 60 / 24;

    return razlika_u_danima;
}