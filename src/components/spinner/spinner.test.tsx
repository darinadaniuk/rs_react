import { render, screen } from '@testing-library/react';

import { Spinner } from './spinner';

describe('Spinner', () => {
  it('should render', () => {
    render(<Spinner />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});
