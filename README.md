# Sobre você

Site da enfermeira Claudia Alves de Assis, pós-graduada em psiquiatria, com cursos, vídeos, materiais e atividades sobre comunicação e análise comportamental, planos de assinatura, pedidos de agendamento pelo WhatsApp e um **painel admin com login** para ela editar tudo.

- **Site:** HTML, Tailwind (CDN) e JavaScript puros, na raiz do repositório. Hospedado no GitHub Pages, sem etapa de build.
- **Login e dados:** Firebase (Authentication e Firestore), no plano gratuito.
- **Painel admin:** <https://juliosv-hub.github.io/Sobre-voce/admin/> (link "Área da profissional" no rodapé).

## O que a Claudia edita pelo painel

| Aba | Conteúdo |
|---|---|
| Agendamentos | Ver pedidos, confirmar, cancelar, marcar como concluído e excluir |
| Cursos e vídeos | Criar, editar, reordenar e excluir; tipo, ícone, aulas, duração, link e se fica liberado sem assinatura |
| Materiais | Idem, com número de páginas |
| Atividades | Idem, com duração |
| Textos e dados | Nome, profissão, registro, WhatsApp, foto, título e subtítulo da página inicial, texto "Sobre a Profissional", destaques, atendimento presencial, horários por dia da semana |
| Planos | Nome, preço mensal e anual, itens incluídos, links de pagamento e plano em destaque |

As alterações aparecem no site na hora.

## Colocar no ar

1. **Configurar o Firebase:** siga o [SETUP-FIREBASE.md](SETUP-FIREBASE.md), o que inclui criar o login da Claudia.
2. **Publicar:** faça commit e push na branch `main`. O GitHub Pages (Settings → Pages → Deploy from a branch → `main` / root) publica em cerca de 1 minuto.

Enquanto o Firebase não estiver configurado, o site funciona com o conteúdo de [`js/defaults.js`](js/defaults.js) e o painel mostra "Painel indisponível".

## Estrutura

```
index.html                site (SPA com rotas por #)
app.js                    roteador, menu, rodapé e agendamento
pages.js                  páginas do site
textos.js                 textos fixos da interface
foto.jpg                  foto padrão da profissional
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

## Testar localmente

```bash
python -m http.server 8000
# abra http://localhost:8000
```

É preciso usar um servidor local: abrir o arquivo direto no navegador (`file://`) não funciona, porque o site usa módulos JavaScript. Para testar o painel sem um projeto real, veja a seção de emulador no [SETUP-FIREBASE.md](SETUP-FIREBASE.md).

## Observações

- **Login de alunos:** "Entrar" e "Cadastrar" no site ainda são demonstração (ficam só no navegador). O login real é apenas o do painel admin.
- **Pedidos de agendamento:** são enviados pelo WhatsApp e registrados no Firestore. Pelas regras de acesso, só o admin consegue ler esses registros.
