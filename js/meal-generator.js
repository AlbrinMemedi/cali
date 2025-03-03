/**
 * Generatore di piani pasto basati sugli alimenti nel database
 * Questo file si occupa di creare piani alimentari reali con alimenti specifici
 */

// Importazione del database di alimenti (assumiamo di essere in un browser)
// In un ambiente Node.js, usare: const foodDatabase = require('./food-database.js');

/**
 * Genera un piano alimentare giornaliero basato sui macronutrienti target e sulle preferenze alimentari
 * @param {Object} macros - Obiettivi macronutrienti: {calories, protein, carbs, fat}
 * @param {Object} preferences - Preferenze alimentari: {dietType, allergies, mealsPerDay}
 * @return {Object} Piano alimentare giornaliero con pasti specifici
 */
function generateMealPlan(macros, preferences) {
    const { dietType, allergies = [], mealsPerDay } = preferences;
    
    // Mappa il numero di pasti ai nomi dei pasti
    const mealNames = getMealNames(mealsPerDay);
    
    // Distribuisci i macronutrienti tra i pasti
    const mealDistribution = distributeMacros(macros, mealsPerDay);
    
    // Piano alimentare completo
    const mealPlan = {
        totalNutrition: macros,
        meals: []
    };
    
    // Genera ogni pasto
    mealDistribution.forEach((mealMacros, index) => {
        const meal = generateSingleMeal(
            mealMacros, 
            mealNames[index], 
            dietType, 
            allergies
        );
        
        mealPlan.meals.push(meal);
    });
    
    return mealPlan;
}

/**
 * Ottiene i nomi dei pasti in base al numero di pasti giornalieri
 * @param {number} mealsPerDay - Numero di pasti al giorno
 * @return {Array} Array con i nomi dei pasti
 */
function getMealNames(mealsPerDay) {
    switch (mealsPerDay) {
        case 3:
            return ['Colazione', 'Pranzo', 'Cena'];
        case 4:
            return ['Colazione', 'Spuntino', 'Pranzo', 'Cena'];
        case 5:
            return ['Colazione', 'Spuntino Mattutino', 'Pranzo', 'Spuntino Pomeridiano', 'Cena'];
        case 6:
            return ['Colazione', 'Spuntino Mattutino', 'Pranzo', 'Spuntino Pomeridiano', 'Cena', 'Spuntino Serale'];
        default:
            return ['Colazione', 'Pranzo', 'Cena'];
    }
}

/**
 * Distribuisce i macronutrienti tra i pasti giornalieri
 * @param {Object} macros - Macronutrienti totali giornalieri
 * @param {number} mealsPerDay - Numero di pasti giornalieri
 * @return {Array} Array di oggetti con i macronutrienti per ogni pasto
 */
function distributeMacros(macros, mealsPerDay) {
    const { calories, protein, carbs, fat } = macros;
    
    // Distribuzioni percentuali in base al numero di pasti
    // Bilanciamo meglio le calorie tra colazione, pranzo e cena
    const distributions = {
        3: [0.33, 0.34, 0.33],                    // Colazione, Pranzo, Cena - distribuzione equilibrata
        4: [0.25, 0.15, 0.35, 0.25],              // Colazione, Spuntino, Pranzo, Cena - più bilanciato
        5: [0.25, 0.1, 0.3, 0.1, 0.25],           // Colazione, Spuntino 1, Pranzo, Spuntino 2, Cena - più bilanciato
        6: [0.25, 0.05, 0.3, 0.1, 0.25, 0.05]     // Colazione, Spuntino 1, Pranzo, Spuntino 2, Cena, Spuntino 3 - più bilanciato
    };
    
    const distribution = distributions[mealsPerDay] || distributions[3];
    
    // Creiamo un array di oggetti macronutrienti per ogni pasto
    return distribution.map(percentage => {
        return {
            calories: Math.round(calories * percentage),
            protein: Math.round(protein * percentage),
            carbs: Math.round(carbs * percentage),
            fat: Math.round(fat * percentage)
        };
    });
}

