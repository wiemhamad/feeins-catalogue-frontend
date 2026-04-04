<template>
  <article class="resource-card">
    <div class="card-top">
      <span class="difficulty-badge" :class="diffClass(ressource.difficulte)">
        {{ labelDiff(ressource.difficulte) }}
      </span>
    </div>

    <h3 class="card-title">{{ ressource.titre }}</h3>
    <p class="card-description">{{ ressource.description }}</p>

    <div v-if="(ressource.tags || []).length" class="card-tags">
      <span v-for="tag in (ressource.tags || []).slice(0, maxTags)" :key="tag" class="tag">
        {{ tag }}
      </span>
    </div>

    <div class="card-footer">
      <span class="card-meta">{{ metaLabel }}</span>
      <a
        v-if="ressource.urlAcces && !ressource.urlAcces.startsWith('[Fichier')"
        :href="ressource.urlAcces"
        target="_blank"
        rel="noopener noreferrer"
        class="card-link card-link-active"
      >{{ actionLabel }} →</a>
      <span v-else class="card-link card-link-disabled" title="URL non disponible">
        {{ actionLabel }} →
      </span>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { diffClass, labelDiff } from '@/utils/ressource-ui'

const props = defineProps({
  ressource: {
    type: Object,
    required: true
  },
  actionLabel: {
    type: String,
    default: 'Voir la ressource'
  },
  maxTags: {
    type: Number,
    default: 3
  }
})

const metaLabel = computed(() => {
  if (props.ressource.typeSupport === 'QUIZ') {
    return `${props.ressource.dureeMinutes || 10} questions`
  }

  return `${props.ressource.dureeMinutes || 15} min`
})
</script>

<style scoped>
.resource-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 220px;
  padding: 16px;
  border: 1px solid rgba(226, 232, 240, 0.92);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.96);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.difficulty-badge {
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 0.62rem;
  font-weight: 700;
}

.diff-green {
  background: #dcfce7;
  color: #15803d;
}

.diff-orange {
  background: #fef3c7;
  color: #b45309;
}

.diff-red {
  background: #fee2e2;
  color: #b91c1c;
}

.card-title {
  margin: 0;
  font-size: 0.96rem;
  font-weight: 800;
  line-height: 1.35;
  color: #1e293b;
}

.card-description {
  margin: 0;
  color: #64748b;
  font-size: 0.82rem;
  line-height: 1.55;
  flex: 1;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 3px 7px;
  border-radius: 999px;
  background: #f1f5f9;
  color: #64748b;
  font-size: 0.68rem;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid #eef2f7;
}

.card-meta {
  color: #94a3b8;
  font-size: 0.76rem;
}

.card-link {
  font-size: 0.76rem;
  font-weight: 700;
  text-decoration: none;
}

.card-link-active {
  color: #14b8a6;
  cursor: pointer;
  transition: color 0.15s;
}

.card-link-active:hover {
  color: #0d9488;
  text-decoration: underline;
}

.card-link-disabled {
  color: #cbd5e1;
  cursor: not-allowed;
}
</style>