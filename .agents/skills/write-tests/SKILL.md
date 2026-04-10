---
name: write-tests
description: 'Escreve testes no padrão bulletproof-react. Use para criar testes unitários com Vitest, testes de integração com Testing Library + MSW, ou testes E2E com Playwright. Cobre componentes, features, hooks e fluxos de usuário.'
argument-hint: 'O que testar: componente, feature, hook ou fluxo E2E'
---

# Escrever Testes

## Quando Usar
- Criar testes unitários para componentes ou utilitários
- Criar testes de integração para features (formulários, listagens, fluxos de CRUD)
- Criar testes E2E para fluxos críticos de usuário (login, navegação, etc.)
- Auditar cobertura de testes de um módulo existente

## Stack de Testes

| Camada | Ferramentas | Onde fica |
|--------|-------------|-----------|
| Unitário | Vitest + Testing Library | `__tests__/*.test.tsx` |
| Integração | Vitest + Testing Library + MSW | `__tests__/*.test.tsx` |
| E2E | Playwright | `e2e/tests/*.spec.ts` |

## Testes Unitários e de Integração

### Localização
- Componentes compartilhados: `src/components/ui/<nome>/__tests__/<nome>.test.tsx`
- Componentes de feature: `src/features/<feature>/components/__tests__/<componente>.test.tsx`
- Hooks: `src/hooks/__tests__/<hook>.test.tsx`

### Importações Padrão

```tsx
import {
  createUser,
  createDiscussion,
  loginAsUser,
  renderApp,
  screen,
  userEvent,
  waitFor,
  waitForLoadingToFinish,
} from '@/testing/test-utils';
```

### Geradores de Dados Falsos

```ts
import { createUser, createTeam, createDiscussion } from '@/testing/data-generators';

// Com overrides:
const user = createUser({ role: 'USER' });
const discussion = createDiscussion({ title: 'Meu titulo' });
```

### Padrão de Teste de Componente

```tsx
import { renderApp, screen, userEvent, waitFor } from '@/testing/test-utils';
import { MeuComponente } from '../meu-componente';

test('deve renderizar e chamar o callback ao clicar', async () => {
  const onSuccess = vi.fn();

  await renderApp(<MeuComponente onSuccess={onSuccess} />, { user: null });

  await userEvent.click(screen.getByRole('button', { name: /confirmar/i }));

  await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
});
```

### Padrão de Teste com Usuário Autenticado

```tsx
test('deve exibir dados do usuário logado', async () => {
  const user = await createUser({ role: 'ADMIN' });

  await renderApp(<MinhaPagina />, { user });

  await waitForLoadingToFinish();

  expect(screen.getByText(user.firstName)).toBeInTheDocument();
});
```

### Padrão de Teste com Dados Pré-existentes no Mock DB

```tsx
import { db } from '@/testing/mocks/db';

test('deve listar os itens', async () => {
  const discussion = await db.discussion.create({ title: 'Teste' });

  await renderApp(<DiscussionsList />, {});

  await waitForLoadingToFinish();

  expect(screen.getByText(discussion.title)).toBeInTheDocument();
});
```

### Padrão de Teste de Formulário

```tsx
test('deve submeter o formulário e chamar onSuccess', async () => {
  const user = await createUser();
  const onSuccess = vi.fn();

  await renderApp(<CreateDiscussion onSuccess={onSuccess} />, { user });

  await userEvent.type(screen.getByLabelText(/título/i), 'Meu título');
  await userEvent.type(screen.getByLabelText(/corpo/i), 'Corpo do texto');

  await userEvent.click(screen.getByRole('button', { name: /criar/i }));

  await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
});
```

### Referência Completa

Ver: `apps/react-vite/src/features/auth/components/__tests__/login-form.test.tsx`

## Testes E2E com Playwright

### Localização
- Testes: `e2e/tests/*.spec.ts`
- Setup de autenticação: `e2e/tests/auth.setup.ts`

### Padrão de Teste E2E

```ts
import { expect, test } from '@playwright/test';
import { paths } from '@/config/paths';

test.describe('Feature X', () => {
  test('deve realizar ação crítica', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /discussões/i }).click();

    await expect(page).toHaveURL('/app/discussions');
    await expect(page.getByText('Nenhum resultado')).toBeVisible();
  });
});
```

### Executar Testes

```bash
# Unitários e integração
yarn test

# E2E
yarn test-e2e

# Modo watch (desenvolvimento)
yarn test --watch
```

## Regras e Boas Práticas

1. **Prioridade**: Testes de integração > unitários (testa comportamento real do usuário)
2. **Queries**: Use queries semânticas por ordem de preferência: `getByRole` → `getByLabelText` → `getByText` → `getByTestId`
3. **Mock de módulos**: Evite mockar módulos isolados; prefira MSW para interceptar requisições HTTP
4. **Async**: Sempre use `waitFor`, `waitForLoadingToFinish` ou `findBy*` para testar estados assíncronos
5. **Isolamento**: Cada teste deve ser independente; use o `db` mock para criar dados por teste

## Referências no Codebase

- `apps/react-vite/src/testing/test-utils.tsx` — utilitários de render e helpers
- `apps/react-vite/src/testing/data-generators.ts` — geradores de dados com `@ngneat/falso`
- `apps/react-vite/src/testing/mocks/` — MSW handlers, mock DB e utilitários
- `apps/react-vite/src/testing/setup-tests.ts` — setup global do Vitest
- `apps/react-vite/e2e/tests/` — exemplos de testes E2E
