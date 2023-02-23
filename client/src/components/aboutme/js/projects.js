

const website = {
    headline: "This Website",
    description :"My personal website written in JavaScript and React",
    technology: "JavaScript, React, CSS"
}


const demoTool = {
    headline: "DemoTool",
    description :"A tool for creating test data in the project management software blueAnt",
    technology: "SOAP, REST, Quarkus",
}

const immoScraper = {
    headline: "ImmoScraper",
    description :"A crawler that searches immoscout for new flats and send an email, when a new item is found. Very helpful.",
    technology: "Java 11, JavaFV",

}

const cooking = {
    headline: "Sauerbraten",
    description :"Private project of a food filmer. I cooked my families recipe for german sour pot roast",
    technology: "Flotte Lotte, Cutting Knife, Cutting board, marinating",
}

const cooking2 = {
    headline: "Sauerbraten",
    description :"Private project of a food filmer. I cooked my families recipe for german sour pot roast",
    technology: "Flotte Lotte, Cutting Knife, Cutting board, marinating",
}


export const projects = {website, demoTool, immoScraper, cooking, cooking2}

export function renderProject(project) {

    let {headline} = project;
    let {description} = project;
    let {technology} = project;

    let container = document.createElement("div");
    container.classList.add("project-container");
    let h1 = document.createElement("h1");
    h1.innerText = headline;
    let desc = document.createElement("h2");
    desc.innerText = "Description";
    let tech = document.createElement("h2");
    tech.innerText = technology;
    let paragraph = document.createElement("div");
    paragraph.innerText = description;

    container.append(h1, desc, tech, paragraph);
    return container;
}