/**
 * Genera un singolo pasto in base ai macronutrienti, tipo di dieta e allergie
 * @param {Object} mealMacros - Macronutrienti target per il pasto
 * @param {string} mealName - Nome del pasto (Colazione, Pranzo, ecc.)
 * @param {string} dietType - Tipo di dieta (standard, vegetarian, vegan, ecc.)
 * @param {Array} allergies - Array di stringhe con gli allergeni da evitare
 * @return {Object} Oggetto pasto con alimenti selezionati
 */
function generateSingleMeal(mealMacros, mealName, dietType, allergies) {
    // Filtra gli alimenti in base alla dieta e alle allergie
    const compatibleFoods = getCompatibleFoods(dietType, allergies);
    
    let meal = {
        name: mealName,
        macros: mealMacros,
        foods: []
    };
    
    // Selezioniamo alimenti diversi in base al tipo di pasto
    if (mealName.includes('Colazione')) {
        meal.foods = generateBreakfastFoods(mealMacros, compatibleFoods);
    } else if (mealName.includes('Spuntino')) {
        meal.foods = generateSnackFoods(mealMacros, compatibleFoods);
    } else if (mealName.includes('Pranzo')) {
        meal.foods = generateLunchFoods(mealMacros, compatibleFoods);
    } else if (mealName.includes('Cena')) {
        meal.foods = generateDinnerFoods(mealMacros, compatibleFoods);
    }
    
    // Calcola i macronutrienti reali del pasto
    meal.actualMacros = calculateActualMacros(meal.foods);
    
    return meal;
}

/**
 * Filtra gli alimenti compatibili con il tipo di dieta e le allergie
 * @param {string} dietType - Tipo di dieta
 * @param {Array} allergies - Array di allergeni da evitare
 * @return {Object} Oggetto con alimenti filtrati per categoria
 */
function getCompatibleFoods(dietType, allergies) {
    const allFoodCategories = {
        proteine: [...foodDatabase.proteineAnimali, ...foodDatabase.proteineVegetali],
        carboidrati: [...foodDatabase.carboidratiComplessi, ...foodDatabase.frutta],
        verdure: foodDatabase.verdura,
        grassi: foodDatabase.grassiSani,
        latticini: foodDatabase.latticini,
        bevande: foodDatabase.bevande,
        condimenti: foodDatabase.condimenti
    };
    
    // Filtra per tipo di dieta e allergie
    const filteredFoods = {};
    
    for (const [category, foods] of Object.entries(allFoodCategories)) {
        filteredFoods[category] = foods.filter(food => {
            // Verifica compatibilità con dieta
            const dietCompatible = food.dieteCompatibili.includes(dietType);
            
            // Verifica che non contenga allergeni
            const allergyFree = !food.allergeni.some(allergen => allergies.includes(allergen));
            
            return dietCompatible && allergyFree;
        });
    }
    
    return filteredFoods;
}

/**
 * Genera alimenti per la colazione
 * @param {Object} macros - Macronutrienti target
 * @param {Object} compatibleFoods - Alimenti compatibili
 * @return {Array} Alimenti selezionati per la colazione
 */
