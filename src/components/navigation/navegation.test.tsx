import { render } from '@testing-library/react';
import { withHistory } from '../../test/pages-utils';
import Navigation, { NavigationProps } from './navigation';
import { createMemoryHistory, MemoryHistory } from 'history';
import { clickTo } from '../../test/utils';
import { makeNavigationItemTestId } from './utils';

const createSut = (props: NavigationProps, history: MemoryHistory) => withHistory(
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  <Navigation {...props} />,
  history
);

const renderSut = (props: NavigationProps, history: MemoryHistory) => {
  const sut = createSut(props, history);

  render(sut);
};

describe('Navigation tests', () => {
  it('correct order params were forwarded to thunk', async () => {
    const locationName = 'location-name';
    const location = '/test-location';
    const history = createMemoryHistory();

    const clickToTab = clickTo(makeNavigationItemTestId(locationName));

    renderSut(
      { currentItem: '#', menuPath: [{ name: locationName, to: location }] },
      history
    );

    await clickToTab();

    expect(history.location.pathname).toBe(location);
  });
});
