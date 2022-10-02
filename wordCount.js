class WordFrequenciesModel {
    constructor(pathToFile) {
        /** Define a estrutura principal da classe, um Map do tipo:
         * {'palavra':frequencia, ...}
         */
        this.termFrequency = new Map();

        /** Realiza o parser do arquivo stop_words e põe as palavras em um array. */
        this.stopWords = readFile('stop_words.txt').split("\r\n");
        this.stopWords = Array.from(new Set(this.stopWords));
        
        this.update(pathToFile);
    }

    /**
     * Conta com qual frequência as palavras especificadas em stop_words.txt 
     aparecem em um determinado arquivo e as armazena na variável termFrequency.
     * 
     * @param {string} pathToFile O arquivo no qual as palavras serão procuradas.
     */
    update(pathToFile) {
        /** Tenta ler e realizar o parser do arquivo desejado. */
        try {
            const file = readFile(pathToFile).split("\r\n");
            const words = [];

            file.forEach(word => {
                if (word.match("[a-z]{2,}")) {
                    words.push(word);
                }
            })

            /** Limpa o Map declarando-o novamente. */
            this.termFrequency = new Map();

            /** Realiza a contagem da frequência das palavras. */
            words.forEach(word => {
                if (word in this.termFrequency) {
                    this.termFrequency[word]++;    
                } else if (!(this.stopWords.includes(word))) {
                    this.termFrequency[word] = 1;
                }
            })
        } catch (error) {
            console.log("File not found!");
        }
    } 
}


class WordFrequenciesView {
    constructor(model) {
        this._model = model; 
    }

    /** Exibe as informações da contagem na tela. */
    render() {
        for (const word in this._model.termFrequency) {
            console.log(`${word} -> ${this._model.termFrequency[word]}`);
        }
    }
}


class WordFrequencyController {
    constructor(model, view) {
        this._model = model;
        this._view = view;

        view.render();
    }

    /**
     * Executa um loop de leitura para arquivos informados no console.
     */
    async run() {
        while (true) {         
            const filename = await askQuestion("Next file: ");
            this._model.update(filename);
            this._view.render();
        }
    }
}


// Funções auxiliares --------------------------------- //

/**
 * Lê um arquivo e põe seu conteúdo em uma string.
 * 
 * @param {string} pathtoFile O caminho para o arquivo a ser lido.
 * @return Uma string contendo com o conteúdo do arquivo.
 */
const readFile = function(pathToFile) {
    const fs = require("fs");
    return fs.readFileSync(pathToFile, 'utf8')
}

/**
 * Exibe uma pergunta no console e coleta a resposta do usuário.
 * 
 * @param {string} question A pergunta a ser exibida.
 * @return Uma promise resolvida (string) contendo o input de resposta do usuário.
 */
function askQuestion(question) {
    const readline = require('readline');
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(question, ans => {
        rl.close();
        resolve(ans);
    }))
}

// ---------------------------------------------------- //

m = new WordFrequenciesModel('./words.txt');
v = new WordFrequenciesView(m);
c = new WordFrequencyController(m, v);
c.run();
