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








    // 네 개의 토글버튼 위에 마우스를 올렸을 때 툴팁 띄우는 기능.
    const tooltip = document.getElementById('custom-tooltip');
    const buttons = document.querySelectorAll('[data-tooltip]');

    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', (e) => {
            tooltip.textContent = btn.getAttribute('data-tooltip');
            tooltip.style.display = 'block';
            tooltip.style.left = e.pageX + 10 + 'px';
            tooltip.style.top = e.pageY + 10 + 'px';
        });

        btn.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
    });





});



