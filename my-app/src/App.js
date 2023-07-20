import React from "react";
import { faker } from "@faker-js/faker";
import { Parser } from "@json2csv/plainjs";

const ageCertifications = [
  "G",
  "PG",
  "PG-13",
  "R",
  "NC-17",
  "U",
  "U/A",
  "A",
  "S",
  "AL",
  "6",
  "9",
  "12",
  "12A",
  "15",
  "18",
  "18R",
  "R18",
  "R21",
  "M",
  "MA15+",
  "R16",
  "R18+",
  "X18",
  "T",
  "E",
  "E10+",
  "EC",
  "C",
  "CA",
  "GP",
  "M/PG",
  "TV-Y",
  "TV-Y7",
  "TV-G",
  "TV-PG",
  "TV-14",
  "TV-MA",
];

const roles = [
  "Director",
  "Producer",
  "Screenwriter",
  "Actor",
  "Actress",
  "Cinematographer",
  "Film Editor",
  "Production Designer",
  "Costume Designer",
  "Music Composer",
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function generatePositiveCase(i, roles) {
  return {
    title: faker.word.noun(),
    description: faker.lorem.paragraph(),
    release_year: faker.date.past().getFullYear(),
    runtime: faker.number.bigInt({ min: 30, max: 200 }),
    genres: [faker.music.genre(), faker.music.genre()],
    real_name: faker.person.fullName(),
    character_name: faker.person.fullName(),
    role: roles[getRandomInt(roles.length)],
  };
}

function generateNegativeCase(i, roles) {
  return {
    title: i === 30 ? "" : faker.word.noun(),
    description: i === 31 ? "" : faker.lorem.paragraph(),
    release_year:
      i === 32 ? new Date().getFullYear() + 1 : faker.date.past().getFullYear(),
    runtime: i === 33 ? "" : faker.number.bigInt({ min: 30, max: 200 }),
    genres: i === 34 ? [] : [faker.music.genre(), faker.music.genre()],
    real_name: i === 35 ? "" : faker.person.fullName(),
    character_name: i === 36 ? "" : faker.person.fullName(),
    role: i === 37 ? "" : roles[getRandomInt(roles.length)],
  };
}

function generateEdgeCase(i, roles) {
  return {
    title: faker.lorem.words(200), // Extremely long title
    description: faker.lorem.words(500), // Extremely long description
    release_year: new Date().getFullYear(), // Current year
    runtime: 200, // Maximum runtime
    genres: new Array(30).fill(0).map(() => faker.music.genre()), // Maximum number of genres
    real_name: faker.lorem.words(100), // Extremely long real name
    character_name: faker.lorem.words(100), // Extremely long character name
    role: roles[getRandomInt(roles.length)],
  };
}

function pushData(titles, credits, data, i) {
  titles.push({
    id: i,
    title: data.title,
    description: data.description,
    release_year: data.release_year,
    age_certification:
      ageCertifications[getRandomInt(ageCertifications.length)],
    runtime: data.runtime,
    genres: data.genres,
    production_country: faker.location.countryCode(),
    seasons: faker.datatype.boolean()
      ? faker.number.bigInt({ min: 1, max: 10 })
      : "",
  });

  credits.push({
    id: i,
    title_id: i,
    real_name: data.real_name,
    character_name: data.character_name,
    role: data.role,
  });
}

function convertToCsv(parser, data) {
  return parser.parse(data);
}

function createBlobFromCsv(csv) {
  return new Blob([csv], { type: "text/csv;charset=utf-8;" });
}

function downloadFile(blob, filename) {
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const DataGenerator = () => {
  const handleClick = () => {
    const titles = [];
    const credits = [];

    for (let i = 0; i < 100; i++) {
      let data;

      if (i < 30) {
        data = generatePositiveCase(i, roles);
      } else if (i >= 30 && i < 60) {
        data = generateNegativeCase(i, roles);
      } else {
        data = generateEdgeCase(i, roles);
      }

      pushData(titles, credits, data, i);
    }

    const titleCsv = convertToCsv(new Parser(), titles);
    const creditsCsv = convertToCsv(new Parser(), credits);

    const titleBlob = createBlobFromCsv(titleCsv);
    const creditsBlob = createBlobFromCsv(creditsCsv);

    downloadFile(titleBlob, "titles.csv");
    downloadFile(creditsBlob, "credits.csv");
  };

  return <button onClick={handleClick}>Generate Data</button>;
};

export default DataGenerator;
