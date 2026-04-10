---
name: conventional-commits
description: 'Escreve mensagens de commit no padrão Conventional Commits. Use quando precisar formatar um commit, revisar mensagens, ou entender o padrão. Gatilho: "como fazer commit", "mensagem de commit", "qual tipo usar", "como documentar breaking change".'
argument-hint: 'Descreva o que foi alterado para gerar a mensagem'
---

# Conventional Commits

## Quando Usar
- Formatar uma mensagem de commit antes de commitar
- Revisar se uma mensagem segue o padrão
- Entender qual tipo usar para uma mudança específica
- Documentar breaking changes corretamente

## Formato

```
<tipo>[escopo opcional]: <descrição curta>

[corpo opcional]

[rodapé opcional]
```

### Regras Básicas
- Descrição em **letras minúsculas**, sem ponto final
- Máximo **72 caracteres** na primeira linha
- Use imperativo: "adiciona" não "adicionado" ou "adicionando"
- Escreva em **português**

---

## Tipos

| Tipo | Quando usar | Exemplo |
|------|-------------|---------|
| `feat` | Nova funcionalidade visível ao usuário | `feat(discussions): adiciona paginação na listagem` |
| `fix` | Correção de bug | `fix(auth): corrige redirecionamento após login` |
| `refactor` | Refatoração sem mudança de comportamento | `refactor(comments): extrai hook useCommentForm` |
| `test` | Adição ou correção de testes | `test(users): adiciona testes de integração do perfil` |
| `chore` | Tarefas de manutenção, deps, configs | `chore: atualiza dependências do projeto` |
| `docs` | Documentação | `docs: atualiza guia de contribuição` |
| `style` | Formatação, espaços, lint (sem lógica) | `style: corrige indentação no componente Button` |
| `ci` | Mudanças no pipeline de CI/CD | `ci: adiciona job de type check no workflow` |
| `perf` | Melhoria de performance | `perf(discussions): adiciona prefetch na listagem` |
| `build` | Sistema de build, bundler, scripts | `build: migra para vite 6` |

---

## Escopos do Projeto

Use os nomes das features, apps ou camadas como escopo:

| Escopo | O que cobre |
|--------|-------------|
| `auth` | Login, registro, sessão |
| `discussions` | Listagem, criação, edição, exclusão de discussões |
| `comments` | Comentários em discussões |
| `teams` | Gerenciamento de times |
| `users` | Perfil, dados de usuário |
| `components` | Componentes compartilhados (`src/components/ui/`) |
| `hooks` | Hooks compartilhados |
| `api` | Camada de API client, interceptors |
| `config` | Configurações de ambiente ou paths |
| `testing` | Utilitários de teste, mocks, MSW handlers |
| `e2e` | Testes Playwright |
| `nextjs-app` | Mudanças específicas do app Next.js App Router |
| `nextjs-pages` | Mudanças específicas do app Next.js Pages Router |
| `react-vite` | Mudanças específicas do app React + Vite |

---

## Breaking Changes

Use `!` após o tipo/escopo para indicar breaking change na primeira linha:

```
feat(api)!: remove endpoint legado /api/v1/users
```

Ou adicione `BREAKING CHANGE:` no rodapé com uma descrição detalhada:

```
refactor(auth)!: altera interface do configureAuth

BREAKING CHANGE: o campo `redirectTo` foi renomeado para `redirectPath`.
Atualize todos os usos de configureAuth no projeto.
```

---

## Exemplos Reais do Projeto

```bash
# Nova funcionalidade
feat(discussions): adiciona filtro por autor na listagem

# Correção de bug
fix(comments): corrige erro ao deletar comentário sem permissão

# Teste de integração
test(auth): adiciona teste de fluxo de registro com email duplicado

# Refatoração de componente
refactor(components): extrai lógica de confirmação para useConfirmDialog

# Atualização de dependência
chore: atualiza react-query para 5.32.0

# CI
ci: adiciona type check como gate no workflow react-vite

# Breaking change com escopo
feat(api)!: altera formato de paginação para cursor-based

BREAKING CHANGE: o campo `page` foi substituído por `cursor`.
Atualize as chamadas de getDiscussions e getComments.
```

---

## Commits com Múltiplas Informações

Se a mudança é grande, use o corpo para detalhar:

```
feat(teams): adiciona RBAC na gestão de membros

Apenas usuários com role ADMIN podem adicionar ou remover membros.
Usuários com role USER passam a visualizar somente a listagem.

Relacionado com a issue #42.
```

---

## Checklist Antes de Commitar

- [ ] Tipo correto para a mudança
- [ ] Escopo reflere a feature/camada afetada
- [ ] Descrição em minúsculas, imperativo, sem ponto
- [ ] Menos de 72 caracteres na primeira linha
- [ ] Breaking change marcada com `!` ou `BREAKING CHANGE:`
