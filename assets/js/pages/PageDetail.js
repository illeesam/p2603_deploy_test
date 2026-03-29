window.DangoeulPages = window.DangoeulPages || {};
window.DangoeulPages.PageDetail = {
  name: 'PageDetail',
  props: ['navigate', 'products', 'selectedProduct', 'selectProduct', 'openDemo'],
  template: `
  <div class="page-wrap">
    <button @click="navigate('products')" style="display:flex;align-items:center;gap:6px;background:none;border:none;cursor:pointer;color:var(--text-muted);font-size:0.825rem;margin-bottom:24px;padding:0;transition:color 0.2s;" onmouseover="this.style.color='var(--blue)'" onmouseout="this.style.color='var(--text-muted)'">
      ← 상품 목록으로
    </button>
    <template v-if="selectedProduct">
      <div style="display:grid;grid-template-columns:1fr 300px;gap:28px;align-items:start;" class="detail-grid">
        <div>
          <div v-if="selectedProduct.image" class="product-detail-hero">
            <img :src="selectedProduct.image" :alt="selectedProduct.name" loading="eager"
              :style="{ objectPosition: selectedProduct.imagePos || 'center center' }" />
          </div>
          <div class="card" style="padding:28px;margin-bottom:20px;">
            <div style="display:flex;align-items:flex-start;gap:16px;margin-bottom:16px;flex-wrap:wrap;">
              <span style="font-size:3rem;line-height:1;">{{ selectedProduct.emoji }}</span>
              <div style="flex:1;min-width:200px;">
                <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:8px;">
                  <h1 style="font-size:1.5rem;font-weight:800;color:var(--text-primary);">{{ selectedProduct.name }}</h1>
                  <span class="badge badge-cat">{{ selectedProduct.category }}</span>
                  <span v-if="selectedProduct.isSet" class="badge badge-set">구성 세트</span>
                </div>
                <p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.7;margin-bottom:16px;">{{ selectedProduct.desc }}</p>
                <div style="font-size:1.2rem;font-weight:800;color:var(--blue);margin-bottom:20px;">{{ selectedProduct.price }}</div>
                <div style="display:flex;gap:10px;flex-wrap:wrap;">
                  <button class="btn-blue" @click="openDemo(selectedProduct)">🛒 샘플 주문·구성 보기</button>
                  <button class="btn-outline" @click="navigate('contact')">도매·단체 문의</button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedProduct.isSet && selectedProduct.setItems && selectedProduct.setItems.length" class="card" style="padding:28px;margin-bottom:20px;">
            <h2 style="font-size:1rem;font-weight:700;margin-bottom:14px;color:var(--text-primary);">📦 세트 구성</h2>
            <ul class="set-items-list">
              <li v-for="(line, i) in selectedProduct.setItems" :key="i">{{ line }}</li>
            </ul>
          </div>

          <div class="card" style="padding:28px;margin-bottom:20px;">
            <h2 style="font-size:1rem;font-weight:700;margin-bottom:18px;color:var(--text-primary);">📋 상품 정보</h2>
            <div class="info-row">
              <span class="info-icon">📍</span>
              <div><div class="info-label">출고지</div><div class="info-val">충북 진천 — 온실·포트 상태 검수 후 발송</div></div>
            </div>
            <div class="info-row">
              <span class="info-icon">🧊</span>
              <div><div class="info-label">보관</div><div class="info-val">받은 직후 통풍·햇빛 양호한 곳에서 이식 권장</div></div>
            </div>
            <div class="info-row">
              <span class="info-icon">🚚</span>
              <div><div class="info-label">배송</div><div class="info-val">새벽·일반 배송 (지역별 상이) · 모종 파손 시 사진 접수</div></div>
            </div>
            <div class="info-row">
              <span class="info-icon">📞</span>
              <div><div class="info-label">문의</div><div class="info-val">평일 09:00–18:00 (품절·대체 품종 안내)</div></div>
            </div>
            <div class="info-row">
              <span class="info-icon">♻️</span>
              <div><div class="info-label">포장</div><div class="info-val">포트 고정·종이 완충재 사용</div></div>
            </div>
          </div>
        </div>
        <div>
          <div style="font-size:0.875rem;font-weight:700;color:var(--text-secondary);margin-bottom:14px;text-transform:uppercase;letter-spacing:0.06em;">관련 상품</div>
          <div style="display:flex;flex-direction:column;gap:10px;">
            <div v-for="p in products.filter(x=>x.id!==selectedProduct.id).slice(0,4)" :key="p.id"
              class="card" style="padding:14px;cursor:pointer;" @click="selectProduct(p)">
              <div style="display:flex;align-items:center;gap:12px;">
                <img v-if="p.image" class="product-related-thumb" :src="p.image" :alt="p.name" loading="lazy"
                  :style="{ objectPosition: p.imagePos || 'center center' }" />
                <span v-else style="font-size:1.5rem;">{{ p.emoji }}</span>
                <div style="flex:1;min-width:0;">
                  <div style="font-size:0.85rem;font-weight:700;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ p.name }}</div>
                  <div style="font-size:0.75rem;color:var(--blue);font-weight:600;">{{ p.price }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
  `,
};
