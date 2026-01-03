// ========================================
// Menu Hamburger Responsive
// ========================================
function toggleMenu() {
    const nav = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (nav && menuToggle) {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
    }
}

// Fermer le menu quand on clique sur un lien
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            const nav = document.querySelector('.nav-links');
            const menuToggle = document.querySelector('.menu-toggle');
            if (nav && menuToggle) {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    });
});

// ========================================
// Mode Jour/Nuit (Dark Mode)
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const darkToggle = document.getElementById('darkToggle');
    
    // Vérifier si un mode a été sauvegardé dans localStorage
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark');
        if (darkToggle) darkToggle.checked = true;
    }
    
    // Toggle le mode sombre
    if (darkToggle) {
        darkToggle.addEventListener('change', () => {
            if (darkToggle.checked) {
                document.body.classList.add('dark');
                localStorage.setItem('darkMode', 'enabled');
            } else {
                document.body.classList.remove('dark');
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }
});

// ========================================
// CONVERTISSEUR DE DEVISES
// ========================================
const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const resultDisplay = document.getElementById("result");
const loading = document.getElementById("loading");

// Drapeaux
const fromFlag = document.getElementById("fromFlag");
const toFlag = document.getElementById("toFlag");

let rates = {};

// Mapping des devises vers les codes pays pour les drapeaux
const currencyToCountry = {
    'USD': 'us', 'EUR': 'eu', 'GBP': 'gb', 'JPY': 'jp', 'CNY': 'cn',
    'AUD': 'au', 'CAD': 'ca', 'CHF': 'ch', 'INR': 'in', 'MXN': 'mx',
    'BRL': 'br', 'ZAR': 'za', 'RUB': 'ru', 'KRW': 'kr', 'SGD': 'sg',
    'HKD': 'hk', 'NOK': 'no', 'SEK': 'se', 'DKK': 'dk', 'NZD': 'nz',
    'TRY': 'tr', 'PLN': 'pl', 'THB': 'th', 'IDR': 'id', 'MYR': 'my',
    'PHP': 'ph', 'CZK': 'cz', 'ILS': 'il', 'CLP': 'cl', 'AED': 'ae',
    'SAR': 'sa', 'ARS': 'ar', 'EGP': 'eg', 'PKR': 'pk', 'VND': 'vn',
    'MAD': 'ma', 'DZD': 'dz', 'TND': 'tn', 'NGN': 'ng', 'KES': 'ke',
    'HUF': 'hu', 'RON': 'ro', 'ISK': 'is', 'HRK': 'hr', 'BGN': 'bg',
    'UAH': 'ua', 'KWD': 'kw', 'QAR': 'qa', 'OMR': 'om', 'JOD': 'jo',
    'LBP': 'lb', 'BHD': 'bh', 'BDT': 'bd', 'LKR': 'lk', 'MMK': 'mm',
    'NPR': 'np', 'AFN': 'af', 'IQD': 'iq', 'IRR': 'ir', 'KZT': 'kz',
    'UZS': 'uz', 'GEL': 'ge', 'AMD': 'am', 'AZN': 'az', 'BYN': 'by'
};

// Fonction pour mettre à jour le drapeau
function updateFlag(flagElement, currency) {
    if (!flagElement) return;
    
    const countryCode = currencyToCountry[currency] || 'un'; // 'un' pour les drapeaux inconnus
    flagElement.src = `https://flagcdn.com/32x24/${countryCode}.png`;
    flagElement.style.display = "block";
    
    // Animation du drapeau
    flagElement.classList.add('flash');
    setTimeout(() => {
        flagElement.classList.remove('flash');
    }, 300);
}

// ========================================
// Chargement des taux et remplissage des listes
// ========================================
function loadCurrenciesAndRates() {
    if (!loading) return; // Si on n'est pas sur la page convertisseur
    
    loading.classList.remove("hidden");
    
    fetch("https://api.exchangerate-api.com/v4/latest/USD")
        .then(res => {
            if (!res.ok) throw new Error("Erreur API");
            return res.json();
        })
        .then(data => {
            rates = data.rates;
            const currencies = Object.keys(rates);

            if (fromCurrency && toCurrency) {
                fromCurrency.innerHTML = "";
                toCurrency.innerHTML = "";

                currencies.forEach(currency => {
                    fromCurrency.innerHTML += `<option value="${currency}">${currency}</option>`;
                    toCurrency.innerHTML += `<option value="${currency}">${currency}</option>`;
                });

                // Valeurs par défaut
                fromCurrency.value = "USD";
                toCurrency.value = "EUR";

                // Afficher les drapeaux initiaux
                updateFlag(fromFlag, "USD");
                updateFlag(toFlag, "EUR");
            }

            loading.classList.add("hidden");
        })
        .catch(error => {
            console.error("Erreur :", error);
            if (resultDisplay) {
                resultDisplay.innerText = "Erreur de connexion aux taux.";
            }
            loading.classList.add("hidden");
        });
}

// ========================================
// Fonction de conversion
// ========================================
function convert() {
    if (!amountInput || !resultDisplay) return; // Si on n'est pas sur la page convertisseur
    
    const amount = amountInput.value;
    resultDisplay.classList.remove("show"); 
    
    if (Object.keys(rates).length === 0) return;
    
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        resultDisplay.innerText = "Entrez un montant valide !";
        return;
    }

    loading.classList.remove("hidden");
    
    setTimeout(() => {
        const from = fromCurrency.value;
        const to = toCurrency.value;
        const result = (parseFloat(amount) * (rates[to] / rates[from])).toFixed(2);

        loading.classList.add("hidden");
        resultDisplay.innerText = `${amount} ${from} = ${result} ${to}`;
        resultDisplay.classList.add("show"); 
    }, 500);
}

// ========================================
// Événements du convertisseur
// ========================================
if (fromCurrency && toCurrency) {
    // Charger les devises au chargement de la page
    document.addEventListener('DOMContentLoaded', loadCurrenciesAndRates);
    
    // Mettre à jour le drapeau quand on change la devise "De"
    fromCurrency.addEventListener("change", () => {
        updateFlag(fromFlag, fromCurrency.value);
        convert();
    });
    
    // Mettre à jour le drapeau quand on change la devise "À"
    toCurrency.addEventListener("change", () => {
        updateFlag(toFlag, toCurrency.value);
        convert();
    });
}