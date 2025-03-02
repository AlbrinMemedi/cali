/**
 * Sistema di gestione dei piani alimentari
 * Questo file contiene i dati e le funzioni per la generazione di piani alimentari
 * personalizzati per supportare l'allenamento calistenico.
 */

// Database dei piani alimentari
const dietPlans = {
    // Dieta standard bilanciata
    standard: {
        name: "Piano Alimentare Standard Bilanciato",
        description: "Un piano alimentare bilanciato che fornisce tutti i nutrienti necessari per supportare l'allenamento calistenico e migliorare le prestazioni generali.",
        macros: {
            protein: "1.6-2.0g per kg di peso corporeo",
            carbs: "3-5g per kg di peso corporeo",
            fats: "0.8-1.0g per kg di peso corporeo"
        },
        mealPlan: [
            {
                meal: "Colazione",
                options: [
                    "Porridge d'avena con frutti di bosco e un cucchiaio di burro di mandorle",
                    "Uova strapazzate con spinaci e toast integrale",
                    "Yogurt greco con miele, frutta fresca e granola"
                ],
                notes: "La colazione dovrebbe fornire circa il 25% delle calorie giornaliere"
            },
            {
                meal: "Spuntino Mattutino",
                options: [
                    "Frutta fresca e una manciata di noci miste",
                    "Yogurt greco con miele",
                    "Barretta proteica naturale"
                ]
            },
            {
                meal: "Pranzo",
                options: [
                    "Insalata di pollo grigliato con verdure miste e riso integrale",
                    "Piatto di pasta integrale con salsa di pomodoro e tacchino tritato",
                    "Wrap di tonno con verdure e hummus"
                ],
                notes: "Il pranzo dovrebbe fornire circa il 30-35% delle calorie giornaliere"
            },
            {
                meal: "Spuntino Pomeridiano",
                options: [
                    "Frullato proteico con banana e latte",
                    "Pane integrale con avocado",
                    "Ricotta con frutta fresca"
                ],
                notes: "Ideale 1-2 ore prima dell'allenamento"
            },
            {
                meal: "Cena",
                options: [
                    "Salmone al forno con patate dolci e verdure",
                    "Petto di pollo con quinoa e asparagi",
                    "Bistecca magra con verdure grigliate e riso basmati"
                ],
                notes: "La cena dovrebbe fornire circa il 25-30% delle calorie giornaliere"
            },
            {
                meal: "Spuntino Serale (opzionale)",
                options: [
                    "Yogurt greco con miele",
                    "Frullato proteico",
                    "Fiocchi di latte con frutta"
                ],
                notes: "Solo se necessario, specialmente se si mira all'aumento di massa"
            }
        ],
        foodsByMacro: {
            proteins: [
                "Pollo", "Tacchino", "Manzo magro", "Uova", "Pesce (salmone, tonno, merluzzo)", 
                "Yogurt greco", "Tofu", "Legumi", "Latticini magri", "Proteine del siero del latte"
            ],
            carbs: [
                "Riso (integrale, basmati)", "Pasta integrale", "Pane integrale", "Patate", "Patate dolci",
                "Avena", "Quinoa", "Frutta", "Verdure amidacee", "Legumi"
            ],
            fats: [
                "Avocado", "Olio d'oliva", "Olio di cocco", "Noci e semi", "Burri di frutta secca",
                "Pesce grasso (salmone)", "Uova (tuorlo)", "Formaggio", "Cioccolato fondente (>70%)", "Olio di lino"
            ]
        },
        tips: [
            "Mantenere l'idratazione bevendo almeno 2-3 litri di acqua al giorno",
            "Mangiare ogni 3-4 ore per mantenere stabili i livelli di energia",
            "Consumare proteine di alta qualità in ogni pasto principale",
            "Includere frutta e verdura in almeno 3 pasti al giorno",
            "Ridurre al minimo i cibi processati, gli zuccheri raffinati e gli oli idrogenati"
        ]
    },

    // Dieta vegetariana
    vegetarian: {
        name: "Piano Alimentare Vegetariano",
        description: "Un piano alimentare vegetariano equilibrato che fornisce tutti i nutrienti necessari senza carne, ma includendo prodotti lattiero-caseari e uova.",
        macros: {
            protein: "1.6-1.8g per kg di peso corporeo",
            carbs: "4-5g per kg di peso corporeo",
            fats: "0.8-1.0g per kg di peso corporeo"
        },
        mealPlan: [
            {
                meal: "Colazione",
                options: [
                    "Frittata di uova con verdure e formaggio",
                    "Porridge d'avena con latte, semi di chia e frutti di bosco",
                    "Yogurt greco con granola e miele"
                ]
            },
            {
                meal: "Spuntino Mattutino",
                options: [
                    "Smoothie proteico con latte, banana e burro di mandorle",
                    "Una manciata di noci miste e frutta secca",
                    "Yogurt greco con miele"
                ]
            },
            {
                meal: "Pranzo",
                options: [
                    "Buddha bowl con quinoa, legumi, avocado e uovo sodo",
                    "Wrap con hummus, formaggio feta e verdure grigliate",
                    "Insalata di fagioli e formaggio con vinaigrette"
                ]
            },
            {
                meal: "Spuntino Pomeridiano",
                options: [
                    "Frullato proteico con latte o yogurt",
                    "Cottage cheese con frutta e miele",
                    "Toast integrale con burro di arachidi"
                ]
            },
            {
                meal: "Cena",
                options: [
                    "Curry di ceci e lenticchie con riso basmati",
                    "Pasta integrale con salsa di pomodoro, formaggio e verdure arrostite",
                    "Polpette di legumi con insalata di quinoa"
                ]
            },
            {
                meal: "Spuntino Serale (opzionale)",
                options: [
                    "Yogurt greco con semi di chia",
                    "Latte caldo con proteine",
                    "Una piccola porzione di noci e frutta secca"
                ]
            }
        ],
        foodsByMacro: {
            proteins: [
                "Uova", "Yogurt greco", "Formaggio", "Tofu", "Tempeh", 
                "Lenticchie", "Ceci", "Fagioli", "Proteine del siero del latte", "Seitan"
            ],
            carbs: [
                "Riso integrale", "Quinoa", "Pasta integrale", "Pane integrale", "Patate dolci",
                "Avena", "Frutta", "Verdure amidacee", "Legumi", "Bulgur"
            ],
            fats: [
                "Avocado", "Olio d'oliva", "Noci e semi", "Burri di frutta secca", "Formaggio",
                "Uova (tuorlo)", "Latte intero", "Yogurt intero", "Cioccolato fondente (>70%)", "Olio di lino"
            ]
        },
        tips: [
            "Combinare diverse fonti proteiche vegetali per ottenere tutti gli aminoacidi essenziali",
            "Includere uova e latticini di qualità per migliorare l'apporto proteico",
            "Considerare l'integrazione con B12 se il consumo di uova e latticini è limitato",
            "Mangiare legumi e cereali integrali regolarmente per garantire un buon apporto proteico",
            "Includere alimenti ricchi di ferro come lenticchie, spinaci e tofu, accompagnati da fonti di vitamina C per migliorare l'assorbimento"
        ]
    },

    // Dieta vegana
    vegan: {
        name: "Piano Alimentare Vegano",
        description: "Un piano alimentare vegano equilibrato che fornisce tutti i nutrienti essenziali senza alcun prodotto di origine animale.",
        macros: {
            protein: "1.6-2.0g per kg di peso corporeo",
            carbs: "4-6g per kg di peso corporeo",
            fats: "0.8-1.0g per kg di peso corporeo"
        },
        mealPlan: [
            {
                meal: "Colazione",
                options: [
                    "Porridge d'avena con latte vegetale, semi di chia, frutta secca e banana",
                    "Tofu strapazzato con verdure e pane integrale tostato",
                    "Smoothie bowl con proteine vegane, frutta congelata e topping di semi"
                ]
            },
            {
                meal: "Spuntino Mattutino",
                options: [
                    "Smoothie proteico con latte vegetale e burro di arachidi",
                    "Hummus con bastoncini di verdure",
                    "Una manciata di trail mix (noci e frutta secca)"
                ]
            },
            {
                meal: "Pranzo",
                options: [
                    "Buddha bowl con quinoa, tempeh marinato, avocado e verdure",
                    "Wrap con hummus, falafel e verdure grigliate",
                    "Insalata di lenticchie e verdure con avocado"
                ]
            },
            {
                meal: "Spuntino Pomeridiano",
                options: [
                    "Frullato proteico vegano",
                    "Toast integrale con avocado e semi di lino",
                    "Yogurt di soia con frutti di bosco e granola"
                ]
            },
            {
                meal: "Cena",
                options: [
                    "Curry di ceci con latte di cocco e riso integrale",
                    "Pasta integrale con ragù di lenticchie",
                    "Burger di fagioli neri con patate dolci al forno"
                ]
            },
            {
                meal: "Spuntino Serale (opzionale)",
                options: [
                    "Yogurt di soia con semi di chia",
                    "Latte vegetale con proteine vegane",
                    "Biscotti proteici fatti in casa"
                ]
            }
        ],
        foodsByMacro: {
            proteins: [
                "Tofu", "Tempeh", "Seitan", "Lenticchie", "Ceci", 
                "Fagioli", "Piselli", "Edamame", "Proteine vegetali in polvere", "Quinoa"
            ],
            carbs: [
                "Riso integrale", "Quinoa", "Pasta integrale", "Pane integrale", "Patate dolci",
                "Avena", "Frutta", "Verdure amidacee", "Legumi", "Amaranto"
            ],
            fats: [
                "Avocado", "Olio d'oliva", "Noci e semi", "Burri di frutta secca", "Olio di cocco",
                "Semi di chia", "Semi di lino", "Olio di lino", "Olive", "Cioccolato fondente vegano"
            ]
        },
        tips: [
            "Integrare con vitamina B12, che è difficile da ottenere da fonti vegetali",
            "Combinare diverse fonti proteiche vegetali per ottenere tutti gli aminoacidi essenziali",
            "Includere fonti di omega-3 come semi di lino, semi di chia e noci",
            "Consumare cibi ricchi di ferro (lenticchie, spinaci, tofu) insieme a fonti di vitamina C per migliorare l'assorbimento",
            "Considerare l'integrazione con vitamina D se l'esposizione al sole è limitata",
            "Includere alimenti fortificati con calcio come latte vegetale e tofu"
        ]
    },

    // Dieta per dimagrimento
    "weight-loss": {
        name: "Piano Alimentare per Dimagrimento",
        description: "Un piano alimentare progettato per favorire la perdita di grasso mentre si mantiene la massa muscolare durante l'allenamento calistenico.",
        macros: {
            protein: "1.8-2.2g per kg di peso corporeo",
            carbs: "2-3g per kg di peso corporeo",
            fats: "0.6-0.8g per kg di peso corporeo"
        },
        mealPlan: [
            {
                meal: "Colazione",
                options: [
                    "Frittata di albumi con spinaci e un pezzo di frutta",
                    "Yogurt greco magro con mirtilli e un pizzico di cannella",
                    "Porridge d'avena con proteine in polvere e frutti di bosco"
                ],
                notes: "Focalizzarsi su proteine e fibre per aumentare la sazietà"
            },
            {
                meal: "Spuntino Mattutino",
                options: [
                    "Bastoncini di sedano con un cucchiaio di burro di mandorle",
                    "Una mela e una piccola porzione di yogurt greco",
                    "Un uovo sodo"
                ]
            },
            {
                meal: "Pranzo",
                options: [
                    "Insalata di pollo grigliato con abbondanti verdure e condimento leggero",
                    "Zuppa di lenticchie con verdure e una fonte proteica magra",
                    "Bowl di tonno e verdure con un quarto di avocado"
                ],
                notes: "Riempire metà del piatto con verdure non amidacee"
            },
            {
                meal: "Spuntino Pomeridiano",
                options: [
                    "Frullato proteico con acqua o latte scremato",
                    "Una piccola porzione di noci miste (circa 10-15)",
                    "Bastoncini di carota con hummus"
                ],
                notes: "Ideale 1-2 ore prima dell'allenamento"
            },
            {
                meal: "Cena",
                options: [
                    "Petto di pollo o pesce con verdure a vapore",
                    "Tofu o tempeh con verdure saltate e una piccola porzione di riso integrale",
                    "Frittata di uova con verdure e insalata"
                ],
                notes: "Ridurre i carboidrati se non ci si allena in serata"
            }
        ],
        foodsByMacro: {
            proteins: [
                "Petto di pollo", "Tacchino", "Pesce magro", "Albumi d'uovo", "Yogurt greco magro", 
                "Tofu", "Tempeh", "Proteine in polvere", "Frutti di mare", "Fiocchi di latte"
            ],
            carbs: [
                "Verdure non amidacee", "Frutti di bosco", "Avena", "Quinoa", "Patate dolci (porzioni moderate)",
                "Riso integrale (porzioni moderate)", "Legumi", "Mele", "Agrumi", "Frutta a basso indice glicemico"
            ],
            fats: [
                "Avocado (porzioni moderate)", "Olio d'oliva (1-2 cucchiaini)", "Piccole porzioni di noci e semi", 
                "Pesce grasso come salmone", "Uova intere (limitate)"
            ]
        },
        tips: [
            "Mantenere un deficit calorico di circa 300-500 calorie al giorno per una perdita di peso sostenibile",
            "Dare priorità alle proteine in ogni pasto per preservare la massa muscolare",
            "Bere molta acqua, specialmente prima dei pasti",
            "Evitare cibi ultraprocessati, zuccheri aggiunti e bevande alcoliche",
            "Includere allenamenti di resistenza per mantenere o aumentare la massa muscolare durante il deficit calorico",
            "Pianificare i pasti in anticipo per evitare scelte alimentari impulsive"
        ]
    },

    // Dieta per aumento massa
    "muscle-gain": {
        name: "Piano Alimentare per Aumento di Massa",
        description: "Un piano alimentare ad alto contenuto calorico e proteico progettato per supportare la costruzione muscolare durante l'allenamento calistenico intenso.",
        macros: {
            protein: "1.8-2.2g per kg di peso corporeo",
            carbs: "5-7g per kg di peso corporeo",
            fats: "1.0-1.5g per kg di peso corporeo"
        },
        mealPlan: [
            {
                meal: "Colazione",
                options: [
                    "Frittata con 3-4 uova intere, verdure e formaggio con pane integrale tostato",
                    "Porridge d'avena con latte intero, proteine in polvere, banana, burro di arachidi e miele",
                    "Sandwich con uova, avocado e formaggio più uno yogurt greco con miele e noci"
                ],
                notes: "Colazione abbondante con un buon mix di proteine, carboidrati e grassi"
            },
            {
                meal: "Spuntino Mattutino",
                options: [
                    "Smoothie con latte intero, proteine in polvere, banana, avena e burro di mandorle",
                    "Yogurt greco intero con granola, frutta e miele",
                    "Sandwich con tonno e avocado"
                ]
            },
            {
                meal: "Pranzo",
                options: [
                    "Riso integrale con pollo o manzo e verdure saltate in olio d'oliva",
                    "Pasta integrale con ragù di carne e formaggio grattugiato",
                    "Bowl di quinoa con salmone, avocado e verdure"
                ],
                notes: "Porzioni generose di carboidrati complessi e proteine"
            },
            {
                meal: "Spuntino Pre-Allenamento",
                options: [
                    "Banana con burro di arachidi",
                    "Barretta proteica naturale con un frutto",
                    "Yogurt greco con miele e frutta"
                ],
                notes: "1-2 ore prima dell'allenamento"
            },
            {
                meal: "Spuntino Post-Allenamento",
                options: [
                    "Frullato proteico con latte, banana e un cucchiaio di miele",
                    "Yogurt greco con frutta e miele",
                    "Sandwich con petto di tacchino e avocado"
                ],
                notes: "Da consumare entro 30-60 minuti dopo l'allenamento"
            },
            {
                meal: "Cena",
                options: [
                    "Bistecca con patate al forno e verdure",
                    "Salmone al forno con riso integrale e asparagi",
                    "Petto di pollo con patate dolci e broccoli"
                ],
                notes: "Pasto abbondante con buone fonti di proteine e carboidrati"
            },
            {
                meal: "Spuntino Serale",
                options: [
                    "Yogurt greco con miele e cannella",
                    "Fiocchi di latte con frutta e noci",
                    "Frullato proteico con latte e un po' di burro di arachidi"
                ],
                notes: "Focus sulle proteine per supportare la sintesi proteica durante la notte"
            }
        ],
        foodsByMacro: {
            proteins: [
                "Petto di pollo", "Tacchino", "Manzo", "Uova intere", "Salmone", 
                "Tonno", "Yogurt greco intero", "Proteine in polvere", "Fiocchi di latte", "Formaggio"
            ],
            carbs: [
                "Riso (bianco o integrale)", "Pasta", "Pane", "Patate", "Patate dolci",
                "Avena", "Quinoa", "Frutta (specialmente banane)", "Cereali integrali", "Legumi"
            ],
            fats: [
                "Avocado", "Olio d'oliva", "Olio di cocco", "Burri di frutta secca", "Noci e semi",
                "Uova intere", "Latticini interi", "Carni più grasse", "Pesci grassi", "Cioccolato fondente"
            ]
        },
        tips: [
            "Mantenere un surplus calorico di circa 300-500 calorie al giorno per un aumento di massa pulito",
            "Consumare proteine di alta qualità distribuite in tutti i pasti della giornata",
            "Non saltare mai i pasti, specialmente quelli post-allenamento",
            "Dare priorità a cibi nutrienti e limitare i cibi spazzatura anche in fase di massa",
            "Idratarsi adeguatamente per supportare il metabolismo e la digestione",
            "Considerare pasti più frequenti (5-6 al giorno) per distribuire meglio l'apporto calorico e proteico"
        ]
    }
};

