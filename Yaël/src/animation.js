import gsap from "gsap";

const button = document.querySelector("#button_explore");
const text = button.textContent;
button.textContent = "";

for (let i = 0; i < text.length; i++) {
    const letter = document.createElement("span");
    letter.className = "letter";
    letter.textContent = text[i] === " " ? "\u00A0" : text[i];
    button.appendChild(letter);
}

const letters = document.querySelectorAll(".letter");

const tl = gsap.timeline({ paused: true });

tl.to(letters, {
    y: -10,
    duration: 0.4,
    stagger: {
        each: 0.05,
        from: "start",
        yoyo: true,
        repeat: -1
    },
    ease: "power2.inOut",
    yoyo: true,
    repeat: -1
});

button.addEventListener("mouseenter", () => {
    tl.play();
});

button.addEventListener("mouseleave", () => {
    tl.pause();
    gsap.to(letters, {
        y: 0,
        duration: 0.3,
        ease: "power2.out"
    });
});

button.addEventListener("click", () => {
    window.location.href = "/Yael/src/about_me/index.html";
});
