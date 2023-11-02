import React from 'react';
import { render, screen } from '@testing-library/react';
import { PageThree } from './PageThree';
import { PluginPageProps } from '@grafana/runtime';
import { testIds } from 'components/testIds';
import userEvent from '@testing-library/user-event'


function setup(jsx: JSX.Element) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}
/**
 * Mock @grafana/runtime
 */
jest.mock('@grafana/runtime', () => ({
    getBackendSrv: jest.fn(),
}));

/*
 Plugin
 */
//  const getPlugin = (overridePlugin: any = { meta: {} }) => ({
//     ...overridePlugin,
//     meta: {
//       enabled: true,
//       ...overridePlugin.meta,
//     },
//   });


describe('Components/App', () => {
  let props: PluginPageProps;

  // beforeEach(() => {
  //   jest.resetAllMocks();
  //   // props = {} as PluginPageProps
  // });


  describe('IpAddressInput', () => {
    it('displays ip', async () => {
      const getRequestMock = jest.fn();

      getRequestMock.mockResolvedValue('127.0.0.1');
      const { user } = setup(
        <>
        <PageThree {...props} />
        </>
      );
      // render(<PageThree {...props} />);
      await user.click(await screen.findByRole('input', { name: 'host' }));

      expect(await screen.getByTestId(testIds.pageThree.host)).toBeInTheDocument();

      // const input = screen.getByTestId(testIds.pageThree.host);
      // expect(input).toBeInTheDocument(); 
      
      // await waitFor(() => getByText('127.0.0.1')); 
    });
  });
});
