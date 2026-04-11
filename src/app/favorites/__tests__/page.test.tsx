
import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import Page from '../page';

describe('Page (favorites)', () => {
  it('renderiza sem crashar', () => {
    render(<Page />);
  });
});
