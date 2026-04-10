---
name: typescript-refactoring
description: 'Orquestra refatoracao TypeScript em fases para projetos React/Next.js. Use quando precisar limpar codigo legado da IA, reduzir riscos de type safety, alinhar style guide e evoluir arquitetura sem big-bang. Gatilhos: "refatorar typescript", "limpar codigo", "migrar padrao", "reduzir sujeira", "plano de refatoracao".'
argument-hint: 'Escopo da fase: tooling, type-safety, arquitetura ou testes'
---

# Refatoracao TypeScript em Fases

## Quando Usar
- Quando o projeto cresceu com inconsistencias e decisoes tecnicas mistas.
- Quando precisa padronizar TypeScript sem quebrar o fluxo de desenvolvimento.
- Quando quer evoluir qualidade com entregas pequenas e verificaveis.

## Objetivo
Executar refatoracao incremental, mantendo o app funcional em cada etapa e reduzindo regressao.

## Fases

### Fase 1: Baseline de Qualidade
- Garantir scripts de validacao no `package.json`.
- Preservar setup atual do Next.js com `eslint.config.mjs` flat config.
- Definir criterios minimos de PR: lint e type-check.

### Fase 2: Type Safety
- Mapear e reduzir assertions inseguras (`as`) em dados externos.
- Introduzir validacao runtime para payloads e mocks criticos.
- Remover `any` novo e converter existentes para `unknown` + narrowing.

### Fase 3: Arquitetura
- Revisar limites entre `app`, `components`, `hooks` e `lib`.
- Evitar imports cruzados inadequados e aumentar coesao por contexto.
- Evoluir estrutura de forma gradual, sem migracao big-bang.

### Fase 4: Testes e Estabilidade
- Cobrir fluxos criticos primeiro (servicos e hooks principais).
- Adicionar testes de regressao para bugs historicos.
- Consolidar Definition of Done da refatoracao.

## Regras Operacionais
- Nao quebrar compatibilidade do Next.js para adotar ferramentas externas.
- Evitar alteracoes massivas em um unico commit.
- Validar a cada lote: lint, type-check, build e testes relevantes.
- Documentar decisoes de precedencia no style guide do projeto.

## Politica de GTS
- Nao executar `npx gts init` diretamente no branch principal neste momento.
- Se necessario, usar branch de prova de conceito para medir impacto.
- Aplicar apenas partes do ecossistema Google que tragam ganho claro e baixo risco.

## Checklist de Entrega por Lote
1. Mudancas pequenas e coesas.
2. Sem regressao funcional observavel.
3. Sem aumento de debt de tipagem.
4. Documentacao atualizada quando houver decisao arquitetural.

## Resultado Esperado
- Codebase mais consistente.
- Menor risco de erro em runtime.
- Processo de evolucao repetivel e mensuravel.
