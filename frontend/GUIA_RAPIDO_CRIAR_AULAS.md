# 🎓 Guia Rápido: Como Criar Aulas

## 📍 Acessando o Modal

1. Entre na página de uma turma
2. Clique no botão **"+ Criar Nova Aula"**
3. Modal abre com formulário

---

## 🎯 Modo 1: Aula Única (Tradicional)

### Passo a Passo

```
┌─────────────────────────────────────────────┐
│ Criar Nova Aula                         [X] │
├─────────────────────────────────────────────┤
│                                             │
│ 🔄 Aulas Recorrentes          [OFF]         │ ← Deixe DESLIGADO
│                                             │
│ 📅 Data da Aula *                           │
│ ┌─────────────────────────────────────────┐ │
│ │ 07/10/2025                    [📅]      │ │ ← Clique para abrir calendário
│ └─────────────────────────────────────────┘ │
│                                             │
│ ⏰ Início *          ⏰ Término *            │
│ ┌──────────────┐    ┌──────────────┐       │
│ │ 14:00  [🕐] │    │ 16:00  [🕐] │       │ ← Clique para escolher hora
│ └──────────────┘    └──────────────┘       │
│                                             │
│ 📝 Título da Aula (opcional)                │
│ ┌─────────────────────────────────────────┐ │
│ │ Introdução à Programação                │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ 📄 Descrição (opcional)                     │
│ ┌─────────────────────────────────────────┐ │
│ │ Conceitos básicos de lógica...          │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ 🔒 Exigir Senha para Presença    [OFF]     │ ← (Opcional)
│                                             │
│            [ Cancelar ]  [ Criar Aula ]     │
└─────────────────────────────────────────────┘
```

### Resultado
✅ **1 aula criada** para o dia e horário especificados

---

## 🔄 Modo 2: Aulas Recorrentes (NOVO!)

### Cenário Exemplo
**Quero criar**: Aulas todas as Terças e Quintas, 14:00-16:00, por 8 semanas

### Passo a Passo

#### 1️⃣ Ative "Aulas Recorrentes"

```
┌─────────────────────────────────────────────┐
│ 🔄 Aulas Recorrentes          [ON] ✓        │ ← ATIVE o toggle
│ Crie múltiplas aulas automaticamente...     │
└─────────────────────────────────────────────┘
```

#### 2️⃣ Selecione a Data Inicial

```
┌─────────────────────────────────────────────┐
│ 📅 Data Inicial *                           │
│ ┌─────────────────────────────────────────┐ │
│ │ 07/10/2025 (Terça)            [📅]      │ │ ← Primeira aula
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

#### 3️⃣ Escolha os Dias da Semana

```
┌─────────────────────────────────────────────┐
│ Dias da Semana *                            │
│                                             │
│ [Dom] [Seg] [Ter✓] [Qua] [Qui✓] [Sex] [Sáb]│
│   ↑           ↑             ↑               │
│   Clique para selecionar/desselecionar      │
│                                             │
│ ✓ Ter = Terças    ✓ Qui = Quintas          │
└─────────────────────────────────────────────┘
```

#### 4️⃣ Defina Número de Semanas

```
┌─────────────────────────────────────────────┐
│ Número de Semanas *                         │
│ ┌─────────────────────────────────────────┐ │
│ │ 8                                       │ │ ← 1 a 20 semanas
│ └─────────────────────────────────────────┘ │
│                                             │
│ ℹ️  Serão criadas 16 aulas no total         │
│    (2 dias × 8 semanas = 16 aulas)          │
└─────────────────────────────────────────────┘
```

#### 5️⃣ Configure Horários

```
┌─────────────────────────────────────────────┐
│ ⏰ Início *          ⏰ Término *            │
│ ┌──────────────┐    ┌──────────────┐       │
│ │ 14:00        │    │ 16:00        │       │
│ └──────────────┘    └──────────────┘       │
│                                             │
│ Todas as aulas terão esse horário           │
└─────────────────────────────────────────────┘
```

#### 6️⃣ (Opcional) Adicione Detalhes

```
┌─────────────────────────────────────────────┐
│ 📝 Título da Aula (opcional)                │
│ ┌─────────────────────────────────────────┐ │
│ │ Programação Web                         │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ 📄 Descrição (opcional)                     │
│ ┌─────────────────────────────────────────┐ │
│ │ Curso completo de desenvolvimento web   │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ 🔒 Exigir Senha para Presença    [ON]      │
│ ┌─────────────────────────────────────────┐ │
│ │ WEB2025                                 │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

