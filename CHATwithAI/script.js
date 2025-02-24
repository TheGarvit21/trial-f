let crsr = document.querySelector("#cursor");
let blur = document.querySelector("#cursor-blur");
document.addEventListener("mousemove", (dets) => {
  crsr.style.left = dets.x + "px";
  crsr.style.top = dets.y + "px";
  blur.style.left = dets.x - 75 + "px";
  blur.style.top = dets.y - 75 + "px";
});

// let h4all = document.querySelectorAll("#nav h4");
// h4all.forEach((elem) => {
//   elem.addEventListener("mouseenter", () => {
//     crsr.style.scale = 3;
//     crsr.style.border = "1px solid";
//   });
// });

gsap.to("#nav", {
  backgroundColor: "#000",
  height: "100px",
  duration: 0.5,

  scrollTrigger: {
    trigger: "#nav",
    srcoller: "body",
    // markers: true,
    start: "top -10px",
    end: "top -11px",
    scrub: 1,
  },
});

gsap.to("#main", {
  backgroundColor: "#000",
  scrollTrigger: {
    trigger: "#main",
    scroller: "body",
    // markers: true,
    start: "top 10%",
    end: "top -70%",
    scrub: 2,
  },
});

gsap.from("#about-us img,#about-us-in", {
  y: 90,
  opacity: 0,
  duration: 1,
  scrollTrigger: {
    trigger: "#about-us",
    scroller: "body",
    // markers:true,
    start: "top 70%",
    end: "top 65%",
    scrub: 4,
  },
});

gsap.from(".card", {
  scale: 0.8,
  // opacity:0,
  duration: 1,
  stagger: 0.1,
  scrollTrigger: {
    trigger: ".card",
    scroller: "body",
    // markers:false,
    start: "top 70%",
    end: "top 65%",
    scrub: 1,
  },
});

gsap.from("#page4 h1", {
  y: 50,
  scrollTrigger: {
    trigger: "#page4 h1",
    scroller: "body",
    // markers:true,
    start: "top 75%",
    end: "top 70%",
    scrub: 3,
  },
});
