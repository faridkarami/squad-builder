const NAME = 'STORAGE';

class Storage {
    static save (player) {
        let list = this.load();
        list.push(player);
        localStorage.setItem(NAME, JSON.stringify(list));
    }

    static load () {
        let result = [];
        if (isExists()) {
            result = JSON.parse(localStorage.getItem(NAME));
        }
        return result;
    }

    static remove (index) {
        const list = this.load();
        list.splice(index, 1);
        localStorage.setItem(NAME, JSON.stringify(list));
    }

    static saveAll (list) {
        localStorage.setItem(NAME, JSON.stringify(list));
    }
}

const isExists = () => {
    const result = (localStorage.getItem(NAME) !== null) ? true : false;
    return result;
}