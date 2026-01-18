# Projeto Prático EZ

Angular + TypeScript | Login + Senhas + Dashboard

## Objetivo

Construir um app Angular com fluxo de autenticação completo e um dashboard com KPIs, gráfico e tabela.

## Como rodar

1. Instale as dependências do projeto:
```bash
npm install
```
2. Para iniciar o servidor local:
```bash
ng serve
```
3. Assim que o servidor estiver em execução, abra seu navegador e acesse `http://localhost:4200/`. O aplicativo será recarregado automaticamente sempre que você modificar algum dos arquivos de origem.

## Usuário de teste

Email: teste@ez.com
Senha: 12345678
(Esse usuário de teste serve apenas para acesso ao Dashboard)

- Como criar um usuário para testes restantes:

1. Acesse: '/create-password'
2. Use qualquer e-mail (ex.: teste1@ez.com)
3. Use o código: 123456
4. Defina uma senha (mínimo 8 caracteres)
5. Depois disso, faça login em: '/login'

## Código do mock

Código válido: 123456

## Decisões técnicas

Este projeto teve como objetivo principal proporcionar o primeiro contato prático com o framework Angular. Apesar disso, já possuía base sólida em HTML, CSS, JavaScript e TypeScript, o que permitiu uma adaptação rápida à linguagem e maior foco na arquitetura da aplicação e nos conceitos específicos do Angular.

Durante o desenvolvimento, aprofundei o uso de:

- Componentização e ciclo de vida
- Rotas protegidas com Guards
- Formulários reativos com validação
- Serviços para separação de responsabilidades

Para acelerar o aprendizado e garantir a correta implementação das funcionalidades, utilizei conteúdos técnicos em vídeo (YouTube) e o ChatGPT como apoio para esclarecimento de dúvidas, análise de erros e entendimento do funcionamento adequado de cada parte do sistema. Esse processo foi essencial para superar dificuldades iniciais comuns a um primeiro contato com o framework.

Um dos maiores aprendizados foi a simulação de um backend, utilizando localStorage como persistência de dados. Embora já conhecesse o recurso, foi a primeira vez que o utilizei para implementar regras próximas às de um sistema real, como autenticação, criação e recuperação de senha, controle de expiração e gerenciamento de estado.

O projeto exigiu lidar com desafios reais de front-end moderno, incluindo:

- Gerenciamento de estado e loading
- Fluxos assíncronos
- Controle de tempo e UX
- Organização de código escalável

Dessa forma, o projeto contribuiu para a consolidação da base em Angular e para o desenvolvimento da capacidade de aprender novas tecnologias, analisar problemas técnicos e implementar soluções funcionais, servindo como base para evoluções futuras com backend real e aplicações mais complexas.

## Melhorias futuras

- Substituir ApiMockService por API real e persistência em banco.
- Iplementar hash de senha e autenticação baseada em JWT.
- Criar HTTP Interceptor para anexar token automaticamente em requisições.
- Melhorar acessibilidade e responsividade mobile.
- Melhorar componentes visuais.

## Redes

https://www.linkedin.com/in/marcusviniciusfc/
https://github.com/markin-98
