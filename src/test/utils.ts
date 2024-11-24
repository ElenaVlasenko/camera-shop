import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

type IntBetween = (n1: number, n2: number) => number;

export const intBetween: IntBetween = (n1, n2) => {
  const max = Math.max(n1, n2);
  const min = Math.min(n1, n2);

  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getRandomArrayElement = <T>(list: T[]) => list[intBetween(0, list.length - 1)];
export const idsOf = <T extends { id: number }>(list: T[]): number[] => list.map((it) => it.id);

type MakeCounter = (start?: number) => () => number;

export const makeCounter: MakeCounter = (num = 0) => () => num++;

export const makeList = <T>(length: number, itemFactory: (n?: number) => T): T[] => Array.from({ length }, itemFactory);

type MakeStrGen = (strFromNum: (n: number) => string) => (num?: number) => string;

export const makeUniqStringGenerator: MakeStrGen = (strFromNum) => {
  const getSerialNum = makeCounter(1);

  return (n) => strFromNum(n ?? getSerialNum());
};

export const typeTo = (testId: string) => async (text: string) => {
  await act(
    () => userEvent.type(
      screen.getByTestId(testId),
      text
    )
  );
};

export const clickTo = (buttonTestId: string) => async () => {
  await act(
    async () => {
      const element = screen.getByTestId(buttonTestId);
      await userEvent.click(element);
    }
  );
};
