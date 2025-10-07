import jsPDF from 'jspdf';

/**
 * Interface para dados da turma no PDF
 */
interface ClassPDFData {
  code: string;
  subjectName: string;
  year: number;
  semester: number;
  professorName: string;
  totalStudents: number;
  totalLessons: number;
  avgFrequency: number;
  students: Array<{
    name: string;
    email: string;
    attendancePercentage: number;
    totalAttendances: number;
    totalLessons: number;
  }>;
  generatedAt: string;
}

/**
 * Gera PDF com relatório de frequência da turma
 * 
 * Layout profissional com:
 * - Header com título e logo (texto)
 * - Informações da turma
 * - Estatísticas gerais
 * - Tabela de alunos com frequência
 * - Footer com data de geração
 * 
 * @param data - Dados da turma para o relatório
 */
export function generateAttendancePDF(data: ClassPDFData): void {
  const doc = new jsPDF();
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // ========================
  // HEADER
  // ========================
  
  // Logo/Título (texto estilizado)
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(59, 130, 246); // primary blue
  doc.text('Sistema de Presença', margin, yPosition);
  
  yPosition += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Relatório de Frequência', margin, yPosition);
  
  // Linha separadora
  yPosition += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  
  yPosition += 15;

  // ========================
  // INFORMAÇÕES DA TURMA
  // ========================
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Informações da Turma', margin, yPosition);
  
  yPosition += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const infoLines = [
    `Código: ${data.code}`,
    `Disciplina: ${data.subjectName}`,
    `Período: ${data.year}/${data.semester}`,
    `Professor: ${data.professorName}`,
  ];
  
  infoLines.forEach(line => {
    doc.text(line, margin, yPosition);
    yPosition += 7;
  });
  
  yPosition += 5;

  // ========================
  // ESTATÍSTICAS GERAIS
  // ========================
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Estatísticas Gerais', margin, yPosition);
  
  yPosition += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  // Background colorido para stats
  const statsBoxHeight = 25;
  doc.setFillColor(240, 249, 255); // light blue
  doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, statsBoxHeight, 'F');
  
  const statItems = [
    { label: 'Total de Alunos', value: data.totalStudents.toString() },
    { label: 'Aulas Realizadas', value: data.totalLessons.toString() },
    { label: 'Frequência Média', value: `${data.avgFrequency.toFixed(1)}%` },
  ];
  
  const statWidth = (pageWidth - 2 * margin) / 3;
  statItems.forEach((stat, index) => {
    const x = margin + index * statWidth + 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(stat.value, x, yPosition + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(stat.label, x, yPosition + 12);
  });
  
  yPosition += statsBoxHeight + 10;

  // ========================
  // TABELA DE ALUNOS
  // ========================
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Lista de Alunos', margin, yPosition);
  
  yPosition += 10;

  // Cabeçalho da tabela
  const colWidths = {
    name: 70,
    email: 60,
    attendance: 30,
    percentage: 30,
  };
  
  doc.setFillColor(59, 130, 246); // primary blue
  doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 10, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255); // white text
  
  let xPos = margin + 2;
  doc.text('Nome', xPos, yPosition);
  xPos += colWidths.name;
  doc.text('Email', xPos, yPosition);
  xPos += colWidths.email;
  doc.text('Presenças', xPos, yPosition);
  xPos += colWidths.attendance;
  doc.text('Frequência', xPos, yPosition);
  
  yPosition += 5;
  
  // Linhas de dados
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  data.students.forEach((student, index) => {
    // Verifica se precisa de nova página
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = margin;
    }
    
    // Linha alternada (zebra striping)
    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251); // light gray
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
    }
    
    yPosition += 6;
    
    xPos = margin + 2;
    
    // Nome (truncado se muito longo)
    const name = student.name.length > 30 
      ? student.name.substring(0, 27) + '...' 
      : student.name;
    doc.text(name, xPos, yPosition);
    xPos += colWidths.name;
    
    // Email (truncado)
    const email = student.email.length > 28 
      ? student.email.substring(0, 25) + '...' 
      : student.email;
    doc.text(email, xPos, yPosition);
    xPos += colWidths.email;
    
    // Presenças
    doc.text(`${student.totalAttendances}/${student.totalLessons}`, xPos, yPosition);
    xPos += colWidths.attendance;
    
    // Percentual com cor
    const percentage = student.attendancePercentage;
    if (percentage >= 75) {
      doc.setTextColor(34, 197, 94); // green
    } else if (percentage >= 50) {
      doc.setTextColor(234, 179, 8); // yellow
    } else {
      doc.setTextColor(239, 68, 68); // red
    }
    doc.setFont('helvetica', 'bold');
    doc.text(`${percentage.toFixed(1)}%`, xPos, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    yPosition += 2;
  });
  
  // ========================
  // FOOTER
  // ========================
  
  const footerY = pageHeight - 15;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Relatório gerado em ${data.generatedAt}`,
    margin,
    footerY
  );
  
  doc.text(
    'Sistema de Controle de Presença - v1.0',
    pageWidth - margin - 60,
    footerY
  );

  // ========================
  // SALVAR PDF
  // ========================
  
  const filename = `frequencia_${data.code.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

/**
 * Formata data para exibição no PDF
 */
export function formatPDFDate(date: Date = new Date()): string {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  
  return date.toLocaleDateString('pt-BR', options);
}
