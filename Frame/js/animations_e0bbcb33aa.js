gsap.registerPlugin(ScrollTrigger),
  ScrollTrigger.config({ limitCallbacks: !0 });
let navbar = document.getElementById("primarynav");
navbar.addEventListener("hidden.bs.offcanvas", function () {
  document.querySelector(".nav-icon-contain").classList.remove("close");
}),
  navbar.addEventListener("shown.bs.offcanvas", function () {
    document.querySelector(".nav-icon-contain").classList.add("close");
  });
const players = Array.from(document.querySelectorAll(".video-player")).map(
    (p) => new Plyr(p)
  ),
  hero_scroll = gsap.timeline({
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: 0.5,
      pin: !0,
      pinSpacing: !1,
    },
  });
document.querySelector("#hero .hero-bg") &&
  hero_scroll.to(
    "#hero .hero-bg",
    { duration: 2, opacity: 0.6, yPercent: -10 },
    "<"
  ),
  document.querySelector("#hero-text") &&
    hero_scroll.to("#hero-text", { duration: 2, opacity: 0.6, y: -200 }, "<");
const pinNav = ScrollTrigger.create({
  trigger: ".hero-contain",
  start: "top 10px",
  end: "bottom 50px",
  toggleClass: { targets: "#main-nav", className: "hero-nav" },
  id: "pin nav",
});
if (document.querySelector("#home-feature-carousel-1")) {
  ScrollTrigger.create({
    trigger: "#home-feature-carousel-1",
    start: "top 10px",
    end: "bottom 50px",
    toggleClass: { targets: "#main-nav", className: "hero-nav" },
  });
}
const lazyLoad = gsap.utils.toArray("[data-lazy-type]").forEach((lazy) => {
  const lazyLoadBatch = (item) => {
      "bg-image" == item.dataset.lazyType
        ? (item.style.backgroundImage = `url('${item.dataset.lazySrc}')`)
        : "carousel" == item.dataset.lazyType
        ? carouselLazy(item)
        : ((item.src = item.dataset.lazySrc),
          "image" == item.dataset.lazyType && item.classList.add("lazy-loaded"),
          "video" == item.dataset.lazyType &&
            (item.poster = item.dataset.poster),
          "bg-video" == item.dataset.lazyType &&
            item.dataset.poster &&
            (item.poster = item.dataset.poster));
    },
    carouselLazy = (carousel) => {
      carousel.querySelectorAll("[data-lazy-type]").forEach((item, i) => {
        lazyLoadBatch(item);
      });
    };
  ScrollTrigger.create({
    trigger: lazy,
    start: "top 150%",
    onEnter: () => lazyLoadBatch(lazy),
    onEnterBack: () => lazyLoadBatch(lazy),
    once: !0,
  });
});
let carousels = Array.from(document.querySelectorAll(".carousel")).forEach(
    (carousel) => {
      carousel.addEventListener("slide.bs.carousel", (e) => {
        let item = e.relatedTarget.querySelector("[data-lazy-type]");
        Array.from(
          e.currentTarget.querySelectorAll('video, [data-lazy-type="yt"]')
        ).forEach((video) => {
          if ("yt" == video.dataset.lazyType) {
            players.find((el) => el.elements.container === video).pause();
          } else video.pause();
        }),
          "bg-video" === item.dataset.lazyType && item.play();
      });
    }
  ),
  filters = document.querySelector("#toggleCategories");
filters &&
  filters.addEventListener("click", function (e) {
    document.querySelector("#filter .dropdown").classList.toggle("show"),
      document.querySelector(".dropdown-menu").classList.toggle("show");
  });
