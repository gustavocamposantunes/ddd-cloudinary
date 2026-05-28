# Camada `main` — DDD

Este documento apresenta a camada **main**, responsável por montar e iniciar a aplicação.

## Objetivo

- Centralizar o bootstrap do sistema.
- Conectar presentation, data, domain e infra.
- Configurar Express, EJS, middlewares globais e o servidor HTTP.

## Responsabilidades

- Instanciar e compor dependências.
- Registrar rotas e middlewares.
- Configurar engine de views, arquivos estáticos e tratamento de erro.
- Inicializar o servidor e organizar o ponto de entrada da aplicação.

## Principais convenções

- A camada `main` pode conhecer todas as demais para compor a aplicação.
- Ela não deve conter regra de negócio.
- Deve funcionar como uma camada de montagem, não como uma camada de decisão.

## Estrutura recomendada

```text
src/main/
├── config/
├── routes/
├── middlewares/
├── factories/
├── adapters/
└── server/
```

## Exemplo de papel da camada

- Configurar o uso de EJS como motor de views.
- Definir a pasta pública para assets estáticos.
- Registrar as rotas da aplicação.
- Injetar implementações concretas da `infra` nas dependências da `data` e da `presentation`.

## Boas práticas

- Mantenha a composição explícita e fácil de rastrear.
- Separe a criação de dependências da inicialização do servidor.
- Evite espalhar configuração de ambiente por outros módulos.

## Testes

- Quando aplicável, teste a composição das rotas e configurações do app.
- Verifique se o bootstrap registra corretamente a engine EJS e os middlewares necessários.