type Gender = 'm' | 'f' | 'n';

interface Noun {
  text: string;
  gender: Gender;
}

interface Adjective {
  base: string; // мужская форма
}

let nounsA: Noun[] = [];
let nounsB: Noun[] = [];
let adjectivesA: Adjective[] = [];

const MIN_LENGTH = 4;

function detectNounGender(word: string): Gender {
  const w = word.toLowerCase();

  if (w.endsWith('а') || w.endsWith('я')) return 'f';
  if (w.endsWith('о') || w.endsWith('е') || w.endsWith('ё')) return 'n';

  return 'm';
}

function declineAdjective(adj: string, gender: Gender): string {
  const a = adj.toLowerCase();

  if (gender === 'm') return a;

  if (a.endsWith('ый') || a.endsWith('ий')) {
    return gender === 'f' ? a.slice(0, -2) + 'ая' : a.slice(0, -2) + 'ое';
  }

  if (a.endsWith('ой')) {
    return gender === 'f' ? a.slice(0, -2) + 'ая' : a.slice(0, -2) + 'ое';
  }

  return a;
}

const loadData = async () => {
  if (nounsA.length || nounsB.length) return;

  const response = await fetch('data.csv');
  const text = await response.text();

  const lines = text.split('\n').slice(1);

  const allNouns: Noun[] = [];
  const allAdjectives: Adjective[] = [];

  for (const line of lines) {
    const [lemma, pos] = line.split('\t');

    if (!lemma || lemma.length < MIN_LENGTH) continue;

    if (pos === 's') {
      allNouns.push({
        text: lemma,
        gender: detectNounGender(lemma),
      });
    }

    if (pos === 'a') {
      allAdjectives.push({ base: lemma });
    }
  }

  const half = Math.floor(allNouns.length / 2);
  nounsA = allNouns.slice(0, half);
  nounsB = allNouns.slice(half);

  adjectivesA = allAdjectives;

  console.log('Loaded:', {
    nounsA: nounsA.length,
    nounsB: nounsB.length,
    adjectivesA: adjectivesA.length,
  });
};

export const getRandomNounA = async (): Promise<string> => {
  await loadData();
  return nounsA[Math.floor(Math.random() * nounsA.length)].text;
};

export const getRandomNounB = async (): Promise<string> => {
  await loadData();
  return nounsB[Math.floor(Math.random() * nounsB.length)].text;
};

export const getRandomAdjectiveA = async (): Promise<string> => {
  await loadData();
  return adjectivesA[Math.floor(Math.random() * adjectivesA.length)].base;
};

export const getRandomGesturePhrase = async (): Promise<string> => {
  await loadData();

  const noun = nounsA[Math.floor(Math.random() * nounsA.length)];
  const adj = adjectivesA[Math.floor(Math.random() * adjectivesA.length)];

  return `${declineAdjective(adj.base, noun.gender)} ${noun.text}`;
};
