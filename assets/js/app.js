/* ============================================
   DANGOEUL - Vue App (레이아웃 + 페이지 컴포넌트)
   ============================================ */
const { createApp, ref, computed, reactive } = Vue;

var P = window.DangoeulPages || {};
var C = window.DangoeulComponents || {};

createApp({
  components: {
    AppHeader: C.AppHeader,
    AppSidebar: C.AppSidebar,
    AppFooter: C.AppFooter,
    PageHome: P.PageHome,
    PageAbout: P.PageAbout,
    PageSolution: P.PageSolution,
    PageProducts: P.PageProducts,
    PageDetail: P.PageDetail,
    PageBlog: P.PageBlog,
    PageLocation: P.PageLocation,
    PageContact: P.PageContact,
    PageFaq: P.PageFaq,
  },
  setup() {
    const theme = ref(localStorage.getItem('dangoeul-theme') || 'light');
    const applyTheme = t => {
      theme.value = t;
      localStorage.setItem('dangoeul-theme', t);
      document.documentElement.setAttribute('data-theme', t);
    };
    applyTheme(theme.value);
    const toggleTheme = () => applyTheme(theme.value === 'light' ? 'dark' : 'light');

    const page = ref('home');
    const sidebarOpen = ref(true);
    const mobileOpen = ref(false);
    const navigate = id => {
      page.value = id;
      mobileOpen.value = false;
      window.scrollTo(0, 0);
    };
    window.addEventListener('resize', () => {
      if (window.innerWidth < 1024) mobileOpen.value = false;
    });
    const toggleMobile = () => { mobileOpen.value = !mobileOpen.value; };
    const toggleSidebar = () => { sidebarOpen.value = !sidebarOpen.value; };
    const closeMobile = () => { mobileOpen.value = false; };

    const toast = reactive({ show: false, msg: '', type: 'success' });
    let toastTimer = null;
    const showToast = (msg, type = 'success') => {
      if (toastTimer) clearTimeout(toastTimer);
      Object.assign(toast, { show: true, msg, type });
      toastTimer = setTimeout(() => { toast.show = false; }, 3000);
    };

    const alertState = reactive({ show: false, title: '', msg: '', type: 'info', resolve: null });
    const showAlert = (title, msg, type = 'info') =>
      new Promise(r => Object.assign(alertState, { show: true, title, msg, type, resolve: r }));
    const closeAlert = () => { alertState.show = false; alertState.resolve?.(); };

    const confirmState = reactive({ show: false, title: '', msg: '', type: 'warning', resolve: null });
    const showConfirm = (title, msg, type = 'warning') =>
      new Promise(r => Object.assign(confirmState, { show: true, title, msg, type, resolve: r }));
    const closeConfirm = r => { confirmState.show = false; confirmState.resolve?.(r); };

    const products = window.SITE_CONFIG.products;
    const selectedProduct = ref(products[0]);
    const selectProduct = p => { selectedProduct.value = p; navigate('detail'); };

    const activeProductCat = ref('전체');
    const productCats = ['전체', ...new Set(products.map(p => p.category))];
    const filteredProducts = computed(() =>
      activeProductCat.value === '전체'
        ? products
        : products.filter(p => p.category === activeProductCat.value)
    );
    const setProductCat = cat => { activeProductCat.value = cat; };

    const openFaq = ref(null);
    const toggleContactFaq = idx => {
      const key = 'c' + idx;
      openFaq.value = openFaq.value === key ? null : key;
    };
    const toggleMainFaq = idx => {
      openFaq.value = openFaq.value === idx ? null : idx;
    };

    const form = reactive({ name: '', email: '', company: '', tel: '', service: '', desc: '' });
    const formErrors = reactive({});
    const clearFormError = key => {
      if (formErrors[key] !== undefined) delete formErrors[key];
    };
    /** yup@1은 UMD가 없음 → jsDelivr +esm 번들을 동적 import (앱 기동 시 yup 전역 불필요) */
    let contactSchemaPromise = null;
    const getContactSchema = () => {
      if (!contactSchemaPromise) {
        contactSchemaPromise = import('https://cdn.jsdelivr.net/npm/yup@1.4.0/+esm').then(yup => {
          const schema = yup.object({
            name: yup.string().required('담당자명을 입력해주세요').min(2, '담당자명은 최소 2자 이상 입력해주세요'),
            email: yup.string().required('이메일을 입력해주세요').email('유효한 이메일 형식이 아닙니다'),
            company: yup.string().required('회사명을 입력해주세요'),
            desc: yup.string().required('문의 내용을 입력해주세요').min(10, '문의 내용은 최소 10자 이상 입력해주세요'),
          });
          return schema;
        });
      }
      return contactSchemaPromise;
    };
    const submitForm = async () => {
      Object.keys(formErrors).forEach(k => delete formErrors[k]);
      try {
        const contactSchema = await getContactSchema();
        const payload = { name: form.name, email: form.email, company: form.company, desc: form.desc };
        await contactSchema.validate(payload, { abortEarly: false });
        showToast('문의 접수하기 준비중입니다', 'success');
        Object.assign(form, { name: '', email: '', company: '', tel: '', service: '', desc: '' });
      } catch (e) {
        if (e.inner && e.inner.length) {
          e.inner.forEach(err => {
            if (err.path) formErrors[err.path] = err.message;
          });
        } else if (e.path) {
          formErrors[e.path] = e.message;
        }
      }
    };

    const openDemo = p => {
      showAlert(
        '주문 안내',
        p.name + ' 샘플 주문·구성 확인 페이지로 연결됩니다.\n실제 서비스에서는 장바구니·결제로 이어집니다.',
        'info'
      );
    };

    return {
      theme, toggleTheme,
      page, sidebarOpen, mobileOpen, navigate,
      toggleMobile, toggleSidebar, closeMobile,
      toast, showToast,
      alertState, showAlert, closeAlert,
      confirmState, showConfirm, closeConfirm,
      products, selectedProduct, selectProduct,
      activeProductCat, productCats, filteredProducts, setProductCat,
      openFaq, toggleContactFaq, toggleMainFaq,
      form, formErrors, submitForm, clearFormError,
      openDemo,
      config: window.SITE_CONFIG,
    };
  },

  template: `
<div style="min-height:100vh;display:flex;flex-direction:column;background:var(--bg-base);">

  <app-header
    :page="page"
    :theme="theme"
    :config="config"
    :navigate="navigate"
    :toggle-theme="toggleTheme"
    :toggle-mobile="toggleMobile"
    :toggle-sidebar="toggleSidebar"
  />

  <div style="flex:1;display:flex;overflow:hidden;position:relative;">

    <app-sidebar
      :config="config"
      :page="page"
      :navigate="navigate"
      :sidebar-open="sidebarOpen"
      :toggle-sidebar="toggleSidebar"
      :mobile-open="mobileOpen"
    />

    <div class="sidebar-overlay" :class="{show: mobileOpen}" @click="closeMobile"></div>

    <main style="flex:1;overflow-y:auto;min-width:0;">

      <page-home v-show="page==='home'"
        :navigate="navigate"
        :config="config"
        :products="products"
        :select-product="selectProduct"
        :open-demo="openDemo"
      />

      <page-about v-show="page==='about'" :config="config" />

      <page-solution v-show="page==='solution'" :config="config" :navigate="navigate" />

      <page-products v-show="page==='products'"
        :config="config"
        :product-cats="productCats"
        :active-product-cat="activeProductCat"
        :set-product-cat="setProductCat"
        :filtered-products="filteredProducts"
        :select-product="selectProduct"
        :open-demo="openDemo"
      />

      <page-detail v-show="page==='detail'"
        :navigate="navigate"
        :products="products"
        :selected-product="selectedProduct"
        :select-product="selectProduct"
        :open-demo="openDemo"
      />

      <page-blog v-show="page==='blog'" />

      <page-location v-show="page==='location'" :config="config" />

      <page-contact v-show="page==='contact'"
        :navigate="navigate"
        :config="config"
        :form="form"
        :form-errors="formErrors"
        :submit-form="submitForm"
        :clear-form-error="clearFormError"
        :open-faq="openFaq"
        :toggle-contact-faq="toggleContactFaq"
      />

      <page-faq v-show="page==='faq'"
        :navigate="navigate"
        :config="config"
        :open-faq="openFaq"
        :toggle-main-faq="toggleMainFaq"
      />

    </main>
  </div>

  <app-footer :config="config" />

  <div v-if="toast.show" class="toast-wrap" :class="'toast-'+toast.type">
    <span class="toast-icon">
      <span v-if="toast.type==='success'">✅</span>
      <span v-else-if="toast.type==='error'">❌</span>
      <span v-else-if="toast.type==='warning'">⚠️</span>
      <span v-else>ℹ️</span>
    </span>
    <span class="toast-msg">{{ toast.msg }}</span>
    <button @click="toast.show=false" style="background:none;border:none;cursor:pointer;color:inherit;opacity:0.6;font-size:1rem;padding:0 0 0 8px;flex-shrink:0;">✕</button>
  </div>

  <div v-if="alertState.show" class="modal-overlay" @click.self="closeAlert">
    <div class="modal-box">
      <div class="modal-icon" :class="'icon-'+alertState.type">
        <span v-if="alertState.type==='success'">✅</span>
        <span v-else-if="alertState.type==='error'">❌</span>
        <span v-else-if="alertState.type==='warning'">⚠️</span>
        <span v-else>ℹ️</span>
      </div>
      <div class="modal-title">{{ alertState.title }}</div>
      <div class="modal-msg">{{ alertState.msg }}</div>
      <div class="modal-actions">
        <button class="btn-blue" @click="closeAlert" style="min-width:90px;">확인</button>
      </div>
    </div>
  </div>

  <div v-if="confirmState.show" class="modal-overlay" @click.self="closeConfirm(false)">
    <div class="modal-box">
      <div class="modal-icon" :class="'icon-'+confirmState.type">
        <span v-if="confirmState.type==='success'">✅</span>
        <span v-else-if="confirmState.type==='error'">❌</span>
        <span v-else-if="confirmState.type==='warning'">⚠️</span>
        <span v-else>ℹ️</span>
      </div>
      <div class="modal-title">{{ confirmState.title }}</div>
      <div class="modal-msg">{{ confirmState.msg }}</div>
      <div class="modal-actions">
        <button class="btn-outline" @click="closeConfirm(false)" style="min-width:80px;">취소</button>
        <button class="btn-blue" @click="closeConfirm(true)" style="min-width:80px;">확인</button>
      </div>
    </div>
  </div>

</div>
  `,
}).mount('#app');
(function dismissVueLoading() {
  var el = document.getElementById('vue-app-loading');
  if (!el) return;
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      el.classList.add('vue-app-loading--done');
      el.setAttribute('aria-busy', 'false');
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 450);
    });
  });
})();
