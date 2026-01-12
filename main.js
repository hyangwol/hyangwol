/* main.js: 동적 상호작용과 로직을 담당하는 독립된 문서 */

document.addEventListener('DOMContentLoaded', () => {





    // 앵커 링크 로직
    const anchorLinks = document.querySelectorAll('.anchor-link');

    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // 향후 분석이나 커스텀 스크롤 로직이 필요할 경우 이곳에 추상화하여 구현
            console.log(`Anchor clicked: ${link.getAttribute('href')}`);
        });
    });
    



















    // 사이드바(sidebar) 토글(toggle) 로직(logic)
    const btnL1 = document.getElementById('toggle-sidebar-l1');
    const btnL2 = document.getElementById('toggle-sidebar-l2');
    const btnR2 = document.getElementById('toggle-sidebar-r2');

    const sidebarL1 = document.getElementById('sidebar-left-1');
    const sidebarL2 = document.getElementById('sidebar-left-2');
    const sidebarR = document.getElementById('sidebar-right');

    if (btnL1 && sidebarL1) btnL1.addEventListener('click', () => sidebarL1.classList.toggle('active'));
    if (btnL2 && sidebarL2) btnL2.addEventListener('click', () => sidebarL2.classList.toggle('active'));
    if (btnR2 && sidebarR) btnR2.addEventListener('click', () => sidebarR.classList.toggle('active'));














    // 키보드keyboard 단축短縮키key 로직logic
    document.addEventListener('keydown', (e) => {
        // 입력入力 요소要素에서 포커스focus 중일 때는 단축短縮키key 무효화無效化
        const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
        if (isInput) return;

        // 키key 값value을 소문자小文字로 통일統一
        const key = e.key.toLowerCase();

        // Alt 조합組合 또는 단독單獨 키key 입력入力 처리處理
        // else if를 사용하여 Alt+key와 단독單獨 key가 중복重複 실행實行되는 것을 방지防止
        if (e.altKey || true) { // 단독單獨 입력入力도 허용許容하기 위해 항상恒常 진입進入하되 내부內部에서 분기分岐
            switch (key) {
                case 'a': // Alt+A 또는 A
                    btnL1.click();
                    break;
                case 's': // Alt+S 또는 S
                    btnL2.click();
                    break;
                case 'l': // Alt+L 또는 L
                    btnR2.click();
                    break;
            }
        }
    });



















    // 저작권 연도 자동 갱신 (안전하게 DOM 로드 후 실행)
    const yearElement = document.getElementById("current-year");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();            // 시스템의 현재 연도를 'current-year' 아이디를 가진 요소에 출력
    }

















    





    // 다섯 개의 토글버튼 위에 마우스를 올렸을 때 툴팁 띄우는 기능.
    const tooltip = document.getElementById('custom-tooltip');
    const buttons = document.querySelectorAll('[data-tooltip]');

    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', (e) => {
            tooltip.textContent = btn.getAttribute('data-tooltip');
            tooltip.style.display = 'block';

            const gap = 15; // 마우스(mouse)와 툴팁(tooltip) 사이 간격(間隔)
            const tooltipWidth = tooltip.offsetWidth;
            const tooltipHeight = tooltip.offsetHeight;

            // 기존(旣存) 위치(位置) 계산(計算) 및 경계(境界) 체크(check) 로직(logic) 전체(全體)를 아래로 교체(交替)
            let left = e.pageX + gap;
            let top = e.pageY + gap;

            // 오른쪽 경계(境界) 체크(check) (창 너비를 넘으면 왼쪽으로)
            if (left + tooltipWidth > window.innerWidth + window.scrollX) {
                left = e.pageX - tooltipWidth - gap;
            }
            // 왼쪽 경계(境界) 방어(防禦) (0보다 작아지면 0으로 고정)
            if (left < window.scrollX) {
                left = window.scrollX + 5;
            }

            // 아래쪽 경계(境界) 체크(check) (창 높이를 넘으면 위쪽으로)
            if (top + tooltipHeight > window.innerHeight + window.scrollY) {
                top = e.pageY - tooltipHeight - gap;
            }
            // 위쪽 경계(境界) 방어(防禦) (0보다 작아지면 0으로 고정)
            if (top < window.scrollY) {
                top = window.scrollY + 5;
            }

            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
        });


        btn.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
    });




    



});



