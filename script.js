// --------------------------------------------------
// 0. リダイレクト処理 (削除済み)
// --------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.gallery-container');
  const scrollHint = document.getElementById('scroll-hint');

  // デバイス判定用のメディアクエリ (768px以下をスマホと判定)
  const mobileMediaQuery = window.matchMedia('(max-width: 768px)');
  const isMobile = () => mobileMediaQuery.matches;

  // --------------------------------------------------
  // 0.5 iPad用 横向き推奨メッセージ (Portrait時に表示)
  // --------------------------------------------------
  const rotateOverlay = document.createElement('div');
  rotateOverlay.id = 'rotate-overlay';
  rotateOverlay.innerHTML = `
    <div class="rotate-icon">↻</div>
    <p style="font-family: serif; font-size: 1.2rem; line-height: 1.6; margin: 0 0 20px;">
      この展示は横画面での閲覧を推奨します<br>
      <span style="font-size: 0.9rem; opacity: 0.8;">Best viewed in landscape orientation</span>
    </p>
    <button id="close-rotate" style="padding: 8px 20px; background: transparent; border: 1px solid #fff; color: #fff; cursor: pointer; font-family: serif; border-radius: 4px;">
      閉じる / Close
    </button>
  `;
  document.body.appendChild(rotateOverlay);

  document.getElementById('close-rotate').addEventListener('click', () => {
    rotateOverlay.style.display = 'none';
  });

  // --------------------------------------------------
  // 1. 横スクロール機能 (PCのみ)
  // --------------------------------------------------
  if (container) {
    let isScrolling = false; // 連打防止用フラグ

    window.addEventListener('wheel', (evt) => {
      // スマホサイズ、またはCtrlキー(ズーム操作)が押されている場合は、このカスタムスクロールを無効化
      if (isMobile() || evt.ctrlKey) return;

      // 縦スクロール(deltaY)が発生している場合
      if (evt.deltaY !== 0) {
        evt.preventDefault(); // 本来の縦スクロールをキャンセル
        
        // スクロール中なら何もしない（Snap挙動を安定させるため）
        if (isScrolling) return;

        // 次へ進むか戻るか判定 (1画面分スクロール)
        const direction = evt.deltaY > 0 ? 1 : -1;
        container.scrollBy({ left: container.clientWidth * direction, behavior: 'smooth' });
        
        // 連打防止（アニメーション完了まで待機）
        isScrolling = true;
        setTimeout(() => { isScrolling = false; }, 600);
        
        // スクロールヒントを消す
        if (scrollHint) scrollHint.classList.add('fade-out');
      }
    }, { passive: false });
  }

  // --------------------------------------------------
  // 3. スクロールヒントの制御
  // --------------------------------------------------
  if (scrollHint) {
    // スマホの場合は縦スクロール用の矢印に変更
    if (isMobile()) {
      const hintIcon = scrollHint.querySelector('.hint-icon');
      if (hintIcon) {
        hintIcon.textContent = '↑';
        hintIcon.style.animation = 'scrollAnimVertical 1.5s infinite';
        
        const style = document.createElement('style');
        style.innerHTML = `
          @keyframes scrollAnimVertical {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(-30px); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }
    }

    // スクロールしたら消すイベント
    const removeHint = () => scrollHint.classList.add('fade-out');
    
    window.addEventListener('wheel', removeHint);
    window.addEventListener('touchmove', removeHint);
    window.addEventListener('click', removeHint);
    
    // 3秒後に自動で消す
    setTimeout(removeHint, 3000);
  }

  // --------------------------------------------------
  // 4. 画像拡大モーダル
  // --------------------------------------------------
  const modal = document.getElementById('image-modal');
  if (modal) {
    // モーダル内のimgタグを確実に取得
    const modalImg = modal.getElementsByTagName('img')[0];
    const images = document.querySelectorAll('img.clickable-image');

    images.forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        if (modalImg) {
          modalImg.src = img.src;
          modalImg.alt = img.alt; // alt属性もコピー
        }
        modal.style.display = 'flex';
      });
    });

    modal.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  // --------------------------------------------------
  // 5. タブレット・スマホでのUI調整 (ナビボタン等を隠す)
  // --------------------------------------------------
  function handleResponsive() {
    if (isMobile()) { // isMobile()は768px以下でtrueを返す
      // スマホサイズならナビボタンとサムネイルを無効化
      document.querySelectorAll('.thumbnails').forEach(nav => nav.style.display = 'none');
    } else {
      // PCなら表示
      document.querySelectorAll('.thumbnails').forEach(nav => nav.style.display = 'flex');
    }
  }
  
  // 初回実行とリサイズ監視
  handleResponsive();
  mobileMediaQuery.addEventListener('change', handleResponsive);

  // --------------------------------------------------
  // 6. Darkworld (最後のセクション) の演出
  // --------------------------------------------------
  const lightBtn = document.getElementById('lightBtn');
  const contentWrapper = document.getElementById('contentWrapper');
  const fireOverlay = document.getElementById('fireOverlay');

  if (lightBtn && contentWrapper && fireOverlay) {
    lightBtn.addEventListener('click', () => {
      // ボタンを消す
      lightBtn.classList.add('hidden');
      // 明かりを灯す（画像切り替え）
      contentWrapper.classList.add('is-lit');
      // 炎エフェクト開始
      fireOverlay.classList.add('active');

      // 3秒後に遷移
      setTimeout(() => {
        window.location.href = 'monochrome.html';
      }, 3000);
    });
  }

  // 画像読み込みエラー時の自動修正（スペル揺れ対策）
  document.querySelectorAll('.dw-image').forEach(img => {
    img.onerror = function() {
      if (this.dataset.retried) return;
      this.dataset.retried = true;
      if (this.src.includes('akarinasi.png')) {
        this.src = this.src.replace('akarinasi.png', 'akarinashi.png');
      }
    };
  });

  // --------------------------------------------------
  // 7. スクロール検知 (背景アニメーション補助など)
  // --------------------------------------------------
  const THRESHOLD = 20;
  const onScroll = () => {
    const scrolled = window.scrollY > THRESHOLD;
    document.body.classList.toggle('scrolled', scrolled);
  };
  
  window.addEventListener('scroll', onScroll, { passive: true });
  // 初期状態でもチェック
  onScroll();

  // --------------------------------------------------
  // 8. フロアインジケーターの更新 (スマホ用)
  // --------------------------------------------------
  const floorCurrent = document.querySelector('.floor-current');
  const artFrames = document.querySelectorAll('.art-frame');

  if (floorCurrent && artFrames.length > 0) {
    const observerOptions = {
      root: isMobile() ? null : container, // スマホはviewport、PCはcontainer
      threshold: 0.5 // 50%見えたら切り替え
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // ID (art1, mono1...) から数字以外を除去して抽出
          let num = entry.target.id.replace(/[^0-9]/g, '');
          // 数字じゃない場合（darkworld-entranceなど）の処理
          if (isNaN(num) || num === '') {
             // darkworldなどは特定の表記にするか、最後の番号のままにする
             if (entry.target.id === 'darkworld-entrance') num = 'B1'; 
             else num = '??';
          } else {
            // 0埋め (01, 02...)
            num = String(num).padStart(2, '0');
          }
          floorCurrent.textContent = num;
        }
      });
    }, observerOptions);

    artFrames.forEach(frame => observer.observe(frame));
  }

  // --------------------------------------------------
  // 9. コメント（説明文）のタップ展開
  // --------------------------------------------------
  const descriptions = document.querySelectorAll('.art-description');
  descriptions.forEach(desc => {
    desc.addEventListener('click', (e) => {
      // 親要素へのイベント伝播を止める（必要であれば）
      // e.stopPropagation();
      desc.classList.toggle('is-expanded');
    });
  });
});
