# Camada `data` — DDD

Este documento descreve a camada **data**, responsável por implementar a orquestração dos casos de uso e adaptar o domínio para consumo de dados e serviços.

## Objetivo

- Implementar a lógica de aplicação que coordena o fluxo entre domínio e infraestrutura.
- Transformar entradas em operações executáveis e saídas em respostas consistentes.
- Concentrar comportamento que não é do domínio puro, mas também não pertence à apresentação.

## Responsabilidades

- Implementação de casos de uso.
- Orquestração de chamadas entre contratos do domínio e serviços externos.
- Mapeamento de dados entre formatos externos e internos.
- Tratamento de erros técnicos e adaptação de respostas.

## Principais convenções

- A camada `data` deve depender de contratos definidos no `domain`.
- Não deve conhecer detalhes de EJS, Express ou dos templates.
- Não deve conter chamadas diretas a SDKs externos quando isso puder ser isolado pela `infra`.

## Estrutura recomendada

```text
src/data/
├── usecases/
├── protocols/
├── repositories/
├── services/
└── mappers/
```

## Exemplo de papel da camada

- Receber os dados de um upload e validar o fluxo de aplicação.
- Delegar o armazenamento para um contrato de serviço ou repositório.
- Converter o retorno da infraestrutura em um formato útil para a camada de apresentação.

## Boas práticas

- Mantenha a camada previsível e sem dependências de interface.
- Separe bem validação de entrada, regra de negócio e adaptação de saída.
- Centralize o comportamento reaproveitável de aplicação nesta camada.

## Testes

- Teste os casos de uso com fakes e mocks das dependências.
- Valide fluxos de sucesso, falha e exceção.
- Verifique se a camada faz o mapeamento correto entre domínio e infraestrutura.