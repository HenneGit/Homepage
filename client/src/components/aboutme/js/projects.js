

const website = {
    headline: "This Website",
    description :"My personal website. After my backend job ended I wanted to explore frontend development more and created this website to teach myself react and showcase my skills." +
        " As my skills will grow over time, so will this website. ",
    technology: "JavaScript, React, CSS",
    link: "https://github.com/HenneGit/Homepage",
    git: true

}


const demoTool = {
    headline: "DemoTool",
    description :"A stateless webapp build with quarkus for creating data over SOAP and REST webservices in the project management software BlueAnt. The tool creates some projects, resources, todos " +
        "to showcase the software for a possible customer. Features a Java Backend for communicating with BlueAnt and JavaScript Frontend to manage the data, which is stored in property files. " +
        "Runs in a docker environment.",
    technology: "SOAP, REST, Quarkus, Java, JavaScript, CSS, Docker",
    link: null,
    git: false
}

const immoScraper = {
    headline: "ImmoScraper",
    description :"A desktop app which crawls ImmoScout every 20 seconds in a headless browser for new flats and sends an email, when a new flat is found. Uses a JavaFX frontend to create a search query for flat. The " +
        "queries are saved in a CSV file. Super helpful for flat hunting.",
    technology: "Java 11, JavaFX, HtmlUnit",
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

/**
 * renders a slide in the project slider according to given project.
 * @param project the project content to render.
 * @returns {HTMLDivElement} the created dom element.
 */
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
    let technologyDiv = document.createElement("div");
    let tech = document.createElement("h3");
    tech.innerText = "Technology:";
    let techP = document.createElement("p");
    techP.innerText = technology;
    technologyDiv.append(tech, techP)
    let paragraph = document.createElement("p");
    paragraph.innerText = description;

    container.append(h2, paragraph, technologyDiv);
    if (gitClone !== null) {
        container.appendChild(gitClone);
    }
    return container;
}