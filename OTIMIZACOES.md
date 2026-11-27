# SoundNova Pro — registro da versão otimizada (V2)

Baseline de comparação: commit `ada4aa7a8d1aa0764f5bec681a50b46dc7b57b4e` (`ada4aa7`, “Finalize controlled version for performance testing”). `git rev-parse HEAD` confirmou esse commit antes das alterações. `git diff --exit-code ada4aa7a8d1aa0764f5bec681a50b46dc7b57b4e -- controlada/` permaneceu com saída 0 ao final. Nenhum arquivo de `controlada/` foi modificado.

Nenhum commit e nenhuma publicação foram feitos. Os números abaixo são inventário de arquivos e observações locais de carregamento. Não são amostra oficial de Lighthouse, Network ou Performance.

## Ferramentas

- Python 3.13.3 e Pillow 13.0.0, com libwebp 1.6.0, em ambiente virtual fora do site: `soundnova-medicoes/.venv-pillow`.
- Conversão: `ImageOps.exif_transpose`, `convert('RGB')`, `Image.Resampling.LANCZOS`, WebP `method=6`. Os cinco JPEG não tinham perfil ICC nem EXIF.
- Servidor local: `python -m http.server 5500 --bind 127.0.0.1`. Sem `--bind`, o processo escutou em `[::]:5500` e respondeu vazio (`curl` exit 52). Com o bind, as respostas foram `HTTP/1.0 200` (`SimpleHTTP/0.6 Python/3.13.3`).
- Chrome instalado em `C:\Program Files\Google\Chrome\Application\chrome.exe`, controlado por puppeteer-core 25.18.1 já presente em `soundnova-medicoes`. Cache desabilitado nas checagens de `currentSrc` e de rede.

## OPT00 — Preparação

A pasta `otimizada/` recebeu cópia de `controlada/index.html`, `css/`, `js/` e `assets/`, substituindo o placeholder. `BASELINE_VERSAO_CONTROLADA.md` não foi copiado. Caminhos relativos e `.nojekyll` foram mantidos.

Capturas da versão controlada, antes das mudanças de HTML/JS/imagens da V2, ficaram fora do repositório publicado, em `soundnova-medicoes/evidencias-visuais/referencia/`. Dimensões conferidas com Pillow: 412×823, 1350×940, 320×823, 720×900, 960×900 e 1920×1080, além de janelas altas 412×6400 e 1350×4200.

## OPT01 — Avatares

Problema: cada avatar tinha 1024×1024 px e era exibido a 48×48 px.

Alteração: `avatar-ana.webp`, `avatar-lucas.webp` e `avatar-mariana.webp`, 144×144, qualidade 80. Não houve ampliação. Qualidade mantida após inspeção visual e após o erro absoluto médio abaixo. Os `src` em `otimizada/index.html` apontam para esses arquivos, com `width="48"` `height="48"` `alt=""` preservados.

Erro absoluto médio por canal (0–255), WebP decodificado contra o JPEG redimensionado com Lanczos para o mesmo tamanho:

| Arquivo | 144 px | 48 px |
|---|---:|---:|
| avatar-ana | 2,518 / 1,966 / 2,459 | 1,484 / 0,971 / 1,536 |
| avatar-lucas | 2,098 / 1,682 / 2,320 | 1,249 / 0,891 / 1,536 |
| avatar-mariana | 3,083 / 2,243 / 3,082 | 1,750 / 1,008 / 2,026 |

| Arquivo | Bytes antes | Bytes depois |
|---|---:|---:|
| avatar-ana | 272983 | 2192 |
| avatar-lucas | 234518 | 1842 |
| avatar-mariana | 316231 | 2806 |
| Soma | 823732 | 6840 |

Os três arquivos ficaram abaixo da meta indicativa de 15 KB. Essa meta não foi usada para baixar a qualidade.

## OPT02 — Hero e detalhe

Problema: `hero.jpg` (124545 bytes, 1248×832) e `detail.jpg` (256923 bytes, 1248×832) eram servidos em tamanho único. O hero é limitado pelo CSS a 520 px no desktop e a 360 px até 960 px. O detalhe usa `aspect-ratio: 4/3` e `object-fit: cover`; os arquivos continuam em 3:2, e o recorte visual segue no CSS.

Qualidade 82, Lanczos, sem ampliação. Erro absoluto médio por canal contra o JPEG redimensionado ao mesmo tamanho: hero 0,84–1,31; detalhe 1,54–1,78. A qualidade não foi alterada.

