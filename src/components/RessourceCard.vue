<template>
  <article class="resource-card" @click="ouvrirRessource">

    <!-- TOP : type + difficulté -->
    <div class="card-top">
      <span class="type-badge" :class="'type-' + ressource.typeSupport?.toLowerCase()">
        <span class="type-icon-shape" :class="'shape-' + ressource.typeSupport?.toLowerCase()"></span>
        {{ ressource.typeSupport }}
      </span>
      <span v-if="ressource.difficulte" class="diff-badge" :class="diffClass(ressource.difficulte)">
        <span class="diff-dots">
          <span class="diff-dot" :class="{ active: true }"></span>
          <span class="diff-dot" :class="{ active: ['INTERMEDIAIRE','AVANCE'].includes(ressource.difficulte) }"></span>
          <span class="diff-dot" :class="{ active: ressource.difficulte === 'AVANCE' }"></span>
        </span>
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
      <span v-if="ressource.niveauNom" class="meta-chip meta-niveau">
        <svg class="chip-icon" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="5" cy="3.2" r="1.8" stroke="currentColor" stroke-width="1.2"/>
          <path d="M1 9.2c0-2 1.8-3.2 4-3.2s4 1.2 4 3.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
        {{ ressource.niveauNom }}
      </span>
      <span v-if="ressource.thematiqueNom" class="meta-chip meta-theme">
        <svg class="chip-icon" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 2.5C1 1.7 1.7 1 2.5 1H4l1 1.5H9C9 2.5 9 3 9 3v5.5C9 9.3 8.3 9 7.5 9h-5C1.7 9 1 8.3 1 7.5V2.5Z" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/>
        </svg>
        {{ ressource.thematiqueNom }}
      </span>
    </div>

    <!-- TAGS -->
    <div v-if="ressource.tags?.length" class="card-tags">
      <span v-for="tag in ressource.tags.slice(0, maxTags)" :key="tag" class="tag">{{ tag }}</span>
      <span v-if="ressource.tags.length > maxTags" class="tag tag-more">+{{ ressource.tags.length - maxTags }}</span>
    </div>

    <!-- FOOTER : durée + lien -->
    <div class="card-footer">
      <span class="card-duree">
        <span class="duree-bars">
          <span></span><span></span><span></span>
        </span>
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
        {{ actionLabel }}
        <svg class="link-arrow" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
      <span v-else class="card-link card-link-off">Non disponible</span>
    </div>

  </article>
</template>

<script setup>
import { diffClass, labelDiff } from '@/utils/ressource-ui'

const props = defineProps({
  ressource: { type: Object, required: true },
  actionLabel: { type: String, default: 'Consulter' },
  maxTags: { type: Number, default: 3 }
})

const emit = defineEmits(['click'])

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
  display: flex;
  align-items: center;
  gap: 5px;
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

/* Petite icône de forme selon le type */
.type-icon-shape {
  display: inline-block;
  width: 7px;
  height: 7px;
  flex-shrink: 0;
  opacity: 0.85;
}
.shape-video {
  clip-path: polygon(0 0, 100% 50%, 0 100%);
  background: white;
}
.shape-pdf {
  border: 1.5px solid white;
  border-radius: 1px;
}
.shape-quiz {
  width: 7px;
  height: 7px;
  border: 1.5px solid white;
  border-radius: 50%;
}
.shape-h5p {
  background: white;
  border-radius: 1px;
  transform: rotate(45deg);
}
.shape-html {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 7px solid white;
  background: transparent;
}
.shape-lien {
  width: 8px;
  height: 2px;
  background: white;
  border-radius: 1px;
  position: relative;
}
.shape-autre {
  background: white;
  border-radius: 1px;
}

/* Difficulté */
.diff-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 0.66rem;
  font-weight: 700;
}
.diff-green  { background: #dcfce7; color: #15803d; }
.diff-orange { background: #fef3c7; color: #b45309; }
.diff-red    { background: #fee2e2; color: #b91c1c; }

.diff-dots {
  display: flex;
  gap: 2px;
  align-items: center;
}
.diff-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.2;
}
.diff-dot.active {
  opacity: 1;
}

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
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
}
.chip-icon {
  width: 10px;
  height: 10px;
  flex-shrink: 0;
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
.tag::before {
  content: '#';
  opacity: 0.45;
  margin-right: 1px;
}
.tag-more {
  background: #e2e8f0;
  color: #64748b;
}
.tag-more::before { content: ''; }

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
  gap: 6px;
  color: #94a3b8;
  font-size: 0.75rem;
}

.duree-bars {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 10px;
}
.duree-bars span {
  display: block;
  width: 3px;
  background: #cbd5e1;
  border-radius: 1px;
}
.duree-bars span:nth-child(1) { height: 5px; }
.duree-bars span:nth-child(2) { height: 9px; }
.duree-bars span:nth-child(3) { height: 7px; }

.card-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6366f1;
  font-size: 0.75rem;
  font-weight: 800;
  text-decoration: none;
  transition: opacity 0.15s;
}
.card-link:hover { opacity: 0.75; }
.card-link-off { color: #cbd5e1; cursor: not-allowed; }

.link-arrow {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}
</style>