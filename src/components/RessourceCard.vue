<template>
  <article class="resource-card" @click="ouvrirRessource">

    <!-- TOP : type + difficulté -->
    <div class="card-top">
      <span class="type-badge" :class="'type-' + ressource.typeSupport?.toLowerCase()">
        {{ iconeType(ressource.typeSupport) }} {{ ressource.typeSupport }}
      </span>
      <span v-if="ressource.difficulte" class="diff-badge" :class="diffClass(ressource.difficulte)">
        {{ labelDiff(ressource.difficulte) }}
      </span>
    </div>

    <!-- TITRE -->
    <h3 class="card-title">{{ ressource.titre }}</h3>

    <!-- DESCRIPTION -->
    <p class="card-description">
      {{ ressource.description?.slice(0, 120) }}{{ ressource.description?.length > 120 ? '…' : '' }}
    </p>

    <!-- MÉTA : niveau + thématique -->
    <div class="card-meta-row">
      <span v-if="ressource.niveauNom" class="meta-chip meta-niveau">🎓 {{ ressource.niveauNom }}</span>
      <span v-if="ressource.thematiqueNom" class="meta-chip meta-theme">📂 {{ ressource.thematiqueNom }}</span>
    </div>

    <!-- TAGS -->
    <div v-if="ressource.tags?.length" class="card-tags">
      <span v-for="tag in ressource.tags.slice(0, maxTags)" :key="tag" class="tag">#{{ tag }}</span>
      <span v-if="ressource.tags.length > maxTags" class="tag tag-more">+{{ ressource.tags.length - maxTags }}</span>
    </div>

    <!-- FOOTER : durée + lien -->
    <div class="card-footer">
      <span class="card-duree">
        <span class="duree-icon">⏱</span>
        {{ ressource.dureeMinutes ? ressource.dureeMinutes + ' min' : '—' }}
      </span>
      <a
        v-if="ressource.urlAcces && !ressource.urlAcces.startsWith('[')"
        :href="ressource.urlAcces"
        target="_blank"
        rel="noopener"
        class="card-link"
        @click.stop
      >
        {{ actionLabel }} →
      </a>
      <span v-else class="card-link card-link-off">Non disponible</span>
    </div>

  </article>
</template>

<script setup>
import { computed } from 'vue'
import { diffClass, labelDiff } from '@/utils/ressource-ui'

const props = defineProps({
  ressource: { type: Object, required: true },
  actionLabel: { type: String, default: 'Consulter' },
  maxTags: { type: Number, default: 3 }
})

const emit = defineEmits(['click'])

const iconeType = (t) =>
  ({ VIDEO: '🎥', H5P: '🎮', PDF: '📄', QUIZ: '❓', HTML: '🌐', LIEN: '🔗', AUTRE: '📦' }[t] || '📦')

const ouvrirRessource = () => emit('click', props.ressource)
</script>

<style scoped>
.resource-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.97);
  cursor: pointer;
  transition: all 0.22s;
  position: relative;
  overflow: hidden;
}

.resource-card::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  border-radius: 3px 0 0 3px;
  background: #6366f1;
  opacity: 0;
  transition: opacity 0.22s;
}

.resource-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(99, 102, 241, 0.12);
  border-color: rgba(99, 102, 241, 0.25);
}

.resource-card:hover::before { opacity: 1; }

/* TYPE + DIFF */
.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.type-badge {
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 800;
  color: white;
  letter-spacing: 0.3px;
}
.type-video { background: #e74c3c; }
.type-h5p   { background: #9b59b6; }
.type-pdf   { background: #e67e22; }
.type-quiz  { background: #3498db; }
.type-html  { background: #27ae60; }
.type-lien  { background: #1abc9c; }
.type-autre { background: #7f8c8d; }

.diff-badge {
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 0.66rem;
  font-weight: 700;
}
.diff-green  { background: #dcfce7; color: #15803d; }
.diff-orange { background: #fef3c7; color: #b45309; }
.diff-red    { background: #fee2e2; color: #b91c1c; }

/* TITRE */
.card-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 800;
  line-height: 1.35;
  color: #1e293b;
}

/* DESCRIPTION */
.card-description {
  margin: 0;
  color: #64748b;
  font-size: 0.8rem;
  line-height: 1.6;
  flex: 1;
}

/* MÉTA chips */
.card-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.meta-chip {
  padding: 3px 9px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
}
.meta-niveau { background: #eff6ff; color: #1d4ed8; }
.meta-theme  { background: #f5f3ff; color: #6d28d9; }

/* TAGS */
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.tag {
  padding: 2px 8px;
  border-radius: 6px;
  background: #f1f5f9;
  color: #475569;
  font-size: 0.67rem;
  font-weight: 500;
}
.tag-more { background: #e2e8f0; color: #64748b; }

/* FOOTER */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid #eef2f7;
  margin-top: auto;
}

.card-duree {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #94a3b8;
  font-size: 0.75rem;
}
.duree-icon { font-size: 0.8rem; }

.card-link {
  color: #6366f1;
  font-size: 0.75rem;
  font-weight: 800;
  text-decoration: none;
  transition: opacity 0.15s;
}
.card-link:hover { opacity: 0.75; }
.card-link-off { color: #cbd5e1; cursor: not-allowed; }
</style>