   
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

    // --- 画像拡大機能 ---
    const modal = document.getElementById('image-modal');
    const modalImg = modal.querySelector('img');
    // ギャラリー内のすべての画像を対象にする
    const images = document.querySelectorAll('.art-image img.clickable-image');

    images.forEach(img => {
      // 画像の上に透明なオーバーレイがあるため、オーバーレイにクリックイベントを設定する
      const overlay = img.nextElementSibling;
      if (overlay) {
        overlay.style.cursor = 'pointer'; // クリックできることを示すカーソル
        overlay.addEventListener('click', (e) => {
          e.stopPropagation(); // イベントのバブリング防止
          modalImg.src = img.src; // クリックされた画像のパスをモーダルに設定
          modal.style.display = 'flex'; // モーダルを表示
        });
      }
    });
    // モーダル（背景）をクリックしたら閉じる
    modal.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  })();

  