/**
 * Genera un piano alimentare in base al tipo selezionato
 * @param {string} dietType - Il tipo di dieta selezionato
 * @param {object} userData - I dati dell'utente
 * @returns {object} Piano alimentare personalizzato
 */
function generateDietPlan(dietType, userData) {
    // Se non è stato selezionato nessun piano alimentare, ritorna null
    if (dietType === 'none') {
        return null;
    }

    // Ottieni il piano alimentare base dal database
    const baseDietPlan = dietPlans[dietType];
    
    if (!baseDietPlan) {
        console.error('Piano alimentare non trovato:', dietType);
        return null;
    }

    // Personalizza il piano in base ai dati dell'utente
    const customizedDietPlan = {
        ...baseDietPlan,
        // Aggiungi personalizzazioni basate sugli obiettivi dell'utente
        customTips: []
    };

    // Aggiungi suggerimenti personalizzati in base all'obiettivo dell'utente
    if (userData.goal === 'strength') {
        customizedDietPlan.customTips.push(
            "Aumenta l'apporto proteico nei giorni di allenamento intenso",
            "Consuma carboidrati complessi prima dell'allenamento per massimizzare la forza"
        );
    } else if (userData.goal === 'muscle') {
        customizedDietPlan.customTips.push(
            "Mantieni un surplus calorico moderato per favorire la crescita muscolare",
            "Distribuisci l'apporto proteico uniformemente durante la giornata"
        );
    } else if (userData.goal === 'endurance') {
        customizedDietPlan.customTips.push(
            "Incrementa l'apporto di carboidrati complessi per sostenere l'energia durante allenamenti lunghi",
            "Considera alimenti ricchi di nitrati come la barbabietola per migliorare la resistenza"
        );
    } else if (userData.goal === 'skill') {
        customizedDietPlan.customTips.push(
            "Mantieni un'alimentazione bilanciata per supportare la coordinazione e la funzione neurologica",
            "Assicurati di avere energia sufficiente prima delle sessioni di allenamento delle abilità"
        );
    }

    // Adatta in base al livello di esperienza
    if (userData.experience === 'beginner') {
        customizedDietPlan.customTips.push(
            "Focalizzati sull'acquisire abitudini alimentari costanti",
            "Non preoccuparti troppo del timing dei nutrienti, concentrati sulla qualità complessiva"
        );
    }

    return customizedDietPlan;
}

