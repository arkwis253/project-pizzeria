import { templates, select } from "../settings.js";

class Home{
    constructor(element){
        const thisHome = this;

        thisHome.render(element);
    }

    render(element){
        const thisHome = this;

        const generatedHTML = templates.homePage();
        thisHome.dom = {};
        thisHome.dom.wrapper = element;
        thisHome.dom.wrapper.innerHTML = generatedHTML;

        thisHome.dom.orderButton = thisHome.dom.wrapper.querySelector(select.home.orderButton);
        thisHome.dom.bookButton = thisHome.dom.wrapper.querySelector(select.home.bookButton);
    }
}

export default Home;