function generateBreakfastFoods(macros, compatibleFoods) {
    const { protein, carbs, fat } = macros;
    const selectedFoods = [];
    
    // Scegliamo una fonte proteica (yogurt, uova, ecc.)
    const proteinOptions = [...compatibleFoods.proteine, ...compatibleFoods.latticini]
        .filter(food => food.categoria === 'Latticini' || food.categoria === 'Uova');
    
    if (proteinOptions.length > 0) {
        const proteinFood = selectRandomFood(proteinOptions);
        const proteinAmount = calculateFoodAmount(proteinFood, { proteine: protein * 0.5 });
        selectedFoods.push({
            food: proteinFood,
            amount: proteinAmount
        });
    }
    
    // Scegliamo una fonte di carboidrati (cereali, pane, frutta)
    const carbOptions = compatibleFoods.carboidrati
        .filter(food => 
            food.categoria === 'Cereali integrali' || 
            food.categoria === 'Frutta' || 
            food.nome.includes('Pane')
        );
    
    if (carbOptions.length > 0) {
        const carbFood = selectRandomFood(carbOptions);
        const carbAmount = calculateFoodAmount(carbFood, { carboidrati: carbs * 0.7 });
        selectedFoods.push({
            food: carbFood,
            amount: carbAmount
        });
    }
    
    // Aggiungiamo frutta se non è già stata selezionata
    const fruitOptions = compatibleFoods.carboidrati
        .filter(food => food.categoria === 'Frutta');
    
    if (fruitOptions.length > 0 && !selectedFoods.some(item => item.food.categoria === 'Frutta')) {
        const fruitFood = selectRandomFood(fruitOptions);
        const fruitAmount = calculateFoodAmount(fruitFood, { carboidrati: carbs * 0.3 });
        selectedFoods.push({
            food: fruitFood,
            amount: fruitAmount
        });
    }
    
    // Aggiungiamo grassi sani (noci, semi, ecc.)
    const fatOptions = compatibleFoods.grassi;
    
    if (fatOptions.length > 0) {
        const fatFood = selectRandomFood(fatOptions);
        const fatAmount = calculateFoodAmount(fatFood, { grassi: fat * 0.8 });
        selectedFoods.push({
            food: fatFood,
            amount: fatAmount
        });
    }
    
    // Aggiungiamo una bevanda
    const beverageOptions = compatibleFoods.bevande;
    
    if (beverageOptions.length > 0) {
        const beverage = selectRandomFood(beverageOptions);
        selectedFoods.push({
            food: beverage,
            amount: beverage.porzione
        });
    }
    
    return selectedFoods;
}

/**
 * Genera alimenti per uno spuntino
 * @param {Object} macros - Macronutrienti target
 * @param {Object} compatibleFoods - Alimenti compatibili
 * @return {Array} Alimenti selezionati per lo spuntino
 */
function generateSnackFoods(macros, compatibleFoods) {
    const { protein, carbs, fat } = macros;
    const selectedFoods = [];
    
    // Per gli spuntini, scegliamo tra frutta, frutta secca, yogurt
    const options = [
        ...compatibleFoods.carboidrati.filter(food => food.categoria === 'Frutta'),
        ...compatibleFoods.grassi.filter(food => food.categoria === 'Frutta secca'),
        ...compatibleFoods.latticini.filter(food => food.nome.includes('Yogurt'))
    ];
    
    if (options.length > 0) {
        // Scegliamo 1-2 alimenti per lo spuntino
        const numFoods = Math.min(2, options.length);
        
        for (let i = 0; i < numFoods; i++) {
            let food = selectRandomFood(options);
            // Rimuoviamo l'alimento dalle opzioni per non selezionarlo di nuovo
            options.splice(options.indexOf(food), 1);
            
            let amount = food.porzione;
            if (food.categoria === 'Frutta') {
                amount = calculateFoodAmount(food, { carboidrati: carbs * 0.5 });
            } else if (food.categoria === 'Frutta secca') {
                amount = calculateFoodAmount(food, { grassi: fat * 0.8 });
            } else if (food.categoria === 'Latticini') {
                amount = calculateFoodAmount(food, { proteine: protein * 0.6 });
            }
            
            selectedFoods.push({
                food: food,
                amount: amount
            });
            
            if (options.length === 0) break;
        }
    }
    
    // Aggiungiamo acqua o tè se non ci sono abbastanza opzioni
    if (selectedFoods.length < 2 && compatibleFoods.bevande.length > 0) {
        const beverage = compatibleFoods.bevande.find(b => b.nome === 'Acqua') || 
                         compatibleFoods.bevande.find(b => b.nome === 'Tè verde') ||
                         compatibleFoods.bevande[0];
        
        selectedFoods.push({
            food: beverage,
            amount: beverage.porzione
        });
    }
    
    return selectedFoods;
}

