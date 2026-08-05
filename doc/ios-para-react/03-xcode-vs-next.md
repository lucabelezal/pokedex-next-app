# Xcode vs Next.js: Ferramentas e Fluxo

## Build e Run

| | Xcode | Next.js |
|---|---|---|
| Compilar | `Cmd+B` (Build) | `npm run build` |
| Rodar | `Cmd+R` (Run) | `npm run dev` (dev) / `npm start` (prod) |
| Hot Reload | SwiftUI Preview | Turbopack HMR (instantâneo) |
| Simulador | iOS Simulator | Chrome DevTools Device Mode |
| Device real | iPhone conectado | Qualquer browser no WiFi |

## Estrutura do Projeto

```
Xcode                        Next.js
─────                        ───────
PokedexApp/                  src/
├── App.swift                ├── app/layout.tsx       (root)
├── Views/                   ├── app/
│   ├── PokemonList.swift    │   ├── pokedex/page.tsx
│   └── PokemonDetail.swift  │   └── pokedex/[id]/page.tsx
├── Models/                  ├── lib/
│   └── Pokemon.swift        │   └── pokedex-types.ts
├── Services/                ├── lib/
│   └── PokeAPIClient.swift  │   └── pokeapi-client.ts
└── Assets.xcassets/         ├── public/assets/
```

## Debugging

| | Xcode | Next.js |
|---|---|---|
| Breakpoint | Clique na linha | `debugger;` ou Chrome DevTools |
| Console | `print()` / Console.app | `console.log()` / DevTools |
| Network | Network tab do Xcode | DevTools → Network |
| Performance | Instruments | DevTools → Performance / Lighthouse |
| Memory | Memory Graph | DevTools → Memory |

## Dependências

```swift
// Swift — Swift Package Manager (Package.swift)
dependencies: [
    .package(url: "https://github.com/Alamofire/Alamofire.git", from: "5.0.0"),
]
```

```json
// JavaScript — npm (package.json)
{
  "dependencies": {
    "next": "16.3.0",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  }
}
```

Instalar: `npm install` (equivalente a `File → Packages → Resolve Package Versions`)

## Deploy

| | Xcode | Next.js |
|---|---|---|
| Desenvolvimento | Simulador | `npm run dev` (localhost:3000) |
| Teste | TestFlight | Preview deploy (Vercel) |
| Produção | App Store Connect | `npm run build` + deploy (Vercel/Cloudflare) |
| CDN | App Store CDN | Edge Network (Vercel) |

O Next.js build gera HTML estático (SSG) para 926 páginas — equivalente a pré-compilar todas as telas do app.

## Variáveis de Ambiente

```swift
// Swift — Info.plist ou xcconfig
let apiURL = Bundle.main.object(forInfoDictionaryKey: "API_URL") as! String
```

```bash
# Next.js — arquivos .env
# .env.local
NEXT_PUBLIC_API_URL=https://pokeapi.co/api/v2
```

```ts
// Acesso no código
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

`NEXT_PUBLIC_*` são expostas ao browser. Sem o prefixo, são server-only.

## CI/CD

```yaml
# .github/workflows/quality.yml
- run: npm run check    # lint + type-check
- run: npm run test     # 54 testes
- run: npm run build    # 926 páginas SSG
```

Equivalente a: Xcode Cloud ou Fastlane lane com testes unitários + build.

## Comandos equivalentes

| Ação | Xcode | Terminal |
|---|---|---|
| Novo projeto | File → New → Project | `npx create-next-app` |
| Instalar deps | Add Package | `npm install` |
| Rodar | `Cmd+R` | `npm run dev` |
| Testar | `Cmd+U` | `npm run test` |
| Build | `Cmd+B` | `npm run build` |
| Lint | — | `npm run lint` |
| Type check | Build já verifica | `npm run type-check` |
| Limpar build | `Cmd+Shift+K` | `rm -rf .next` |
| Git | Source Control | `git` CLI (terminal) |
