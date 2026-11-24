# SoundNova Pro — Registro da versão controlada (baseline)

**Identificação:** V1 — Versão controlada  
**Data do registro:** 2026-11-24  
**Pasta:** `soundnova-tcc/controlada/`  
**URL prevista (GitHub Pages):** `https://SEU_USUARIO.github.io/soundnova-tcc/controlada/`  
**Objetivo:** baseline estável para comparação com a versão otimizada no TCC.

## Escopo desta versão

- Página de apresentação do produto fictício SoundNova Pro.
- Tecnologias: HTML5, CSS3 e JavaScript (sem build, sem minificação).
- Sem técnicas de otimização de desempenho destinadas ao experimento (sem `loading="lazy"`, preload, WebP/AVIF, compressão adicional de imagens ou minificação).

## Alterações de estabilidade aplicadas nesta etapa

| Alteração | Motivo |
|---|---|
| Dimensões declaradas de `hero.jpg` e `detail.jpg` corrigidas para 1248×832 | Os atributos `width`/`height` estavam incorretos (800×800 e 960×720); correção de fidelidade do HTML, não otimização. |
| `scroll-padding-top` no `html` | Âncoras não ficam ocultas sob o header sticky. |
| Menu mobile fecha ao clicar fora / Escape | Interação mais consistente. |
| Feedback do CTA sem `white-space: nowrap` rígido | Evita corte de texto em telas estreitas. |
| `font-weight: 750` → `700` no título | Valor padrão tipográfico mais previsível entre navegadores. |
| Remoção de `fone3.avif` da pasta servida | Arquivo **não referenciado** no HTML/CSS/JS; não era carregado pela página. |
| Remoção de `assets.zip` e `assets.7z` da pasta servida | Arquivos auxiliares (~1,1 MB cada) fora do escopo da página; movidos para `_nao_servidos/`. |

Nenhuma imagem utilizada foi redimensionada, comprimida ou convertida nesta etapa.

## Recursos realmente utilizados pela página

Inventário a partir das referências em `index.html` e confirmação via HTTP (servidor local).

### Documentos e scripts

| Recurso | Tamanho (bytes) | Observação |
|---|---:|---|
| `/` (`index.html`) | 11 244 | Documento principal |
| `/css/styles.css` | 12 632 | Folha de estilos única |
| `/js/main.js` | 3 143 | Menu, âncoras ativas e CTA simulada |

### Imagens de produto e avatares

| Recurso | Dimensões | Tamanho (bytes) | Uso |
|---|---|---:|---|
| `assets/images/hero.jpg` | 1248×832 | 124 545 | Hero |
| `assets/images/detail.jpg` | 1248×832 | 256 923 | Seção de detalhes |
| `assets/images/avatar-ana.jpg` | 1024×1024 (exibida em 48×48) | 272 983 | Avaliações |
| `assets/images/avatar-lucas.jpg` | 1024×1024 (exibida em 48×48) | 234 518 | Avaliações |
| `assets/images/avatar-mariana.jpg` | 1024×1024 (exibida em 48×48) | 316 231 | Avaliações |

### Ícones SVG

| Recurso | Tamanho (bytes) |
|---|---:|
| `logo.svg` | 382 |
| `noise-cancel.svg` | 300 |
| `battery.svg` | 416 |
| `fast-charge.svg` | 222 |
| `bluetooth.svg` | 381 |
| `check.svg` | 267 |
| `youtube.svg` | 418 |
| `instagram.svg` | 313 |
| `x.svg` | 193 |
| `facebook.svg` | 206 |

**Soma aproximada dos arquivos únicos transferíveis:** ~1,21 MB (~1 235 317 bytes na conferência HTTP de 2026-11-24).

### Observações para a medição

- `logo.svg` aparece duas vezes no HTML (cabeçalho e rodapé); `check.svg` três vezes. Com cache do navegador, a segunda/terceira requisição tende a vir do disco/cache — registrar se a auditoria estiver com cache desabilitado.
- Avatares são arquivos grandes para o tamanho de exibição (48×48). **Não otimizar agora**; candidatos naturais à versão otimizada.
- `fone3.avif` **não** faz parte desta baseline servida.

## Arquivos movidos para fora do serviço

Pasta: `../_nao_servidos/`

- `fone3.avif` — não utilizado pela página
- `assets.zip` / `assets.7z` — pacotes auxiliares, não referenciados

## Checklist de medição (versão controlada)

- [x] A página abre e funciona sem erros que alterem o teste.
- [x] Conteúdo, layout e interações estão definidos para esta baseline.
- [x] Os recursos realmente carregados foram conferidos (HTTP/Network).
- [x] A versão foi identificada como **controlada** (este arquivo).
- [x] Nenhuma otimização nova de desempenho foi introduzida nesta etapa.
- [ ] Condições de medição (navegador, dispositivo, rede, nº de execuções) — preencher na coleta com o orientador.

## Sugestão de condições de teste (a confirmar)

Registrar e repetir na versão otimizada:

- Navegador e versão (ex.: Chrome)
- Dispositivo / viewport (desktop e mobile)
- Rede DevTools (ex.: Slow 4G ou No throttling — escolher uma e manter)
- Cache desabilitado na aba Network durante a coleta
- Ferramenta: Chrome DevTools (Network + Lighthouse)
- Métricas planejadas: LCP, FCP, TBT, TTFB, CLS, Speed Index, Load, DOMContentLoaded

## Como servir esta baseline

```powershell
cd soundnova-tcc
python -m http.server 5500
```

Abrir: http://127.0.0.1:5500/controlada/

## O que fica para a versão otimizada

- Redimensionar/comprimir avatares
- Avaliar WebP/AVIF para `hero.jpg` e `detail.jpg`
- Estratégias de carregamento de imagens, se as métricas indicarem
- Revisar efeitos CSS / scroll listener se houver impacto mensurável
