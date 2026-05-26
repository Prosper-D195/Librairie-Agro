// 1. Stockage de données (Le Modèle)
const myLibrary = [];

// 2. Constructeur d'objet Book
function Book(title, author, pages, category, read) {
    this.id = crypto.randomUUID(); // Génération de l'ID unique
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.category = category;
    this.read = read; // Booléen : true ou false
}

// 3. Prototype pour inverser le statut de lecture
Book.prototype.toggleReadStatus = function() {
    this.read = !this.read;
};

// 4. Fonction distincte pour ajouter un livre au tableau
function addBookToLibrary(title, author, pages, category, read) {
    const newBook = new Book(title, author, pages, category, read);
    myLibrary.push(newBook);
    return newBook;
}

// 5. Ajout manuel des 26 livres demandés sur l'Agro-business
function loadSampleBooks() {
    // --- PRODUCTION VÉGÉTALE ---
    // Raisin (2)
    addBookToLibrary("La culture du Raisin de table en Afrique de l'Ouest", "Dr. Amadou Diallo", 145, "Production Végétale", true);
    addBookToLibrary("Viticulture tropicale : Réussir la vigne en Afrique", "Marc Bonnin", 210, "Production Végétale", false);
    // Pomme (2)
    addBookToLibrary("Le Pommier en zone tropicale d'altitude", "Prof. Jean-Pierre Ndoye", 180, "Production Végétale", true);
    addBookToLibrary("Guide pratique de la culture de la pomme fruit en Afrique", "Fatou Sylla", 95, "Production Végétale", false);
    // Papaye (2)
    addBookToLibrary("Optimiser le rendement de la Papaye Calina IPB9", "Ing. Prosper", 120, "Production Végétale", true);
    addBookToLibrary("Maladies et ravageurs du papayer en Afrique subsaharienne", "Koffi Mensah", 160, "Production Végétale", false);

    // --- PRODUCTION ANIMALE ---
    // Poulets de chair (2)
    addBookToLibrary("Élevage de poulets de chair : Guide complet du producteur africain", "Dr. Moussa Traoré", 250, "Production Animale", true);
    addBookToLibrary("Rentabiliser son poulailler de chair en 45 jours", "Alioune Diop", 110, "Production Animale", false);
    // Lapins (2)
    addBookToLibrary("Cuniculture africaine : Élever des lapins pour le profit", "Pauline Biya", 135, "Production Animale", false);
    addBookToLibrary("Guide moderne de l'élevage de lapin en climat chaud", "Samuel Eto'o", 175, "Production Animale", true);
    // Cailles (2)
    addBookToLibrary("La Coturniculture : Élevage des cailles et opportunités", "Dr. Ibrahim Issa", 90, "Production Animale", false);
    addBookToLibrary("Les secrets des œufs de caille : Production et bienfaits", "Aminata Touré", 105, "Production Animale", true);

    // --- AGRO-TRANSFORMATION (6)
    addBookToLibrary("Transformation locale des fruits tropicaux en jus et confitures", "Sokhna Diarra", 220, "Agro-transformation", true);
    addBookToLibrary("Séchage solaire des produits agricoles en Afrique", "Ing. Pierre Gomis", 140, "Agro-transformation", false);
    addBookToLibrary("Valorisation du manioc : De la racine au gari", "Chantal Bouanga", 190, "Agro-transformation", true);
    addBookToLibrary("Conservation et emballage des produits agroalimentaires", "Kofi Annan", 310, "Agro-transformation", false);
    addBookToLibrary("Transformation semi-industrielle de la tomate", "Youssef Benjelloun", 125, "Agro-transformation", false);
    addBookToLibrary("Guide de production d'huile d'arachide et de tournesol", "Mamadou Sow", 165, "Agro-transformation", true);

    // --- GESTION & ÉCONOMIE AGRICOLE (6)
    addBookToLibrary("Gestion financière de la ferme africaine", "Ousmane Kane", 280, "Gestion & Économie", true);
    addBookToLibrary("Calcul des coûts de production en agriculture", "Marie-Louise Cole", 150, "Gestion & Économie", false);
    addBookToLibrary("Entrepreneuriat Agricole : Créer des actifs durables", "Jean-Marc Yao", 205, "Gestion & Économie", true);
    addBookToLibrary("Marketing des produits agricoles et circuits courts", "Awa Thiam", 185, "Gestion & Économie", false);
    addBookToLibrary("Planification stratégique d'une exploitation agro-pastorale", "Dr. David Luke", 240, "Gestion & Économie", true);
    addBookToLibrary("Logistique et chaîne de valeur agricole en Afrique", "Modibo Keita", 300, "Gestion & Économie", false);

    // --- FINANCEMENT (6)
    addBookToLibrary("Le guide des financements agricoles en Afrique", "Abdoulaye Bio Tchané", 260, "Financement", true);
    addBookToLibrary("Lever des fonds pour son projet agro-pastoral", "Rebecca Enonchong", 145, "Financement", false);
    addBookToLibrary("Microfinance et crédit agricole : Mode d'emploi", "Tidjane Thiam", 215, "Financement", true);
    addBookToLibrary("Subventions et appuis internationaux à l'agriculture", "Elena Diallo", 195, "Financement", false);
    addBookToLibrary("Le Crowdfunding au service de l'agro-business africain", "Idriss Seydou", 130, "Financement", false);
    addBookToLibrary("Mécanismes d'assurance récolte et gestion des risques", "Cheikh Anta Diop", 270, "Financement", true);
}

