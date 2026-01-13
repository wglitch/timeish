document.addEventListener("DOMContentLoaded", () => {
  const clockEl = document.getElementById("clock");

  let driftMs = 0;      // Hur mycket klockan halkat efter/före
  let mouseBias = 0;    // Musstyrning

  // Nuvarande värden för mjuk interpolering
  let blurCurrent = 0;
  let opacityCurrent = 1;
  let sizeCurrent = 8; // rem

  // Musposition → bias
  document.addEventListener("mousemove", (e) => {
    const y = e.clientY / window.innerHeight;
    mouseBias = (0.5 - y) * 2; // -1 till +1
  });

  setInterval(() => {
    const realNow = new Date();

      // slump + mus + tröghet
    driftMs += (Math.random() - 0.5) * 400; // mindre än innan för mjukare
    driftMs += mouseBias * 80;
    driftMs *= 0.995;

    const now = new Date(Date.now() + driftMs);
    clockEl.textContent = now.toLocaleTimeString();

    // --- MÅLVÄRDEN för blur, opacity, storlek ---
    const driftAbs = Math.abs(driftMs);

    const blurTarget = Math.min(driftAbs / 2500, 1.2);        // max 1.2px
    const opacityTarget = isFocusTime(realNow)
      ? 1
      : Math.max(0.6, 1 - driftAbs / 6000);
    const sizeTarget = isFocusTime(realNow)
      ? 8
      : 8 * (1 + Math.sin(driftMs / 4000) * 0.05);           // ±3%

    // --- MJUK INTERPOLERING ---
    blurCurrent += (blurTarget - blurCurrent) * 0.1;
    opacityCurrent += (opacityTarget - opacityCurrent) * 0.1;
    sizeCurrent += (sizeTarget - sizeCurrent) * 0.1;

    // --- Apply styles ---
    clockEl.style.filter = `blur(${blurCurrent}px)`;
    clockEl.style.opacity = opacityCurrent;
    clockEl.style.fontSize = `${sizeCurrent}rem`;

  }, 200); // uppdaterar 20 ggr/sek → mjukt flöde
});
