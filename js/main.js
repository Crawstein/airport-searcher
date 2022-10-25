let airports;
let airportsHTML = "";
let airportICAO;
let routes;
let routesHTML;
let parentAirportName;

function airportsHandler(list) {
    if (airports.items.length === 0) {
        Toastify({
            text: "Can't find any airport",
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            onClick: function () {},
        }).showToast();
        document.querySelector(".airports__list").innerHTML = "";
        document.querySelector(".airports").classList.add("hidden");
        return;
    }
    airportsHTML = "";
    list.forEach((value) => {
        airportsHTML =
            airportsHTML +
            `
    	<div class="airports__list__item" data-icao="${value.icao}">
                	<div class="airports__list__name">${value.name}</div>
                	<div class="airports__list__details">
                		<div class="airports__list__location"><span>Location</span><span class="iconify" data-icon="cif:${value.countryCode.toLowerCase()}"></span></div>
                		<div class="airports__list__icao"><span>ICAO</span>${value.icao}</div>
                	</div>
                </div>
    `;
    });

    // <div class="airports__list__icao"><span>ICAO</span>${value.icao}</div>


    document.querySelector(".airports__list").innerHTML = airportsHTML;
    document.querySelector(".airports").classList.remove("hidden");
    document.querySelectorAll(".airports__list__item").forEach((item) => {
        item.addEventListener("click", function () {
            parentAirportName = this.querySelector(".airports__list__name").innerText;
            airportICAO = this.dataset.icao;
            cardHandler();
        });
    });
}

document.querySelector(".header__button").addEventListener("click", function () {
    searchHandler();
});

document.querySelector(".header__input").addEventListener("keydown", (event) => {
    if (event.isComposing || event.keyCode === 229) {
        return;
    } else if (event.keyCode === 13) {
        searchHandler();
    }
});

document.querySelector(".overlay__close").addEventListener("click", function () {
    document.querySelector(".overlay").classList.add("hidden");
    document.querySelector(".routes__scroll-wrap").innerHTML = "";
    document.querySelector("body").classList.remove("locked");
});

function searchHandler() {
    if (document.querySelector(".header__input").value.length < 3) {
        Toastify({
            text: "Atleast 3 symbols is required",
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, rgb(197 36 36), rgb(231 54 54))",
                boxShadow: "0 3px 6px -1px rgb(0 0 0 / 12%), 0 10px 36px -4px rgb(232 77 77 / 30%)",
            },
            onClick: function () {},
        }).showToast();
        document.querySelector(".airports__list").innerHTML = "";
        document.querySelector(".airports").classList.add("hidden");
        return;
    }
    const options = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": "f3d04ecb92mshf92f6d23953e701p109861jsn684ad13b9ff8",
            "X-RapidAPI-Host": "aerodatabox.p.rapidapi.com",
        },
    };

    fetch(`https://aerodatabox.p.rapidapi.com/airports/search/term?q=${document.querySelector(".header__input").value}&limit=12`, options)
        .then((response) => response.json())
        .then((response) => {
            airports = response;
            airportsHandler(airports.items);
        })
        .catch((err) => console.error(err));
}

function cardHandler() {
    const options = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": "f3d04ecb92mshf92f6d23953e701p109861jsn684ad13b9ff8",
            "X-RapidAPI-Host": "aerodatabox.p.rapidapi.com",
        },
    };

    fetch(`https://aerodatabox.p.rapidapi.com/airports/icao/${airportICAO}/stats/routes/daily`, options)
        .then((response) => response.json())
        .then((response) => {
            routes = response;
            routesHandler(routes.routes);
        })
        .catch((err) => console.error(err));
}

function routesHandler(list) {
    routesHTML = "";
    list.forEach((value, index) => {
        routesHTML = routesHTML + `<div class="routes__item" data-route-id="${index + 1}."><span>route to</span> ${value.destination.name}</div>`;
    });
    document.querySelector(".routes__scroll-wrap").innerHTML = routesHTML;
    document.querySelector(".routes__subtitle").innerText = parentAirportName;
    if (list.length === 0) {
        Toastify({
            text: "There is no active routes/flights for this airport right now",
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            onClick: function () {},
        }).showToast();
        return;
    }
    document.querySelector("body").classList.add("locked");
    document.querySelector(".overlay").classList.remove("hidden");
}
