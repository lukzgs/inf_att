#!/bin/bash

API_URL="http://localhost:3000"

echo "🌱 Starting seed via API..."
echo ""

# Login como admin para pegar token
echo "🔐 Logging in as admin..."
LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"123456"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to login. Make sure admin user exists."
  exit 1
fi

echo "✅ Logged in successfully"
echo ""

# Criar professores
echo "👨‍🏫 Creating professors..."
PROF1=$(curl -s -X POST "${API_URL}/usuarios" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"carlos.silva@ufrgs.br",
    "name":"Prof. Dr. Carlos Alberto Silva",
    "password":"123456",
    "uniqueIdentifier":"PROF001",
    "roleNames":["PROFESSOR"],
    "isActive":true
  }' | grep -o '"id":[0-9]*' | cut -d':' -f2)

PROF2=$(curl -s -X POST "${API_URL}/usuarios" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"maria.costa@ufrgs.br",
    "name":"Profa. Dra. Maria Fernanda Costa",
    "password":"123456",
    "uniqueIdentifier":"PROF002",
    "roleNames":["PROFESSOR"],
    "isActive":true
  }' | grep -o '"id":[0-9]*' | cut -d':' -f2)

PROF3=$(curl -s -X POST "${API_URL}/usuarios" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"joao.santos@ufrgs.br",
    "name":"Prof. Dr. João Pedro Santos",
    "password":"123456",
    "uniqueIdentifier":"PROF003",
    "roleNames":["PROFESSOR"],
    "isActive":true
  }' | grep -o '"id":[0-9]*' | cut -d':' -f2)

echo "✅ Created 3 professors"
echo ""

# Criar alunos
echo "👨‍🎓 Creating students..."
for i in {1..20}; do
  STUDENT_NUM=$(printf "%08d" $((312345 + i)))
  curl -s -X POST "${API_URL}/usuarios" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"email\":\"aluno${i}@inf.ufrgs.br\",
      \"name\":\"Aluno Teste ${i}\",
      \"password\":\"123456\",
      \"uniqueIdentifier\":\"${STUDENT_NUM}\",
      \"roleNames\":[\"USER\"],
      \"isActive\":true
    }" > /dev/null
done

echo "✅ Created 20 students"
echo ""

# Criar disciplinas
echo "📚 Creating subjects..."
SUBJ1=$(curl -s -X POST "${API_URL}/disciplinas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code":"INF01121",
    "name":"Algoritmos e Programação",
    "description":"Disciplina de algoritmos e estruturas de dados",
    "credits":6,
    "workload":90
  }' | grep -o '"id":[0-9]*' | cut -d':' -f2)

SUBJ2=$(curl -s -X POST "${API_URL}/disciplinas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code":"INF01142",
    "name":"Organização de Computadores",
    "description":"Arquitetura e organização de sistemas computacionais",
    "credits":4,
    "workload":60
  }' | grep -o '"id":[0-9]*' | cut -d':' -f2)

SUBJ3=$(curl -s -X POST "${API_URL}/disciplinas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code":"INF01145",
    "name":"Fundamentos de Bancos de Dados",
    "description":"Modelagem e implementação de bancos de dados",
    "credits":4,
    "workload":60
  }' | grep -o '"id":[0-9]*' | cut -d':' -f2)

SUBJ4=$(curl -s -X POST "${API_URL}/disciplinas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code":"INF01147",
    "name":"Paradigmas de Programação",
    "description":"Diferentes paradigmas de programação",
    "credits":4,
    "workload":60
  }' | grep -o '"id":[0-9]*' | cut -d':' -f2)

SUBJ5=$(curl -s -X POST "${API_URL}/disciplinas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code":"INF01120",
    "name":"Técnicas de Construção de Programas",
    "description":"Técnicas avançadas de programação",
    "credits":4,
    "workload":60
  }' | grep -o '"id":[0-9]*' | cut -d':' -f2)

echo "✅ Created 5 subjects"
echo ""

# Criar turmas
echo "🏫 Creating classes..."
CLASS1=$(curl -s -X POST "${API_URL}/turmas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"code\":\"INF01121-U\",
    \"year\":2025,
    \"semester\":2,
    \"subjectId\":${SUBJ1}
  }" | grep -o '"id":[0-9]*' | cut -d':' -f2)

CLASS2=$(curl -s -X POST "${API_URL}/turmas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"code\":\"INF01142-U\",
    \"year\":2025,
    \"semester\":2,
    \"subjectId\":${SUBJ2}
  }" | grep -o '"id":[0-9]*' | cut -d':' -f2)

CLASS3=$(curl -s -X POST "${API_URL}/turmas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"code\":\"INF01145-U\",
    \"year\":2025,
    \"semester\":2,
    \"subjectId\":${SUBJ3}
  }" | grep -o '"id":[0-9]*' | cut -d':' -f2)

CLASS4=$(curl -s -X POST "${API_URL}/turmas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"code\":\"INF01147-U\",
    \"year\":2025,
    \"semester\":2,
    \"subjectId\":${SUBJ4}
  }" | grep -o '"id":[0-9]*' | cut -d':' -f2)

CLASS5=$(curl -s -X POST "${API_URL}/turmas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"code\":\"INF01120-U\",
    \"year\":2025,
    \"semester\":2,
    \"subjectId\":${SUBJ5}
  }" | grep -o '"id":[0-9]*' | cut -d':' -f2)

