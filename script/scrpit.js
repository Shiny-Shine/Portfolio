document.addEventListener('DOMContentLoaded', function () {
    // 항상 맨 위 시작
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    window.addEventListener('pageshow', (e) => { if (e.persisted) window.scrollTo(0, 0); });

    const banner = document.getElementById('team-story');
    const textItems = document.querySelectorAll('.text-item');
    const progressFill = document.querySelector('.progress-fill');
    const dots = document.querySelectorAll('.step-dot');
    const currentCounter = document.querySelector('.step-counter .current');
    if (!banner || !textItems.length) return;

    // 상태
    const total = 4;
    const ANIM_MS = 550;      // 전환 시간 단축
    const WHEEL_STEP = 60;    // 누적 임계치(민감도)
    const SECTION_COOLDOWN = 600;

    let step = 1;
    let locked = false;
    let animating = false;
    let isAligning = false;

    // 휠/터치 누적 및 큐
    let wheelAccum = 0;
    let pendingDir = 0;       // -1/0/1
    let sectionLock = false;  // 섹션 이동 직후 더블 트리거 방지

    // 유틸
    const lockBody = () => {
        if (locked) return;
        locked = true;
        document.body.classList.add('team-story-active');
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';
    };
    const unlockBody = () => {
        if (!locked) return;
        locked = false;
        document.body.classList.remove('team-story-active');
        document.body.style.overflow = 'auto';
        document.body.style.height = 'auto';
    };
    const alignToBanner = () => {
        if (isAligning) return;
        isAligning = true;
        banner.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => { isAligning = false; }, 400);
    };
    const isNearBanner = () => {
        const r = banner.getBoundingClientRect();
        const vh = window.innerHeight;
        // 배너가 화면 중앙을 일부라도 덮으면 근접으로 간주
        return r.top < vh * 0.6 && r.bottom > vh * 0.4;
    };

    // UI 갱신
    function setStep(next) {
        if (animating || next === step || next < 1 || next > total) return;
        animating = true;

        textItems.forEach((el, idx) => el.classList.toggle('active', idx + 1 === next));
        if (progressFill) progressFill.setAttribute('data-step', String(next));
        dots.forEach((d, idx) => d.classList.toggle('active', idx + 1 === next));
        if (currentCounter) currentCounter.textContent = String(next).padStart(2, '0');

        step = next;
        setTimeout(() => {
            animating = false;
            // 애니메이션 중 들어온 입력 1회 처리
            if (pendingDir !== 0) {
                const dir = pendingDir;
                pendingDir = 0;
                if (dir > 0) {
                    if (step < total) setStep(step + 1);
                    else goNextSection();
                } else {
                    if (step > 1) setStep(step - 1);
                    else goPrevSection();
                }
            }
        }, ANIM_MS);
    }

    // 다음/이전 섹션 이동
    function goNextSection() {
        if (sectionLock) return;
        sectionLock = true;
        unlockBody();
        const next = banner.nextElementSibling;
        if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => { sectionLock = false; }, SECTION_COOLDOWN);
    }
    function goPrevSection() {
        if (sectionLock) return;
        sectionLock = true;
        unlockBody();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => { sectionLock = false; }, SECTION_COOLDOWN);
    }

    // 휠 제어
    function onWheel(e) {
        if (!locked) {
            // 배너 근처에서 지나치려 하면 붙잡고 정렬
            if (isNearBanner()) {
                e.preventDefault();
                lockBody();
                alignToBanner();
                wheelAccum = 0;
            }
            return;
        }

        // 잠금 상태
        e.preventDefault();

        // 누적
        wheelAccum += e.deltaY;

        // 애니메이션 중이면 방향 1회 큐
        if (animating) {
            if (Math.abs(wheelAccum) >= WHEEL_STEP && pendingDir === 0) {
                pendingDir = wheelAccum > 0 ? 1 : -1;
                wheelAccum = 0;
            }
            return;
        }

        // 임계 넘으면 누적 기준, 아니면 이번 이벤트 방향 사용
        let dir = 0;
        if (Math.abs(wheelAccum) >= WHEEL_STEP) {
            dir = wheelAccum > 0 ? 1 : -1;
            wheelAccum = 0;
        } else {
            dir = e.deltaY > 0 ? 1 : -1;
        }

        if (dir > 0) {
            // 아래로
            if (step < total) setStep(step + 1);
            else goNextSection(); // 4단계 다음 스크롤에만 이동
        } else {
            // 위로
            if (step > 1) setStep(step - 1);
            else goPrevSection();
        }
    }

    // 터치 제어(모바일)
    let touchStartY = 0;
    function onTouchStart(e) { touchStartY = e.touches[0].clientY; }
    function onTouchMove(e) {
        if (!locked) {
            if (isNearBanner()) {
                e.preventDefault();
                lockBody();
                alignToBanner();
                wheelAccum = 0;
            }
            return;
        }

        const deltaY = touchStartY - e.touches[0].clientY;
        if (Math.abs(deltaY) < 50) return;

        if (animating) {
            // 터치도 애니메이션 중 방향 1회 큐 처리
            pendingDir = deltaY > 0 ? 1 : -1;
            touchStartY = e.touches[0].clientY;
            return;
        }

        e.preventDefault();
        if (deltaY > 0) {
            if (step < total) setStep(step + 1);
            else goNextSection();
        } else {
            if (step > 1) setStep(step - 1);
            else goPrevSection();
        }
        touchStartY = e.touches[0].clientY;
    }

    // 키보드
    function onKey(e) {
        if (!locked) return;

        // 키 입력은 큐 처리 없이 즉시 반영(반응성)
        if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            if (animating) { pendingDir = 1; return; }
            if (step < total) setStep(step + 1);
            else goNextSection();
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            if (animating) { pendingDir = -1; return; }
            if (step > 1) setStep(step - 1);
            else goPrevSection();
        }
    }

    // 점 클릭
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            if (!locked) { lockBody(); alignToBanner(); }
            pendingDir = 0;
            wheelAccum = 0;
            setStep(idx + 1);
        });
    });

    // 배너 진입 감지: 보이면 잠그고 정렬
    const io = new IntersectionObserver((entries) => {
        const e = entries[0];
        if (e.isIntersecting) {
            lockBody();
            // 첫 진입/재진입 시 근접 정렬
            if (Math.abs(banner.getBoundingClientRect().top) > 8) alignToBanner();
        }
    }, { threshold: 0.6 });
    io.observe(banner);

    // 리스너
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    banner.addEventListener('touchstart', onTouchStart, { passive: false });
    banner.addEventListener('touchmove', onTouchMove, { passive: false });

    // 초기화
    setStep(1);
});