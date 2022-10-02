#!/usr/bin/env python
  
import sys, re, operator, collections

class WordFrequenciesModel:
    ''' 
    Models the data. In this case, we're only interested
    6 in words and their frequencies as an end result 
    '''

    # Dicionário que contém os termos (palavras) e sua frequência.
    term_frequency = {}
    stopwords = set(open('./stop_words.txt').read().split(','))

    def __init__(self, path_to_file):
        self.update(path_to_file)


    def update(self, path_to_file):
        '''
        Função que preenche o dicionário term_frequency.
        '''
        try:
            # Filtra todas as palavras com mais de 1 letra e armazena em uma lista.
            words = re.findall('[a-z]{2,}', open(path_to_file).read().lower())

            # Preenche o dicionário de frequência.
            # {'palavra1':2, 'palavra2':1, 'palavra3':5, ...}
            self.term_frequency = collections.Counter(w for w in words if w not in self.stopwords)

        except IOError:
            print("File not found")


class WordFrequenciesView:
    _model = None

    def __init__(self, model):
        self._model = model

    def render(self):
        # Ordena as palavras.
        sorted_term_frequency = sorted(self._model.term_frequency.items(), key=operator.itemgetter(1), reverse=True)
        
        # Itera pelo dicionário e exibe os dados.
        for (word, frequency) in sorted_term_frequency[0:25]:
            print(word, '-', frequency)


class WordFrequencyController:
    def __init__(self, model, view):
        self._model, self._view = model, view
        view.render()

    def run(self):
        while True:
            print("Next file: ")
            sys.stdout.flush()
            filename = sys.stdin.readline().strip()
            self._model.update(filename)    
            self._view.render()


m = WordFrequenciesModel(sys.argv[0])
v = WordFrequenciesView(m)
c = WordFrequencyController(m, v)
c.run()

# Primeiro o programa lisa todas as ocorrências do arquivo principal