/**
 * Genera alimenti per il pranzo
 * @param {Object} macros - Macronutrienti target
 * @param {Object} compatibleFoods - Alimenti compatibili
 * @return {Array} Alimenti selezionati per il pranzo
 */
function generateLunchFoods(macros, compatibleFoods) {
    const { protein, carbs, fat } = macros;
    const selectedFoods = [];
    
    // Fonte proteica principale
    const proteinOptions = compatibleFoods.proteine;
    
    if (proteinOptions.length > 0) {
        const proteinFood = selectRandomFood(proteinOptions);
        const proteinAmount = calculateFoodAmount(proteinFood, { proteine: protein * 0.8 });
        selectedFoods.push({
            food: proteinFood,
            amount: proteinAmount
        });
    }
    
    // Fonte di carboidrati complessi
    const carbOptions = compatibleFoods.carboidrati
        .filter(food => food.categoria === 'Cereali integrali' || food.categoria === 'Tuberi');
    
    if (carbOptions.length > 0) {
        const carbFood = selectRandomFood(carbOptions);
        const carbAmount = calculateFoodAmount(carbFood, { carboidrati: carbs * 0.7 });
        selectedFoods.push({
            food: carbFood,
            amount: carbAmount
        });
    }
    
    // Verdure (almeno 2 tipi diversi)
    const veggieOptions = compatibleFoods.verdure;
    
    if (veggieOptions.length > 0) {
        // Prima verdura
        const veggie1 = selectRandomFood(veggieOptions);
        selectedFoods.push({
            food: veggie1,
            amount: 150 // Porzione standard di verdure
        });
        
        // Seconda verdura (diversa dalla prima)
        if (veggieOptions.length > 1) {
            const remainingVeggies = veggieOptions.filter(v => v.nome !== veggie1.nome);
            const veggie2 = selectRandomFood(remainingVeggies);
            selectedFoods.push({
                food: veggie2,
                amount: 100 // Porzione un po' più piccola per la seconda verdura
            });
        }
    }
    
    // Grassi sani (condimento o avocado)
    const fatOptions = compatibleFoods.grassi.concat(
        compatibleFoods.condimenti.filter(c => c.nome.includes('Olio'))
    );
    
    if (fatOptions.length > 0) {
        const fatFood = selectRandomFood(fatOptions);
        const fatAmount = fatFood.categoria === 'Condimenti' ? 
            10 : // 10ml di olio
            calculateFoodAmount(fatFood, { grassi: fat * 0.5 });
        
        selectedFoods.push({
            food: fatFood,
            amount: fatAmount
        });
    }
    
    // Condimenti (limone, aceto, ecc.)
    const condimentOptions = compatibleFoods.condimenti
        .filter(c => !c.nome.includes('Olio')); // Escludiamo l'olio già considerato
    
    if (condimentOptions.length > 0) {
        const condiment = selectRandomFood(condimentOptions);
        selectedFoods.push({
            food: condiment,
            amount: condiment.porzione
        });
    }
    
    // Acqua
    const water = compatibleFoods.bevande.find(b => b.nome === 'Acqua');
    if (water) {
        selectedFoods.push({
            food: water,
            amount: 500 // 500ml di acqua
        });
    }
    
    return selectedFoods;
}

/**
 * Genera alimenti per la cena
 * @param {Object} macros - Macronutrienti target
 * @param {Object} compatibleFoods - Alimenti compatibili
 * @return {Array} Alimenti selezionati per la cena
 */