| Variante | Pixels | Bytes |
|---|---|---:|
| hero-360.webp | 360×240 | 3016 |
| hero-720.webp | 720×480 | 7762 |
| hero-1050.webp | 1050×700 | 13168 |
| hero-1248.webp | 1248×832 | 17384 |
| detail-480.webp | 480×320 | 10970 |
| detail-768.webp | 768×512 | 30194 |
| detail-1050.webp | 1050×700 | 55810 |
| detail-1248.webp | 1248×832 | 76590 |

A soma das variantes armazenadas não é o volume transferido em uma navegação. Cada viewport baixa um hero e um detalhe.

`sizes` do hero, depois da medição de `getBoundingClientRect().width` na versão controlada (fonte 16 px):

```text
(max-width: 400px) calc(100vw - 2.5rem), (max-width: 960px) 360px, (max-width: 1160px) calc((100vw - 5.5rem) * 0.475), 509px
```

O exemplo do plano usava `510px` no fallback. De 961 a 1160 px a fórmula coincidiu com a caixa medida (961 px → 414,67 px; 1100 px → 480,69 px; 1160 px → 509,19 px). A partir de 1160 px a largura medida permaneceu 509,19 px, então o fallback foi ajustado para `509px`.

`sizes` do detalhe foi usado como no plano e coincidiu com a medição (412 px → 372 px; 961 px → 432,5 px; 1160 px e acima → 532 px):

```text
(max-width: 960px) calc(100vw - 2.5rem), (max-width: 1160px) calc((100vw - 6rem) / 2), 532px
```

`width="1248"` e `height="832"` foram mantidos. Os JPEG deixaram de ser referenciados em `otimizada/` e foram removidos somente dessa pasta. Os arquivos em `controlada/assets/images/` permanecem.

`currentSrc` observado na V2, cache desabilitado, depois de rolar até o fim. Todas as imagens terminaram `complete` com dimensão intrínseca maior que zero. O `naturalWidth` de candidato escolhido via `srcset` é a largura corrigida pela densidade; as dimensões de arquivo são as da tabela acima.

| Viewport | DPR | Hero | Detalhe |
|---|---:|---|---|
| 320×823 | 1 | hero-360.webp | detail-480.webp |
| 412×823 | 1 | hero-360.webp | detail-480.webp |
| 412×823 | 2 | hero-720.webp | detail-768.webp |
| 412×823 | 3 | hero-1248.webp | detail-1248.webp |
| 720×900 | 1 | hero-360.webp | detail-768.webp |
| 720×900 | 2 | hero-720.webp | detail-1248.webp |
| 960×940 | 1 | hero-360.webp | detail-1050.webp |
| 961×940 | 1 | hero-720.webp | detail-480.webp |
| 961×940 | 2 | hero-1050.webp | detail-1050.webp |
| 1100×940 | 1 | hero-720.webp | detail-768.webp |
| 1160×940 | 1 | hero-720.webp | detail-768.webp |
| 1350×940 | 1 | hero-720.webp | detail-768.webp |
| 1350×940 | 2 | hero-1050.webp | detail-1248.webp |
| 1920×1080 | 1 | hero-720.webp | detail-768.webp |
| 1920×1080 | 2 | hero-1050.webp | detail-1248.webp |
| 1920×1080 | 3 | hero-1248.webp | detail-1248.webp |

Em 720×900 com DPR 2 e em 1920×1080 com DPR 3, o detalhe precisaria de mais de 1248 px de recurso. O maior arquivo disponível foi usado, sem ampliação na geração.

## OPT03 — Carregamento

O hero permanece no HTML inicial, com `loading="eager"` e `fetchpriority="high"`. Não foi adicionado `preload`.

Avatares: `loading="lazy"` e `decoding="async"`.

O detalhe recebeu `loading="lazy"` e `decoding="async"` porque, nos viewports de referência, o topo da imagem ficou fora da área inicial: 1590 px em 412×823 e 951 px em 1350×940 (altura 940 px). Em 1920×1080 o topo continua em 951 px, então a imagem intersecta a viewport. Em 1100×940 o topo ficou em 934,84 px, alguns pixels dentro da área inicial. `loading="lazy"` não impede o carregamento do que já está visível.

Observação local, cache desabilitado, 800 ms após `load`, antes de rolar:

| Viewport | Imagens já pedidas | Depois de rolar até o fim |
|---|---|---|
| 412×823, DPR 1 | hero-360.webp (3016 B), detail-480.webp (10970 B) | avatares, 6840 B no total |
| 1350×940, DPR 1 | hero-720.webp (7762 B), detail-768.webp (30194 B) | avatares, 6840 B no total |
| 1920×1080, DPR 1 | hero, detalhe e os três avatares | nenhuma imagem nova |