#### 7️⃣ Crie Todas as Aulas

```
┌─────────────────────────────────────────────┐
│      [ Cancelar ]  [ Criar 16 Aulas ]       │ ← Botão mostra total
└─────────────────────────────────────────────┘
```

### Resultado

```
✅ 16 aulas criadas com sucesso!

Calendário:
┌───────────────────────────────────────┐
│ Semana 1                              │
│ • Ter, 07/10/2025  14:00-16:00        │
│ • Qui, 09/10/2025  14:00-16:00        │
├───────────────────────────────────────┤
│ Semana 2                              │
│ • Ter, 14/10/2025  14:00-16:00        │
│ • Qui, 16/10/2025  14:00-16:00        │
├───────────────────────────────────────┤
│ ...                                   │
├───────────────────────────────────────┤
│ Semana 8                              │
│ • Ter, 25/11/2025  14:00-16:00        │
│ • Qui, 27/11/2025  14:00-16:00        │
└───────────────────────────────────────┘

Total: 16 aulas prontas para usar! 🎉
```

---

## 🎨 Como Usar o Date Picker

### Abrindo o Calendário

```
1. Clique no campo de data

┌─────────────────────────────────────────┐
│ 📅 Data da Aula *                       │
│ ┌─────────────────────────────────────┐ │
│ │ 07/10/2025              [📅] ←CLIQUE│ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

2. Calendário abre automaticamente

┌──────────────────────────────────────┐
│  Outubro 2025              ◀    ▶    │ ← Navegação
├──────────────────────────────────────┤
│  Dom  Seg  Ter  Qua  Qui  Sex  Sáb   │
│                   1    2    3    4    │
│   5    6   ⬤7    8    9   10   11    │ ← Dia 7 selecionado
│  12   13   14   15   16   17   18    │
│  19   20   21   22   23   24   25    │
│  26   27   28   29   30   31         │
└──────────────────────────────────────┘

3. Clique no dia desejado
4. Calendário fecha automaticamente
5. Data aparece no campo: 07/10/2025 ✓
```

### Navegação

```
◀ Seta Esquerda  = Mês anterior
▶ Seta Direita   = Próximo mês
Clique no mês/ano = Dropdown de seleção rápida
```

---

## ⏰ Como Usar o Time Picker

### Selecionando Horário

```
1. Clique no campo de hora

┌────────────────────┐
│ ⏰ Início *        │
│ ┌────────────────┐ │
│ │ 14:00    [🕐] │ ← CLIQUE
│ └────────────────┘ │
└────────────────────┘

2. Lista de horários abre

┌────────────────┐
│  08:00         │
│  08:15         │
│  08:30         │
│  08:45         │
│  ...           │
│  13:45         │
│ ⬤ 14:00       │ ← Horário selecionado
│  14:15         │
│  14:30         │
│  ...           │
│  22:00         │
└────────────────┘

3. Role pela lista ou clique
4. Horário selecionado aparece no campo ✓
```

### Atalhos

```
• Scroll do mouse = Navegar pela lista
• Setas do teclado = Selecionar horário
• Enter = Confirmar
• Esc = Fechar sem selecionar
```

---

## 🎯 Dicas Práticas

### ✅ Melhor Prática 1: Planejamento Semestral

```
Para um curso semestral típico (16 semanas):

1. Ative "Aulas Recorrentes"
2. Selecione dias de aula (ex: Ter e Qui)
3. Configure 16 semanas
4. Uma ação cria ~32 aulas! ⚡

Economia de tempo:
Antes: 32 aulas × 5min = 160 minutos
Agora: 1 ação × 2min = 2 minutos
Economia: 99% do tempo! 🚀
```

