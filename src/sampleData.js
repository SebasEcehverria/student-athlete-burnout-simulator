const notes = [
  "Exam prep and evening practice",
  "Lift, classes, and work shift",
  "Recovery day with better sleep",
  "Hard training and low sleep",
  "Travel/competition day",
  "Long lab, film review, and practice",
  "Light class day with team support",
  "Quiz prep and conditioning",
  "Work shift after training",
  "Better sleep and lighter practice"
];

const patterns = [
  { academic: 8, training: 7, work: 3, sleep: 5, support: 5 },
  { academic: 6, training: 9, work: 2, sleep: 6, support: 5 },
  { academic: 5, training: 5, work: 2, sleep: 8, support: 7 },
  { academic: 7, training: 8, work: 5, sleep: 4, support: 4 },
  { academic: 4, training: 9, work: 1, sleep: 5, support: 6 },
  { academic: 9, training: 6, work: 4, sleep: 5, support: 5 },
  { academic: 5, training: 4, work: 3, sleep: 8, support: 8 },
  { academic: 8, training: 6, work: 2, sleep: 6, support: 6 },
  { academic: 6, training: 8, work: 6, sleep: 5, support: 4 },
  { academic: 4, training: 5, work: 2, sleep: 7, support: 7 }
];

export function createSampleWeek() {
  return createEntries(7);
}

export function createSampleMonth() {
  return createEntries(30);
}

function createEntries(count) {
  const start = new Date();
  start.setDate(start.getDate() - count + 1);

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const pattern = patterns[index % patterns.length];
    const weekend = date.getDay() === 0 || date.getDay() === 6;
    const academicBump = index % 11 === 4 ? 1 : 0;
    const trainingBump = index % 9 === 2 ? 1 : 0;

    return {
      id: crypto.randomUUID ? crypto.randomUUID() : `sample-${Date.now()}-${index}`,
      date: date.toISOString().slice(0, 10),
      academic: clampInput(pattern.academic + academicBump - (weekend ? 1 : 0)),
      training: clampInput(pattern.training + trainingBump),
      work: clampInput(pattern.work + (index % 13 === 7 ? 1 : 0)),
      sleep: clampInput(pattern.sleep - (index % 8 === 3 ? 1 : 0) + (weekend ? 1 : 0)),
      support: clampInput(pattern.support + (index % 6 === 0 ? 1 : 0)),
      note: notes[index % notes.length]
    };
  });
}

function clampInput(value) {
  return Math.min(10, Math.max(0, value));
}