/**
 * Visualizza il piano alimentare nella pagina
 * @param {object} dietPlan - Il piano alimentare da visualizzare
 * @returns {HTMLElement} L'elemento DOM contenente il piano alimentare
 */
function displayDietPlan(dietPlan) {
    if (!dietPlan) {
        return null;
    }

    // Crea il container principale
    const dietPlanElement = document.createElement('div');
    dietPlanElement.className = 'diet-plan';
    
    // Aggiungi il titolo
    const title = document.createElement('h3');
    title.textContent = dietPlan.name;
    dietPlanElement.appendChild(title);
    
    // Aggiungi la descrizione
    const description = document.createElement('p');
    description.className = 'diet-description';
    description.textContent = dietPlan.description;
    dietPlanElement.appendChild(description);
    
    // Aggiungi la sezione dei macronutrienti
    const macrosSection = document.createElement('div');
    macrosSection.className = 'macros-section';
    
    const macrosTitle = document.createElement('h4');
    macrosTitle.textContent = 'Macronutrienti Consigliati';
    macrosSection.appendChild(macrosTitle);
    
    const macrosList = document.createElement('ul');
    macrosList.className = 'macros-list';
    
    for (const [macro, value] of Object.entries(dietPlan.macros)) {
        const macroItem = document.createElement('li');
        macroItem.innerHTML = `<strong>${macro === 'protein' ? 'Proteine' : macro === 'carbs' ? 'Carboidrati' : 'Grassi'}:</strong> ${value}`;
        macrosList.appendChild(macroItem);
    }
    
    macrosSection.appendChild(macrosList);
    dietPlanElement.appendChild(macrosSection);
    
    // Aggiungi il piano dei pasti
    const mealPlanSection = document.createElement('div');
    mealPlanSection.className = 'meal-plan-section';
    
    const mealPlanTitle = document.createElement('h4');
    mealPlanTitle.textContent = 'Piano dei Pasti';
    mealPlanSection.appendChild(mealPlanTitle);
    
    dietPlan.mealPlan.forEach(meal => {
        const mealElement = document.createElement('div');
        mealElement.className = 'meal';
        
        const mealTitle = document.createElement('h5');
        mealTitle.textContent = meal.meal;
        mealElement.appendChild(mealTitle);
        
        const optionsList = document.createElement('ul');
        optionsList.className = 'meal-options';
        
        meal.options.forEach(option => {
            const optionItem = document.createElement('li');
            optionItem.textContent = option;
            optionsList.appendChild(optionItem);
        });
        
        mealElement.appendChild(optionsList);
        
        if (meal.notes) {
            const notes = document.createElement('p');
            notes.className = 'meal-notes';
            notes.textContent = meal.notes;
            mealElement.appendChild(notes);
        }
        
        mealPlanSection.appendChild(mealElement);
    });
    
    dietPlanElement.appendChild(mealPlanSection);
    
    // Aggiungi la sezione degli alimenti per macronutrienti
    const foodsByMacroSection = document.createElement('div');
    foodsByMacroSection.className = 'foods-by-macro-section';
    
    const foodsByMacroTitle = document.createElement('h4');
    foodsByMacroTitle.textContent = 'Alimenti Consigliati per Categoria';
    foodsByMacroSection.appendChild(foodsByMacroTitle);
    
    for (const [macroType, foods] of Object.entries(dietPlan.foodsByMacro)) {
        const macroElement = document.createElement('div');
        macroElement.className = 'macro-foods';
        
        const macroTitle = document.createElement('h5');
        macroTitle.textContent = macroType === 'proteins' ? 'Proteine' : macroType === 'carbs' ? 'Carboidrati' : 'Grassi Sani';
        macroElement.appendChild(macroTitle);
        
        const foodsList = document.createElement('ul');
        foodsList.className = 'foods-list';
        
        foods.forEach(food => {
            const foodItem = document.createElement('li');
            foodItem.textContent = food;
            foodsList.appendChild(foodItem);
        });
        
        macroElement.appendChild(foodsList);
        foodsByMacroSection.appendChild(macroElement);
    }
    
    dietPlanElement.appendChild(foodsByMacroSection);
    
    // Aggiungi i suggerimenti
    const tipsSection = document.createElement('div');
    tipsSection.className = 'tips-section';
    
    const tipsTitle = document.createElement('h4');
    tipsTitle.textContent = 'Suggerimenti Generali';
    tipsSection.appendChild(tipsTitle);
    
    const tipsList = document.createElement('ul');
    tipsList.className = 'tips-list';
    
    dietPlan.tips.forEach(tip => {
        const tipItem = document.createElement('li');
        tipItem.textContent = tip;
        tipsList.appendChild(tipItem);
    });
    
    tipsSection.appendChild(tipsList);
    
    // Aggiungi suggerimenti personalizzati se presenti
    if (dietPlan.customTips && dietPlan.customTips.length > 0) {
        const customTipsTitle = document.createElement('h4');
        customTipsTitle.textContent = 'Suggerimenti Personalizzati';
        tipsSection.appendChild(customTipsTitle);
        
        const customTipsList = document.createElement('ul');
        customTipsList.className = 'custom-tips-list';
        
        dietPlan.customTips.forEach(tip => {
            const tipItem = document.createElement('li');
            tipItem.textContent = tip;
            customTipsList.appendChild(tipItem);
        });
        
        tipsSection.appendChild(customTipsList);
    }
    
    dietPlanElement.appendChild(tipsSection);
    
    return dietPlanElement;
} 