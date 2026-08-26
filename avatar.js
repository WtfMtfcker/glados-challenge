const AvatarLinux = (() => {
  const root = document.querySelector("#gladtec");
  const pupil = root.querySelector(".pupil");
  const stateLabel = root.querySelector("#avatar-state-label");
  const message = root.querySelector("#avatar-message");
  const toggleButton = document.querySelector("#avatar-toggle");
  const showButton = document.querySelector("#show-avatar");

  const states = {
    explicant: {
      label: "EXPLICANT",
      message: "Preparant la propera missió..."
    },
    error: {
      label: "ERROR",
      message: "Aquesta comanda no fa exactament el que esperaves."
    },
    correcte: {
      label: "CORRECTE",
      message: "Ordre acceptada. El sistema continua funcionant."
    },
    avorrida: {
      label: "AVORRIDA",
      message: "Fa estona que no detecto cap activitat..."
    }
  };

  let inactivityTimer;
  let currentState = "explicant";

  function setState(state) {
    if (!states[state]) return;

    currentState = state;

    root.classList.remove(
      "estat-explicant",
      "estat-error",
      "estat-correcte",
      "estat-avorrida"
    );

    root.classList.add(`estat-${state}`);
    stateLabel.textContent = states[state].label;
    message.textContent = states[state].message;

    resetInactivityTimer();
  }

  function setMessage(text) {
    message.textContent = text;
  }

  function trackPointer(event) {
    const eye = root.querySelector(".avatar-eye");
    const eyeRect = eye.getBoundingClientRect();

    const eyeCenterX = eyeRect.left + eyeRect.width / 2;
    const eyeCenterY = eyeRect.top + eyeRect.height / 2;

    const dx = event.clientX - eyeCenterX;
    const dy = event.clientY - eyeCenterY;

    const distance = Math.hypot(dx, dy) || 1;
    const maximum = 13;
    const movement = Math.min(maximum, distance / 18);

    const x = (dx / distance) * movement;
    const y = (dy / distance) * movement;

    pupil.style.transform = `translate(${x}px, ${y}px)`;
  }

  function resetEye() {
    pupil.style.transform = "translate(0, 0)";
  }

  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);

    inactivityTimer = setTimeout(() => {
      setState("avorrida");
    }, 45000);
  }

  function registerActivity() {
    if (currentState === "avorrida") {
      setState("explicant");
    }

    resetInactivityTimer();
  }

  document.addEventListener("pointermove", trackPointer, {
    passive: true
  });

  document.addEventListener("pointerdown", registerActivity, {
    passive: true
  });

  document.addEventListener("keydown", registerActivity);

  root.addEventListener("mouseleave", resetEye);

  toggleButton.addEventListener("click", () => {
    root.classList.add("hidden");
    showButton.classList.remove("hidden");
  });

  showButton.addEventListener("click", () => {
    root.classList.remove("hidden");
    showButton.classList.add("hidden");
    resetInactivityTimer();
  });

  resetInactivityTimer();

  return {
    setState,
    setMessage,
    registerActivity
  };
})();
