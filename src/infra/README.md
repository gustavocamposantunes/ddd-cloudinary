# Camada `infra` (Infraestrutura) — DDD

Este documento explica o propósito e as responsabilidades da camada **infra** em um projeto organizado por Domain-Driven Design (DDD). A pasta `src/infra` concentra integrações com serviços externos, adaptadores, clientes, configurações de infraestrutura e implementação de detalhes que dependem do ambiente.

## Objetivo

- Isolar implementações concretas de serviços externos (bancos de dados, storage, APIs, provedores de mensageria, serviços de terceiros como Cloudinary) do domínio e dos casos de uso.
- Permitir troca/falsificação (mocking) fácil das dependências externas durante testes.
- Implementar adaptadores que atendem às interfaces definidas nas camadas `domain` ou `data`.

## Responsabilidades

- Clientes HTTP/SDKs de provedores externos (por exemplo, cliente Cloudinary).
- Conexões com bancos de dados, pools e migrations (adapters de infraestutura).
- Implementações de repositórios ou gateways que dependem de tecnologia (por exemplo, um `CloudinaryStorage` que implementa `IFileStorage`).
- Gerenciamento de arquivos, uploads, downloads e transformações relacionadas ao provedor.
- Configuração de recursos de observabilidade (logs estruturados, métricas e tracing) atinentes à integração com terceiros.

## Principais convenções

- A camada `infra` expõe implementações concretas — nunca interfaces de negócio. As interfaces (contratos) devem viver em `domain` ou `data` para evitar dependências do domínio no infra.
- Usar o padrão Adapter/Port (ou Hexagonal) para adaptar SDKs/clients às interfaces do domínio.
- Manter código específico de terceiros bem isolado em módulos pequenos e testáveis.

## Estrutura recomendada (exemplo)

```
src/infra/
├── cloudinary/          # adaptador e cliente para Cloudinary
│   ├── cloudinaryClient.ts
│   └── cloudinaryStorage.ts
├── database/            # conexões, pools, migrations
│   ├── prismaClient.ts
│   └── repositoryImplementations/
├── logger/              # configuração de logger e formatos
├── queue/               # adaptadores para filas (RabbitMQ, SQS)
└── config/              # carregamento de variáveis de ambiente e validação
```

## Exemplo: integração com Cloudinary

- Coloque o cliente do SDK e um adaptador que implemente o contrato usado pelo domínio. Por exemplo, o domínio define `IFileStorage` com métodos como `upload(file)` e `delete(publicId)`; a `src/infra/cloudinary/cloudinaryStorage.ts` implementa esse contrato usando o SDK do Cloudinary.

Variáveis de ambiente típicas:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Trecho de exemplo (pseudocódigo):

```ts
// src/infra/cloudinary/cloudinaryStorage.ts
import { v2 as cloudinary } from 'cloudinary'
import { IFileStorage } from '../../domain/contracts/IFileStorage'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export class CloudinaryStorage implements IFileStorage {
  async upload(bufferOrPath: Buffer | string) {
    const res = await cloudinary.uploader.upload(bufferOrPath, { folder: 'app' })
    return { url: res.secure_url, publicId: res.public_id }
  }

  async delete(publicId: string) {
    await cloudinary.uploader.destroy(publicId)
  }
}
```

> Nota: Não importe tipos ou entidades do `infra` para o `domain`. A dependência deve ser do domínio para infra (via inversão de dependência ou injeção de dependência no `main`).

## Configuração e segurança

- Armazene credenciais sensíveis fora do código-fonte (variáveis de ambiente, cofre de segredos).
- Valide e documente as variáveis necessárias em `src/infra/config` (por exemplo, usando `zod` ou `joi`).

## Testes

- Testar adaptadores da `infra` com testes de integração isolados (preferencialmente usando fakes ou contas de teste).
- Para testes de unidade do domínio, substitua implementações reais por fakes/mocks que implementem as interfaces do domínio.

## Boas práticas

- Manter o código de integração simples e com responsabilidade única.
- Evitar lógica de negócio na camada `infra` — somente transformação de dados necessária para o provedor.
- Documentar contratos esperados (métodos, formatos de retorno e erros) para facilitar substituições futuras.

## Implantação e operação

- Documentar requisitos de infra (ex.: buckets, permissões, limites de upload) no README desta pasta ou em `infra/` (IaC).
- Adicionar alertas/monitoramento para falhas de integração (ex.: retries, dead-letter queues).

---

Se desejar, posso: 1) adicionar um adaptador de exemplo completo para o Cloudinary em `src/infra/cloudinary`, ou 2) gerar validação de configuração em `src/infra/config`.
