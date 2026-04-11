
import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import Page from '../page';

describe('Page (register)', () => {
  it('renderiza sem crashar', () => {
    render(<Page />);
  });
});
