# Projeto API com Monitoramento, Metricas e Banco de Dados MongoDB Replicado

Este projeto configura um ambiente de desenvolvimento para uma API que utiliza MongoDB replicado, Prometheus para monitoramento e Grafana para visualização dos dados de monitoramento. A configuração é gerenciada utilizando Docker Compose.

## Serviços

### API
- **Build**: Diretório atual
- **Container Name**: `api`
- **Portas**: `3000:3000`
- **Variáveis de Ambiente**:
  - `DATABASE_URL`: URL do MongoDB
  - `PROMETHEUS_URI`: URL do Prometheus
  - `GRAFANA_URI`: URL do Grafana
- **Dependências**:
  - `mongodb`
  - `prometheus`
  - `grafana`
- **Redes**:
  - `my-network`

### MongoDB
- **Imagem**: `docker.io/bitnami/mongodb:7.0`
- **Container Name**: `mongodb`
- **Portas**: `27017:27017`
- **Variáveis de Ambiente**:
  - `MONGODB_ADVERTISED_HOSTNAME`: `mongodb`
  - `MONGODB_ROOT_USERNAME`: `root`
  - `MONGODB_ROOT_PASSWORD`: `root`
  - `MONGODB_REPLICA_SET_MODE`: `primary`
  - `MONGODB_REPLICA_SET_KEY`: `replicasetkey123`
  - `MONGODB_USERNAME`: `root`
  - `MONGODB_PASSWORD`: `root`
  - `MONGODB_DATABASE`: `dev`
- **Volumes**:
  - `mongodb_data:/bitnami/mongodb`
- **Redes**:
  - `my-network`

### MongoDB Secundário
- **Imagem**: `docker.io/bitnami/mongodb:7.0`
- **Dependências**:
  - `mongodb`
- **Variáveis de Ambiente**:
  - `MONGODB_ADVERTISED_HOSTNAME`: `mongodb-secondary`
  - `MONGODB_REPLICA_SET_MODE`: `secondary`
  - `MONGODB_INITIAL_PRIMARY_HOST`: `mongodb`
  - `MONGODB_INITIAL_PRIMARY_ROOT_PASSWORD`: `root`
  - `MONGODB_REPLICA_SET_KEY`: `replicasetkey123`
- **Redes**:
  - `my-network`

### MongoDB Árbitro
- **Imagem**: `docker.io/bitnami/mongodb:7.0`
- **Dependências**:
  - `mongodb`
- **Variáveis de Ambiente**:
  - `MONGODB_ADVERTISED_HOSTNAME`: `mongodb-arbiter`
  - `MONGODB_REPLICA_SET_MODE`: `arbiter`
  - `MONGODB_INITIAL_PRIMARY_HOST`: `mongodb`
  - `MONGODB_INITIAL_PRIMARY_ROOT_PASSWORD`: `root`
  - `MONGODB_REPLICA_SET_KEY`: `replicasetkey123`
- **Redes**:
  - `my-network`

### Prometheus
- **Imagem**: `prom/prometheus:latest`
- **Container Name**: `prometheus`
- **Portas**: `9090:9090`
- **Volumes**:
  - `./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml`
  - `prometheus_data:/prometheus`
- **Redes**:
  - `my-network`

### Grafana
- **Imagem**: `grafana/grafana:latest`
- **Container Name**: `grafana`
- **Portas**: `3001:3000`
- **Variáveis de Ambiente**:
  - `GF_SECURITY_ADMIN_USER`: `admin`
  - `GF_SECURITY_ADMIN_PASSWORD`: `admin`
- **Volumes**:
  - `./grafana:/var/lib/grafana`
- **Redes**:
  - `my-network`

## Redes

- **my-network**: Rede externa

## Volumes

- **mongodb_data**: Driver local
- **prometheus_data**: Driver local
- **grafana_data**: Driver local

## Features

### Autenticação e Registro de Usuários

- **JWT e Auth Guard**: O sistema utiliza JSON Web Tokens (JWT) para autenticação e o Auth Guard para proteger rotas.
- **Rotas**:
  - `POST /auth/login`: Login de usuário.
  - `POST /auth/register`: Registro de novo usuário.
  - `GET /auth/profile`: Perfil do usuário autenticado.

### Recurso de Usuário

- **Listagem de Usuários**: Apenas usuários com a permissão de administrador podem listar todos os usuários.
- **Rotas**:
  - `GET /users`: Lista todos os usuários (requer permissão de administrador).
  - `GET /users`: Para listar um usuário (requer permissão de administrador).

### Swagger

- **Documentação da API**: A API possui documentação gerada pelo Swagger disponível em `/swagger`.

## Exemplos de Rotas

### Testando as Rotas com VSCode REST Client

## Para testar as rotas utilizando a extensão REST Client no VSCode, siga os passos abaixo:

  1 - Instale a Extensão REST Client: No VSCode.

  2 - Acesse o Arquivo api.http.

  3 - Abra o arquivo api.http no VSCode. Cada requisição terá um botão "Send Request" acima dela. Clique neste botão para enviar a requisição e ver a resposta diretamente no VSCode.


### Como Usar

  ## Certifique-se de que a rede my-network esteja criada. Caso contrário, crie-a com o comando:

```bash
docker network create my-network
```

## Para iniciar os serviços, utilize o comando:

```bash
docker-compose up -d
```

## Acesse os serviços nas seguintes URLs:
        API: http://localhost:3000
        Prometheus: http://localhost:9090
        Grafana: http://localhost:3001
        Swagger: http://localhost:3000/api-docs

## Estrutura do Projeto
    api: Contém o código-fonte da API.
    prometheus: Contém a configuração do Prometheus.
    grafana: Contém a configuração e os dados do Grafana.

## Monitoramento

    Prometheus: Usado para coletar métricas e monitorar os serviços.
    Grafana: Usado para visualizar os dados de monitoramento coletados pelo Prometheus.

## Notas
    Certifique-se de ajustar as variáveis de ambiente e volumes conforme necessário para seu ambiente de desenvolvimento.
    O MongoDB está configurado com replicação para garantir alta disponibilidade e redundância dos dados.
