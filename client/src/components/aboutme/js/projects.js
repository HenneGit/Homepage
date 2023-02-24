

const website = {
    headline: "This Website",
    description :"My personal website. You are looking at it. Used to teach myself new skills and put ideas to the test. Will be developed further in the future.",
    technology: "JavaScript, React, CSS",
    link: "https://github.com/HenneGit/Homepage",
    git: true

}


const demoTool = {
    headline: "DemoTool",
    description :"A webapp for creating test data over webservices in the project management software blueAnt. It is used to create demo access for possible customers. Featured a Java Backend and JavaScript Frontend to manage " +
        "data.",
    technology: "SOAP, REST, Quarkus",
    link: null,
    git: false
}

const immoScraper = {
    headline: "ImmoScraper",
    description :"A desktop app which crawls ImmoScout for new flats and sends an email, when a new item is found. Very helpful for flat hunting.",
    technology: "Java 11, JavaFX",
    link: "https://github.com/HenneGit/ImmoScraper",
    git: true

}

const chess = {
    headline: "Chess",
    description :"A chess game I made to teach myself JavaScript. My goal was to calculate the whole move logic to highlight legal moves by the code. Uses open source chess engine Stockfish" +
        " to make playing against the computer possible.",
    technology: "JavaScript, CSS, StockFish",
    link: "https://github.com/HenneGit/Homepage/tree/main/client/src/components/chess",
    git: true
}


export const projects = {website, demoTool, immoScraper, chess}

export function renderProject(project) {

    let {headline} = project;
    let {description} = project;
    let {technology} = project;
    let {link} = project;
    let {git} = project;

    let gitClone = null;
    if (git) {
        gitClone = document.getElementById("git-icon").cloneNode(true);
        gitClone.setAttribute("href", link);
    }
    let container = document.createElement("div");
    container.classList.add("project-container");
    let h2 = document.createElement("h2");
    h2.innerText = headline;
    let desc = document.createElement("h3");
    desc.innerText = "Technology:";
    let tech = document.createElement("div");
    tech.innerText = technology;
    let paragraph = document.createElement("p");
    paragraph.innerText = description;

    container.append(h2, paragraph, desc, tech);
    if (gitClone !== null) {
        container.appendChild(gitClone);
    }
    return container;
}