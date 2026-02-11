   
   if (!localStorage.getItem('visited')) {
  window.location.href = 'intro.html';
}

   
   // DOMの読み込みを待ってから実行（念のため）
    document.addEventListener('DOMContentLoaded', () => {
      
      // 要素の取得
      const lightBtn = document.getElementById('lightBtn');
      const contentWrapper = document.getElementById('contentWrapper');
      const fireOverlay = document.getElementById('fireOverlay');

      // ボタンクリック時のイベントリスナー
      lightBtn.addEventListener('click', () => {
        
        // 1. ボタンをフェードアウトさせて消す
        lightBtn.classList.add('hidden');

        // 2. コンテンツラッパーにクラスを追加
        //    -> これによりCSSの brightness が変化し、画像がクロスフェードする
        contentWrapper.classList.add('is-lit');

        // 3. 炎のエフェクト（画面端のゆらぎ）を開始
        fireOverlay.classList.add('active');

        // ログ出力（デバッグ用）
        console.log('Darkworld: 明かりが灯されました。');

        // 3秒後にmonochrome.htmlへ遷移（演出が終わるのを待ってから移動）
        setTimeout(() => {
          window.location.href = 'monochrome.html';
        }, 3000);
      });

      // 画像読み込みエラー時の自動修正（スペル揺れ対策）
      document.querySelectorAll('.dw-image').forEach(img => {
        img.onerror = function() {
          // 無限ループ防止
          if (this.dataset.retried) return;
          this.dataset.retried = true;
          
          // akarinasi (si) でエラーなら akarinashi (shi) を試す
          if (this.src.includes('akarinasi.png')) {
            console.log('Retrying with akarinashi.png');
            this.src = this.src.replace('akarinasi.png', 'akarinashi.png');
          }
        };
      });
    });

  // 即時関数でスコープを限定（変数がグローバルを汚染しないようにする）
  (function () {
    const THRESHOLD = 20; // スクロール検知の閾値（ピクセル）。この値以上スクロールするとエフェクトが発動
    
    // スクロールイベント発生時に実行される関数
    const onScroll = () => {
      const scrolled = window.scrollY > THRESHOLD;
      // bodyタグに 'scrolled' クラスを付け外しする（CSSのアニメーション制御用）
      document.body.classList.toggle('scrolled', scrolled);
    };
    
    // スクロール時とページ読み込み完了時に onScroll を実行
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('load', onScroll);

    // --- PCでの縦ホイール -> 横スクロール変換 ---
    const galleryContainer = document.querySelector('.gallery-container');
    if (galleryContainer) {
      galleryContainer.addEventListener('wheel', (evt) => {
        // スマホレイアウト（縦スクロール）のときは何もしない
        if (window.innerWidth <= 768) return;

        // 縦スクロール(deltaY)が発生している場合
        if (evt.deltaY !== 0) {
          evt.preventDefault();
          galleryContainer.scrollLeft += evt.deltaY * 2.5;
        }
      }, { passive: false });
    }

    // --- スクロールヒントの制御 ---
    const scrollHint = document.getElementById('scroll-hint');
    if (scrollHint) {
      // スマホ（縦）かPC（横）かでヒントのアニメーションを変える
      const hintIcon = scrollHint.querySelector('.hint-icon');
      if (window.innerWidth <= 768) {
        // スマホ: 縦スクロールのヒント（上へスワイプ）
        hintIcon.textContent = '↑';
        hintIcon.style.animation = 'scrollAnimVertical 1.5s infinite';
        // 縦アニメーションの定義を動的に追加
        const style = document.createElement('style');
        style.innerHTML = `
          @keyframes scrollAnimVertical {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(-30px); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      // ユーザーがアクションしたらヒントを消す
      const removeHint = () => {
        scrollHint.classList.add('fade-out');
        setTimeout(() => { scrollHint.style.display = 'none'; }, 500);
        window.removeEventListener('wheel', removeHint);
        window.removeEventListener('touchstart', removeHint);
        window.removeEventListener('click', removeHint);
      };

      window.addEventListener('wheel', removeHint);
      window.addEventListener('touchstart', removeHint);
      window.addEventListener('click', removeHint);
      // 3秒後にも自動で消す
      setTimeout(removeHint, 3000);
    }

    // --- 画像拡大機能 ---
    const modal = document.getElementById('image-modal');
    const modalImg = modal.querySelector('img');
    // ギャラリー内のすべての画像を対象にする
    const images = document.querySelectorAll('img.clickable-image');

    images.forEach(img => {
      img.style.cursor = 'pointer'; // クリックできることを示すカーソル
      img.addEventListener('click', (e) => {
        e.stopPropagation(); // イベントのバブリング防止
        modalImg.src = img.src; // クリックされた画像のパスをモーダルに設定
        modal.style.display = 'flex'; // モーダルを表示
      });
    });
    // モーダル（背景）をクリックしたら閉じる
    modal.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  })();

  