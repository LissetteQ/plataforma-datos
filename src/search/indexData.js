// src/search/indexData.js
const indexData = [
  // ========== TRABAJO ==========
  {
    title: "Desempleo y brecha de género",
    description:
      "Tasas de desocupación comparando mujeres y hombres. Períodos 2023T2–2024T2.",
    keywords:
      "desempleo mujeres desempleo femenino trabajo brecha de género tasa desocupación TD TO TPL ocupación laboral inclusión laboral mujer",
    section: "Trabajo",
    chip: "Género",
    path: "/trabajo",
    anchorId: "#card-desempleo-mujeres",
  },
  {
    title: "Ingreso medio anual — ESI (2018–2024)",
    description:
      "Ingresos laborales promedio por sexo a partir de la Encuesta Suplementaria de Ingresos.",
    keywords:
      "ingreso medio anual sueldo salario ingreso mujeres hombres esi ingresos laborales brecha salarial",
    section: "Trabajo",
    chip: "Ingresos",
    path: "/trabajo",
    anchorId: "#card-ingresos-esi",
  },
  {
    title: "Pirámide de edades ocupadas",
    description:
      "Distribución por edad y sexo de las personas ocupadas. Envejecimiento de la fuerza de trabajo.",
    keywords:
      "pirámide poblacional edad ocupados estructura etaria mercado laboral rango etario fuerza laboral jóvenes adultos mayores",
    section: "Trabajo",
    chip: "Estructura",
    path: "/trabajo",
    anchorId: "#card-piramide-edad",
  },
  {
    title: "Cotizaciones previsionales",
    description:
      "Porcentaje de trabajadores/as que cotiza en seguridad social.",
    keywords:
      "cotizaciones previsionales formalidad seguridad social cotiza pensiones protección social previsión social",
    section: "Trabajo",
    chip: "Formalidad",
    path: "/trabajo",
    anchorId: "#card-cotizaciones",
  },
  {
    title: "Jornadas laborales",
    description:
      "Distribución de jornada completa / parcial en la ocupación.",
    keywords:
      "jornada parcial jornada completa horas trabajadas precariedad conciliación trabajo cuidados tiempo parcial",
    section: "Trabajo",
    chip: "Jornada",
    path: "/trabajo",
    anchorId: "#card-jornada",
  },
  {
    title: "Tasas laborales (TD, TO, TP...)",
    description:
      "Indicadores claves: Tasa de Desocupación, Ocupación, Participación, etc.",
    keywords:
      "tasa de desempleo tasa de ocupación tasa de participación tp td mercado laboral indicadores clave encuesta nacional empleo ene",
    section: "Trabajo",
    chip: "Indicadores",
    path: "/trabajo",
    anchorId: "#card-tasas",
  },

  // ========== SALUD ==========
  {
    title: "Cobertura por asegurador (Fonasa / Isapre)",
    description:
      "Distribución de beneficiarios por tipo de aseguramiento de salud.",
    keywords:
      "fonasa isapre seguro de salud cobertura sistema de salud afiliación cotizantes beneficiarios salud chile",
    section: "Salud",
    chip: "Cobertura",
    path: "/salud",
    anchorId: "#card-fonasa-isapre",
  },
  {
    title: "Distribución por sexo en el sistema de salud",
    description:
      "Participación de mujeres y hombres en la cobertura de salud.",
    keywords:
      "salud mujeres salud hombres brecha de acceso cobertura sexo género prestadores salud pública privada",
    section: "Salud",
    chip: "Género",
    path: "/salud",
    anchorId: "#card-salud-sexo",
  },
  {
    title: "Afiliados por tramo de edad",
    description:
      "Pirámide o bloques de edad de personas cubiertas por el sistema.",
    keywords:
      "edad afiliados tramo etario salud adultos mayores jóvenes niños cobertura etaria fonasa por edad",
    section: "Salud",
    chip: "Edad",
    path: "/salud",
    anchorId: "#card-salud-edad",
  },
  {
    title: "Cobertura por región",
    description:
      "Distribución geográfica de la población beneficiaria del sistema de salud.",
    keywords:
      "salud región territorial acceso salud regional brecha territorial descentralización mapa cobertura salud regiones",
    section: "Salud",
    chip: "Territorio",
    path: "/salud",
    anchorId: "#card-salud-region",
  },

  // ========== EDUCACIÓN ==========
  {
    title: "Acceso a educación parvularia",
    description:
      "Cobertura de educación inicial (0-5 años) y su evolución en el tiempo.",
    keywords:
      "educación parvularia sala cuna prekinder kinder primera infancia cobertura inicial acceso temprana parvularia mujeres cuidadoras",
    section: "Educación",
    chip: "Parvularia",
    path: "/educacion",
    anchorId: "#card-parvularia",
  },
  {
    title: "Escolaridad básica y asistencia",
    description:
      "Asistencia en enseñanza básica por sexo/edad.",
    keywords:
      "básica niños asistencia escolar abandono escolar deserción cobertura básica matrícula educación obligatoria",
    section: "Educación",
    chip: "Básica",
    path: "/educacion",
    anchorId: "#card-basica",
  },
  {
    title: "Enseñanza media y jóvenes que estudian",
    description:
      "Participación de jóvenes en enseñanza media.",
    keywords:
      "enseñanza media media jóvenes estudio continuidad educativa matrícula media brecha género liceo educación media",
    section: "Educación",
    chip: "Media",
    path: "/educacion",
    anchorId: "#card-media-jovenes",
  },
  {
    title: "Endeudamiento educativo",
    description:
      "Carga financiera asociada a estudiar: deuda, presión sobre hogares.",
    keywords:
      "endeudamiento educativo deuda estudiar cae dicom morosidad crédito universitario financiamiento educación superior deuda educación",
    section: "Educación",
    chip: "Financiamiento",
    path: "/educacion",
    anchorId: "#card-endeudamiento",
  },

  // ========== MACROECONOMÍA ==========
  {
    title: "PIB",
    description:
      "Producto Interno Bruto: nivel y variación en el tiempo.",
    keywords:
      "pib producto interno bruto crecimiento económico actividad económica cuentas nacionales",
    section: "Macroeconomía",
    chip: "PIB",
    path: "/macroeconomia",
    anchorId: "#card-pib",
  },
  {
    title: "IMACEC",
    description:
      "Indicador Mensual de Actividad Económica, pulso mensual de la economía.",
    keywords:
      "imacec actividad económica crecimiento mensual dinamismo recesión desaceleración economía chilena banco central",
    section: "Macroeconomía",
    chip: "IMACEC",
    path: "/macroeconomia",
    anchorId: "#card-imacec",
  },
  {
    title: "Tasa de Política Monetaria (TPM)",
    description:
      "Tasa de interés de referencia fijada por el Banco Central.",
    keywords:
      "tpm tasa política monetaria tasa de interés banco central inflación costo crédito política monetaria",
    section: "Macroeconomía",
    chip: "Tasas de interés",
    path: "/macroeconomia",
    anchorId: "#card-tpm",
  },
  {
    title: "Tipo de cambio / Paridades",
    description:
      "Series de dólar u otras monedas relevantes.",
    keywords:
      "tipo de cambio dólar paridades usd clp divisa moneda banco central paridad cambio",
    section: "Macroeconomía",
    chip: "Tipo de cambio",
    path: "/macroeconomia",
    anchorId: "#card-paridades",
  },
  {
    title: "UF y UTM (Reajustabilidad)",
    description:
      "Indicadores como UF y UTM que reajustan contratos, arriendos, créditos.",
    keywords:
      "uf utm reajustabilidad inflación actualización contratos arriendo crédito vivienda costo de vida",
    section: "Macroeconomía",
    chip: "Reajustabilidad",
    path: "/macroeconomia",
    anchorId: "#card-uf-utm",
  },
];

export default indexData;