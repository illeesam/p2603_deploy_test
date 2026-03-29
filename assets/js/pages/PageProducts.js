window.DangoeulPages = window.DangoeulPages || {};
window.DangoeulPages.PageProducts = {
  name: 'PageProducts',
  props: ['productCats', 'activeProductCat', 'setProductCat', 'filteredProducts', 'selectProduct', 'openDemo', 'config'],
  template: `
  <div>
    <div v-if="config && config.facility && config.facility.productsBanner" class="products-facility-banner">
      <img :src="config.facility.productsBanner" alt="단고을 모종 육묘 시설" loading="lazy" />
      <div class="products-facility-banner__overlay">
        <span class="products-facility-banner__badge">현장</span>
        <p class="products-facility-banner__text">충북 진천 육묘 하우스에서 검수·출고되는 모종입니다.</p>
      </div>
    </div>
    <div class="page-wrap">
    <div style="margin-bottom:28px;">
      <div style="display:inline-block;padding:4px 14px;border-radius:20px;background:var(--purple-dim);color:var(--purple);font-size:0.75rem;font-weight:700;margin-bottom:14px;">모종·세트</div>
      <h1 class="section-title" style="font-size:2rem;margin-bottom:10px;"><span class="gradient-text">모종</span> 상품 목록</h1>
      <p class="section-subtitle">채소 모종 단품과 샐러드·텃밭·김장용 세트를 골라보세요.</p>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px;">
      <button v-for="cat in productCats" :key="cat" class="cat-btn"
        :class="{active: activeProductCat===cat}"
        @click="setProductCat(cat)">{{ cat }}</button>
    </div>
    <div class="grid-3">
      <div v-for="p in filteredProducts" :key="p.id" class="product-card">
        <div v-if="p.image" class="product-card-cover">
          <img :src="p.image" :alt="p.name" loading="lazy"
            :style="{ objectPosition: p.imagePos || 'center center' }" />
        </div>
        <div v-else class="product-card-body" style="padding-top:22px;">
          <span style="font-size:2.5rem;">{{ p.emoji }}</span>
        </div>
        <div class="product-card-body">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px;flex-wrap:wrap;">
            <span v-if="!p.image" style="font-size:1.5rem;line-height:1;">{{ p.emoji }}</span>
            <div style="display:flex;flex-wrap:wrap;gap:6px;margin-left:auto;">
              <span class="badge badge-cat">{{ p.category }}</span>
              <span v-if="p.isSet" class="badge badge-set">구성 세트</span>
            </div>
          </div>
          <div style="font-size:1rem;font-weight:700;color:var(--text-primary);margin-bottom:6px;">{{ p.name }}</div>
          <p style="font-size:0.825rem;color:var(--text-secondary);line-height:1.6;margin-bottom:14px;">{{ p.desc }}</p>
          <div style="font-size:0.9rem;font-weight:700;color:var(--blue);margin-bottom:8px;">{{ p.price }}</div>
        </div>
        <div class="product-card-actions">
          <button class="btn-blue btn-sm" style="flex:1;" @click="openDemo(p)">구성 보기</button>
          <button class="btn-outline btn-sm" style="flex:1;" @click="selectProduct(p)">상세보기</button>
        </div>
      </div>
    </div>
    <div v-if="filteredProducts.length===0" style="text-align:center;padding:60px 0;color:var(--text-muted);">
      해당 카테고리의 상품이 없습니다.
    </div>
    </div>
  </div>
  `,
};