function generateDinnerFoods(macros, compatibleFoods) {
    const { protein, carbs, fat } = macros;
    const selectedFoods = [];
    
    // La cena è simile al pranzo ma con porzioni diverse
    // e preferibilmente con diversi alimenti
    
    // Fonte proteica (preferenza per pesce o proteine leggere)
    const proteinOptions = compatibleFoods.proteine;
    let proteinFood;
    
    if (proteinOptions.length > 0) {
        // Tentiamo di selezionare un tipo di pesce o una proteina leggera
        const fishOptions = proteinOptions.filter(p => p.categoria === 'Pesce');
        
        if (fishOptions.length > 0) {
            proteinFood = selectRandomFood(fishOptions);
        } else {
            // Altrimenti selezioniamo una proteina qualsiasi
            proteinFood = selectRandomFood(proteinOptions);
        }
        
        const proteinAmount = calculateFoodAmount(proteinFood, { proteine: protein * 0.8 });
        selectedFoods.push({
            food: proteinFood,
            amount: proteinAmount
        });
    }
    
    // Carboidrati in quantità minore rispetto al pranzo
    const carbOptions = compatibleFoods.carboidrati
        .filter(food => food.categoria === 'Cereali integrali' || food.categoria === 'Tuberi');
    
    if (carbOptions.length > 0) {
        const carbFood = selectRandomFood(carbOptions);
        // Meno carboidrati a cena rispetto al pranzo
        const carbAmount = calculateFoodAmount(carbFood, { carboidrati: carbs * 0.6 });
        selectedFoods.push({
            food: carbFood,
            amount: carbAmount
        });
    }
    
    // Verdure abbondanti (almeno 2 tipi)
    const veggieOptions = compatibleFoods.verdure;
    
    if (veggieOptions.length > 0) {
        // Prima verdura
        const veggie1 = selectRandomFood(veggieOptions);
        selectedFoods.push({
            food: veggie1,
            amount: 200 // Porzione abbondante di verdure
        });
        
        // Seconda verdura (diversa dalla prima)
        if (veggieOptions.length > 1) {
            const remainingVeggies = veggieOptions.filter(v => v.nome !== veggie1.nome);
            const veggie2 = selectRandomFood(remainingVeggies);
            selectedFoods.push({
                food: veggie2,
                amount: 150
            });
        }
    }
    
    // Grassi sani
    const fatOptions = compatibleFoods.grassi.concat(
        compatibleFoods.condimenti.filter(c => c.nome.includes('Olio'))
    );
    
    if (fatOptions.length > 0) {
        const fatFood = selectRandomFood(fatOptions);
        const fatAmount = fatFood.categoria === 'Condimenti' ? 
            10 : // 10ml di olio
            calculateFoodAmount(fatFood, { grassi: fat * 0.5 });
        
        selectedFoods.push({
            food: fatFood,
            amount: fatAmount
        });
    }
    
    // Condimenti
    const condimentOptions = compatibleFoods.condimenti
        .filter(c => !c.nome.includes('Olio'));
    
    if (condimentOptions.length > 0) {
        const condiment = selectRandomFood(condimentOptions);
        selectedFoods.push({
            food: condiment,
            amount: condiment.porzione
        });
    }
    
    // Acqua o tè
    const beverageOptions = compatibleFoods.bevande
        .filter(b => b.nome === 'Acqua' || b.nome === 'Tè verde');
    
    if (beverageOptions.length > 0) {
        const beverage = selectRandomFood(beverageOptions);
        selectedFoods.push({
            food: beverage,
            amount: 400 // 400ml di acqua o tè
        });
    }
    
    return selectedFoods;
}

/**
 * Seleziona un alimento casuale dalla lista specificata
 * @param {Array} foods - Lista di alimenti tra cui scegliere
 * @return {Object} Alimento selezionato
 */
function selectRandomFood(foods) {
    const index = Math.floor(Math.random() * foods.length);
    return foods[index];
}

