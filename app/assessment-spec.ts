type AssessmentProfile = {
  id: string;
  label: string;
  rows: readonly {
    label: string;
    weight: number;
    marksEach: number;
    purpose: string;
  }[];
};

export function buildAssessmentSpec(
  profile: AssessmentProfile,
  totalItems: number,
) {
  const rawCounts = profile.rows.map((row) => row.weight * totalItems);
  const counts = rawCounts.map((value) => Math.floor(value));
  const remaining = totalItems - counts.reduce((total, count) => total + count, 0);
  const allocationOrder = rawCounts
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index);

  for (let index = 0; index < remaining; index += 1) {
    counts[allocationOrder[index % allocationOrder.length].index] += 1;
  }

  for (let rowIndex = 0; rowIndex < profile.rows.length; rowIndex += 1) {
    if (profile.rows[rowIndex].weight <= 0 || counts[rowIndex] > 0) continue;

    const donor = counts
      .map((count, index) => ({
        index,
        count,
        surplus: count - rawCounts[index],
      }))
      .filter((candidate) => candidate.count > 1)
      .sort((a, b) => b.surplus - a.surplus || b.count - a.count || a.index - b.index)[0];

    if (donor) {
      counts[donor.index] -= 1;
      counts[rowIndex] = 1;
    }
  }

  const rows = profile.rows
    .map((row, index) => ({
      label: row.label,
      count: counts[index],
      marksEach: row.marksEach,
      totalMarks: counts[index] * row.marksEach,
      purpose: row.purpose,
    }))
    .filter((row) => row.count > 0);
  const totalMarks = rows.reduce((total, row) => total + row.totalMarks, 0);
  const reasoningMarks = rows
    .filter((row) => row.label !== "Single-select MCQ")
    .reduce((total, row) => total + row.totalMarks, 0);

  return {
    profileId: profile.id,
    profileLabel: profile.label,
    totalItems,
    totalMarks,
    reasoningMarkShare: Math.round((reasoningMarks / Math.max(totalMarks, 1)) * 100),
    rows,
  };
}
