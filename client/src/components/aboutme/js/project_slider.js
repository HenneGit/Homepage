import {projects, renderProject} from "./projects";


let slideCounter = 0;
let numberOfSlides = 0;

/**
 * set visibility to slides.
 */
function initSlides() {
    let currentSlide = document.getElementById("slide-" + slideCounter);
    document.querySelectorAll(".slide").forEach(el => {
        el.classList.add("slide");
        if (el !== currentSlide) {
            el.classList.add("not-there");
        } else {
            el.classList.add("there");
        }
    });
}

/**
 * setup a slide and a dot for each project in the projects object.
 */
export function initProjects() {
    let slideShowContainer = document.getElementById("slideshow-container");
    let slideContainer = document.getElementById("slide-container");
    if (slideShowContainer === undefined || slideShowContainer === null || slideContainer.children.length >= Object.keys(projects).length) {
        return;
    }
    let projectCounter = 0;
    for (let project in projects) {
        let dot = document.createElement("div");
        dot.id = "dot-" + projectCounter;
        dot.classList.add("dot");
        document.getElementById("dot-container").appendChild(dot);
        let slide = document.createElement("div");
        let projectContainer = renderProject(projects[project]);
        slide.id = "slide-" + projectCounter;
        slide.classList.add("slide");
        slide.appendChild(projectContainer);
        slideContainer.appendChild(slide);
        projectCounter++;
    }
    numberOfSlides = projectCounter - 1;
    initSlides();
    setUpDotAndArrowEvent();
}


/**
 * set classes and events to dots and arrows.
 */
function setUpDotAndArrowEvent() {
    document.getElementById("dot-0").classList.add("dot-active");
    document.getElementById("slider-arrow-right").addEventListener('click', () => {
        if (slideCounter === numberOfSlides) {
            slideCounter = 0;
        } else {
            slideCounter++;
        }
        let lastSlide = slideCounter === 0 ? numberOfSlides : slideCounter - 1;
        setDotActive();
        slide(lastSlide, "slide-right")
    });

    document.getElementById("slider-arrow-left").addEventListener('click', () => {
        if (slideCounter === 0) {
            slideCounter = numberOfSlides;
        } else {
            slideCounter--;
        }
        let lastSlide = slideCounter === numberOfSlides ? 0 : slideCounter + 1;
        setDotActive(lastSlide);
        slide(lastSlide, "slide-left");
    });
    document.querySelectorAll(".dot").forEach(el => {
        el.addEventListener("click", () => {
            let id = el.id;
            let currentSlide = slideCounter;
            slideCounter = parseInt(id.substring(4, 5));
            if (currentSlide < slideCounter) {
                slide(currentSlide, "slide-right");
            } else {
                slide(currentSlide, "slide-left");
            }
            setDotActive(currentSlide);
        });
    })
}

/**
 * slide to the next project.
 * @param lastSlideNr the slide that is slided away.
 * @param slideDirection left or right.
 */
function slide(lastSlideNr, slideDirection) {
    let activeSlide = document.getElementById("slide-" + slideCounter);
    let lastSlide = document.getElementById("slide-" + lastSlideNr);
    document.querySelectorAll(".slide").forEach(el => {
        el.classList.remove(...el.classList);
        el.classList.add("slide");
        if (el !== activeSlide && el !== lastSlide) {
            el.classList.add("not-there");
        } else {
            el.classList.add("there");
        }
    });

    if (slideDirection.includes("right")) {
        activeSlide.classList.add("start-right");
    } else {
        activeSlide.classList.add("start-left");
    }

    setTimeout(() => {
        activeSlide.classList.add(slideDirection);
        lastSlide.classList.add(slideDirection);
    }, 100);
    setTimeout(() => {
        lastSlide.classList.add("opacity-transition");
    }, 600);
}

/**
 * set the dot active which belongs to the current project slide.
 * @param lastDot the last dot that was active.
 */
function setDotActive(lastDot) {
    document.querySelectorAll(".dot").forEach(el => {
        el.classList.remove("dot-active");
    })
    let activeDot = document.getElementById("dot-" + slideCounter);
    activeDot.classList.add("dot-active");
}
