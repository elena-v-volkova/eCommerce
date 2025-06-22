import { render, screen } from '@testing-library/react';

import Catalog from '../ui/Catalog';

import { TestingWrapper } from '@/shared/utils/TestWrapper';

describe('<Catalog />', () => {
  beforeAll(() => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });
  beforeEach(() => {
    render(<Catalog />, { wrapper: TestingWrapper });
  });
  it('Должен отображаться каталог', async () => {
    expect(
      await screen.findByText(/Classic\s+Cars\s+Catalog/i),
    ).toBeInTheDocument();
  });
});
