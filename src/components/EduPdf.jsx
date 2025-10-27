import { jsPDF } from "jspdf";

function miles(n) {
  return n != null ? Number(n).toLocaleString("es-CL") : "—";
}

export function buildEducacionPdf({
  resumen,
  sexo,
  ultimoAnio,
  kpiTotalSistema,
  hombresUlt,
  mujeresUlt,
  parvulariaUlt,
  basicaUlt,
  mediaJovenUlt,
}) {
  const doc = new jsPDF({
    unit: "pt",
    format: "letter",
  });

  const marginX = 40;
  let y = 60;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Informe Educación", marginX, y);
  y += 28;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(
    [
      "Plataforma de Datos Sociales de Chile.",
      "Este informe resume el estado del sistema educacional chileno con lenguaje claro",
      "para apoyar análisis ciudadano, sindical, territorial y de políticas públicas.",
    ],
    marginX,
    y
  );
  y += 60;

  const introLines = doc.splitTextToSize(
    [
      "La educación en Chile es un pilar de bienestar y democracia. El sistema arrastra nudos que requieren acción: la reactivación postpandemia no debe ser un retorno inercial, sino una ocasión para reimaginar escuela, convivencia y currículo con sentido público y participación de las comunidades.",
      "",
      "El financiamiento es parte del mismo giro: un Estado moderno debe asignar recursos con eficiencia y justicia, superar el endeudamiento como regla y sacar a la banca del centro de la política educativa. La deuda por estudiar afecta a los hogares y tensiona la sostenibilidad del sistema; alivios como \"Chao Dicom\" fueron pasos útiles, pero no sustituyen la solución estructural.",
      "",
      "Esta lectura busca orientar acuerdos: educación como derecho social, en equilibrio con la libertad de enseñanza, al servicio de un futuro más justo y democrático.",
    ].join("\n"),
    515
  );

  doc.setFontSize(11);
  doc.text(introLines, marginX, y);
  y += introLines.length * 14 + 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Indicadores clave del sistema educativo", marginX, y);
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const kpiLines = doc.splitTextToSize(
    [
      `Año ${ultimoAnio || "—"}:`,
      `- Matrícula total: ${kpiTotalSistema}`,
      `- Matrícula hombres: ${hombresUlt}`,
      `- Matrícula mujeres: ${mujeresUlt}`,
      `- Parvularia: ${parvulariaUlt}`,
      `- Básica (niños): ${basicaUlt}`,
      `- Media (jóvenes): ${mediaJovenUlt}`,
    ].join("\n"),
    515
  );
  doc.text(kpiLines, marginX, y);
  y += kpiLines.length * 14 + 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Distribución por sexo", marginX, y);
  y += 20;

  const distSexoIntro = sexo?.anio
    ? `En ${sexo.anio}, la participación por sexo en la matrícula total refleja brechas de acceso y permanencia. Estos porcentajes ayudan a detectar si hay sesgos que deben abordarse con políticas específicas.`
    : "La distribución por sexo no está disponible.";

  const distSexoLines = doc.splitTextToSize(distSexoIntro, 515);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(distSexoLines, marginX, y);
  y += distSexoLines.length * 14 + 10;

  if (sexo?.genero?.length) {
    const generoTxt = sexo.genero
      .map(
        (g) =>
          `- ${g.sexo}: ${miles(g.matricula)} (${g.porcentaje}%)`
      )
      .join("\n");

    const generoLines = doc.splitTextToSize(generoTxt, 515);
    doc.text(generoLines, marginX, y);
    y += generoLines.length * 14 + 20;
  } else {
    y += 20;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Evolución por nivel educativo", marginX, y);
  y += 20;

  const nivelesLines = doc.splitTextToSize(
    [
      "Se observan trayectorias distintas entre niveles: Parvularia, Básica, Media para jóvenes, formación de adultos/as y Educación Especial.",
      "Estas curvas históricas permiten ver caídas o repuntes, y ayudan a detectar dónde concentrar esfuerzos de recuperación educativa.",
    ].join("\n"),
    515
  );
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(nivelesLines, marginX, y);
  y += nivelesLines.length * 14 + 20;

  doc.setDrawColor(200);
  doc.line(marginX, y, marginX + 515, y);
  y += 24;

  if (y > 600) {
    doc.addPage();
    y = 60;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Fuentes y uso de la información", marginX, y);
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const footerLines = doc.splitTextToSize(
    [
      "Los datos provienen de registros administrativos del sistema educacional chileno (serie 2018–" +
        (ultimoAnio || "—") +
        ").",
      "Este documento puede compartirse libremente con cita de la fuente y del período de los datos.",
      "La interpretación busca traducir cifras técnicas a un lenguaje cotidiano sobre acceso, cobertura y justicia educativa.",
    ].join("\n"),
    515
  );
  doc.text(footerLines, marginX, y);

  return doc;
}
