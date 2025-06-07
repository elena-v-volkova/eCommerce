import { render, screen } from '@testing-library/react';

import Catalog from '../ui/Catalog';

import { RouterWrapper } from '@/components/LoginForm/test/test-utils/Wrapper';

describe('<Catalog />', () => {
  beforeEach(() => {
    render(<Catalog />, { wrapper: RouterWrapper });
  });
  it('Должен отображаться каталог', async () => {
    expect(
      await screen.findByText(/Classic\s+Cars\s+Catalog/i),
    ).toBeInTheDocument();
  });
});
