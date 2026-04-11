
import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import Page from '../page';

describe('Page (pokedex)', () => {
  it('renderiza sem crashar', () => {
    render(<Page />);
  });
});
