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
        displayTrainingPlan(trainingPlan, formData);
        
        // Show the plan section
        planSection.classList.remove('hidden');
        
        // Scroll to the plan section
        planSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Handle PDF download
    downloadPdfBtn.addEventListener('click', function() {
        // Mostra un messaggio di caricamento
        const loadingMessage = document.createElement('div');
        loadingMessage.id = 'pdf-loading-message';
        loadingMessage.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparazione del PDF in corso...';
        loadingMessage.style.position = 'fixed';
        loadingMessage.style.top = '50%';
        loadingMessage.style.left = '50%';
        loadingMessage.style.transform = 'translate(-50%, -50%)';
        loadingMessage.style.padding = '20px';
        loadingMessage.style.backgroundColor = 'rgba(0,0,0,0.7)';
        loadingMessage.style.color = 'white';
        loadingMessage.style.borderRadius = '5px';
        loadingMessage.style.zIndex = '9999';
        document.body.appendChild(loadingMessage);

        // Get the element to convert
        const element = document.getElementById('training-plan');
        
        // Opzioni ottimizzate per dispositivi mobili
        const opt = {
            margin: [10, 10, 10, 10],
            filename: 'piano-allenamento-calistenico.pdf',
            image: { type: 'jpeg', quality: 0.95 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                logging: false,
                letterRendering: true,
                allowTaint: false
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait',
                compress: true
            }
        };
        
        // Add a title for the PDF
        const title = document.createElement('h1');
        title.textContent = 'Il Tuo Piano di Allenamento Calistenico di 4 Settimane';
        title.style.textAlign = 'center';
        title.style.marginBottom = '20px';
        title.style.color = '#2c3e50';
        element.prepend(title);
        
        // Per dispositivi mobili, dividiamo il processo in passaggi per migliorare le prestazioni
        const worker = html2pdf()
            .set(opt)
            .from(element)
            .toPdf()
            .get('pdf')
            .then((pdf) => {
                const totalPages = pdf.internal.getNumberOfPages();
                
                // Ottimizza ogni pagina
                for (let i = 1; i <= totalPages; i++) {
                    pdf.setPage(i);
                    pdf.setFontSize(10);
                    pdf.setTextColor(150);
                    pdf.text('Pagina ' + i + ' di ' + totalPages, pdf.internal.pageSize.getWidth() - 30, pdf.internal.pageSize.getHeight() - 10);
                }
                
                return pdf;
            })
            .save()
            .then(() => {
                // Rimuovi il messaggio di caricamento dopo il completamento
                document.body.removeChild(loadingMessage);
                
                // Rimuovi il titolo dopo il completamento
                setTimeout(() => {
                    element.removeChild(title);
                }, 100);
            })
            .catch(err => {
                console.error('Errore durante la generazione del PDF:', err);
                // Mostra un messaggio di errore
                loadingMessage.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Errore durante la generazione del PDF. Riprova più tardi.';
                loadingMessage.style.backgroundColor = 'rgba(220,53,69,0.9)';
                
                // Rimuovi il messaggio dopo 3 secondi
                setTimeout(() => {
                    if (document.body.contains(loadingMessage)) {
                        document.body.removeChild(loadingMessage);
                    }
                    if (element.contains(title)) {
                        element.removeChild(title);
                    }
                }, 3000);
            });
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
        // Detailed scoring system
        let score = 0;
        let subLevel = '';
        
        // For very weak users we need special handling
        let isVeryWeak = 
            data.pullUps < 1 && 
            data.pushUps < 5 && 
            data.dips < 1 && 
            data.australianPullUps < 5 && 
            data.squats < 5 && 
            data.lSit < 5;
        
        // Pull-ups scoring (maximum possible: 5 points)
        if (data.pullUps >= 15) score += 5;
        else if (data.pullUps >= 10) score += 4;
        else if (data.pullUps >= 5) score += 3;
        else if (data.pullUps >= 2) score += 2;
        else if (data.pullUps >= 1) score += 1;
        
        // Push-ups scoring (maximum possible: 5 points)
        if (data.pushUps >= 50) score += 5;
        else if (data.pushUps >= 30) score += 4;
        else if (data.pushUps >= 15) score += 3;
        else if (data.pushUps >= 8) score += 2;
        else if (data.pushUps >= 3) score += 1;
        
        // Dips scoring (maximum possible: 5 points)
        if (data.dips >= 15) score += 5;
        else if (data.dips >= 10) score += 4;
        else if (data.dips >= 5) score += 3;
        else if (data.dips >= 3) score += 2;
        else if (data.dips >= 1) score += 1;
        
        // Australian pull-ups scoring (maximum possible: 5 points)
        if (data.australianPullUps >= 20) score += 5;
        else if (data.australianPullUps >= 15) score += 4;
        else if (data.australianPullUps >= 10) score += 3;
        else if (data.australianPullUps >= 5) score += 2;
        else if (data.australianPullUps >= 2) score += 1;
        
        // Squats scoring (maximum possible: 5 points)
        if (data.squats >= 50) score += 5;
        else if (data.squats >= 30) score += 4;
        else if (data.squats >= 15) score += 3;
        else if (data.squats >= 8) score += 2;
        else if (data.squats >= 3) score += 1;
        
        // L-sit scoring (maximum possible: 5 points)
        if (data.lSit >= 30) score += 5;
        else if (data.lSit >= 20) score += 4;
        else if (data.lSit >= 10) score += 3;
        else if (data.lSit >= 5) score += 2;
        else if (data.lSit >= 2) score += 1;
        
        // Consider experience level
        if (data.experience === 'advanced') score += 5;
        else if (data.experience === 'intermediate') score += 3;
        else if (data.experience === 'beginner') score += 1;
        
        // Determine level based on score
        // Maximum possible score: 35 points
        if (score >= 25) return 'advanced';
        else if (score >= 18) return 'intermediate';
        else if (isVeryWeak) return 'novice';
        else if (score >= 12) return 'beginner-high';
        else if (score >= 7) return 'beginner-medium';
        else if (score >= 3) return 'beginner-low';
        else return 'novice';
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
                { 
                    name: 'Piegamenti', 
                    novice: '2x3 (contro il muro)',
                    'beginner-low': '2x5 (contro il muro)', 
                    'beginner-medium': '3x6 (sulle ginocchia)', 
                    'beginner-high': '3x8',
                    intermediate: '4x12', 
                    advanced: '5x15' 
                },
                { 
                    name: 'Dip', 
                    novice: '2x3 (dip assistiti con i piedi a terra)',
                    'beginner-low': '2x4 (dip assistiti con i piedi a terra)', 
                    'beginner-medium': '2x5 (dip assistiti con elastico)', 
                    'beginner-high': '3x4',
                    intermediate: '4x10', 
                    advanced: '5x12' 
                },
                { 
                    name: 'Piegamenti Pike', 
                    novice: '2x3 (pike leggero)',
                    'beginner-low': '2x4 (pike leggero)', 
                    'beginner-medium': '3x4 (pike moderato)', 
                    'beginner-high': '3x5',
                    intermediate: '4x10', 
                    advanced: '4x12' 
                },
                { 
                    name: 'Piegamenti a Diamante', 
                    novice: '2x3 (mani più larghe, sulle ginocchia)',
                    'beginner-low': '2x4 (mani più larghe, sulle ginocchia)', 
                    'beginner-medium': '2x5 (sulle ginocchia)', 
                    'beginner-high': '3x5',
                    intermediate: '3x10', 
                    advanced: '4x12' 
                },
                { 
                    name: 'Piegamenti in Declino', 
                    novice: '2x3 (piedi a terra, rialzo basso per le mani)',
                    'beginner-low': '2x5 (piedi a terra, rialzo basso per le mani)', 
                    'beginner-medium': '3x6 (sulle ginocchia, rialzo basso per le mani)', 
                    'beginner-high': '3x8',
                    intermediate: '4x12', 
                    advanced: '4x15' 
                },
                { 
                    name: 'Verticale Contro il Muro', 
                    novice: '2x10s (piedi contro il muro, in posizione di plank)',
                    'beginner-low': '2x15s (piedi contro il muro, in posizione di plank)', 
                    'beginner-medium': '3x15s (piedi contro il muro, bacino sollevato)', 
                    'beginner-high': '3x20s',
                    intermediate: '3x30s', 
                    advanced: '3x45s' 
                },
                { 
                    name: 'Piegamenti Pseudo Planche', 
                    novice: '2x3 (mani avanzate leggere, sulle ginocchia)',
                    'beginner-low': '2x4 (mani avanzate leggere, sulle ginocchia)', 
                    'beginner-medium': '3x4 (mani avanzate moderate, sulle ginocchia)', 
                    'beginner-high': '3x5',
                    intermediate: '3x10', 
                    advanced: '4x10' 
                }
            ],
            
            // Pull exercises
            pull: [
                { 
                    name: 'Trazioni', 
                    novice: '2x3 (trazioni negative molto assistite)',
                    'beginner-low': '2x3 (trazioni negative assistite)', 
                    'beginner-medium': '3x3 (trazioni negative)', 
                    'beginner-high': '3x3',
                    intermediate: '4x6', 
                    advanced: '5x10' 
                },
                { 
                    name: 'Trazioni Australiane', 
                    novice: '2x5 (inclinate alte, quasi in piedi)',
                    'beginner-low': '2x6 (inclinate alte)', 
                    'beginner-medium': '3x7 (inclinate moderate)', 
                    'beginner-high': '3x8',
                    intermediate: '4x12', 
                    advanced: '4x18' 
                },
                { 
                    name: 'Trazioni Negative', 
                    novice: '2x3 (molto lente, assistite con piedi)',
                    'beginner-low': '2x4 (molto lente, assistite con piedi)', 
                    'beginner-medium': '3x4 (lente, leggera assistenza)', 
                    'beginner-high': '3x5',
                    intermediate: '4x9', 
                    advanced: '4x11' 
                },
                { 
                    name: 'Scapular Pulls', 
                    novice: '2x5 (in piedi, con elastico)',
                    'beginner-low': '2x7 (in piedi, con elastico)', 
                    'beginner-medium': '3x8 (sospesi, con piedi a terra)', 
                    'beginner-high': '3x8',
                    intermediate: '3x14', 
                    advanced: '3x18' 
                },
                { 
                    name: 'Rematore Inverso', 
                    novice: '2x6 (posizione alta)',
                    'beginner-low': '2x8 (posizione alta)', 
                    'beginner-medium': '3x8 (posizione moderata)', 
                    'beginner-high': '3x10',
                    intermediate: '4x12', 
                    advanced: '4x18' 
                },
                { 
                    name: 'Trazioni Supine', 
                    novice: '2x3 (posizione alta)',
                    'beginner-low': '2x3 (posizione moderata)', 
                    'beginner-medium': '3x3 (posizione bassa)', 
                    'beginner-high': '3x4',
                    intermediate: '4x6', 
                    advanced: '5x10' 
                },
                { 
                    name: 'Sollevamento Gambe in Sospensione', 
                    novice: '2x6 (piega ginocchia)',
                    'beginner-low': '2x7 (piega ginocchia)', 
                    'beginner-medium': '3x8 (piega leggera ginocchia)', 
                    'beginner-high': '3x8',
                    intermediate: '3x12', 
                    advanced: '4x14' 
                }
            ],
            
            // Legs exercises
            legs: [
                { 
                    name: 'Squat a Corpo Libero', 
                    novice: '2x8 (squat parziali, con supporto)',
                    'beginner-low': '2x10 (squat parziali)', 
                    'beginner-medium': '3x12 (squat completi)', 
                    'beginner-high': '3x15',
                    intermediate: '4x22', 
                    advanced: '5x28' 
                },
                { 
                    name: 'Affondi', 
                    novice: '2x5 per gamba (affondi statici leggeri)',
                    'beginner-low': '2x6 per gamba (affondi statici)', 
                    'beginner-medium': '3x8 per gamba (affondi dinamici corta distanza)', 
                    'beginner-high': '3x10 per gamba',
                    intermediate: '4x14 per gamba', 
                    advanced: '4x18 per gamba' 
                },
                { 
                    name: 'Split Squat Bulgaro', 
                    novice: '2x5 per gamba (piede posteriore su rialzo basso)',
                    'beginner-low': '2x6 per gamba (piede posteriore su rialzo basso)', 
                    'beginner-medium': '3x7 per gamba (piede posteriore su rialzo medio)', 
                    'beginner-high': '3x8 per gamba',
                    intermediate: '3x11 per gamba', 
                    advanced: '4x14 per gamba' 
                },
                { 
                    name: 'Ponte Glutei', 
                    novice: '2x10 (piedi più vicini al corpo)',
                    'beginner-low': '2x12 (piedi più vicini al corpo)', 
                    'beginner-medium': '3x14 (piedi in posizione standard)', 
                    'beginner-high': '3x15',
                    intermediate: '3x22', 
                    advanced: '4x22' 
                },
                { 
                    name: 'Sollevamento Polpacci', 
                    novice: '2x10 (con supporto)',
                    'beginner-low': '2x12 (con leggero supporto)', 
                    'beginner-medium': '3x15 (senza supporto)', 
                    'beginner-high': '3x15',
                    intermediate: '4x22', 
                    advanced: '4x28' 
                },
                { 
                    name: 'Squat con Salto', 
                    novice: '2x5 (mini squat, mini salto)',
                    'beginner-low': '2x6 (mini squat, mini salto)', 
                    'beginner-medium': '3x8 (salto leggero)', 
                    'beginner-high': '3x10',
                    intermediate: '3x14', 
                    advanced: '4x18' 
                },
                { 
                    name: 'Wall Sit', 
                    novice: '2x15s (posizione alta, non completamente seduto)',
                    'beginner-low': '2x20s (posizione alta)', 
                    'beginner-medium': '3x20s (posizione standard)', 
                    'beginner-high': '3x25s',
                    intermediate: '3x45s', 
                    advanced: '3x60s' 
                }
            ],
            
            // Core exercises
            core: [
                { 
                    name: 'Plank', 
                    novice: '2x15s (plank su ginocchia)',
                    'beginner-low': '2x20s (plank su ginocchia)', 
                    'beginner-medium': '3x20s (plank standard)', 
                    'beginner-high': '3x25s',
                    intermediate: '3x45s', 
                    advanced: '3x60s' 
                },
                { 
                    name: 'Hollow Body Hold', 
                    novice: '2x10s (ginocchia piegate)',
                    'beginner-low': '2x15s (ginocchia piegate)', 
                    'beginner-medium': '3x15s (una gamba estesa)', 
                    'beginner-high': '3x15s',
                    intermediate: '3x30s', 
                    advanced: '3x45s' 
                },
                { 
                    name: 'Russian Twist', 
                    novice: '2x8 per lato (piedi a terra)',
                    'beginner-low': '2x10 per lato (piedi a terra)', 
                    'beginner-medium': '3x10 per lato (piedi sollevati)', 
                    'beginner-high': '3x10 per lato',
                    intermediate: '3x18 per lato', 
                    advanced: '3x22 per lato' 
                },
                { 
                    name: 'Mountain Climber', 
                    novice: '2x15s (ritmo lento)',
                    'beginner-low': '2x20s (ritmo lento)', 
                    'beginner-medium': '3x20s (ritmo moderato)', 
                    'beginner-high': '3x25s',
                    intermediate: '3x45s', 
                    advanced: '3x60s' 
                },
                { 
                    name: 'Sollevamento Gambe', 
                    novice: '2x6 (ginocchia piegate)',
                    'beginner-low': '2x8 (ginocchia piegate)', 
                    'beginner-medium': '3x8 (ginocchia leggermente piegate)', 
                    'beginner-high': '3x9',
                    intermediate: '3x14', 
                    advanced: '4x18' 
                },
                { 
                    name: 'L-Sit', 
                    novice: '2x5s (ginocchia piegate, piedi a terra)',
                    'beginner-low': '2x8s (ginocchia piegate, piedi a terra)', 
                    'beginner-medium': '3x8s (una gamba estesa, su supporti)', 
                    'beginner-high': '3x8s',
                    intermediate: '3x20s', 
                    advanced: '3x30s' 
                },
                { 
                    name: 'Crunch Bicicletta', 
                    novice: '2x10 (ritmo lento)',
                    'beginner-low': '2x12 (ritmo lento)', 
                    'beginner-medium': '3x15 (ritmo moderato)', 
                    'beginner-high': '3x15',
                    intermediate: '3x22', 
                    advanced: '3x28' 
                }
            ],
            
            // Skill work
            skill: {
                'muscle-up': [
                    { 
                        name: 'Trazioni Esplosive', 
                        novice: '2x3 (assistite con elastico forte)',
                        'beginner-low': '2x4 (assistite con elastico)', 
                        'beginner-medium': '3x4 (assistite con elastico leggero)', 
                        sets: '3x6' 
                    },
                    { 
                        name: 'Dip Profondi', 
                        novice: '2x4 (assistiti con elastico forte)',
                        'beginner-low': '2x5 (assistiti con elastico)', 
                        'beginner-medium': '3x6 (assistiti con elastico leggero)', 
                        sets: '3x10' 
                    },
                    { 
                        name: 'Pratica di Transizione', 
                        novice: '2x2 (molto assistita)',
                        'beginner-low': '2x3 (assistita)', 
                        'beginner-medium': '3x3 (leggermente assistita)', 
                        sets: '3x4' 
                    },
                    { 
                        name: 'Sospensione con False Grip', 
                        novice: '2x10s (parziale)',
                        'beginner-low': '2x15s (parziale)', 
                        'beginner-medium': '3x15s (completa)', 
                        sets: '3x25s' 
                    }
                ],
                'handstand': [
                    { 
                        name: 'Verticale Contro il Muro', 
                        novice: '2x15s (piedi alti sul muro, bacino basso)',
                        'beginner-low': '2x20s (piedi alti sul muro, bacino medio)', 
                        'beginner-medium': '3x30s (piedi alti sul muro, bacino alto)', 
                        sets: '3x45s' 
                    },
                    { 
                        name: 'Tap di Spalle in Verticale', 
                        novice: '2x3 per lato (piedi alti sul muro)',
                        'beginner-low': '2x4 per lato (piedi alti sul muro)', 
                        'beginner-medium': '3x4 per lato (posizione standard)', 
                        sets: '3x6 per lato' 
                    },
                    { 
                        name: 'Piegamenti Pike', 
                        novice: '2x5 (pike leggero)',
                        'beginner-low': '2x6 (pike moderato)', 
                        'beginner-medium': '3x7 (pike pronunciato)', 
                        sets: '3x10' 
                    },
                    { 
                        name: 'Posizione del Corvo', 
                        novice: '2x10s (ginocchia appoggiate sui gomiti)',
                        'beginner-low': '2x15s (ginocchia appoggiate sui gomiti)', 
                        'beginner-medium': '3x15s (ginocchia che sfiorano i gomiti)', 
                        sets: '3x25s' 
                    }
                ],
                'front-lever': [
                    { 
                        name: 'Tuck Front Lever', 
                        novice: '2x5s (tuck molto chiuso, piedi a terra)',
                        'beginner-low': '2x8s (tuck molto chiuso)', 
                        'beginner-medium': '3x10s (tuck chiuso)', 
                        sets: '3x15s' 
                    },
                    { 
                        name: 'Front Lever Raises', 
                        novice: '2x3 (dal basso, tuck molto chiuso)',
                        'beginner-low': '2x4 (dal basso, tuck chiuso)', 
                        'beginner-medium': '3x4 (dal basso, tuck moderato)', 
                        sets: '3x6' 
                    },
                    { 
                        name: 'Scapular Pull-ups', 
                        novice: '2x5 (piedi a terra)',
                        'beginner-low': '2x6 (piedi a terra)', 
                        'beginner-medium': '3x7 (sospeso con leggera assistenza)', 
                        sets: '3x10' 
                    },
                    { 
                        name: 'Hollow Body Hold', 
                        novice: '2x15s (ginocchia piegate)',
                        'beginner-low': '2x20s (ginocchia piegate)', 
                        'beginner-medium': '3x25s (una gamba estesa)', 
                        sets: '3x38s' 
                    }
                ],
                'planche': [
                    { 
                        name: 'Planche Lean', 
                        novice: '2x5s (lean leggero)',
                        'beginner-low': '2x8s (lean leggero)', 
                        'beginner-medium': '3x8s (lean moderato)', 
                        sets: '3x12s' 
                    },
                    { 
                        name: 'Tuck Planche', 
                        novice: '2x5s (piedi a terra, simulazione)',
                        'beginner-low': '2x8s (ginocchia molto piegate, sui gomiti)', 
                        'beginner-medium': '3x8s (tuck sui gomiti)', 
                        sets: '3x15s' 
                    },
                    { 
                        name: 'Piegamenti Pseudo Planche', 
                        novice: '2x5 (mani poco avanzate, sulle ginocchia)',
                        'beginner-low': '2x6 (mani poco avanzate, sulle ginocchia)', 
                        'beginner-medium': '3x7 (mani moderatamente avanzate, sulle ginocchia)', 
                        sets: '3x10' 
                    },
                    { 
                        name: 'Piegamenti Pike Elevati', 
                        novice: '2x5 (pike leggero, piedi a terra)',
                        'beginner-low': '2x6 (pike moderato, piedi poco elevati)', 
                        'beginner-medium': '3x7 (pike moderato, piedi elevati)', 
                        sets: '3x10' 
                    }
                ],
                'human-flag': [
                    { 
                        name: 'Side Plank', 
                        novice: '2x15s per lato (ginocchia a terra)',
                        'beginner-low': '2x20s per lato (ginocchia a terra)', 
                        'beginner-medium': '3x25s per lato (gambe distese)', 
                        sets: '3x38s per lato' 
                    },
                    { 
                        name: 'Sollevamento Gambe Laterale in Sospensione', 
                        novice: '2x5 per lato (ampiezza ridotta)',
                        'beginner-low': '2x6 per lato (ampiezza ridotta)', 
                        'beginner-medium': '3x7 per lato (ampiezza moderata)', 
                        sets: '3x10 per lato' 
                    },
                    { 
                        name: 'Tuck Human Flag', 
                        novice: '2x5s (tuck stretto, piedi a terra)',
                        'beginner-low': '2x6s (tuck stretto, piedi quasi sollevati)', 
                        'beginner-medium': '3x8s (tuck stretto, breve sollevamento)', 
                        sets: '3x12s' 
                    },
                    { 
                        name: 'Pull Laterali alla Sbarra', 
                        novice: '2x5 per lato (con piedi a terra)',
                        'beginner-low': '2x6 per lato (con piedi a terra)', 
                        'beginner-medium': '3x7 per lato (con leggera assistenza)', 
                        sets: '3x10 per lato' 
                    }
                ],
                'pistol-squat': [
                    { 
                        name: 'Pistol Squat Assistiti', 
                        novice: '2x3 per gamba (squat su una gamba con supporto completo)',
                        'beginner-low': '2x4 per gamba (squat su una gamba con supporto completo)', 
                        'beginner-medium': '3x4 per gamba (squat su una gamba con supporto parziale)', 
                        sets: '3x6 per gamba' 
                    },
                    { 
                        name: 'Box Squat Monolaterale', 
                        novice: '2x4 per gamba (box alto)',
                        'beginner-low': '2x5 per gamba (box alto)', 
                        'beginner-medium': '3x6 per gamba (box medio)', 
                        sets: '3x9 per gamba' 
                    },
                    { 
                        name: 'Pistol Squat Negativi', 
                        novice: '2x3 per gamba (discesa parziale con supporto)',
                        'beginner-low': '2x4 per gamba (discesa parziale con supporto)', 
                        'beginner-medium': '3x4 per gamba (discesa completa con supporto)', 
                        sets: '3x6 per gamba' 
                    },
                    { 
                        name: 'Mobilità Caviglia', 
                        novice: '2x20s per gamba',
                        'beginner-low': '2x25s per gamba', 
                        'beginner-medium': '3x25s per gamba', 
                        sets: '3x30s per gamba' 
                    }
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
        
        // Adjust progression factor based on level to make it more gradual for beginners
        let adjustedProgressionFactor;
        if (level === 'novice') {
            adjustedProgressionFactor = 1 + (progressionFactor - 1) * 0.4; // 40% of normal progression
        } else if (level === 'beginner-low') {
            adjustedProgressionFactor = 1 + (progressionFactor - 1) * 0.5; // 50% of normal progression
        } else if (level === 'beginner-medium') {
            adjustedProgressionFactor = 1 + (progressionFactor - 1) * 0.6; // 60% of normal progression
        } else if (level === 'beginner-high') {
            adjustedProgressionFactor = 1 + (progressionFactor - 1) * 0.8; // 80% of normal progression
        } else {
            adjustedProgressionFactor = progressionFactor; // No adjustment for intermediate and advanced
        }
        
        // Add the specified number of exercises
        for (let i = 0; i < Math.min(count, availableExercises.length); i++) {
            const exercise = availableExercises[i];
            let sets;
            let pausaBetweenSets;
            
            // Get the appropriate sets/reps based on user level
            if (level === 'novice') {
                sets = exercise.novice || '2x3';
                pausaBetweenSets = '45s';
            } else if (level === 'beginner-low') {
                sets = exercise['beginner-low'] || '2x5';
                pausaBetweenSets = '50s';
            } else if (level === 'beginner-medium') {
                sets = exercise['beginner-medium'] || '3x5';
                pausaBetweenSets = '55s';
            } else if (level === 'beginner-high') {
                sets = exercise['beginner-high'] || '3x8';
                pausaBetweenSets = '60s';
            } else if (level === 'intermediate') {
                sets = exercise.intermediate;
                pausaBetweenSets = '90s';
            } else {
                sets = exercise.advanced;
                pausaBetweenSets = '120s';
            }
            
            // For skill exercises, the format is different
            if (exercise.sets && (level === 'intermediate' || level === 'advanced' || level === 'beginner-high')) {
                sets = exercise.sets;
            }
            
            // Clean up the format - extract the actual exercise without the description for display
            let cleanedSets = sets;
            if (sets && sets.includes('(')) {
                const descriptionMatch = sets.match(/(.*?)\s*\(/);
                if (descriptionMatch && descriptionMatch[1]) {
                    cleanedSets = descriptionMatch[1];
                }
            }
            
            // Get the description from the sets string
            let description = '';
            if (sets && sets.includes('(')) {
                const descMatch = sets.match(/\((.*?)\)/);
                if (descMatch && descMatch[1]) {
                    description = descMatch[1];
                }
            }
            
            // Apply progression factor for weeks 2-4
            if (adjustedProgressionFactor > 1 && cleanedSets) {
                // Parse the sets format (e.g., "3x8")
                const setsParts = cleanedSets.split('x');
                if (setsParts.length === 2) {
                    const numSets = parseInt(setsParts[0]);
                    
                    // Check if it's a time-based exercise (e.g., "3x30s")
                    if (setsParts[1].includes('s')) {
                        const seconds = parseInt(setsParts[1]);
                        // Apply a more gradual progression for time-based exercises
                        const newSeconds = Math.round(seconds * adjustedProgressionFactor);
                        cleanedSets = `${numSets}x${newSeconds}s`;
                    } 
                    // Check if it's a range (e.g., "3x8-12")
                    else if (setsParts[1].includes('-')) {
                        const repRange = setsParts[1].split('-');
                        const minReps = parseInt(repRange[0]);
                        const maxReps = parseInt(repRange[1]);
                        // Use the average value of the range as a single number
                        const singleRep = Math.round((minReps + maxReps) / 2 * adjustedProgressionFactor);
                        cleanedSets = `${numSets}x${singleRep}`;
                    }
                    // Single rep count (e.g., "3x8")
                    else {
                        const reps = parseInt(setsParts[1]);
                        const newReps = Math.round(reps * adjustedProgressionFactor);
                        cleanedSets = `${numSets}x${newReps}`;
                    }
                }
            } else if (cleanedSets && cleanedSets.includes('-')) {
                // Convert ranges to single values even without progression factor
                const setsParts = cleanedSets.split('x');
                if (setsParts.length === 2 && setsParts[1].includes('-')) {
                    const numSets = parseInt(setsParts[0]);
                    const repRange = setsParts[1].split('-');
                    const minReps = parseInt(repRange[0]);
                    const maxReps = parseInt(repRange[1]);
                    // Use the average value of the range
                    const singleRep = Math.round((minReps + maxReps) / 2);
                    cleanedSets = `${numSets}x${singleRep}`;
                }
            }
            
            // Re-add the description if there was one
            if (description) {
                sets = `${cleanedSets} (${description})`;
            } else {
                sets = cleanedSets;
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
            if (level === 'novice' || level === 'beginner-low') {
                pausaBetweenExercises = '90s';
            } else if (level === 'beginner-medium' || level === 'beginner-high') {
                pausaBetweenExercises = '100s';
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
    function displayTrainingPlan(plan, userData) {
        trainingPlanContainer.innerHTML = '';
        
        // Create a container for the user's stats
        const statsContainer = document.createElement('div');
        statsContainer.className = 'user-stats';
        
        const statsTitle = document.createElement('h3');
        statsTitle.textContent = 'Le Tue Statistiche';
        statsContainer.appendChild(statsTitle);
        
        const statsList = document.createElement('ul');
        statsList.className = 'stats-list';
        
        // Add user stats
        const stats = [
            { name: 'Trazioni Massime', value: userData.pullUps },
            { name: 'Piegamenti Massimi', value: userData.pushUps },
            { name: 'Dip Massimi', value: userData.dips },
            { name: 'Trazioni Australiane Massime', value: userData.australianPullUps },
            { name: 'Squat Massimi', value: userData.squats },
            { name: 'L-Sit Massimo (secondi)', value: userData.lSit },
            { name: 'Obiettivo', value: translateGoal(userData.goal) },
            { name: 'Livello di Esperienza', value: translateExperience(userData.experience) }
        ];
        
        stats.forEach(stat => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${stat.name}:</strong> ${stat.value}`;
            statsList.appendChild(li);
        });
        
        statsContainer.appendChild(statsList);
        trainingPlanContainer.appendChild(statsContainer);
        
        // Create a container for each week
        plan.weeks.forEach(week => {
            const weekContainer = document.createElement('div');
            weekContainer.className = 'week-container';
            
            const weekTitle = document.createElement('h3');
            weekTitle.className = 'week-title';
            weekTitle.textContent = `Settimana ${week.weekNumber}`;
            weekContainer.appendChild(weekTitle);
            
            // Create a container for each day
            week.days.forEach(day => {
                const dayContainer = document.createElement('div');
                dayContainer.className = day.isRest ? 'day-container rest-day' : 'day-container workout-day';
                
                const dayHeader = document.createElement('div');
                dayHeader.className = 'day-header';
                
                const dayName = document.createElement('h4');
                dayName.textContent = day.name;
                dayHeader.appendChild(dayName);
                
                if (!day.isRest) {
                    const dayType = document.createElement('span');
                    dayType.className = 'day-type';
                    dayType.textContent = translateWorkoutType(day.type);
                    dayHeader.appendChild(dayType);
                }
                
                dayContainer.appendChild(dayHeader);
                
                if (day.isRest) {
                    const restMessage = document.createElement('p');
                    restMessage.className = 'rest-message';
                    restMessage.innerHTML = '<i class="fas fa-bed"></i> Giorno di Riposo';
                    dayContainer.appendChild(restMessage);
                } else {
                    // Create a list of exercises
                    const exercisesList = document.createElement('ul');
                    exercisesList.className = 'exercises-list';
                    
                    day.exercises.forEach(exercise => {
                        const exerciseItem = document.createElement('li');
                        exerciseItem.className = 'exercise-item';
                        
                        const exerciseName = document.createElement('div');
                        exerciseName.className = 'exercise-name';
                        exerciseName.textContent = `${exercise.name}: ${exercise.sets}`;
                        exerciseItem.appendChild(exerciseName);
                        
                        if (exercise.description) {
                            const exerciseDescription = document.createElement('div');
                            exerciseDescription.className = 'exercise-description';
                            exerciseDescription.innerHTML = exercise.description;
                            exerciseItem.appendChild(exerciseDescription);
                        }
                        
                        exercisesList.appendChild(exerciseItem);
                    });
                    
                    dayContainer.appendChild(exercisesList);
                }
                
                weekContainer.appendChild(dayContainer);
            });
            
            trainingPlanContainer.appendChild(weekContainer);
        });

        // Add a summary section
        const summarySection = document.createElement('div');
        summarySection.className = 'summary-section';
        
        const summaryTitle = document.createElement('h3');
        summaryTitle.textContent = 'Riassunto e Consigli';
        summarySection.appendChild(summaryTitle);
        
        const summaryText = document.createElement('p');
        summaryText.innerHTML = `
            Questo piano di allenamento è stato creato in base al tuo livello di abilità e ai tuoi obiettivi. 
            Assicurati di riscaldarti adeguatamente prima di ogni sessione e di dare al tuo corpo il tempo di recuperare tra gli allenamenti. 
            Ricorda che la progressione è graduale - concentrati prima sulla tecnica corretta, poi aumenta il volume e l'intensità.
            <br><br>
            Monitora i tuoi progressi settimanalmente e aggiusta il piano se necessario. Buon allenamento!
        `;
        summarySection.appendChild(summaryText);
        
        trainingPlanContainer.appendChild(summarySection);
        
        // Add additional user information
        const userInfoSection = document.createElement('div');
        userInfoSection.className = 'user-info-section';
        
        const userInfoTitle = document.createElement('h3');
        userInfoTitle.textContent = 'Informazioni Utili';
        userInfoSection.appendChild(userInfoTitle);
        
        const userInfoText = document.createElement('p');
        userInfoText.innerHTML = `
            <strong>Progressione:</strong> Aumenta gradualmente l'intensità degli esercizi ogni 1-2 settimane.<br>
            <strong>Alimentazione:</strong> Assicurati di consumare abbastanza proteine e calorie per supportare il tuo allenamento.<br>
            <strong>Idratazione:</strong> Bevi almeno 2-3 litri di acqua al giorno.<br>
            <strong>Riposo:</strong> Dormi 7-8 ore a notte per un recupero ottimale.<br>
            <strong>Costanza:</strong> La regolarità è la chiave per vedere progressi nel calisthenics.
        `;
        userInfoSection.appendChild(userInfoText);
        
        trainingPlanContainer.appendChild(userInfoSection);
    }
    
    // Helper function to translate workout types to Italian
    function translateWorkoutType(type) {
        switch(type) {
            case 'push':
                return 'Spinta';
            case 'pull':
                return 'Trazione';
            case 'legs':
                return 'Gambe';
            case 'upper':
                return 'Parte Superiore';
            case 'lower':
                return 'Parte Inferiore';
            case 'full-body':
                return 'Corpo Completo';
            default:
                return type;
        }
    }
    
    // Helper function to translate goals to Italian
    function translateGoal(goal) {
        switch(goal) {
            case 'strength':
                return 'Costruire Forza';
            case 'muscle':
                return 'Costruire Muscoli';
            case 'endurance':
                return 'Migliorare Resistenza';
            case 'skill':
                return 'Imparare Abilità';
            default:
                return goal;
        }
    }
    
    // Helper function to translate experience levels to Italian
    function translateExperience(experience) {
        switch(experience) {
            case 'beginner':
                return 'Principiante (0-6 mesi)';
            case 'intermediate':
                return 'Intermedio (6 mesi - 2 anni)';
            case 'advanced':
                return 'Avanzato (2+ anni)';
            default:
                return experience;
        }
    }
    
    // Helper function to capitalize the first letter of a string
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Import the diet.js script
    const dietScript = document.createElement('script');
    dietScript.src = 'js/diet.js';
    document.head.appendChild(dietScript);
}); 