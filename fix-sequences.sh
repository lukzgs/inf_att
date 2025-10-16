#!/bin/bash

# Script para corrigir sequências do PostgreSQL após seed manual
# Uso: ./fix-sequences.sh

echo "🔧 Corrigindo sequências do banco de dados..."

# Conectar ao banco e corrigir todas as sequências
docker exec inf_att-db psql -U user -d inf_att_db <<EOF

-- Corrigir sequência de turmas
SELECT setval('turmas_id_seq', COALESCE((SELECT MAX(id) FROM turmas), 1));

-- Corrigir sequência de usuários
SELECT setval('usuarios_id_seq', COALESCE((SELECT MAX(id) FROM usuarios), 1));

-- Corrigir sequência de disciplinas
SELECT setval('disciplinas_id_seq', COALESCE((SELECT MAX(id) FROM disciplinas), 1));

-- Corrigir sequência de aulas
SELECT setval('aulas_id_seq', COALESCE((SELECT MAX(id) FROM aulas), 1));

-- Corrigir sequência de cursos
SELECT setval('cursos_id_seq', COALESCE((SELECT MAX(id) FROM cursos), 1));

-- Corrigir sequência de grades curriculares
SELECT setval('grades_curriculares_id_seq', COALESCE((SELECT MAX(id) FROM grades_curriculares), 1));

-- Corrigir sequência de cargos
SELECT setval('cargo_id_seq', COALESCE((SELECT MAX(id) FROM cargo), 1));

-- Corrigir sequência de presencas
SELECT setval('presencas_id_seq', COALESCE((SELECT MAX(id) FROM presencas), 1));

EOF

echo "✅ Sequências corrigidas com sucesso!"
echo ""
echo "📊 Valores atuais das sequências:"

docker exec inf_att-db psql -U user -d inf_att_db -c "
SELECT 
  'turmas' as tabela, 
  last_value as proximo_id 
FROM turmas_id_seq
UNION ALL
SELECT 'usuarios', last_value FROM usuarios_id_seq
UNION ALL
SELECT 'disciplinas', last_value FROM disciplinas_id_seq
UNION ALL
SELECT 'aulas', last_value FROM aulas_id_seq;
"
