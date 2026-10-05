# Sobre você

Site da enfermeira Claudia Alves de Assis, pós-graduada em psiquiatria, com cursos, vídeos, materiais e atividades sobre comunicação e análise comportamental, planos de assinatura, pedidos de agendamento pelo WhatsApp e um **painel admin com login** para ela editar tudo.

- **Site:** HTML e JavaScript puros, na raiz do repositório, hospedado no GitHub Pages. A única etapa de build é o CSS do Tailwind (veja abaixo).
- **Login e dados:** Firebase (Authentication e Firestore), no plano gratuito.
- **Painel admin:** <https://juliosv-hub.github.io/Sobre-voce/admin/> (link "Área da profissional" no rodapé).

## O que a Claudia edita pelo painel

| Aba | Conteúdo |
|---|---|
| Agendamentos | Ver pedidos, confirmar, cancelar, marcar como concluído e excluir |
| Cursos e vídeos | Criar, editar, reordenar e excluir; tipo, ícone, aulas, duração e link (sem link, o card mostra "Em breve") |
| Materiais | Idem, com número de páginas |
| Atividades | Idem, com duração |
| Textos e dados | Nome, profissão, registro, WhatsApp, e-mail, Instagram, foto, título e subtítulo da página inicial, texto "Sobre a Profissional", destaques, perguntas frequentes, atendimento presencial, horários por dia da semana |
| Planos | Mostrar ou esconder a página de planos; nome, preço mensal e anual, itens incluídos, links de pagamento e plano em destaque |

As alterações aparecem no site na hora.

## Colocar no ar

1. **Configurar o Firebase:** siga o [SETUP-FIREBASE.md](SETUP-FIREBASE.md), o que inclui criar o login da Claudia.
2. **Publicar:** se mudou classes do Tailwind no HTML ou no JS, rode `npm run build:css` antes. Depois faça commit e push na branch `main`. O GitHub Pages (Settings → Pages → Deploy from a branch → `main` / root) publica em cerca de 1 minuto.

Enquanto o Firebase não estiver configurado, o site funciona com o conteúdo de [`js/defaults.js`](js/defaults.js) e o painel mostra "Painel indisponível".

## Estrutura

```
index.html                site (SPA com rotas por #)
og-image.jpg              imagem de prévia ao compartilhar o link
css/site.css              CSS gerado pelo Tailwind (não editar à mão)
src/tailwind.css          origem do CSS, incluindo os componentes do painel
tailwind.config.js        onde o Tailwind procura as classes usadas
app.js                    roteador, menu, rodapé e agendamento
pages.js                  páginas do site
textos.js                 textos fixos da interface
foto.jpg                  foto padrão da profissional
ebooks/                   e-books, guias e artigos: página para ler no site (.html) e PDF para baixar (.pdf)
atividades/               atividades interativas (atividade.js é o mecanismo comum)
scripts/gerar-pdf-ebooks.js  gera os PDFs e atualiza ebooks/index.json
admin/index.html          painel admin
admin/admin.js            lógica do painel
js/
  firebase-config.js      chaves do projeto Firebase (preencher)
  firebase.js             inicialização do Firebase
  store.js                carrega o conteúdo e envia agendamentos
  defaults.js             conteúdo inicial (textos, cursos, materiais, atividades, planos)
firestore.rules           regras de acesso ao banco (colar no Console do Firebase)
firebase.json             configuração do emulador local
```

## CSS (Tailwind)

O CSS é gerado a partir das classes usadas no HTML e no JS. Sempre que usar uma classe nova, gere de novo:

```bash
npm install          # só na primeira vez
npm run build:css    # ou npm run watch:css enquanto edita
```

Classes montadas por concatenação (ex.: `'bg-' + cor`) não são encontradas: escreva sempre o nome completo da classe.

## E-books e atividades

Cada e-book é uma página em `ebooks/` (ex.: `ebooks/comunicacao-assertiva.html`), com leitura no site e um botão para baixar o PDF. Para aparecer no painel, o e-book precisa estar listado em [`ebooks/index.json`](ebooks/index.json) (título, descrição e ícone do card). No painel, aba **Materiais**, o quadro **Materiais prontos no site** tem o botão **Publicar no site**: se já existe um card com o mesmo título, ele recebe o link; senão, um card novo é criado em primeiro lugar.

As atividades interativas ficam em `atividades/` e funcionam do mesmo jeito, listadas em [`atividades/index.json`](atividades/index.json) e publicadas pela aba **Atividades** do painel. Cada página define a atividade em `window.ATIVIDADE` (etapas com tempo, ou campos de diário) e usa o mecanismo comum [`atividades/atividade.js`](atividades/atividade.js). O que a pessoa escreve nos diários fica só no navegador dela.

Depois de editar o texto de um e-book, gere o PDF de novo (precisa do Edge ou do Chrome instalado):

```bash
npm run build:css      # se usou classes novas
npm run pdf:ebooks
```

## Testar localmente

```bash
python -m http.server 8000
# abra http://localhost:8000
```

É preciso usar um servidor local: abrir o arquivo direto no navegador (`file://`) não funciona, porque o site usa módulos JavaScript. Para testar o painel sem um projeto real, veja a seção de emulador no [SETUP-FIREBASE.md](SETUP-FIREBASE.md).

## Observações

- **Sem área de alunos:** o único login é o do painel admin. Conteúdo pago deve ficar numa plataforma de cursos (ex.: Kiwify, Hotmart), com o link no card.
- **Planos:** a página começa escondida. Ligue no painel só quando preços e itens estiverem confirmados.
- **Política de Privacidade:** é um texto-base (`#privacidade`, em `pages.js`). Deve ser revisado pela profissional, de preferência com orientação jurídica.
- **Prévia de compartilhamento:** as tags `og:*` do `index.html` usam o endereço do GitHub Pages. Se o domínio mudar, atualize-as.
- **Pedidos de agendamento:** são enviados pelo WhatsApp e registrados no Firestore. Pelas regras de acesso, só o admin consegue ler esses registros.
