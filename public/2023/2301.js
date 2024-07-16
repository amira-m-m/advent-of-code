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
        <label for="cal-doc">Upload a calibration file to determine the final calibration value</label><br />
        <input type="file" accept=".txt" name="cal-doc" id="cal-doc" required /><br />
        <select name="algorithm-select" id="algorithm-select" required>
            <option value="a">Decode Algorithm A</option>
            <option value="b">Decode Algorithm B</option>
        </select><br />
        <button type="submit">Decode</button>
    </form>

    <div id="output"></div>

`;

const inputForm = document.getElementById('cal-decoder');
const inputFile = document.getElementById('cal-doc');
const output = document.getElementById('output');

inputForm.addEventListener('submit', (event) => {

    event.preventDefault();
    output.innerHTML = '';
    const calFile = inputFile.files[0];
    let calValue;

    if (calFile && calFile.type === 'text/plain') {
        parseCalFile(calFile)
            .then(parsedText => {
                calValue = calcCalValue(parsedText);
                output.innerHTML = `<p>The final calibration value is ${calValue}</p>`;
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
            alertMessage = 'Decode algorithm requires each line to contain at least one digit.';
            break;
        case 4:
            alertMessage = 'The calibration file could not be read.';
            break;
    };

    output.innerHTML = `<p>${alertMessage}</p>`;
};
