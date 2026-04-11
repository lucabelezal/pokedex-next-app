
import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import Page from '../page';

describe('Page (regions)', () => {
  it('renderiza sem crashar', () => {
    render(<Page />);
  });
});
