// Script executed by MongoDB container on first startup.
// Inserts sample credentials, courses, mallas and avances for local testing.

var dbName = 'university_curriculum';
var mydb = db.getSiblingDB(dbName);

// credentials
mydb.credentials.insertMany([
  {
    email: 'maria@example.com',
    password: 'abcd',
    rut: '222222222',
    carreras: [
      { codigo: '8266', nombre: 'ITI', catalogo: '202410' },
    ],
  },
  {
    email: 'ximena@example.com',
    password: 'qwerty',
    rut: '333333333',
    carreras: [
      { codigo: '86161', nombre: 'EXAMPLE', catalogo: '202320' },
    ],
  },
    {
    email: 'pedro@example.com',
    password: '1234',
    rut: '111111111',
    carreras: [
      { codigo: '8606', nombre: 'ICCI', catalogo: '202320' },
    ],
  },
]);

// Courses sample
var courses = [
  { codigo: 'DCCB-00107', nombre: 'Álgebra I', creditos: 6, nivel: 1, prerequisitos: ['DDOC-00102', 'SSED-00102'] },
  { codigo: 'DCCB-00106', nombre: 'Cálculo I', creditos: 6, nivel: 1, prerequisitos: ['DAMA-00235'] },
  { codigo: 'ECIN-00704', nombre: 'Algoritmos I', creditos: 6, nivel: 2, prerequisitos: [] },
  { codigo: 'ECIN-00600', nombre: 'Introducción a la Programación', creditos: 6, nivel: 1, prerequisitos: [] },
];
mydb.courses.insertMany(courses);

// Mallas (store cursos as codes)
mydb.mallas.insertMany([
  {
    carreraKey: '8606-202320',
    catalogo: '202320',
    cursos: ['DCCB-00107', 'DCCB-00106'],
  },
  {
    carreraKey: '86161-202320',
    catalogo: '202320',
    cursos: ['ECIN-00704', 'ECIN-00600'],
  },
]);

// Avance records
mydb.avances.insertMany([
  {
    nrc: '21943',
    period: '202320',
    student: '333333333',
    course: 'ECIN-00704',
    excluded: false,
    inscriptionType: 'REGULAR',
    status: 'APROBADO',
    codcarrera: '86161',
  },
  {
    nrc: '21944',
    period: '202320',
    student: '333333333',
    course: 'ECIN-00600',
    excluded: false,
    inscriptionType: 'REGULAR',
    status: 'REPROBADO',
    codcarrera: '86161',
  },
]);

print('Mongo init: seed data inserted');