### ✅ Melhor Prática 2: Aulas Especiais

```
Para aulas únicas (provas, seminários):

1. Deixe "Aulas Recorrentes" DESLIGADO
2. Selecione data específica
3. Configure título diferente (ex: "Prova Final")
4. Crie

Flexibilidade total! 🎯
```

### ✅ Melhor Prática 3: Senha de Presença

```
Use senhas simples e fáceis de ditar:

✅ Boas senhas:
- AULA01
- WEB2025
- PROG123
- SENHA10

❌ Evite:
- p@ssw0rd! (difícil de ditar)
- senhamuito-complicada
- 1234 (muito simples)

Tamanho: 4-20 caracteres
```

---

## ⚠️ Troubleshooting

### Problema: "Selecione pelo menos um dia da semana"

```
❌ Você ativou recorrência mas não selecionou dias

Solução:
Clique em pelo menos 1 botão de dia:
[Dom] [Seg✓] [Ter] [Qua] [Qui] [Sex] [Sáb]
```

### Problema: "Senha deve ter entre 4 e 20 caracteres"

```
❌ Senha muito curta ou longa

Solução:
Digite senha com 4-20 caracteres:
┌─────────────────┐
│ WEB2025         │ ✅ (7 caracteres)
└─────────────────┘
```

### Problema: Não consigo ver o calendário

```
❌ Calendário não abre

Soluções:
1. Recarregue a página (F5)
2. Limpe cache do navegador
3. Teste em outro navegador
4. Verifique console (F12)
```

### Problema: Datas passadas estão bloqueadas

```
✅ Isso é normal!

O sistema só permite criar aulas futuras.
Data mínima = hoje
```

---

## 📊 Cálculo de Aulas

### Fórmula

```
Total de Aulas = Dias Selecionados × Número de Semanas
```

### Exemplos

```
1 dia × 10 semanas   = 10 aulas
2 dias × 8 semanas   = 16 aulas
3 dias × 12 semanas  = 36 aulas
5 dias × 4 semanas   = 20 aulas (intensivo!)
```

### Contador em Tempo Real

```
O modal mostra o total automaticamente:

┌─────────────────────────────────────────┐
│ ℹ️  Serão criadas 24 aulas no total     │
└─────────────────────────────────────────┘

E no botão:
[ Criar 24 Aulas ]
```

---

## 🎓 Casos de Uso

### Caso 1: Curso Regular

```
Disciplina: Algoritmos
Frequência: 2× por semana (Seg e Qua)
Duração: 16 semanas
Horário: 10:00-12:00

Configuração:
• Recorrente: ON
• Dias: [Seg✓] [Qua✓]
• Semanas: 16
• Horário: 10:00-12:00

Resultado: 32 aulas criadas ✓
```

### Caso 2: Workshop Intensivo

```
Evento: Workshop de Python
Frequência: Todos os dias úteis
Duração: 2 semanas
Horário: 14:00-18:00

Configuração:
• Recorrente: ON
• Dias: [Seg✓][Ter✓][Qua✓][Qui✓][Sex✓]
• Semanas: 2
• Horário: 14:00-18:00

Resultado: 10 aulas criadas ✓
```

### Caso 3: Aula Avulsa

```
Evento: Palestra com convidado
Data: 15/11/2025
Horário: 19:00-21:00

Configuração:
• Recorrente: OFF
• Data: 15/11/2025
• Horário: 19:00-21:00
• Título: "Palestra: IA no Mercado"

Resultado: 1 aula criada ✓
```

---

## ✨ Resumo

### 3 Passos para Aulas Recorrentes

1. **ATIVE** o toggle "Aulas Recorrentes"
2. **SELECIONE** dias da semana + número de semanas
3. **CRIE** todas as aulas de uma vez

### 3 Cliques para Aula Única

1. **CLIQUE** no date picker → escolha data
2. **CLIQUE** no time picker → escolha hora
3. **CLIQUE** em "Criar Aula"

---

**Fácil, rápido e eficiente!** 🚀
