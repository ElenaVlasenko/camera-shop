import { Store } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { MemoryHistory, createMemoryHistory } from 'history';
import HistoryRouter from '../components/history-router/history-route';

export const withStore = (component: JSX.Element, store: Store): JSX.Element => <Provider store={store} > {component} </ Provider >;
export const withRouter = (component: JSX.Element): JSX.Element => <BrowserRouter>{component}</ BrowserRouter>;


export const expectTextOnScreen = (text: string) =>
  expect(screen.queryByText(new RegExp(text, 'i'))).toBeInTheDocument();

export const expectNoTextOnScreen = (text: string) =>
  expect(screen.queryByText(new RegExp(text, 'i'))).toBeNull();

export function withHistory(component: JSX.Element, history?: MemoryHistory) {
  const memoryHistory = history ?? createMemoryHistory();

  return (
    <HistoryRouter history={memoryHistory}>
      {component}
    </HistoryRouter>
  );
}
