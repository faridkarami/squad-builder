// object sample
let player = {
    firstName: '',
    lastName: '',
    number: 0,
    club: '',
    color: '#FFFFFF'
}

function onAdd() {
    const elementFirstName = document.querySelector('#firstName');
    const elementLastName = document.querySelector('#lastName');
    const elementNumber = document.querySelector('#number');

    if (elementFirstName.value !== '' &&
        elementLastName.value !== '' &&
        (elementNumber.value !== '' && !isNaN(elementNumber.value))) {

        const rndClub = Math.floor(Math.random() * 12);
        const rndColor = Math.floor(Math.random() * 19);

        const newPlayer = Object.create(player);
        newPlayer.firstName = elementFirstName.value;
        newPlayer.lastName = elementLastName.value;
        newPlayer.number = parseInt(elementNumber.value);
        newPlayer.club = dataClubs[rndClub].title;
        newPlayer.color = dataColors[rndColor];

        Storage.save(newPlayer);

        const currentIndex = Storage.load().length - 1;
        printDisplayList(currentIndex);

        reset();
    } else {
        alert('Error!\n' + 'please input correct values...');
    }
}

function reset() {
    const elementFirstName = document.querySelector('#firstName');
    const elementLastName = document.querySelector('#lastName');
    const elementNumber = document.querySelector('#number');

    elementFirstName.value = '';
    elementLastName.value = '';
    elementNumber.value = '';

    elementFirstName.focus();
}

function onRemove(index) {
    const status = confirm('Are you sure?');
    if (status) {
        Storage.remove(index);
        printDisplayList();
    }
}

function onSearch() {
    let find = [];
    const value = prompt('Search', '0');
    const valueNumber = parseInt(value);
    const list = Storage.load();
    const len = list.length;

    for (let i = 0; i < len; i++) {
        if (list[i].number == valueNumber) {
            find.push(i);
        }
    }
    const body = document.getElementsByTagName('body')[0];

    // Find and remove all style of buttons
    const buttonList = document.querySelectorAll('#displayList .item');
    for(let i = 0; i < buttonList.length; i++) {
        // buttonList[i].removeAttribute('style');
        buttonList[i].classList.remove('active');
    }

    if (find.length > 0) { // Green
        body.classList.remove('search-notfound');
        body.classList.add('search-found');
        for(let i = 0; i < find.length; i++) {
            buttonList[find[i]].classList.add('active');
        }
        // buttonList[find].style.backgroundColor = 'red';
        // buttonList[find].style.color = 'white';
    } else { // Red
        body.classList.remove('search-found');
        body.classList.add('search-notfound');
    }
}

function onSort() {
    const numberListSorted = Storage.load();
    const len = numberListSorted.length;

    for (let i = 0; i < len; i++) {
        for (let j = 0; j < (len - 1) - i; j++) {
            if (numberListSorted[j].number > numberListSorted[j + 1].number) {
                // Swap
                let temp = numberListSorted[j];
                numberListSorted[j] = numberListSorted[j + 1];
                numberListSorted[j + 1] = temp;
            }
        }
    }

    Storage.saveAll(numberListSorted);

    printDisplayList();
}

function printDisplayList(index) {
    const tagList = document.getElementById('displayList');
    const list = Storage.load();
    if (index !== undefined) { // Add
        tagList.appendChild(generateButton(index));
    } else {
        tagList.innerHTML = '';
        for (let i = 0; i < list.length; i++) {
            tagList.appendChild(generateButton(i));
        }
    }
}

function main() {
    document.querySelector('#addButton').addEventListener('click', function () {
        onAdd();
    })
    document.querySelector('#searchButton').addEventListener('click', function () {
        onSearch();
    })
    document.querySelector('#sortButton').addEventListener('click', function () {
        onSort();
    })


    let keysPressed = {};
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { onAdd(); }

        // ctrl + q
        keysPressed[e.key] = true;
        if (keysPressed['Control'] && e.key === 'q') {
            onSort();
        }

        // ctrl + r
        keysPressed[e.key] = true;
        if (keysPressed['Control'] && e.key === 'r') {
            onSearch();
        }
    })

    document.addEventListener('keyup', function (e) {
        delete keysPressed[e.key];
    })

    printDisplayList();
}

function generateButton (index) {
    const list = Storage.load();
    const fullName = list[index].firstName.substr(0, 1) + '.' + list[index].lastName;

    // Create Button
    const button = document.createElement('button');
    button.setAttribute('class', `item`);
    button.setAttribute('style', `background-color: ${list[index].color}`);
    button.setAttribute('onclick', `onRemove(${index})`);

    // Create Span item-name
    const span1 = document.createElement('span');
    span1.setAttribute('class', 'item-name');
    span1.innerText = fullName.substr(0, 15);

    // Create Span item-number
    const span2 = document.createElement('span');
    span2.setAttribute('class', 'item-number');
    span2.innerText = list[index].number;

    // Append spans to button
    button.appendChild(span1);
    button.appendChild(span2);

    const src = dataClubs.find(x => x.title === list[index].club).sourceImage;

    button.pseudoStyle('before', 'background-image', `url(${src})`);
    button.pseudoStyle('before', 'box-shadow', `${list[index].color} 0 0 10px 0`);

    return button;
}

window.onload = function () {
    main();
}

// libs
let UID = {
    _current: 0,
    getNew: function(){
        this._current++;
        return this._current;
    }
};

HTMLElement.prototype.pseudoStyle = function(element, prop, value){
    let _this = this;
    let _sheetId = "pseudoStyles";
    let _head = document.head || document.getElementsByTagName('head')[0];
    let _sheet = document.getElementById(_sheetId) || document.createElement('style');
    _sheet.id = _sheetId;
    let className = "pseudoStyle" + UID.getNew();

    _this.className +=  " "+className;

    _sheet.innerHTML += " ."+className+":"+element+"{"+prop+":"+value+"}";
    _head.appendChild(_sheet);
    return this;
};


