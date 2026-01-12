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



