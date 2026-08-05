# Documentação — Pokédex Mobile

Imersão de um dev iOS no ecossistema TypeScript, React e Next.js.

## Estrutura

```
doc/
├── typescript/           ← TypeScript para devs iOS
│   ├── 01-fundamentos.md
│   ├── 02-generics.md
│   ├── 03-unions-narrowing.md
│   ├── 04-utility-types.md
│   ├── 05-modules.md
│   └── 06-padroes-projeto.md
├── nextjs/               ← Next.js App Router
│   ├── 01-app-router.md
│   ├── 02-server-client.md
│   ├── 03-rendering.md
│   ├── 04-hooks.md
│   ├── 05-context.md
│   ├── 06-view-transitions.md
│   ├── 07-testing.md
│   └── 08-pwa.md
├── ios-para-react/       ← Pontes SwiftUI/UIKit → React
│   ├── 01-swiftui-vs-react.md     ← Leia primeiro!
│   ├── 02-swift-vs-typescript.md
│   └── 03-xcode-vs-next.md
└── README.md             ← Este arquivo
```

## Roteiro de imersão

### Se você vem do iOS, comece por aqui:

1. **ios-para-react/01-swiftui-vs-react.md** — `@State` vs `useState`, `VStack` vs `flex-col`, views vs components
2. **ios-para-react/02-swift-vs-typescript.md** — `struct` vs `type`, `enum` vs union, `Optional` vs `| null`
3. **ios-para-react/03-xcode-vs-next.md** — build, debug, deploy, comandos

### Depois, TypeScript:

4. **typescript/01-fundamentos.md** — tipos, interfaces, funções, arrays
5. **typescript/02-generics.md** — `<T>`, `Promise<T>`, `Record<K,V>`
6. **typescript/03-unions-narrowing.md** — union types, type predicates, `as const`
7. **typescript/04-utility-types.md** — `Partial`, `Pick`, `ReturnType`, `Awaited`
8. **typescript/05-modules.md** — ES modules, path aliases `@/`, barrel exports
9. **typescript/06-padroes-projeto.md** — como o projeto aplica cada conceito

### Por último, Next.js:

10. **nextjs/01-app-router.md** — pages, layouts, loading, error, params
11. **nextjs/02-server-client.md** — RSC vs Client Components, "use client"
12. **nextjs/03-rendering.md** — SSG (força-static), SSR, ISR, fetch cache
13. **nextjs/04-hooks.md** — useState, useEffect, useMemo, useCallback, custom hooks
14. **nextjs/05-context.md** — Context API, Providers, `FavoritesProvider`
15. **nextjs/06-view-transitions.md** — push navigation, shared element morph, CSS animations
16. **nextjs/07-testing.md** — Vitest, Testing Library, mocking, padrões
17. **nextjs/08-pwa.md** — Service Worker, cache strategies, manifest

## Como estudar

Abra dois terminais:

```bash
# Terminal 1: leia a doc
cat doc/ios-para-react/01-swiftui-vs-react.md

# Terminal 2: explore o código
code src/components/pokemon-card.tsx
```

Cada doc tem exercícios práticos no final. Faça-os — aponte para arquivos reais do projeto.

## Glossário rápido

| iOS/Swift | React/Next.js |
|---|---|
| View | Component |
| `struct` | `type` (type alias) |
| `@State` | `useState()` |
| `@Binding` | Props + callback |
| `@EnvironmentObject` | Context + `useContext()` |
| `.onAppear` | `useEffect(() => {}, [])` |
| ViewModel | Custom Hook |
| `NavigationLink` | `<Link href>` |
| `VStack` | `flex flex-col` (Tailwind) |
| `Spacer()` | `flex-1` (Tailwind) |
| SPM (Package.swift) | npm (package.json) |
| Xcode Cloud | GitHub Actions |
