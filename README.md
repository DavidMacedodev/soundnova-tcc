# SoundNova Pro — Experimento TCC

Página experimental para analisar o impacto do tempo de carregamento na experiência do usuário.

| Versão | URL (após publicar no GitHub Pages) |
|---|---|
| Índice | `https://SEU_USUARIO.github.io/soundnova-tcc/` |
| Controlada | `https://SEU_USUARIO.github.io/soundnova-tcc/controlada/` |
| Otimizada | `https://SEU_USUARIO.github.io/soundnova-tcc/otimizada/` |

## Estrutura

```text
soundnova-tcc/
├── .nojekyll          # evita processamento Jekyll no GitHub Pages
├── README.md
├── index.html         # hub com links para as duas versões
├── controlada/        # baseline (V1) — medir primeiro
│   ├── index.html
│   ├── css/
│   ├── js/
│   ├── assets/
│   └── BASELINE_VERSAO_CONTROLADA.md
└── otimizada/         # V2 — copiar controlada e otimizar depois
    └── index.html
```

## Servir localmente

Na pasta `soundnova-tcc/`:

```powershell
python -m http.server 5500
```

- Índice: http://127.0.0.1:5500/
- Controlada: http://127.0.0.1:5500/controlada/
- Otimizada: http://127.0.0.1:5500/otimizada/

## Publicar no GitHub Pages

1. Crie um repositório chamado **`soundnova-tcc`** (público, se quiser Pages gratuito na conta free).
2. Envie o conteúdo desta pasta (`soundnova-tcc/`) para a raiz do repositório — não a pasta pai `trabalho_tcc`.
3. No GitHub: **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: `main` (ou `master`)
   - Folder: **/ (root)**
4. Aguarde alguns minutos e abra `https://SEU_USUARIO.github.io/soundnova-tcc/controlada/`.

O arquivo `.nojekyll` garante que pastas e arquivos estáticos (incluindo os que começam com `_`, se houver) sejam servidos sem o Jekyll.

### Comandos Git (exemplo)

```powershell
cd soundnova-tcc
git init
git add .
git commit -m "Adiciona versão controlada do experimento SoundNova Pro"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/soundnova-tcc.git
git push -u origin main
```

Substitua `SEU_USUARIO` pelo seu usuário do GitHub.

## Fluxo do experimento

1. Medir a pasta **`controlada/`** (baseline registrada).
2. Quando for criar a V2: copie `controlada/` → `otimizada/` (substituindo o placeholder) e aplique só as otimizações do plano.
3. Medir **`otimizada/`** com as mesmas condições de rede, dispositivo e ferramenta.
4. Manter conteúdo e layout equivalentes entre as duas versões.

## Notas

- SoundNova Pro é um produto fictício para fins acadêmicos.
- Detalhes da baseline: `controlada/BASELINE_VERSAO_CONTROLADA.md`.
