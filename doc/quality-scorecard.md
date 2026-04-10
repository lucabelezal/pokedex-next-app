# Quality Scorecard (Rumo ao 10/10)

## Objetivo
Ter uma régua objetiva para evolução contínua de qualidade técnica no projeto.

## Dimensões e pesos

| Dimensão | Peso | Critério de 10/10 |
|---|---:|---|
| Arquitetura e composição | 25% | Componentes com responsabilidade única, baixo acoplamento, composição explícita |
| Type safety | 25% | Contratos de entrada/saída validados, sem debt crítico de tipagem |
| Testes e estabilidade | 20% | Cobertura de fluxos críticos com cenários felizes e de erro |
| Build e performance | 15% | Build sempre verde, sem regressões evidentes de experiência |
| DX e governança | 10% | Gates de qualidade no ciclo de PR/CI |
| Documentação técnica | 5% | Guias e checklist atualizados e aplicáveis |

## Escala de pontuação

- 0-3: frágil
- 4-6: aceitável
- 7-8: bom
- 9-10: excelente

## Baseline atual (estimativa)

| Dimensão | Nota atual | Meta |
|---|---:|---:|
| Arquitetura e composição | 8.2 | 10 |
| Type safety | 9.0 | 10 |
| Testes e estabilidade | 8.8 | 10 |
| Build e performance | 8.5 | 10 |
| DX e governança | 8.5 | 10 |
| Documentação técnica | 9.0 | 10 |

## Plano operacional

1. Fase 0: critérios e governança
2. Fase 1: composição e fronteiras arquiteturais
3. Fase 2: hardening de type safety
4. Fase 3: testes de regressão de fluxos críticos
5. Fase 4: otimizações e estabilidade contínua

## Status das fases

- Fase 0: concluída
- Fase 1: em progresso
- Fase 2: concluída
- Fase 3: em progresso (avançado)
- Fase 4: em progresso

## Progresso recente

1. Scorecard e DoD documentados.
2. PR template padronizado.
3. Qualidade automatizada em CI (`.github/workflows/quality.yml`).
4. Build blocker de onboarding resolvido.
5. Hardening de type safety e validações runtime aplicados em rotas/hook.
6. Suíte de testes unitários e de contrato criada e estabilizada.
7. Testes de hook (`useFavorites`) e UI (`FavoritesClient`) adicionados.
8. Base atual: 6 arquivos de teste e 23 testes passando.

## Definition of Done (DoD)

Uma entrega só é considerada pronta quando:

1. `npm run check` está verde.
2. `npm test` está verde.
3. `npm run build` está verde.
4. Não introduz dívida crítica de tipagem.
5. Inclui atualização de documentação quando altera decisões de arquitetura.