let closeFilters = document.querySelector("#closeCategories");
if (
  (closeFilters &&
    closeFilters.addEventListener("click", function (e) {
      document.querySelector("#filter .dropdown").classList.remove("show"),
        document.querySelector(".dropdown-menu").classList.remove("show");
    }),
  document.querySelector(".publications-container"))
) {
  let publicationFilterRefresh,
    typeFilters = document.querySelectorAll(".filter-type"),
    boxes = document.querySelectorAll(
      ".publications-container [data-publication-category]"
    ),
    checkboxes = document.querySelectorAll(
      '#filter.publication-filter input[type="checkbox"]'
    ),
    publicationCatCheckboxes = document.querySelectorAll(
      '#filter.publication-filter .publication-categories input[type="checkbox"]'
    ),
    typeStatus = { paper: !0, talk: !0 },
    filterCategoriesSelected = [];
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("click", function () {
      publicationFilterRefresh();
    });
  }),
    document
      .querySelector("#clearCategories")
      .addEventListener("click", function (e) {
        (filterCategoriesSelected = []),
          Array.from(checkboxes)
            .filter((box) => box.checked)
            .forEach((box, i) => {
              box.checked = !1;
            }),
          boxes.querySelectorAll(".filter-hide").forEach((box) => {
            box.classList.remove("filter-hide");
          });
      });
  publicationFilterRefresh = () => {
    document.querySelector("#noResults").classList.add("filter-hide"),
      (filterCategoriesSelected = Array.from(publicationCatCheckboxes)
        .filter((box) => box.checked)
        .map((box) => box.value)),
      typeFilters.forEach((el, i) => {
        typeStatus[el.value] = el.checked;
      }),
      boxes.forEach((el) => {
        if (
          (el.classList.add("filter-hide"), filterCategoriesSelected.length < 1)
        ) {
          document
            .querySelectorAll('#filter [type="checkbox"]:checked')
            .forEach((checkbox) => {
              el.dataset.type.toLowerCase() === checkbox.value &&
                el.classList.remove("filter-hide");
            });
        } else
          for (const category of filterCategoriesSelected)
            if (el.dataset.publicationCategory.includes(category))
              for (const type in typeStatus)
                typeStatus[type] &&
                  el.dataset.type.toLowerCase() === type &&
                  el.classList.remove("filter-hide");
      }),
      ScrollTrigger.refresh(),
      document
        .querySelector(".publications-container")
        .scrollIntoView({ behavior: "smooth" }),
      0 ===
        document.querySelectorAll(
          ".publications-container .link-box:not(.filter-hide)"
        ).length &&
        document.querySelector("#noResults").classList.remove("filter-hide");
  };
}
if (
  document.querySelectorAll(".link-box[data-role-type]").length > 0 &&
  document.querySelector("#noResults")
) {
  document.querySelector("#noResults").classList.add("filter-hide");
  let roleBoxes = document.querySelectorAll(".link-box[data-role-type]"),
    roleFilters = document.querySelectorAll(
      "#filter.roles-filter .filter-category"
    ),
    roleStatus = { production: !0, technology: !0, studio: !0 };
  const params = window.location.search,
    param_type = new URLSearchParams(params).get("type");
  param_type &&
    (Object.keys(roleStatus).forEach((k) => {
      param_type !== k &&
        ((roleStatus[k] = !1),
        roleFilters.forEach((checkbox) => {
          checkbox.value == k && (checkbox.checked = !1);
        }),
        roleBoxes.forEach((box) => {
          box.dataset.roleType == k && box.classList.add("filter-hide");
        }),
        ScrollTrigger.refresh());
    }),
    (roleStatus[param_type] = !0),
    (document.querySelectorAll("#selected-categories").innerHTML = param_type));
  const rolefilterRefresh = () => {
    if (
      (document.querySelector("#noResults").classList.add("filter-hide"),
      roleFilters.forEach((el) => {
        roleStatus[el.value] = el.checked;
      }),
      roleBoxes.forEach((el) => {
        el.classList.add("filter-hide"),
          roleStatus[el.dataset.roleType] && el.classList.remove("filter-hide");
      }),
      ScrollTrigger.refresh(),
      document
        .getElementById("filter-contain")
        .scrollIntoView({ behavior: "smooth" }),
      0 ===
        document.querySelectorAll("#filter-contain .link-box:not(.filter-hide)")
          .length &&
        document.querySelector("#noResults").classList.remove("filter-hide"),
      roleStatus.production && roleStatus.technology && roleStatus.studio)
    )
      document.querySelector("#selected-categories").innerHTML = "All";
    else if (
      roleStatus.production ||
      roleStatus.technology ||
      roleStatus.studio
    ) {
      let text = [];
      for (const stat in roleStatus)
        roleStatus[stat] &&
          text.push(`${stat[0].toUpperCase()}${stat.substring(1)}`);
      document.querySelector("#selected-categories").innerHTML =
        text.join(", ");
    } else document.querySelector("#selected-categories").innerHTML = "None";
  };
  roleFilters.forEach((item) => {
    item.addEventListener("click", function () {
      rolefilterRefresh();
    });
  });
}
if (document.querySelectorAll("#filter").length > 0) {
  ScrollTrigger.matchMedia({
    "(min-width: 825px)": function () {
      ScrollTrigger.create({
        trigger: "#filter",
        start: "top top",
        end: "+=9999999999",
        pin: !0,
        anticipatePin: 1,
        toggleClass: { targets: "#mainnav", className: "filter-pinned" },
      });
    },
    "(max-width: 824px)": function () {
      ScrollTrigger.create({
        trigger: "#filter",
        start: "top 49px",
        end: "+=9999999999",
        pin: !0,
        anticipatePin: 1,
        toggleClass: { targets: "#mainnav", className: "filter-pinned" },
      });
    },
  }),
    ScrollTrigger.create({
      trigger: ".contains-filter",
      start: "bottom 100",
      end: "+=9999999999",
      toggleClass: "pinned",
    });
}
if (document.querySelectorAll(".pillar").length > 0) {
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".pillar",
        start: "top 80%",
        end: "bottom 10%",
        toggleActions: "restart none none reverse",
      },
      defaults: { ease: "power4.out" },
    })
    .fromTo(
      ".pillar",
      { yPercent: 10, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, stagger: 0.2 }
    )
    .fromTo(
      ".pillar .header-line",
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 1, stagger: 0.2 },
      "<0.2"
    )
    .fromTo(
      ".pillar p",
      { opacity: 0 },
      { opacity: 1, duration: 1, stagger: 0.2 },
      "<"
    );
}
if (document.querySelectorAll(".event-item").length > 0) {
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".event-item",
        start: "top 80%",
        end: "bottom 10%",
        toggleActions: "restart none none reverse",
      },
    })
    .fromTo(
      ".event-item",
      { autoAlpha: 0, yPercent: 15 },
      { autoAlpha: 1, yPercent: 0, duration: 0.4, stagger: 0.2 }
    );
}
if (document.querySelectorAll("div.stay-connected").length > 0) {
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".link-box-contain .stay-connected",
        start: "top 90%",
        end: "bottom 10%",
        toggleActions: "restart none none reverse",
      },
    })
    .fromTo(
      ".stay-connected h3",
      { autoAlpha: 0, xPercent: 25 },
      { autoAlpha: 1, xPercent: 0, duration: 1 },
      "<0.5"
    )
    .fromTo(
      ".stay-connected p",
      { autoAlpha: 0, xPercent: 10 },
      { autoAlpha: 1, duration: 1, xPercent: 0, stagger: 0.3 },
      "<0.4"
    )
    .fromTo(
      ".stay-connected .social-icons",
      { autoAlpha: 0, xPercent: 10 },
      { autoAlpha: 1, duration: 1, xPercent: 0, stagger: 0.3 },
      "<0.2"
    )
    .fromTo(
      ".stay-connected .header-line",
      { autoAlpha: 0, yPercent: 5 },
      { autoAlpha: 1, duration: 0.5, yPercent: 0 },
      "<"
    )
    .timeScale(1.5);
}
if (document.querySelectorAll(".questions").length > 0) {
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".questions",
        start: "top 80%",
        end: "bottom 10%",
        toggleActions: "restart none none none",
      },
      defaults: { ease: "power4.out" },
    })
    .fromTo(
      ".question",
      { opacity: 0, yPercent: 10 },
      { opacity: 1, duration: 0.7, yPercent: 0, stagger: 0.1 }
    );
}
if (
  (document.querySelectorAll(".copy").length > 0 &&
    gsap.utils.toArray(".copy").forEach((copy, i) => {
      (copy.p = copy.querySelector("p")),
        (copy.header = copy.querySelector("h2")),
        (copy.btn = copy.querySelector(".btn"));
      const tl = gsap
        .timeline({
          scrollTrigger: {
            trigger: copy,
            start: "top 80%",
            end: "bottom 10%",
            toggleActions: "restart none none reverse",
          },
          defaults: { ease: "power4.out" },
        })
        .fromTo(
          copy.header,
          { opacity: 0, yPercent: 25 },
          { opacity: 1, yPercent: 0, duration: 1 },
          "<"
        )
        .fromTo(
          copy.p,
          { opacity: 0, yPercent: 10 },
          { opacity: 1, duration: 1, yPercent: 0 },
          "<0.4"
        );
      copy.btn &&
        tl.fromTo(copy.btn, { opacity: 0 }, { opacity: 1, duration: 1 }, "<"),
        ScrollTrigger.create({
          trigger: copy,
          start: "top bottom",
          onLeaveBack: () => tl.pause(0),
        });
    }),
  document.querySelectorAll(".perks-contain").length > 0)
) {
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".perks-contain",
        start: "top 80%",
        end: "bottom 10%",
        toggleActions: "restart none none reverse",
      },
      defaults: { ease: "power4.out" },
    })
    .fromTo(
      ".perk",
      { yPercent: 10, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, stagger: 0.2 }
    )
    .fromTo(
      ".perk p",
      { opacity: 0 },
      { opacity: 1, duration: 0.5, stagger: 0.2 },
      "<0.2"
    );
}
let textFlip = gsap.utils.toArray(".text-flip");
if (textFlip.length > 0)
  for (var i = 0; i < textFlip.length; i++) {
    let row = textFlip[i];
    (row.overlay = row.querySelector(".animate-overlay")),
      (row.header = row.querySelector("h2")),
      (row.p = row.querySelector("p")),
      (row.btn = row.querySelector(".btn")),
      (row.line = row.querySelector(".header-line"));
    const tl = gsap
      .timeline({
        scrollTrigger: {
          trigger: row,
          start: "top 80%",
          end: "top 100%",
          toggleActions: "restart none none none",
        },
        defaults: { ease: "power4.out" },
      })
      .to(row.overlay, { scaleX: 0, duration: 2 }, ">");
    i % 2 == 0
      ? (tl.fromTo(
          row.header,
          { opacity: 0, xPercent: 25 },
          { opacity: 1, xPercent: 0, duration: 1 },
          "<0.5"
        ),
        tl.fromTo(
          row.p,
          { opacity: 0, xPercent: 10 },
          { opacity: 1, duration: 1, xPercent: 0 },
          "<0.4"
        ))
      : (tl.fromTo(
          row.header,
          { opacity: 0, xPercent: -25 },
          { opacity: 1, xPercent: 0, duration: 1 },
          "<0.5"
        ),
        tl.fromTo(
          row.p,
          { opacity: 0, xPercent: -10 },
          { opacity: 1, duration: 1, xPercent: 0 },
          "<0.4"
        )),
      row.btn &&
        tl.fromTo(row.btn, { opacity: 0 }, { opacity: 1, duration: 1 }, "<"),
      row.line &&
        tl.fromTo(
          row.line,
          { opacity: 0, yPercent: 5 },
          { opacity: 1, duration: 0.5, yPercent: 0 },
          "<"
        ),
      ScrollTrigger.create({
        trigger: row,
        start: "top bottom",
        onLeaveBack: () => tl.pause(0),
      });
  }
