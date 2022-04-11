const siteMain = document.querySelector('.main');
const siteList = document.querySelector('.main__list');
const siteBtns = Array.from(document.querySelectorAll('.nav__btn'));

const clearSiteList = () => {
    currentList = Array.from(document.querySelectorAll('li, img, br')); // nog invullen
    currentList.forEach(item => {
        siteList.removeChild(item);
    })
};

const addArrayToDom = (providedArray) => {
    providedArray.forEach((item) => {
        newLi = document.createElement('li');
        newLi.innerHTML = item;
        siteList.appendChild(newLi);
    })
};

const addObjectItemsToDom = (name, surname, photo, phone, creditcard, cardexpire) => {
    if (name) {
        newLi = document.createElement('li');
        newLi.innerHTML = `${name} ${surname}`;
        if (phone) {
            newLi.innerHTML = `${name} ${surname} - Phone: ${phone}`;
        }
        siteList.appendChild(newLi);
    };
    if (photo) {
        newImg = document.createElement('img');
        newImg.src = photo;
        siteList.appendChild(newImg);
    }
    if (creditcard) {
        newLi = document.createElement('li');
        newLi.innerHTML = `Card number: ${creditcard} - Expires on: ${cardexpire}`;
        siteList.appendChild(newLi);
        newBr = document.createElement('br');
        siteList.appendChild(newBr);
    }

};

const loadList = (itemId) => {
    switch (itemId) {
        case 'country':
            return loadCountries();
        case 'capricorn':
            return loadCapricornWomen();
        case 'creditcard':
            return loadCreditcardExpiring();
        case 'mostpeople':
            return loadMostPeople();

        default:
            console.log('Something went wrong in the switch!');
    };
};

const loadCountries = () => {
    countryArray = randomPersonData.map((item) => {
        return item.region;
    })
    filterdCountryArray = countryArray.sort().filter((item, i, ar) => {
        return !i || item != ar[i - 1];
    })
    clearSiteList();
    addArrayToDom(filterdCountryArray);
};

const loadCapricornWomen = () => { //dit werkt ook nog niet naar behoren
    capricornArray = [];
    randomPersonData.forEach(item => {
        let birthdayArray = item.birthday.dmy.split('/');
        if (item.gender === 'female' && item.age > 30 && ((birthdayArray[1] == 12 && birthdayArray[0] > 21) || birthdayArray[1] == 01 && birthdayArray[0] < 20 ))  {
            capricornArray.push(item);
        };
    });
    clearSiteList();
    capricornArray.map((item) => {
        addObjectItemsToDom(item.name, item.surname, item.photo);
    });
};

const loadCreditcardExpiring = () => {
    let currentDate = Date.parse(new Date());
    let endOfYear = Date.parse('2023/01/01');
    let creditcardArray = randomPersonData.filter((item) => {
        let expirationDateArray = item.credit_card.expiration.split('/');
        let expirationDate = new Date(`${expirationDateArray[0]}/01/${expirationDateArray[1]}`);
        expirationDate = Date.parse(expirationDate.toISOString());
        return expirationDate < endOfYear && expirationDate > currentDate
        }); 
    clearSiteList();
    creditcardArray.map((item) => {
        addObjectItemsToDom(item.name, item.surname, false, item.phone, item.credit_card.number, item.credit_card.expiration);
    })
};

const loadMostPeople = () => {
    let mostPeopleArray = [];
    randomPersonData.forEach((item) => {
        let itemCountry = item.region;
        let foundInArray = false;
        mostPeopleArray.forEach((element) => {
            if (element.region === itemCountry) {
                element.count ++;
                foundInArray = true;
            };
        });
        if (foundInArray === false) {
            let newCountryObject = {region: itemCountry, count: 1};
            mostPeopleArray.push(newCountryObject);
        };
    });
    mostPeopleArray.sort((a, b) => {
        return b.count - a.count;
    });
   clearSiteList();
   mostPeopleArray.map((item) => {
        addObjectItemsToDom(item.region, item.count);
    });
};



siteBtns.forEach((item) => {
    item.addEventListener('click', func => {
        loadList(item.id);
    });
});
