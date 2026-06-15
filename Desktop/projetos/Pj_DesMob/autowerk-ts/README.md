# MotoGest Pro - Refatoração com SOLID

## 📋 Resumo das Alterações

Este projeto foi refatorado aplicando os princípios **SOLID** para melhorar a testabilidade, manutenibilidade e escalabilidade:

### ✨ Melhorias Implementadas

1. **Separação de Tipos** (Single Responsibility)
   - Tipos divididos em arquivos individuais: `servico.ts`, `moto.ts`, `appointment.ts`, `funcionario.ts`, `user.ts`, `userData.ts`
   - Cada arquivo contém apenas tipos relacionados

2. **Serviço de Storage (Dependency Inversion)**
   - Criada interface `IStorageService` que define o contrato
   - Implementação `LocalStorageService` para web (MotoGest_Pro)
   - Implementação `AsyncStorageService` para mobile (MotoGest_Pro_Expo)
   - Facilita testes e troca de implementações

3. **Injeção de Dependência (Contexto React)**
   - `StorageContext.tsx` fornece o serviço via React Context
   - Hook `useStorage()` para acessar o serviço nos componentes
   - Elimina imports diretos do utilitário `storage`

## 🚀 Como Executar

### MotoGest_Pro (Web - Vite + React)

```bash
cd src/MotoGest_Pro

# Instalar dependências (opcional, já estão instaladas)
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

O projeto estará disponível em `http://localhost:5173`

**Credenciais de teste:**
- Usuário: `admin`
- Senha: `123`

### MotoGest_Pro_Expo (Mobile - React Native)

```bash
cd src/MotoGest_Pro_Expo

# Instalar dependências (opcional, já estão instaladas)
npm install

# Iniciar Expo
npm start

# Opções:
# - Pressione 'i' para iOS simulator
# - Pressione 'a' para Android emulator
# - Pressione 'w' para web preview
# - Escaneie o QR code com seu dispositivo (precisa de Expo Go)
```

**Credenciais de teste:**
- Usuário: `admin`
- Senha: `123`

## 📁 Estrutura do Projeto

### Antes (Monolítico)
```
src/
├── types/index.ts (todos os tipos juntos)
└── utils/storage.ts (lógica de storage + implementação)
```

### Depois (Modular)
```
src/
├── types/
│   ├── index.ts (re-exports)
│   ├── servico.ts
│   ├── moto.ts
│   ├── appointment.ts
│   ├── funcionario.ts
│   ├── user.ts
│   └── userData.ts
├── services/
│   └── storageService.ts (interface + implementação)
├── contexts/
│   └── StorageContext.tsx (provider + hook)
├── utils/
│   └── storage.ts (instância do serviço)
└── components/
    └── (componentes agora usam useStorage())
```

## 🧪 Testabilidade

Agora é fácil criar mocks para testes:

```typescript
// Mock para testes
class MockStorageService implements IStorageService {
  async getUsers(): Promise<User[]> {
    return []; // retornar dados de teste
  }
  // ... implementar outros métodos
}

// Usar no teste
const mockStorage = new MockStorageService();
// Testar componentes com o mock
```

## 🎯 Princípios SOLID Aplicados

- **S**ingle Responsibility: Cada arquivo tem uma única responsabilidade
- **O**pen/Closed: Aberto para extensão (novas implementações de storage), fechado para modificação
- **L**iskov Substitution: Qualquer implementação de `IStorageService` pode ser usada
- **I**nterface Segregation: Interface mínima e específica
- **D**ependency Inversion: Componentes dependem da interface, não da implementação

## 📝 Próximos Passos Recomendados

1. Adicionar testes unitários para os serviços
2. Implementar retry logic no AsyncStorageService
3. Adicionar error handling mais robusto
4. Criar testes E2E para os fluxos de autenticação
5. Adicionar logging e monitoring

## 🔧 Troubleshooting

### Erro: "useStorage must be used within a StorageProvider"
- Certifique-se que o componente está dentro de `<StorageProvider>`

### Erro de tipos no TypeScript
- Verificar se todos os imports de tipos estão corretos
- Executar `npm run build` para validar tipos

### Problema ao rodar Expo
- Limpar cache: `npm start -- --clear`
- Atualizar Expo CLI: `npm install -g expo-cli@latest`

---

**Desenvolvido com ❤️ seguindo princípios SOLID**
