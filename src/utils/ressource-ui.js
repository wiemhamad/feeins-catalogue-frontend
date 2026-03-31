export const iconeType = (type) => {
  const map = {
    VIDEO: '🎥',
    H5P: '🧩',
    PDF: '📄',
    QUIZ: '❓',
    HTML: '🌐',
    LIEN: '🔗'
  }

  return map[type] || '📚'
}

export const iconBg = (type) => {
  const map = {
    VIDEO: 'linear-gradient(135deg, #0284c7, #38bdf8)',
    H5P: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    PDF: 'linear-gradient(135deg, #dc2626, #fb7185)',
    QUIZ: 'linear-gradient(135deg, #059669, #34d399)',
    HTML: 'linear-gradient(135deg, #ea580c, #fb923c)',
    LIEN: 'linear-gradient(135deg, #0f766e, #2dd4bf)'
  }

  return map[type] || 'linear-gradient(135deg, #475569, #94a3b8)'
}

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
