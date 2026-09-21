# Helena Auler — Terapia Bowen

Landing page estática, em português, com fotos reais, HTML semântico e sem dependências de execução. Node 20+ apenas para preview/build.

## Executar

- `node server.mjs`: preview em http://localhost:4173.
- `node build.mjs`: prepara `dist/` para publicação. Também disponíveis `npm run dev` e `npm run build`.
- A Vercel usa `vercel.json`: preset Other, build `node build.mjs`, saída `dist`.

## Atualizar

- Contato, mensagem do WhatsApp e bairro: `site-config.js`. O HTML contém valores de fallback para visitantes sem JavaScript; sincronize-os se esses dados mudarem.
- Conteúdo e SEO: `index.html`. Estilos e pontos de quebra: `styles.css`.
- Imagens: originais preservados nas pastas fornecidas; versões otimizadas em `assets/`. `optimize-assets.ps1` recria as versões web no Windows com System.Drawing, sem dependências.
- As fontes DM Sans e Manrope são servidas pelo Google Fonts, com fallback local sans-serif.
- Depois de definir o domínio definitivo, adicionar canonical e URL absoluta da imagem Open Graph.

## Vídeos verticais

Há três espaços 9:16: apresentação da técnica pela Helena e dois depoimentos. Enquanto `src` estiver vazio, cada área informa que o vídeo está em breve. Coloque os arquivos MP4/WebM em `assets/`, com nomes sem espaços, e preencha `videos` no `site-config.js`. Configure também uma capa, legendas VTT em português e a transcrição. O player usa controles nativos, sem autoplay e sem baixar o vídeo antes da interação (`preload=none`). Use apenas depoimentos reais autorizados; resultados individuais não são promessas.

## Mensuração

Cada CTA emite `whatsapp_click` no `window.dataLayer`, com `cta_location`: header, hero, terapia, movimento, faq, final ou mobile-fixo. Configure posteriormente um acionador personalizado no GTM e a tag do destino. Nenhum ID de campanha, pixel ou rastreador foi inventado/ativado. O evento registra clique, não comprova envio de mensagem ou conversa. Nenhum conteúdo de saúde é incluído no evento.

## Comportamento

FAQ nativo com `details/summary`; navegação por âncoras; botão flutuante de WhatsApp em desktop e mobile. Links WhatsApp abrem outra aba, com uma mensagem única pré-preenchida. Sem JavaScript, o conteúdo, FAQ, navegação e links básicos permanecem disponíveis.

Não há promessas de cura, prazo ou número fixo de sessões, depoimentos inventados nem formulário de coleta de dados.
