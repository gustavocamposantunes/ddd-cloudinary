# Camada `presentation` — DDD

Este documento explica a camada **presentation**, que concentra a interface HTTP da aplicação e a renderização das páginas com **EJS**.

## Objetivo

- Receber requisições do usuário.
- Validar e adaptar dados de entrada para os casos de uso.
- Renderizar páginas com EJS e retornar respostas HTTP adequadas.
- Centralizar controllers, rotas, middlewares de interface e preparação de view models.

## Responsabilidades

- Rotas HTTP.
- Controllers.
- Renderização de views EJS.
- Partials, layouts e componentes visuais reutilizáveis.
- Validações de entrada e mensagens de feedback.

## Principais convenções

- A camada `presentation` não deve conter regra de negócio.
- Controllers devem ser finos: receber dados, chamar a camada de aplicação e renderizar a resposta.
- A lógica de template deve ser simples; regras complexas ficam fora dos arquivos EJS.

## Estrutura recomendada

```text
src/presentation/
├── controllers/
├── routes/
├── views/
│   ├── pages/
│   ├── partials/
│   ├── layouts/
│   └── components/
├── middlewares/
├── validators/
└── view-models/
```

## Como usar EJS nesta camada

- Use `views/pages` para telas completas.
- Use `views/partials` para blocos compartilhados, como cabeçalho, rodapé e mensagens.
- Use `views/layouts` para a estrutura base da página.
- Prepare no controller tudo que a view precisa para renderizar com clareza.

## Boas práticas

- Não mova lógica de negócio para os templates.
- Mantenha controllers pequenos e focados em coordenação.
- Trate erros e feedback visual de forma consistente entre páginas.

## Testes

- Teste controllers e rotas com foco em resposta HTTP e renderização.
- Valide se os dados enviados para a view estão no formato esperado.
- Use mocks para dependências da camada data.