// 6. Logique d'affichage (La Vue)
const libraryGrid = document.getElementById('library-grid');

function displayLibrary() {
    // On vide l'affichage existant pour éviter les doublons
    libraryGrid.innerHTML = '';

    myLibrary.forEach(book => {
        // Création de la fiche
        const card = document.createElement('div');
        card.classList.add('book-card');
        // Association du DOM à l'objet via l'attribut de données data-id
        card.setAttribute('data-id', book.id);

        card.innerHTML = `
            <div>
                <div class="book-category">${book.category}</div>
                <h3 class="book-title">${book.title}</h3>
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

        libraryGrid.appendChild(card);
    });

    // Liaison des événements sur les nouveaux boutons injectés
    setupCardEvents();
}

// 7. Gestion des événements sur les fiches (Suppression et Changement de statut)
function setupCardEvents() {
    // Gestion du bouton de changement de statut de lecture
    const statusButtons = document.querySelectorAll('.btn-status');
    statusButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.book-card');
            const bookId = card.getAttribute('data-id');
            
            // Recherche de l'objet correspondant dans le modèle
            const book = myLibrary.find(b => b.id === bookId);
            if (book) {
                book.toggleReadStatus(); // Utilisation de la fonction prototype
                displayLibrary();        // Rafraîchissement de la vue
            }
        });
    });

    // Gestion du bouton Supprimer
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.book-card');
            const bookId = card.getAttribute('data-id');
            
            // Trouver l'index de l'objet dans le tableau et le retirer
            const bookIndex = myLibrary.findIndex(b => b.id === bookId);
            if (bookIndex !== -1) {
                myLibrary.splice(bookIndex, 1);
                displayLibrary(); // Rafraîchissement de la vue
            }
        });
    });
}

// 8. Gestion de la Modale et du Formulaire
const modal = document.getElementById('book-modal');
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const addBookForm = document.getElementById('add-book-form');

openModalBtn.addEventListener('click', () => modal.showModal());
closeModalBtn.addEventListener('click', () => modal.close());

addBookForm.addEventListener('submit', (e) => {
    // Récupération des valeurs du formulaire
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = parseInt(document.getElementById('pages').value);
    const category = document.getElementById('category').value;
    const read = document.getElementById('read').checked;

    // Ajout au modèle
    addBookToLibrary(title, author, pages, category, read);

    // Réinitialisation du formulaire et fermeture de la modale
    addBookForm.reset();
    modal.close();

    // Mise à jour de la vue
    displayLibrary();
});

// --- INITIALISATION ---
loadSampleBooks();
displayLibrary();