
type IntBetween = (n1: number, n2: number) => number;

export const intBetween: IntBetween = (n1, n2) => {
  const max = Math.max(n1, n2);
  const min = Math.min(n1, n2);

  return Math.floor(Math.random() * (max - min + 1) + min);
};

type MakeCounter = (start?: number) => () => number;

export const makeCounter: MakeCounter = (num = 0) => () => num++;

export const makeList = <T>(length: number, itemFactory: (n?: number) => T): T[] => Array.from({ length }, itemFactory);

type MakeStrGen = (strFromNum: (n: number) => string) => (num?: number) => string;

export const makeUniqStringGenerator: MakeStrGen = (strFromNum) => {
  const getSerialNum = makeCounter(1);

  return (n) => strFromNum(n ?? getSerialNum());
};