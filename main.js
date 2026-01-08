/* main.js: 동적 상호작용과 로직을 담당하는 독립된 문서 */

document.addEventListener('DOMContentLoaded', () => {
    const anchorLinks = document.querySelectorAll('.anchor-link');

    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // 향후 분석이나 커스텀 스크롤 로직이 필요할 경우 이곳에 추상화하여 구현
            console.log(`Anchor clicked: ${link.getAttribute('href')}`);
        });
    });
});