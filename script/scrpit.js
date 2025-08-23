document.addEventListener('DOMContentLoaded', function () {
    // 새로고침 시 위치 복원 방지(선택)
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    // 요소 참조
    const banner = document.getElementById('team-story');
    const textItems = document.querySelectorAll('.text-item');
    const progressFill = document.querySelector('.progress-fill');
    const dots = document.querySelectorAll('.step-dot');
    const currentCounter = document.querySelector('.step-counter .current');
    const totalCounter = document.querySelector('.step-counter .total');

    if (!banner || !textItems.length || !dots.length) return;

    const total = Math.min(textItems.length, dots.length); // 기대값: 4
    let step = 1; // 현재 단계(1~total)

    // 자동 진행 타이머
    const AUTO_MS = 3000;
    let autoTimer = null;
    let inView = false; // 배너 가시 여부

    // 초기 표시 동기화
    if (totalCounter) totalCounter.textContent = String(total).padStart(2, '0');
    setStep(1);

    // 단계 전환
    function setStep(next) {
        const clamped = Math.max(1, Math.min(total, next));
        if (clamped === step) return;

        // 텍스트 아이템 활성화
        textItems.forEach((el, idx) => {
            el.classList.toggle('active', idx + 1 === clamped);
        });

        // 진행 막대 위치
        if (progressFill) {
            progressFill.setAttribute('data-step', String(clamped));
        }

        // 점(active) 갱신
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx + 1 === clamped);
        });

        // 카운터
        if (currentCounter) currentCounter.textContent = String(clamped).padStart(2, '0');

        step = clamped;
    }

    // 자동 진행 제어
    function stopAuto() {
        if (autoTimer) {
            clearTimeout(autoTimer);
            autoTimer = null;
        }
    }

    function scheduleAuto() {
        stopAuto();
        if (!inView || document.hidden) return; // 화면에 보일 때만
        autoTimer = setTimeout(() => {
            const next = step % total + 1; // 1→2→3→4→1 루프
            setStep(next);
            scheduleAuto(); // 다음 예약
        }, AUTO_MS);
    }

    // 점 클릭만으로 단계 변경 + 자동 타이머 리셋
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            setStep(idx + 1);
            scheduleAuto(); // 사용자 조작 후 타이머 재시작
        });
    });

    // 배너 가시성 기반 자동 전환 on/off
    const io = new IntersectionObserver((entries) => {
        inView = !!entries[0]?.isIntersecting;
        if (inView) scheduleAuto();
        else stopAuto();
    }, { threshold: 0.4 });
    io.observe(banner);

    // 탭/창 비활성화 시 일시 정지
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stopAuto();
        else scheduleAuto();
    });

    // 페이지 이탈 전 정리(선택)
    window.addEventListener('beforeunload', stopAuto);
});