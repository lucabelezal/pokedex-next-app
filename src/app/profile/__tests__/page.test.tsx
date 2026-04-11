
import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import Page from '../page';

describe('Page (profile)', () => {
  it('renderiza sem crashar', () => {
    render(<Page />);
  });
});
