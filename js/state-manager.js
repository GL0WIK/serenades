const states = {
    REPASSE: 'repasse',
    FINAL: 'final',
    DEGRADE: 'degrade'
};

const stateColors = {
    normal: 'white',
    [states.REPASSE]: 'orange',
    [states.FINAL]: 'green',
    [states.DEGRADE]: 'red'
};

function getPointState(id) {
    return JSON.parse(localStorage.getItem(id)) || { state: 'normal' };
}

function setPointState(id, state, additionalData = {}) {
    localStorage.setItem(id, JSON.stringify({ state, ...additionalData }));
}

function createStateButtons(id, marker, numero, nom_voie) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';

    const addressElement = document.createElement('div');
    addressElement.textContent = `${numero} ${nom_voie}`;
    addressElement.style.fontWeight = 'bold';
    addressElement.style.marginBottom = '5px';
    container.appendChild(addressElement);

    const { state, date, amount, paymentMethod, repas } = getPointState(id);

    const createFinalFields = () => {
        const amountInput = document.createElement('input');
        amountInput.type = 'number';
        amountInput.placeholder = 'Montant';
        amountInput.style.margin = '2px';

        const paymentMethodSelect = document.createElement('select');
        ['CB', 'ESPECE', 'CHEQUE'].forEach(method => {
            const option = document.createElement('option');
            option.value = method;
            option.textContent = method;
            paymentMethodSelect.appendChild(option);
        });
        paymentMethodSelect.style.margin = '2px';

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Enregistrer';
        saveButton.style.margin = '2px';
        saveButton.addEventListener('click', () => {
            const newState = states.FINAL;
            const selectedDate = new Date().toISOString();
            const amount = amountInput.value;
            const paymentMethod = paymentMethodSelect.value;
            setPointState(id, newState, { date: selectedDate, amount, paymentMethod });
            marker.setStyle({ color: stateColors[newState], fillColor: stateColors[newState] });
            marker.bindPopup(createStateButtons(id, marker, numero, nom_voie)).openPopup();
        });

        container.appendChild(amountInput);
        container.appendChild(paymentMethodSelect);
        container.appendChild(saveButton);
    };

    if (state === 'normal') {
        Object.keys(states).forEach(stateKey => {
            const button = document.createElement('button');
            button.textContent = stateKey.charAt(0).toUpperCase() + stateKey.slice(1).toLowerCase();
            button.style.margin = '2px';
            button.addEventListener('click', () => {
                if (stateKey === 'REPASSE') {
                    const dateTimeInput = document.createElement('input');
                    dateTimeInput.type = 'datetime-local';
                    dateTimeInput.style.margin = '2px';

                    const repasCheckbox = document.createElement('input');
                    repasCheckbox.type = 'checkbox';
                    repasCheckbox.id = 'repas';
                    repasCheckbox.style.margin = '2px';

                    const repasLabel = document.createElement('label');
                    repasLabel.htmlFor = 'repas';
                    repasLabel.textContent = 'Repas';
                    repasLabel.style.margin = '2px';

                    const saveRepasseButton = document.createElement('button');
                    saveRepasseButton.textContent = 'Enregistrer';
                    saveRepasseButton.style.margin = '2px';
                    saveRepasseButton.addEventListener('click', () => {
                        const newState = states[stateKey];
                        const selectedDate = dateTimeInput.value;
                        const isRepas = repasCheckbox.checked;
                        setPointState(id, newState, { date: selectedDate, repas: isRepas });
                        marker.setStyle({ color: stateColors[newState], fillColor: stateColors[newState] });
                        marker.bindPopup(createStateButtons(id, marker, numero, nom_voie)).openPopup();
                    });

                    container.appendChild(dateTimeInput);
                    container.appendChild(repasCheckbox);
                    container.appendChild(repasLabel);
                    container.appendChild(saveRepasseButton);
                } else if (stateKey === 'FINAL') {
                    createFinalFields();
                } else {
                    const newState = states[stateKey];
                    setPointState(id, newState);
                    marker.setStyle({ color: stateColors[newState], fillColor: stateColors[newState] });
                    marker.bindPopup(createStateButtons(id, marker, numero, nom_voie)).openPopup();
                }
            });
            container.appendChild(button);
        });
    } else if (state === states.REPASSE) {
        const currentStateElement = document.createElement('div');
        if (date) {
            currentStateElement.textContent = `${repas ? 'Repas le' : 'Repasse le'} : ${new Date(date).toLocaleString()}`;
        }
        currentStateElement.style.marginBottom = '5px';
        container.appendChild(currentStateElement);

        // Add the final button and its functionality
        const finalButton = document.createElement('button');
        finalButton.textContent = 'Final';
        finalButton.style.margin = '2px';
        finalButton.addEventListener('click', () => {
            createFinalFields();
        });
        container.appendChild(finalButton);

        const resetButton = document.createElement('button');
        resetButton.textContent = 'Retour';
        resetButton.style.margin = '2px';
        resetButton.addEventListener('click', () => {
            setPointState(id, 'normal');
            marker.setStyle({ color: stateColors['normal'], fillColor: stateColors['normal'] });
            marker.bindPopup(createStateButtons(id, marker, numero, nom_voie)).openPopup();
        });
        container.appendChild(resetButton);
    } else {
        const currentStateElement = document.createElement('div');
        if (state === states.FINAL && date && amount && paymentMethod) {
            currentStateElement.textContent = `Passé le : ${new Date(date).toLocaleString()}\nA donné : ${amount} € en ${paymentMethod}`;
        } else {
            currentStateElement.textContent = `État actuel: ${state.charAt(0).toUpperCase() + state.slice(1).toLowerCase()}`;
        }
        currentStateElement.style.marginBottom = '5px';
        container.appendChild(currentStateElement);

        const resetButton = document.createElement('button');
        resetButton.textContent = 'Retour';
        resetButton.style.margin = '2px';
        resetButton.addEventListener('click', () => {
            setPointState(id, 'normal');
            marker.setStyle({ color: stateColors['normal'], fillColor: stateColors['normal'] });
            marker.bindPopup(createStateButtons(id, marker, numero, nom_voie)).openPopup();
        });
        container.appendChild(resetButton);
    }

    return container;
}
