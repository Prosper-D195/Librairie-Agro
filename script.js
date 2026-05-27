// ==========================================================================
// 1. CLASSE BOOK (Modèle d'un livre unique)
// ==========================================================================
class Book {
    constructor(title, author, pages, category, read, coverUrl = null) {
        this.id = crypto.randomUUID(); // Identifiant unique
        this.title = title;
        this.author = author || "Auteur Inconnu";
        this.pages = pages || "N/C";
        this.category = category;
        this.read = read; // Booléen
        this.coverUrl = coverUrl;
    }

    // Méthode de classe pour inverser le statut de lecture (anciennement le prototype)
    toggleReadStatus() {
        this.read = !this.read;
    }
}

// ==========================================================================
// 2. CLASSE LIBRARY (Gestionnaire de la collection / "Vecteur")
// ==========================================================================
class Library {
    constructor() {
        // Notre tableau interne qui agit comme un std::vector
        this.books = []; 
    }

    // Équivalent d'une fonction d'insertion dans le vecteur
    addBook(title, author, pages, category, read, coverUrl = null) {
        const newBook = new Book(title, author, pages, category, read, coverUrl);
        this.books.push(newBook);
        return newBook;
    }

    // Retirer un livre du vecteur par son ID
    removeBook(id) {
        const index = this.books.findIndex(book => book.id === id);
        if (index !== -1) {
            this.books.splice(index, 1);
        }
    }

    // Trouver un livre spécifique dans le vecteur
    findBook(id) {
        return this.books.find(book => book.id === id);
    }

    // Charger les données de l'API Open Library directement dans notre collection
    async fetchAgroBooks() {
        const agribusinessQueries = [
            { query: "agriculture tropical fruit", category: "Production Végétale" },
            { query: "poultry farming livestock", category: "Production Animale" },
            { query: "food processing agro", category: "Agro-transformation" },
            { query: "agricultural economics management", category: "Gestion & Économie" },
            { query: "agricultural finance credit", category: "Financement" }
        ];

        try {
            for (const target of agribusinessQueries) {
                const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(target.query)}&limit=3`;
                const response = await fetch(url);
                if (!response.ok) throw new Error("Erreur réseau");
                
                const data = await response.json();
                
                data.docs.forEach(doc => {
                    const title = doc.title;
                    const author = doc.author_name ? doc.author_name[0] : "Auteur Anonyme";
                    const pages = doc.number_of_pages_median || Math.floor(Math.random() * 130 + 100);
                    const coverUrl = doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : null;
                    const read = Math.random() > 0.5;

                    // Ajout direct via la méthode de la bibliothèque
                    this.addBook(title, author, pages, target.category, read, coverUrl);
                });
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des livres:", error);
        }
    }
}

// ==========================================================================
// 3. LOGIQUE D'AFFICHAGE (L'Interface Utilisateur / UI)
// ==========================================================================
class LibraryUI {
    constructor(libraryInstance) {
        this.library = libraryInstance; // Liaison avec l'instance de la bibliothèque
        this.grid = document.getElementById('library-grid');
        this.modal = document.getElementById('book-modal');
        this.form = document.getElementById('add-book-form');
        
        // Boutons de contrôle de la modale
        this.openModalBtn = document.getElementById('open-modal-btn');
        this.closeModalBtn = document.getElementById('close-modal-btn');

        this.initEvents();
    }

    // Initialisation des écouteurs d'événements globaux
    initEvents() {
        this.openModalBtn.addEventListener('click', () => this.modal.showModal());
        this.closeModalBtn.addEventListener('click', () => this.modal.close());
        
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    // Affichage des cartes dans la grille HTML
    render() {
        this.grid.innerHTML = '';

        if (this.library.books.length === 0) {
            this.grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-light);">
                                        Chargement des livres agro-business ou bibliothèque vide...
                                   </div>`;
            return;
        }

        this.library.books.forEach(book => {
            const card = document.createElement('div');
            card.classList.add('book-card');
            card.setAttribute('data-id', book.id); // Association DOM -> Objet via l'ID unique

            const coverHTML = book.coverUrl 
                ? `<img src="${book.coverUrl}" alt="${book.title}" style="width:100%; height:180px; object-fit:contain; margin-bottom:1rem; border-radius:4px;">`
                : `<div style="width:100%; height:140px; background:#e0e0e0; display:flex; align-items:center; justify-content:center; margin-bottom:1rem; border-radius:4px; font-size:0.8rem; color:#666;">Pas d'image</div>`;

            card.innerHTML = `
                <div>
                    <div class="book-category">${book.category}</div>
                    ${coverHTML}
                    <h3 class="book-title" style="font-size:1.05rem;">${book.title}</h3>
                    <p class="book-author">Par ${book.author}</p>
                    <p class="book-pages">${book.pages} pages</p>
                </div>
                <div class="book-actions">
                    <button class="btn btn-status ${book.read ? 'read' : ''}">
                        ${book.read ? 'Déjà lu' : 'Non lu'}
                    </button>
                    <button class="btn btn-danger delete-btn">Supprimer</button>
                </div>
            `;

            this.grid.appendChild(card);
        });

        this.bindCardEvents();
    }

    // Gestion des clics sur les boutons de chaque carte (Supprimer / Modifier statut)
    bindCardEvents() {
        // Boutons de statut de lecture
        this.grid.querySelectorAll('.btn-status').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.closest('.book-card').getAttribute('data-id');
                const book = this.library.findBook(id);
                if (book) {
                    book.toggleReadStatus();
                    this.render(); // Rafraîchir la vue
                }
            });
        });

        // Boutons de suppression
        this.grid.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.closest('.book-card').getAttribute('data-id');
                this.library.removeBook(id);
                this.render(); // Rafraîchir la vue
            });
        });
    }

    // Gestion de la soumission du formulaire
    handleFormSubmit(e) {
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const pages = parseInt(document.getElementById('pages').value);
        const category = document.getElementById('category').value;
        const read = document.getElementById('read').checked;

        // Ajout dans notre instance de classe Library
        this.library.addBook(title, author, pages, category, read);

        this.form.reset();
        this.modal.close();
        this.render();
    }
}

// ==========================================================================
// 4. INITIALISATION DE L'APPLICATION
// ==========================================================================
// Création de l'instance principale de la bibliothèque (le modèle contenant le tableau/vecteur)
const myAgroLibrary = new Library();

// Création de l'interface utilisateur en lui passant notre bibliothèque en paramètre (la vue)
const appUI = new LibraryUI(myAgroLibrary);

// Lancement initial de l'affichage (indique que c'est vide/en cours de chargement)
appUI.render();

// Chargement asynchrone des données de l'API et mise à jour automatique de la vue
myAgroLibrary.fetchAgroBooks().then(() => {
    appUI.render();
});