/**
 * Calcola la quantità di un alimento necessaria per raggiungere i target nutrizionali
 * @param {Object} food - L'alimento di cui calcolare la quantità
 * @param {Object} targets - Target nutrizionali (es. {proteine: 20})
 * @return {number} Quantità in grammi
 */
function calculateFoodAmount(food, targets) {
    // Per le bevande, usiamo sempre la porzione standard
    if (food.categoria === 'Bevande') return food.porzione;
    
    // Per i condimenti, usiamo la porzione standard
    if (food.categoria === 'Condimenti') return food.porzione;
    
    let amounts = [];
    
    // Calcolo basato su proteine
    if (targets.proteine && food.proteine > 0) {
        amounts.push((targets.proteine / food.proteine) * 100);
    }
    
    // Calcolo basato su carboidrati
    if (targets.carboidrati && food.carboidrati > 0) {
        amounts.push((targets.carboidrati / food.carboidrati) * 100);
    }
    
    // Calcolo basato su grassi
    if (targets.grassi && food.grassi > 0) {
        amounts.push((targets.grassi / food.grassi) * 100);
    }
    
    // Se non abbiamo potuto calcolare in base ai target, usiamo la porzione standard
    if (amounts.length === 0) return food.porzione;
    
    // Prendiamo la media delle quantità calcolate
    const avgAmount = amounts.reduce((sum, val) => sum + val, 0) / amounts.length;
    
    // Arrotondiamo a multipli di 5g per praticità
    return Math.round(avgAmount / 5) * 5;
}

/**
 * Calcola i macronutrienti effettivi di un insieme di alimenti
 * @param {Array} foodItems - Array di oggetti {food, amount}
 * @return {Object} Macronutrienti effettivi
 */
function calculateActualMacros(foodItems) {
    const macros = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0
    };
    
    foodItems.forEach(item => {
        const { food, amount } = item;
        const multiplier = amount / 100; // Converte in base alla quantità (i valori nutritivi sono per 100g)
        
        macros.calories += food.calorie * multiplier;
        macros.protein += food.proteine * multiplier;
        macros.carbs += food.carboidrati * multiplier;
        macros.fat += food.grassi * multiplier;
        macros.fiber += (food.fibre || 0) * multiplier;
    });
    
    // Arrotondiamo i valori
    macros.calories = Math.round(macros.calories);
    macros.protein = Math.round(macros.protein);
    macros.carbs = Math.round(macros.carbs);
    macros.fat = Math.round(macros.fat);
    macros.fiber = Math.round(macros.fiber);
    
    return macros;
}

/**
 * Genera un piano alimentare settimanale
 * @param {Object} macros - Obiettivi macronutrienti giornalieri
 * @param {Object} preferences - Preferenze alimentari
 * @return {Object} Piano alimentare settimanale
 */
function generateWeeklyMealPlan(macros, preferences) {
    const weeklyPlan = {
        macros: macros,
        preferences: preferences,
        days: []
    };
    
    // Generiamo un piano diverso per ogni giorno della settimana
    for (let i = 0; i < 7; i++) {
        const dayPlan = generateMealPlan(macros, preferences);
        weeklyPlan.days.push({
            dayName: getDayName(i),
            mealPlan: dayPlan
        });
    }
    
    return weeklyPlan;
}

/**
 * Ottiene il nome del giorno della settimana
 * @param {number} dayIndex - Indice del giorno (0-6)
 * @return {string} Nome del giorno
 */
function getDayName(dayIndex) {
    const days = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
    return days[dayIndex];
}

// Esponiamo le funzioni
window.mealGenerator = {
    generateMealPlan,
    generateWeeklyMealPlan,
    calculateActualMacros
};

// Esportazione per l'uso con CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateMealPlan,
        generateWeeklyMealPlan,
        calculateActualMacros
    };
} 