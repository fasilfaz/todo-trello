let root = document.getElementById("root");
let popup = document.getElementById("popup");
let closePopup = document.getElementById("closePopup");
let descriptionInput = document.getElementById("descriptionInput");
let commentsInput = document.getElementById("commentsInput");
let savePopupButton = document.getElementById("savePopupButton");

class List {
    constructor(place, title = "To-Do") {
        this.place = place;
        this.title = title;
        this.cardArray = [];
        this.render();
    }

    addToDo() {
        let text = this.input.value;
        if (text.trim() !== "") {
            this.cardArray.push(new Card(text, this.div, this));
            this.input.value = "";
        }
    }

    render() {
        this.createListElement();
        this.place.append(this.listElement);
    }

    createListElement() {
        this.listElement = document.createElement('div');
        this.listElement.classList.add("todoList");

        this.h2 = document.createElement('h2');
        this.h2.innerText = this.title;

        this.input = document.createElement('input');
        this.input.classList.add("comment");

        this.button = document.createElement('button');
        this.button.innerText = 'Add';
        this.button.classList.add("btn-save");
        this.button.addEventListener('click', this.addToDo.bind(this));

        this.div = document.createElement('div');

        this.listElement.append(this.h2, this.input, this.button, this.div);

        // Allow drop actions on the list
        this.listElement.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
    }

    handleDrop(e) {
        e.preventDefault();

        const cardId = e.dataTransfer.getData('text');
        const cardElement = document.getElementById(cardId);

        const oldList = cardElement.card.list;
        oldList.cardArray = oldList.cardArray.filter(card => card !== cardElement.card);

        this.cardArray.push(cardElement.card);
        this.div.append(cardElement);
        cardElement.card.list = this;
    }
}

class ToDo extends List {
    constructor(place, title) {
        super(place, title);
        this.listElement.addEventListener('drop', this.handleDrop.bind(this));
    }
}

class Doing extends List {
    constructor(place, title) {
        super(place, title);
        this.listElement.addEventListener('drop', this.handleDrop.bind(this));
    }
}

class Done extends List {
    constructor(place, title) {
        super(place, title);
        this.listElement.addEventListener('drop', this.handleDrop.bind(this));
    }
}

class Card {
    constructor(text, place, list) {
        this.text = text;
        this.place = place;
        this.list = list;
        this.description = "";
        this.comments = [];
        this.render();
    }

    render() {
        this.card = document.createElement('div');
        this.card.classList.add("card");
        this.card.setAttribute('draggable', true);
        this.card.id = "card-" + Math.random().toString(36).substr(2, 9);
        this.card.card = this;

        this.p = document.createElement('p');
        this.p.innerText = this.text;

        this.deleteButton = document.createElement('button');
        this.deleteButton.innerText = "X";
        this.deleteButton.addEventListener('click', () => {
            this.deleteCard();
        });

        this.card.append(this.p, this.deleteButton);
        this.place.append(this.card);

        this.card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text', this.card.id);
        });

        this.card.addEventListener('click', this.showMenu.bind(this));
    }

    deleteCard() {
        this.card.remove();
        let index = this.list.cardArray.indexOf(this);
        if (index !== -1) {
            this.list.cardArray.splice(index, 1);
        }
    }

    showMenu() {
        descriptionInput.value = this.description;
        commentsInput.value = this.comments.join("\n");

        popup.style.display = "flex";

        savePopupButton.onclick = () => {
            this.description = descriptionInput.value;
            this.comments = commentsInput.value.split("\n").filter(comment => comment.trim() !== "");
            popup.style.display = "none";
        };
    }
}

closePopup.onclick = () => {
    popup.style.display = "none";
};

//-------------main------------

let addTodoListInput = document.getElementById("addTodoListInput");
let addTodoListButton = document.getElementById("addTodoListButton");

addTodoListButton.addEventListener('click', () => {
    if (addTodoListInput.value.trim() !== "") {
        new ToDo(root, addTodoListInput.value);
        addTodoListInput.value = "";
    }
});

let todoList1 = new ToDo(root);
let todoList2 = new Doing(root, "Doing");
let todoList3 = new Done(root, "Done");
