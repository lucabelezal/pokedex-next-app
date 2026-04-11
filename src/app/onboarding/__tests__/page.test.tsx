
import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import Page from '../page';

describe('Page (onboarding)', () => {
  it('renderiza sem crashar', () => {
    render(<Page />);
  });
});