let linkboxFadeIn = gsap.utils.toArray(".link-box");
if (linkboxFadeIn.length > 0)
  for (i = 0; i < linkboxFadeIn.length; i++) {
    let box = linkboxFadeIn[i];
    gsap
      .timeline({
        scrollTrigger: {
          trigger: box,
          start: "top 90%",
          toggleActions: "restart none none reverse",
        },
      })
      .fromTo(box, { opacity: 0 }, { opacity: 1, duration: 0.7 });
  }
let sketchBGAnimations = gsap.utils.toArray(".sketch-bg-contain");
if (sketchBGAnimations.length > 0)
  for (let i = 0; i < sketchBGAnimations.length; i++) {
    let sketch = sketchBGAnimations[i];
    (sketch.bg = sketch.querySelector(".sketch-bg")),
      (sketch.image = sketch.bg.querySelector("img")),
      (sketch.p = sketch.querySelectorAll("p")),
      (sketch.header = sketch.querySelector("h2")),
      (sketch.btn = sketch.querySelector(
        ".btn:not(#toggleCategories):not(.btn-process-nav)"
      )),
      (sketch.social = sketch.querySelector(".social-icons-contain"));
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sketch,
        start: "top 80%",
        toggleActions: "restart none none none",
        id: "sketch",
      },
      defaults: { ease: "power4.out" },
    });
    sketch.image &&
      tl.fromTo(
        sketch.image,
        { scale: 1.4, opacity: 0 },
        { scale: 1, opacity: 1, duration: 4 },
        ">"
      ),
      tl
        .fromTo(
          sketch.header,
          { opacity: 0, yPercent: 25 },
          { opacity: 1, yPercent: 0, duration: 1 },
          "<0.5"
        )
        .fromTo(
          sketch.p,
          { opacity: 0, yPercent: 10 },
          { opacity: 1, duration: 1, yPercent: 0 },
          "<0.4"
        ),
      sketch.btn &&
        tl.fromTo(sketch.btn, { opacity: 0 }, { opacity: 1, duration: 1 }, "<"),
      sketch.social &&
        tl.fromTo(
          sketch.social,
          { opacity: 0, xPercent: 10 },
          { opacity: 1, duration: 1, xPercent: 0 },
          "<0.2"
        ),
      ScrollTrigger.create({
        trigger: sketch,
        start: "top bottom",
        onLeaveBack: () => tl.pause(0),
      });
  }
