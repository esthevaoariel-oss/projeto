# MotoGest Pro - Refatoração com SOLID

## 📋 Resumo das Alterações

Este projeto foi refatorado aplicando os princípios **SOLID** para melhorar a testabilidade, manutenibilidade e escalabilidade:

### ✨ Melhorias Implementadas

1. **Separação de Tipos** (Single Responsibility)
   - Tipos divididos em arquivos individuais: `servico.ts`, `moto.ts`, `appointment.ts`, `funcionario.ts`, `user.ts`, `userData.ts`
   - Cada arquivo contém apenas tipos relacionados

2. **Serviço de Storage (Dependency Inversion)**
   # MotoGest Pro

   MotoGest Pro é uma plataforma multiplataforma (web + mobile) para gestão profissional de oficinas de motocicletas. Esta versão foi refatorada com foco em clareza arquitetural, testabilidade e capacidade de evolução: princípios SOLID, separação de responsabilidades e injeção de dependências.

   ## Sumário executivo (para líderes técnicos)

   - Arquitetura: frontends web (React + Vite) e mobile (React Native + Expo) com um contrato de armazenamento (`IStorageService`) que permite trocar a camada de persistência sem impactar a UI.
   - Objetivo desta entrega: transformar a base legada em uma fundação testável e expansível, adicionando o recurso de histórico de consertos com filtragem por dia/semana/mês.

   ## Destaques técnicos

   - TypeScript estrito em toda a base
   - Inversão de dependência via `IStorageService` + React Context (`StorageContext`)
   - Implementações: `LocalStorageService` (web) e `AsyncStorageService` (mobile)
   - Novos tipos e domínio: `ServiceRecord` para manter o histórico de consertos
   - UI: componente `HistoryPanel` com exportação CSV e cartões de estatísticas

   ## Estrutura (resumo)

   - `src/MotoGest_Pro/` — Aplicação web (Vite + React + TypeScript)
   - `src/MotoGest_Pro_Expo/` — Aplicação mobile (Expo + React Native)
   - `src/*/types/` — Tipos do domínio
   - `src/*/services/` — Implementação de armazenamento (`IStorageService`)
   - `src/*/contexts/` — Providers e hooks (injeção de dependência)
   - `src/*/components/` — Componentes visuais reutilizáveis

   ## Pré-requisitos

   - Node.js >= 18
   - npm >= 9
   - Para mobile: Expo CLI (opcionalmente `expo` global)

   ## Instalação e execução

   Web (desenvolvimento)
   ```bash
   cd src/MotoGest_Pro
   npm install
   npm run dev
   ```

   Web (build production)
   ```bash
   npm run build
   ```

   Mobile (Expo)
   ```bash
   cd src/MotoGest_Pro_Expo
   npm install
   npx expo start
   ```

   Credenciais seed para testes

   - Usuário: `admin`
   - Senha: `123`

   ## Como subo para o GitHub por você

   }
