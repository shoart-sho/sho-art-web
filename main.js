document.addEventListener('DOMContentLoaded', () => {
  const enterBtn = document.getElementById('enterBtn');
  
  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      // 1. 訪問済みフラグを保存
      localStorage.setItem('visited', 'true');

      // 2. bodyにクラスを追加してアニメーション開始
      document.body.classList.add('is-exiting');

      // 3. CSS変数の時間(--zoom-duration)に合わせてページ遷移
      // 800ms = 0.8秒
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 800);
    });
  }
});