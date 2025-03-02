/**
 * Calcolatore di diete e piani alimentari
 * Questo file gestisce il calcolo di diete e piani alimentari personalizzati
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ottieni riferimenti agli elementi del form
    const dietForm = document.getElementById('diet-form');
    const dietTypeSelect = document.getElementById('diet-type');
    const allergiesCheckboxes = document.getElementsByName('allergies');
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const ageInput = document.getElementById('age');
    const genderSelect = document.getElementById('gender');
    const activityLevelSelect = document.getElementById('activity-level');
    const goalSelect = document.getElementById('diet-goal');
    const mealsPerDaySelect = document.getElementById('meals-per-day');
    const dietResultDiv = document.getElementById('diet-plan-container');
    const downloadButton = document.getElementById('download-diet-pdf');
    const dietPlanSection = document.getElementById('diet-plan-section');
    
    // Gestisci l'invio del form
    if (dietForm) {
        dietForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validazione dei campi
            if (!validateInputs()) {
                return;
            }
            
            // Calcola il piano alimentare
            const dietPlan = calculateDietPlan();
            
            // Mostra i risultati
            displayDietPlan(dietPlan);
            
            // Mostra la sezione del piano alimentare
            if (dietPlanSection) {
                dietPlanSection.classList.remove('hidden');
                dietPlanSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Gestisci il click sul pulsante di download
    if (downloadButton) {
        downloadButton.addEventListener('click', function() {
            try {
                downloadDietPlanAsPDF();
            } catch (error) {
                console.error('Errore durante il download del piano alimentare:', error);
                alert('Si è verificato un errore durante il download. Assicurati di utilizzare un browser supportato.');
            }
        });
    }
    
    /**
     * Valida gli input del form
     * @return {boolean} True se tutti gli input sono validi, altrimenti False
     */
    function validateInputs() {
        const weight = parseFloat(weightInput.value);
        const height = parseFloat(heightInput.value);
        const age = parseInt(ageInput.value);
        
        if (isNaN(weight) || weight <= 0) {
            alert('Inserisci un peso valido');
            weightInput.focus();
            return false;
        }
        
        if (isNaN(height) || height <= 0) {
            alert('Inserisci un\'altezza valida');
            heightInput.focus();
            return false;
        }
        
        if (isNaN(age) || age <= 0 || age > 120) {
            alert('Inserisci un\'età valida (1-120)');
            ageInput.focus();
            return false;
        }
        
        return true;
    }
    
    /**
     * Calcola il piano alimentare basato sugli input dell'utente
     * @return {Object} Piano alimentare calcolato
     */
    function calculateDietPlan() {
        // Ottieni i valori dal form
        const weight = parseFloat(weightInput.value);
        const height = parseFloat(heightInput.value);
        const age = parseInt(ageInput.value);
        const gender = genderSelect.value;
        const activityLevel = activityLevelSelect.value;
        const goal = goalSelect.value;
        const dietType = dietTypeSelect.value;
        const mealsPerDay = parseInt(mealsPerDaySelect.value);
        
        // Ottieni le allergie selezionate
        const selectedAllergies = [];
        for (let checkbox of allergiesCheckboxes) {
            if (checkbox.checked) {
                selectedAllergies.push(checkbox.value);
            }
        }
        
        // Calcola il BMR (Basal Metabolic Rate) usando la formula di Mifflin-St Jeor
        let bmr;
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }
        
        // Calcola il TDEE (Total Daily Energy Expenditure) basato sul livello di attività
        let tdee;
        switch (activityLevel) {
            case 'sedentary':
                tdee = bmr * 1.2;
                break;
            case 'light':
                tdee = bmr * 1.375;
                break;
            case 'moderate':
                tdee = bmr * 1.55;
                break;
            case 'active':
                tdee = bmr * 1.725;
                break;
            case 'extremely':
                tdee = bmr * 1.9;
                break;
            default:
                tdee = bmr * 1.2;
        }
        
        // Aggiusta le calorie basate sull'obiettivo
        let targetCalories;
        switch (goal) {
            case 'fat-loss':
                targetCalories = tdee - 500; // Deficit di 500 calorie per perdere peso
                break;
            case 'muscle-gain':
                targetCalories = tdee + 300; // Surplus di 300 calorie per aumentare di peso
                break;
            case 'maintenance':
                targetCalories = tdee;
                break;
            case 'performance':
                targetCalories = tdee + 200; // Leggero surplus per performance
                break;
            case 'health':
                targetCalories = tdee; // Mantenimento per salute
                break;
            default:
                targetCalories = tdee;
        }
        
        // Assicurati che le calorie non scendano sotto un minimo sano
        const minCalories = gender === 'male' ? 1500 : 1200;
        targetCalories = Math.max(targetCalories, minCalories);
        
        // Calcola la distribuzione dei macronutrienti in base al tipo di dieta
        let proteinPercentage, carbPercentage, fatPercentage;
        
        switch (dietType) {
            case 'standard':
                proteinPercentage = 0.3; // 30% proteine
                carbPercentage = 0.4;    // 40% carboidrati
                fatPercentage = 0.3;     // 30% grassi
                break;
            case 'mediterranean':
                proteinPercentage = 0.25; // 25% proteine
                carbPercentage = 0.5;     // 50% carboidrati
                fatPercentage = 0.25;     // 25% grassi
                break;
            case 'vegetarian':
            case 'vegan':
                proteinPercentage = 0.25; // 25% proteine
                carbPercentage = 0.55;    // 55% carboidrati
                fatPercentage = 0.2;      // 20% grassi
                break;
            case 'pescatarian':
                proteinPercentage = 0.3;  // 30% proteine
                carbPercentage = 0.45;    // 45% carboidrati
                fatPercentage = 0.25;     // 25% grassi
                break;
            case 'paleo':
                proteinPercentage = 0.35; // 35% proteine
                carbPercentage = 0.3;     // 30% carboidrati
                fatPercentage = 0.35;     // 35% grassi
                break;
            case 'keto':
                proteinPercentage = 0.25; // 25% proteine
                carbPercentage = 0.05;    // 5% carboidrati
                fatPercentage = 0.7;      // 70% grassi
                break;
            default:
                proteinPercentage = 0.3;
                carbPercentage = 0.4;
                fatPercentage = 0.3;
        }
        
        // Calcola i grammi di macronutrienti
        // 1g di proteine = 4 calorie, 1g di carboidrati = 4 calorie, 1g di grassi = 9 calorie
        const proteinCalories = targetCalories * proteinPercentage;
        const carbCalories = targetCalories * carbPercentage;
        const fatCalories = targetCalories * fatPercentage;
        
        const proteinGrams = Math.round(proteinCalories / 4);
        const carbGrams = Math.round(carbCalories / 4);
        const fatGrams = Math.round(fatCalories / 9);
        
        // Crea l'oggetto con i macronutrienti target
        const targetMacros = {
            calories: Math.round(targetCalories),
            protein: proteinGrams,
            carbs: carbGrams,
            fat: fatGrams
        };
        
        // Crea l'oggetto preferenze
        const preferences = {
            dietType: dietType,
            allergies: selectedAllergies,
            mealsPerDay: mealsPerDay,
            goal: goal,
            gender: gender,
            age: age,
            weight: weight,
            height: height,
            activityLevel: activityLevel
        };
        
        // Genera il piano alimentare settimanale
        try {
            const weeklyMealPlan = window.mealGenerator.generateWeeklyMealPlan(targetMacros, preferences);
            
            // Restituisci l'oggetto del piano dietetico
            return {
                userInfo: {
                    weight,
                    height,
                    age,
                    gender,
                    activityLevel,
                    goal
                },
                calculatedValues: {
                    bmr: Math.round(bmr),
                    tdee: Math.round(tdee),
                    targetCalories: Math.round(targetCalories)
                },
                macros: targetMacros,
                weeklyPlan: weeklyMealPlan
            };
        } catch (error) {
            console.error('Errore durante la generazione del piano alimentare:', error);
            
            // Restituisci un piano base senza pasti specifici
            return {
                userInfo: {
                    weight,
                    height,
                    age,
                    gender,
                    activityLevel,
                    goal
                },
                calculatedValues: {
                    bmr: Math.round(bmr),
                    tdee: Math.round(tdee),
                    targetCalories: Math.round(targetCalories)
                },
                macros: targetMacros,
                weeklyPlan: null,
                error: 'Impossibile generare un piano alimentare dettagliato. Verifica che il database di alimenti sia caricato correttamente.'
            };
        }
    }
    
    /**
     * Visualizza il piano alimentare calcolato
     * @param {Object} dietPlan - Piano alimentare calcolato
     */
    function displayDietPlan(dietPlan) {
        if (!dietResultDiv) return;
        
        // Pulisci eventuali risultati precedenti
        dietResultDiv.innerHTML = '';
        
        // Crea la sezione di riepilogo
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'summary-section';
        
        // Informazioni generali
        summaryDiv.innerHTML = `
            <h3>Riepilogo</h3>
            <div class="summary-card">
                <div class="summary-item">
                    <span>Metabolismo Basale (BMR):</span>
                    <strong>${dietPlan.calculatedValues.bmr} calorie</strong>
                </div>
                <div class="summary-item">
                    <span>Fabbisogno Energetico (TDEE):</span>
                    <strong>${dietPlan.calculatedValues.tdee} calorie</strong>
                </div>
                <div class="summary-item">
                    <span>Obiettivo Calorico:</span>
                    <strong>${dietPlan.macros.calories} calorie</strong>
                </div>
            </div>
            
            <h3>Distribuzione Macronutrienti</h3>
            <div class="macros-card">
                <div class="macro-item">
                    <div class="macro-icon protein-icon">P</div>
                    <div class="macro-details">
                        <span>Proteine</span>
                        <strong>${dietPlan.macros.protein}g</strong>
                        <small>${Math.round(dietPlan.macros.protein * 4)} calorie</small>
                    </div>
                </div>
                <div class="macro-item">
                    <div class="macro-icon carbs-icon">C</div>
                    <div class="macro-details">
                        <span>Carboidrati</span>
                        <strong>${dietPlan.macros.carbs}g</strong>
                        <small>${Math.round(dietPlan.macros.carbs * 4)} calorie</small>
                    </div>
                </div>
                <div class="macro-item">
                    <div class="macro-icon fat-icon">G</div>
                    <div class="macro-details">
                        <span>Grassi</span>
                        <strong>${dietPlan.macros.fat}g</strong>
                        <small>${Math.round(dietPlan.macros.fat * 9)} calorie</small>
                    </div>
                </div>
            </div>
        `;
        
        dietResultDiv.appendChild(summaryDiv);
        
        // Se non abbiamo un piano alimentare dettagliato, mostriamo un messaggio
        if (!dietPlan.weeklyPlan) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = dietPlan.error || 'Impossibile generare un piano alimentare dettagliato.';
            dietResultDiv.appendChild(errorDiv);
            return;
        }
        
        // Crea la sezione del piano alimentare
        const mealPlanDiv = document.createElement('div');
        mealPlanDiv.className = 'meal-plan-section';
        
        // Intestazione
        mealPlanDiv.innerHTML = `<h3>Piano Alimentare Settimanale</h3>`;
        
        // Crea un tab per ogni giorno della settimana
        const tabsDiv = document.createElement('div');
        tabsDiv.className = 'week-tabs';
        
        // Crea il contenitore per il contenuto dei tab
        const tabContentDiv = document.createElement('div');
        tabContentDiv.className = 'tab-content';
        
        // Per ogni giorno della settimana
        dietPlan.weeklyPlan.days.forEach((day, index) => {
            // Crea il pulsante del tab
            const tabButton = document.createElement('button');
            tabButton.className = 'tab-button' + (index === 0 ? ' active' : '');
            tabButton.textContent = day.dayName;
            tabButton.setAttribute('data-day', index);
            tabButton.onclick = function() {
                // Cambia tab attivo
                document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Mostra il contenuto del tab selezionato
                document.querySelectorAll('.day-plan').forEach(dayPlan => dayPlan.style.display = 'none');
                document.getElementById(`day-${index}`).style.display = 'block';
            };
            tabsDiv.appendChild(tabButton);
            
            // Crea il contenuto del tab
            const dayPlanDiv = document.createElement('div');
            dayPlanDiv.className = 'day-plan';
            dayPlanDiv.id = `day-${index}`;
            dayPlanDiv.style.display = index === 0 ? 'block' : 'none';
            
            // Per ogni pasto del giorno
            day.mealPlan.meals.forEach(meal => {
                const mealDiv = document.createElement('div');
                mealDiv.className = 'meal-card';
                
                // Intestazione del pasto
                const mealHeader = document.createElement('div');
                mealHeader.className = 'meal-header';
                mealHeader.innerHTML = `
                    <h4>${meal.name}</h4>
                    <div class="meal-macros">
                        <span>${meal.actualMacros.calories} kcal</span>
                        <span>P: ${meal.actualMacros.protein}g</span>
                        <span>C: ${meal.actualMacros.carbs}g</span>
                        <span>G: ${meal.actualMacros.fat}g</span>
                    </div>
                `;
                mealDiv.appendChild(mealHeader);
                
                // Lista degli alimenti
                const foodList = document.createElement('ul');
                foodList.className = 'food-list';
                
                meal.foods.forEach(foodItem => {
                    const foodLi = document.createElement('li');
                    foodLi.innerHTML = `
                        <span class="food-name">${foodItem.food.nome}</span>
                        <span class="food-amount">${foodItem.amount}${foodItem.food.categoria === 'Bevande' ? 'ml' : 'g'}</span>
                    `;
                    foodList.appendChild(foodLi);
                });
                
                mealDiv.appendChild(foodList);
                dayPlanDiv.appendChild(mealDiv);
            });
            
            tabContentDiv.appendChild(dayPlanDiv);
        });
        
        mealPlanDiv.appendChild(tabsDiv);
        mealPlanDiv.appendChild(tabContentDiv);
        dietResultDiv.appendChild(mealPlanDiv);
        
        // Aggiungi la sezione con i consigli generali
        const tipsDiv = document.createElement('div');
        tipsDiv.className = 'tips-section';
        tipsDiv.innerHTML = `
            <h3>Consigli Generali</h3>
            <ul class="tips-list">
                <li>Bevi almeno 2 litri di acqua al giorno</li>
                <li>Cerca di mangiare a orari regolari</li>
                <li>Preferisci cibi integrali e non processati</li>
                <li>Limita il consumo di sale e zuccheri aggiunti</li>
                <li>Varia il più possibile gli alimenti per ottenere tutti i nutrienti necessari</li>
            </ul>
        `;
        dietResultDiv.appendChild(tipsDiv);
    }
    
    /**
     * Scarica il piano alimentare come PDF
     */
    function downloadDietPlanAsPDF() {
        // Verifica che sia disponibile il contenuto
        if (!dietResultDiv || dietResultDiv.innerHTML === '') {
            alert('Nessun piano alimentare da scaricare. Genera prima un piano.');
            return;
        }
        
        // Crea un nuovo oggetto html2pdf
        try {
            const element = dietResultDiv;
            const opt = {
                margin: [10, 10, 10, 10],
                filename: 'piano-alimentare.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            
            // Genera il PDF
            html2pdf().set(opt).from(element).save();
            
        } catch (error) {
            console.error('Errore nella generazione del PDF:', error);
            alert('Si è verificato un errore durante la generazione del PDF. Verifica di aver caricato correttamente la libreria html2pdf.');
        }
    }
}); 