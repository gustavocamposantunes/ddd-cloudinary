# Domain Driven Design - Integração com Cloudinary

![DDD Logo](assets/ddd.png)

Este é um projeto para exemplificar a aplicação do DDD (Domain-Driven Design) integrando com o cloudinary, o intuito é mostrar como aplicar o DDD em um projeto real, utilizando uma integração externa para armazenamento de imagens.

## Tecnologias Utilizadas

- Node.js
- Express
- Cloudinary
- TypeScript
- Vitest (para testes)
- EJS (para renderização de páginas)

# Estrutura do Projeto

```
src
├── data
├── domain
├── infra
├── main
├── presentation

```
* **Data**: Implementação dos casos de uso, orquestração e adaptação entre domínio e infraestrutura.
* **Domain**: Lógica de negócio pura, entidades, contratos e regras centrais.
* **Infra**: Serviços externos, SDKs, clientes, bancos e integrações com terceiros.
* **Main**: Bootstrap, composição de dependências e configuração do servidor.
* **Presentation**: Interface HTTP e renderização das páginas com EJS.
    * Inclui controllers, rotas, views, partials, layouts, validações e interações do usuário.

## Arquitetura da aplicação

Esta aplicação é pensada como um sistema completo renderizado no servidor com **Express + EJS**. A camada de presentation é responsável por receber as requisições HTTP e renderizar as páginas, enquanto domain e data concentram regra de negócio e orquestração. A camada infra isola integrações externas como Cloudinary e persistência.

Fluxo esperado:

1. A rota recebe a requisição na camada presentation.
2. O controller valida a entrada e chama um caso de uso.
3. O caso de uso executa a regra de negócio e usa contratos definidos no domínio.
4. A infra fornece implementações concretas para serviços externos.
5. O controller devolve uma view EJS com os dados preparados.

## Configuração do Cloudinary

Para configurar o Cloudinary, siga os passos abaixo:
1. Crie uma conta no [Cloudinary](https://cloudinary.com/).
2. Obtenha suas credenciais (Cloud Name, API Key e API Secret).
3. Configure as variáveis de ambiente no seu projeto:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key 
CLOUDINARY_API_SECRET=your_api_secret
```

## Executando o Projeto

1. Clone o repositório:
```bash
git clone
```

2. Instale as dependências:
```bash
pnpm install
```

3. Inicie o servidor:
```bash
pnpm start
```

## Testes

Para rodar os testes, utilize o comando:
```bash
pnpm test
```

## Camadas detalhadas

Consulte os documentos específicos de cada camada para entender responsabilidades e convenções:

- [src/domain/README.md](/home/decante/Desktop/Desenvolvimento/ddd-cloudinary/src/domain/README.md)
- [src/data/README.md](/home/decante/Desktop/Desenvolvimento/ddd-cloudinary/src/data/README.md)
- [src/presentation/README.md](/home/decante/Desktop/Desenvolvimento/ddd-cloudinary/src/presentation/README.md)
- [src/main/README.md](/home/decante/Desktop/Desenvolvimento/ddd-cloudinary/src/main/README.md)