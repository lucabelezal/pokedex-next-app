---
name: create-component
description: 'Cria um novo componente compartilhado em src/components/ui/ seguindo os padrões do projeto bulletproof-react. Use quando precisar de um componente reutilizável entre features (botão, modal, tabela, input, etc.) com Tailwind CSS, re-export via index.ts e estrutura de pasta padronizada.'
argument-hint: 'Nome do componente em kebab-case (ex: badge, tooltip, avatar)'
---

# Criar Componente Compartilhado

## Quando Usar
- Criar um componente de UI reutilizável entre múltiplas features
- Adicionar um componente à biblioteca compartilhada em `src/components/ui/`
- O componente não pertence a nenhuma feature específica

## Localização

Componentes compartilhados ficam em:
```
src/components/ui/<nome-do-componente>/
├── <nome>.tsx         # implementação do componente
├── index.ts           # re-export público
├── <nome>.stories.tsx # (opcional) Storybook
└── __tests__/         # (opcional) testes unitários
    └── <nome>.test.tsx
```

## Passo a Passo

### 1. Usar o gerador (recomendado)

```bash
yarn generate
# Selecionar: Component Generator
# Nome do componente: nome-do-componente
# Localização: ui (shared)
# Subfolder: nome-do-componente
```

### 2. Criar manualmente a pasta e os arquivos

**`src/components/ui/<nome>/<nome>.tsx`**

```tsx
import * as React from 'react';
import { clsx } from 'clsx';

type NomeProps = {
  // props do componente
  className?: string;
  children?: React.ReactNode;
};

export const Nome = ({ className, children }: NomeProps) => {
  return (
    <div className={clsx('', className)}>
      {children}
    </div>
  );
};
```

**`src/components/ui/<nome>/index.ts`**

```ts
export * from './<nome>';
```

### 3. Exportar do barrel `src/components/ui/index.ts` (se existir)

Verificar se existe um arquivo `src/components/ui/index.ts` e adicionar o export:

```ts
export * from './<nome>';
```

## Padrões de Estilo

- Usar **Tailwind CSS** para todos os estilos
- Usar `clsx` ou `cn` para classes condicionais
- Aceitar `className` como prop para permitir customização pelo consumidor
- Não usar CSS modules nem emotion
- Variáveis de cor via CSS variables conforme `tailwind.config.cjs`

## Padrões de Componente

- **Componentes funcionais** com TypeScript (`React.FC` ou tipagem direta)
- Exportar o tipo das props junto com o componente quando for reutilizável
- Usar `React.forwardRef` quando o componente precisar receber ref (inputs, etc.)
- Para componentes compostos, usar o padrão de sub-componentes (ex: `Dialog.Root`, `Dialog.Content`)

## Referências no Codebase

Ver exemplos de componentes existentes:
- `apps/react-vite/src/components/ui/button/` — componente simples
- `apps/react-vite/src/components/ui/dialog/` — componente composto com sub-componentes e `__tests__/`
- `apps/react-vite/src/components/ui/table/` — componente com props tipadas complexas
- `apps/react-vite/src/components/ui/form/` — componente de formulário com React Hook Form
