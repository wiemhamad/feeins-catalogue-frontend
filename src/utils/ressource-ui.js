export const diffClass = (difficulte) => ({
  DEBUTANT: 'diff-green',
  INTERMEDIAIRE: 'diff-orange',
  AVANCE: 'diff-red'
}[difficulte] || 'diff-green')

export const labelDiff = (difficulte) => ({
  DEBUTANT: 'Debutant',
  INTERMEDIAIRE: 'Intermediaire',
  AVANCE: 'Avance'
}[difficulte] || 'Debutant')
