# Configurar o Firebase (login admin e banco de dados)

Guia para o desenvolvedor. Leva uns 15 minutos. Tudo cabe no plano gratuito (Spark).

> **Recomendado:** crie o projeto com a **conta Google da Claudia** e adicione a sua como colaborador (Configurações do projeto → Usuários e permissões). Assim os dados dos pacientes ficam sob responsabilidade da profissional, e você pode sair do projeto no futuro sem que nada se perca.

## 1. Criar o projeto

1. Acesse <https://console.firebase.google.com> e clique em **Criar projeto**.
2. Dê um nome (ex.: `sobre-voce-site`). O Google Analytics pode ficar **desativado**.

## 2. Registrar o app web

1. Na página do projeto, clique no ícone **Web** (`</>`) e registre um app com o nome `Sobre você`. Não é preciso configurar o Firebase Hosting.
2. O console mostra um bloco `firebaseConfig`. Copie os valores para [`js/firebase-config.js`](js/firebase-config.js).

Esses valores não são segredos: eles aparecem no navegador de qualquer visitante. Quem protege os dados são as regras do passo 4.

## 3. Ativar o login

1. Abra **Authentication → Primeiros passos → Método de login**, ative **E-mail/senha** e salve.
2. Em **Authentication → Configurações → Ações do usuário**, **desmarque "Ativar criação (inscrição)"**. Assim ninguém consegue criar conta sozinho.
3. Em **Authentication → Usuários → Adicionar usuário**, informe o e-mail da Claudia e uma senha provisória.
4. Copie o **UID do usuário** (a coluna "UID do usuário" na lista).
5. Em **Authentication → Configurações → Domínios autorizados**, adicione `juliosv-hub.github.io`.

## 4. Criar o banco e publicar as regras

1. Abra **Firestore Database → Criar banco de dados**.
2. Escolha **Edição Standard**, local **`southamerica-east1` (São Paulo)** e **modo de produção**.
3. Na aba **Regras**, apague o conteúdo e cole o arquivo [`firestore.rules`](firestore.rules) inteiro. Clique em **Publicar**.

## 5. Tornar a Claudia administradora

1. Em **Firestore Database → Dados**, clique em **Iniciar coleção**.
2. ID da coleção: `admins`.
3. ID do documento: **o UID copiado no passo 3**.
4. Adicione um campo `nome` (string) com o nome dela e salve.

Para dar acesso a outra pessoa depois, repita os passos 3.3, 3.4 e 5 com o UID dela. Para remover o acesso, apague o documento dela em `admins`.

## 6. Publicar e fazer o primeiro acesso

1. Faça commit e push. O GitHub Pages publica o site (veja o [README](README.md)).
2. A Claudia acessa <https://juliosv-hub.github.io/Sobre-voce/admin/> (ou o link **Área da profissional** no rodapé), digita o e-mail e clica em **Esqueci minha senha** para criar a própria senha. Assim você não fica sabendo a senha dela. Se ela entrar com a senha provisória, o painel pede a troca antes de liberar o acesso.
3. No primeiro acesso, o painel copia sozinho para o banco o conteúdo atual do site: textos, cursos, materiais, atividades e planos.
4. Na aba **Textos e dados**, ela preenche o **WhatsApp**, o **registro profissional** (COREN), o e-mail e o Instagram e salva. Até o WhatsApp ser preenchido, o formulário de agendamento não envia nada e o botão flutuante do WhatsApp não aparece.
5. Na aba **Planos**, ela confere preços e itens e liga **Mostrar a página de planos no site** quando estiver tudo certo.

## O que fica onde

| Dado | Onde | Quem lê | Quem altera |
|---|---|---|---|
| Textos, foto, WhatsApp, horários | `config/site` | Todos | Admin |
| Planos e se a página aparece | `config/planos` | Todos | Admin |
| Cursos e vídeos | `cursos/*` | Todos | Admin |
| Materiais | `materiais/*` | Todos | Admin |
| Atividades | `atividades/*` | Todos | Admin |
| Pedidos de agendamento | `agendamentos/*` | Só o admin | Público só cria; admin altera ou exclui |
| Administradores | `admins/*` | A própria pessoa | Só pelo console |

## Recomendações

- **Conteúdo pago:** os links de cursos e materiais ficam no banco com leitura pública, então não use esses links para conteúdo que só assinantes podem ver. Para isso, use uma plataforma de cursos (ex.: Kiwify, Hotmart) e coloque no painel o link da página de venda ou o link de pagamento do plano.
- **Limite a chave da API** (opcional, mas recomendado): no Google Cloud Console, abra **APIs e serviços → Credenciais**, clique na chave "Browser key", escolha **Restrições de aplicativo → Referenciadores HTTP** e adicione `https://juliosv-hub.github.io/*`.
- **Spam de agendamentos:** as regras validam formato e tamanho de cada pedido, mas não limitam a quantidade. Se aparecer spam, ative o **App Check** com reCAPTCHA Enterprise (Firebase → App Check) e adicione a verificação no site.
- **Backup:** o plano gratuito não faz backup automático. Os pedidos de agendamento também chegam pelo WhatsApp, então a perda de dados tem impacto baixo. Mesmo assim, evite excluir itens em massa.
- **Limites do plano gratuito:** 50 mil leituras e 20 mil gravações por dia. Cada visita ao site faz cerca de 25 leituras (uma por item de conteúdo), o que dá perto de 2 mil visitas por dia.

## Testar localmente com o emulador (desenvolvedor)

Você vai precisar do Java 11+ e do `firebase-tools`.

```bash
npx firebase-tools emulators:start --only firestore,auth --project demo-sobre-voce
python -m http.server 8000
```

No navegador, em `http://localhost:8000`, rode no console `localStorage.setItem('sobrevoce.emulator', '1')` e recarregue. O site e o painel passam a usar o emulador. Se o Firestore do emulador estiver em outra porta, defina também `localStorage.setItem('sobrevoce.emulator.firestorePort', '8181')`. Crie usuários pela API REST do emulador de Authentication.

> O emulador (Java) não abre arquivos em pastas com nome em japonês, como `プロジェクト`. Se isso acontecer, rode o emulador a partir de uma cópia do `firebase.json` e do `firestore.rules` em outra pasta.
