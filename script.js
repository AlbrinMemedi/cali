document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('abilities-form');
    const planSection = document.getElementById('plan-section');
    const trainingPlanContainer = document.getElementById('training-plan');
    const downloadPdfBtn = document.getElementById('download-pdf');

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            pullUps: parseInt(document.getElementById('pull-ups').value) || 0,
            pushUps: parseInt(document.getElementById('push-ups').value) || 0,
            dips: parseInt(document.getElementById('dips').value) || 0,
            australianPullUps: parseInt(document.getElementById('australian-pull-ups').value) || 0,
            squats: parseInt(document.getElementById('squats').value) || 0,
            lSit: parseInt(document.getElementById('l-sit').value) || 0,
            goal: document.getElementById('goal').value,
            days: parseInt(document.getElementById('days').value),
            experience: document.getElementById('experience').value,
            equipment: Array.from(document.querySelectorAll('input[name="equipment"]:checked')).map(el => el.value),
            targetSkills: Array.from(document.querySelectorAll('input[name="target-skills"]:checked')).map(el => el.value)
        };
        
        // Generate training plan
        const trainingPlan = generateTrainingPlan(formData);
        
        // Display the training plan
        displayTrainingPlan(trainingPlan);
        
        // Show the plan section
        planSection.classList.remove('hidden');
        
        // Scroll to the plan section
        planSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Handle PDF download
    downloadPdfBtn.addEventListener('click', function() {
        const element = document.getElementById('training-plan');
        const opt = {
            margin: 10,
            filename: 'piano-allenamento-calistenico.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        // Add a title for the PDF
        const title = document.createElement('h1');
        title.textContent = 'Il Tuo Piano di Allenamento Calistenico di 4 Settimane';
        title.style.textAlign = 'center';
        title.style.marginBottom = '20px';
        title.style.color = '#2c3e50';
        element.prepend(title);
        
        // Generate PDF
        html2pdf().set(opt).from(element).save();
        
        // Remove the title after PDF generation
        setTimeout(() => {
            element.removeChild(title);
        }, 100);
    });
    
    // Function to generate the training plan based on user input
    function generateTrainingPlan(data) {
        const plan = {
            weeks: []
        };
        
        // Determine user level based on abilities
        let level = determineUserLevel(data);
        
        // Create 4 weeks of training
        for (let week = 1; week <= 4; week++) {
            const weekPlan = {
                weekNumber: week,
                days: []
            };
            
            // Create training days based on user preference
            const trainingDays = generateTrainingDays(data.days, week, level, data);
            weekPlan.days = trainingDays;
            
            plan.weeks.push(weekPlan);
        }
        
        return plan;
    }
    
    // Function to determine user level based on abilities
    function determineUserLevel(data) {
        // Basic scoring system
        let score = 0;
        
        // Pull-ups scoring
        if (data.pullUps >= 15) score += 5;
        else if (data.pullUps >= 10) score += 4;
        else if (data.pullUps >= 5) score += 3;
        else if (data.pullUps >= 1) score += 2;
        
        // Push-ups scoring
        if (data.pushUps >= 50) score += 5;
        else if (data.pushUps >= 30) score += 4;
        else if (data.pushUps >= 15) score += 3;
        else if (data.pushUps >= 5) score += 2;
        
        // Dips scoring
        if (data.dips >= 15) score += 5;
        else if (data.dips >= 10) score += 4;
        else if (data.dips >= 5) score += 3;
        else if (data.dips >= 1) score += 2;
        
        // Australian pull-ups scoring
        if (data.australianPullUps >= 20) score += 5;
        else if (data.australianPullUps >= 15) score += 4;
        else if (data.australianPullUps >= 10) score += 3;
        else if (data.australianPullUps >= 5) score += 2;
        
        // Squats scoring
        if (data.squats >= 50) score += 5;
        else if (data.squats >= 30) score += 4;
        else if (data.squats >= 15) score += 3;
        else if (data.squats >= 5) score += 2;
        
        // L-sit scoring
        if (data.lSit >= 30) score += 5;
        else if (data.lSit >= 20) score += 4;
        else if (data.lSit >= 10) score += 3;
        else if (data.lSit >= 5) score += 2;
        
        // Consider experience level
        if (data.experience === 'advanced') score += 5;
        else if (data.experience === 'intermediate') score += 3;
        
        // Determine level based on score
        if (score >= 25) return 'advanced';
        else if (score >= 15) return 'intermediate';
        else return 'beginner';
    }
    
    // Function to generate training days
    function generateTrainingDays(numDays, weekNumber, level, userData) {
        const days = [];
        const daysOfWeek = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
        
        // Determine workout split based on number of training days
        let split;
        if (numDays === 3) {
            split = ['full-body', 'rest', 'full-body', 'rest', 'full-body', 'rest', 'rest'];
        } else if (numDays === 4) {
            split = ['upper', 'lower', 'rest', 'upper', 'lower', 'rest', 'rest'];
        } else if (numDays === 5) {
            split = ['push', 'pull', 'legs', 'rest', 'push', 'pull', 'rest'];
        } else if (numDays === 6) {
            split = ['push', 'pull', 'legs', 'push', 'pull', 'legs', 'rest'];
        }
        
        // Generate each day's workout
        for (let i = 0; i < 7; i++) {
            const day = {
                name: daysOfWeek[i],
                type: split[i],
                exercises: []
            };
            
            // If it's a rest day
            if (split[i] === 'rest') {
                day.isRest = true;
            } else {
                // Generate exercises based on the day type and user level
                day.exercises = generateExercises(split[i], level, weekNumber, userData);
            }
            
            days.push(day);
        }
        
        return days;
    }
    
    // Function to generate exercises for a specific day
    function generateExercises(dayType, level, weekNumber, userData) {
        const exercises = [];
        const progressionFactor = 1 + (weekNumber - 1) * 0.1; // 10% progression per week
        
        // Exercise database
        const exerciseDB = {
            // Push exercises
            push: [
                { name: 'Piegamenti', beginner: '3x10', intermediate: '4x12', advanced: '5x15' },
                { name: 'Dip', beginner: '3x6', intermediate: '4x10', advanced: '5x12' },
                { name: 'Piegamenti Pike', beginner: '3x6', intermediate: '4x10', advanced: '4x12' },
                { name: 'Piegamenti a Diamante', beginner: '3x6', intermediate: '3x10', advanced: '4x12' },
                { name: 'Piegamenti in Declino', beginner: '3x10', intermediate: '4x12', advanced: '4x15' },
                { name: 'Verticale Contro il Muro', beginner: '3x20s', intermediate: '3x30s', advanced: '3x45s' },
                { name: 'Piegamenti Pseudo Planche', beginner: '3x6', intermediate: '3x10', advanced: '4x10' }
            ],
            
            // Pull exercises
            pull: [
                { name: 'Trazioni', beginner: '3x4', intermediate: '4x6', advanced: '5x10' },
                { name: 'Trazioni Australiane', beginner: '3x10', intermediate: '4x12', advanced: '4x18' },
                { name: 'Trazioni Negative', beginner: '3x6', intermediate: '4x9', advanced: '4x11' },
                { name: 'Scapular Pulls', beginner: '3x10', intermediate: '3x14', advanced: '3x18' },
                { name: 'Rematore Inverso', beginner: '3x10', intermediate: '4x12', advanced: '4x18' },
                { name: 'Trazioni Supine', beginner: '3x4', intermediate: '4x6', advanced: '5x10' },
                { name: 'Sollevamento Gambe in Sospensione', beginner: '3x9', intermediate: '3x12', advanced: '4x14' }
            ],
            
            // Legs exercises
            legs: [
                { name: 'Squat a Corpo Libero', beginner: '3x18', intermediate: '4x22', advanced: '5x28' },
                { name: 'Affondi', beginner: '3x11 per gamba', intermediate: '4x14 per gamba', advanced: '4x18 per gamba' },
                { name: 'Split Squat Bulgaro', beginner: '3x9 per gamba', intermediate: '3x11 per gamba', advanced: '4x14 per gamba' },
                { name: 'Ponte Glutei', beginner: '3x18', intermediate: '3x22', advanced: '4x22' },
                { name: 'Sollevamento Polpacci', beginner: '3x18', intermediate: '4x22', advanced: '4x28' },
                { name: 'Squat con Salto', beginner: '3x11', intermediate: '3x14', advanced: '4x18' },
                { name: 'Wall Sit', beginner: '3x30s', intermediate: '3x45s', advanced: '3x60s' }
            ],
            
            // Core exercises
            core: [
                { name: 'Plank', beginner: '3x30s', intermediate: '3x45s', advanced: '3x60s' },
                { name: 'Hollow Body Hold', beginner: '3x20s', intermediate: '3x30s', advanced: '3x45s' },
                { name: 'Russian Twist', beginner: '3x12 per lato', intermediate: '3x18 per lato', advanced: '3x22 per lato' },
                { name: 'Mountain Climber', beginner: '3x30s', intermediate: '3x45s', advanced: '3x60s' },
                { name: 'Sollevamento Gambe', beginner: '3x10', intermediate: '3x14', advanced: '4x18' },
                { name: 'L-Sit', beginner: '3x10s', intermediate: '3x20s', advanced: '3x30s' },
                { name: 'Crunch Bicicletta', beginner: '3x18', intermediate: '3x22', advanced: '3x28' }
            ],
            
            // Skill work
            skill: {
                'muscle-up': [
                    { name: 'Trazioni Esplosive', sets: '3x6' },
                    { name: 'Dip Profondi', sets: '3x10' },
                    { name: 'Pratica di Transizione', sets: '3x4' },
                    { name: 'Sospensione con False Grip', sets: '3x25s' }
                ],
                'handstand': [
                    { name: 'Verticale Contro il Muro', sets: '3x45s' },
                    { name: 'Tap di Spalle in Verticale', sets: '3x6 per lato' },
                    { name: 'Piegamenti Pike', sets: '3x10' },
                    { name: 'Posizione del Corvo', sets: '3x25s' }
                ],
                'front-lever': [
                    { name: 'Tuck Front Lever', sets: '3x15s' },
                    { name: 'Front Lever Raises', sets: '3x6' },
                    { name: 'Scapular Pull-ups', sets: '3x10' },
                    { name: 'Hollow Body Hold', sets: '3x38s' }
                ],
                'planche': [
                    { name: 'Planche Lean', sets: '3x12s' },
                    { name: 'Tuck Planche', sets: '3x15s' },
                    { name: 'Piegamenti Pseudo Planche', sets: '3x10' },
                    { name: 'Piegamenti Pike Elevati', sets: '3x10' }
                ],
                'human-flag': [
                    { name: 'Side Plank', sets: '3x38s per lato' },
                    { name: 'Sollevamento Gambe Laterale in Sospensione', sets: '3x10 per lato' },
                    { name: 'Tuck Human Flag', sets: '3x12s' },
                    { name: 'Pull Laterali alla Sbarra', sets: '3x10 per lato' }
                ],
                'pistol-squat': [
                    { name: 'Pistol Squat Assistiti', sets: '3x6 per gamba' },
                    { name: 'Box Squat Monolaterale', sets: '3x9 per gamba' },
                    { name: 'Pistol Squat Negativi', sets: '3x6 per gamba' },
                    { name: 'Mobilità Caviglia', sets: '3x30s per gamba' }
                ]
            }
        };
        
        // Select exercises based on day type
        if (dayType === 'full-body') {
            // Add 2 push exercises
            addRandomExercises(exercises, exerciseDB.push, 2, level, progressionFactor);
            
            // Add 2 pull exercises
            addRandomExercises(exercises, exerciseDB.pull, 2, level, progressionFactor);
            
            // Add 1-2 legs exercises
            addRandomExercises(exercises, exerciseDB.legs, 2, level, progressionFactor);
            
            // Add 1-2 core exercises
            addRandomExercises(exercises, exerciseDB.core, 1, level, progressionFactor);
            
        } else if (dayType === 'upper') {
            // Add 3 push exercises
            addRandomExercises(exercises, exerciseDB.push, 3, level, progressionFactor);
            
            // Add 3 pull exercises
            addRandomExercises(exercises, exerciseDB.pull, 3, level, progressionFactor);
            
            // Add 1 core exercise
            addRandomExercises(exercises, exerciseDB.core, 1, level, progressionFactor);
            
        } else if (dayType === 'lower') {
            // Add 4 legs exercises
            addRandomExercises(exercises, exerciseDB.legs, 4, level, progressionFactor);
            
            // Add 2 core exercises
            addRandomExercises(exercises, exerciseDB.core, 2, level, progressionFactor);
            
        } else if (dayType === 'push') {
            // Add 4-5 push exercises
            addRandomExercises(exercises, exerciseDB.push, 4, level, progressionFactor);
            
            // Add 1 core exercise
            addRandomExercises(exercises, exerciseDB.core, 1, level, progressionFactor);
            
        } else if (dayType === 'pull') {
            // Add 4-5 pull exercises
            addRandomExercises(exercises, exerciseDB.pull, 4, level, progressionFactor);
            
            // Add 1 core exercise
            addRandomExercises(exercises, exerciseDB.core, 1, level, progressionFactor);
            
        } else if (dayType === 'legs') {
            // Add 4-5 legs exercises
            addRandomExercises(exercises, exerciseDB.legs, 4, level, progressionFactor);
            
            // Add 1-2 core exercises
            addRandomExercises(exercises, exerciseDB.core, 2, level, progressionFactor);
        }
        
        // Add skill work if user selected any target skills
        if (userData.targetSkills && userData.targetSkills.length > 0) {
            // Choose one skill to focus on for this day
            const skillIndex = (weekNumber + dayType.charCodeAt(0)) % userData.targetSkills.length;
            const skill = userData.targetSkills[skillIndex];
            
            if (exerciseDB.skill[skill]) {
                // Add 2 skill exercises for the selected skill
                const skillExercises = exerciseDB.skill[skill];
                const numSkillExercises = Math.min(2, skillExercises.length);
                
                for (let i = 0; i < numSkillExercises; i++) {
                    const exerciseIndex = (i + weekNumber) % skillExercises.length;
                    exercises.push({
                        name: skillExercises[exerciseIndex].name,
                        sets: skillExercises[exerciseIndex].sets,
                        isSkillWork: true
                    });
                }
            }
        }
        
        return exercises;
    }
    
    // Helper function to add random exercises from a category
    function addRandomExercises(targetArray, sourceArray, count, level, progressionFactor) {
        // Create a copy of the source array to avoid modifying it
        const availableExercises = [...sourceArray];
        
        // Shuffle the array
        shuffleArray(availableExercises);
        
        // Add the specified number of exercises
        for (let i = 0; i < Math.min(count, availableExercises.length); i++) {
            const exercise = availableExercises[i];
            let sets;
            let pausaBetweenSets;
            
            // Get the appropriate sets/reps based on user level
            if (level === 'beginner') {
                sets = exercise.beginner;
                pausaBetweenSets = '60s';
            } else if (level === 'intermediate') {
                sets = exercise.intermediate;
                pausaBetweenSets = '90s';
            } else {
                sets = exercise.advanced;
                pausaBetweenSets = '120s';
            }
            
            // Apply progression factor for weeks 2-4
            if (progressionFactor > 1 && sets) {
                // Parse the sets format (e.g., "3x8-12")
                const setsParts = sets.split('x');
                if (setsParts.length === 2) {
                    const numSets = parseInt(setsParts[0]);
                    
                    // Check if it's a time-based exercise (e.g., "3x30s")
                    if (setsParts[1].includes('s')) {
                        const seconds = parseInt(setsParts[1]);
                        const newSeconds = Math.round(seconds * progressionFactor);
                        sets = `${numSets}x${newSeconds}s`;
                    } 
                    // Check if it's a range (e.g., "3x8-12")
                    else if (setsParts[1].includes('-')) {
                        const repRange = setsParts[1].split('-');
                        const minReps = parseInt(repRange[0]);
                        const maxReps = parseInt(repRange[1]);
                        // Use the average value of the range as a single number
                        const singleRep = Math.round((minReps + maxReps) / 2 * progressionFactor);
                        sets = `${numSets}x${singleRep}`;
                    }
                    // Single rep count (e.g., "3x8")
                    else {
                        const reps = parseInt(setsParts[1]);
                        const newReps = Math.round(reps * progressionFactor);
                        sets = `${numSets}x${newReps}`;
                    }
                }
            } else if (sets && sets.includes('-')) {
                // Convert ranges to single values even without progression factor
                const setsParts = sets.split('x');
                if (setsParts.length === 2 && setsParts[1].includes('-')) {
                    const numSets = parseInt(setsParts[0]);
                    const repRange = setsParts[1].split('-');
                    const minReps = parseInt(repRange[0]);
                    const maxReps = parseInt(repRange[1]);
                    // Use the average value of the range
                    const singleRep = Math.round((minReps + maxReps) / 2);
                    sets = `${numSets}x${singleRep}`;
                }
            }
            
            targetArray.push({
                name: exercise.name,
                sets: sets,
                pausaBetweenSets: pausaBetweenSets
            });
        }
        
        // Add pause between exercises if there are exercises
        if (targetArray.length > 0) {
            let pausaBetweenExercises;
            if (level === 'beginner') {
                pausaBetweenExercises = '120s';
            } else if (level === 'intermediate') {
                pausaBetweenExercises = '150s';
            } else {
                pausaBetweenExercises = '180s';
            }
            
            // Add pause information to the last added exercise
            targetArray[targetArray.length - 1].pausaBetweenExercises = pausaBetweenExercises;
        }
    }
    
    // Helper function to shuffle an array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    // Function to display the training plan
    function displayTrainingPlan(plan) {
        trainingPlanContainer.innerHTML = '';
        
        // Create elements for each week
        plan.weeks.forEach(week => {
            const weekContainer = document.createElement('div');
            weekContainer.className = 'week-container';
            
            // Week header
            const weekHeader = document.createElement('div');
            weekHeader.className = 'week-header';
            weekHeader.textContent = `Settimana ${week.weekNumber}`;
            weekContainer.appendChild(weekHeader);
            
            // Create elements for each day
            week.days.forEach(day => {
                const dayContainer = document.createElement('div');
                dayContainer.className = 'day-container';
                
                // Day header
                const dayHeader = document.createElement('div');
                dayHeader.className = 'day-header';
                dayHeader.textContent = day.name;
                if (!day.isRest) {
                    dayHeader.textContent += ` - Allenamento ${translateWorkoutType(day.type)}`;
                }
                dayContainer.appendChild(dayHeader);
                
                // If it's a rest day
                if (day.isRest) {
                    const restDay = document.createElement('div');
                    restDay.className = 'rest-day';
                    restDay.textContent = 'Giorno di Riposo - Concentrati sul recupero, mobilità e stretching leggero.';
                    dayContainer.appendChild(restDay);
                } else {
                    // Create elements for each exercise
                    day.exercises.forEach((exercise, index) => {
                        const exerciseElement = document.createElement('div');
                        exerciseElement.className = 'exercise';
                        if (exercise.isSkillWork) {
                            exerciseElement.classList.add('skill-work');
                        }
                        
                        const exerciseName = document.createElement('div');
                        exerciseName.className = 'exercise-name';
                        exerciseName.textContent = exercise.name;
                        exerciseElement.appendChild(exerciseName);
                        
                        const exerciseSets = document.createElement('div');
                        exerciseSets.className = 'exercise-sets';
                        exerciseSets.textContent = exercise.sets;
                        exerciseElement.appendChild(exerciseSets);
                        
                        // Add pause information between sets
                        if (exercise.pausaBetweenSets) {
                            const pausaBetweenSets = document.createElement('div');
                            pausaBetweenSets.className = 'pausa-between-sets';
                            pausaBetweenSets.innerHTML = `<i class="fas fa-hourglass-half"></i> Pausa tra le serie: ${exercise.pausaBetweenSets}`;
                            exerciseElement.appendChild(pausaBetweenSets);
                        }
                        
                        // Add pause information between exercises
                        if (exercise.pausaBetweenExercises) {
                            const pausaBetweenExercises = document.createElement('div');
                            pausaBetweenExercises.className = 'pausa-between-exercises';
                            pausaBetweenExercises.innerHTML = `<i class="fas fa-stopwatch"></i> Pausa prima del prossimo esercizio: ${exercise.pausaBetweenExercises}`;
                            exerciseElement.appendChild(pausaBetweenExercises);
                        }
                        
                        dayContainer.appendChild(exerciseElement);
                    });
                    
                    // Add notes for skill work if present
                    const skillWorkExercises = day.exercises.filter(ex => ex.isSkillWork);
                    if (skillWorkExercises.length > 0) {
                        const notes = document.createElement('div');
                        notes.className = 'notes';
                        
                        const notesHeader = document.createElement('h4');
                        notesHeader.textContent = 'Note sul Lavoro di Abilità';
                        notes.appendChild(notesHeader);
                        
                        const notesPara = document.createElement('p');
                        notesPara.textContent = 'Esegui il lavoro di abilità all\'inizio dell\'allenamento quando sei fresco. Concentrati sulla qualità piuttosto che sulla quantità. Riposa 2-3 minuti tra le serie di lavoro di abilità.';
                        notes.appendChild(notesPara);
                        
                        dayContainer.appendChild(notes);
                    }
                }
                
                weekContainer.appendChild(dayContainer);
            });
            
            trainingPlanContainer.appendChild(weekContainer);
        });
        
        // Add general notes and recommendations
        const notesSection = document.createElement('div');
        notesSection.className = 'notes';
        
        const notesHeader = document.createElement('h4');
        notesHeader.textContent = 'Note e Raccomandazioni di Allenamento';
        notesSection.appendChild(notesHeader);
        
        const notesList = document.createElement('ul');
        
        const notes = [
            'Riscaldati adeguatamente prima di ogni allenamento con 5-10 minuti di cardio leggero e stretching dinamico.',
            'Rispetta le pause indicate tra le serie e gli esercizi per un recupero ottimale.',
            'Concentrati sulla corretta esecuzione piuttosto che su ripetizioni più alte o progressioni più difficili.',
            'Se puoi completare facilmente tutte le ripetizioni con buona forma, considera di passare a una progressione più difficile.',
            'Mantieniti idratato e assicurati un adeguato apporto di proteine per il recupero.',
            'Dormi 7-9 ore a notte per un recupero e un progresso ottimali.',
            'Dopo aver completato questo piano di 4 settimane, prendi una settimana di scarico con volume ridotto prima di iniziare un nuovo programma.'
        ];
        
        notes.forEach(note => {
            const noteItem = document.createElement('li');
            noteItem.textContent = note;
            notesList.appendChild(noteItem);
        });
        
        notesSection.appendChild(notesList);
        trainingPlanContainer.appendChild(notesSection);
    }
    
    // Helper function to translate workout types to Italian
    function translateWorkoutType(type) {
        const translations = {
            'full-body': 'Corpo Completo',
            'upper': 'Parte Superiore',
            'lower': 'Parte Inferiore',
            'push': 'Spinta',
            'pull': 'Trazione',
            'legs': 'Gambe'
        };
        
        return translations[type] || type;
    }
    
    // Helper function to capitalize the first letter of a string
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}); 