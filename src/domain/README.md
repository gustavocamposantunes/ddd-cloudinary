# Camada `domain` — DDD

Este documento descreve a camada **domain**, que é o núcleo da aplicação em uma arquitetura orientada a Domain-Driven Design (DDD).

## Objetivo

- Centralizar as regras de negócio mais importantes.
- Manter a aplicação independente de framework, banco de dados, SDKs e motor de views.
- Definir contratos e comportamentos que serão usados pelas outras camadas.

## Responsabilidades

- Entidades e Value Objects.
- Regras de negócio puras.
- Contratos de repositórios, gateways e serviços necessários ao domínio.
- Exceções e validações específicas do negócio.
- Casos de uso conceituais quando a base do projeto optar por mantê-los no domínio.

## Principais convenções

- A camada `domain` não deve importar Express, EJS, Cloudinary, ORM, SDKs ou bibliotecas de infraestrutura.
- O domínio deve expressar o negócio de forma clara, pequena e testável.
- Dependências externas devem entrar por contratos, não por implementação concreta.

## Estrutura recomendada

```text
src/domain/
├── entities/
├── value-objects/
├── contracts/
├── usecases/
├── errors/
└── helpers/
```

## Exemplo de responsabilidades

- Uma entidade pode representar um usuário, imagem, postagem ou recurso principal da aplicação.
- Um Value Object pode representar e-mail, nome, URL ou identificador de domínio.
- Um contrato pode descrever como salvar ou remover um arquivo sem citar o provedor usado.

## Boas práticas

- Priorize expressividade de negócio em vez de detalhes técnicos.
- Não coloque regras de tela, sessão, rota ou template aqui.
- Escreva a camada como se ela pudesse ser reutilizada com qualquer interface de usuário ou infraestrutura.

## Testes

- Teste as regras do domínio isoladamente.
- Prefira unit tests para entidades, Value Objects e validações.
- Use fakes ou mocks para contratos externos.