O Chrome antecipou o detalhe em 412×823 e 1350×940, embora ele começasse abaixo da dobra. Os avatares só entraram depois da rolagem nesses dois tamanhos. Em 1920×1080 a distância de antecipação também alcançou os avatares dentro da janela de 800 ms. Não houve URL de imagem repetida. Todas as respostas dessa navegação foram HTTP 200. A soma dos `Content-Length` que não eram o documento HTML foi 40162 bytes em 412×823 e 64132 bytes em 1350×940 e 1920×1080, incluindo CSS, JS, ícones SVG e as imagens efetivamente pedidas. Isso não é tempo de carregamento.

Os dez SVG foram mantidos.

## OPT04 — JavaScript

`otimizada/js/main.js` passou de 3143 para 3606 bytes. O script está no `<head>` com `defer`. Não usa `async`. A inclusão no fim do `body` foi removida. Há uma única inicialização.

`navMap` ficou fora de `updateActiveLink`. A classe `is-active` só é reescrita quando o id ativo muda. Os eventos de `scroll` compartilham um único `requestAnimationFrame` pendente. Há atualização inicial e nos eventos `load` e `resize`. A regra de seleção por posição e a compensação `header.offsetHeight + 24` foram preservadas.

Menu, `aria-expanded`, `aria-label`, Escape, clique fora, fechamento ao seguir um link e a mensagem da compra simulada por 4 segundos foram exercitados em Chrome headless. O texto exibido foi “Simulação: nenhuma compra foi realizada. SoundNova Pro é um produto fictício.” e voltou a `hidden` após 4,2 s. O skip link continua `href="#conteudo"`.

Com `scrollIntoView({ behavior: "instant" })` em 1350×940, as duas versões produziram o mesmo link ativo e o mesmo `scrollY`:

| Seção | Link ativo | scrollY |
|---|---|---:|
| inicio | #inicio | 0 |
| recursos | #recursos | 551 |
| especificacoes | #especificacoes | 787 |
| experiencia | #especificacoes | 1346 |
| avaliacoes | #avaliacoes | 1862 |
| comprar | #avaliacoes | 1923 |

Não foi usado `IntersectionObserver`.

## OPT05 — CSS

`otimizada/css/styles.css` é cópia byte a byte de `controlada/css/styles.css` (12632 bytes, SHA-256 `dd7918f5fa46c6f74ec98364722527b48296d7ec6cbb34fdc7623abbc9cba51d`).

Regras inspecionadas e mantidas: `.site-header` com `backdrop-filter: blur(12px)`, `.hero-glow` com `blur(20px)`, `.hero-media::before` com `blur(8px)`, `.hero-media img` com `drop-shadow` e `float-hero` de 5,5 s, além de `prefers-reduced-motion`. Nas duas versões, `animationName` do hero foi `float-hero` e, com movimento reduzido, `none`. O header permaneceu `position: sticky`.

Não houve comparação pareada de Paint, Raster ou thread principal com e sem esses filtros. Sem essa evidência, os filtros e a animação não foram simplificados. Também não foram adicionados `will-change`, CSS crítico duplicado, `content-visibility` nem minificação. Não há service worker nem tentativa de alterar cache do GitHub Pages.

## OPT06 — Validação

Servidor em `http://127.0.0.1:5500/controlada/` e `http://127.0.0.1:5500/otimizada/`.

Geometria idêntica entre as versões em 320×823, 412×823, 720×900, 960×940, 961×940, 1100×940, 1160×940, 1350×940 e 1920×1080: `scrollHeight`, largura e altura do hero, largura, altura e topo do detalhe. `scrollWidth - clientWidth` foi 0 em todos. Alturas de página coincidentes: 5550, 4960, 4723, 4430, 2821, 2809, 2848, 2863 e 2863 px, na mesma ordem.

Comparação de capturas com `prefers-reduced-motion`, fora do repositório, em `soundnova-medicoes/evidencias-visuais/comparacao/`. Erro absoluto médio da página e caixa da diferença:

| Captura | MAE | Onde a diferença passou de 12 níveis |
|---|---:|---|
| 412×823 | 0,279 | somente a área do hero |
| 1350×940 | 0,113 | somente a área do hero |
| 320×823 | 0,215 | somente a área do hero |
| 720×900 | 0,146 | somente a área do hero |
| 960×940 | 0,105 | somente a área do hero |
| 1920×1080 | 0,113 | hero e o topo do detalhe, visível nesse viewport |
| 412×4960, página inteira | 0,570 | hero, detalhe e os três avatares |
| 1350×2863, página inteira | 0,352 | hero, detalhe e os três avatares |

A máscara da diferença não mostrou deslocamento de texto, botões, ícones ou seções. A diferença nas fotos é a da recompressão e do redimensionamento.

