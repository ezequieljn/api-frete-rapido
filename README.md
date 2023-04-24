## Projeto Backend com Node.js - Frete Rapido

Este projeto é composto por um backend desenvolvido em **Node.js**, que tem como objetivo realizar consultas de cotação de frete para um determinado **CEP**, considerando alguns **itens**.

### Sobre

O projeto foi construído seguindo algumas boas práticas, como **SOLID** e **Ports and Adapters**, visando o desacoplamento e a criação de testes, como testes de unidade, testes de integração e testes E2E.

A cobertura de testes está acima de **90%** e pode ser verificada por meio do comando.

```bash
npm run test -- --coverage
```

### Pré-requisitos

Antes de executar o projeto, é necessário ter o Docker e o Node.js instalados na máquina.

### Instalação

1. Clone o repositório:

```shell
git clone https://github.com/ezequieljn/api-frete-rapido
```

2. Inicie o container:

```bash
cd api-frete-rapido

docker compose up -d
```

- Caso tenha algum problema com permissão do .docker/entrypoint.sh fornessa permissão como o comando

```bash
chmod +x ./.docker/entrypoint.sh
```

Ou crie o arquivo .env manualmente, inserindo as variáveis presentes no arquivo .env.example

### Utilização

O projeto estará disponível em `http://localhost:3030` localmente.

O projeto também pode ser testado em `https://freterapido.dok3s.srobot.dev`, que está hospedado no servidor K8s.

##### Rotas HTTP

A seguir, são listadas todas as rotas HTTP disponíveis neste projeto:

- **POST /quote**

Essa rota faz consulta da contação baseado no **CEP** e **Volume**.

**Exemplo de parametros**

```json
{
  "recipient": {
    "address": {
      "zipcode": "39400200"
    }
  },
  "volumes": [
    {
      "category": 7,
      "amount": 2,
      "unitary_weight": 4,
      "price": 556,
      "sku": "abc-teste-527",
      "height": 0.4,
      "width": 0.6,
      "length": 0.15
    }
  ]
}
```

**Exemplo de resposta**

```json
{
  "carrier": [
    {
      "name": "CORREIOS",
      "service": "Normal",
      "deadline": 7,
      "price": 58.42
    },
    {
      "name": "EXPRESSO FR (TESTE)",
      "service": "Normal",
      "deadline": 7,
      "price": 98.11
    },
    {
      "name": "RAPIDÃO FR (TESTE)",
      "service": "Normal",
      "deadline": 7,
      "price": 114.23
    }
  ]
}
```

- **GET /metrics?last_quotes={n}**

Esta rota retorna as métricas das cotações que já foram realizadas.
O parâmetro '**last_quotes**' é opcional e tem a responsabilidade de filtrar a quantidade das últimas cotações.

**Exemplo de resposta**

```json
{
  "totalAndMediaPrice": [
    {
      "shipping_company": "CORREIOS",
      "total_price": 233.68,
      "average_price": 58.42
    },
    {
      "shipping_company": "EXPRESSO FR (TESTE)",
      "total_price": 392.44,
      "average_price": 98.11
    },
    {
      "shipping_company": "RAPIDÃO FR (TESTE)",
      "total_price": 456.92,
      "average_price": 114.23
    }
  ],
  "lowestHighestPrice": {
    "lowest": 58.42,
    "highest": 114.23
  },
  "amountCarrier": [
    {
      "shipping_company": "CORREIOS",
      "amount": "4"
    },
    {
      "shipping_company": "EXPRESSO FR (TESTE)",
      "amount": "4"
    },
    {
      "shipping_company": "RAPIDÃO FR (TESTE)",
      "amount": "4"
    }
  ]
}
```
