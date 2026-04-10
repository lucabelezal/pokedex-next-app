---
name: create-feature
description: 'Cria uma nova feature completa no padrão bulletproof-react. Use quando precisar adicionar um módulo novo (ex: products, orders, invoices) com CRUD completo seguindo os padrões do projeto: React Query, Zod, feature-based architecture, sem cross-feature imports.'
argument-hint: 'Nome da feature no singular (ex: product, order)'
---

# Criar Feature Completa

## Quando Usar
- Adicionar um novo módulo de negócio (entidade + operações CRUD)
- Criar uma feature isolada seguindo a arquitetura do projeto
- Implementar integração com API REST para um novo recurso

## Estrutura de Uma Feature

Cada feature fica em `src/features/<nome-da-feature>/` e contém duas pastas:

```
src/features/<nome>/
├── api/
│   ├── get-<nome>s.ts       # listagem (queryOptions + useQuery)
│   ├── get-<nome>.ts        # busca por ID (queryOptions + useQuery)
│   ├── create-<nome>.ts     # criação (Zod schema + useMutation)
│   ├── update-<nome>.ts     # atualização (Zod schema + useMutation)
│   └── delete-<nome>.ts     # remoção (useMutation)
└── components/
    ├── <nome>s-list.tsx      # listagem com tabela
    ├── <nome>-view.tsx       # visualização de um item
    ├── create-<nome>.tsx     # formulário de criação
    ├── update-<nome>.tsx     # formulário de edição
    └── delete-<nome>.tsx     # botão/dialog de remoção
```

## Passo a Passo

### 1. Adicionar o tipo em `src/types/api.ts`

```typescript
export type NomeEntidade = {
  id: string;
  // campos da entidade...
  createdAt: number;
};
```

### 2. Criar `api/get-<nome>s.ts` (listagem)

```typescript
import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { NomeEntidade, Meta } from '@/types/api';

export const getNomes = (page = 1): Promise<{ data: NomeEntidade[]; meta: Meta }> => {
  return api.get(`/nomes`, { params: { page } });
};

export const getNomesQueryOptions = ({ page }: { page?: number } = {}) => {
  return queryOptions({
    queryKey: page ? ['nomes', { page }] : ['nomes'],
    queryFn: () => getNomes(page),
  });
};

type UseNomesOptions = {
  page?: number;
  queryConfig?: QueryConfig<typeof getNomesQueryOptions>;
};

export const useNomes = ({ queryConfig, page }: UseNomesOptions) => {
  return useQuery({
    ...getNomesQueryOptions({ page }),
    ...queryConfig,
  });
};
```

### 3. Criar `api/get-<nome>.ts` (por ID)

```typescript
import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { NomeEntidade } from '@/types/api';

export const getNome = ({ nomeId }: { nomeId: string }): Promise<NomeEntidade> => {
  return api.get(`/nomes/${nomeId}`);
};

export const getNomeQueryOptions = (nomeId: string) => {
  return queryOptions({
    queryKey: ['nomes', nomeId],
    queryFn: () => getNome({ nomeId }),
  });
};

type UseNomeOptions = {
  nomeId: string;
  queryConfig?: QueryConfig<typeof getNomeQueryOptions>;
};

export const useNome = ({ nomeId, queryConfig }: UseNomeOptions) => {
  return useQuery({
    ...getNomeQueryOptions(nomeId),
    ...queryConfig,
  });
};
```

### 4. Criar `api/create-<nome>.ts` (criação com mutação)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { NomeEntidade } from '@/types/api';

import { getNomesQueryOptions } from './get-nomes';

export const createNomeInputSchema = z.object({
  title: z.string().min(1, 'Required'),
  // demais campos...
});

export type CreateNomeInput = z.infer<typeof createNomeInputSchema>;

export const createNome = ({ data }: { data: CreateNomeInput }): Promise<NomeEntidade> => {
  return api.post(`/nomes`, data);
};

type UseCreateNomeOptions = {
  mutationConfig?: MutationConfig<typeof createNome>;
};

export const useCreateNome = ({ mutationConfig }: UseCreateNomeOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getNomesQueryOptions().queryKey });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createNome,
  });
};
```

### 5. Criar `api/delete-<nome>.ts` e `api/update-<nome>.ts`

Seguir o mesmo padrão de mutação:
- `delete`: apenas recebe o ID, sem schema Zod
- `update`: schema Zod com campos opcionais, invalida o item individual e a lista

### 6. Criar os componentes

- `<nome>s-list.tsx`: usa `useNomes()`, exibe `<Table>` com `<Spinner>` de loading
- `create-<nome>.tsx`: usa `useCreateNome()` + `<Form>` + schema Zod
- `update-<nome>.tsx`: usa `useNome()` + `useUpdateNome()` + `<Form>` com valores pré-preenchidos
- `delete-<nome>.tsx`: usa `useDeleteNome()` + `<ConfirmationDialog>`
- `<nome>-view.tsx`: usa `useNome()` e exibe os detalhes

### 7. Registrar rotas em `src/app/router.tsx` (se necessário)

Adicionar lazy imports e rotas para as páginas da feature.

## Regras Obrigatórias

- **Sem cross-feature imports**: uma feature não pode importar de outra feature
- **Importações internas**: use caminhos relativos dentro da mesma feature (ex: `../api/get-nomes`)
- **Importações externas**: use o alias `@/` para tudo fora da feature (ex: `@/lib/api-client`)
- **Tipos**: use os tipos de `@/types/api` para entidades compartilhadas
- **Validação**: toda mutation deve ter schema Zod exportado do arquivo de API

## Arquivo de Referência

Ver a feature `discussions` como template completo:
- `apps/react-vite/src/features/discussions/api/`
- `apps/react-vite/src/features/discussions/components/`
