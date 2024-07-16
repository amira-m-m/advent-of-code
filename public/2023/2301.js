const promptLink = document.getElementById('prompt-link');
const pageContents = document.getElementById('solution');

const WRITTEN_DIGITS = { 
    'zero': 0,
    'one' : 1,
    'two' : 2,
    'three' : 3,
    'four' : 4, 
    'five' : 5,
    'six' : 6,
    'seven' : 7,
    'eight' : 8,
    'nine' : 9
};

promptLink.href = 'https://adventofcode.com/2023/day/1';

pageContents.innerHTML = `

    <form id="cal-decoder">
        <p>Upload a calibration file to determine the final calibration value</p><br />
        <select name="algorithm-select" id="algorithm-select" required>
            <option value="a">Decode Algorithm A</option>
            <option value="b">Decode Algorithm B</option>
        </select><br />
        <label for="cal-doc" class="regular-button">Upload</label>
        <p id="file-name-text" class="hint">No file selected</p>
        <input type="file" accept=".txt" name="cal-doc" id="cal-doc" required /><br />
        <button type="submit" class="action-button">Decode</button>
        <div id="output"></div>
    </form>

`;

const inputForm = document.getElementById('cal-decoder');
const inputFile = document.getElementById('cal-doc');
const output = document.getElementById('output');

inputFile.addEventListener('change', () => {
    const fileNameText = document.getElementById('file-name-text');
    fileNameText.innerHTML = inputFile.files[0].name;
});

inputForm.addEventListener('submit', (event) => {

    event.preventDefault();
    output.innerHTML = '';
    const calFile = inputFile.files[0];
    let calValue;

    if (calFile && calFile.type === 'text/plain') {
        parseCalFile(calFile)
            .then(parsedText => {
                calValue = calcCalValue(parsedText);
                output.innerHTML = `
                    <p class="solution">The final calibration value is <span id="cal-value" class="highlight">${calValue}</span></p>
                `;
            })
            .catch(error => {
                console.error(error);
            });
    }
    else {
        if (calFile.type !== 'text/plain') {
            alertUser(0);
        }
        else {
            alertUser(4);
        };
    };
});

function parseCalFile (file) {

    return new Promise((resolve, reject) => {

        const fileReader = new FileReader();

        fileReader.onload = function(event) {
            const calText = event.target.result;
            if (calText === '') {
                alertUser(1);
                reject(new Error('Empty file'));
            };
            resolve(calText);
        };

        fileReader.onerror = function(error) {
            alertUser(2);
            reject(event.target.error);
        };

        fileReader.readAsText(file);

    });

};

function calcCalValue (parsedText) {

    let calValue = 0;

    const lines = parsedText.split('\n');

    for (let i = 0; i < lines.length; i++) {

        const algorithm = document.getElementById('algorithm-select').value;
        const line = lines[i];
        const characters = line.split('');
        let firstDigit, lastDigit;

        if (algorithm === 'a') {
            firstDigit = findFirstDigit(characters);
            lastDigit = findLastDigit(characters);
        }
        else if (algorithm === 'b') {
            firstDigit = readFirstDigit(characters);
            lastDigit = readLastDigit(characters);
        };

        let lineValue = concatenateDigits(firstDigit, lastDigit);
        calValue += lineValue;
    };

        return calValue;

};

function findFirstDigit(characters) {

    for (let i = 0; i < characters.length; i++) {
        let char = Number(characters[i]);
        if (!isNaN(char)) {
            if (char >= 0 && char <= 9) {
                let firstDigit = characters[i];
                return firstDigit;
            };
        };    
    };

    alertUser(3);
    return null;

};

function findLastDigit(characters) {

    for (let i = characters.length - 1; i >= 0; i--) {
        if (characters[i].trim() == '') {
            continue;
        }
        let char = Number(characters[i]);
        if (!isNaN(char)) {
            if (char >= 0 && char <= 9) {
                let lastDigit = characters[i];
                return lastDigit;
            };
        };
    };

    alertUser(3);
    return null;

};

function readFirstDigit(characters) {

    for (i = 0; i < characters.length; i++) {

        let char = Number(characters[i]);
        if (!isNaN(char)) {
            if (char >= 0 && char <= 9) {
                return characters[i];
            };
        }
         else {
            const line = characters.join('');
            const pattern = `/${line.slice(0, i + 1)}/`;

            for (let writtenDigit in WRITTEN_DIGITS) {
                if (pattern.match(writtenDigit)) {
                    return Number(WRITTEN_DIGITS[writtenDigit]);
                };
            };
         };
    };

    alertUser(5);
    return null;

};

function readLastDigit(characters) {
    
    for (i = characters.length - 1; i >= 0; i--) {

        if (characters[i].trim() == '') {
            continue;
        }
        
        let char = Number(characters[i]);
        if (!isNaN(char)) {
            if (char >= 0 && char <= 9) {
                return characters[i];
            };
        }
         else {
            const line = characters.join('');
            const pattern = `/${line.slice(i, characters.length)}/`;

            for (let writtenDigit in WRITTEN_DIGITS) {
                if (pattern.match(writtenDigit)) {
                    return Number(WRITTEN_DIGITS[writtenDigit]);
                };
            };
         };
    };

    alertUser(5);
    return null;

};

function concatenateDigits(first, last) {
    let lineValue = Number((first.toString() + last.toString()));
    return lineValue;
};

function alertUser(alertCode) {

    let alertMessage = '';

    switch (alertCode) {
        case 0:
            alertMessage = 'Only plain text files are allowed.';
            break;
        case 1:
            alertMessage = 'The calibration file cannot be empty.';
            break;
        case 2:
            alertMessage = 'The calibration file cannot be read.';
            break;
        case 3:
            alertMessage = 'Selected decode algorithm requires each line to contain at least one numeric digit.';
            break;
        case 4:
            alertMessage = 'The calibration file could not be read.';
            break;
        case 5:
            alertMessage = 'Selected decode algorithm requires each line to contain at least one numeric or written digit.';
    };

    output.innerHTML = `<p class="problem">${alertMessage}</p>`;
};
