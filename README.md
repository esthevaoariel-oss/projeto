# 🏍️ MotoGest Pro

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)](https://reactjs.org/)
[![React Native](https://img.shields.io/badge/React_Native-0.72-61DAFB?logo=react)](https://reactnative.dev/)
[![Vite](https://img.shields.io/badge/Vite-4.0-646CFF?logo=vite)](https://vitejs.dev/)
[![SOLID](https://img.shields.io/badge/Architecture-SOLID-2EA043)]()

> **Plataforma multiplataforma para gestão profissional de oficinas de motocicletas**  
> *Refatorada com princípios SOLID, injeção de dependências e arquitetura testável*

---

## 📋 Sobre o Projeto

MotoGest Pro é uma solução completa para gestão de oficinas de motocicletas, disponível para **web** e **mobile**. Esta versão foi completamente refatorada aplicando os princípios **SOLID** para garantir:

- ✅ Código testável e de fácil manutenção
- ✅ Baixo acoplamento entre camadas
- ✅ Alta coesão por responsabilidade única
- ✅ Facilidade para extensão sem modificar código existente

---

## 🎯 Aplicação dos Princípios SOLID

| Princípio | Como foi aplicado | Benefício |
|-----------|------------------|------------|
| **S**ingle Responsibility | Tipos separados em arquivos individuais: `servico.ts`, `moto.ts`, `appointment.ts`, `funcionario.ts`, `user.ts`, `userData.ts` | Cada arquivo tem uma única responsabilidade |
| **O**pen/Closed | Interface `IStorageService` permite criar novas implementações (API, Firebase, etc.) sem alterar a UI | Sistema preparado para extensão |
| **L**iskov Substitution | `LocalStorageService` e `AsyncStorageService` são intercambiáveis via Context API | Mesma interface, comportamentos diferentes |
| **I**nterface Segregation | Interfaces específicas como `IAuthService` e `IStorageService` sem métodos não utilizados | Clientes não dependem do que não usam |
| **D**ependency Inversion | Componentes dependem de `IStorageService` (abstração), não de `localStorage` (concreto) | UI desacoplada da persistência |

---

## 🏗️ Arquitetura do Sistema
