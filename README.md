<div align="center">

<img src="docs/img/banner.svg" alt="Elo – Rede de Proteção" width="100%">

<br>

![Status](https://img.shields.io/badge/status-protótipo%20v1.1-5F3A93?style=for-the-badge)
![Stack](https://img.shields.io/badge/stack-HTML%20·%20CSS%20·%20JavaScript-1F1C2B?style=for-the-badge)
![Dados](https://img.shields.io/badge/dados-fictícios-B26A00?style=for-the-badge)

**Uma camada de continuidade entre os serviços da rede de proteção à mulher.**

[![Acessar o protótipo](https://img.shields.io/badge/▶%20Acessar%20o%20protótipo-5F3A93?style=for-the-badge&logoColor=white)](https://diegoomarcelo.github.io/elo-rede-de-protecao/)

[Como funciona](#-como-funciona) ·
[Telas](#-telas-do-protótipo) ·
[Funcionalidades](#-funcionalidades) ·
[Como executar](#-como-executar) ·
[Arquitetura](#-arquitetura-do-código)

</div>

---

> [!IMPORTANT]
> Protótipo acadêmico. Todos os nomes, casos, endereços e telefones de serviços são **fictícios**. Os únicos dados reais são os telefones públicos de ajuda (180, 190, 197 e 192).

## 💡 Sobre

Quando uma mulher em situação de violência é encaminhada de um serviço da rede de proteção para outro, o serviço de origem nem sempre sabe se ela chegou, ela nem sempre sabe para onde ir e, muitas vezes, precisa contar a mesma história de novo.

O **Elo** organiza essa passagem entre serviços. Ele **não substitui** os sistemas que já existem (SEI, e-SUS, PJe, SUAS): o conteúdo de cada atendimento continua onde está, e o Elo registra apenas o encaminhamento, a confirmação, o atendimento e o retorno.

O protótipo mostra a mesma jornada vista por três públicos: **a mulher atendida**, **os profissionais da rede** e **a gestão da rede**.

---

## 🔄 Como funciona

```mermaid
flowchart LR
    A([Serviço de origem]) --> B{Origem e destino<br/>usam o SEI?}
    B -- Sim --> C[Encaminhamento<br/>tramita no SEI]
    C --> D[Elo registra só o<br/>nº do processo]
    D --> J([Etapa aparece na<br/>jornada da mulher])
    B -- Não --> E[Encaminhamento no Elo<br/>com consentimento]
    E --> F[Destino confirma<br/>recebimento]
    F --> G[Destino registra<br/>atendimento]
    G --> H[Destino envia retorno<br/>à origem]
    H --> J

    style E fill:#EEE8F6,stroke:#5F3A93
    style F fill:#EEE8F6,stroke:#5F3A93
    style G fill:#EEE8F6,stroke:#5F3A93
    style H fill:#EEE8F6,stroke:#5F3A93
```

### Ciclo de vida de um encaminhamento

```mermaid
stateDiagram-v2
    direction LR
    [*] --> Enviado: origem encaminha<br/>(com consentimento)
    Enviado --> Recebido: destino confirma
    Recebido --> Atendido: destino registra o atendimento
    Atendido --> Retorno: destino devolve a contrarreferência
    Retorno --> [*]
    Enviado --> Atrasado: mais de 7 dias<br/>sem confirmação
    Atrasado --> Recebido: destino confirma
```

---

## 👥 Perfis de acesso

| Perfil | No protótipo | O que vê e faz |
|:--|:--|:--|
| 👩 **Mulher atendida** | Mariana Costa | Próximo passo, encaminhamentos, linha do tempo e quem acessou suas informações. |
| 🏛️ **Casa da Mulher Brasileira** | Ana Souza, psicóloga | Referência do caso; recebe, encaminha e acompanha casos. |
| 🤝 **Comitê de Águas Claras** | Carla Nunes, articuladora | Usa o SEI; registra no Elo só as passagens para serviços fora do SEI. |
| 🩺 **UBS 1 Águas Claras** | Paula Lima, enfermeira | Porta de entrada pela saúde. |
| 🧾 **CREAS Águas Claras** | Lucas Pereira, assistente social | Confirma recebimento, registra atendimento e devolve retorno. |
| 📊 **Gestão da rede** | Coordenação da rede | Números agregados, sem nomes nem conteúdo dos atendimentos. |

## 🧭 Princípios

| Princípio | Na prática |
|:--|:--|
| **Complementar, não substituir** | Onde os serviços já se comunicam pelo SEI, o Elo só registra a passagem. |
| **Só o necessário** | Cada serviço vê apenas o que registrou ou o que foi compartilhado com ele. |
| **Com autorização da mulher** | Nenhum encaminhamento é enviado sem o consentimento dela. |
| **Transparência** | Todo acesso fica registrado e visível para a mulher. |
| **Linguagem simples** | A tela dela fala em "para onde ir" e "o que levar". |
| **Segurança** | O botão "Sair rápido" troca a tela por uma lista de compras. |

---

## 📸 Telas do protótipo

### Tela inicial

<p align="center"><img src="docs/img/01-tela-inicial.png" alt="Tela inicial do Elo" width="90%"></p>

A entrada separa os dois públicos desde o início. A mulher entra pela própria jornada; o profissional entra com o e-mail institucional e vê a tela do seu serviço.

### Visão da mulher atendida

<p align="center"><img src="docs/img/02-mulher-jornada.png" alt="Tela Minha jornada da mulher" width="90%"></p>

Pensamos esta tela para responder às perguntas que mais pesam para ela: **para onde ir, quando, o que levar e com quem falar**. À direita, um carrossel com telefones de ajuda e o bloco *"Você não precisa contar tudo de novo"*, que mostra o que o CREAS já recebeu, com a autorização dela, e avisa o que ainda vão perguntar por causa da função do serviço.

<table>
<tr>
<td width="50%" valign="top">
<img src="docs/img/03-mulher-privacidade.png" alt="Aba Privacidade e acessos">
<p><b>Privacidade e acessos.</b> Cada serviço aparece com as informações a que tem acesso, e a mulher vê os últimos acessos ao seu caso.</p>
</td>
<td width="50%" valign="top">
<img src="docs/img/04-sair-rapido.png" alt="Tela disfarce do Sair rápido">
<p><b>Sair rápido.</b> Em um clique, a tela e o título da aba viram uma lista de compras. Nada indica o que ela estava vendo.</p>
</td>
</tr>
</table>

### Visão do profissional da rede

<p align="center"><img src="docs/img/05-profissional-casos.png" alt="Caixa de casos do CREAS" width="90%"></p>

O profissional vê os encaminhamentos recebidos e os casos que acompanha. Quando um encaminhamento fica parado por mais de 7 dias, o alerta aparece para quem precisa agir.

<table>
<tr>
<td width="50%" valign="top">
<img src="docs/img/06-profissional-antes-de-perguntar.png" alt="Painel Antes de perguntar de novo">
<p><b>Antes de perguntar de novo.</b> ✓ já disponível · <b>!</b> o serviço precisa perguntar pela própria função · <b>?</b> não compartilhado, só perguntar se necessário.</p>
</td>
<td width="50%" valign="top">
<img src="docs/img/07-novo-encaminhamento.png" alt="Modal de novo encaminhamento">
<p><b>Novo encaminhamento.</b> Destino, motivo, o que compartilhar, próximo passo e o consentimento da mulher. Se origem e destino usam o SEI, o número do processo passa a ser obrigatório.</p>
</td>
</tr>
</table>

### Serviço que já usa o SEI

<p align="center"><img src="docs/img/08-comite-sei.png" alt="Tela do Comitê de Águas Claras" width="90%"></p>

A tela do Comitê mostra a decisão de **complementar, e não substituir**: os encaminhamentos pelo SEI continuam lá, e o Elo apenas registra a etapa para a jornada ficar completa.

### Gestão da rede

<p align="center"><img src="docs/img/09-gestao.png" alt="Painel de gestão da rede" width="90%"></p>

A gestão acompanha onde os encaminhamentos ficam parados, quantos têm retorno e quanto tempo levam para ser confirmados, **sempre com números agregados**, sem nomes nem conteúdo dos atendimentos.

---

## ✅ Funcionalidades

| ID | Funcionalidade | Perfil | Concluída |
|:--|:--|:--|:-:|
| F01 | Encaminhar com consentimento e escolha do que compartilhar | Profissional | 06/11 |
| F02 | Confirmar recebimento, registrar atendimento e enviar retorno | Profissional | 06/11 |
| F03 | Painel "Antes de perguntar de novo" | Profissional | 07/11 |
| F04 | Próximo passo da mulher: quando, onde, horário e o que levar | Mulher | 05/11 |
| F05 | Andamento dos encaminhamentos e linha do tempo da jornada | Mulher | 05/11 |
| F06 | Bloco "Você não precisa contar tudo de novo" | Mulher | 05/11 |
| F07 | Registro da passagem pelo SEI (só o número do processo) | Profissional | 07/11 |
| F08 | Registro de acessos visível para a mulher | Mulher | 08/11 |
| F09 | Botão "Sair rápido" com tela disfarce | Mulher | 08/11 |
| F10 | Alerta de encaminhamento sem confirmação há mais de 7 dias | Profissional | 08/11 |
| F11 | Indicadores agregados e pontos de interrupção | Gestão | 09/11 |
| F12 | Telefones de ajuda (180, 190, 197, WhatsApp PCDF, 192) | Mulher | 09/11 |

```mermaid
gantt
    title Sprint do protótipo (03/11 a 10/11/2026)
    dateFormat YYYY-MM-DD
    axisFormat %d/%m
    section Planejamento
    Redefinição da solução e backlog (MoSCoW)   :done, p1, 2026-11-03, 1d
    section Base
    Perfis, dados fictícios e login              :done, b1, 2026-11-04, 1d
    section Mulher
    F04 F05 F06 · Próximo passo e jornada        :done, m1, 2026-11-05, 1d
    F08 F09 · Acessos e Sair rápido              :done, m2, 2026-11-08, 1d
    F12 · Telefones de ajuda                     :done, m3, 2026-11-09, 1d
    section Profissional
    F01 F02 · Fluxo de encaminhamento            :done, pr1, 2026-11-06, 1d
    F03 F07 · Antes de perguntar e SEI           :done, pr2, 2026-11-07, 1d
    F10 · Alerta de atraso                       :done, pr3, 2026-11-08, 1d
    section Gestão
    F11 · Indicadores agregados                  :done, g1, 2026-11-09, 1d
    section Fechamento
    Revisão e documentação                       :done, f1, 2026-11-10, 1d
```

---

## 🚀 Como executar

**Online:** acesse **[https://diegoomarcelo.github.io/elo-rede-de-protecao/](https://diegoomarcelo.github.io/elo-rede-de-protecao/)**.

**Localmente:** não precisa de instalação nem servidor, basta abrir o `index.html` no navegador.

```bash
git clone <url-deste-repositório>
cd elo-rede-de-protecao
# abra o index.html no navegador
```

| Acesso de teste | |
|:--|:--|
| E-mail | `teste@teste.com` |
| Senha | `123456` |

A mesma credencial vale para todos os perfis. No login institucional, o serviço escolhido define a tela que abre.

> [!NOTE]
> Os dados ficam só na memória da aba: ao recarregar, tudo volta ao estado inicial. A data "de hoje" do protótipo é fixa em **10/11/2026**, para os prazos e alertas serem sempre os mesmos.

---

## 🧱 Arquitetura do código

O protótipo é uma página web em **HTML, CSS e JavaScript puros**, sem frameworks nem build. O código foi separado por responsabilidade, e cada arquivo tem um cabeçalho explicando o que faz.

```text
elo-rede-de-protecao/
├── index.html                    # Esqueleto da página e ordem de carregamento
├── README.md
├── css/
│   ├── 01-base.css               # Reset, tokens de cor (claro/escuro), tipografia
│   ├── 02-cabecalho.css          # Barra do topo: marca e usuário logado
│   ├── 03-login.css              # Tela inicial e logins
│   ├── 04-componentes.css        # Cards, botões, pílulas de status, etiquetas
│   ├── 05-mulher.css             # Tela da mulher, carrossel, privacidade, Sair rápido
│   ├── 06-profissional.css       # Caixa de casos, alertas, checklist, tabelas
│   ├── 07-gestao.css             # Indicadores e barras de progresso
│   └── 08-modal.css              # Modais, formulários e toast
├── js/
│   ├── 01-dados.js               # Serviços, perfis, casos e auditoria (fictícios)
│   ├── 02-estado.js              # Estado da interface
│   ├── 03-utilidades.js          # Datas, permissões, status, toast
│   ├── 04-tela-login.js          # Tela inicial, logins e validação
│   ├── 05-tela-mulher.js         # Minha jornada e Privacidade
│   ├── 06-carrossel-ajuda.js     # Telefones de ajuda
│   ├── 07-tela-neutra.js         # Tela disfarce do Sair rápido
│   ├── 08-tela-profissional.js   # Caixa de casos e detalhe do caso
│   ├── 09-tela-gestao.js         # Indicadores agregados
│   ├── 10-modais.js              # Atendimento, retorno e novo encaminhamento
│   ├── 11-render.js              # Decide qual tela desenhar
│   ├── 12-eventos.js             # Cliques, formulários e teclado
│   └── 13-main.js                # Primeira renderização
└── docs/
    └── img/                      # Banner e capturas de tela
```

### Como as peças se conectam

```mermaid
flowchart TB
    subgraph Base["Base"]
        D[01-dados.js] --> S[02-estado.js] --> U[03-utilidades.js]
    end
    subgraph Telas["Telas"]
        L[04-tela-login]
        M[05-tela-mulher] --- H[06-carrossel-ajuda]
        N[07-tela-neutra]
        P[08-tela-profissional]
        G[09-tela-gestao]
        MO[10-modais]
    end
    U --> Telas
    Telas --> R[11-render.js]
    E[12-eventos.js] -- altera o estado --> S
    E -- chama --> R
    R -- desenha em --> APP[("#app e #layer<br/>no index.html")]
    MAIN[13-main.js] -- primeira chamada --> R
```

**Como funciona o ciclo da interface:**

1. Todo o estado da tela fica em um único objeto, `state` (`02-estado.js`): quem está logado, qual tela, qual caso está selecionado, qual modal está aberto.
2. Cada tela é uma função que **devolve HTML em texto** a partir do estado e dos dados (`viewMulher`, `viewProf`, `viewGestao`…).
3. A função `render()` (`11-render.js`) escolhe a tela certa e a desenha em `#app`; os modais vão para `#layer`.
4. Um único ouvinte de cliques (`12-eventos.js`) identifica a ação pelos atributos `data-*` dos botões, altera o estado e chama `render()` de novo.

> [!IMPORTANT]
> A **ordem dos `<script>`** no `index.html` importa: cada arquivo usa o que os anteriores definiram. Os scripts são comuns (não módulos), por isso a página funciona abrindo o arquivo direto, sem servidor.

### Atributos de ação usados nos botões

| Atributo | Para que serve | Exemplo |
|:--|:--|:--|
| `data-go` | Navegar entre telas antes do login | `data-go="login-mulher"` |
| `data-tab` | Trocar de aba na tela da mulher | `data-tab="privacidade"` |
| `data-case` | Selecionar um caso na caixa do profissional | `data-case="C-0142"` |
| `data-act` | Executar uma ação | `confirm`, `newref`, `exit`, `logout` |
| `data-help` | Navegar no carrossel de ajuda | `data-help="next"` |

---

## 💾 Modelo de dados

Os dados ficam em `js/01-dados.js`. A estrutura foi pensada para já refletir o princípio "só o necessário".

```mermaid
erDiagram
    SERVICO ||--o{ ENCAMINHAMENTO : "origem / destino"
    CASO ||--|{ INFORMACAO : "items"
    CASO ||--o{ PASSAGEM : "visits"
    CASO ||--o{ ENCAMINHAMENTO : "refs"
    ENCAMINHAMENTO }o--o{ INFORMACAO : "shared"
    CASO ||--o{ ACESSO : "AUDIT"

    SERVICO {
        string nome
        string area
        string sistema "SEI, e-SUS, PJe..."
        bool sei "tramita pelo SEI?"
    }
    CASO {
        string id "C-0142"
        string nome
        string referencia "serviço de referência"
    }
    INFORMACAO {
        string tipo "contato, risco, plano..."
        string origem "quem registrou"
        date data
        list alsoTo "enviada direto a outros serviços"
    }
    ENCAMINHAMENTO {
        string de
        string para
        string motivo
        string status "enviado, recebido, atendido, retorno"
        string ext "nº no SEI ou outro sistema"
    }
    PASSAGEM {
        date data
        string servico
        string texto_mulher "linguagem simples"
    }
    ACESSO {
        string quando
        string quem
        string acao
    }
```

**Regra de visibilidade** (`visibleItems` em `03-utilidades.js`): um serviço vê uma informação somente se

1. **ele mesmo** a registrou; ou
2. ela foi **enviada diretamente** para ele (`alsoTo`); ou
3. ela foi **compartilhada** em um encaminhamento que ele recebeu (`shared`).

Cada informação tem dois textos: o rótulo técnico para o profissional (`KINDS`) e a versão em linguagem simples para a mulher (`KINDS_HER`).

---

## ♿ Acessibilidade e segurança

**Acessibilidade**

- 🔤 Fonte **Atkinson Hyperlegible**, criada para alta legibilidade, nos textos.
- 🌗 **Modo escuro** automático, seguindo a preferência do sistema operacional.
- 📱 Layout **responsivo**, que funciona no celular e respeita as áreas seguras (notch e barras).
- ⌨️ Navegação por **teclado**, com foco visível e tecla `Esc` para fechar modais.
- 🎞️ O carrossel **pausa** com o mouse em cima ou com foco, e respeita a preferência de **movimento reduzido**.
- 🔊 Atributos de acessibilidade (`aria-*`) para leitores de tela no carrossel e nos ícones.

**Segurança da usuária**

- 🚪 **Sair rápido** sempre visível: troca a tela e o título da aba por uma lista de compras.
- 🔐 **Consentimento obrigatório** antes de qualquer encaminhamento.
- 👁️ **Registro de acessos** visível para a própria mulher.
- 📉 A **gestão** só vê números agregados.
- 🧾 O Elo **não copia** prontuários, relatos completos nem processos.

---

## 👤 Autor

Protótipo desenvolvido por **Diego Marcelo**.

## 🤖 Uso de Inteligência Artificial

Utilizei ferramentas de Inteligência Artificial como apoio na depuração (debug) do código e na estruturação deste README. Todo o conteúdo foi revisado por mim.

---

<div align="center">

<sub>Elo – Rede de Proteção · Protótipo acadêmico com dados fictícios</sub><br>
<sub>Em situação de violência, ligue <b>180</b> (Central de Atendimento à Mulher) ou <b>190</b> em emergência.</sub>

</div>