Console sem erros de página nas navegações de 412×823, 1350×940, 1920×1080 e no roteiro de menu/CTA. Nenhuma resposta diferente de 200 nessas coletas. Não há `preload` nem caminho absoluto `/assets/`.

O cartão da raiz em `index.html` deixou de dizer “Em preparação”. O índice não entra nos testes de desempenho.

## Tabela de técnicas

| ID | Problema/evidência | Alteração e arquivos | Bytes antes/depois | Métrica esperada | Validação | Commit |
|---|---|---|---|---|---|---|
| OPT00 | Placeholder no lugar da página equivalente | Cópia de HTML, CSS, JS e assets para `otimizada/`; baseline `ada4aa7` intacta | CSS 12632 = 12632 | Nenhuma, etapa de preservação | `git diff` de `controlada/` vazio; capturas de referência | não realizado |
| OPT01 | Avatares 1024 px para exibição de 48 px | WebP 144 px, qualidade 80, em `otimizada/assets/images/` e três `src` | 823732 → 6840 no conjunto dos três arquivos | Menos bytes por avatar na transferência; LCP não depende desses arquivos | Dimensão 144×144, erro médio e inspeção visual; meta de 15 KB atendida sem baixar a qualidade | não realizado |
| OPT02 | JPEG único maior que a caixa CSS | `srcset`/`sizes` do hero e do detalhe; fallback do hero ajustado para 509 px | Hero armazenado 124545 → variantes 3016–17384; detalhe 256923 → 10970–76590. Transferência é uma variante, não a soma | Menos bytes no recurso de imagem escolhido pelo viewport | `currentSrc` na tabela acima; caixas CSS iguais às da V1 | não realizado |
| OPT03 | Detalhe e avatares competiam com o hero sem prioridade explícita | Hero eager e `fetchpriority="high"`, sem preload; detalhe e avatares lazy e `decoding="async"` | Em 1350×940, DPR 1, o par pedido antes da rolagem foi 7762 + 30194 bytes de imagem | Hero descoberto no HTML e com prioridade alta; avatares fora da primeira tela podem esperar a rolagem | Sem URL duplicada; avatares ausentes nos primeiros 800 ms em 412 e 1350; detalhe foi antecipado pelo Chrome mesmo abaixo da dobra | não realizado |
| OPT04 | `updateActiveLink` lia layout e alternava classes a cada evento de scroll | `defer` no head, `navMap` externo, rAF único, classe só quando o id muda; `otimizada/js/main.js` | 3143 → 3606 | Menos trabalho repetido de estilo por evento de scroll. Não foi medido longo task nem INP | Link ativo e `scrollY` iguais aos da V1; menu, Escape, clique fora, CTA de 4 s | não realizado |
| OPT05 | Filtros e animação existem; custo não estava isolado | Nenhuma alteração de CSS | 12632 = 12632 | Não aplicável: técnica não adotada | Hash idêntico; animação e `prefers-reduced-motion` conferidos | não realizado |
| OPT06 | V2 precisa permanecer equivalente e publicável | Checagens locais e atualização do cartão em `index.html` | — | Prontidão para coleta, sem meta de score | Geometria, capturas, HTTP 200 e ausência de erro de console nas rotinas executadas | não realizado |

## Técnicas não adotadas

- AVIF: não foi gerado. O plano só o admite com benefício medido e sem regressão de decodificação. WebP ficou como único formato novo.
- Preload do hero: a imagem já está no HTML. Não houve trace mostrando atraso de descoberta, e um preload responsivo poderia baixar o arquivo duas vezes.
- Minificação de CSS ou JS: o CSS tem 12632 bytes e o JS 3606. Não foi introduzido empacotador. As folhas legíveis continuam sendo as únicas carregadas.
- `will-change`, `content-visibility` e CSS crítico duplicado: não usados.
- Remoção ou simplificação de blur e da animação: não houve medição pareada que atribuísse custo a essas regras.
- `IntersectionObserver` para o menu ativo: a seleção por `getBoundingClientRect` foi mantida e comparada com a V1.
- Cabeçalhos de cache, service worker, CDN, fontes e bibliotecas: não introduzidos.

## Pendências

- Commit e push não autorizados. A V2 ainda não está em `https://davidmacedodev.github.io/soundnova-tcc/otimizada/`.
- Coletas oficiais L01, L02 e N01 da V2 não foram feitas. Resultados locais de desenvolvimento não entram na amostra.
- Os nove traces de Performance da V1 continuam sem consolidação. P01 da V2 depende dessa regra de inclusão.
- N02–N05 seguem adiados, como no plano.
- OPT05 não produziu trace que separe o custo dos filtros. O CSS permanece igual ao da versão controlada.
