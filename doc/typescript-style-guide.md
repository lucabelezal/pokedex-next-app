# TypeScript Style Guide do Projeto

## Objetivo
Este guia define padrões pragmáticos para manter o código consistente, legível e seguro em um projeto Next.js 16 + React 19 + TypeScript 5.

## Fontes de Referência
- Guia primário: convenções deste projeto.
- Guia secundário: Google TypeScript Style Guide.
- Princípio de decisão: quando houver conflito, priorizar compatibilidade com stack atual, legibilidade e baixo risco de migração.

## Decisões de Precedência
1. Compatibilidade com Next.js App Router e ESLint flat config é obrigatória.
2. Convenções já consolidadas no repositório têm prioridade sobre preferências cosméticas.
3. Regras do Google TS Guide são adotadas quando aumentam segurança e manutenção sem gerar churn desnecessário.

## Regras Base

### 1) Exports e Imports
- Use named exports por padrão.
- Evite default exports em novos arquivos.
- Use `import type` para tipos.
- Use alias `@/` para imports fora do contexto local.
- Use caminho relativo apenas dentro da mesma feature/contexto local.

### 2) Tipos
- Use `type` por padrão.
- Use `interface` apenas quando houver necessidade real de declaration merging ou contrato que se beneficie diretamente de interface.
- Evite `any`. Prefira `unknown` + narrowing.
- Evite assertions inseguras (`as`) em dados externos. Prefira validação runtime com schema.

### 3) Imutabilidade e Modelagem
- Prefira `Readonly` e `ReadonlyArray` em dados de entrada e estruturas de configuração.
- Prefira discriminated unions para estados e props mutuamente exclusivos.
- Evite múltiplas flags booleanas para representar estado complexo.

### 4) Funções
- Prefira função com responsabilidade única.
- Prefira argumento objeto para funções com muitos parâmetros.
- Use retorno explícito quando agregar clareza em APIs públicas e helpers críticos.
- Evite efeitos colaterais em utilitários puros.

### 5) React
- Componentes: PascalCase.
- Hooks: prefixo `use`.
- Callback prop: `onX`.
- Handler local: `handleX`.
- Evite `React.FC` em componentes novos.
- Evite mover props para state sem necessidade clara; quando necessário, usar prefixo `initial`.

### 6) Nomenclatura
- Variáveis/funções: camelCase.
- Tipos/componentes: PascalCase.
- Constantes de módulo: CONSTANT_CASE quando forem valores estáveis e sem intenção de mutação.
- Evite abreviações ambíguas.

### 7) Erros e Assertions
- Lance apenas `Error` (ou subclasses).
- Evite `@ts-ignore`.
- `@ts-expect-error` apenas como último recurso e com justificativa obrigatória.

### 8) Comentários e Documentação
- Comentários devem explicar contexto e decisão, não o óbvio.
- Para APIs reutilizáveis, use TSDoc quando agregar valor para consumo.
- Escrever documentação do projeto em português com termos técnicos em inglês.

## Regras de Ferramentas
- Não executar `gts init` diretamente no repositório principal neste momento.
- Adotar incrementalmente regras equivalentes de qualidade, preservando:
  - `eslint.config.mjs` (flat config)
  - integração com `eslint-config-next`
  - scripts de validação em `package.json`

## Checklist de Pull Request
- Lint passou sem erros.
- Type-check passou sem erros.
- Sem novos `any`.
- Sem assertions inseguras em dados externos sem validação.
- Sem regressão de arquitetura (imports cruzados inadequados).

## Roadmap de Adoção
1. Baseline de scripts de qualidade (`lint`, `type-check`, `lint:fix`).
2. Redução de assertions inseguras com schemas de validação.
3. Regras de import/order e naming incrementais.
4. Ampliação de testes críticos por feature.