echo "✅ Created 5 classes"
echo ""

# Vincular professores às turmas
echo "🔗 Assigning professors to classes..."
curl -s -X POST "${API_URL}/usuarios-turmas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"userId\":${PROF1},\"classId\":${CLASS1},\"role\":\"TEACHER\",\"status\":\"ACTIVE\"}" > /dev/null

curl -s -X POST "${API_URL}/usuarios-turmas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"userId\":${PROF2},\"classId\":${CLASS2},\"role\":\"TEACHER\",\"status\":\"ACTIVE\"}" > /dev/null

curl -s -X POST "${API_URL}/usuarios-turmas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"userId\":${PROF3},\"classId\":${CLASS3},\"role\":\"TEACHER\",\"status\":\"ACTIVE\"}" > /dev/null

curl -s -X POST "${API_URL}/usuarios-turmas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"userId\":${PROF1},\"classId\":${CLASS4},\"role\":\"TEACHER\",\"status\":\"ACTIVE\"}" > /dev/null

curl -s -X POST "${API_URL}/usuarios-turmas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"userId\":${PROF2},\"classId\":${CLASS5},\"role\":\"TEACHER\",\"status\":\"ACTIVE\"}" > /dev/null

echo "✅ Professors assigned"
echo ""

# Matricular alunos (primeiros 10 nas turmas 1-3, últimos 10 nas turmas 4-5)
echo "👥 Enrolling students..."
USUARIOS=$(curl -s "${API_URL}/usuarios" -H "Authorization: Bearer $TOKEN")

for i in {1..10}; do
  STUDENT_ID=$(echo $USUARIOS | grep -o "\"id\":$((i+3))" | head -1 | cut -d':' -f2)
  if [ ! -z "$STUDENT_ID" ]; then
    curl -s -X POST "${API_URL}/usuarios-turmas" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"userId\":${STUDENT_ID},\"classId\":${CLASS1},\"role\":\"STUDENT\",\"status\":\"ACTIVE\"}" > /dev/null
    
    curl -s -X POST "${API_URL}/usuarios-turmas" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"userId\":${STUDENT_ID},\"classId\":${CLASS2},\"role\":\"STUDENT\",\"status\":\"ACTIVE\"}" > /dev/null
  fi
done

for i in {11..20}; do
  STUDENT_ID=$(echo $USUARIOS | grep -o "\"id\":$((i+3))" | head -1 | cut -d':' -f2)
  if [ ! -z "$STUDENT_ID" ]; then
    curl -s -X POST "${API_URL}/usuarios-turmas" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"userId\":${STUDENT_ID},\"classId\":${CLASS3},\"role\":\"STUDENT\",\"status\":\"ACTIVE\"}" > /dev/null
    
    curl -s -X POST "${API_URL}/usuarios-turmas" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"userId\":${STUDENT_ID},\"classId\":${CLASS4},\"role\":\"STUDENT\",\"status\":\"ACTIVE\"}" > /dev/null
  fi
done

echo "✅ Students enrolled"
echo ""

# Criar aulas para hoje e próximos dias
echo "📅 Creating lessons..."
curl -s -X POST "${API_URL}/aulas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"date\":\"2025-10-02\",\"startTime\":\"10:30\",\"endTime\":\"12:10\",\"classId\":${CLASS1}}" > /dev/null

curl -s -X POST "${API_URL}/aulas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"date\":\"2025-10-02\",\"startTime\":\"14:00\",\"endTime\":\"15:40\",\"classId\":${CLASS2}}" > /dev/null

curl -s -X POST "${API_URL}/aulas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"date\":\"2025-10-02\",\"startTime\":\"16:00\",\"endTime\":\"17:40\",\"classId\":${CLASS3}}" > /dev/null

curl -s -X POST "${API_URL}/aulas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"date\":\"2025-10-03\",\"startTime\":\"08:30\",\"endTime\":\"10:10\",\"classId\":${CLASS4}}" > /dev/null

curl -s -X POST "${API_URL}/aulas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"date\":\"2025-10-03\",\"startTime\":\"14:00\",\"endTime\":\"15:40\",\"classId\":${CLASS5}}" > /dev/null

curl -s -X POST "${API_URL}/aulas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"date\":\"2025-10-06\",\"startTime\":\"10:30\",\"endTime\":\"12:10\",\"classId\":${CLASS1}}" > /dev/null

curl -s -X POST "${API_URL}/aulas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"date\":\"2025-10-08\",\"startTime\":\"14:00\",\"endTime\":\"15:40\",\"classId\":${CLASS2}}" > /dev/null

curl -s -X POST "${API_URL}/aulas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"date\":\"2025-10-09\",\"startTime\":\"16:00\",\"endTime\":\"17:40\",\"classId\":${CLASS3}}" > /dev/null

echo "✅ Created 8 lessons"
echo ""

echo "✨ Seed completed successfully!"
echo ""
echo "📊 Summary:"
echo "   • 3 professors"
echo "   • 20 students"
echo "   • 5 subjects"
echo "   • 5 classes"
echo "   • 8 lessons"
echo ""
echo "🔐 Login credentials:"
echo "   • Admin: admin@example.com / 123456"
echo "   • Professor: carlos.silva@ufrgs.br / 123456"
echo "   • Student: aluno1@inf.ufrgs.br / 123456"
