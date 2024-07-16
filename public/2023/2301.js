const promptLink = document.getElementById('prompt-link');
const pageContents = document.getElementById('solution');

promptLink.href = 'https://adventofcode.com/2023/day/1';

pageContents.innerHTML = `

    <form id="file-submission>
        <label for="cal-doc">Upload a calibration file to determine the final calibration value</label><br />
        <input type="file" accept=".txt" name="cal-doc" id="cal-doc" /><br />
    </form>

    <div id="output"></div>

`;

const inputFile = document.getElementById('cal-doc');
const output = document.getElementById('output');

inputFile.addEventListener('change', (event) => {

    event.preventDefault();
    output.innerHTML = '';
    let calValue;

    const calFile = event.target.files[0];
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
        alertUser(0);
    };
});

function parseCalFile (file) {

    return new Promise((resolve, reject) => {

        const fileReader = new FileReader();

        fileReader.onload = function(event) {
            const calText = event.target.result;
            resolve(calText);
        };

        fileReader.readAsText(file);

    });

};

function calcCalValue (parsedText) {

    let calValue = 0;

    const lines = parsedText.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const characters = lines[i].split('');
        let firstDigit = findFirstDigit(characters);
        let lastDigit = findLastDigit(characters);
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
    };

    output.innerHTML = `<p>${alertMessage}</p>`;
};
